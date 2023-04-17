import { it, expect, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process' // executar scripts em paralelo
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

  // Pq beforeEach? Para sempre manter o ambiente o mais limpo possível entre testes
  beforeEach(async () => {
    // execSync permite executar comandos no terminal por dentro da aplicação node

    // 1: Executar um comando para limpar todas as tabelas de dentro da tabela test.db
    execSync('npm run knex migrate:rollback --all')

    execSync('npm run knex migrate:latest') // rodando a migration dentro da tabela de teste
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

  it('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await supertestRequest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('set-cookie')

    const listTransactionsResponse = await supertestRequest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    console.log(listTransactionsResponse.body)

    // Como para fazer a listagem de uma transação específica é necessário passar o id desta transação, iremos capturar o id da transação criada
    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionsResponse = await supertestRequest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await supertestRequest(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('set-cookie')

    // Criando uma segunda transação, apenas para fins de deixar o teste mais fiel ao idealizado
    await supertestRequest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await supertestRequest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    // Validação do resumo, esperando ter um amount de 3000 (5000-2000)
    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
