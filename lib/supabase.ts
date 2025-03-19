import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uwoinsibcghzlmgslwfq.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3b2luc2liY2doemxtZ3Nsd2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5Mjk2OTcsImV4cCI6MjA1NjUwNTY5N30.gt8mGSxcv6g-WBHoMV-m-zePiAZB3NCVtD0QYS-dmjU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

