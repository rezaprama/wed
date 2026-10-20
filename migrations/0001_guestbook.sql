CREATE TABLE wishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL CHECK(length(city) BETWEEN 1 AND 20),
  audience TEXT NOT NULL DEFAULT 'friends' CHECK(audience IN ('friends', 'parents')),
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
  message TEXT NOT NULL CHECK(length(message) BETWEEN 2 AND 1000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX wishes_public_feed ON wishes(city, audience, status, id DESC);
CREATE INDEX wishes_moderation ON wishes(status, id DESC);
CREATE INDEX wishes_daily_limit ON wishes(ip_hash);
