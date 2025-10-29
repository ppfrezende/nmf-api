import { FastifyRequest } from 'fastify';
import { createHash } from 'crypto';

export const uaHash = (ua?: string) =>
  createHash('sha256')
    .update(ua ?? '')
    .digest('base64url');

export function clientIp(req: FastifyRequest) {
  const xf = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
  return xf || (req.ip as string) || null;
}
