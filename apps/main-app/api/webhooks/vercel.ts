import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { ok, err } from '../_lib/respond';
import { handleOptions } from '../_lib/cors';

// Branch → environment mapping
const BRANCH_ENV_MAP: Record<string, string> = {
  develop: 'test',
  staging: 'staging',
  main: 'production',
  master: 'production',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return handleOptions(res);

  if (req.method !== 'POST') return err(res, 'Method not allowed', 405);

  const { app_name, environment, version, url, deployed_by, branch } = req.body as {
    app_name?: string;
    environment?: string;
    version?: string;
    url?: string;
    deployed_by?: string;
    branch?: string;
  };

  if (!app_name || !url) {
    return err(res, 'Missing required fields: app_name, url', 400);
  }

  // Resolve environment from explicit value or branch name
  const env = environment || (branch ? BRANCH_ENV_MAP[branch] : undefined);
  if (!env) {
    return err(res, 'Cannot determine environment. Provide environment or branch.', 400);
  }

  // Find the app by name
  const { data: app, error: appErr } = await supabase
    .from('apps')
    .select('id')
    .eq('name', app_name)
    .single();

  if (appErr || !app) {
    return err(res, `App not found: ${app_name}`, 404);
  }

  // Update the entry URL for the target environment
  const entryField = `entry_${env}`;
  const { error: updateErr } = await supabase
    .from('apps')
    .update({ [entryField]: url })
    .eq('id', app.id);

  if (updateErr) return err(res, updateErr.message);

  // Record deployment
  const { data: deployment, error: deployErr } = await supabase
    .from('deployments')
    .insert({
      app_id: app.id,
      environment: env,
      version: version || 'unknown',
      url,
      status: 'success',
      deployed_by: deployed_by || 'vercel',
      notes: `Auto-deployed via ${branch ? `branch ${branch}` : 'webhook'}`,
    })
    .select()
    .single();

  if (deployErr) return err(res, deployErr.message);

  return ok(res, deployment, 201);
}
