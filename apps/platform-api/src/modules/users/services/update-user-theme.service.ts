import { Injectable } from "@nestjs/common";

import { UsersRepository } from "../users.repository";

type TUpdateUserThemeParams = {
  clerkId: string;
  theme: string;
};

@Injectable()
export class UpdateUserThemeService {
  constructor(private readonly usersRepository: UsersRepository) {}

  updateUserTheme = async (params: TUpdateUserThemeParams) => {
    const { clerkId, theme } = params;

    return await this.usersRepository.updateThemeByClerkId({
      clerkId,
      theme,
    });
  };
}
