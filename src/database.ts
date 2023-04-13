import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

// : Knex.Config serve para tipar o objeto de configurações
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  // Configurações das migrations
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)
