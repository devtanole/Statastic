export interface Auth {
  username: string;
  password: string;
}

export interface User {
  userId: number;
  fullName: string;
  username: string;
  hashedPassword: string;
  createdAt: string;
  updatedAt: string;
}
