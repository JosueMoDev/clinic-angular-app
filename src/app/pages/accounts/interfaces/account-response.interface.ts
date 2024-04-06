import { Account } from "src/app/authentication/interfaces";
import { Pagination } from "src/app/interfaces/pagination.interface";

export interface AccountResponse {
  pagination: Pagination;
  accounts: Account[];
}
