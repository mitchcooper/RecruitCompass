import {
  users,
  userProfiles,
  recruiterLeaders,
  recruiterTypes,
  recruiterPoints,
  recruiterRecruits,
  type User,
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Leader,
  type InsertLeader,
  type RecruiterType,
  type InsertType,
  type Points,
  type InsertPoints,
  type Recruit,
  type InsertRecruit,
  type RecruitWithRelations,
  type TypeWithPoints,
  type LeaderWithStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<Array<User & { profile: UserProfile | null }>>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // User Profiles
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Leaders
  getAllLeaders(): Promise<Leader[]>;
  getLeader(id: string): Promise<Leader | undefined>;
  createLeader(leader: InsertLeader): Promise<Leader>;
  updateLeader(id: string, data: Partial<InsertLeader>): Promise<Leader | undefined>;
  deleteLeader(id: string): Promise<boolean>;

  // Types
  getAllTypes(): Promise<RecruiterType[]>;
  getType(id: string): Promise<RecruiterType | undefined>;
  createType(type: InsertType): Promise<RecruiterType>;
  updateType(id: string, data: Partial<InsertType>): Promise<RecruiterType | undefined>;
  deleteType(id: string): Promise<boolean>;

  // Points
  getAllTypesWithPoints(): Promise<TypeWithPoints[]>;
  getPointsForType(typeId: string): Promise<Points | undefined>;
  upsertPoints(data: InsertPoints): Promise<Points>;

  // Recruits
  getAllRecruits(filters?: {
    status?: string;
    leaderId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<RecruitWithRelations[]>;
  getRecruit(id: string): Promise<RecruitWithRelations | undefined>;
  createRecruit(recruit: InsertRecruit): Promise<Recruit>;
  updateRecruitStatus(id: string, status: string): Promise<Recruit | undefined>;
  deleteRecruit(id: string): Promise<boolean>;

  // Scorecard
  getLeaderStats(weekStart?: Date): Promise<LeaderWithStats[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<Array<User & { profile: UserProfile | null }>> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId));

    return result.map((row) => ({
      ...row.users,
      profile: row.user_profiles,
    }));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // User Profiles
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [userProfile] = await db.insert(userProfiles).values(profile).returning();
    return userProfile;
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  // Leaders
  async getAllLeaders(): Promise<Leader[]> {
    return await db.select().from(recruiterLeaders).orderBy(recruiterLeaders.name);
  }

  async getLeader(id: string): Promise<Leader | undefined> {
    const [leader] = await db.select().from(recruiterLeaders).where(eq(recruiterLeaders.id, id));
    return leader || undefined;
  }

  async createLeader(leader: InsertLeader): Promise<Leader> {
    const [newLeader] = await db.insert(recruiterLeaders).values(leader).returning();
    return newLeader;
  }

  async updateLeader(id: string, data: Partial<InsertLeader>): Promise<Leader | undefined> {
    const [leader] = await db
      .update(recruiterLeaders)
      .set(data)
      .where(eq(recruiterLeaders.id, id))
      .returning();
    return leader || undefined;
  }

  async deleteLeader(id: string): Promise<boolean> {
    const result = await db.delete(recruiterLeaders).where(eq(recruiterLeaders.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Types
  async getAllTypes(): Promise<RecruiterType[]> {
    return await db.select().from(recruiterTypes).orderBy(recruiterTypes.name);
  }

  async getType(id: string): Promise<RecruiterType | undefined> {
    const [type] = await db.select().from(recruiterTypes).where(eq(recruiterTypes.id, id));
    return type || undefined;
  }

  async createType(type: InsertType): Promise<RecruiterType> {
    const [newType] = await db.insert(recruiterTypes).values(type).returning();
    return newType;
  }

  async updateType(id: string, data: Partial<InsertType>): Promise<RecruiterType | undefined> {
    const [type] = await db
      .update(recruiterTypes)
      .set(data)
      .where(eq(recruiterTypes.id, id))
      .returning();
    return type || undefined;
  }

  async deleteType(id: string): Promise<boolean> {
    const result = await db.delete(recruiterTypes).where(eq(recruiterTypes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Points
  async getAllTypesWithPoints(): Promise<TypeWithPoints[]> {
    const result = await db
      .select()
      .from(recruiterTypes)
      .leftJoin(recruiterPoints, eq(recruiterTypes.id, recruiterPoints.typeId))
      .orderBy(recruiterTypes.name);

    return result.map((row) => ({
      ...row.recruiter_types,
      points: row.recruiter_points,
    }));
  }

  async getPointsForType(typeId: string): Promise<Points | undefined> {
    const [points] = await db
      .select()
      .from(recruiterPoints)
      .where(eq(recruiterPoints.typeId, typeId));
    return points || undefined;
  }

  async upsertPoints(data: InsertPoints): Promise<Points> {
    const existing = await this.getPointsForType(data.typeId);

    if (existing) {
      const [updated] = await db
        .update(recruiterPoints)
        .set({ points: data.points, updatedAt: new Date() })
        .where(eq(recruiterPoints.typeId, data.typeId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(recruiterPoints).values(data).returning();
      return created;
    }
  }

  // Recruits
  async getAllRecruits(filters?: {
    status?: string;
    leaderId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<RecruitWithRelations[]> {
    let query = db
      .select()
      .from(recruiterRecruits)
      .leftJoin(recruiterLeaders, eq(recruiterRecruits.leaderId, recruiterLeaders.id))
      .leftJoin(recruiterTypes, eq(recruiterRecruits.typeId, recruiterTypes.id))
      .orderBy(desc(recruiterRecruits.createdAt));

    const conditions = [];
    if (filters?.status && filters.status !== 'all') {
      conditions.push(eq(recruiterRecruits.status, filters.status));
    }
    if (filters?.leaderId && filters.leaderId !== 'all') {
      conditions.push(eq(recruiterRecruits.leaderId, filters.leaderId));
    }
    if (filters?.dateFrom) {
      conditions.push(gte(recruiterRecruits.date, filters.dateFrom));
    }
    if (filters?.dateTo) {
      conditions.push(lte(recruiterRecruits.date, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query;

    return result.map((row) => ({
      ...row.recruiter_recruits,
      leader: row.recruiter_leaders!,
      type: row.recruiter_types!,
    }));
  }

  async getRecruit(id: string): Promise<RecruitWithRelations | undefined> {
    const result = await db
      .select()
      .from(recruiterRecruits)
      .leftJoin(recruiterLeaders, eq(recruiterRecruits.leaderId, recruiterLeaders.id))
      .leftJoin(recruiterTypes, eq(recruiterRecruits.typeId, recruiterTypes.id))
      .where(eq(recruiterRecruits.id, id));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.recruiter_recruits,
      leader: row.recruiter_leaders!,
      type: row.recruiter_types!,
    };
  }

  async createRecruit(recruit: InsertRecruit): Promise<Recruit> {
    const [newRecruit] = await db.insert(recruiterRecruits).values(recruit).returning();
    return newRecruit;
  }

  async updateRecruitStatus(id: string, status: string): Promise<Recruit | undefined> {
    const [recruit] = await db
      .update(recruiterRecruits)
      .set({ status, updatedAt: new Date() })
      .where(eq(recruiterRecruits.id, id))
      .returning();
    return recruit || undefined;
  }

  async deleteRecruit(id: string): Promise<boolean> {
    const result = await db.delete(recruiterRecruits).where(eq(recruiterRecruits.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Scorecard
  async getLeaderStats(weekStart?: Date): Promise<LeaderWithStats[]> {
    const leaders = await this.getAllLeaders();
    const typesWithPoints = await this.getAllTypesWithPoints();

    const pointsMap = new Map<string, number>();
    typesWithPoints.forEach((type) => {
      if (type.points) {
        pointsMap.set(type.id, type.points.points);
      }
    });

    const leaderStatsPromises = leaders.map(async (leader) => {
      // Get all confirmed recruits for this leader
      const allRecruits = await db
        .select()
        .from(recruiterRecruits)
        .where(
          and(
            eq(recruiterRecruits.leaderId, leader.id),
            eq(recruiterRecruits.status, 'Confirmed')
          )
        );

      // Calculate total points
      const totalPoints = allRecruits.reduce((sum, recruit) => {
        const points = pointsMap.get(recruit.typeId) || 0;
        return sum + points;
      }, 0);

      // Calculate weekly points if weekStart provided
      let weeklyPoints = 0;
      if (weekStart) {
        const weeklyRecruits = allRecruits.filter(
          (recruit) => new Date(recruit.date) >= weekStart
        );
        weeklyPoints = weeklyRecruits.reduce((sum, recruit) => {
          const points = pointsMap.get(recruit.typeId) || 0;
          return sum + points;
        }, 0);
      }

      return {
        ...leader,
        totalPoints,
        recruitsCount: allRecruits.length,
        weeklyPoints,
      };
    });

    const leaderStats = await Promise.all(leaderStatsPromises);

    // Sort by total points descending
    return leaderStats.sort((a, b) => b.totalPoints - a.totalPoints);
  }
}

export const storage = new DatabaseStorage();
