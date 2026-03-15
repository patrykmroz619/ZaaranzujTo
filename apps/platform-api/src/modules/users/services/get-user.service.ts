import { Injectable } from "@nestjs/common";

import { UsersRepository } from "../users.repository";

type TGetUserParams = {
  clerkId: string;
  email: string;
};

@Injectable()
export class GetUserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUser = async (params: TGetUserParams) => {
    const { clerkId, email } = params;

    return await this.usersRepository.getOrProvisionByClerkId({
      clerkId,
      email,
    });
  };
}
