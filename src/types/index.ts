export type UserProfile = {
  uid: string;
  email: string;
  createdAt: Date | null;
};

export type Stock = {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};