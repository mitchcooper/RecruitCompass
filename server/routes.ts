import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertLeaderSchema,
  insertTypeSchema,
  insertPointsSchema,
  insertRecruitSchema,
  insertUserSchema,
  insertUserProfileSchema,
} from "@shared/schema";
import { z } from "zod";
import { supabase } from "./db";
import { authMiddleware, type AuthenticatedRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to check Supabase configuration
  app.get("/api/debug/supabase", async (req, res) => {
    try {
      const config = {
        supabaseUrl: process.env.SUPABASE_WEB,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5000',
        nodeEnv: process.env.NODE_ENV
      };
      
      console.log("Supabase config:", config);
      res.json({ config });
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({ error: "Debug failed" });
    }
  });

  // Auth endpoints
  app.post("/api/auth/magic-link", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log("Attempting to send magic link to:", email);
      console.log("Supabase URL:", process.env.SUPABASE_WEB);
      console.log("Frontend URL:", process.env.FRONTEND_URL || 'http://localhost:5000');

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/auth/callback`,
        },
      });

      if (error) {
        console.error("Magic link error:", error);
        return res.status(400).json({ 
          error: "Failed to send magic link", 
          details: error.message,
          code: error.status 
        });
      }

      console.log("Magic link sent successfully");
      res.json({ message: "Magic link sent to your email" });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token, type } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type || 'email',
      });

      if (error) {
        console.error("Token verification error:", error);
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      res.json({ 
        user: data.user,
        session: data.session,
        message: "Authentication successful" 
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/session", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      res.json({ 
        user: req.user,
        message: "Session valid" 
      });
    } catch (error) {
      console.error("Session check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await supabase.auth.signOut({ token });
      }
      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error("Sign out error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Leaders endpoints
  app.get("/api/leaders", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const leaders = await storage.getAllLeaders();
      res.json(leaders);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      res.status(500).json({ error: "Failed to fetch leaders" });
    }
  });

  app.get("/api/leaders/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const leader = await storage.getLeader(req.params.id);
      if (!leader) {
        return res.status(404).json({ error: "Leader not found" });
      }
      res.json(leader);
    } catch (error) {
      console.error("Error fetching leader:", error);
      res.status(500).json({ error: "Failed to fetch leader" });
    }
  });

  app.post("/api/leaders", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertLeaderSchema.parse(req.body);
      const leader = await storage.createLeader(data);
      res.status(201).json(leader);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating leader:", error);
      res.status(500).json({ error: "Failed to create leader" });
    }
  });

  app.patch("/api/leaders/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertLeaderSchema.partial().parse(req.body);
      const leader = await storage.updateLeader(req.params.id, data);
      if (!leader) {
        return res.status(404).json({ error: "Leader not found" });
      }
      res.json(leader);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating leader:", error);
      res.status(500).json({ error: "Failed to update leader" });
    }
  });

  app.delete("/api/leaders/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteLeader(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Leader not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting leader:", error);
      res.status(500).json({ error: "Failed to delete leader" });
    }
  });

  // Types endpoints
  app.get("/api/types", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const types = await storage.getAllTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching types:", error);
      res.status(500).json({ error: "Failed to fetch types" });
    }
  });

  app.post("/api/types", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertTypeSchema.parse(req.body);
      const type = await storage.createType(data);
      res.status(201).json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating type:", error);
      res.status(500).json({ error: "Failed to create type" });
    }
  });

  app.patch("/api/types/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertTypeSchema.partial().parse(req.body);
      const type = await storage.updateType(req.params.id, data);
      if (!type) {
        return res.status(404).json({ error: "Type not found" });
      }
      res.json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating type:", error);
      res.status(500).json({ error: "Failed to update type" });
    }
  });

  app.delete("/api/types/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteType(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Type not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting type:", error);
      res.status(500).json({ error: "Failed to delete type" });
    }
  });

  // Points endpoints
  app.get("/api/points", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const typesWithPoints = await storage.getAllTypesWithPoints();
      res.json(typesWithPoints);
    } catch (error) {
      console.error("Error fetching points:", error);
      res.status(500).json({ error: "Failed to fetch points" });
    }
  });

  app.post("/api/points", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertPointsSchema.parse(req.body);
      const points = await storage.upsertPoints(data);
      res.status(200).json(points);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating points:", error);
      res.status(500).json({ error: "Failed to update points" });
    }
  });

  // Recruits endpoints
  app.get("/api/recruits", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const filters: any = {};
      
      if (req.query.status && req.query.status !== 'all') {
        filters.status = req.query.status as string;
      }
      if (req.query.leaderId && req.query.leaderId !== 'all') {
        filters.leaderId = req.query.leaderId as string;
      }
      if (req.query.dateFrom) {
        filters.dateFrom = new Date(req.query.dateFrom as string);
      }
      if (req.query.dateTo) {
        filters.dateTo = new Date(req.query.dateTo as string);
      }

      const recruits = await storage.getAllRecruits(filters);
      res.json(recruits);
    } catch (error) {
      console.error("Error fetching recruits:", error);
      res.status(500).json({ error: "Failed to fetch recruits" });
    }
  });

  app.get("/api/recruits/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const recruit = await storage.getRecruit(req.params.id);
      if (!recruit) {
        return res.status(404).json({ error: "Recruit not found" });
      }
      res.json(recruit);
    } catch (error) {
      console.error("Error fetching recruit:", error);
      res.status(500).json({ error: "Failed to fetch recruit" });
    }
  });

  app.post("/api/recruits", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const data = insertRecruitSchema.parse(req.body);
      const recruitData = {
        ...data,
        date: new Date(data.date),
      };
      const recruit = await storage.createRecruit(recruitData);
      res.status(201).json(recruit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating recruit:", error);
      res.status(500).json({ error: "Failed to create recruit" });
    }
  });

  app.patch("/api/recruits/:id/status", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { status } = req.body;
      if (!status || (status !== 'Submitted' && status !== 'Confirmed')) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const recruit = await storage.updateRecruitStatus(req.params.id, status);
      if (!recruit) {
        return res.status(404).json({ error: "Recruit not found" });
      }
      res.json(recruit);
    } catch (error) {
      console.error("Error updating recruit status:", error);
      res.status(500).json({ error: "Failed to update recruit status" });
    }
  });

  app.delete("/api/recruits/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteRecruit(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Recruit not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting recruit:", error);
      res.status(500).json({ error: "Failed to delete recruit" });
    }
  });

  // Scorecard endpoint
  app.get("/api/scorecard", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;

      if (req.query.dateFrom) {
        dateFrom = new Date(req.query.dateFrom as string);
      }
      if (req.query.dateTo) {
        dateTo = new Date(req.query.dateTo as string);
      }

      const leaderStats = await storage.getLeaderStats(dateFrom, dateTo);
      res.json(leaderStats);
    } catch (error) {
      console.error("Error fetching scorecard:", error);
      res.status(500).json({ error: "Failed to fetch scorecard" });
    }
  });

  // Scorecard summary endpoint
  app.get("/api/scorecard/summary", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;

      if (req.query.dateFrom) {
        dateFrom = new Date(req.query.dateFrom as string);
      }
      if (req.query.dateTo) {
        dateTo = new Date(req.query.dateTo as string);
      }

      const summary = await storage.getScorecardSummary(dateFrom, dateTo);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching scorecard summary:", error);
      res.status(500).json({ error: "Failed to fetch scorecard summary" });
    }
  });

  // Users endpoints
  app.get("/api/users", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Create profile if name is provided
      if (req.body.name) {
        const profileData = insertUserProfileSchema.parse({
          userId: user.id,
          name: req.body.name,
        });
        await storage.createUserProfile(profileData);
      }
      
      const fullUser = await storage.getAllUsers();
      const createdUser = fullUser.find(u => u.id === user.id);
      res.status(201).json(createdUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, userData);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Update profile if name is provided
      if (req.body.name) {
        await storage.updateUserProfile(req.params.id, { name: req.body.name });
      }
      
      const fullUsers = await storage.getAllUsers();
      const updatedUser = fullUsers.find(u => u.id === req.params.id);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const competitionStart = await storage.getSetting('competition_start');
      const competitionEnd = await storage.getSetting('competition_end');

      res.json({
        competitionStart: competitionStart?.value || null,
        competitionEnd: competitionEnd?.value || null,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { competitionStart, competitionEnd } = req.body;

      if (competitionStart) {
        await storage.upsertSetting('competition_start', competitionStart);
      }
      if (competitionEnd) {
        await storage.upsertSetting('competition_end', competitionEnd);
      }

      const updatedStart = await storage.getSetting('competition_start');
      const updatedEnd = await storage.getSetting('competition_end');

      res.json({
        competitionStart: updatedStart?.value || null,
        competitionEnd: updatedEnd?.value || null,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // User Profiles endpoints
  app.get("/api/user-profiles", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('display_name');

      if (error) throw error;
      res.json(profiles || []);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      res.status(500).json({ error: "Failed to fetch user profiles" });
    }
  });

  app.patch("/api/user-profiles/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(profile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  app.post("/api/user-profiles/:id/modules", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { module } = req.body;
      if (!module) {
        return res.status(400).json({ error: "Module is required" });
      }

      // Get current modules and add the new one
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('modules')
        .eq('id', req.params.id)
        .single();

      if (fetchError) throw fetchError;

      const currentModules = currentProfile.modules || [];
      if (currentModules.includes(module)) {
        return res.status(400).json({ error: "Module already exists" });
      }

      const updatedModules = [...currentModules, module];

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({ modules: updatedModules })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(profile);
    } catch (error) {
      console.error("Error adding module to user:", error);
      res.status(500).json({ error: "Failed to add module to user" });
    }
  });

  app.delete("/api/user-profiles/:id/modules", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { module } = req.body;
      if (!module) {
        return res.status(400).json({ error: "Module is required" });
      }

      // Get current modules and remove the specified one
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('modules')
        .eq('id', req.params.id)
        .single();

      if (fetchError) throw fetchError;

      const currentModules = currentProfile.modules || [];
      const updatedModules = currentModules.filter(m => m !== module);

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({ modules: updatedModules })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(profile);
    } catch (error) {
      console.error("Error removing module from user:", error);
      res.status(500).json({ error: "Failed to remove module from user" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
