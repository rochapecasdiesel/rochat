import { env } from '@/env'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { randomUUID } from 'node:crypto'

const isTestEnv = env.NODE_ENV === 'test'

// Configuração para o ambiente de teste (emulador)
const emulatorServiceAccount = isTestEnv
  ? {
      type: 'service_account',
      project_id: randomUUID(), // Identificação fictícia
      private_key_id: 'test-key-id', // Identificação fictícia
      private_key: 'test-key', // Não será usada, mas é necessária para inicializar
      client_email: 'test@test-project.iam.gserviceaccount.com',
      client_id: 'test-client-id',
      auth_uri: 'http://localhost', // Não utilizado
      token_uri: 'http://localhost', // Não utilizado
      auth_provider_x509_cert_url: 'http://localhost',
      client_x509_cert_url: 'http://localhost',
    }
  : {
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
    }

// Inicialização do Firebase
export const app = initializeApp({
  credential: cert(emulatorServiceAccount as ServiceAccount),
  projectId: isTestEnv ? 'test-project' : env.PROJECT_ID,
})

export const db = getFirestore(app)

// Configuração do emulador no ambiente de teste
if (isTestEnv) {
  db.settings({
    host: 'localhost:8081', // Porta do Firestore Emulator
    ssl: false,
  })
}
