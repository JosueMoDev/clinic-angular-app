export interface ClinicResponse {
  pagination: Pagination;
  clinics: Clinic[];
}

export interface Clinic {
  id: string;
  registerNumber: string;
  name: string;
  phone: string;
  address: Address;
  photoUrl: string;
  photoId: string;
  createdAt: Date;
  createdBy: string;
  status: boolean;
  lastUpdate: LastUpdate[];
}

export interface Address {
  city: string;
  street: string;
  state: string;
}

export interface LastUpdate {
  account: string;
  date: Date;
  action: string;
}

export interface Pagination {
  currentPage: number;
  nextPage: string;
  previousPage: null;
  pageSize: number;
  total: number;
}
