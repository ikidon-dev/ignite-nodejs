import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(_env.error.format())}`
  )
}

export const env = _env.data
