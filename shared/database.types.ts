// Supabase Database Types
// This file will be auto-generated when we run: supabase gen types typescript
// For now, using a minimal type definition that works with our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      recruiter_leaders: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      recruiter_types: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      recruiter_points: {
        Row: {
          id: string
          type_id: string
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type_id: string
          points: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type_id?: string
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      recruiter_recruits: {
        Row: {
          id: string
          name: string
          leader_id: string
          type_id: string
          date: string
          mobile: string
          email: string
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          leader_id: string
          type_id: string
          date: string
          mobile: string
          email: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          leader_id?: string
          type_id?: string
          date?: string
          mobile?: string
          email?: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      recruiter_settings: {
        Row: {
          id: string
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
