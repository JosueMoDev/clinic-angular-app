import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material.module'; 
import { RouterModule } from '@angular/router';

//* Components
import { AddButtonComponent } from './add-button/add-button.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SetterThemeComponent } from './setter-theme/setter-theme.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    AddButtonComponent,
    BreadcrumbsComponent,
    CalendarComponent,
    FooterComponent,
    HeaderComponent,
    SetterThemeComponent,
    SidebarComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    AddButtonComponent,
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SetterThemeComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
