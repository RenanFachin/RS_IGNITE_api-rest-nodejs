import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  // Testando a configuração do database
  // Todo db possui uma tabela chamada sqlite_schema e dentro dela existe infos sobre as outras tabelas
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
