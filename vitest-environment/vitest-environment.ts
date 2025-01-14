import { Environment } from 'vitest'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import 'dotenv/config'
import { execSync } from 'node:child_process'

export default <Environment>{
  name: 'firebase',
  transformMode: 'ssr',
  async setup() {
    console.log('Inicializando ambiente Firebase para testes')

    execSync('npx firebase emulators:start')

    // Inicializa o ambiente de teste
    const testEnv = await initializeTestEnvironment({
      projectId: process.env.PROJECT_ID, // Substitua pelo seu ID do projeto Firebase
      firestore: {
        host: 'localhost',
        port: 8080, // Porta do emulador Firestore
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
