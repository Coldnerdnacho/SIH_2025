import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dewciwutdbifmmdchjlu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRld2Npd3V0ZGJpZm1tZGNoamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTA5MjAsImV4cCI6MjA3MjgyNjkyMH0.2M7KKEf4sxcJDQ-ASm2be8ASRwxM9ZGADxsiCIKfoqs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);