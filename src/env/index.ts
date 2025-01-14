import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  PROJECT_ID: z.string(),
  JWT_SECRET: z.string(),
  PRIVATE_KEY_ID: z.string(),
  PRIVATE_KEY: z.string(),
  CLIENT_EMAIL: z.string(),
  CLIENT_ID: z.string(),
  AUTH_URI: z.string().url(),
  TOKEN_URI: z.string().url(),
  AUTH_PROVIDER_X509_CERT_URL: z.string().url(),
  CLIENT_X509_CERT_URL: z.string().url(),
  UNIVERSE_DOMAIN: z.string(),
  DATABASE: z.enum(['rocha-tech-test']).default('rocha-tech-test'),
  TEST_TYPE: z.enum(['e2e', 'unit']).default('e2e'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
