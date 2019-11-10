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
  solicitudesLis: SolicitudLista = <SolicitudLista>{};
  solicitudes: Solicitud[];
  numero: number;
  busForm: FormGroup;
  patientForm: FormGroup;
  depa: number;

  historiaForm: FormGroup;
  historiaFormE: FormGroup;
  histTotal: HistorialLista
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  public newCita: Cita;
  public espOption: IOption[];
  public busqOption: IOption[];
  public especialidades: Especialidad[];

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
    // this.loadData();
    this.opBus = "0";
    this.solicitudes = [];
    this.espOption = [];
    this.tipoE = [];
    this.newCita = <Cita>{};
    this.pageData = {
      title: "Solicitudes de Examenes",
      loaded: true,
      breadcrumbs: [
        {
          title: "UI Kit",
          route: "default-dashboard"
        },
        {
          title: "Tables",
          route: "default-dashboard"
        },
        {
          title: "Solicitudes"
        },
        {
          title: "Search"
        }
      ]
    };
    this.pageNum = 1;
    this.perso = [];
    this.tableData = [];
    this.solicitudes = [];
    this.loadSolici();
    this.loadData();
    // this.loadData();
  }

  public nextPage() {
    if (this.solicitudesLis.next) {
      this.pageNum++;
      this.httpSv.loadSolicitudesPag(this.solicitudesLis.next).subscribe(sol => {
        this.solicitudesLis = sol;
        this.solicitudes = sol.results;
      });
    }
  }


  public prevPage() {
    console.log(this.pageNum);
    if (this.pageNum > 1) {
      this.pageNum--;
      this.httpSv.loadSolicitudesPag(this.solicitudesLis.previus).subscribe(sol => {
        this.solicitudesLis = sol;
        this.solicitudes = sol.results;
      });
    }
  }
  loadSolici() {
    this.httpSv.loadSolicitudes().subscribe(sol => {
      this.solicitudesLis = sol;
      this.solicitudes = sol.results;
    });
  }
  ngOnInit() {
    super.ngOnInit();
    this.estadoBusq = false;
    this.getData("assets/data/opcionBusqueda.json", "busqOption");
    this.store.select("solicitudes").subscribe(sol => {
      if (sol && sol.length) {
        this.solicitudes = sol;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.loadData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // Ver Mas Historial
  openModalVerMas<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Solicitud
  ) {
    this.initHistoriaForm(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  initHistoriaForm(data: Solicitud) {
    this.today = new Date();
    this.ab = data.numeroHistoria.id;
    this.historiaForm = this.formBuilder.group({
      numeroHistoria: [
        data.numeroHistoria.numeroHistoria ? data.numeroHistoria.numeroHistoria : "",
        Validators.required
      ],
      dni: [data.numeroHistoria.dni ? data.numeroHistoria.dni : "", Validators.required],
      nombre: [data.numeroHistoria.nombres + " " + data.numeroHistoria.apellido_paterno + " " + data.numeroHistoria.apellido_materno ? data.numeroHistoria.nombres + " " + data.numeroHistoria.apellido_paterno + " " + data.numeroHistoria.apellido_materno : "", Validators.required],
      medico: [
        data.medico.nombres + " " + data.medico.apellido_paterno + " " + data.medico.apellido_materno ? data.medico.nombres + " " + data.medico.apellido_paterno + " " + data.medico.apellido_materno : "",
        Validators.required
      ],
      orden: [data.ordenExam ? data.ordenExam : "", Validators.required],
      fecha: [formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "", Validators.required],
      tipoExam: ["", Validators.required],



    });
  }
  closeModalH() {
    this.modal.close();
    //this.loadHistorias();
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
      this.httpSv.createOrden(newOrden, this.modal);
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
  openModalVerExtra<T>(body: Content<T>,header: Content<T> = null,
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
      dni: ["", Validators.required],
      nombre: ["", Validators.required],
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
      this.httpSv.createOrden(newOrden, this.modal);
    }
  }
}

