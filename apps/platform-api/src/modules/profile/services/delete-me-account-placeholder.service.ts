import { Injectable, NotImplementedException } from "@nestjs/common";

type TDeleteMeAccountPlaceholderParams = {
  clerkId: string;
};

@Injectable()
export class DeleteMeAccountPlaceholderService {
  deleteMeAccount = (params: TDeleteMeAccountPlaceholderParams) => {
    const { clerkId } = params;

    throw new NotImplementedException(
      `DELETE /me is not implemented for user ${clerkId}. This flow is planned for WI-08.`,
    );
  };
}
