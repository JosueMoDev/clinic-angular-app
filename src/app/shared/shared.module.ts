import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material.module'; 
import { RouterModule } from '@angular/router';

//* Components
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SetterThemeComponent } from './setter-theme/setter-theme.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
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
    BreadcrumbsComponent,
    HeaderComponent,
    SetterThemeComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
