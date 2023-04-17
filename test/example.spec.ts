import { expect, test, beforeAll, afterAll } from 'vitest'
import supertestRequest from 'supertest'
import { app } from '../src/app'

// beforeALl -> Executa algum código antes que todos os testes executem. Função executa apenas uma vez antes do teste. Existe o beforeEach que executa a cada teste.

beforeAll(async () => {
  // Fazendo o teste esperar a aplicação inicializar todas as rotas antes de realmente rodar os testes
  await app.ready()
})

afterAll(async () => {
  // Removendo a aplicação da memória após a executação dos testes
  await app.close()
})

test('o usuário consegue criar uma nova transação', async () => {
  // .server => servidor node

  // Criando uma chamada POST ao servidor node e enviando o corpo de uma requisição de nova transação
  const response = await supertestRequest(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

  // Validação do teste
  expect(response.statusCode).toEqual(201)
})
