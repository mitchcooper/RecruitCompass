import {
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
  type ScorecardSummary,
  type Settings,
  type InsertSettings,
} from "@shared/schema";
import { supabase } from "./db";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByAuthId(authUserId: string): Promise<User | undefined>;
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
  getLeaderStats(dateFrom?: Date, dateTo?: Date): Promise<LeaderWithStats[]>;
  getScorecardSummary(dateFrom?: Date, dateTo?: Date): Promise<ScorecardSummary>;

  // Settings
  getSetting(key: string): Promise<Settings | undefined>;
  upsertSetting(key: string, value: string): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || undefined;
  }

  async getUserByAuthId(authUserId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAllUsers(): Promise<Array<User & { profile: UserProfile | null }>> {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `);

    if (usersError) throw usersError;

    return (users || []).map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: Array.isArray(user.profile) ? user.profile[0] || null : user.profile || null
    }));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const { data: user, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return user || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // User Profiles
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserProfile(userId: string, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('user_id', userId)
      .select()
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return profile || undefined;
  }

  // Leaders
  async getAllLeaders(): Promise<Leader[]> {
    const { data, error } = await supabase
      .from('recruiter_leaders')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getLeader(id: string): Promise<Leader | undefined> {
    const { data, error } = await supabase
      .from('recruiter_leaders')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async createLeader(leader: InsertLeader): Promise<Leader> {
    const { data, error } = await supabase
      .from('recruiter_leaders')
      .insert(leader)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLeader(id: string, data: Partial<InsertLeader>): Promise<Leader | undefined> {
    const { data: leader, error } = await supabase
      .from('recruiter_leaders')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return leader || undefined;
  }

  async deleteLeader(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('recruiter_leaders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Types
  async getAllTypes(): Promise<RecruiterType[]> {
    const { data, error } = await supabase
      .from('recruiter_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getType(id: string): Promise<RecruiterType | undefined> {
    const { data, error } = await supabase
      .from('recruiter_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async createType(type: InsertType): Promise<RecruiterType> {
    const { data, error } = await supabase
      .from('recruiter_types')
      .insert(type)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateType(id: string, data: Partial<InsertType>): Promise<RecruiterType | undefined> {
    const { data: type, error } = await supabase
      .from('recruiter_types')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return type || undefined;
  }

  async deleteType(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('recruiter_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Points
  async getAllTypesWithPoints(): Promise<TypeWithPoints[]> {
    const { data: types, error } = await supabase
      .from('recruiter_types')
      .select(`
        *,
        points:recruiter_points(*)
      `)
      .order('name');

    if (error) throw error;

    return (types || []).map(type => ({
      id: type.id,
      name: type.name,
      createdAt: type.created_at,
      points: Array.isArray(type.points) ? type.points[0] || null : type.points || null
    }));
  }

  async getPointsForType(typeId: string): Promise<Points | undefined> {
    const { data, error } = await supabase
      .from('recruiter_points')
      .select('*')
      .eq('type_id', typeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async upsertPoints(data: InsertPoints): Promise<Points> {
    const existing = await this.getPointsForType(data.typeId);

    if (existing) {
      const { data: updated, error } = await supabase
        .from('recruiter_points')
        .update({ points: data.points, updated_at: new Date().toISOString() })
        .eq('type_id', data.typeId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from('recruiter_points')
        .insert({ type_id: data.typeId, points: data.points })
        .select()
        .single();

      if (error) throw error;
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
    let query = supabase
      .from('recruiter_recruits')
      .select(`
        *,
        leader:recruiter_leaders(*),
        type:recruiter_types(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.leaderId && filters.leaderId !== 'all') {
      query = query.eq('leader_id', filters.leaderId);
    }
    if (filters?.dateFrom) {
      query = query.gte('date', filters.dateFrom.toISOString());
    }
    if (filters?.dateTo) {
      query = query.lte('date', filters.dateTo.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      leaderId: row.leader_id,
      typeId: row.type_id,
      date: row.date,
      mobile: row.mobile,
      email: row.email,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      leader: Array.isArray(row.leader) ? row.leader[0] : row.leader,
      type: Array.isArray(row.type) ? row.type[0] : row.type,
    }));
  }

  async getRecruit(id: string): Promise<RecruitWithRelations | undefined> {
    const { data, error } = await supabase
      .from('recruiter_recruits')
      .select(`
        *,
        leader:recruiter_leaders(*),
        type:recruiter_types(*)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return undefined;

    return {
      id: data.id,
      name: data.name,
      leaderId: data.leader_id,
      typeId: data.type_id,
      date: data.date,
      mobile: data.mobile,
      email: data.email,
      notes: data.notes,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      leader: Array.isArray(data.leader) ? data.leader[0] : data.leader,
      type: Array.isArray(data.type) ? data.type[0] : data.type,
    };
  }

  async createRecruit(recruit: InsertRecruit): Promise<Recruit> {
    const recruitData = {
      name: recruit.name,
      leader_id: recruit.leaderId,
      type_id: recruit.typeId,
      date: typeof recruit.date === 'string' ? recruit.date : recruit.date.toISOString(),
      mobile: recruit.mobile,
      email: recruit.email,
      notes: recruit.notes,
      status: recruit.status || 'Submitted',
    };

    const { data, error } = await supabase
      .from('recruiter_recruits')
      .insert(recruitData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRecruitStatus(id: string, status: string): Promise<Recruit | undefined> {
    const { data, error } = await supabase
      .from('recruiter_recruits')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data || undefined;
  }

  async deleteRecruit(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('recruiter_recruits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Scorecard
  async getLeaderStats(dateFrom?: Date, dateTo?: Date): Promise<LeaderWithStats[]> {
    const leaders = await this.getAllLeaders();
    const typesWithPoints = await this.getAllTypesWithPoints();

    // Create maps for points and type names
    const pointsMap = new Map<string, number>();
    const typeNameMap = new Map<string, string>();
    typesWithPoints.forEach((type) => {
      if (type.points) {
        pointsMap.set(type.id, type.points.points);
      }
      typeNameMap.set(type.id, type.name);
    });

    // Calculate previous period for rank comparison
    let prevDateFrom: Date | undefined;
    let prevDateTo: Date | undefined;
    if (dateFrom && dateTo) {
      const periodLength = dateTo.getTime() - dateFrom.getTime();
      prevDateTo = new Date(dateFrom.getTime() - 1); // day before current period starts
      prevDateFrom = new Date(prevDateTo.getTime() - periodLength);
    }

    const leaderStatsPromises = leaders.map(async (leader) => {
      // Get all confirmed recruits for this leader
      const { data: allRecruits, error } = await supabase
        .from('recruiter_recruits')
        .select('*')
        .eq('leader_id', leader.id)
        .eq('status', 'Confirmed');

      if (error) throw error;

      const recruits = allRecruits || [];

      // Calculate all-time totals for each type
      let totalPaperPoints = 0;
      let totalNewStarterPoints = 0;
      let totalEstablishedPoints = 0;

      recruits.forEach((recruit) => {
        const points = pointsMap.get(recruit.type_id) || 0;
        const typeName = typeNameMap.get(recruit.type_id);

        if (typeName === 'Papers') {
          totalPaperPoints += points;
        } else if (typeName === 'New Starter') {
          totalNewStarterPoints += points;
        } else if (typeName === 'Established') {
          totalEstablishedPoints += points;
        }
      });

      // Calculate total points (all time)
      const totalPoints = totalPaperPoints + totalNewStarterPoints + totalEstablishedPoints;

      // Filter recruits for current period
      let periodRecruits = recruits;
      if (dateFrom || dateTo) {
        periodRecruits = recruits.filter((recruit) => {
          const recruitDate = new Date(recruit.date);
          if (dateFrom && recruitDate < dateFrom) return false;
          if (dateTo && recruitDate > dateTo) return false;
          return true;
        });
      }

      // Calculate period points (this week)
      const thisWeekPoints = periodRecruits.reduce((sum, recruit) => {
        return sum + (pointsMap.get(recruit.type_id) || 0);
      }, 0);

      // Count recruits in current period
      const periodRecruitsCount = periodRecruits.length;

      return {
        ...leader,
        totalPoints,
        recruitsCount: recruits.length,
        thisWeekPoints,
        periodRecruits: periodRecruitsCount,
        paperPoints: totalPaperPoints,
        newStarterPoints: totalNewStarterPoints,
        establishedPoints: totalEstablishedPoints,
        rankChange: 0, // Will be calculated after sorting
        previousRank: undefined as number | undefined,
      };
    });

    const leaderStats = await Promise.all(leaderStatsPromises);

    // Sort by total points descending to get current rankings
    const currentRankings = [...leaderStats].sort((a, b) => b.totalPoints - a.totalPoints);

    // Calculate previous period rankings if we have a previous period
    if (prevDateFrom && prevDateTo) {
      const prevStatsPromises = leaders.map(async (leader) => {
        const { data: prevRecruits, error } = await supabase
          .from('recruiter_recruits')
          .select('*')
          .eq('leader_id', leader.id)
          .eq('status', 'Confirmed')
          .gte('date', prevDateFrom.toISOString())
          .lte('date', prevDateTo.toISOString());

        if (error) throw error;

        const recruits = prevRecruits || [];
        const prevPoints = recruits.reduce((sum, recruit) => {
          return sum + (pointsMap.get(recruit.type_id) || 0);
        }, 0);

        return { leaderId: leader.id, prevPoints };
      });

      const prevStats = await Promise.all(prevStatsPromises);
      const prevRankings = [...prevStats].sort((a, b) => b.prevPoints - a.prevPoints);

      // Create a map of previous rankings
      const prevRankMap = new Map<string, number>();
      prevRankings.forEach((stat, index) => {
        prevRankMap.set(stat.leaderId, index + 1);
      });

      // Update current rankings with rank change information
      currentRankings.forEach((leader, index) => {
        const currentRank = index + 1;
        const previousRank = prevRankMap.get(leader.id);

        if (previousRank !== undefined) {
          leader.previousRank = previousRank;
          leader.rankChange = previousRank - currentRank; // positive = moved up
        }
      });
    }

    return currentRankings;
  }

  async getScorecardSummary(dateFrom?: Date, dateTo?: Date): Promise<ScorecardSummary> {
    const typesWithPoints = await this.getAllTypesWithPoints();
    
    // Create points map
    const pointsMap = new Map<string, number>();
    typesWithPoints.forEach((type) => {
      if (type.points) {
        pointsMap.set(type.id, type.points.points);
      }
    });

    // Calculate previous period for comparison
    let prevDateFrom: Date | undefined;
    let prevDateTo: Date | undefined;
    if (dateFrom && dateTo) {
      const periodLength = dateTo.getTime() - dateFrom.getTime();
      prevDateTo = new Date(dateFrom.getTime() - 1); // day before current period starts
      prevDateFrom = new Date(prevDateTo.getTime() - periodLength);
    }

    // Get all confirmed recruits for current period
    let currentRecruitsQuery = supabase
      .from('recruiter_recruits')
      .select('*')
      .eq('status', 'Confirmed');

    if (dateFrom) {
      currentRecruitsQuery = currentRecruitsQuery.gte('date', dateFrom.toISOString());
    }
    if (dateTo) {
      currentRecruitsQuery = currentRecruitsQuery.lte('date', dateTo.toISOString());
    }

    const { data: currentRecruits, error: currentError } = await currentRecruitsQuery;
    if (currentError) throw currentError;

    // Calculate current period totals
    const totalCompetitionScore = (currentRecruits || []).reduce((sum, recruit) => {
      return sum + (pointsMap.get(recruit.type_id) || 0);
    }, 0);

    const totalRecruits = (currentRecruits || []).length;

    // Calculate previous period totals if we have a previous period
    let totalCompetitionScoreChange = 0;
    let totalRecruitsChange = 0;

    if (prevDateFrom && prevDateTo) {
      const { data: prevRecruits, error: prevError } = await supabase
        .from('recruiter_recruits')
        .select('*')
        .eq('status', 'Confirmed')
        .gte('date', prevDateFrom.toISOString())
        .lte('date', prevDateTo.toISOString());

      if (prevError) throw prevError;

      const prevTotalScore = (prevRecruits || []).reduce((sum, recruit) => {
        return sum + (pointsMap.get(recruit.type_id) || 0);
      }, 0);

      const prevTotalRecruits = (prevRecruits || []).length;

      totalCompetitionScoreChange = totalCompetitionScore - prevTotalScore;
      totalRecruitsChange = totalRecruits - prevTotalRecruits;
    }

    return {
      totalCompetitionScore,
      totalCompetitionScoreChange,
      totalRecruits,
      totalRecruitsChange,
      periodStart: dateFrom || new Date(0),
      periodEnd: dateTo || new Date(),
      previousPeriodStart: prevDateFrom,
      previousPeriodEnd: prevDateTo,
    };
  }

  // Settings
  async getSetting(key: string): Promise<Settings | undefined> {
    const { data, error } = await supabase
      .from('recruiter_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || undefined;
  }

  async upsertSetting(key: string, value: string): Promise<Settings> {
    const existing = await this.getSetting(key);

    if (existing) {
      const { data, error } = await supabase
        .from('recruiter_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('recruiter_settings')
        .insert({ key, value })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
}

export const storage = new DatabaseStorage();
