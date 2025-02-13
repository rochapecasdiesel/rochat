import { UsersRepository } from '@/repositories/users-repository'
import { UserNotification } from '@/@types/user'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

interface PostUserNotificationServiceResponse {
  notification: UserNotification
}

export class PostUserNotificationService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    userId: string,
    data: UserNotification,
  ): Promise<PostUserNotificationServiceResponse> {
    const isUserAllReadyExists = await this.usersRepository.findById(userId)

    if (!isUserAllReadyExists) {
      throw new ResourceNotFoundError()
    }

    const notification = await this.usersRepository.postUserNotification(
      userId,
      data,
    )

    return { notification }
  }
}
