import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUserService } from './register-user.service'
import { UsersRepository } from '@/repositories/users-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'

let userRepository: UsersRepository
let sut: RegisterUserService

describe('Register user Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUserService(userRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      userName: 'John Doe',
      avatarUrl: 'http://example.com/avatar.jpg',
      userMessage: 'Hello, world!',
    })

    expect(user.userName).toEqual('John Doe')
  })
})
