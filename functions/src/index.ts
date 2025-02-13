import 'dotenv/config'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'

import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { Chat, Messages } from '../../src/@types/chat'
import { UserNotification } from '../../src/@types/user'
import { randomUUID } from 'node:crypto'

const app = initializeApp()
const db = getFirestore(app, process.env.DATABASE ?? '')

exports.createMessageTrigger = onDocumentCreated(
  {
    document: 'chat/{chatId}/messages/{messageId}',
    database: process.env.DATABASE,
  }, // Defina o caminho corretamente
  async (event) => {
    const chatId = event.params.chatId
    const messageId = event.params.messageId
    const messageData = event.data?.data() as Messages

    try {
      const chatDocRef = db.collection('chat').doc(chatId)
      const chatDocSnap = await chatDocRef.get()

      if (!chatDocSnap.exists) {
        logger.error(`Chat document with ID: ${chatId} not found.`)
        return
      }

      const chatData = chatDocSnap.data() as Chat

      const userTobeNotified = chatData.participants.find(
        (participant) => participant !== messageData.senderId,
      )

      if (!userTobeNotified) {
        logger.error('User to be notified not found.')
        return
      }

      if (messageData.seenAt) {
        return
      }

      const userDocRef = db.collection('users').doc(userTobeNotified)
      const userNotificationsDocRef = userDocRef.collection('userNotifications')

      const id = randomUUID()

      const data: UserNotification = {
        message: messageData.text,
        notificationId: id,
        seen: false,
        timestamp: Timestamp.now().toDate(),
        title: 'New Message',
        type: 'chat',
        createdAt: Timestamp.now().toDate(),
        details: {
          chatId,
          messageId,
        },
      }

      await userNotificationsDocRef.doc(id).set(data)
    } catch (error) {
      logger.error('Error fetching chat document:', error)
    }
  },
)
