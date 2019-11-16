import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { environment } from '../../environments/environment';
import { UIModule } from '../ui/ui.module';
import { LayoutModule } from '../layout/layout.module';
import { BasePageComponent } from './base-page';

import { PageDashboardComponent } from './dashboards/dashboard-1';
import { PageButtonsComponent } from './ui/components/buttons';
import { PageCardsComponent } from './ui/components/cards';
import { PageInputsComponent } from './ui/components/inputs';
import { PageSelectsComponent } from './ui/components/selects';
import { PageTextareasComponent } from './ui/components/textareas';
import { PageAutocompletesComponent } from './ui/components/autocompletes';
import { PageBadgesComponent } from './ui/components/badges';
import { PageRatingsComponent } from './ui/components/ratings';
import { PageSimpleTablesComponent } from './ui/tables/simple-tables';
import { PageSortingTableComponent } from './ui/tables/sorting-table';
import { PageSearchTableComponent } from './ui/tables/search-table';
import { PageFilterTableComponent } from './ui/tables/filter-table';
import { PagePaginationTableComponent } from './ui/tables/pagination-table';
import { PageSearchPaginationTableComponent } from './ui/tables/search-pagination-table';
import { PageAlertsComponent } from './ui/components/alerts';
import { PageCheckboxesComponent } from './ui/components/checkboxes';
import { PageRadioButtonsComponent } from './ui/components/radio-buttons';
import { PageSwitchersComponent } from './ui/components/switchers';
import { PageFormElementsComponent } from './ui/forms/form-elements';
import { PageFormLayoutsComponent } from './ui/forms/form-layouts';
import { PageFormValidationComponent } from './ui/forms/form-validation';
import { PageNg2ChartsComponent } from './ui/charts/ng2-charts';
import { PageNgxChartsComponent } from './ui/charts/ngx-charts';
import { PageNgxEchartsComponent } from './ui/charts/ngx-echarts';
import { PageGoogleMapsComponent } from './ui/maps/google-maps';
import { PageWorldMapComponent } from './ui/maps/world-map';
import { PageTypographyComponent } from './ui/typography';
import { PageIconsOptionsComponent } from './ui/icons/icons-options';
import { PageIconsIfComponent } from './ui/icons/icons-if';
import { PageIconsSliComponent } from './ui/icons/icons-sli';
import { PageContactsComponent } from './ui/components/contacts';
import { PageModalWindowsComponent } from './ui/components/modal-windows';
import { PageDoctorsComponent } from './medicine/doctors';
import { PagePatientsComponent } from './medicine/patients';
import { PageDoctorProfileComponent } from './medicine/doctor-profile';
import { PagePaymentsComponent } from './medicine/payments';
import { PageAppointmentsComponent } from './medicine/appointments';
import { PageDepartmentsComponent } from './medicine/departments';
import { Page404Component } from './page-404';
import { PageLeafletMapsComponent } from './ui/maps/leaflet-maps';
import { PageVTimelineComponent } from './ui/components/v-timeline';
import { PagePatientProfileComponent } from './medicine/patient-profile';
import { PageInvoiceComponent } from './apps/service-pages/invoice';
import { PagePricingComponent } from './apps/service-pages/pricing';
import { PageTimelineComponent } from './apps/service-pages/timeline';
import { PageUserProfileComponent } from './apps/service-pages/user-profile';
import { PageEditAccountComponent } from './apps/service-pages/edit-account';
import { PageCalendarComponent } from './apps/service-pages/calendar';
import { PageSignInComponent } from './apps/sessions/sign-in';
import { PageSignUpComponent } from './apps/sessions/sign-up';
import { PageSettingsComponent } from './settings';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ListarDatosComponent } from './Triaje/listar-datos/listar-datos.component';
import { CitasComponent } from './Admision/citas/citas.component';
import { HistorialComponent } from './Admision/historial/historial.component';
import { EditarComponent } from './Administrador/editar/editar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastModule} from 'primeng/toast';
import { ConsultasComponent } from './Consultorio/consultas/consultas.component';
import { ListarConsultasComponent } from './Consultorio/listar-consultas/listar-consultas.component';
import { LaboratorioComponent } from './Lab/laboratorio/laboratorio.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { PersonalComponent } from './Administrador/personal/personal.component';
import { AreaComponent } from './Administrador/area/area.component';
import { EspecialidadComponent } from './Administrador/especialidad/especialidad.component';
import { TipoPersonalComponent } from './Administrador/tipo-personal/tipo-personal.component';
import { OrdenesComponent } from './Lab/ordenes/ordenes.component';
import { ConexionLaboratorioComponent } from './Admision/conexion-laboratorio/conexion-laboratorio.component';
import { HistorialCitasComponent } from './Admision/historial-citas/historial-citas.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ChartsModule,
    NgxChartsModule,
    NgxEchartsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey
    }),
    LeafletModule,
    FullCalendarModule,
    UIModule,
    LayoutModule,
    ToastModule,
    ConfirmDialogModule
  ],
  declarations: [
    BasePageComponent,
    PageDashboardComponent,
    PageAlertsComponent,
    PageButtonsComponent,
    PageCardsComponent,
    PageInputsComponent,
    PageSelectsComponent,
    PageTextareasComponent,
    PageAutocompletesComponent,
    PageBadgesComponent,
    PageRatingsComponent,
    PageCheckboxesComponent,
    PageRadioButtonsComponent,
    PageSwitchersComponent,
    PageTypographyComponent,
    PageSimpleTablesComponent,
    PageSortingTableComponent,
    PageSearchTableComponent,
    PageFilterTableComponent,
    PagePaginationTableComponent,
    PageSearchPaginationTableComponent,
    PageFormElementsComponent,
    PageFormLayoutsComponent,
    PageFormValidationComponent,
    PageNg2ChartsComponent,
    PageNgxChartsComponent,
    PageNgxEchartsComponent,
    PageGoogleMapsComponent,
    PageWorldMapComponent,
    PageIconsOptionsComponent,
    PageIconsIfComponent,
    PageIconsSliComponent,
    PageContactsComponent,
    PageDoctorsComponent,
    PagePatientsComponent,
    PageModalWindowsComponent,
    PageDoctorProfileComponent,
    PagePaymentsComponent,
    PageAppointmentsComponent,
    PageDepartmentsComponent,
    Page404Component,
    PageLeafletMapsComponent,
    PageVTimelineComponent,
    PagePatientProfileComponent,
    PageInvoiceComponent,
    PagePricingComponent,
    PageTimelineComponent,
    PageUserProfileComponent,
    PageEditAccountComponent,
    PageCalendarComponent,
    PageSignInComponent,
    PageSignUpComponent,
    PageSettingsComponent,
    ListarDatosComponent,
    HistorialComponent,
    CitasComponent,
    EditarComponent,
    ConsultasComponent,
    ListarConsultasComponent,
    LaboratorioComponent,
    PersonalComponent,
    AreaComponent,
    EspecialidadComponent,
    TipoPersonalComponent,
    OrdenesComponent,
    ConexionLaboratorioComponent,
    HistorialCitasComponent
  ],
  exports: [],
  entryComponents: []
})
export class PagesModule { }
