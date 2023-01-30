import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//* Components
import { FooterComponent } from './footer/footer.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddButtonComponent } from './add-button/add-button.component';
import { SetterThemeComponent } from './setter-theme/setter-theme.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AddButtonComponent,
    SetterThemeComponent
  ],
  imports: [
    CommonModule,
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
