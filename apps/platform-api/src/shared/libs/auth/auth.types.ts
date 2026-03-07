import { Request } from 'express';

export type TAuthData = {
  userId: string;
  email: string;
};

export type TAuthenticatedRequest = Request & {
  auth: TAuthData;
};
