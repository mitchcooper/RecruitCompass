import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (shared, no prefix)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default('hr'),
  authUserId: varchar("auth_user_id").unique(), // Links to Supabase auth.users.id
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leaders table
export const recruiterLeaders = pgTable("recruiter_leaders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recruitment types table
export const recruiterTypes = pgTable("recruiter_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Points allocation table
export const recruiterPoints = pgTable("recruiter_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  typeId: varchar("type_id").references(() => recruiterTypes.id, { onDelete: 'cascade' }).notNull().unique(),
  points: integer("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Recruit status enum
export const recruitStatusEnum = pgEnum("recruit_status", ["Submitted", "Confirmed"]);

// Recruits table
export const recruiterRecruits = pgTable("recruiter_recruits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  leaderId: varchar("leader_id").references(() => recruiterLeaders.id, { onDelete: 'cascade' }).notNull(),
  typeId: varchar("type_id").references(() => recruiterTypes.id, { onDelete: 'cascade' }).notNull(),
  date: timestamp("date").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("Submitted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Settings table for competition configuration
export const recruiterSettings = pgTable("recruiter_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const recruiterLeadersRelations = relations(recruiterLeaders, ({ many }) => ({
  recruits: many(recruiterRecruits),
}));

export const recruiterTypesRelations = relations(recruiterTypes, ({ one, many }) => ({
  points: one(recruiterPoints, {
    fields: [recruiterTypes.id],
    references: [recruiterPoints.typeId],
  }),
  recruits: many(recruiterRecruits),
}));

export const recruiterPointsRelations = relations(recruiterPoints, ({ one }) => ({
  type: one(recruiterTypes, {
    fields: [recruiterPoints.typeId],
    references: [recruiterTypes.id],
  }),
}));

export const recruiterRecruitsRelations = relations(recruiterRecruits, ({ one }) => ({
  leader: one(recruiterLeaders, {
    fields: [recruiterRecruits.leaderId],
    references: [recruiterLeaders.id],
  }),
  type: one(recruiterTypes, {
    fields: [recruiterRecruits.typeId],
    references: [recruiterTypes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
}).extend({
  authUserId: z.string().optional(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertLeaderSchema = createInsertSchema(recruiterLeaders).omit({
  id: true,
  createdAt: true,
});

export const insertTypeSchema = createInsertSchema(recruiterTypes).omit({
  id: true,
  createdAt: true,
});

export const insertPointsSchema = createInsertSchema(recruiterPoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRecruitSchema = createInsertSchema(recruiterRecruits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.string().or(z.date()),
  mobile: z.string().min(1, "Mobile is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

export const insertSettingsSchema = createInsertSchema(recruiterSettings).omit({
  id: true,
  updatedAt: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Leader = typeof recruiterLeaders.$inferSelect;
export type InsertLeader = z.infer<typeof insertLeaderSchema>;

export type RecruiterType = typeof recruiterTypes.$inferSelect;
export type InsertType = z.infer<typeof insertTypeSchema>;

export type Points = typeof recruiterPoints.$inferSelect;
export type InsertPoints = z.infer<typeof insertPointsSchema>;

export type Recruit = typeof recruiterRecruits.$inferSelect;
export type InsertRecruit = z.infer<typeof insertRecruitSchema>;

export type Settings = typeof recruiterSettings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Extended types with relations for frontend
export type RecruitWithRelations = Recruit & {
  leader: Leader;
  type: RecruiterType;
};

export type TypeWithPoints = RecruiterType & {
  points: Points | null;
};

export type LeaderWithStats = Leader & {
  totalPoints: number;
  recruitsCount: number;
  thisWeekPoints: number; // points in the filtered period
  periodRecruits: number; // recruits in the current period
  paperPoints: number;
  newStarterPoints: number;
  establishedPoints: number;
  rankChange: number; // positive = moved up, negative = moved down, 0 = no change
  previousRank?: number;
};

export type ScorecardSummary = {
  totalCompetitionScore: number;
  totalCompetitionScoreChange: number;
  totalRecruits: number;
  totalRecruitsChange: number;
  periodStart: Date;
  periodEnd: Date;
  previousPeriodStart?: Date;
  previousPeriodEnd?: Date;
};
