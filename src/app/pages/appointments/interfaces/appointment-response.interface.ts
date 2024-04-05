export interface AppointmentResponse {
  pagination: Pagination;
  appointments: Appointment[];
}

export interface Appointment {
  id: string;
  startDate: Date;
  endDate: Date;
  doctorId: string;
  patientId: string;
  createdAt: Date;
  createdBy: string;
  lastUpdate: LastUpdate[];
}

export interface LastUpdate {
  account: string;
  date: Date;
  action: string;
}

export interface Pagination {
  currentPage: number;
  nextPage: null;
  previousPage: null;
  pageSize: number;
  total: number;
}
