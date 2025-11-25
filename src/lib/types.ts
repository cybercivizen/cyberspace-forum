export type SessionData = {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  dateOfBirth: Date;
  rolesId: number;
};
