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
import { ConsultaCompleta } from '../../../interfaces/consulta-c';
import { Triaje } from '../../../interfaces/triaje';
import { Consulta } from '../../../interfaces/consulta';
import { Router } from '@angular/router';
import { Examen } from '../../../interfaces/examen';
import { ToastrService } from 'ngx-toastr';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { Detalle } from '../../../interfaces/detalle';
import { ConsultasPaginadas } from '../../../interfaces/consultas-paginadas';
import { ExamenLista } from '../../../interfaces/examen-lista';
import { IOption } from "./../../../ui/interfaces/option";
import { HostListener } from '@angular/core'; 

// BASE_API_URL
import { BASE_API_URL } from "../../../config/API";
import { Orden } from '../../../interfaces/orden';
import { Personal } from '../../../interfaces/personal';
import { Tipoexamen } from '../../../interfaces/tipoexamen';

@Component({
  selector: 'app-consultas',
  templateUrl: './listar-consultas.component.html',
  styleUrls: ['./listar-consultas.component.scss'],
})
export class ListarConsultasComponent extends BasePageComponent implements OnInit, OnChanges {
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
  data: ConsultasPaginadas = <ConsultasPaginadas>{};
  dataExamen:ExamenLista=<ExamenLista>{};
  busForm: FormGroup;
  pageNumEx: number;
  pageNum: number;

  examenForm: FormGroup;
  consultForm: FormGroup;
  verMasCForm: FormGroup;
  verTriajeForm: FormGroup;
  exm:FormGroup;
  consultasRecibidas: ConsultaCompleta[];
  examenesRecibidos: Examen[];
  triajeRecibido: Triaje;
  datoBus: string;
  apetitoOption: IOption[];

  public tipoE: Tipoexamen[];
  detalleT: Detalle[];
  ordenesT:string[];

