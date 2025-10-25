import { defineConfig } from 'drizzle-kit'
import { resolve } from 'path'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || resolve(process.cwd(), 'data', 'hpulse.db'),
  },
  verbose: true,
  strict: true,
})
