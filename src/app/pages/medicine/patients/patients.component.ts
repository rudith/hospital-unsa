import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { IPatient } from '../../../interfaces/patient';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import {Historial} from '../../../../app/interfaces/historial';
import { HttpClient } from '@angular/common/http';
import {Triaje} from '../../../../app/interfaces/triaje';
import {Cita}from '../../../../app/interfaces/cita'

@Component({
  selector: 'page-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PagePatientsComponent extends BasePageComponent implements OnInit, OnDestroy {
  patients: IPatient[];
  citas: Cita[];
  triaje:Triaje[];
  patientForm1: FormGroup;
  patientForm2: FormGroup;
  today:Date;
  dato:string;
  opBus:string;
  busForm: FormGroup;
  dni2:string;
  historial: Historial[];

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private modal: TCModalService,
    private http: HttpClient
    
    
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
          title: 'Al'
        },
        {
          title: 'Al'
        },
        
      ]
    };
    this.patients = [];
    this.triaje=[];
    this.citas = [];
    this.loadCitas();
  }

  loadCitas() {
		this.httpSv.loadCitas().subscribe(citas => {
			this.citas = citas
		});
	}
 
  buscartriaje(dni: string){
    this.httpSv.searchHistoriaTriaje(dni).subscribe(data => {
     // this.citas = data.citas;
      //this.dni2 =data.dni;
      console.log("entro busqueda"+ dni);
    });;
  }

  buscar(busca:FormGroup){

    this.dato=busca.get('datoBus').value;
    this.buscartriaje(this.dato);
  }
  
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

  // open modal window
  openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: any) 
  {
    this.initPatientForm1(row,row);
    this.initPatientForm2(row,row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  // close modal window
  closeModal() {
    this.modal.close();
    this.patientForm1.reset();
  }

  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ['', Validators.required],
    });
  }
  // init form
   initPatientForm1(ci: Cita,his: Historial) {
    this.patientForm1 = this.fb.group({
      numeroHistoria:[his.numeroHistoria ? his.numeroHistoria: '', Validators.required],
      especialidad:[ci.especialidad ? ci.especialidad: '', Validators.required],
      fechaAtencion:[ci.fechaAtencion ? ci.fechaAtencion :'', Validators.required],


      
    });
  }
 
  initPatientForm2(ci: Cita, his: Historial) {
    this.patientForm2=this.fb.group({
      talla:['', Validators.required ],
      peso:['', Validators.required ],
      temperatura:['', Validators.required],
      frecuenciaR: ['', Validators.required],
      frecuenciaC: ['', Validators.required],
      presionArt: ['', Validators.required],
      numeroHistoria2:[his.id ?his.id: '', Validators.required],//capturara el id de historial
      cita:[ci.id ? ci.id:'', Validators.required],   //ID de la cita
            
    });

  }

  // Crear Triaje
  CreateTriaje(form: FormGroup) {
    console.log('estra al createTriaje')
    if (form.valid) {
      let newTriaje: Triaje = form.value;
      console.log('entra al envio');
      newTriaje.personal= 1;
      
      
      console.log(newTriaje);
      console.log("va al servicio")
      this.httpSv.crearTriaje(newTriaje);
      
      this.closeModal();
      this.patientForm1.reset();
    

    }
  }
  

}



