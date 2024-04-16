import { Account } from "src/app/interfaces/account-response.interface";

export interface LoggedAccount {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

