// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
    }
    meals: {
      id: string
      name: string
      description: string
      created_at: Date
      on_diet: boolean
      user_id: string
    }
  }
}
