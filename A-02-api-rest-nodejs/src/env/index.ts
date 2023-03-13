import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(4000),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error(
    `Invalid environment variables! ${JSON.stringify(_env.error.format())}`,
  )
}

export const env = _env.data
