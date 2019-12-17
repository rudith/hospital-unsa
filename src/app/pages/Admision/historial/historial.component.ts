import {  Component,  ElementRef,  OnDestroy,  OnInit,  ViewChild,  OnChanges} from "@angular/core";
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
import { formatDate, LocationStrategy } from '@angular/common';
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
import { HostListener } from '@angular/core'; 

// BASE_API_URL
import { BASE_API_URL } from "../../../config/API";

@Component({
  selector: "app-historial",
  templateUrl: "./historial.component.html",
  styleUrls: ["./historial.component.scss"]
})
export class HistorialComponent extends BasePageComponent
  implements OnInit, OnDestroy, OnChanges {
  @ViewChild("modalBody", { static: true }) modalBody: ElementRef<any>;
  @ViewChild("modalFooter", { static: true }) modalFooter: ElementRef<any>;
  public gruposang: Grupsang[];
  public gruposangOption: IOption[];
  public gradoInstruccionOption: IOption[];
  public estadoCivilOption: IOption[];
  public departamentosOption: IOption[];
  public provinciasOption: IOption[];
  public sexOption: IOption[];
  public conOption: IOption[];
  public ocupacionOption: IOption[];
  public distritosOption: IOption[];
  public medOption: IOption[];
  public provincias: Provincia[];
  public departamentos: Departamento[];
  public distritos: Distrito[];
  public medicos: Medico[];
  public perso: Personal[];
  public turn:number;
  today: Date;
  datoBus: string;
  opBus: string;
  estadoBusq: boolean;
  tableData: any[];
  appointmentForm: FormGroup;
  historiaForm: FormGroup;
  ModForm:FormGroup;
  historiaLis: HistorialLista;
  historiales: Historial[];
  numero: number;
  busForm: FormGroup;
  patientForm: FormGroup;
  depa: number;
  data: HistorialLista = <HistorialLista>{};
  histTotal: HistorialLista
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  ulH:string;
  ulH1:number;
  mod1:string;
  mod2:string;
  mod3:string;
  histTemp:Historial;
  public newCita: Cita;
  public espOption: IOption[];
  public busqOption: IOption[];
  public especialidades: Especialidad[];


  constructor(
    private location: LocationStrategy,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private modalCita: TCModalService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    super(store, httpSv);
    this.gruposang = [];
    this.gruposangOption = [];
    this.gradoInstruccionOption = [];
    this.departamentos = [];
    this.departamentosOption = [];
    this.provincias = [];
    this.provinciasOption = [];
    this.sexOption = [];
    this.conOption=[];
    this.ocupacionOption = [];
    this.distritos = [];
    this.medOption = [];
    this.distritosOption = [];
    this.estadoCivilOption = [];
    this.medicos = [];
    this.loadData();
    this.opBus = "0";
    this.historiales = [];
    this.espOption = [];
    this.newCita = <Cita>{};
    this.pageData = {
      title: "Historiales",
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
          title: "Historiales"
        },
        {
          title: "Search"
        }
      ]
    };
    this.pageNum = 1;
    this.perso = [];
    this.tableData = [];
    this.historiales = [];
    this.loadHistorias();
    this.loadData();
    this.httpSv.loadEspecialidadesPag().subscribe(especialidades => {
      this.especialidades = especialidades.results;
      this.loadOptions();
    });
    
   this.httpSv.getUltimoHist().subscribe(hist => {
    this.ulH=hist.NroHistoria;
    this.ulH1=parseInt(this.ulH)+1;

  });
  }
  ngOnChanges($event) {
    console.log();
  }
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.httpSv.loadHistoriaPagination(this.data.next).subscribe(hist => {
        this.data = hist;
        this.historiales = hist.results;
      });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.httpSv.loadHistoriaPagination(this.data.previous).subscribe(hist => {
        this.data = hist;
        this.historiales = hist.results;
      });
    }
  }
  loadHistorias() {
    this.httpSv.loadHistorias().subscribe(hist => {
      this.data = hist;
      this.historiales = hist.results;
    });
  }
  ngOnInit() {
    super.ngOnInit();
    
    this.estadoBusq = false;
    
    this.initBusForm();
    this.getData("assets/data/opcionBusqueda.json", "busqOption");
    this.store.select("historiales").subscribe(historiales => {
      if (historiales && historiales.length) {
        this.historiales = historiales;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.preventBackButton();
    
  }
  loadOptions() {
    for (let i in this.especialidades) {
      this.espOption[i] = {
        label: this.especialidades[i].nombre,
        value: this.especialidades[i].id.toString()
      };
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  //Modal Historial
  openModalH<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    options: any = null
  ) {
    this.initPatientForm();
    console.log(parseInt(this.patientForm.get("departamento").value));
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }

  closeModalH() {
    this.modal.close();
    this.loadHistorias();
  }

  initPatientForm() {
    this.httpSv.getUltimoHist().subscribe(hist => {
      this.ulH=hist.NroHistoria;
      this.ulH1=parseInt(this.ulH)+1;

    });
    this.patientForm = this.formBuilder.group({
      NumH:[this.ulH1 ? this.ulH1 : ""],
      dni: [null,[ Validators.minLength(8)]],
      nombres: ["",[Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_paterno: [
        "",
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
      ],
      apellido_materno: ["",[Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
      ],
      sexo: ["", [Validators.required]],
      fechaNac: [null, ],
      celular: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      telefono: ["", [Validators.minLength(6), Validators.maxLength(6)]],
      estadoCivil: ["", ],
      gradoInstruccion: ["", ],
      ocupacion: ["", ],
      direccion: ["", ],
      nacionalidad: ["Peruana", [Validators.pattern("[A-Za-z ]*")]],
      email: [""],
      distrito: ["", ],
      provincia: ["",],
      departamento: ["",],
      procedencia:["", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')],
      lugarNac:["", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
    });
  }

  addPatient(form: FormGroup) {
    this.today = new Date();
    if (form.valid) {
      let newPatient: Historial = form.value;      
      newPatient.fechaNac = formatDate(
        form.value.fechaNac,
        "yyyy-MM-dd",
        "en-US"
      );
      if(form.get("fechaNac").value==null){
        newPatient.fechaNac=null;
      }
      newPatient.estReg = true;
      newPatient.fechaReg=formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
      console.log(newPatient.fechaReg)
      console.log(newPatient);
      this.httpSv.createHISTORIAL(newPatient, this.modal);
      this.loadHistorias();

      
    
    }
  }
  closeModal() {
    this.modal.close();
  }

  selectOpt() {
    this.opBus = this.busForm.get("opBus").value;
  }

  loadData() {
    //Condicion
    this.conOption[0]={label:"N", value:"N"};
    this.conOption[1]={label:"C", value:"C"};
    this.conOption[2]={label:"R", value:"R"};


    //Sexo
    this.sexOption[0] = { label: "Masculino", value: "Masculino" };
    this.sexOption[1] = { label: "Femenino", value: "Femenino" };

    //Ocupacion
    this.ocupacionOption[7] = { label: "Profesor", value: "Profesor" };
    this.ocupacionOption[1] = { label: "Doctor", value: "Doctor" };
    this.ocupacionOption[2] = { label: "Licenciado", value: "Licenciado" };
    this.ocupacionOption[3] = { label: "Medico", value: "Medico" };
    this.ocupacionOption[4] = { label: "Ingeniero", value: "Ingeniero" };
    this.ocupacionOption[5] = { label: "Otro", value: "Otro" };
    this.ocupacionOption[0] = { label: "No tiene", value: "No tiene" };
    this.ocupacionOption[6] = {
      label: "Independiente",
      value: "Independiente"
    };

    //Grado de Instruccion
    this.gradoInstruccionOption[0] = { label: "No tiene", value: "No tiene" };
    this.gradoInstruccionOption[1] = { label: "Primaria", value: "Primaria" };
    this.gradoInstruccionOption[2] = {
      label: "Secundaria",
      value: "Secundaria"
    };
    this.gradoInstruccionOption[3] = {
      label: "Sup. Tecnico",
      value: "Sup. Tecnico"
    };
    this.gradoInstruccionOption[4] = {
      label: "Universitario",
      value: "Universitario"
    };

    //Estado Civil
    this.estadoCivilOption[0] = { label: "Soltero(a)", value: "Soltero(a)" };
    this.estadoCivilOption[1] = { label: "Casado(a)", value: "Casado(a)" };
    this.estadoCivilOption[2] = { label: "Viudo(a)", value: "Viudo(a)" };
    this.estadoCivilOption[3] = {
      label: "Divorciado(a)",
      value: "Divorciado(a)"
    };
    this.estadoCivilOption[4] = { label: "Conviviente", value: "Conviviente" };
    this.loadprovincias();

    this.httpSv.loadDepartamento().subscribe(departamentos => {
      (this.departamentos = departamentos), this.loaddepartamentos();
    });
  }


  loadprovincias() {
    for (let i in this.provincias) {
      this.provinciasOption[i] = {
        label: this.provincias[i].nombre,
        value: this.provincias[i].id.toString()
      };
    }
  }
  loaddepartamentos() {
    for (let i in this.departamentos) {
      this.departamentosOption[i] = {
        label: this.departamentos[i].nombre,
        value: this.departamentos[i].id.toString()
      };
    }
  }
  loaddistritos() {
    for (let i in this.distritos) {
      this.distritosOption[i] = {
        label: this.distritos[i].nombre,
        value: this.distritos[i].id.toString()
      };
    }
  }

  loadmedicos() {
    for (let i in this.perso) {
      this.medOption[i] = {
        label: this.perso[i].nombres + " " + this.perso[i].apellido_paterno + " " + this.perso[i].apellido_materno,
        value: this.perso[i].id + ""
      };
    }
  }

  // open modal Cita
  openModal( body: any,
    header: any = null,
    footer: any = null,
    data: any = null,
    id: any
  ) {
    this.initAppoForm(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer
    });
  }

  // init form
  initAppoForm(data: any) {
    this.today = new Date();
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      numeroRecibo: ["", [Validators.pattern("[0-9]*")]],
      fechaSeparacion: [formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "", Validators.required],
      especialidad: ["", Validators.required],
      medico: ["", Validators.required],
      responsable: ["", [Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s .,;]+')]],
      eleccion: [""],
      condicion:["",Validators.required]
    });
  }

  openModalMod( body: any,
    header: any = null,
    footer: any = null,
    data: any = null,
  ) {
    this.histTemp=data;
    console.log(this.histTemp);
    this.initModForm(data);
    this.modal.open({
      body: body,
      header: header,
      footer: footer
    });
  }

  // init form
  initModForm(data: any) {
    this.mod1=data.distrito;
    this.mod2=data.departamento;
    this.mod3=data.provincia;
    this.ModForm = this.formBuilder.group({
      numeroHistoria: [
        data.numeroHistoria ? data.numeroHistoria : "",
        Validators.required
      ],
      dni: [data.dni ? data.dni : null,[ Validators.minLength(8), Validators.maxLength(8), Validators.pattern("[0-9]*")]],
      nombres: [data.nombres ? data.nombres : "", [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]],
      apellido_paterno: [
        data.apellido_paterno ? data.apellido_paterno : "",
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
      ],
      apellido_materno: [
        data.apellido_materno ? data.apellido_materno : "",
        [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
      ],
      fechaNac: [data.fechaNac ? data.fechaNac : "", ],
      celular: [data.celular ? data.celular : "", [Validators.minLength(9), Validators.maxLength(9)]],
      telefono: [data.telefono ? data.telefono : "",[Validators.minLength(6), Validators.maxLength(6)]],
      estadoCivil: [
        data.estadoCivil ? data.estadoCivil : "",
        
      ],
      gradoInstruccion: [
        data.gradoInstruccion ? data.gradoInstruccion : "",
        
      ],
      ocupacion: [data.ocupacion ? data.ocupacion : "", ],
      direccion: [data.direccion ? data.direccion : "", ],
      nacionalidad: [
        data.nacionalidad ? data.nacionalidad : "",
       
      ],
      distrito: ["", ],
      provincia: ["", ],
      departamento: ["", ],
      procedencia:[data.procedencia ? data.procedencia:"", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')],
      lugarNac:[data.lugarNac ? data.lugarNac:"", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
    });
  }

  updatePatient(fr:FormGroup){
    if (fr.valid) {
      let nHist:Historial=fr.value;
      nHist.id=this.histTemp.id;
      nHist.sexo=this.histTemp.sexo;
      nHist.estReg=this.histTemp.estReg;

      if(fr.get("fechaNac").value==""){
        nHist.fechaNac=null;
      }
      console.log(nHist);
      this.httpSv.updateHISTORIAL(nHist,this.modal)
      this.loadHistorias();

    }

  }
  initBusForm() {
    this.busForm = this.formBuilder.group({
      opBus: ["", Validators.required],
      datoBus: ["", [Validators.required]]
    });
  }

  getHistoria(n: number) {
    this.numero = n;
    console.log(this.numero);
  }

  // add new appointment
  addAppointment(form: FormGroup) {    
    console.log(form.get('fechaSeparacion').value)
    this.httpSv.cantidadCitasTurno(form.get('fechaSeparacion').value).subscribe(historiales => {
      this.turn=historiales.orden+1;
      console.log(this.turn)
      if (form.valid) {
        this.today = new Date();
        let newAppointment: Cita = form.value;
        newAppointment.fechaAtencion = formatDate(
          form.value.fechaSeparacion,
          "yyyy-MM-dd",
          "en-US"
        );
        newAppointment.fechaSeparacion = formatDate(
          this.today,
          "yyyy-MM-dd",
          "en-US"
        );
        newAppointment.estadoCita = "Espera";
        newAppointment.estReg = true;
        newAppointment.numeroHistoria = this.numero;
        newAppointment.turno=this.turn;
  
        if (newAppointment.responsable == "") {
          newAppointment.exonerado = false;
        } else {
          newAppointment.numeroRecibo = null;
          newAppointment.exonerado = true;
        }
        
        console.log(newAppointment.turno)
        this.httpSv.createCITA(newAppointment, this.modal);
  
      }
    });
    
    
    
  }

  onChangeTable() {
    if (this.datoBus == "") {
      this.toastr.warning("Ningun valor ingresado");
      this.httpSv.loadHistorias().subscribe(historiales => {
        this.historiales = []
        this.historiales = historiales.results;
      });
    } else if (this.opBus == "1") {
      this.toastr.warning("Buscando...");
      this.httpSv.searcHistoriasDNI(this.datoBus).subscribe(
        data => {
          this.historiales = []
          this.historiales[0] = data;
          console.log("entro bus" + this.datoBus);
        },
        error => {
          this.toastr.error("No encontrado");
          this.httpSv.loadHistorias().subscribe(historiales => {
            this.historiales = []
            this.historiales = historiales.results;
          });
        }
      );
    } else if (this.opBus == "2") {
      this.toastr.warning("Buscando...");
      this.httpSv.searcHistoriasNroR(this.datoBus).subscribe(
        data => {
          if(data.length==0){
            this.toastr.error("No se han encontrado coincidencias");
            this.httpSv.loadHistorias().subscribe(historiales => {
              this.historiales = []
              this.historiales = historiales.results;
            });
          }
          else{
          this.toastr.success("Mostrando resultados");
          this.historiales = []
          this.historiales = data;
          console.log("entro bus" + this.datoBus);
          }
        },
        error => {
          this.toastr.error("No encontrado");
          this.httpSv.loadHistorias().subscribe(historiales => {
            this.historiales = []
            this.historiales = historiales.results;
          });
        }
      );
    } else if (this.opBus == "3") {
      this.toastr.warning("Buscando...");
      this.httpSv.searcHistoriasNomAp(this.datoBus).subscribe(
        data => {
          if(data.results.length==0){
            this.toastr.error("No se han encontrado coincidencias");
            this.httpSv.loadHistorias().subscribe(historiales => {
              this.historiales = []
              this.historiales = historiales.results;
            });
          }else{
          this.toastr.success("Mostrando resultados");
          this.historiales = [];
          this.historiales = data.results;
          console.log("entro bus" + this.datoBus);
          }
        },
        error => {
          this.toastr.warning("No encontrado");
          this.httpSv.loadHistorias().subscribe(historiales => {
            this.historiales = []
            this.historiales = historiales.results;
          });
        }
      );
    }
  }
  buscar(busca: FormGroup) {
    this.datoBus = busca.get("datoBus").value;
    this.opBus = busca.get("opBus").value;
    this.onChangeTable();
  }

  // Ver Mas Historial
  openModalVerMas<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Historial
  ) {
    this.initHistoriaForm(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  closeModalVH() {
    this.modal.close();
  }

  //Ver Mas
  initHistoriaForm(data: Historial) {
    
    this.historiaForm = this.formBuilder.group({
      numeroHistoria: [
        data.numeroHistoria ? data.numeroHistoria : "",
        Validators.required
      ],
      dni: [data.dni ? data.dni : "", Validators.required],
      nombres: [data.nombres ? data.nombres : "", Validators.required],
      apellido_paterno: [
        data.apellido_paterno ? data.apellido_paterno : "",
        Validators.required
      ],
      apellido_materno: [
        data.apellido_materno ? data.apellido_materno : "",
        Validators.required
      ],
      sexo: [data.sexo ? data.sexo : "", Validators.required],
      edad: [data.edad ? data.edad : "", Validators.required],
      fechaNac: [data.fechaNac ? data.fechaNac : "", Validators.required],
      celular: [data.celular ? data.celular : "", Validators.required],
      telefono: [data.telefono ? data.telefono : "", Validators.required],
      estadoCivil: [
        data.estadoCivil ? data.estadoCivil : "",
        Validators.required
      ],
      gradoInstruccion: [
        data.gradoInstruccion ? data.gradoInstruccion : "",
        Validators.required
      ],
      ocupacion: [data.ocupacion ? data.ocupacion : "", Validators.required],
      direccion: [data.direccion ? data.direccion : "", Validators.required],
      nacionalidad: [
        data.nacionalidad ? data.nacionalidad : "",
        Validators.required
      ],
      email: [data.email ? data.email : "", Validators.required],
      estReg: [data.estReg ? data.estReg : "", Validators.required],
      distrito: [data.distrito ? data.distrito : "", Validators.required],
      provincia: [data.provincia ? data.provincia : "", Validators.required],
      departamento: [
        data.departamento ? data.departamento : "",
        Validators.required
      ],
      fechaReg:[data.fechaReg ? data.fechaReg :"",Validators.required],
      procedencia:[data.procedencia ? data.procedencia:"", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')],
      lugarNac:[data.lugarNac ? data.lugarNac:"", Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+')]
    });
  }

  private selectedLink: string = "rec";
  setradio(e: string): void {
    this.selectedLink = e;
  }

  isSelected(name: string): boolean {
    if (!this.selectedLink) {
      return false;
    }
    return this.selectedLink === name; // if current radio button is selected, return true, else return false
  }

  /* Encargado: Shirley Romero
	   Descripcion: Metodo que se encarga de generar el pdf de la historia clinica seleccionada, este metodo necesita el dni de la historia para generarlo
	*/
  imprimir1(data) {    
       document.location.href = BASE_API_URL + "/admision/historiaPDF/" + data.numeroHistoria;
       this.toastr.success("Se ha generado el Pdf");     
  }
  cargarProvXDepto(a: number) {
    this.httpSv.searcDptoxP(a).subscribe(
      data => {
        this.provincias = [];
        this.distritosOption = [];
        this.provinciasOption = [];
        this.provincias = data.provincias;
        this.loadprovincias();
      },
      error => { }
    );
  }
  cargarDistXProv(a: number) {
    this.httpSv.searcProxDist(a).subscribe(
      data => {
        this.distritos = [];
        this.distritosOption = [];
        this.distritos = data.distritos;
        this.loaddistritos();
      },
      error => { }
    );
  }
  
  cargarMedXEsp(a: number) {
    
    this.httpSv.searcMedxEsp(a).subscribe(
      data => {
        this.perso = [];
        this.medOption = [];
        this.perso = data;
        console.log(this.perso);
        this.loadmedicos();
      },
      error => { }
    );
  }
  
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
      this.closeModal();
      this.closeModalH();
      this.closeModalVH();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
      this.closeModal();
      this.closeModalH();
      this.closeModalVH();
    });
  }
  
  descargarExcel(){
    document.location.href = "http://18.219.251.250:8000/admision/export/xls/" ;
    this.toastr.success("Se ha descargado el Excel de Historias");
  }
}
