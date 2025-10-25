import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { resolve } from 'path'
import * as schema from './schema'
import { env } from '../env'

type DatabaseInstance = ReturnType<typeof Database>

/**
 * Initialize the SQLite database connection with Drizzle ORM
 * Creates a persistent local database for the agent
 */
export function initializeDatabase(): { db: ReturnType<typeof drizzle>; sqlite: DatabaseInstance } {
  // Create database path relative to agent directory
  const dbPath = env.DATABASE_PATH || resolve(process.cwd(), 'data', 'hpulse.db')

  // Create better-sqlite3 connection
  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL') // Enable Write-Ahead Logging for better performance

  // Create Drizzle instance
  const db = drizzle(sqlite, { schema })

  // Run migrations if they exist
  try {
    const migrationsFolder = resolve(__dirname, '../../drizzle')
    migrate(db, { migrationsFolder })
    console.log('✅ Database migrations applied successfully')
  } catch (error) {
    console.log('⚠️  No migrations found or migration failed:', error)
  }

  return { db, sqlite }
}

// Export singleton database instance
let dbInstance: ReturnType<typeof initializeDatabase> | null = null

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = initializeDatabase()
  }
  return dbInstance.db
}

export function closeDatabaseConnection() {
  if (dbInstance) {
    dbInstance.sqlite.close()
    dbInstance = null
  }
}
