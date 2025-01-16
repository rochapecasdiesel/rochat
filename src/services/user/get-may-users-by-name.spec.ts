import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { describe, beforeEach, expect, it } from 'vitest'
import { RegisterUserService } from './register-user.service'
import { ResourceNotFoundError } from '../erros/resource-not-found-error'
import { GetManyUsersByIdService } from './get-may-users-by-name.service'

let userRepository: UsersRepository
let register: RegisterUserService
let sut: GetManyUsersByIdService

describe('Get Users By Name Service', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetManyUsersByIdService(userRepository)
    register = new RegisterUserService(userRepository)
  })

  it('should be able to get users by name', async () => {
    await register.execute({
      documentId: '0001',
      userName: 'John Doe',
      avatarUrl: 'http://example.com/avatar1.jpg',
      userMessage: 'Hello, world!',
    })

    await register.execute({
      documentId: '0002',
      userName: 'John Doe',
      avatarUrl: 'http://example.com/avatar2.jpg',
      userMessage: 'Hi there!',
    })

    const { users } = await sut.execute('John Doe')

    expect(users).toHaveLength(2)
    expect(users[0].userName).toEqual('John Doe')
    expect(users[1].userName).toEqual('John Doe')
  })

  it('should return an empty array if no users are found with the given name', async () => {
    expect(sut.execute('Jorge Vasconcelo')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it('should throw a ResourceNotFoundError if the repository returns null', async () => {
    // Simulating a null return (edge case)
    userRepository.findManyByName = async () => null

    await expect(sut.execute('John Doe')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
