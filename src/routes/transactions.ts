import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'

// PLUGIN
export async function transactionsRoutes(app: FastifyInstance) {
  // Listar todas transações
  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return {
      transactions,
    }
  })

  // Transação única
  app.get('/:id', async (request) => {
    // Criando uma validação de entrada para os request.params
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    // Buscando a primeira transação com este id no db
    const transaction = await knex('transactions').where('id', id).first()

    return {
      transaction,
    }
  })

  // Cria nova transação
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
