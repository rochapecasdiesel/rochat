import { Environment } from 'vitest'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import 'dotenv/config'
import { randomUUID } from 'node:crypto'

export default <Environment>{
  name: 'firebase',
  transformMode: 'ssr',
  async setup() {
    console.log('Inicializando ambiente Firebase para testes')

    // Inicializa o ambiente de teste
    const testEnv = await initializeTestEnvironment({
      projectId: randomUUID(), // Substitua pelo seu ID do projeto Firebase
      firestore: {
        host: 'localhost',
        port: 8081, // Porta do emulador Firestore
        rules: '', // Regras customizadas do Firestore (se necessário)
      },
    })

    // Verifique se é um teste E2E e, se for, limpe o banco
    if (process.env.NODE_ENV === 'test') {
      await testEnv.clearFirestore()
    }

    return {
      teardown() {
        console.log('Finalizando ambiente Firebase para testes')

        if (process.env.NODE_ENV === 'test') {
          return testEnv.cleanup()
        }
      },
    }
  },
}
