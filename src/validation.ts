import config from '../wedding.json';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function city(value: unknown): string {
  if (typeof value !== 'string' || !config.events.some(event => value === event.slug || value === event.slug.toUpperCase())) throw new HttpError(400, 'Invalid event.');
  return value;
}

export const audience = (route: string): 'friends' | 'parents' => route === route.toUpperCase() ? 'parents' : 'friends';

export function cursor(value: string | null): number {
  if (value === null) return Number.MAX_SAFE_INTEGER;
  if (!/^[1-9]\d{0,15}$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new HttpError(400, 'Invalid cursor.');
  }
  return Number(value);
}

function text(value: unknown, maximum: number, label: string): string {
  if (typeof value !== 'string') throw new HttpError(400, `${label} is required.`);
  const clean = value.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
  if ([...clean].length < 2 || [...clean].length > maximum) {
    throw new HttpError(400, `${label} must contain 2 to ${maximum} characters.`);
  }
  return clean;
}

export function submission(value: unknown) {
  if (!value || typeof value !== 'object') throw new HttpError(400, 'Invalid data.');
  const body = value as Record<string, unknown>;
  if (typeof body.website === 'string' && body.website.trim()) throw new HttpError(400, 'Invalid data.');
  if (typeof body.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId)) {
    throw new HttpError(400, 'Invalid submission ID.');
  }
  const route = city(body.city);
  return { city: route.toLowerCase(), audience: audience(route), name: text(body.name, 80, 'Name'), message: text(body.message, 1000, 'Wish'), requestId: body.requestId };
}

export async function jsonBody(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new HttpError(415, 'Use application/json.');
  }
  if (Number(request.headers.get('content-length')) > 8192) throw new HttpError(413, 'Request too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Data is required.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      throw new HttpError(413, 'Request too large.');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new HttpError(400, 'Invalid JSON.'); }
}

export function sameOrigin(request: Request): void {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    throw new HttpError(403, 'Request origin is not allowed.');
  }
}

export async function tokenMatches(actual: string, expected: string): Promise<boolean> {
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  const [left, right] = await Promise.all([digest(actual), digest(expected)]);
  let different = 0;
  for (let i = 0; i < left.length; i++) different |= left[i] ^ right[i];
  return different === 0;
}
