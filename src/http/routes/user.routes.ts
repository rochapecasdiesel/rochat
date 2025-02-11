import { FastifyInstance } from 'fastify'
import { userRegisterController } from '../controllers/users/user-register.controller'
import { userUpdateController } from '../controllers/users/user-update.controller'
import { getManyUsersByNameController } from '../controllers/users/get-many-users-by-name.controller'
import { getUserChatsController } from '../controllers/users/get-user-chats.controller'
import { getUserByIdController } from '../controllers/users/get-user-by-id.controller'
import { getNotSeenUserNotificationController } from '../controllers/users/get-not-seen-user-notification.controller'
import { getNotificationByIdController } from '../controllers/users/get-notification-by-id.controller'
import { getUserNotificationsController } from '../controllers/users/get-user-notifications.controller'
import { postUserNotificationController } from '../controllers/users/post-user-notification.controller'
import { markNotificationAsSeenController } from '../controllers/users/mark-notification-as-seen.controller'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', userRegisterController)
  app.patch('/edit-user', userUpdateController)
  app.get('/', getManyUsersByNameController)
  app.get('/:id', getUserByIdController)
  app.get('/user-chats', getUserChatsController)
  app.post('/:userId/notification', postUserNotificationController)
  app.get('/:userId/notification', getUserNotificationsController)
  app.get(
    '/:userId/notification/not-seen',
    getNotSeenUserNotificationController,
  )
  app.get(
    '/:userId/notification/:notificationId',
    getNotificationByIdController,
  )
  app.patch(
    '/:userId/notification/:notificationId/seen',
    markNotificationAsSeenController,
  )
}
