import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { ok, err } from '../_lib/respond';
import { handleOptions } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return handleOptions(res);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return err(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'POST') {
    const body = req.body;
    const { data, error } = await supabase
      .from('apps')
      .insert(body)
      .select()
      .single();
    if (error) return err(res, error.message);
    return ok(res, data, 201);
  }

  return err(res, 'Method not allowed', 405);
}
