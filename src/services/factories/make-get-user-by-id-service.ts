import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetUserByIdService } from '../user/get-user-by-id.service'

export function makeGetUserByIdService() {
  const userRepository = new FirebaseUsersRepository()
  const getUserByIdService = new GetUserByIdService(userRepository)
  return getUserByIdService
}
