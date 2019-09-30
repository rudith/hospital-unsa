import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { UIModule } from '../ui/ui.module';

import { BaseLayoutComponent } from './base-layout';
import { HorizontalLayoutComponent } from './horizontal';
import { VerticalLayoutComponent } from './vertical';
import { PublicLayoutComponent } from './public';

import { NavbarComponent } from './components/navbar';
import { MenuComponent } from './components/menu';
import { FooterComponent } from './components/footer';
import { LogoComponent } from './components/logo';
import { SearchComponent } from './components/search';
import { ActionsComponent } from './components/actions';
import { LoginFormComponent } from './components/login-form';
import { RegisterFormComponent } from './components/register-form';
import { NavbarSkeletonComponent } from './components/navbar-skeleton';
import { SettingsComponent } from './components/settings';

import {ToastModule} from 'primeng/toast';
import {MenubarModule} from 'primeng/menubar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MalihuScrollbarModule.forRoot(),
    UIModule,
    ToastModule,
    MenubarModule
  ],
  declarations: [
    BaseLayoutComponent,
    HorizontalLayoutComponent,
    VerticalLayoutComponent,

    NavbarComponent,
    MenuComponent,
    FooterComponent,
    LogoComponent,
    SearchComponent,
    ActionsComponent,
    PublicLayoutComponent,
    LoginFormComponent,
    RegisterFormComponent,
    NavbarSkeletonComponent,
    SettingsComponent
    
  ],
  exports: [
    LoginFormComponent,
    RegisterFormComponent,
    SettingsComponent
  ]
})
export class LayoutModule { }
