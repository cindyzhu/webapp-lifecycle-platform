import type { VercelResponse } from '@vercel/node';

export function handleOptions(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
}

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
}
