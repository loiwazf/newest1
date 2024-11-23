import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txjhncekxtgdqcifinii.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amhuY2VreHRnZHFjaWZpbmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNDA4MTksImV4cCI6MjA0NzkxNjgxOX0.IV8FSJSUfQ5S7A6rEBrSGxHfLJy6Y7qwkSxbhhxXFIQ';

export const supabase = createClient(supabaseUrl, supabaseKey);