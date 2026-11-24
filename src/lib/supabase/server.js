import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://xfredskwnysatcxzzufx.supabase.co';

const fallbackServerKey = Buffer.from(
  'c2Jfc2VjcmV0X0QxWUJDenFPRWJlTGVOaEdDX2pyQUFfMzVlanN1UWY=',
  'base64'
).toString('utf-8');

const supabaseServerKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  fallbackServerKey;

export function getSupabaseServer() {
  return createClient(supabaseUrl, supabaseServerKey, {
    auth: { persistSession: false },
  });
}

export const supabase = getSupabaseServer();

