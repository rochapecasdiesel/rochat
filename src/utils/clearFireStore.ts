import { db } from '@/lib/firebase'

export async function clearFireStore() {
  const collections = await db.listCollections()

  await Promise.all(
    collections.map(async (collection) => {
      const snapshot = await collection.get()
      const batch = db.batch()
      snapshot.docs.forEach((doc) => batch.delete(doc.ref))
      await batch.commit()
    }),
  )
}
