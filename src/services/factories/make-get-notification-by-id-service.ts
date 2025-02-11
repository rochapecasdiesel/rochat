import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetNotificationByIdService } from '../user/get-notification-by-Id.service'

export function makeGetNotificationByIdService() {
  const usersRepository = new FirebaseUsersRepository()
  const getNotificationByIdService = new GetNotificationByIdService(
    usersRepository,
  )
  return getNotificationByIdService
}
