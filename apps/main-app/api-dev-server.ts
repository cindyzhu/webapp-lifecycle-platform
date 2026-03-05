/**
 * Local API dev server — runs Vercel-style serverless functions locally.
 * Usage: npx tsx api-dev-server.ts
 */
import http from 'http';
import { parse } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.resolve(import.meta.dirname, '.env.local') });

const PORT = 3001;

// Route map
const routes = [
  { pattern: /^\/api\/apps\/([^/]+)$/, file: './api/apps/[id]' },
  { pattern: /^\/api\/apps\/?$/, file: './api/apps/index' },
  { pattern: /^\/api\/deployments\/?$/, file: './api/deployments/index' },
  { pattern: /^\/api\/environments\/([^/]+)$/, file: './api/environments/[id]' },
  { pattern: /^\/api\/environments\/?$/, file: './api/environments/index' },
  { pattern: /^\/api\/upload\/?$/, file: './api/upload/index' },
  { pattern: /^\/api\/webhooks\/vercel\/?$/, file: './api/webhooks/vercel' },
];

const server = http.createServer(async (req, res) => {
  const parsed = parse(req.url!, true);
  const pathname = parsed.pathname!;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match) {
      // Build query with path params
      const query: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.query || {})) {
        if (typeof v === 'string') query[k] = v;
      }
      if (match[1]) query.id = match[1];

      // Parse body (up to 50MB for zip uploads)
      let body: unknown = undefined;
      if (req.method === 'POST' || req.method === 'PUT') {
        body = await new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          let size = 0;
          const MAX = 50 * 1024 * 1024;
          req.on('data', (chunk: Buffer) => {
            size += chunk.length;
            if (size > MAX) { reject(new Error('Body too large')); return; }
            chunks.push(chunk);
          });
          req.on('end', () => {
            const data = Buffer.concat(chunks).toString();
            try { resolve(JSON.parse(data)); }
            catch { resolve(data); }
          });
        });
      }

      // Mock VercelRequest
      const vercelReq = { method: req.method, query, body, headers: req.headers };

      // Mock VercelResponse — supports chaining like res.status(200).json(...)
      const headerMap: Record<string, string> = {};
      let statusCode = 200;
      let ended = false;

      const vercelRes: any = {
        status(code: number) { statusCode = code; return vercelRes; },
        setHeader(k: string, v: string) { headerMap[k] = v; return vercelRes; },
        json(data: unknown) {
          if (ended) return vercelRes;
          ended = true;
          const payload = JSON.stringify(data);
          res.writeHead(statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            ...headerMap,
          });
          res.end(payload);
          return vercelRes;
        },
        end() {
          if (ended) return vercelRes;
          ended = true;
          res.writeHead(statusCode, {
            'Access-Control-Allow-Origin': '*',
            ...headerMap,
          });
          res.end();
          return vercelRes;
        },
      };

      try {
        const mod = await import(route.file);
        const handler = mod.default;
        await handler(vercelReq, vercelRes);
      } catch (err: any) {
        console.error('Handler error:', err);
        if (!ended) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ data: null, error: err.message }));
        }
      }
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: null, error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`API dev server running at http://localhost:${PORT}`);
});
