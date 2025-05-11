import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcsfjlgdfvsyblcocucm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjc2ZqbGdkZnZzeWJsY29jdWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTQ5MzgsImV4cCI6MjA2MjQ3MDkzOH0.9OT_0RCH_OusPEpeVXSRHg7Mf3dMZ0Tl5YKdLhu1fmw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 