import { Component, OnDestroy, OnInit, OnChanges } from "@angular/core";
import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { HttpService } from "../../../services/http/http.service";
import { Cita } from "../../../interfaces/cita";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IOption } from "../../../ui/interfaces/option";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { Especialidad } from "../../../interfaces/especialidad";
import { ToastrService } from "ngx-toastr";
// import { ConfirmationService } from "primeng/api";
import { CitaM } from "../../../interfaces/cita-m";
import { Medico } from "../../../interfaces/medico";
import { citaLista } from "../../../interfaces/citaLista";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { HostListener } from '@angular/core'; 

// BASE_API_URL
import { BASE_API_URL } from "../../../config/API";

@Component({
  selector: "app-citas",
  templateUrl: "./citas.component.html",
  styleUrls: ["./citas.component.scss"]
  // providers: [ConfirmationService]
})
export class CitasComponent extends BasePageComponent implements OnInit {
  idCita: string;
  pageNum: number;
  medSelectedName: string = <string>{};
  espSelectedName: string = <string>{};
  cita: CitaM = <CitaM>{};
  citas: Cita[];
  citasEdit: CitaM[] = [];
  public today: Date;
  tableData: any;
  patientForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  dni: string;
  campo: string;
  appointmentForm: FormGroup;
  cabModCita: FormGroup;
  public espOption: IOption[];
  medOption: IOption[];
  public especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  options: IOption[];
  selectedOptions: any;
  multiple: boolean;
  busqOption: IOption[];
  opBus: string = "";
  busForm: FormGroup;
  data: citaLista = <citaLista>{};
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    // private conf: ConfirmationService,
    private admService: AdministradorService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: "Citas",
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
          title: "Citas"
        },
        {
          title: "Search"
        }
      ]
    };
    this.opBus = "0";
    this.tableData = [];
    this.citas = [];
    this.loadCitas();
    this.espOption = [];
    this.medOption = [];
    this.multiple = false;
    this.httpSv.loadEspecialidadesSP().subscribe(especialidades => {
      this.especialidades = especialidades;
      this.loadOptionsEsp();
    });
    this.httpSv.loadMedicoSP().subscribe(medicos => {
      this.medicos = medicos;
      this.loadOptionsMed();
    });
    this.pageNum = 1;
    this.httpSv.cancelarCitasPasadas();
  }
  ngOnInit() {
    super.ngOnInit();
    this.store.select("citas").subscribe(citas => {
      if (citas && citas.length) {
        this.citas = citas;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });

    this.getData("assets/data/opcionBusquedaCita.json", "busqOption");
    this.initBusForm();
  }
  initBusForm() {
    this.busForm = this.formBuilder.group({
      opBus: ["", Validators.required],
      campo: ["", Validators.required]
    });
  }
  selectOpt() {
    this.opBus = this.busForm.get("opBus").value;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  buscar(busca: FormGroup) {
    this.campo = busca.get("campo").value;

    // console.log("entra" + this.opBus + " " + this.campo);
    if (this.opBus == "1") {
      this.buscarDNI(this.campo);
    }
    if (this.opBus == "2") {
      this.buscarEsp(this.campo);
    }
  }
  buscarEsp(valor: string) {
    // console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchCitaEsp(this.campo).subscribe(data => {
        if(data.results.length==0){
          this.toastr.error("No se han encontrado coincidencias");
        }
        else{
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.success("Datos encontrados");
        }

        
        
      });
    }
  }
  buscarDNI(valor: string) {
    console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.toastr.warning("Buscando Citas", "DNI: " + valor);
      this.httpSv.searchCitaDNI(this.campo).subscribe(data => {
        if (this.data.results.length==0) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Datos encontrados"); 
        }
      });
    }
  }
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      console.log(this.pageNum);
      this.httpSv.loadCitaPagination(this.data.next).subscribe(citalista => {
        this.data = citalista;
        this.citasEdit = this.data.results;
      });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.httpSv.loadCitaPagination(this.data.previous).subscribe(citalista => {
        this.data = citalista;
        this.citasEdit = this.data.results;
      });
    }
  }

  loadOptionsEsp() {
    for (let i in this.especialidades) {
      this.espOption[i] = {
        label: this.especialidades[i].nombre,
        value: this.especialidades[i].id.toString()
      };
    }
  }
  loadOptionsMed() {
    for (let i in this.medicos) {
      this.medOption[i] = {
        label:
          this.medicos[i].nombres +
          " " +
          this.medicos[i].apellido_paterno +
          " " +
          this.medicos[i].apellido_materno,
        value: this.medicos[i].user.id.toString()
      };
    }
  }
  loadOptionsMedEsp(a: string) {
    this.httpSv.searchMedicoporEsp(a).subscribe(
      data => {
        this.medicos = [];
        this.medOption = [];
        this.medicos = data;
        this.loadOptionsMed();
      },
      error => { }
    );
  }
  // open modal window
  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: CitaM
  ) {
    // console.log(JSON.stringify(row));
    this.initForm(row);
    this.initFormModCita(row);
    //this.initFormCabecera(row.numeroHistoria.numeroHistoria,row.);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
    // console.log("Cita obtenida" + JSON.stringify(row));
  }
  initForm(data: CitaM) {
    // console.log(JSON.stringify(data));
    this.appointmentForm = this.formBuilder.group({
      fechaAtencion: [
        data.fechaAtencion ? data.fechaAtencion : "",
        Validators.required
      ],
      especialidad: ["", [Validators.required]],
      medico: ["", [Validators.required]]
    });
  }

  initFormModCita(data: CitaM) {
    this.cabModCita = this.formBuilder.group({
      numeroHistoria: [
        data.numeroHistoria.numeroHistoria
          ? data.numeroHistoria.numeroHistoria
          : "",
        Validators.required
      ],
      dni: [
        data.numeroHistoria.dni ? data.numeroHistoria.dni : "",
        Validators.required
      ],
      numeroRecibo: [
        data.numeroRecibo ? data.numeroRecibo : "",
        Validators.required
      ]
    });
  }
  // close modal window
  closeModal() {
    this.modal.close();
    this.appointmentForm.reset();
  }
  closeModalConf() {
    this.modal.close();
  }
  sendCita(cita: CitaM) {
    this.cita = cita;
    this.medSelectedName =
      cita.medico.nombres +
      " " +
      cita.medico.apellido_paterno +
      " " +
      cita.medico.apellido_materno;
    this.espSelectedName = cita.especialidad.nombre;
    console.log(this.medSelectedName + "\n" + this.espSelectedName);
  }
  addAppointment(form: FormGroup) {
    // console.log(JSON.stringify(+form.value.especialidad));
    if (form.valid) {
      this.today = new Date();
      let newAppointment: Cita = form.value;
      newAppointment.fechaAtencion = formatDate(
        form.value.fechaAtencion,
        "yyyy-MM-dd",
        "en-US", '+0530'
      );
      newAppointment.fechaSeparacion = formatDate(
        this.today,
        "yyyy-MM-dd",
        "en-US", '+0530'
      );
      //newAppointment.fechaAtencion = this.cita.fechaAtencion;
      newAppointment.especialidad = form.value.especialidad;
      newAppointment.id = this.cita.id;
      newAppointment.numeroRecibo = this.cita.numeroRecibo;
      newAppointment.estadoCita = this.cita.estadoCita;
      newAppointment.estReg = this.cita.estReg;
      newAppointment.numeroHistoria = this.cita.numeroHistoria.id;
      newAppointment.exonerado = this.cita.exonerado;
      newAppointment.responsable = this.cita.responsable;
      // newAppointment.medico = this.cita.medico.id.toString();
      this.updateCita(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
    }
  }
  updateCita(newCita: Cita) {
    // console.log(JSON.stringify(newCita));
    this.http
      .put<any>(
        BASE_API_URL + "/consultorio/crear-cita/" + newCita.id + "/",
        {
          numeroRecibo: newCita.numeroRecibo,
          fechaSeparacion: newCita.fechaSeparacion,
          fechaAtencion: newCita.fechaAtencion,
          estadoCita: newCita.estadoCita,
          exonerado: newCita.exonerado,
          responsable: newCita.responsable,
          estReg: newCita.estReg,
          especialidad: newCita.especialidad,
          numeroHistoria: newCita.numeroHistoria,
          medico: newCita.medico
        },this.admService.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("", "Cita ACtualizada");
          // this.messageService.add({ severity: 'info', summary: 'Cita Actualizada' });
          newCita = <Cita>{};
          this.loadCitas();
        },
        error => {
          this.toastr.warning("Error Cita no Actualizada");
        }
      );
    // console.log(JSON.stringify(this.newHistoria));
  }

  // init form

  loadCitas() {
    this.httpSv.loadCitasEdit().subscribe(data => {
      this.data = data;
      this.citasEdit = data.results;
    });
  }
  openModalCancelar<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    id: string,
    options: any = null
  ) {
    this.idCita = id;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  CancelarCita() {
    this.httpSv.CancelarCita(this.idCita).subscribe(
      cita => {
        this.loadCitas();
        this.toastr.success("", "Cita Cancelada");
        this.closeModalConf();
      },
      error => {
        this.toastr.warning("Error Cita no cancelada");
        this.closeModalConf();
      }
    );
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
      this.closeModal();
      this.closeModalConf();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }
}
