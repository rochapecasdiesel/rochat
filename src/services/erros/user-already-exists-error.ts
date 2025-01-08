export class UserAllreadyExistsError extends Error {
  constructor() {
    super('User already exists')
  }
}
