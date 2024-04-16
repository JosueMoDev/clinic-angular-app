import { LastUpdate } from "../interfaces";
interface AccountOptions {
  id: string;
  duiNumber: string;
  email: string;
  name: string;
  lastname: string;
  gender: string;
  phone: string;
  isValidated: boolean;
  role: string;
  photoUrl?: string;
  photoId?: string;
  createdAt: Date;
  lastUpdate?: LastUpdate[];
}
export class Account {
  public id: string;
  public duiNumber: string;
  public email: string;
  public name: string;
  public lastname: string;
  public gender: string;
  public phone: string;
  public isValidated: boolean;
  public role: string;
  public photoUrl?: string;
  public photoId?: string;
  public createdAt: Date;
  public lastUpdate?: LastUpdate[];

  constructor(options: AccountOptions) {
    this.id = options.id;
    this.duiNumber = options.duiNumber;
    this.email = options.duiNumber;
    this.name = options.name;
    this.lastname = options.lastname;
    this.gender = options.gender;
    this.phone = options.phone;
    this.isValidated = options.isValidated;
    this.role = options.role;
    this.photoUrl = options.photoUrl ?? '';
    this.photoId = options.photoId;
    this.createdAt = new Date(options.createdAt);
    this.lastUpdate = options.lastUpdate;
  }
}