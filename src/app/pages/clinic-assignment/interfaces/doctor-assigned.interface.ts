import { Account } from "src/app/models/account.model";

export interface DoctorAssigned extends Pick<Account, 'name' | 'lastname' | 'photoUrl' | 'id'> {}