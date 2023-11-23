import 'dotenv/config'
import type { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

export default <Environment>{
  name: 'custom',
  transformMode: 'web',
  async setup() {
    const databaseName = randomUUID()
    process.env.DATABASE_URL = `./database/${databaseName}.db`
    execSync('yarn knex migrate:latest')
    return {
      async teardown() {
        execSync(`rm ./database/${databaseName}.db`)
      },
    }
  },
}
