import { FirebaseUsersRepository } from '@/repositories/firebase-repository/firebase-users-repository'

export function makePostUserNotificationService() {
  const usersRepository = new FirebaseUsersRepository() // Instancia o repositório
  const service = new PostUserNotificationService(usersRepository) // Cria o serviço com o repositório
  return service // Retorna o serviço
}
