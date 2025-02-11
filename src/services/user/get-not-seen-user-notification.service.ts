import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'

interface GetNotSeenUserNotificationServiceResponse {
  notifications: UserNotification[]
}

export class GetNotSeenUserNotificationService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
  ): Promise<GetNotSeenUserNotificationServiceResponse> {
    const notifications =
      await this.usersRepository.getNotSeenUserNotification(userId)
    return { notifications }
  }
}
