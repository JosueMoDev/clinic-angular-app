import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//* Components
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddButtonComponent } from './add-button/add-button.component';
import { SetterThemeComponent } from './setter-theme/setter-theme.component';
import { RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AddButtonComponent,
    SetterThemeComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AddButtonComponent,
    SetterThemeComponent
  ]
})
export class SharedModule { }
