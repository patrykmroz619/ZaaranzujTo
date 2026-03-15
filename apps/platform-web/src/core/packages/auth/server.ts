import { currentUser, auth } from "@clerk/nextjs/server";
import type { TUser } from "./index";

export const getCurrentUser = async (): Promise<TUser | null> => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.emailAddresses[0]?.emailAddress || "",
  };
};

export const getSession = async () => {
  const session = await auth();

  return {
    userId: session.userId,
    sessionId: session.sessionId,
  };
};
