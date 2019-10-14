import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { IPatient } from '../../../interfaces/patient';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { Historial } from '../../../../app/interfaces/historial';
import { HttpClient } from '@angular/common/http';
import { Triaje } from '../../../../app/interfaces/triaje';
import { Cita } from '../../../../app/interfaces/cita';
import { CitaM } from '../../../../app/interfaces/cita-m';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-datos',
  templateUrl: './listar-datos.component.html',
  styleUrls: ['./listar-datos.component.scss']
})
export class ListarDatosComponent extends BasePageComponent implements OnInit, OnDestroy {
  patients: IPatient[];
  citas: Cita[];
  citasTriaje:CitaM[];
  triaje: Triaje[];
  patientForm2: FormGroup;
  today: Date;
  dato: string;
  opBus: string;
  busForm: FormGroup;
  dni2: string;
  historial: Historial[];
  idT: number;
  idCita:number;
  cabTri:FormGroup;
  n:string;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private modal: TCModalService,
    private http: HttpClient,
    private toastr: ToastrService,

  ) {
    super(store, httpSv);
    this.pageData = {
      title: 'Triaje',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Medicine',
          route: 'default-dashboard'
        },
        {
          title: 'Triaje'
        },
        {
          title: 'Search'
        },

      ]
    };
    this.citasTriaje=[];
    this.patients = [];
    this.triaje = [];
    this.citas = [];
    this.cargarCitas();
  }

  //Metodo que carga todas las citas que esten con el estado de cita 'Espera'
  //a traves del servicio : loadCitasT()
  cargarCitas() {
    this.httpSv.loadCitasT().subscribe(citas => {
      this.citasTriaje = citas
    });
  }

  //Metodo que recibe el dni para buscar los triajes correspondientes a ese dni
  buscartriaje(dni: string) {
    this.toastr.warning( 'Buscando');
    console.log("buscando");
    this.httpSv.searchHistoriaTriaje(dni).subscribe(data => {
      this.citasTriaje=data.citas;
    },
    error => {
      console.log(error.message);
      this.toastr.error("No se encontro ningun triaje con ese dni");
    });
  }

  //metodo que recibe el formGroup desde el html para poder obtener el dni
  buscar(busca: FormGroup) {
    this.dato = busca.get('datoBus').value;
    this.buscartriaje(this.dato);
  }

  //metodo encragado de inicializar una vez que se crague la pagina
  ngOnInit() {
    super.ngOnInit();
    this.initBusForm();
    this.store.select('citas').subscribe(citas => {
      if (citas && citas.length) {
        this.citas = citas;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  //Metodo para abrir el modal de crear triaje donde se muestran datos del paciente y el form correspondiente
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: any) {
    this.initPatientForm2(row);
    this.initFormModCita(row);
    this.idCita=row.id;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  //Metodo para cerrar el modal de Crear Triaje 
  closeModal() {
    this.modal.close();
  }

  //Metodo que inicializa el form de busqueda
  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ['', Validators.required],
    });
  }

  //Metodo para inicializar el form que mostrara datos del paciente en el modal
  initFormModCita(data:any ) {
    this.n=data.numeroHistoria.nombres+" "+data.numeroHistoria.apellido_paterno;
		this.cabTri = this.formBuilder.group({
			numeroHistoria: [data.numeroHistoria.numeroHistoria ? data.numeroHistoria.numeroHistoria:'', Validators.required],
      dni: [data.numeroHistoria.dni ?data.numeroHistoria.dni : '', Validators.required],
      nombres:[this.n ? this.n:'', Validators.required]
		});
	}
  
  //Metodo para inicializar el form en donde se llenaran los datos a actualizar
  initPatientForm2(ci: Cita) {
    this.patientForm2 = this.fb.group({
      talla: ['', [Validators.required, Validators.pattern('[0-9].[0-9]*')]],
      peso: ['', [Validators.required, Validators.pattern('[0-9]*.[0-9]*')]],
      temperatura: ['', [Validators.required, Validators.pattern('[0-9]*.[0-9]*')]],
      frecuenciaR: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      frecuenciaC: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      presionArt: ['', [Validators.required, Validators.pattern('[0-9]*/[0-9]*')]],
      numeroHistoria: [ci.numeroHistoria ? ci.numeroHistoria : '', Validators.required],//capturara el id de historial
      cita: [ci.id ? ci.id : '', Validators.required],   //ID de la cita
    });

  }

  //Metodo para crear el triaje
  CreateTriaje(form: FormGroup,) {
    if (form.valid) {
      let newTriaje: Triaje = form.value;
      console.log('entra al envio');
      newTriaje.personal = 2;
      newTriaje.talla = parseInt(form.get('talla').value);
      newTriaje.peso = parseInt(form.get('peso').value);
      newTriaje.frecuenciaC = parseInt(form.get('frecuenciaC').value);
      newTriaje.frecuenciaR = parseInt(form.get('frecuenciaR').value);
      newTriaje.temperatura = parseInt(form.get('temperatura').value);
      console.log(newTriaje.talla);
      console.log(newTriaje);
      this.httpSv.crearTriaje(newTriaje);
      this.TriarCita(this.idCita);
      this.closeModal();
      this.toastr.success('', 'Triaje Creado');
    }
  }
   //Metodo para cambiar el estado de la cita a Triado
  TriarCita(id: number) {
				this.httpSv.TriarCita(id).subscribe(cita => {
					this.cargarCitas();
				});
	}
}




