import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//* Components
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddButtonComponent } from './add-button/add-button.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AddButtonComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AddButtonComponent
  ]
})
export class SharedModule { }
