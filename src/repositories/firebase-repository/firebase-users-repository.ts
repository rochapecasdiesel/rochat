import { db } from '@/lib/firebase'
import { UpdateUserChat, UsersRepository } from '../users-repository'
import { User, UserChat, UserCreateInput, UserUpdateInput } from '@/@types/user'
import { randomUUID } from 'node:crypto'

export class FirebaseUsersRepository implements UsersRepository {
  private usersCollection = db.collection('users')

  async create(data: UserCreateInput): Promise<User> {
    const id = data.id

    const documentData = {
      userName: data.userName,
      avatarUrl: data.avatarUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userMessage: data.userMessage ?? null,
    }

    // Cria o documento com o ID fornecido
    const docRef = this.usersCollection.doc(id)
    await docRef.set(documentData)

    const user = {
      id,
      ...documentData,
    } as User

    // Retorna o documento criado com o ID
    return user
  }

  async findById(id: string): Promise<User | null> {
    const userRef = this.usersCollection.doc(id)

    const userSnapshot = await userRef.get()

    const userData = userSnapshot.data()
    if (!userData) {
      return null
    }

    const user: User = {
      id: userSnapshot.id,
      userName: userData?.userName ? userData.userName : null,
      userMessage: userData?.userMessage ? userData.userMessage : null,
      createdAt: userData?.createdAt ? userData.createdAt : null,
      updatedAt: userData?.updatedAt ? userData.updatedAt : null,
      avatarUrl: userData?.avatarUrl ? userData.avatarUrl : null,
      userChats: userData?.userChats ? userData.userChats : null,
    }

    return user
  }

  async update(id: string, data: UserUpdateInput): Promise<User> {
    // Referência ao documento com o ID fornecido
    const userRef = this.usersCollection.doc(id)

    // Remove campos com valores `undefined`
    const sanitizedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== undefined),
    )

    // Atualiza os dados no Firestore
    await userRef.update({
      ...sanitizedData,
      updatedAt: new Date(), // Atualiza o campo de modificação
    })

    // Obtém os dados atualizados para retornar ao usuário
    const updatedSnapshot = await userRef.get()

    const updatedData = updatedSnapshot.data()

    return {
      id,
      ...updatedData,
    } as User
  }

  async findManyByName(name: string, page: number): Promise<User[]> {
    const ITEMS_PER_PAGE = 50 // Número fixo de itens por página

    const offset = (page - 1) * ITEMS_PER_PAGE

    // Faz uma consulta na coleção de usuários para encontrar documentos cujo campo 'name' corresponda
    const querySnapshot = await this.usersCollection
      .where('userName', '>=', name) // Nomes que começam com o prefixo `name`
      .offset(offset) // Deslocamento baseado na página
      .where('userName', '<', name + '\uf8ff') // Limite superior com sufixo especial
      .orderBy('createdAt')
      .get()

    // Verifica se encontrou algum resultado
    if (querySnapshot.empty) {
      return []
    }

    // Mapeia os documentos encontrados para o formato esperado de User
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[]
  }

  async createUserChat(userId: string, data: UserChat): Promise<UserChat> {
    const userDocRef = this.usersCollection.doc(userId)

    // Verifica se o documento do chat existe
    const userDoc = await userDocRef.get()

    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} does not exist.`)
    }

    const userChatId = randomUUID()

    const userChatsCollectionRef = userDocRef.collection('userChats')

    await userChatsCollectionRef.doc(userChatId).set(data)

    return {
      ...data,
      id: userChatId,
    }
  }

  async updateUserChat(data: UpdateUserChat): Promise<UserChat> {
    const userDocRef = this.usersCollection.doc(data.userId)

    // Verifica se o documento do usuário existe
    const userDoc = await userDocRef.get()
    if (!userDoc.exists) {
      throw new Error(`User with ID ${data.userId} does not exist.`)
    }

    const userChatsCollectionRef = userDocRef.collection('userChats')
    const userChatDocRef = userChatsCollectionRef.doc(data.userChatId)

    // Verifica se o documento do chat existe
    const userChatDoc = await userChatDocRef.get()
    if (!userChatDoc.exists) {
      throw new Error(
        `UserChat with ID ${data.userChatId} does not exist for user ${data.userChatId}.`,
      )
    }

    // Atualiza o documento do chat
    await userChatDocRef.update(data.data)

    return {
      ...userChatDoc.data(),
      id: data.userChatId,
    } as UserChat
  }

  async findUserChatById(
    userId: string,
    userChatId: string,
  ): Promise<UserChat | null> {
    const userDocRef = this.usersCollection.doc(userId)

    // Verifica se o documento do usuário existe
    const userDoc = await userDocRef.get()
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} does not exist.`)
    }

    const userChatsCollectionRef = userDocRef.collection('userChats')
    const userChatDocRef = userChatsCollectionRef.doc(userChatId)

    // Obtém o documento do chat
    const userChatDoc = await userChatDocRef.get()

    if (!userChatDoc.exists) {
      return null
    }

    return {
      id: userChatId,
      ...userChatDoc.data(),
    } as UserChat
  }

  async getUserChats(userId: string, page: number): Promise<UserChat[]> {
    const ITEMS_PER_PAGE = 50 // Número fixo de itens por página

    const userDocRef = this.usersCollection.doc(userId)

    // Verifica se o documento do usuário existe
    const userDoc = await userDocRef.get()
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} does not exist.`)
    }

    const userChatsCollectionRef = userDocRef.collection('userChats')

    // Calcula o offset com base na página
    const offset = (page - 1) * ITEMS_PER_PAGE

    // Consulta os itens com limite e deslocamento
    const querySnapshot = await userChatsCollectionRef
      .orderBy('lastTimestamp') // Ordenação (ajuste conforme necessário)
      .offset(offset) // Deslocamento baseado na página
      .limit(ITEMS_PER_PAGE) // Limite de itens por página
      .get()

    // Mapeia os documentos para o formato `UserChat`
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserChat[]
  }

  async findUserChatByChatId(
    userId: string,
    chatId: string,
  ): Promise<UserChat | null> {
    // Referência ao documento do usuário
    const userDocRef = this.usersCollection.doc(userId)

    // Verificar se o usuário existe
    const userDoc = await userDocRef.get()
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} does not exist.`)
    }

    // Referência à coleção de chats do usuário
    const userChatsCollectionRef = userDocRef.collection('userChats')

    // Consultar o chat pelo campo 'chatId'
    const querySnapshot = await userChatsCollectionRef
      .where('chatId', '==', chatId)
      .limit(1)
      .get()

    // Verificar se o chat foi encontrado
    if (querySnapshot.empty) {
      return null
    }

    // Retornar o primeiro documento encontrado
    const chatDoc = querySnapshot.docs[0]
    return {
      id: chatDoc.id, // ID do documento
      ...chatDoc.data(),
    } as UserChat
  }
}
