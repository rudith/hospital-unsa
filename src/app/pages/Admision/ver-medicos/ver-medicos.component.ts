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
import { Historial } from "../../../interfaces/historial";
import { Provincia } from "../../../interfaces/provincia";
import { Departamento } from "../../../interfaces/departamento";
import { Distrito } from "../../../interfaces/distrito";
import { Medico } from "../../../interfaces/medico";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Personal } from "../../../interfaces/personal";
import { HistorialLista } from '../../../interfaces/historial-lista';
import { Tipoexamen } from '../../../interfaces/tipoexamen';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { Orden } from '../../../interfaces/orden';
import { OrdenM } from '../../../interfaces/orden-m';
import { HostListener } from '@angular/core';
import { personalLista } from '../../../interfaces/personalLista';
import { Especialidad } from '../../../interfaces/especialidad';
import { AdministradorService } from '../../../services/Administrador/administrador.service';
import { PersonalCreate } from '../../../interfaces/personalCreate';
import { formatDate, LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-ver-medicos',
  templateUrl: './ver-medicos.component.html',
  styleUrls: ['./ver-medicos.component.scss']
})
export class VerMedicosComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

  n: string;
  ab: number;
  idCita: string;
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
  @ViewChild("modalBody", { static: true }) modalBody: ElementRef<any>;
  @ViewChild("modalFooter", { static: true }) modalFooter: ElementRef<any>;
  public tipoExOption: IOption[];
  public tipoE: Especialidad[];
  public medOption: IOption[];
  public provincias: Provincia[];
  public departamentos: Departamento[];
  public distritos: Distrito[];
  public medicos: Medico[];
  public perso: Personal[];
  public ah:Personal;
  public ai:PersonalCreate;
  today: Date;
  datoBus: string;
  opBus: string;
  estadoBusq: boolean;
  tableData: any[];
  appointmentForm: FormGroup;
  cabTri: FormGroup;
  data: string[];
  ordenesLis: personalLista = <personalLista>{};
  ordenes: Personal[];
  numero: number;
  busForm: FormGroup;
  patientForm: FormGroup;
  depa: number;
  bus: string;

  historiaForm: FormGroup;
  ordenForm: FormGroup;
  histI: Historial;
  historiaFormE: FormGroup;
  historiaFormI: FormGroup;
  histTotal: HistorialLista
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  idP:number;
  ahj:Personal;
  public newCita: Cita;
  public espOption: IOption[];
  public busqOption: IOption[];
  public especialidades: Tipoexamen[];
  public ordd: Orden;


  constructor(
    private location: LocationStrategy,
    store: Store<IAppState>,
    httpSv: HttpService,
    private labService: LaboratorioService,
    private adminSv: AdministradorService,
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
    this.especialidades = [];
    this.opBus = "0";
    this.ordenes = [];
    this.espOption = [];
    this.tipoE = [];
    this.newCita = <Cita>{};
    this.pageData = {
      title: "Listado de Médicos",
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
          title: "Listado de Médicos"
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
      for (let index = 0; index < this.ordenes.length; index++) {
        if(this.ordenes[index].especialidad==null)
        this.ordenes[index].direccion="Falta"
        else
        this.ordenes[index].direccion = this.ordenes[index].especialidad.nombre;
      }
      this.initHI()
    });
  }

  public nextPage() {
    if (this.ordenesLis.next) {
      this.pageNum++;
      this.adminSv.loadPersonalPagination(this.ordenesLis.next).subscribe(ord => {
        this.ordenesLis = ord;
        this.ordenes = ord.results;      

        for (let index = 0; index < this.ordenes.length; index++) {
          this.ordenes[index].direccion = this.ordenes[index].especialidad.nombre;
        }
      });
    }
  }

  public prevPage() {
    console.log(this.pageNum);
    if (this.pageNum > 1) {
      this.pageNum--;
      this.adminSv.loadPersonalPagination(this.ordenesLis.previous).subscribe(sol => {
        this.ordenesLis = sol;
        this.ordenes = sol.results;

        for (let index = 0; index < this.ordenes.length; index++) {
  
          this.ordenes[index].direccion = this.ordenes[index].especialidad.nombre;
        }
      });
    }
  }

  loadOrdenes() {
    this.adminSv.loadMedicos().subscribe(sol => {
      this.ordenesLis = sol;
      this.ordenes = sol.results;
      for (let index = 0; index < this.ordenes.length; index++) {
        if(this.ordenes[index].especialidad==null)
        this.ordenes[index].direccion=="Falta"
        else
        this.ordenes[index].direccion = this.ordenes[index].especialidad.nombre;
      }
    });
  }



  ngOnInit() {
    super.ngOnInit();
    this.estadoBusq = false;
    this.getData("assets/data/opcionBusqueda.json", "busqOption");
    this.store.select("ordenes").subscribe(sol => {
      if (sol && sol.length) {
        this.ordenes = sol;
        for (let i in this.ordenes) {
          this.ordenes[i].direccion = this.ordenes[i].especialidad.nombre;
        }
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.loadData();
    this.preventBackButton();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  openModalVerMas<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Orden
  ) {
    this.initHistoriaForm();
    this.ordd = row;
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


  actualizarOrden(form: FormGroup) {
    if (form.valid) {
      let newOrden: OrdenM = form.value;
      newOrden.dni = this.ordd.dni;
      newOrden.numeroHistoria = this.ordd.numeroHistoria;
      newOrden.nombre = this.ordd.nombre;
      newOrden.medico = this.ordd.medico;
      newOrden.orden = this.ordd.orden;
      newOrden.fechaA = form.get('fecha').value;
      newOrden.tipoExam = this.ordd.tipoExam.id;
      this.httpSv.updateOrdenM(newOrden, this.modal, this.ordd.id);
      this.loadOrdenes();
    }
  }


  loadData() {
    this.httpSv.loadEspecialidadesSP().subscribe(tipo => {
      this.tipoE = tipo,
        this.loadtipoex(this.tipoE);
    });

  }

  loadtipoex(tipoE: Especialidad[]) {
    for (let i in tipoE) {
      this.tipoExOption[i] =
      {
        label: this.tipoE[i].nombre,
        value: this.tipoE[i].id.toString()
      };
    }
  }



  openModalI<T>(body: Content<T>, header: Content<T> = null,
    footer: Content<T> = null,
  ) {
    this.initHI();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  openModalMI<T>(body: Content<T>, header: Content<T> = null,
    footer: Content<T> = null,ap:Personal
  ) {
    this.initMI(ap);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  initHI() {
    this.today = new Date();
    this.historiaFormI = this.formBuilder.group({
      dni: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("[0-9]*")]],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_paterno: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_materno: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      especialidad: ["", Validators.required],
    });
  }

  initMI(a:Personal) {
    console.log(a.id)
    this.idP=a.id;
    console.log(this.idP)
    this.today = new Date();
    this.historiaFormI = this.formBuilder.group({
      dni: [a.dni ? a.dni:"", [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("[0-9]*")]],
      nombres: [a.nombres ? a.nombres:'', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_paterno: [a.apellido_paterno ? a.apellido_paterno:'', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_materno: [a.apellido_materno ? a.apellido_materno:'', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      especialidad: [, Validators.required],
    });
  }


  crearMedicoI(form: FormGroup) {
    if (form.valid) {
      let newMedico: Personal = form.value;
      newMedico.dni = form.get('dni').value;
      newMedico.nombres = form.get('nombre').value;
      newMedico.apellido_paterno = form.get('apellido_paterno').value;
      newMedico.apellido_materno = form.get('apellido_materno').value;
      newMedico.especialidad = form.get('especialidad').value;
      newMedico.estReg = true;
      console.log(newMedico)
      this.adminSv.createMedico(newMedico);
    }
    this.closeModalH();
    this.loadData();
  }

  updateMedicoI(form: FormGroup) {
    console.log(this.idP)
    if (form.valid) {
      let newMedico: PersonalCreate = form.value;
      newMedico.id=this.idP;
      newMedico.dni = form.get('dni').value;
      newMedico.nombres = form.get('nombres').value;
      newMedico.apellido_paterno = form.get('apellido_paterno').value;
      newMedico.apellido_materno = form.get('apellido_materno').value;
      newMedico.especialidad = form.get('especialidad').value;
      newMedico.estReg = true;
      console.log("update")
      console.log(newMedico)
      this.adminSv.updateMedico(newMedico,this.idP);
    }
    this.closeModalH();
    this.loadData();
    this.loadOrdenes();
  }

  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ["", [Validators.required]]
    });
  }

  buscar(ab: FormGroup) {
    this.bus = ab.get("datoBus").value;
    console.log(this.bus);
    this.adminSv.searchMedicoDNI(this.bus).subscribe(
      data => {
        console.log(data);
        if (this.bus == "") {
          this.toastr.info("No se ha ingresado ningun texto");
        }
        else {
            this.ordenes = [];
            this.ordenes[0] = data;
            console.log(this.ordenes);
            for (let i in this.ordenes) {       
              this.ordenes[i].direccion = this.ordenes[i].especialidad.nombre;
            } 
            this.toastr.info("Mostrando resultados");
          
        }
      }
    );
  }

  openModalEstado<T>(body: Content<T>, header: Content<T> = null,footer: Content<T> = null,row: Personal,options: any = null) {
    //this.idCita = id;
    console.log(row)
    this.ah=row;
    console.log(this.ah)
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  CambiarEstado() {  


      let newMedico: PersonalCreate=this.historiaFormI.value ;      
      console.log(newMedico)
      newMedico.id=this.ah.id;
      newMedico.dni = this.ah.dni;
      newMedico.nombres = this.ah.nombres;
      newMedico.apellido_paterno =this.ah.apellido_paterno;
      newMedico.apellido_materno = this.ah.apellido_materno;
      newMedico.especialidad = this.ah.especialidad.id;
      if(this.ah.estReg==true)
        newMedico.estReg = false;
      else
        newMedico.estReg=true;
      console.log("update")
      console.log(newMedico)
      this.adminSv.updateMedico(newMedico,this.ah.id);
    
    this.closeModalH();
    this.loadData();
    this.loadOrdenes();
  }


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closeModalH();

    }
    if (event.key === "Enter") {
      return false;
    }
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
      this.closeModalH();
    });
  }
}

