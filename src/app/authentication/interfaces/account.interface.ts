import { LastUpdate } from "src/app/pages/appointments/interfaces/appointment-response.interface";

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
