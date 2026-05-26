// Healthify Supabase database types
// Regenerate with: npx supabase gen types typescript --project-id <id> > lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          whatsapp_number: string;
          name: string | null;
          email: string | null;
          otp_verified: boolean;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          whatsapp_number: string;
          name?: string | null;
          email?: string | null;
          otp_verified?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          whatsapp_number?: string;
          name?: string | null;
          email?: string | null;
          otp_verified?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      otp_tokens: {
        Row: {
          id: string;
          whatsapp_number: string;
          otp_hash: string;
          expires_at: string;
          used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          whatsapp_number: string;
          otp_hash: string;
          expires_at: string;
          used?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          whatsapp_number?: string;
          otp_hash?: string;
          expires_at?: string;
          used?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          keywords: string[];
          category: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          keywords?: string[];
          category?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          keywords?: string[];
          category?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      bookings: {
        Row: {
          id: string;
          user_id: string;
          service_name: string;
          booking_date: string;
          booking_time: string;
          payment_amount: number;
          razorpay_payment_id: string | null;
          payment_status: "pending" | "completed" | "failed";
          owner_notified: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_name: string;
          booking_date: string;
          booking_time: string;
          payment_amount?: number;
          razorpay_payment_id?: string | null;
          payment_status?: "pending" | "completed" | "failed";
          owner_notified?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_name?: string;
          booking_date?: string;
          booking_time?: string;
          payment_amount?: number;
          razorpay_payment_id?: string | null;
          payment_status?: "pending" | "completed" | "failed";
          owner_notified?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      appointments: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string | null;
          whatsapp_number: string | null;
          email: string | null;
          preferred_branch: string | null;
          message: string | null;
          whatsapp_link_sent: boolean;
          owner_response_status: "pending" | "confirmed" | "declined";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          whatsapp_number?: string | null;
          email?: string | null;
          preferred_branch?: string | null;
          message?: string | null;
          whatsapp_link_sent?: boolean;
          owner_response_status?: "pending" | "confirmed" | "declined";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string | null;
          whatsapp_number?: string | null;
          email?: string | null;
          preferred_branch?: string | null;
          message?: string | null;
          whatsapp_link_sent?: boolean;
          owner_response_status?: "pending" | "confirmed" | "declined";
          created_at?: string;
        };
        Relationships: [];
      };

      payments: {
        Row: {
          id: string;
          booking_id: string | null;
          user_id: string;
          razorpay_payment_id: string;
          amount: number;
          status: "captured" | "failed" | "authorized" | "refunded";
          method: "upi" | "card" | "netbanking" | "wallet";
          owner_notified: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          user_id: string;
          razorpay_payment_id: string;
          amount: number;
          status?: "captured" | "failed" | "authorized" | "refunded";
          method?: "upi" | "card" | "netbanking" | "wallet";
          owner_notified?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string | null;
          user_id?: string;
          razorpay_payment_id?: string;
          amount?: number;
          status?: "captured" | "failed" | "authorized" | "refunded";
          method?: "upi" | "card" | "netbanking" | "wallet";
          owner_notified?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };

    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
