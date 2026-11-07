import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig(
  {
    schema: './src/db/waitlist/schema.ts',
    out: './src/db/waitlist/migrations',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.WAITLIST_DATABASE_URL ?? '',
    },
  },
);
