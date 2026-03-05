import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { ok, err } from '../_lib/respond';
import { handleOptions } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return handleOptions(res);

  const { id } = req.query as { id: string };

  if (req.method === 'PUT') {
    const body = req.body;
    const { data, error } = await supabase
      .from('environments')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) return err(res, error.message);
    return ok(res, data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('environments').delete().eq('id', id);
    if (error) return err(res, error.message);
    return ok(res, null);
  }

  return err(res, 'Method not allowed', 405);
}
