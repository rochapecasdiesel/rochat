import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'

interface GetUserNotificationsServiceResponse {
  notifications: UserNotification[]
}

export class GetUserNotificationsService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserNotificationsServiceResponse> {
    const notifications =
      await this.usersRepository.getUserNotifications(userId)
    return { notifications }
  }
}
