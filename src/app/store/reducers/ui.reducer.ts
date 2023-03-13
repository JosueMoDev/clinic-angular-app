import { createReducer, on } from '@ngrx/store';
import { Clinic } from 'src/app/models/clinic.model';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { isLoadingTable, isLoadedUserTable, isLoadedClinicTable} from '../actions/ui.actions';

export interface State {
    isLoading: boolean;
    usersList: User[] | Patient[];
    clinicsList: Clinic[]
}

export const initialState: State = {
    isLoading: false,
    usersList: [],
    clinicsList:[]
}

const _uiReducer = createReducer(initialState,

    on(isLoadingTable, state => ({ ...state, isLoading: !state.isLoading })),
    on(isLoadedUserTable, (state, { itemList }) => ({ ...state, usersList: [...itemList] })),
    on(isLoadedClinicTable, (state, { itemList }) => ({ ...state, clinicsList: [...itemList] })),
    

);

export function uiReducer(state:any, action:any) {
    return _uiReducer(state, action);
}