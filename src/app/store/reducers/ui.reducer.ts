import { createReducer, on } from '@ngrx/store';
import { Clinic } from 'src/app/models/clinic.model';
import { isLoadingTable, isLoadedUserTable, isLoadedClinicTable, isLoadedPatientTable} from '../actions/ui.actions';
import { Account } from 'src/app/models/account.model';

export interface State {
    isLoading: boolean;
    usersList: Account[];
    patientsList: Account[];
    clinicsList: Clinic[]
}

export const initialState: State = {
    isLoading: false,
    usersList: [],
    patientsList: [],
    clinicsList:[]
}

const _uiReducer = createReducer(initialState,

    on(isLoadingTable, state => ({ ...state, isLoading: !state.isLoading })),
    on(isLoadedUserTable, (state, { itemList }) => ({ ...state, usersList: [...itemList] })),
    on(isLoadedPatientTable, (state, { itemList }) => ({ ...state, patientsList: [...itemList] })),
    on(isLoadedClinicTable, (state, { itemList }) => ({ ...state, clinicsList: [...itemList] })),
    

);

export function uiReducer(state:any, action:any) {
    return _uiReducer(state, action);
}