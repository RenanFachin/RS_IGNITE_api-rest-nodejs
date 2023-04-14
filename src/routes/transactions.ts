import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middleware/check-session-id-exists'

// PLUGIN
export async function transactionsRoutes(app: FastifyInstance) {
  // Criando log do método e url
  app.addHook('preHandler', async (request, response) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  // Listar todas transações
  // preHandler vai lidar antes da request e response
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, response) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId) // mostrando apenas as transações que tenham sessionId igual
        .select()

      return {
        transactions,
      }
    },
  )

  // Transação única
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      // Criando uma validação de entrada para os request.params
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      // Buscando a primeira transação com este id no db
      const transaction = await knex('transactions')
        .where('id', id)
        .andWhere('session_id', sessionId)
        .first()

      return {
        transaction,
      }
    },
  )

  // Listando as transferências realizadas pelo usuário
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      // método sum() => somar todos os campos de uma coluna
      // .first() é para retonar como objeto e não array, que é o padrão do knex

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' }) // vai substituir o nome apenas para amount
        .first()

      return { summary }
    },
  )

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

    // Cookies
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Criando a nova transação
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      // Quando uma transação for cadastrada e o seu valor for do tipo crédito, quer dizer que o valor é positivo.
      // Caso seja do tipo débito, o valor é negativo
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })
}
