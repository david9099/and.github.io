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
      reservations: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          date: string
          special_requests: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          date: string
          special_requests?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          date?: string
          special_requests?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          username: string
          password_hash: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
        }
      }
    }
  }
}