import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { GetNotSeenUserNotificationService } from '../user/get-not-seen-user-notification.service'

export function makeGetNotSeenUserNotificationService() {
  const usersRepository = new FirebaseUsersRepository()
  const getNotSeenUserNotificationService =
    new GetNotSeenUserNotificationService(usersRepository)
  return getNotSeenUserNotificationService
}
