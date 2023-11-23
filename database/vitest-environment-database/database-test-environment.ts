import 'dotenv/config'
import type { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

export default <Environment>{
  name: 'custom',
  transformMode: 'web',
  async setup() {
    console.log('running')
    process.env.NODE_ENV = 'e2e_test'
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