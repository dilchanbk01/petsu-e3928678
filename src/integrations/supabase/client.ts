
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://noeafkffcahectigleaj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vZWFma2ZmY2FoZWN0aWdsZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjIyODIsImV4cCI6MjA1NTc5ODI4Mn0.9XsB9dfT6qXZYqqZVutL-bWVWtMDd8HU1kdbbSOBb7Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
