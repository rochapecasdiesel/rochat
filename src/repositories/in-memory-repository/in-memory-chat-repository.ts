import {
  Chat,
  ChatCreateInput,
  Messages,
  MessagesCreateInput,
} from '@/@types/chat'
import { ChatRepository, UpdateMessage } from '../chat-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryChatRepository implements ChatRepository {
  public chats: Chat[] = []

  async create(data: ChatCreateInput) {
    const chat: ChatCreateInput = {
      ...data,
      id: data.id ? data.id : randomUUID(),
      createAt: data.createAt ? data.createAt : new Date(),
    }
    this.chats.push(chat as Chat)
    return chat as Chat
  }

  async findByParticipants(participants: string[]) {
    return (
      this.chats.find(
        (chat) =>
          chat.participants.includes(participants[0]) &&
          chat.participants.includes(participants[1]),
      ) || null
    )
  }

  async findById(id: string) {
    const chat = this.chats.find((chat) => chat.id === id)

    if (!chat) {
      return null
    }

    return chat
  }

  async createMessagem(chatId: string, data: MessagesCreateInput) {
    const index = this.chats.findIndex((chat) => chat.id === chatId)

    // Criação da nova mensagem
    const message = {
      ...data,
      id: data?.id ? data.id : randomUUID(),
      createAt: new Date(),
    } as Messages

    // Verifica se o chat existe e se messages é um array
    if (index > -1) {
      // Garantir que messages seja um array
      if (!Array.isArray(this.chats[index].messages)) {
        this.chats[index].messages = [] // Inicializa como array vazio, caso contrário
      }

      // Adiciona a nova mensagem
      this.chats[index].messages.push(message)
    }

    return message
  }

  async getMessages(chatId: string, page: number) {
    const chat = this.chats.find((item) => item.id === chatId)

    if (!chat) {
      return []
    }

    return chat?.messages ? chat.messages.slice((page - 1) * 50, page * 50) : []
  }

  async updateMessage({
    chatId,
    messageId,
    data,
  }: UpdateMessage): Promise<Messages> {
    // Localiza o chat pelo ID
    const chatIndex = this.chats.findIndex((chat) => chat.id === chatId)

    if (chatIndex === -1) {
      throw new Error(`Chat with ID ${chatId} not found`)
    }

    const chat = this.chats[chatIndex]

    // Localiza a mensagem pelo ID dentro do chat
    const messageIndex = chat.messages.findIndex(
      (message) => message.id === messageId,
    )

    if (messageIndex === -1) {
      throw new Error(
        `Message with ID ${messageId} not found in chat ${chatId}`,
      )
    }

    // Atualiza os dados da mensagem
    const updatedMessage = {
      ...chat.messages[messageIndex],
      ...data,
      updatedAt: new Date(), // Atualiza o timestamp
    }

    // Substitui a mensagem pelo valor atualizado
    chat.messages[messageIndex] = updatedMessage

    if (!chat.messages[messageIndex].alterations) {
      chat.messages[messageIndex].alterations = []
    }

    chat.messages[messageIndex].alterations.push({
      id: randomUUID(),
      originalMessage: chat.messages[messageIndex].text,
      timestamp: new Date(),
    })

    // Atualiza o chat na lista principal
    this.chats[chatIndex] = chat

    // Retorna a mensagem atualizada
    return updatedMessage as Messages
  }
}
