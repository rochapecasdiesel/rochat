import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'
import { describe, beforeEach, expect, it } from 'vitest'
import { GetManyUsersByNameService } from './get-many-users-by-name.service'
import { createMultipleUsers } from '@/utils/testUtilityFunctions'

let userRepository: InMemoryUsersRepository
let sut: GetManyUsersByNameService

describe('Get Users By Name Service', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUsersRepository()
    sut = new GetManyUsersByNameService(userRepository)
    await createMultipleUsers(userRepository, 51) // Cria 51 usuários para simular o cenário.
  })

  it('should be able to get the first page of users by name', async () => {
    const { users } = await sut.execute('User', 1) // Solicita a página 1.

    expect(users).toHaveLength(50) // Verifica se a página 1 contém 50 usuários.
    expect(users[0].userName).toEqual('User1')
    expect(users[49].userName).toEqual('User50')
  })

  it('should return the remaining users on the second page', async () => {
    const { users } = await sut.execute('User', 2) // Solicita a página 2.

    expect(users).toHaveLength(1) // Apenas 1 usuário deve estar na segunda página.
    expect(users[0].userName).toEqual('User51')
  })

  it('should return an empty array if the page exceeds the total users', async () => {
    const { users } = await sut.execute('User', 3) // Página além da contagem de usuários.

    expect(users).toHaveLength(0) // Nenhum usuário deve ser retornado.
  })

  it('should handle case-insensitive name searches', async () => {
    const { users } = await sut.execute('user', 1) // Pesquisa case-insensitive.

    expect(users).toHaveLength(50) // Deve retornar usuários independentemente do case.
    expect(users[0].userName).toEqual('User1')
  })

  it('should return an empty array if no users match the name', async () => {
    const { users } = await sut.execute('NonExistentName', 1) // Pesquisa por um nome inexistente.

    expect(users).toHaveLength(0) // Nenhum usuário deve ser retornado.
  })
})
