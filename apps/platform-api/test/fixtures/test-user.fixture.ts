import { fixtureEmail, fixtureId } from "./factory";

export const buildTestUserFixture = () => {
  const userId = fixtureId();

  return {
    userId,
    email: fixtureEmail(),
  };
};
