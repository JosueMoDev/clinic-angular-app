import { Account } from "./account.interface";

export interface LoggedAccount {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

