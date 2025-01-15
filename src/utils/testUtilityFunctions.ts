import { InMemoryUsersRepository } from '@/repositories/in-memory-repository/in-memory-users-repository'

export async function createMultipleUsers(
  usersRepository: InMemoryUsersRepository,
  userCount: number,
) {
  for (let i = 1; i <= userCount; i++) {
    const user = {
      id: String(100000 + i), // Gera um ID único
      userName: `User${i}`,
      avatarUrl: `http://example.com/avatar${i}.jpg`,
      userMessage: `Hello from User${i}!`,
    }
    await usersRepository.create(user)
  }
}
