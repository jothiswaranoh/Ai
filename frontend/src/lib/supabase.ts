import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
const temp = createClient(supabaseUrl, supabaseAnonKey);
console.log(temp)
export const supabase = temp

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'operator' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Bill = {
  id: string;
  bill_number: string;
  farmer_name: string;
  archs: string;
  time_duration: string;
  bill_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: User;
};
