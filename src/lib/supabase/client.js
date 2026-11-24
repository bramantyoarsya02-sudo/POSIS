import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xfredskwnysatcxzzufx.supabase.co';
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_eyuWXvBfjG7j2CzOcYPhWQ_I8jM2bBJ';

export const supabaseClient = createClient(supabaseUrl, supabasePublishableKey);

