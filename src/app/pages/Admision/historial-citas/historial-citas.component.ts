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
import { CitaM } from "../../../interfaces/cita-m";
import { Medico } from "../../../interfaces/medico";
import { citaLista } from "../../../interfaces/citaLista";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { Router } from '@angular/router';
import { HostListener } from '@angular/core'; 

import { BASE_API_URL } from "../../../config/API";

@Component({
  selector: 'app-historial-citas',
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.scss']
})
export class HistorialCitasComponent extends BasePageComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

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
  a:string;
  b:string;
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    // private conf: ConfirmationService,
    private admService: AdministradorService,
		private router: Router,
  ) {
    super(store, httpSv);

    this.pageData = {
      title: "Historial de Citas",
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
          title: "Historial de Citas"
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
    //this.httpSv.cancelarCitasPasadas();
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
        this.data = data;
        this.citasEdit = data.results;
        this.toastr.warning("Buscando Citas", "Especialidad: " + valor);
      });
    }
  }
  buscarDNI(valor: string) {
    console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchCitaDNI(this.campo).subscribe(data => {
        if (this.data.results == null) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Buscando Citas", "DNI: " + valor);
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
  ) {
    // console.log(JSON.stringify(row));
    this.initForm();
    //this.initFormCabecera(row.numeroHistoria.numeroHistoria,row.);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
    // console.log("Cita obtenida" + JSON.stringify(row));
  }
  initForm() {
    // console.log(JSON.stringify(data));
    this.today=new Date();
    this.appointmentForm = this.formBuilder.group({
      fechaAtencion1: [
        formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "",
        Validators.required
      ],
      fechaAtencion2: [
        formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "",
        Validators.required
      ],
      
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
    console.log(JSON.stringify(newCita));
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
        }
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
    this.httpSv.loadHistorialCitas().subscribe(data => {
      this.data = data;
      this.citasEdit = data.results;
    });
  }
  
  /*Problema en reportes*/
  reporteDiario(){
    document.location.href = BASE_API_URL+"/admision/reporteDiarioCitas" ;
    //this.router.navigate(['/vertical/citas'])
    this.toastr.success("Se ha generado el Pdf");
  }
  reporteRango(ab:FormGroup){
    this.a=ab.get('fechaAtencion1').value;
    this.b=ab.get('fechaAtencion2').value;

    document.location.href = BASE_API_URL+"/admision/reporteCitasRangoFecha/"+this.a+"/"+this.b ;
    this.toastr.success("Se ha generado el Pdf");
    this.closeModal();
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
