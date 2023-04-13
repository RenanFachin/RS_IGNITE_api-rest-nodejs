import 'dotenv/config'
import { z } from 'zod'

// NODE_ENV é o ambiente: development, test, production

// Criando um schema de validação de variáveis de ambiente
const envSchema = z.object({
  // enum => significa, uma entre as opções
  NODE_ENV: z
    .enum(['development', 'teste', 'production'])
    .default('production'),

  // DATABASE_URL é o que vem do process.env, ou seja, o que foi definido dentro de .env
  DATABASE_URL: z.string(),

  // Como PORT possui um valor default, não necessariamente ela precisa estar definida dentro do arquivo .env
  PORT: z.number().default(3333),
})

/*
O método parse vai pegar o envSchema e passar os dados vindos do process.env e o zod vai fazer a validação
*/
export const env = envSchema.parse(process.env)

/* 
Desta maneira, o typescript não vai acusar erro no arquivo de configurações do database, pois caso haja um erro, será tratado com um throw new Error pelo ZOD
*/
