import {
  User,
  UserChat,
  UserChatUpdate,
  UserCreateInput,
  UserNotification,
  UserUpdateInput,
} from '@/@types/user'

export interface UpdateUserChat {
  userId: string
  userChatId: string
  data: UserChatUpdate
}
export interface UsersRepository {
  create(data: UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findManyByName(name: string, page: number): Promise<User[]>
  update(id: string, data: UserUpdateInput): Promise<User>
  createUserChat(userId: string, data: UserChat): Promise<UserChat>
  updateUserChat(data: UpdateUserChat): Promise<UserChat>
  findUserChatById(userId: string, userChatId: string): Promise<UserChat | null>
  findUserChatByChatId(userId: string, chatId: string): Promise<UserChat | null>
  getUserChats(userId: string, page: number): Promise<UserChat[]>
  postUserNotification(
    userId: string,
    data: UserNotification,
  ): Promise<UserNotification>
  getUserNotifications(userId: string): Promise<UserNotification[]>
  getNotSeenUserNotification(userId: string): Promise<UserNotification[]>
  getNotificationById(
    userId: string,
    notificationId: string,
  ): Promise<UserNotification | null>
  markNotificationAsSeen(
    userId: string,
    notificationId: string,
    seenAt: Date,
  ): Promise<UserNotification>
}
