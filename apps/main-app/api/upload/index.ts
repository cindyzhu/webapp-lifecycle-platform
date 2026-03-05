import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';
import { ok, err } from '../_lib/respond';
import { handleOptions } from '../_lib/cors';
import JSZip from 'jszip';

const BUCKET = 'sub-app-assets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') return handleOptions(res);

  if (req.method !== 'POST') return err(res, 'Method not allowed', 405);

  const { app_id, environment, version, file } = req.body as {
    app_id: string;
    environment: string;
    version: string;
    file: string; // base64-encoded zip
  };

  if (!app_id || !environment || !version || !file) {
    return err(res, 'Missing required fields: app_id, environment, version, file', 400);
  }

  // Look up the app
  const { data: app, error: appErr } = await supabase
    .from('apps')
    .select('name')
    .eq('id', app_id)
    .single();
  if (appErr || !app) return err(res, 'App not found', 404);

  // Decode and unzip
  const zipBuffer = Buffer.from(file, 'base64');
  const zip = await JSZip.loadAsync(zipBuffer);

  // Find the common prefix (e.g., "dist/") so we strip it
  const entries = Object.keys(zip.files).filter((f) => !zip.files[f].dir);
  const prefix = findCommonPrefix(entries);

  // Upload each file to Supabase Storage
  const basePath = `${app.name}/${version}`;
  const uploadErrors: string[] = [];

  for (const filePath of entries) {
    const content = await zip.files[filePath].async('nodebuffer');
    const storagePath = `${basePath}/${filePath.slice(prefix.length)}`;
    const contentType = guessContentType(filePath);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, content, {
        contentType,
        upsert: true,
      });

    if (uploadErr) uploadErrors.push(`${filePath}: ${uploadErr.message}`);
  }

  if (uploadErrors.length > 0) {
    return err(res, `Upload errors: ${uploadErrors.join('; ')}`, 500);
  }

  // Get public URL for the index.html
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${basePath}/index.html`);

  const publicUrl = urlData.publicUrl.replace('/index.html', '');

  // Update the app's entry URL for the target environment
  const entryField = `entry_${environment}`;
  const { error: updateErr } = await supabase
    .from('apps')
    .update({ [entryField]: publicUrl })
    .eq('id', app_id);

  if (updateErr) return err(res, updateErr.message);

  // Record deployment
  await supabase.from('deployments').insert({
    app_id,
    environment,
    version,
    url: publicUrl,
    status: 'success',
    deployed_by: 'upload',
    notes: `Uploaded via management platform`,
  });

  return ok(res, { url: publicUrl, files: entries.length }, 201);
}

function findCommonPrefix(paths: string[]): string {
  if (paths.length === 0) return '';
  const parts = paths[0].split('/');
  let prefix = '';
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = prefix + parts[i] + '/';
    if (paths.every((p) => p.startsWith(candidate))) {
      prefix = candidate;
    } else {
      break;
    }
  }
  return prefix;
}

function guessContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const types: Record<string, string> = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    mjs: 'application/javascript',
    json: 'application/json',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    map: 'application/json',
  };
  return types[ext || ''] || 'application/octet-stream';
}
