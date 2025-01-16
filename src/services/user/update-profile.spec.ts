import { UsersRepository } from '@/repositories/users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateUserService } from './update-profile.service'
import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'

let userRepository: UsersRepository
let sut: UpdateUserService

describe('Update user Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new UpdateUserService(userRepository)
  })

  it('should be able to update user', async () => {
    await userRepository.create({
      id: '000075',
      userName: 'John Doe',
    })

    const { user } = await sut.execute('000075', {
      userMessage: 'Hello, world!',
    })

    expect(user.userMessage).toEqual('Hello, world!')
  })

  it('should not be able to update user if it does not exists', async () => {
    await expect(() =>
      sut.execute('000075', {
        userMessage: 'Hello, world!',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
