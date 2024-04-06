import { createAction, props } from '@ngrx/store';
import { Account } from 'src/app/models/account.model';
import { Clinic } from 'src/app/models/clinic.model';


export const isLoadingTable = createAction('[UI Tables] Is Loading');
export const isLoadedUserTable = createAction('[UI Tables] Load Users',
    props < { itemList: Account[] }>()
);
export const isLoadedPatientTable = createAction('[UI Tables] Load Patients',
    props < { itemList: Account[] }>()
);
export const isLoadedClinicTable = createAction('[UI Tables] Load Clinics',
    props < { itemList: Clinic[] }>()
);
