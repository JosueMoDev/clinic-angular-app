import { Component } from '@angular/core';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchingService } from 'src/app/services/searching.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { EditAppointmentComponent } from '../../appointments/components';


@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styles: [
  ]
})
export class SearchingComponent {
  public openSearchBar: boolean = false;
  public searchForm!: FormGroup;
  public searchResults$!: Observable<any[]> | undefined;
  public data = []


  constructor(
    private searchingService: SearchingService,
    private formBuilder: FormBuilder,
    public matdialig: MatDialog,
  ) { }

  ngOnInit(){
    this.searchForm = this.formBuilder.group({
      searchInput: ['']
    });
    this.searchResults$ = this.searchForm.get('searchInput')?.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      switchMap(async (searchText: string) => {
        return await this.searchAsync(searchText);
      })
    );
  }
  get toggleOpenBar(){ return !this.openSearchBar}

  async searchAsync(searchText: string): Promise<any[]> {
    if (!searchText) {
      return[]
    }
    this.searchingService.getResponse(searchText).subscribe(
      (resp: any) => {
        this.data = resp.data
        this.toggleOpenBar;
      })
      return [...this.data] ;
  }

  setProfileUser(profile: any) {
    this.searchForm.patchValue({ searchInput : null })
    this.toggleOpenBar;
    // this.updateProfileService.userToUpdate(profile)
  }
  setProfileClinic(profile: any) {
    this.searchForm.patchValue({ searchInput : null })
    this.toggleOpenBar;
    // this.updateProfileService.clinicToUpdate(profile)
  }
  editEvent(appointment: Appointment): void {
    this.searchForm.patchValue({ searchInput : null })
    this.toggleOpenBar;
    this.matdialig.open(EditAppointmentComponent, {
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: {
        // clinic: appointment.clinic,
        doctor: appointment.doctor,
        start: appointment.start,
        doctor_info: appointment.doctor,
        // clinic_info: appointment.clinic_info,
        appointment_id: appointment.id,
        patient: appointment.patient,
        // title: appointment.title
      }
    });
  }
    
} 
