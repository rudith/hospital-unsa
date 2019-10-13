import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { Component, OnInit } from '@angular/core';
import { AdministradorService } from '../../../services/Administrador/administrador.service';
// import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../services/http/http.service';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Especialidad } from '../../../interfaces/especialidad';

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.scss'],
  // providers: [ConfirmationService]
})
export class EspecialidadComponent extends BasePageComponent implements OnInit {
  id: number;
  especialidades: Especialidad[];
  appointmentForm: FormGroup;
  constructor(
    httpSv: HttpService, private admService: AdministradorService,
    private toastr: ToastrService, store: Store<IAppState>,
    private modal: TCModalService, private formBuilder: FormBuilder,
    // private conf: ConfirmationService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Especialidades',
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
          title: 'Especialidades'
        }
        ,
        {
          title: 'Search'
        }
      ]
    };

    this.loadEspecialidades();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.select('especialidades').subscribe(especialidades => {
      if (especialidades && especialidades.length) {
        this.especialidades = especialidades;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }
  //carga especialidades 
  loadEspecialidades() {
    this.admService.loadEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }
  //buscara segun el campo de texto y devuelve un mensaje de confirmación
  buscar() {
    if (this.id == 0 || this.id == undefined) {
      this.loadEspecialidades();
      this.toastr.warning('Todas las Especialidades cargadas', 'Ningun valor ingresado');
    } else {
      this.admService.searchEspecialidad(this.id).subscribe(especialidad => {
        this.especialidades = [];
        this.especialidades[0] = especialidad;
        this.toastr.success('Especialidad(s) encontrada(s)');
      }, error => {
        this.toastr.warning('No encontrado');
      });;
    }
  }
  //abre modal
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null) {
    this.initForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  //cierra modal
  closeModal() {
    this.modal.close();
  }
  //inicia formulario
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required]
    });
  }
  // crea especialidad y devuelve un mensaje de confirmación
  addAppointment(form: FormGroup) {
    // console.log(JSON.stringify(form));
    if (form.valid) {
      let newAppointment: Especialidad = form.value;
      // console.log(JSON.stringify(newAppointment));
      this.admService.createEspecialidad(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
      this.loadEspecialidades();
    }
  }
}

