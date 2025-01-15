export class ChatAlreadyExist extends Error {
  constructor() {
    super('Chat already exists')
  }
}
