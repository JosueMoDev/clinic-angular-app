import { Account } from "src/app/models/account.model";

export interface GetAllAccounts {
    accouts: Account[];
    total: number;
}