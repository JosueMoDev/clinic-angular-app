import { AppointmentService } from './services/appoinment.service';
import { AppState } from 'src/app/app.reducer';
import { Component, inject } from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Clinic } from 'src/app/models/clinic.model';
import { EditAppointmentComponent, CreateAppointmentComponent } from './components';
import { isSameDay, isSameMonth } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import * as ui from 'src/app/store/actions/ui.actions';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointments.component.html',
  styles: [],
})
export class AppointmentComponent {
  private readonly appointmentService = inject(AppointmentService);
  private readonly store = inject(Store<AppState>);
  public uiSubscription!: Subscription;
  public clinicList: Clinic[] = [];

  //? Angular Calendar
  public activeDayIsOpen: boolean = true;
  public CalendarView = CalendarView;
  public events: CalendarEvent[] = [];
  public refresh = new Subject<void>();
  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();

  constructor(public matdialig: MatDialog) {}

  ngOnInit(): void {
    this.getAllAppointments();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.getAllAppointments();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  getAllAppointments() {
    this.appointmentService
      .getAllAppointments()
      .subscribe(({ appointments }: any) => {
        this.events = appointments;
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.editEvent(event);
  }

  editEvent(event: CalendarEvent): void {
    this.matdialig.open(EditAppointmentComponent, {
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { ...event },
    });
  }

  addEvent(): void {
    this.matdialig.open(CreateAppointmentComponent, {
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
