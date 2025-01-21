import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetManyUsersByNameService } from '@/services/user/get-many-users-by-name.service'

export function makeGetManyUsersByNameService() {
  const usersRepository = new FirebaseUsersRepository()
  const getManyUsersByNameService = new GetManyUsersByNameService(
    usersRepository,
  )

  return getManyUsersByNameService
}
