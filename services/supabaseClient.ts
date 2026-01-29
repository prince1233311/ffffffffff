
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzqjfnbnhimljbehvdjq.supabase.co';
const supabaseAnonKey = 'sb_publishable_lG_g_7y3EHd20PLOwux5NQ_l-gwleaD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
