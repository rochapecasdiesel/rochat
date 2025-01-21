import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetUserChatsService } from '../user/get-user-chats.service'

export function makeGetUserChatsService() {
  const usersRepository = new FirebaseUsersRepository()
  const getUserChatsService = new GetUserChatsService(usersRepository)

  return getUserChatsService
}
