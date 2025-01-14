import { db } from '@/lib/firebase'

export async function clearFireStore() {
  const collections = await db.listCollections()

  for (const collection of collections) {
    const snapshot = await collection.get()
    const batch = db.batch()

    snapshot.docs.forEach((doc) => batch.delete(doc.ref))

    // Executa a operação de exclusão em lote
    await batch.commit()
  }
}
