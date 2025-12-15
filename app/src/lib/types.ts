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
  profilePictureUrl: string | null;
};

export type Message = {
  id: number;
  content: string;
  createdAt?: Date;
  userId?: number;
  user?: {
    id: number;
    username: string;
    profilePictureUrl: string | null;
  };
};
