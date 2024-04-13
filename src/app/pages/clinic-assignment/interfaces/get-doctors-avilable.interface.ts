import { Account } from "src/app/authentication/interfaces";
import { Pagination } from "src/app/interfaces/pagination.interface";

export interface GetDoctorsAvilableResponse {
    doctors: Account[] | [];
    pagination?: Pagination;
}