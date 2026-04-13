// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabaseTypes.ts

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          theme: "light" | "dark";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          theme?: "light" | "dark";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          theme?: "light" | "dark";
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          emoji: string;
          priority: "low" | "medium" | "high";
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          emoji?: string;
          priority?: "low" | "medium" | "high";
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          emoji?: string;
          priority?: "low" | "medium" | "high";
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      leisure_activities: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          emoji: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          emoji?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          emoji?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          coins: number;
          skip_cost: number;
          last_skip_date: string | null;
          spin_history: string[];
          task_consecutive_count: number;
          leisure_consecutive_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coins?: number;
          skip_cost?: number;
          last_skip_date?: string | null;
          spin_history?: string[];
          task_consecutive_count?: number;
          leisure_consecutive_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          coins?: number;
          skip_cost?: number;
          last_skip_date?: string | null;
          spin_history?: string[];
          task_consecutive_count?: number;
          leisure_consecutive_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      active_timers: {
        Row: {
          id: string;
          user_id: string;
          result: string;
          is_task: boolean;
          task_priority: string | null;
          start_time: number;
          duration: number;
          source: "spin" | "roll";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          result: string;
          is_task: boolean;
          task_priority?: string | null;
          start_time: number;
          duration: number;
          source: "spin" | "roll";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          result?: string;
          is_task?: boolean;
          task_priority?: string | null;
          start_time?: number;
          duration?: number;
          source?: "spin" | "roll";
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};
