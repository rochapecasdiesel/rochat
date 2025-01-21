import { FirebaseUsersRepository } from "@/repositories/firebase-repository/firebase-users-repository";
import { UpdateUserService } from "../user/update-profile.service";

export function makeUpdateUserService() {
  const usersRepository = new FirebaseUsersRepository();
  const updateUserService = new UpdateUserService(usersRepository);

  return updateUserService;
}
