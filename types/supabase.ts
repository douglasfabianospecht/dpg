export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      hotels: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      rooms: {
        Row: {
          id: string
          hotel_id: string
          number: string
          type: string
          status: "occupied" | "available" | "cleaning" | "maintenance" | "checkin" | "checkout"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          number: string
          type: string
          status: "occupied" | "available" | "cleaning" | "maintenance" | "checkin" | "checkout"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string
          number?: string
          type?: string
          status?: "occupied" | "available" | "cleaning" | "maintenance" | "checkin" | "checkout"
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          hotel_id: string
          room_id: string
          guest_name: string
          check_in: string
          check_out: string
          status: "confirmed" | "cancelled" | "completed"
          rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          room_id: string
          guest_name: string
          check_in: string
          check_out: string
          status: "confirmed" | "cancelled" | "completed"
          rate: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hotel_id?: string
          room_id?: string
          guest_name?: string
          check_in?: string
          check_out?: string
          status?: "confirmed" | "cancelled" | "completed"
          rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string
          role: "admin" | "manager" | "staff"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          avatar_url?: string
          role?: "admin" | "manager" | "staff"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          avatar_url?: string
          role?: "admin" | "manager" | "staff"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

