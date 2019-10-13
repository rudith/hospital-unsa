import { Component, OnInit, OnChanges, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { HistoriaCompleta } from '../../../interfaces/historia-completa';
import { IUser } from '../../../ui/interfaces/user';
import { Triaje } from '../../../interfaces/triaje';
import { Consulta } from '../../../interfaces/consulta';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consultas',
  templateUrl: './listar-consultas.component.html',
  styleUrls: ['./listar-consultas.component.scss'],
})
export class ListarConsultasComponent extends BasePageComponent implements OnInit, OnChanges{
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
  paciente: IUser;
  historiaForm: FormGroup;
  consultForm: FormGroup;
  verMasCForm: FormGroup;
  verTriajeForm:FormGroup;
  historiaRecibida: HistoriaCompleta;
  triajeRecibido:Triaje;
  consultas: Consulta[];
  triajes: Triaje[];
  datoBus: string;
  private idRecibido:number;
  private nombreRecibido:string;
  private numHistRecibido: string;
  private dniRecibido:string;
  private edadRecibido:number;
  private sexoRecibido:string;
  private idCitaRecibida:number;
  private triajeVerMas:Triaje[];
  private consultaVerMas:Consulta[];
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private http: HttpClient,   
    private router: Router,
  ) {

    super(store, httpSv);
    this.pageData = {
      title: 'Historial Clinico',
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
          title: 'Historial Clinico'
        }
      ]
    };
    this.consultas = [];
    this.triajes=[];
    this.triajeVerMas=[];
    this.consultaVerMas=[];
    this.datoBus=this.httpSv.getNroHC();
    this.idCitaRecibida=this.httpSv.getIdHC();
    this.httpSv.searcTriajeC(this.idCitaRecibida).subscribe(data =>{
      this.triajeRecibido=data;
    }); 
    this.cargarPaciente();    
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges($event) {
		console.log();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  cargarPaciente() {
    this.httpSv.searcHistoriaCompleta(this.datoBus).subscribe(data => {
      this.idRecibido=data.id;
      this.historiaRecibida = data;
      this.consultas = this.historiaRecibida.consultas;
      this.triajes = this.historiaRecibida.triajes;
      this.nombreRecibido = this.historiaRecibida.nombres+" "+this.historiaRecibida.apellido_paterno+" "+this.historiaRecibida.apellido_materno;
      this.dniRecibido = this.historiaRecibida.dni;
      this.numHistRecibido = this.historiaRecibida.numeroHistoria;
      this.edadRecibido = this.historiaRecibida.edad;
      this.sexoRecibido = this.historiaRecibida.sexo;
      for (let index = 0; index < this.consultas.length; index++) {
        this.consultas[index].triaje=index;
      }
    });
  }
  regresar(){
    this.router.navigate(['/vertical/consultas']);
  }
  atenderCita(id: number) {
    this.httpSv.AtenderCita(id).subscribe(cita => {
      this.httpSv.loadCitasM();
    });
  }
  //Modal Crear Consulta
  openModalC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.initverTriajeForm();
    this.initConsultForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  closeModalC() {
    this.modal.close();
    this.consultForm.reset();
  }
  initverTriajeForm() {
    this.verTriajeForm = this.formBuilder.group({
      talla: [this.triajeRecibido.talla ? this.triajeRecibido.talla: '', Validators.required],
      peso: [this.triajeRecibido.peso ? this.triajeRecibido.peso: '', Validators.required],
      temperatura: [this.triajeRecibido.temperatura ? this.triajeRecibido.temperatura: '', Validators.required],
      frecuenciaR: [this.triajeRecibido.frecuenciaR ? this.triajeRecibido.frecuenciaR: '', Validators.required],
      frecuenciaC: [this.triajeRecibido.frecuenciaC ? this.triajeRecibido.frecuenciaC: '', Validators.required],
      presionArt:[this.triajeRecibido.presionArt ? this.triajeRecibido.presionArt: '', Validators.required]
    });

  }
  initConsultForm() {
    this.consultForm = this.formBuilder.group({
      motivoConsulta: ['', Validators.required],
      apetito: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      orina: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      deposiciones: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      examenFisico: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      diagnostico: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      tratamiento: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
      proximaCita:[null]
    });

  }
  addConsult(form: FormGroup) {
    if (form.valid) {
      let newConsult: Consulta = form.value;
      newConsult.proximaCita = formatDate(form.value.proximaCita, 'yyyy-MM-dd', 'en-US', '+0530');
      newConsult.numeroHistoria=this.idRecibido;
      newConsult.triaje=this.triajeRecibido.id;
      newConsult.medico=1;
      console.log(newConsult);
      this.httpSv.crearConsulta(newConsult);
      this.atenderCita(this.idCitaRecibida);
      this.closeModalC();
      this.cargarPaciente();
      this.consultForm.reset();
    //this.router.navigate(['/vertical/consultas']);   
      this.cargarPaciente();    
    }
  }
  //fin de Modal Crear Consulta

  //Modal Ver Consulta
  openModalVerC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.initVerMasForm(options.triaje);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  closeModalVerC() {
    this.modal.close();
    this.verMasCForm.reset();

  }
  initVerMasForm(data: number) {
    this.verMasCForm = this.formBuilder.group({
      talla: [this.triajes[data].talla ? this.triajes[data].talla: '', Validators.required],
      peso: [this.triajes[data].peso ? this.triajes[data].peso: '', Validators.required],
      temperatura: [this.triajes[data].temperatura ? this.triajes[data].temperatura: '', Validators.required],
      frecuenciaR: [this.triajes[data].frecuenciaR ? this.triajes[data].frecuenciaR: '', Validators.required],
      frecuenciaC: [this.triajes[data].frecuenciaC ? this.triajes[data].frecuenciaC: '', Validators.required],
      presionArt:[this.triajes[data].presionArt ? this.triajes[data].presionArt: '', Validators.required],
      motivo: [this.consultas[data].motivoConsulta ? this.consultas[data].motivoConsulta: '', Validators.required],
      apetito: [this.consultas[data].apetito ? this.consultas[data].apetito: '', Validators.required],
      orina: [this.consultas[data].orina ? this.consultas[data].orina: '', Validators.required],
      deposiciones: [this.consultas[data].deposiciones ? this.consultas[data].deposiciones: '', Validators.required],
      exaFis: [this.consultas[data].examenFisico ? this.consultas[data].examenFisico: '', Validators.required],
      diagnostico: [this.consultas[data].diagnostico ? this.consultas[data].diagnostico: '', Validators.required],
      tratamiento: [this.consultas[data].tratamiento ? this.consultas[data].tratamiento: '', Validators.required],
    });

  }/*
  initVerMasForm(nro:number) {
    this.httpSv.searchTriaje(nro).subscribe(data =>{
      this.triajeVerMas[0]=data;
    });
    this.httpSv.searchConsulta(nro).subscribe(data =>{
      this.consultaVerMas[0]=data;
    });
    this.verMasCForm = this.formBuilder.group({
      talla: [this.triajeVerMas[0].talla ? this.triajeVerMas[0].talla: '', Validators.required],
      peso: [this.triajeVerMas[0].peso ? this.triajeVerMas[0].peso: '', Validators.required],
      temperatura: [this.triajeVerMas[0].temperatura ? this.triajeVerMas[0].temperatura: '', Validators.required],
      frecuenciaR: [this.triajeVerMas[0].frecuenciaR ? this.triajeVerMas[0].frecuenciaR: '', Validators.required],
      frecuenciaC: [this.triajeVerMas[0].frecuenciaC ? this.triajeVerMas[0].frecuenciaC: '', Validators.required],
      presionArt:[this.triajeVerMas[0].presionArt ? this.triajeVerMas[0].presionArt: '', Validators.required],
      motivo: [this.consultaVerMas[0].motivoConsulta ? this.consultaVerMas[0].motivoConsulta: '', Validators.required],
      apetito: [this.consultaVerMas[0].apetito ? this.consultaVerMas[0].apetito: '', Validators.required],
      orina: [this.consultaVerMas[0].orina ? this.consultaVerMas[0].orina: '', Validators.required],
      deposiciones: [this.consultaVerMas[0].deposiciones ? this.consultaVerMas[0].deposiciones: '', Validators.required],
      exaFis: [this.consultaVerMas[0].examenFisico ? this.consultaVerMas[0].examenFisico: '', Validators.required],
      diagnostico: [this.consultaVerMas[0].diagnostico ? this.consultaVerMas[0].diagnostico: '', Validators.required],
      tratamiento: [this.consultaVerMas[0].tratamiento ? this.consultaVerMas[0].tratamiento: '', Validators.required],
    });

  }*/
  //fin de Modal Ver Consulta

  //Modal Examenes de Laboratorio
  openModalExamenes<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  closeModalExamenes() {
    this.modal.close();
  }
  //fin de Modal Examenes de Laboratorio
}
