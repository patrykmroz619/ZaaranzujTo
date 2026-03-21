import { faker } from "@faker-js/faker";

export const fixtureId = () => {
  return faker.string.uuid();
};

export const fixtureEmail = () => {
  return faker.internet.email({
    provider: "example.com",
  });
};

export const fixtureNow = () => {
  return faker.date.recent();
};
