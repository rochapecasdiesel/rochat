import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'

interface PostUserNotificationServiceResponse {
  notification: UserNotification
}

export class PostUserNotificationService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    data: UserNotification,
  ): Promise<PostUserNotificationServiceResponse> {
    const notification = await this.usersRepository.postUserNotification(
      userId,
      data,
    )
    return { notification }
  }
}
