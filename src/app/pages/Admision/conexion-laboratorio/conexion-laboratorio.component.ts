import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from "@angular/core";
import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { HttpService } from "../../../services/http/http.service";
import { Cita } from "../../../interfaces/cita";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IOption } from "./../../../ui/interfaces/option";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { Historial } from "../../../interfaces/historial";
import { Especialidad } from "../../../interfaces/especialidad";
import { Grupsang } from "../../../interfaces/grupsang";
import { Provincia } from "../../../interfaces/provincia";
import { Departamento } from "../../../interfaces/departamento";
import { Distrito } from "../../../interfaces/distrito";
import { Medico } from "../../../interfaces/medico";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Personal } from "../../../interfaces/personal";
import { HistorialLista } from '../../../interfaces/historial-lista';
import { SolicitudLista } from '../../../interfaces/solicitud-lista';
import { Solicitud } from '../../../interfaces/solicitud';
import { Tipoexamen } from '../../../interfaces/tipoexamen';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { Orden } from '../../../interfaces/orden';

import { HostListener } from '@angular/core';
import { OrdenLista } from '../../../interfaces/orden-lista';


@Component({
  selector: 'app-conexion-laboratorio',
  templateUrl: './conexion-laboratorio.component.html',
  styleUrls: ['./conexion-laboratorio.component.scss']
})
export class ConexionLaboratorioComponent extends BasePageComponent
  implements OnInit, OnDestroy, OnChanges {
  n: string;
  ab: number;
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
  @ViewChild("modalBody", { static: true }) modalBody: ElementRef<any>;
  @ViewChild("modalFooter", { static: true }) modalFooter: ElementRef<any>;
  public tipoExOption: IOption[];
  public tipoE: Tipoexamen[];
  public medOption: IOption[];
  public provincias: Provincia[];
  public departamentos: Departamento[];
  public distritos: Distrito[];
  public medicos: Medico[];
  public perso: Personal[];
  today: Date;
  datoBus: string;
  opBus: string;
  estadoBusq: boolean;
  tableData: any[];
  appointmentForm: FormGroup;
  cabTri: FormGroup;
  data: string[];
  ordenesLis: OrdenLista = <OrdenLista>{};
  ordenes: Orden[];
  numero: number;
  busForm: FormGroup;
  patientForm: FormGroup;
  depa: number;
  bus: string;

  historiaForm: FormGroup;
  ordenForm:FormGroup;
  historiaFormE: FormGroup;
  histTotal: HistorialLista
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  public newCita: Cita;
  public espOption: IOption[];
  public busqOption: IOption[];
  public especialidades: Tipoexamen[];
  public ordd:Orden;


  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private labService: LaboratorioService,
    private modal: TCModalService,
    private modalCita: TCModalService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    super(store, httpSv);
    this.departamentos = [];
    this.tipoExOption = [];
    this.provincias = [];
    this.distritos = [];
    this.medOption = [];
    this.medicos = [];
    this.data = [];
    this.especialidades=[];
    this.opBus = "0";
    this.ordenes = [];
    this.espOption = [];
    this.tipoE = [];
    this.newCita = <Cita>{};
    this.pageData = {
      title: "Órdenes",
      loaded: true,
      breadcrumbs: [
        {
          title: "UI Kit",
          route: "default-dashboard"
        },
        {
          title: 'Components',
          route: 'default-dashboard'
        },
        {
          title: "Tables",
          route: "default-dashboard"
        },
        {
          title: "Órdenes"
        },
        {
          title: "Search"
        }
      ]
    };
    this.pageNum = 1;
    this.perso = [];
    this.tableData = [];
    this.ordenes = [];
    this.loadOrdenes();
    this.loadData();
    this.initBusForm();
    this.labService.loadTipoEx().subscribe(ex => {
      console.log(ex);
      console.log("entro a load examenes")
      this.especialidades = ex;
      for (let i in this.especialidades) {
        this.data[i] = this.especialidades[i].nombre;
        console.log(this.data[i]);
      }
    });
  }

  public nextPage() {
    if (this.ordenesLis.next) {
      this.pageNum++;
      this.labService.loadOrdenPAgination(this.ordenesLis.next).subscribe(ord => {
        this.ordenesLis = ord;
        this.ordenes = ord.results;
      });
    }
  }

  public prevPage() {
    console.log(this.pageNum);
    if (this.pageNum > 1) {
      this.pageNum--;
      this.labService.loadOrdenPAgination(this.ordenesLis.previous).subscribe(sol => {
        this.ordenesLis = sol;
        this.ordenes = sol.results;
      });
    }
  }

  loadOrdenes() {
    this.labService.loadOrdenCreadas().subscribe(sol => {
      this.ordenesLis = sol;
      this.ordenes = sol.results;
    });
  }



  ngOnInit() {
    super.ngOnInit();
    this.estadoBusq = false;
    this.getData("assets/data/opcionBusqueda.json", "busqOption");
    this.store.select("ordenes").subscribe(sol => {
      if (sol && sol.length) {
        this.ordenes = sol;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.loadData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  openModalVerMas<T>( body: Content<T>,header: Content<T> = null,footer: Content<T> = null,row:Orden
  ) {
    this.initHistoriaForm();
    this.ordd=row;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  initHistoriaForm() {
    this.today = new Date();
    this.ordenForm = this.formBuilder.group({     
      fecha: [formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "", Validators.required],
    });
  }
  closeModalH() {
    this.modal.close();
  }

  crearOrden(form: FormGroup) {
    if (form.valid) {
      let newOrden: Orden = form.value;
      newOrden.dni = form.get('dni').value;
      newOrden.numeroHistoria = this.ab;
      newOrden.nombre = form.get('nombre').value;
      newOrden.medico = form.get('medico').value;
      newOrden.orden = form.get('orden').value;
      newOrden.fechaA = form.get('fecha').value;
      newOrden.tipoExam = parseInt(form.get('tipoExam').value);
      this.httpSv.createOrden(newOrden, this.modal, 1,2);
    }
  }
  actualizarOrden(form: FormGroup) {
    if (form.valid) {
      let newOrden: Orden = form.value;
      newOrden.dni = this.ordd.dni;
      newOrden.numeroHistoria = this.ordd.numeroHistoria;
      newOrden.nombre = this.ordd.nombre;
      newOrden.medico = this.ordd.medico;
      newOrden.orden = this.ordd.orden;
      newOrden.fechaA = form.get('fecha').value;
      newOrden.tipoExam = this.ordd.tipoExam;
      this.httpSv.updateOrden(newOrden, this.modal,this.ordd.id);
      this.loadOrdenes();
    }
  }

  loadData() {
    this.labService.loadTipoEx().subscribe(tipo => {
      this.tipoE = tipo,
        this.loadtipoex(this.tipoE);
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
  openModalVerExtra<T>(body: Content<T>, header: Content<T> = null,
    footer: Content<T> = null,
  ) {
    this.initHistoriaFormExtra();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  initHistoriaFormExtra() {
    this.today = new Date();
    this.historiaFormE = this.formBuilder.group({
      dni: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("[0-9]*")]],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      fecha: [formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "", Validators.required],
      tipoExam: ["", Validators.required],
    });
  }
  crearOrdenE(form: FormGroup) {
    if (form.valid) {
      let newOrden: Orden = form.value;
      newOrden.dni = form.get('dni').value;
      newOrden.nombre = form.get('nombre').value;
      newOrden.fechaA = form.get('fecha').value;
      newOrden.tipoExam = parseInt(form.get('tipoExam').value);
      this.httpSv.createOrden(newOrden, this.modal, 1,2);
    }
  }

  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ["", [Validators.required]]
    });
  }

  buscar(ab: FormGroup) {
    this.bus = ab.get("datoBus").value;
    console.log(this.bus);
    this.httpSv.searchOrdenDniAdmis(this.bus).subscribe(
      data => {
        if (this.bus == "") {
          this.toastr.info("No se ha ingresado ningun texto");
        }
        else {
          if (data.results.length == 0) {
            this.toastr.error("No se han encontrado coincidencias");
            this.loadOrdenes();
          }
          else {
            this.ordenes = [];
            this.ordenes = data.results;
            this.toastr.info("Mostrando resultados");
          }
        }
      }
    );
  }

  cancelar(id:number){
    this.labService.cancelarOrden(id).subscribe(sol => {
      this.loadOrdenes();
    });
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closeModalH();

    }
    if (event.key === "Enter") {
      return false;
    }
  }
}

