import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'

interface MarkNotificationAsSeenServiceResponse {
  notification: UserNotification
}

export class MarkNotificationAsSeenService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    notificationId: string,
    seenAt: Date,
  ): Promise<MarkNotificationAsSeenServiceResponse> {
    const notification = await this.usersRepository.markNotificationAsSeen(
      userId,
      notificationId,
      seenAt,
    )
    return { notification }
  }
}
