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

export async function registerRoutes(app: Express): Promise<Server> {
  // Leaders endpoints
  app.get("/api/leaders", async (req, res) => {
    try {
      const leaders = await storage.getAllLeaders();
      res.json(leaders);
    } catch (error) {
      console.error("Error fetching leaders:", error);
      res.status(500).json({ error: "Failed to fetch leaders" });
    }
  });

  app.get("/api/leaders/:id", async (req, res) => {
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

  app.post("/api/leaders", async (req, res) => {
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

  app.patch("/api/leaders/:id", async (req, res) => {
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

  app.delete("/api/leaders/:id", async (req, res) => {
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
  app.get("/api/types", async (req, res) => {
    try {
      const types = await storage.getAllTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching types:", error);
      res.status(500).json({ error: "Failed to fetch types" });
    }
  });

  app.post("/api/types", async (req, res) => {
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

  app.patch("/api/types/:id", async (req, res) => {
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

  app.delete("/api/types/:id", async (req, res) => {
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
  app.get("/api/points", async (req, res) => {
    try {
      const typesWithPoints = await storage.getAllTypesWithPoints();
      res.json(typesWithPoints);
    } catch (error) {
      console.error("Error fetching points:", error);
      res.status(500).json({ error: "Failed to fetch points" });
    }
  });

  app.post("/api/points", async (req, res) => {
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
  app.get("/api/recruits", async (req, res) => {
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

  app.get("/api/recruits/:id", async (req, res) => {
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

  app.post("/api/recruits", async (req, res) => {
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

  app.patch("/api/recruits/:id/status", async (req, res) => {
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

  app.delete("/api/recruits/:id", async (req, res) => {
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
  app.get("/api/scorecard", async (req, res) => {
    try {
      let weekStart: Date | undefined;
      if (req.query.weekStart) {
        weekStart = new Date(req.query.weekStart as string);
      }
      const leaderStats = await storage.getLeaderStats(weekStart);
      res.json(leaderStats);
    } catch (error) {
      console.error("Error fetching scorecard:", error);
      res.status(500).json({ error: "Failed to fetch scorecard" });
    }
  });

  // Users endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
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

  app.patch("/api/users/:id", async (req, res) => {
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

  app.delete("/api/users/:id", async (req, res) => {
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

  // Seed endpoint - for initial data setup
  app.post("/api/seed", async (req, res) => {
    try {
      // Check if types already exist
      const existingTypes = await storage.getAllTypes();
      if (existingTypes.length > 0) {
        return res.status(200).json({ message: "Data already seeded" });
      }

      // Create types
      const papers = await storage.createType({ name: "Papers" });
      const newStarter = await storage.createType({ name: "New Starter" });
      const established = await storage.createType({ name: "Established" });

      // Create points
      await storage.upsertPoints({ typeId: papers.id, points: 2 });
      await storage.upsertPoints({ typeId: newStarter.id, points: 10 });
      await storage.upsertPoints({ typeId: established.id, points: 20 });

      // Create sample leaders
      await storage.createLeader({ name: "Sarah Johnson", isActive: true });
      await storage.createLeader({ name: "Michael Chen", isActive: true });
      await storage.createLeader({ name: "Emma Williams", isActive: true });
      await storage.createLeader({ name: "David Brown", isActive: true });
      await storage.createLeader({ name: "Lisa Anderson", isActive: true });

      res.status(201).json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
