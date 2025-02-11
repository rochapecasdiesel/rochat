import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'

interface GetNotificationByIdServiceResponse {
  notification: UserNotification | null
}

export class GetNotificationByIdService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    notificationId: string,
  ): Promise<GetNotificationByIdServiceResponse> {
    const notification = await this.usersRepository.getNotificationById(
      userId,
      notificationId,
    )
    return { notification }
  }
}
