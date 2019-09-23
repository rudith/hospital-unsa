import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';

import { PageDashboardComponent } from '../pages/dashboards/dashboard-1';
import { PageButtonsComponent } from '../pages/ui/components/buttons';
import { PageCardsComponent } from '../pages/ui/components/cards';
import { PageInputsComponent } from '../pages/ui/components/inputs';
import { PageSelectsComponent } from '../pages/ui/components/selects';
import { PageTextareasComponent } from '../pages/ui/components/textareas';
import { PageAutocompletesComponent } from '../pages/ui/components/autocompletes';
import { PageBadgesComponent } from '../pages/ui/components/badges';
import { PageRatingsComponent } from '../pages/ui/components/ratings';
import { PageSimpleTablesComponent } from '../pages/ui/tables/simple-tables';
import { PageSortingTableComponent } from '../pages/ui/tables/sorting-table';
import { PageSearchTableComponent } from '../pages/ui/tables/search-table';
import { PageFilterTableComponent } from '../pages/ui/tables/filter-table';
import { PagePaginationTableComponent } from '../pages/ui/tables/pagination-table';
import { PageAlertsComponent } from '../pages/ui/components/alerts';
import { PageCheckboxesComponent } from '../pages/ui/components/checkboxes';
import { PageRadioButtonsComponent } from '../pages/ui/components/radio-buttons';
import { PageSwitchersComponent } from '../pages/ui/components/switchers';
import { PageFormElementsComponent } from '../pages/ui/forms/form-elements';
import { PageFormLayoutsComponent } from '../pages/ui/forms/form-layouts';
import { PageFormValidationComponent } from '../pages/ui/forms/form-validation';
import { PageNg2ChartsComponent } from '../pages/ui/charts/ng2-charts';
import { PageNgxChartsComponent } from '../pages/ui/charts/ngx-charts';
import { PageNgxEchartsComponent } from '../pages/ui/charts/ngx-echarts';
import { PageGoogleMapsComponent } from '../pages/ui/maps/google-maps';
import { PageWorldMapComponent } from '../pages/ui/maps/world-map';
import { PageTypographyComponent } from '../pages/ui/typography';
import { PageIconsOptionsComponent } from '../pages/ui/icons/icons-options';
import { PageIconsIfComponent } from '../pages/ui/icons/icons-if';
import { PageIconsSliComponent } from '../pages/ui/icons/icons-sli';
import { PageContactsComponent } from '../pages/ui/components/contacts';
import { PageDoctorsComponent } from '../pages/medicine/doctors';
import { PagePatientsComponent } from '../pages/medicine/patients';
import { PageModalWindowsComponent } from '../pages/ui/components/modal-windows';
import { PageDoctorProfileComponent } from '../pages/medicine/doctor-profile';
import { PagePaymentsComponent } from '../pages/medicine/payments';
import { PageAppointmentsComponent } from '../pages/medicine/appointments';
import { PageDepartmentsComponent } from '../pages/medicine/departments';
import { Page404Component } from '../pages/page-404';
import { PageLeafletMapsComponent } from '../pages/ui/maps/leaflet-maps';
import { PageVTimelineComponent } from '../pages/ui/components/v-timeline';
import { PagePatientProfileComponent } from '../pages/medicine/patient-profile';
import { PageInvoiceComponent } from '../pages/apps/service-pages/invoice';
import { PagePricingComponent } from '../pages/apps/service-pages/pricing';
import { PageTimelineComponent } from '../pages/apps/service-pages/timeline';
import { PageUserProfileComponent } from '../pages/apps/service-pages/user-profile';
import { PageEditAccountComponent } from '../pages/apps/service-pages/edit-account';
import { PageCalendarComponent } from '../pages/apps/service-pages/calendar';
import { PageSignInComponent } from '../pages/apps/sessions/sign-in';
import { PageSignUpComponent } from '../pages/apps/sessions/sign-up';
import { PageSettingsComponent } from '../pages/settings';
import { PageSearchPaginationTableComponent } from '../pages/ui/tables/search-pagination-table';
import { CitasComponent } from '../pages/Admision/citas/citas.component';
import { HistorialComponent } from '../pages/Admision/historial/historial.component';
import { EditarComponent } from '../pages/Administrador/editar/editar.component';
import {ListarDatosComponent} from '../pages/Triaje/listar-datos/listar-datos.component';
import { ConsultasComponent } from '../pages/Consultorio/consultas/consultas.component';
import { ListarConsultasComponent } from '../pages/Consultorio/listar-consultas/listar-consultas.component';

