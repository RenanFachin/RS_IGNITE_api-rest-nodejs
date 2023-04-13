import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'

// Este IF é só para evitar o erro de typescript de ter esta variável possivelmente vazia
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.')
}

// : Knex.Config serve para tipar o objeto de configurações
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  // Configurações das migrations
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)
