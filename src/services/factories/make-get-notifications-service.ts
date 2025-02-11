import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetUserNotificationsService } from '../user/get-user-notifications.service'

export function makeGetUserNotificationsService() {
  const usersRepository = new FirebaseUsersRepository()
  const getUserNotificationsService = new GetUserNotificationsService(
    usersRepository,
  )
  return getUserNotificationsService
}
