import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// O cadastro dos cookies precisa acontecer antes das rotas
// Cookies
app.register(cookie)

// PLUGIN
app.register(transactionsRoutes, {
  // Definindo que todas as rotas /transaction vão chamar este plugin
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
