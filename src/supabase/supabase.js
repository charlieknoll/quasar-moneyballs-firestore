import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabaseConfig.js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  supabaseConfig.supabaseUrl,
  supabaseConfig.supabaseKey
);

export { supabase };
