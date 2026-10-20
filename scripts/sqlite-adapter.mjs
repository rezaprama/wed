import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

export function sqliteD1(filename = ':memory:') {
  const db = new DatabaseSync(filename);
  if (!db.prepare("SELECT name FROM sqlite_master WHERE name = 'wishes'").get()) db.exec(readFileSync(new URL('../migrations/0001_guestbook.sql', import.meta.url), 'utf8'));
  return {
    raw: db,
    prepare(query) {
      const statement = db.prepare(query);
      let bindings = [];
      return {
        bind(...values) { bindings = values; return this; },
        async first() { return statement.get(...bindings) ?? null; },
        async all() { return { results: statement.all(...bindings), success: true }; },
        async run() { const result = statement.run(...bindings); return { success: true, meta: { changes: result.changes } }; },
      };
    },
  };
}