const VERTICAL_ROUTES: Routes = [
  { path: 'default-dashboard', component: PageDashboardComponent },
  { path: 'doctors', component: PageDoctorsComponent },
  { path: 'doctor-profile', component: PageDoctorProfileComponent },
  { path: 'patients', component: PagePatientsComponent },
  { path: 'patient-profile', component: PagePatientProfileComponent },
  { path: 'payments', component: PagePaymentsComponent },
  { path: 'appointments', component: PageAppointmentsComponent },
  { path: 'departments', component: PageDepartmentsComponent },

  { path: 'alerts', component: PageAlertsComponent },
  { path: 'buttons', component: PageButtonsComponent },
  { path: 'cards', component: PageCardsComponent },
  { path: 'inputs', component: PageInputsComponent },
  { path: 'selects', component: PageSelectsComponent },
  { path: 'textareas', component: PageTextareasComponent },
  { path: 'autocompletes', component: PageAutocompletesComponent },
  { path: 'badges', component: PageBadgesComponent },
  { path: 'ratings', component: PageRatingsComponent },
  { path: 'checkboxes', component: PageCheckboxesComponent },
  { path: 'contacts', component: PageContactsComponent },
  { path: 'radio-buttons', component: PageRadioButtonsComponent },
  { path: 'switchers', component: PageSwitchersComponent },
  { path: 'modal-windows', component: PageModalWindowsComponent },
  { path: 'v-timeline', component: PageVTimelineComponent },
  { path: 'simple-table', component: PageSimpleTablesComponent },
  { path: 'sorting-table', component: PageSortingTableComponent },
  { path: 'search-table', component: PageSearchTableComponent },
  { path: 'search-pagination-table', component: PageSearchPaginationTableComponent },
  { path: 'filtering-table', component: PageFilterTableComponent },
  { path: 'pagination-table', component: PagePaginationTableComponent },
  { path: 'form-elements', component: PageFormElementsComponent },
  { path: 'form-layout', component: PageFormLayoutsComponent },
  { path: 'form-validation', component: PageFormValidationComponent },
  { path: 'ng2-charts', component: PageNg2ChartsComponent },
  { path: 'ngx-charts', component: PageNgxChartsComponent },
  { path: 'ngx-echarts', component: PageNgxEchartsComponent },
  { path: 'google-map', component: PageGoogleMapsComponent },
  { path: 'leaflet-map', component: PageLeafletMapsComponent },
  { path: 'world-map', component: PageWorldMapComponent },
  { path: 'typography', component: PageTypographyComponent },
  { path: 'icons-options', component: PageIconsOptionsComponent },
  { path: 'icons-if', component: PageIconsIfComponent },
  { path: 'icons-sli', component: PageIconsSliComponent },

  { path: 'invoices', component: PageInvoiceComponent },
  { path: 'pricing', component: PagePricingComponent },
  { path: 'events-timeline', component: PageTimelineComponent },
  { path: 'user-profile', component: PageUserProfileComponent },
  { path: 'edit-account', component: PageEditAccountComponent },
  { path: 'events-calendar', component: PageCalendarComponent },
  { path: 'settings', component: PageSettingsComponent },
  { path: 'citas', component: CitasComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'adminUser', component: EditarComponent },
  { path: 'listar-datos', component: ListarDatosComponent },
  { path: 'consultas', component: ConsultasComponent },
  { path: 'Lconsultas', component: ListarConsultasComponent },
  { path: '**', component: Page404Component }
];

const PUBLIC_ROUTES: Routes = [
  { path: 'sign-in', component: PageSignInComponent },
  { path: 'sign-up', component: PageSignUpComponent },
];

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/public/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: '**',
    component: VerticalLayoutComponent,
    children: VERTICAL_ROUTES
  }
];

@NgModule({
  imports: [

  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
