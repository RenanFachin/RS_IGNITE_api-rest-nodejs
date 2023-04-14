// eslint-disable-next-line
import { knex } from 'knex'

// Adicionando novos tipos
declare module 'knex/types/tables' {
  // Adicinando a interface Tables que irá definir quais tabelas o db terá
  export interface Tables {
    transactions: {
      // campos ta tabela transactions
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
