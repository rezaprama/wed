export function validateConfig(config) {
  const text = (value, field, max = 200) => {
    if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`${field}: enter 1 to ${max} characters.`);
  };
  const url = (value, field) => {
    try { if (!['https:', 'http:'].includes(new URL(value).protocol)) throw new Error(); }
    catch { throw new Error(`${field}: use a complete https:// URL.`); }
  };
  const media = (value, field) => {
    if (typeof value !== 'string' || !/^\/media\/[a-zA-Z0-9/_ .-]+\.(?:svg|jpe?g|png|webp|avif|mp3|ogg|m4a|wav)$/i.test(value) || value.includes('..')) throw new Error(`${field}: use a local /media/filename path without '..'.`);
  };
  if (!['en', 'id'].includes(config.language)) throw new Error('language: choose "en" or "id".');
  for (const key of ['demo', 'allowIndexing']) if (typeof config[key] !== 'boolean') throw new Error(`${key}: choose true or false.`);
  if (typeof config.guestbook?.enabled !== 'boolean') throw new Error('guestbook.enabled: choose true or false.');
  text(config.couple?.names, 'couple.names', 100);
  media(config.couple.photo, 'couple.photo');
  text(config.couple.hashtag, 'couple.hashtag', 100);
  for (const key of ['first', 'second']) {
    text(config.couple[key]?.name, `couple.${key}.name`, 100);
    text(config.couple[key].family, `couple.${key}.family`);
    media(config.couple[key].photo, `couple.${key}.photo`);
  }
  if (!Array.isArray(config.couple.hosts) || !config.couple.hosts.length || config.couple.hosts.length > 4) throw new Error('couple.hosts: add 1 to 4 host lines.');
  config.couple.hosts.forEach(host => text(host, 'couple.hosts'));
  if (!Array.isArray(config.events) || !config.events.length || config.events.length > 4) throw new Error('events: add 1 to 4 events.');
  const slugs = new Set();
  for (const event of config.events) {
    if (!/^[a-z][a-z0-9-]{0,19}$/.test(event.slug) || ['admin', 'api', 'assets', 'media', 'fonts', 'send', 'parents'].includes(event.slug) || slugs.has(event.slug)) throw new Error('Each event.slug must be unique, lowercase, short, and not a reserved path.');
    slugs.add(event.slug);
    for (const key of ['city', 'title', 'venue', 'address']) text(event[key], `events.${event.slug}.${key}`);
    const date = new Date(`${event.date}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== event.date) throw new Error(`events.${event.slug}.date: use a real YYYY-MM-DD date.`);
    for (const key of ['start', 'end']) if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(event[key])) throw new Error(`events.${event.slug}.${key}: use 24-hour HH:MM.`);
    if (event.end <= event.start) throw new Error(`events.${event.slug}: end must follow start on the same day.`);
    try { new Intl.DateTimeFormat('en', { timeZone: event.timeZone }).format(); } catch { throw new Error(`events.${event.slug}.timeZone: use a valid time zone such as Asia/Jakarta.`); }
    url(event.mapUrl, `events.${event.slug}.mapUrl`);
  }
  if (!Array.isArray(config.gallery) || config.gallery.length > 12) throw new Error('gallery: use 0 to 12 local images.');
  config.gallery.forEach(path => media(path, 'gallery'));
  if (!Array.isArray(config.socials) || config.socials.length > 6) throw new Error('socials: use 0 to 6 profile links.');
  config.socials.forEach(profile => { text(profile.label, 'socials.label', 80); url(profile.url, 'socials.url'); });
  if (config.music?.file) media(config.music.file, 'music.file');
  if (config.videoUrl) url(config.videoUrl, 'videoUrl');
  if (!Array.isArray(config.gifts) || config.gifts.length > 4) throw new Error('gifts: use 0 to 4 gift details.');
  config.gifts.forEach(gift => { for (const field of ['label', 'value', 'owner']) text(gift[field], `gifts.${field}`); });
  return config;
}
