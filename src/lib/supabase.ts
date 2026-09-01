import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Cliente padrão para ações públicas (respeita as regras do RLS no banco)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente Admin para rotas de API seguras (ignora as regras do RLS no banco)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
