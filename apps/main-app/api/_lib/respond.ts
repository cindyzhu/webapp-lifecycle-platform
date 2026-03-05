import type { VercelResponse } from '@vercel/node';
import { setCors } from './cors';

export function ok<T>(res: VercelResponse, data: T, status = 200) {
  setCors(res);
  return res.status(status).json({ data, error: null });
}

export function err(res: VercelResponse, message: string, status = 500) {
  setCors(res);
  return res.status(status).json({ data: null, error: message });
}
