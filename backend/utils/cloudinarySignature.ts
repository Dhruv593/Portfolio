import { createHash } from 'node:crypto';

export function signCloudinaryUpload(params: Record<string, string | number>, secret: string): string {
  const input = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return createHash('sha1').update(`${input}${secret}`).digest('hex');
}
