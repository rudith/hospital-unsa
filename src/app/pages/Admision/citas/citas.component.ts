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
import { ConfirmationService } from "primeng/api";
import { CitaM } from "../../../interfaces/cita-m";
import { Medico } from '../../../interfaces/medico';

@Component({
  selector: "app-citas",
  templateUrl: "./citas.component.html",
  styleUrls: ["./citas.component.scss"],
  providers: [ConfirmationService]
})
export class CitasComponent extends BasePageComponent
  implements OnInit, OnChanges {
  cita: CitaM;
  citas: Cita[];
  citasEdit: CitaM[];
  public today: Date;
  tableData: any;
  patientForm: FormGroup;
  gender: IOption[];
  status: IOption[];
  public dni: string;
  appointmentForm: FormGroup;
  cabModCita: FormGroup;
  public espOption: IOption[];
  medOption: IOption[];
  public especialidades: Especialidad[] = [];
  medicos:Medico[]=[];
  options: IOption[];
  selectedOptions: any;
  multiple: boolean;
  busqOption: IOption[];
  opBus: string;
  busForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private conf: ConfirmationService
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
    this.tableData = [];
    this.citas = [];
    this.citasEdit = [];
    this.loadCitas();
    this.espOption = [];
    this.medOption =[];
    this.multiple = false;
    this.httpSv.loadEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
    this.httpSv.loadMedico().subscribe(medicos => {
      this.medicos = medicos;
      this.loadOptions();
    });
    this.loadOptions();
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
      dni: ["", [Validators.required, Validators.pattern("[0-9]*")]]
    });
  }
  ngOnChanges($event) {
    console.log(this.dni);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  buscar(busca: FormGroup) {
    this.dni = busca.get("dni").value;
    this.opBus = busca.get("opBus").value;

    console.log("entra" + this.opBus + " " + this.dni);
    if (this.opBus == "1") {
      this.buscarDNI();
    }
    if (this.opBus == "2") {
      this.buscarEsp();
    }
  }
  buscarEsp() {
    console.log(this.dni);
    if (this.dni === "" || this.dni === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchCitaEsp(this.dni).subscribe(
        data => {
          this.citasEdit = data.citas;
          this.toastr.success("NO habilitado","mopdificar modelo back");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
  buscarDNI() {
    console.log(this.dni);
    if (this.dni === "" || this.dni === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchCitaDNI(this.dni).subscribe(
        data => {
          this.citasEdit = data.citas;
          this.toastr.success("Cita(s) encontrada(s)");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }

  loadOptions() {
    for (let i in this.especialidades) {
      this.espOption[i] = {
        label: this.especialidades[i].nombre,
        value: this.especialidades[i].id.toString()
      };
    }
    for (let i in this.medicos) {
      this.medOption[i] = {
        label: this.medicos[i].nombres,
        value: this.medicos[i].user.id.toString()
      };
    }
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
    this.appointmentForm = this.formBuilder.group({
      fechaAtencion: [
        data.fechaAtencion ? data.fechaAtencion : "",
        Validators.required
      ],
      especialidad: [
        data.especialidad.nombre ? data.especialidad.nombre : "",
        Validators.required
      ],
      medico:[
        data.medico.username ? data.medico.username : "",
        Validators.required
      ]
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
  sendCita(cita: CitaM) {
    this.cita = cita;
  }
  addAppointment(form: FormGroup) {
    console.log(JSON.stringify(+form.value.especialidad));
    if (form.valid) {
      this.today = new Date();
      let newAppointment: Cita = form.value;
      newAppointment.fechaAtencion = formatDate(
        form.value.fechaAtencion,
        "yyyy-MM-dd",
        "en-US",
        "+0530"
      );
      newAppointment.fechaSeparacion = this.cita.fechaSeparacion;
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
        "http://18.216.2.122:9000/consultorio/crear-cita/" + newCita.id + "/",
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
    this.httpSv.loadCitasEdit().subscribe(citas => {
      this.citasEdit = citas;
      // console.log(JSON.stringify(this.citasEdit));
    });
  }
  CancelarCita(id: number) {
    this.conf.confirm({
      message: "¿Esta seguro de cancelar la cita?",
      accept: () => {
        this.httpSv.CancelarCita(id).subscribe(
          cita => {
            this.loadCitas();
            this.toastr.success("", "Cita Cancelada");
          },
          error => {
            this.toastr.warning("Error Cita no cancelada");
          }
        );
      }
    });
  }
}
