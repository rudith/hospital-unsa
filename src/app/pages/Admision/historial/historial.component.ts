import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  OnChanges
} from "@angular/core";
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
  public ocupacionOption: IOption[];
  public distritosOption: IOption[];
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
  historiaForm: FormGroup;
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
  public newCita: Cita;
  public espOption: IOption[];
  public busqOption: IOption[];
  public especialidades: Especialidad[];

  constructor(
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
    this.patientForm = this.formBuilder.group({
      dni: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern("[0-9]*")
        ]
      ],
      nombres: ["", [Validators.required, Validators.pattern("[A-Za-z ]*")]],
      apellido_paterno: [
        "",
        [Validators.required, Validators.pattern("[A-Za-z ]*")]
      ],
      apellido_materno: [
        "",
        [Validators.required, Validators.pattern("[A-Za-z ]*")]
      ],
      sexo: ["", [Validators.required]],
      fechaNac: ["", [Validators.required]],
      celular: ["", [Validators.minLength(9), Validators.maxLength(9)]],
      telefono: ["", [Validators.minLength(6), Validators.maxLength(6)]],
      estadoCivil: ["", [Validators.required]],
      gradoInstruccion: ["", [Validators.required]],
      ocupacion: ["", [Validators.required]],
      direccion: ["", Validators.required],
      nacionalidad: ["Peruana", [Validators.pattern("[A-Za-z ]*")]],
      email: [""],
      distrito: ["", Validators.required],
      provincia: ["", Validators.required],
      departamento: ["", Validators.required]
    });
  }

  addPatient(form: FormGroup) {
    if (form.valid) {
      let newPatient: Historial = form.value;
      newPatient.fechaNac = formatDate(
        form.value.fechaNac,
        "yyyy-MM-dd",
        "en-US"
      );
      newPatient.estReg = true;
      newPatient.distrito = parseInt(form.get("distrito").value);
      newPatient.departamento = parseInt(form.get("departamento").value);
      newPatient.provincia = parseInt(form.get("provincia").value);
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
    this.gradoInstruccionOption[0] = { label: "Primaria", value: "Primaria" };
    this.gradoInstruccionOption[1] = {
      label: "Secundaria",
      value: "Secundaria"
    };
    this.gradoInstruccionOption[2] = {
      label: "Sup. Tecnico",
      value: "Sup. Tecnico"
    };
    this.gradoInstruccionOption[3] = {
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
        value: this.perso[i].user.id + ""
      };
    }
  }

  // open modal Cita
  openModal(
    body: any,
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
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      numeroRecibo: ["", [Validators.pattern("[0-9]*")]],
      fechaSeparacion: ["", Validators.required],
      especialidad: ["", Validators.required],
      medico: ["", Validators.required],
      responsable: ["", [Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\s .,;]+')]],
      eleccion: [""]
    });
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

      if (newAppointment.responsable == "") {
        newAppointment.exonerado = false;
      } else {
        newAppointment.numeroRecibo = null;
        newAppointment.exonerado = true;
      }

      this.httpSv.createCITA(newAppointment, this.modal);

    }
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
          this.historiales = []
          this.historiales = data;
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
    } else if (this.opBus == "3") {
      this.toastr.warning("Buscando...");
      this.httpSv.searcHistoriasNomAp(this.datoBus).subscribe(
        data => {
          this.historiales = [];
          this.historiales = data.results;
          console.log("entro bus" + this.datoBus);
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
      ]
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
    document.location.href =
      BASE_API_URL + "/admision/historiaPDF/" + data.dni;
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
    console.log(a);
    this.httpSv.searcMedxEspPag(a).subscribe(
      data => {
        this.perso = [];
        this.medOption = [];
        this.perso = data;
        //console.log(data);
        //console.log(this.perso);
        this.loadmedicos();
      },
      error => { }
    );
  }
}
