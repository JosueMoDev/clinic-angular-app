
import {
  Component,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatDialog} from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../components/appointment-dialog/appointment-dialog.component';
import { AppoinmentService } from '../../services/appoinment.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls:['./dashboard.component.css'],
  styles: []
})
export class DashboardComponent {

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public refresh = new Subject<void>();
  public events: CalendarEvent[] = [];
  public activeDayIsOpen: boolean = true;
  public uiSubscription!: Subscription;
  constructor(
    private appointmentService: AppoinmentService,
    private store: Store<AppState>,
    public matdialig: MatDialog,
  ) { }
  ngOnInit(): void {
    this.getAllAppointments() 
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.getAllAppointments();
      }
    })
    
  }

  getAllAppointments() {
    this.appointmentService.getAllAppointments().subscribe(  ({ appointments }:any) => {this.events = appointments;})
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.matdialig.open(AppointmentDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data:{ event, action }
    });
  }

  addEvent(): void {
    this.matdialig.open(AppointmentDialogComponent, {
      width:'100%',
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
