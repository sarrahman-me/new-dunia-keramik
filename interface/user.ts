export interface IUser {
  nama: string;
  username: string;
  password: string;
  permissions: string[];
  updatedAt: Date;
  createdAt: Date;
  lastLogin: Date
}
