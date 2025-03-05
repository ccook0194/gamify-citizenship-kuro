import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './db/schema/citizenshipSchema.ts',
  out: './drizzle', // Output directory for migrations
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
