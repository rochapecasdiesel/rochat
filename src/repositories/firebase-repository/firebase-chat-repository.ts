import { ChatCreateInput, Chat, MessagesCreateInput } from '@/@types/chat'
import { ChatRepository, UpdateMessage } from '../chat-repository'
import { db } from '@/lib/firebase'

export class FirebaseChatRepository implements ChatRepository {
  private chatCollection = db.collection('chat')

  async create(data: ChatCreateInput) {
    const documentData = {
      lastMessage: data.lastMessage ?? null,
      lastTimestamp: data.lastTimestamp ?? null,
      messages: data.messages ?? [],
    }

    const docRef = await this.chatCollection.add(documentData)

    const createdChat = {
      id: docRef.id, // Adicionando o ID gerado pelo Firebase
      ...documentData, // Dados armazenados no Firestore
    } as Chat

    return createdChat
  }

  async findByParticipants(participants: string[]): Promise<Chat | null> {
    const querySnapshot = await this.chatCollection
      .where('participants', 'array-contains', participants[0]) // Verifica se o participante 1 está na lista
      .where('participants', 'array-contains', participants[1]) // Verifica se o participante 2 está na lista
      .get()

    if (!querySnapshot.empty) {
      // Retorna o primeiro chat encontrado
      const chatDoc = querySnapshot.docs[0]
      return { id: chatDoc.id, ...chatDoc.data() } as Chat
    }

    return null
  }

  async findById(id: string): Promise<Chat | null> {
    const docRef = this.chatCollection.doc(id) // Referência ao documento pelo ID
    const docSnapshot = await docRef.get() // Obtém o snapshot do documento

    if (!docSnapshot.exists) {
      return null // Retorna null se o documento não existir
    }

    // Retorna os dados do documento
    return { id: docSnapshot.id, ...docSnapshot.data() } as Chat
  }

  async createMessagem(chatId: string, data: MessagesCreateInput) {
    throw new Error('Method not implemented.')
  }

  async getMessages(chatId: string, page: number) {
    throw new Error('Method not implemented.')
  }

  async updateMessage(data: UpdateMessage) {
    throw new Error('Method not implemented.')
  }
}
