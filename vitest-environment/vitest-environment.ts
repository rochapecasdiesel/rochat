import { Environment } from 'vitest'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import 'dotenv/config'

export default <Environment>{
  name: 'firebase',
  transformMode: 'ssr',
  async setup() {
    console.log('Inicializando ambiente Firebase para testes')

    // Inicializa o ambiente de teste
    const testEnv = await initializeTestEnvironment({
      projectId: process.env.PROJECT_ID, // Substitua pelo seu ID do projeto Firebase
      firestore: {
        host: 'localhost',
        port: 8081, // Porta do emulador Firestore
        rules: '', // Regras customizadas do Firestore (se necessário)
      },
    })

    // Limpa o banco antes dos testes
    await testEnv.clearFirestore()

    return {
      teardown() {
        console.log('Finalizando ambiente Firebase para testes')
        return testEnv.cleanup() // Libera recursos usados no ambiente
      },
    }
  },
}
