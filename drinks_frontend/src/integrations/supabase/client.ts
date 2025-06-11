
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xnghsontedmmqtkuatmi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZ2hzb250ZWRtbXF0a3VhdG1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjQxODIsImV4cCI6MjA2NDk0MDE4Mn0.sMSo6R59txkipENklQp9CixHRWoO4MGZuvKRi1Rr7wE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
