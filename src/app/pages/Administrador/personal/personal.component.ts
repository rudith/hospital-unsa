import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../../services/Administrador/administrador.service';
import { Area } from '../../../interfaces/area';
// import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../services/http/http.service';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent  extends BasePageComponent implements OnInit {
  id: number;
  areas: Area[];
  appointmentForm: FormGroup;
  constructor(
    httpSv: HttpService, private admService: AdministradorService,
    private toastr: ToastrService,store: Store<IAppState>,
    private modal: TCModalService,private formBuilder: FormBuilder,
    // private conf: ConfirmationService
    ) {
    super(store, httpSv);
    this.pageData = {
			title: 'Personal (no implementado)',
			loaded: true,
			breadcrumbs: [
				{
					title: 'UI Kit',
					route: 'default-dashboard'
				},
				{
					title: 'Tables',
					route: 'default-dashboard'
				},
				{
					title: 'Areas'
				}
				,
				{
					title: 'Search'
				}
			]
		};
    
    this.loadAreas();
  }

  // TODO ESTO SE REESTRUCTURARA ES UN COPIA Y PEGA DE AREA PARA QUE NO HAYA ERRORES AL MOMENTO DE DEPLOYARLO
  ngOnInit() {
    super.ngOnInit();
		this.store.select('areas').subscribe(areas => {
			if (areas && areas.length) {
				this.areas = areas;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
  }
  // carga areas
  loadAreas() {
    this.admService.loadAreas().subscribe(areas => {
      this.areas = areas;
    });
  }
  //busca segun el input y devuelve un mensaje de confirmación
  buscar() {
    if (this.id == 0 || this.id == undefined) {
      this.loadAreas();
      this.toastr.warning('Todas las citas cargadas', 'Ningun valor ingresado');
    } else {
      this.admService.searchArea(this.id).subscribe(area => {
        this.areas = [];
        this.areas[0] = area;
        this.toastr.success('Area(s) encontrada(s)');
      }, error => {
        this.toastr.warning('No encontrado');
      });;
    }
  }
  // abre modal
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null) {
		this.initForm();
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
  }
  // cierra modal
  closeModal() {
    this.modal.close();
    
  }
  
  //inicia formulario
  initForm() {
		// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
		this.appointmentForm = this.formBuilder.group({
			nombre: ["", Validators.required]
		});
  }
//agrega area a la bd
  addAppointment(form: FormGroup) {
		// console.log(JSON.stringify(form));
		if (form.valid) {
      let newAppointment: Area = form.value;
      // console.log(JSON.stringify(newAppointment));
      this.admService.createArea(newAppointment);
			this.closeModal();
      this.appointmentForm.reset();
      this.loadAreas();
		}
	}
}

