import { it, expect, beforeAll, afterAll, describe } from 'vitest'
import supertestRequest from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  // beforeALl -> Executa algum código antes que todos os testes executem. Função executa apenas uma vez antes do teste. Existe o beforeEach que executa a cada teste.

  beforeAll(async () => {
    // Fazendo o teste esperar a aplicação inicializar todas as rotas antes de realmente rodar os testes
    await app.ready()
  })

  afterAll(async () => {
    // Removendo a aplicação da memória após a executação dos testes
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
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

  it('should be able to list all transactions', async () => {
    // Para fazer a listagem de todas as transações é necessário ter um session_id
    // Testes precisam se "excluir" de qualquer contexto externo, ou seja, depende de outro teste.
    // Desta forma, para o teste de listar todas transações, devemos fazer primeiro a criação de uma transação

    const createTransactionResponse = await supertestRequest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    // Capturando o session_id dos cookies da requisição anterior
    const cookies = createTransactionResponse.get('set-cookie')

    // Fazendo a requisição, para de fato testar a listagem das transações
    // .get é a rota
    // .set é para enviar os cookies junto na requisição
    // .expect é a validação do teste
    const listTransactionsResponse = await supertestRequest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    console.log(listTransactionsResponse.body) // apenas para verificação do que está sendo recebido

    // validação do teste, como um todo
    // "Espero que" o corpo da requisição criada de listar seja igual à um array contendo um objeto contendo title e amount
    // id é gerado randomicamente e o type não fica salvo no db
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })
})
