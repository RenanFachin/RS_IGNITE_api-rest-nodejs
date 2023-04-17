import { config } from 'dotenv'
import { z } from 'zod'

// Validação do ambiente em que está sendo rodado o sv
// O vitest automaticamente define node_env como test durante os testes
if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test', // buscando no '.env.test'
  })
} else {
  config() // buscando no '.env'
}

// NODE_ENV é o ambiente: development, test, production

// Criando um schema de validação de variáveis de ambiente
const envSchema = z.object({
  // enum => significa, uma entre as opções
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),

  // MODIFICAÇÃO PARA O DEPLOY (sqlite é em dev e postgreSQL(pg) é em prod)
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),

  // DATABASE_URL é o que vem do process.env, ou seja, o que foi definido dentro de .env
  DATABASE_URL: z.string(),

  // Como PORT possui um valor default, não necessariamente ela precisa estar definida dentro do arquivo .env
  // coerce => transforma o que for recebido em número
  PORT: z.coerce.number().default(3333),
})

/*
O método parse vai pegar o envSchema e passar os dados vindos do process.env e o zod vai fazer a validação

parse dispara um erro caso a validação falhe
safeParse não dispara um erro caso a validação falhe
*/

const _env = envSchema.safeParse(process.env)

// Fazendo a validação do método safeParse
if (_env.success === false) {
  // _env.error.format() -> vai formatar e mostrar onde que foi o erro
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

// Passando pela validação, fazer o export do schema
export const env = _env.data

/* 
Desta maneira, o typescript não vai acusar erro no arquivo de configurações do database, pois caso haja um erro, será tratado com um throw new Error pelo ZOD
*/
