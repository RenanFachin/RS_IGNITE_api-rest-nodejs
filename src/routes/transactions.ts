import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

// PLUGIN
export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, response) => {
    // o que esperamos receber do front: {title,amount, type: credit ou debit}

    // Validação e tipagem
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // Criando a nova transação
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      // Quando uma transação for cadastrada e o seu valor for do tipo crédito, quer dizer que o valor é positivo.
      // Caso seja do tipo débito, o valor é negativo
      amount: type === 'credit' ? amount : amount * -1,
    })


    return response.status(201).send()
  })
}
