<div align="center">
  <img 
    alt="Logo Explorer" 
    title="Explorer" 
    src="https://i.imgur.com/jgM1K5Z.png"
  >

  <br>

  <h2 align="center">
    API REST com NodeJS
  </h2>
</div>
<br>

## API REST com NodeJS
Projeto desenvolvido durante o módulo 2 do bootcamp de especialização em nodejs realizado junto a rocketseat.

Este módulo consiste em desenvolver uma aplicação de transações (criar, listar todas, listar específicas e um resumo de todas). Para desenvolver esta aplicação, foi utilizado o microframework Fastify, knex como query builder e typescript.

Além disto, foram desenvolvidos testes end to end para testar as rotas da aplicação.


## Requisitos Funcionais

  - [x] O usuário deve poder criar uma nova transação;
  - [x] O usuário deve poder obter um resumo da sua conta;
  - [x] O usuário deve poder listar todas transações que já ocorreram;
  - [x] O usuário deve poder visualizar uma trasnsação única;

## Regras de negócio

  - [x] A transação pode ser do tipo crédito que somará ao valor total, ou débito subtrairá;
  - [x] Deve ser possível idenficar o usuário entre as requisições;
  - [x] O usuário só pode visualizar transações o qual ele criou;

## Instalação

```bash
# Faça o clone do repotório
  git clone git@github.com:RenanFachin/RS_IGNITE_api-rest-nodejs.git

# Instalar as dependências do projeto
  npm install

# Executando o projeto no ambiente de desenvolvimento
  npm run dev
  
# Rodar as migrations do projeto para criar o banco de dados
  npm run knex -- migrate:latest
```

## Insomnia do projeto

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=API-node-js-TEST&uri=https%3A%2F%2Fraw.githubusercontent.com%2FRenanFachin%2FRS_IGNITE_api-rest-nodejs%2Fmain%2Fexport.json%3Ftoken%3DGHSAT0AAAAAABV4J7KLCHDKOY6B4OGZONSWZB5R4JA)

## Testes e2e
Os testes foram desenvolvidos utilizando `vitest` e `supertest`


## Rotas
- Criar nova transação
```bash
POST /transactions
```

- Listar todos usuários
```bash
GET /transactions
```

- Listar transação específica usuários
```bash
GET /transactions/:${transaction_id}
```

- Mostrar um resumo geral das transações do usuário
```bash
GET /transactions/summary
```

## Ferramentas utilizadas
  - `NodeJS`
  - `Fastify`
  - `Sqlite`
  - `Typescript`
  - `Knex`
  - `tsup`
  - `zod`
  - `vitest`
  - `eslint`
  - `supertest`
  - `dotenv`