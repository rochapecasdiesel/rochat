import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'
import { MarkNotificationAsSeenService } from '../user/mark-notificatio-as-seen.service'

export function makeMarkNotificationAsSeenService() {
  const usersRepository = new FirebaseUsersRepository()
  const markNotificationAsSeenService = new MarkNotificationAsSeenService(
    usersRepository,
  )
  return markNotificationAsSeenService
}
