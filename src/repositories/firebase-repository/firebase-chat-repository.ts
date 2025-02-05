import {
  ChatCreateInput,
  Chat,
  MessagesCreateInput,
  Messages,
  Alterations,
  ChatUpdateInput,
} from '@/@types/chat'
import { ChatRepository, UpdateMessage } from '../chat-repository'
import { db } from '@/lib/firebase'
import { randomUUID } from 'node:crypto'

export class FirebaseChatRepository implements ChatRepository {
  private chatCollection = db.collection('chat')

  async create(data: ChatCreateInput): Promise<Chat> {
    const documentData = {
      lastMessage: data.lastMessage ?? null,
      lastTimestamp: data.lastTimestamp ?? null,
      participants: data.participants,
      status: data.status,
      assingnedUser: data.assingnedUser,
    }

    // Criação do documento principal na coleção "chats"
    const docRef = await this.chatCollection.add(documentData)

    // Criação do chat retornado
    const createdChat = {
      id: docRef.id, // ID gerado pelo Firebase
      ...documentData, // Dados armazenados no Firestore,
    } as Chat

    return createdChat
  }

  async updateChat(chatId: string, data: ChatUpdateInput): Promise<Chat> {
    const chatDocRef = this.chatCollection.doc(chatId)

    // Verifica se o documento do chat existe
    const chatDoc = await chatDocRef.get()
    if (!chatDoc.exists) {
      throw new Error(`Chat with ID ${chatId} does not exist.`)
    }

    await chatDocRef.update({
      ...data,
      updateAt: new Date(),
    })

    const updatedChatSnapshot = await chatDocRef.get()

    return {
      id: updatedChatSnapshot.id,
      ...updatedChatSnapshot.data(),
    } as Chat
  }

  async findByParticipants(participants: string[]) {
    // Consulta pelo campo `participants` usando `array-contains-any`
    const querySnapshot = await this.chatCollection
      .where('participants', 'array-contains-any', participants)
      .get()

    if (!querySnapshot.empty) {
      // Filtra os resultados para garantir que ambos os participantes existam
      const chatDoc = querySnapshot.docs.find((doc) => {
        const docParticipants = doc.data().participants as string[]
        return (
          participants.every((participant) =>
            docParticipants.includes(participant),
          ) && docParticipants.length === participants.length
        )
      })

      if (chatDoc) {
        return { id: chatDoc.id, ...chatDoc.data() } as Chat
      }
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

  async createMessagem(
    chatId: string,
    data: MessagesCreateInput,
  ): Promise<Messages> {
    // Obtém a referência ao documento do chat
    const chatDocRef = this.chatCollection.doc(chatId)

    // Verifica se o documento do chat existe
    const chatDoc = await chatDocRef.get()
    if (!chatDoc.exists) {
      throw new Error(`Chat with ID ${chatId} does not exist.`)
    }

    // Cria uma referência para a subcoleção 'messages' dentro do chat
    const messagesCollectionRef = chatDocRef.collection('messages')

    // Cria um novo ID para a mensagem
    const messageId = randomUUID()

    // Define os dados da nova mensagem
    const documentData: Messages = {
      ...data,
      id: messageId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      altered: false,
      alterations: data.alterations ?? [],
      replyTo: data.replyTo ?? '',
    }

    // Adiciona a nova mensagem como um documento na subcoleção 'messages'
    await messagesCollectionRef.doc(messageId).set(documentData)

    // Atualiza os campos 'lastMessage' e 'lastTimestamp' no documento do chat
    await chatDocRef.update({
      lastMessage: documentData.text,
      lastTimestamp: documentData.createdAt,
    })

    return documentData
  }

  async getMessages(chatId: string, page: number): Promise<Messages[]> {
    // Define o número de itens por página
    const itemsPerPage = 50

    // Obtém a referência à subcoleção de mensagens
    const messagesCollectionRef = this.chatCollection
      .doc(chatId)
      .collection('messages')

    // Verifica se o documento do chat existe
    const chatDoc = await this.chatCollection.doc(chatId).get()
    if (!chatDoc.exists) {
      throw new Error(`Chat with ID ${chatId} does not exist.`)
    }

    // Ordena as mensagens por data de criação
    let query = messagesCollectionRef
      .orderBy('createdAt', 'asc')
      .limit(itemsPerPage)

    // Calcula o ponto inicial da página atual
    if (page > 1) {
      const offset = (page - 1) * itemsPerPage

      // Obtem o último documento da página anterior
      const previousPageSnapshot = await messagesCollectionRef
        .orderBy('createdAt', 'desc')
        .limit(offset)
        .get()

      // Verifica se existem mensagens suficientes
      if (!previousPageSnapshot.empty) {
        const lastVisible =
          previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1]
        query = query.startAfter(lastVisible)
      } else {
        return [] // Não há mensagens suficientes para esta página
      }
    }

    // Busca os documentos da página atual
    const snapshot = await query.get()

    // Converte os documentos para o tipo Messages
    return snapshot.docs.map((doc) => doc.data() as Messages)
  }

  async findMessageByid(chatId: string, messageId: string) {
    // Obtém a referência ao documento do chat
    const chatDocRef = this.chatCollection.doc(chatId)

    // Verifica se o documento do chat existe
    const chatDoc = await chatDocRef.get()
    if (!chatDoc.exists) {
      throw new Error(`Chat with ID ${chatId} does not exist.`)
    }

    // Obtém a referência à subcoleção 'messages' e ao documento da mensagem
    const messageDocRef = chatDocRef.collection('messages').doc(messageId)

    // Verifica se o documento da mensagem existe
    const messageDoc = await messageDocRef.get()
    if (!messageDoc.exists) {
      return null
    }

    // Obtém os dados da mensagem atual
    const messageData = messageDoc.data() as Messages

    return {
      ...messageData,
      id: messageDoc.id,
    } as Messages
  }

  async updateMessage(data: UpdateMessage) {
    // Obtém a referência ao documento do chat
    const chatDocRef = this.chatCollection.doc(data.chatId)

    // Verifica se o documento do chat existe
    const chatDoc = await chatDocRef.get()
    if (!chatDoc.exists) {
      throw new Error(`Chat with ID ${data.chatId} does not exist.`)
    }

    // Obtém a referência à subcoleção 'messages' e ao documento da mensagem
    const messageDocRef = chatDocRef.collection('messages').doc(data.messageId)

    // Verifica se o documento da mensagem existe
    const messageDoc = await messageDocRef.get()
    if (!messageDoc.exists) {
      throw new Error(`Message with ID ${data.messageId} not found.`)
    }

    // Obtém os dados da mensagem atual
    const messageData = messageDoc.data() as Messages

    // Cria uma alteração no histórico
    const alterations: Alterations = {
      id: randomUUID(),
      originalMessage: messageData.text,
      timestamp: new Date(),
      deleted: messageData.deleted,
    }

    // Atualiza os campos da mensagem
    const updatedMessage = {
      ...messageData,
      ...data.data,
      updatedAt: new Date(),
      altered: true,
      alterations: Array.isArray(messageData.alterations)
        ? [...messageData.alterations, alterations]
        : [alterations],
    }

    // Atualiza o documento da mensagem na subcoleção
    await messageDocRef.update(updatedMessage)

    return updatedMessage as Messages
  }
}
