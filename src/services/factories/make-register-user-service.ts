import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { RegisterUserService } from '../register-user.service'

export function makeRegisterUserService() {
  const usersRepository = new FirebaseUsersRepository()
  const registerUserService = new RegisterUserService(usersRepository)

  return registerUserService
}
