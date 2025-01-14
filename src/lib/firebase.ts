import { env } from '@/env'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const serviceAccount = {
  type: 'service_account',
  project_id: env.PROJECT_ID,
  private_key_id: env.PRIVATE_KEY_ID,
  private_key: env.PRIVATE_KEY,
  client_email: env.CLIENT_EMAIL,
  client_id: env.CLIENT_ID,
  auth_uri: env.AUTH_URI,
  token_uri: env.TOKEN_URI,
  auth_provider_x509_cert_url: env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: env.CLIENT_X509_CERT_URL,
  universe_domain: env.UNIVERSE_DOMAIN,
} as ServiceAccount

export const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: env.PROJECT_ID,
})

export const db = getFirestore(app, env.DATABASE)

// Conecte-se ao emulador no ambiente local
if (env.TEST_TYPE === 'e2e') {
  db.settings({
    host: 'localhost:8081', // Porta do Firestore emulador
    ssl: false,
  })
}
