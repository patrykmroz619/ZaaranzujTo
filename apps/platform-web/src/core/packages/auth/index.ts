export type TUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
};

export { AuthProvider } from './AuthProvider';
