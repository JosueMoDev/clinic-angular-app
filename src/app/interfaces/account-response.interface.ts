import { LastUpdate, Pagination } from "src/app/interfaces";

export interface AccountResponse {
  pagination: Pagination;
  accounts: Account[];
}

export interface Account {
  id: string;
  duiNumber: string;
  email: string;
  name: string;
  lastname: string;
  gender: string;
  phone: string;
  isValidated: boolean;
  role: string;
  photoUrl: string;
  photoId: string;
  createdAt: Date;
  lastUpdate: LastUpdate[];
}