  private idRecibido: number;
  private nombreRecibido: string;
  private numHistRecibido: string;
  private dniRecibido: string;
  private edadRecibido: number;
  private sexoRecibido: string;
  private idCitaRecibida: number;
  private idMedRecibido: number;
  private numHistId:number;
  private hayEx: boolean;
  private hayConsultas: boolean;
  private consulta:Consulta;
  private nomMedico:string;
  private ordenn:string;
  tipoExOption: IOption[];

  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private labservice: LaboratorioService,
    private modal: TCModalService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {

    super(store, httpSv);
    this.detalleT = [];
    this.pageData = {
      title: 'Historial Clínico',
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
          title: 'Historial Clínico'
        }
      ]
    };
    this.tipoExOption = [];
    this.ordenesT=[];
    this.tipoE = [];
    this.idMedRecibido = this.httpSv.getIdMed();
    this.pageNum = 1;
    this.pageNumEx=1;
    this.hayEx = true;
    this.hayConsultas = true;
    this.apetitoOption = [];
    this.consultasRecibidas = [];
    this.examenesRecibidos = [];
    this.detalleT=[];
    this.datoBus = this.httpSv.getNroHC();
    this.idCitaRecibida = this.httpSv.getIdHC();

    this.httpSv.searcTriajeC(this.idCitaRecibida).subscribe(data => {
      this.triajeRecibido = data;
    });
    this.labservice.docName(this.idMedRecibido).subscribe(per => {
      this.nomMedico=per.nombres+" "+per.apellido_paterno+" "+per.apellido_materno;
      this.ordenn=per.especialidad.nombre;
      console.log(this.nomMedico)
    });
    this.cargarDatos();
    this.cargarConsultas();
    this.loadData();
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges($event) {
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  loadData() {
    this.labservice.loadTipoEx().subscribe(tipo => {
      this.tipoE = tipo,
        this.loadtipoex(this.tipoE);
    });
  }
  

  /*** 
	 * autor: Milagros Motta R.
	 * cargarDatos: Carga lo datos del paciente haciendo una llamata al servicio
	***/
  cargarDatos() {
    this.httpSv.searcHistoriasNroR(this.datoBus).subscribe(data => {
      this.idRecibido = data[0].id;
      this.dniRecibido = data[0].dni;
      this.nombreRecibido = data[0].nombres + " " + data[0].apellido_paterno + " " + data[0].apellido_materno;
      this.edadRecibido = data[0].edad;
      this.sexoRecibido = data[0].sexo;
      this.cargarExamenes(data[0].dni);
      this.numHistId=data[0].id;
    });
  }

  loadtipoex(tipoE: Tipoexamen[]) {
    console.log(tipoE);
    for (let i in tipoE) {
      this.tipoExOption[i] =
        {
          label: this.tipoE[i].nombre,
          value: this.tipoE[i].id.toString()
        };
    }
  }

  /*** 
	 * autor: Milagros Motta R.
	 * cargarConsultas: Carga las consultas del paciente haciendo una llamata al servicio 
	***/
  cargarConsultas() {
    this.httpSv.searcHistoriaCompleta(this.datoBus).subscribe(data => {
      this.data = data;
      this.consultasRecibidas = [];
      this.consultasRecibidas = data.results;
      if (this.consultasRecibidas.length > 0) {
        this.hayConsultas = false;
      }
      for (let index = 0; index < this.consultasRecibidas.length; index++) {
        this.consultasRecibidas[index].proximaCita = this.consultasRecibidas[index].medico.especialidad.nombre;
      }
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * nextPage: si se hace click en siguiente, se aumenta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.httpSv.paginacionConsultasHistoriaC(this.data.next).subscribe(data => {
        this.data = data;
        this.consultasRecibidas = data.results;
        for (let index = 0; index < this.consultasRecibidas.length; index++) {
          this.consultasRecibidas[index].proximaCita = this.consultasRecibidas[index].medico.especialidad.nombre;
        }
      });
    }
  }
	/*** 
	 * autor: Milagros Motta R.
	 * prevPage: si se hace click en anterior, se resta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.httpSv.paginacionConsultasHistoriaC(this.data.previous).subscribe(data => {
        this.data = data;
        this.consultasRecibidas = data.results;
        for (let index = 0; index < this.consultasRecibidas.length; index++) {
          this.consultasRecibidas[index].proximaCita = this.consultasRecibidas[index].medico.especialidad.nombre;
        }
      });
    }
  }

  
  /*** 
	 * autor: Milagros Motta R.
	 * nextPageE: si se hace click en siguiente, se aumenta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
  public nextPageE() {
    console.log(this.dataExamen.next);
    if (this.dataExamen.next) {
      this.pageNumEx++;
      this.labservice.loadExamenPagination(this.dataExamen.next).subscribe(data => {
        console.log(data);
        this.dataExamen=data;
        this.examenesRecibidos = data.results;
        for (let index = 0; index < this.examenesRecibidos.length; index++) {
          this.examenesRecibidos[index].nombre = this.examenesRecibidos[index].tipoExam.nombre;
        }
      });
    }
  }
	/*** 
	 * autor: Milagros Motta R.
	 * prevPageE: si se hace click en anterior, se resta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
  public prevPageE() {
    if (this.pageNumEx > 1) {
      this.pageNumEx--;
      this.labservice.loadExamenPagination(this.dataExamen.previous).subscribe(data => {
        
        this.dataExamen=data;
        this.examenesRecibidos = data.results;
        for (let index = 0; index < this.examenesRecibidos.length; index++) {
          this.examenesRecibidos[index].nombre = this.examenesRecibidos[index].tipoExam.nombre;
        }
      });
    }
  }


  /*** 
	 * autor: Milagros Motta R.
	 * cargarExamenes: Carga los examenes del paciente haciendo una llamata al servicio 
	***/
  cargarExamenes(dni: string) {
    this.labservice.searchExamDNIPagination(dni).subscribe(data => {
      this.dataExamen=data;
      console.log(this.dataExamen);
      this.examenesRecibidos = data.results;
      for (let index = 0; index < this.examenesRecibidos.length; index++) {
        this.examenesRecibidos[index].nombre = this.examenesRecibidos[index].tipoExam.nombre;
      }
      if (this.examenesRecibidos.length > 0) {
        this.hayEx = false;
      }
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * regresar: Retorna al componente consultas que muestra las citas Pendientes 
	***/
  regresar() {
    this.router.navigate(['/vertical/consultas']);
  }

  //Modal Crear Consulta
  /*** 
	 * autor: Milagros Motta R.
	 * openModalC: Abre el modal e inicializa sus formGroups 
	***/
  openModalC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
    this.apetitoOption[0] = { label: "SI", value: "Normal" };
    this.apetitoOption[1] = { label: "NO", value: "Sin apetito" };
    this.initverTriajeForm();
    this.initConsultForm();
    this.initOrdenForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalC: Cierra el modal  
	***/
  closeModalC() {
    this.modal.close();
    this.consultForm.reset();
  }

  /*** 
	 * autor: Milagros Motta R.
	 * initverTriajeForm: Inicializa el formGroup para visualizarlos elementos del triaje recibido 
	***/
  initverTriajeForm() {
    this.verTriajeForm = this.formBuilder.group({
      talla: [this.triajeRecibido.talla ? this.triajeRecibido.talla : '', Validators.required],
      peso: [this.triajeRecibido.peso ? this.triajeRecibido.peso : '', Validators.required],
      temperatura: [this.triajeRecibido.temperatura ? this.triajeRecibido.temperatura : '', Validators.required],
      frecuenciaR: [this.triajeRecibido.frecuenciaR ? this.triajeRecibido.frecuenciaR : '', Validators.required],
      frecuenciaC: [this.triajeRecibido.frecuenciaC ? this.triajeRecibido.frecuenciaC : '', Validators.required],
      presionArt: [this.triajeRecibido.presionArt ? this.triajeRecibido.presionArt : '', Validators.required]
    });

  }

  /*** 
	 * autor: Milagros Motta R.
	 * initConsultForm: Hace 
	***/
  initConsultForm() {
    this.consultForm = this.formBuilder.group({
      motivoConsulta: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ,;.0-9]+')]],
      apetito: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      orina: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      deposiciones: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      examenFisico: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ,;.0-9]+')]],
      diagnostico: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ,;.0-9]+')]],
      tratamiento: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ,;.0-9]+')]],
      //ordenExam: ['', [Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ,;.]+')]],
      proximaCita: [null]
    });

  }

  initOrdenForm() {
    this.exm = this.formBuilder.group({
      tipoExam: ['', [Validators.required]],
    });

  }

  /*** 
	 * autor: Milagros Motta R.
	 * addConsult: Agrega los valores del formularios y otros más al objeto newConsult que se envia al servicio de creación. 
	***/
  addConsult(form: FormGroup) {
    if (form.valid) {
      let newConsult: Consulta = form.value;
      if (form.value.proximaCita != null) {
        newConsult.proximaCita = formatDate(form.value.proximaCita, 'yyyy-MM-dd', 'en-US');
      }
      newConsult.numeroHistoria = this.idRecibido;
      newConsult.medico = this.idMedRecibido;
      newConsult.triaje = this.triajeRecibido.id;
      this.consulta=newConsult;
      console.log(this.consulta)
      this.httpSv.crearConsulta(newConsult);
      this.Atender(this.idCitaRecibida);
      this.closeModalC();
      this.consultForm.reset();
      //this.router.navigate(['/vertical/consultas']);   
    }
  }
  //fin de Modal Crear Consulta

  //Modal Ver Consulta
  /*** 
	 * autor: Milagros Motta R.
	 * openModalVerC: Abre el modal e inicializa sus formGroups 
	***/
  openModalVerC<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.initVerMasForm(options);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalVerC: Cierra el modal 
	***/
  closeModalVerC() {
    this.modal.close();
    this.verMasCForm.reset();

  }

  /*** 
	 * autor: Milagros Motta R.
	 * initVerMasForm: Hace 
	***/
  initVerMasForm(data: any) {
    this.verMasCForm = this.formBuilder.group({
      talla: [data.triaje.talla ? data.triaje.talla : '', Validators.required],
      peso: [data.triaje.peso ? data.triaje.peso : '', Validators.required],
      temperatura: [data.triaje.temperatura ? data.triaje.temperatura : '', Validators.required],
      frecuenciaR: [data.triaje.frecuenciaR ? data.triaje.frecuenciaR : '', Validators.required],
      frecuenciaC: [data.triaje.frecuenciaC ? data.triaje.frecuenciaC : '', Validators.required],
      presionArt: [data.triaje.presionArt ? data.triaje.presionArt : '', Validators.required],
      motivo: [data.motivoConsulta ? data.motivoConsulta : '', Validators.required],
      apetito: [data.apetito ? data.apetito : '', Validators.required],
      orina: [data.orina ? data.orina : '', Validators.required],
      deposiciones: [data.deposiciones ? data.deposiciones : '', Validators.required],
      exaFis: [data.examenFisico ? data.examenFisico : '', Validators.required],
      diagnostico: [data.diagnostico ? data.diagnostico : '', Validators.required],
      tratamiento: [data.tratamiento ? data.tratamiento : '', Validators.required],
    });

  }
  //fin de Modal Ver Consulta

  //Modal Examenes de Laboratorio
  /*** 
	 * autor: Milagros Motta R.
	 * openModalExamenes: Abre el modal e inicializa sus formGroups 
	***/
  openModalExamenes<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any) {
    this.initExamenForm(options);
    this.loadTabla(options);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

//Valida y muestra los datos del modal ver mas 
initExamenForm(data: Examen) {
  this.examenForm = this.formBuilder.group({
    tipoExam: [data.tipoExam.nombre ? data.tipoExam.nombre : '', Validators.required],
    fecha: [data.fecha ? data.fecha : '', Validators.required],
    observaciones: [data.observaciones ? data.observaciones : '', Validators.required],
  });
}
//Metodo que muestra en un listado los detalles de examen llamando al servicio loadTabla
loadTabla(row: Examen) {
  this.labservice.loadTabla(row.id).subscribe(detalleT => {
    this.detalleT = detalleT;
  })
}

  /*** 
	 * autor: Milagros Motta R.
	 * closeModalExamenes: Cierra el modal 
	***/
  closeModalExamenes() {
    this.modal.close();
  }


  /*** 
   * autor: Milagros Motta R.
   * closeModalExamenes: Hace la llamada al servicio para imprimir el resultado del examen por ID 
  ***/
  imprimirEx(Ex: Examen) {
    document.location.href = BASE_API_URL + '/laboratorio/resultadoExamen/' + Ex.id + '/';
    this.toastr.success("Se ha generado el Pdf");
  }
  //fin de Modal Examenes de Laboratorio

  /*** 
   * autor: Milagros Motta R.
   * Atender: Hace una llamada al servicio para cambiar el estado de la cita
  ***/
  Atender(id: number) {
    this.httpSv.AtenderCita(id).subscribe(cita => {
      this.cargarConsultas();
    });
  }

  crearOrden(form: FormGroup) {
    if (form.valid) {
      let newOrden: Orden = form.value;
      newOrden.dni = this.dniRecibido;
      newOrden.numeroHistoria = this.numHistId;
      newOrden.nombre = this.nombreRecibido;
      newOrden.medico = this.nomMedico;
      newOrden.tipoExam = parseInt(form.get('tipoExam').value);
      newOrden.orden=this.ordenn;
      console.log(newOrden)
      this.httpSv.createOrden(newOrden, this.modal, 0,1);
      this.ordenesT.push(form.get('tipoExam').value+"ff");
    }
  }

  /*** 
   * autor: Milagros Motta R.
   * onKeydownHandler: Asigna acciones para cada vez que las teclas 'esc' y 'enter' sean presionadas
  ***/

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
      this.closeModalExamenes();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }
}
