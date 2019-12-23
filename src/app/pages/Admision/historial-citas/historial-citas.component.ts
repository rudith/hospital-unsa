import { Component, OnInit, OnChanges } from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { CitaM } from "../../../interfaces/cita-m";
import { citaLista } from "../../../interfaces/citaLista";
import { formatDate, LocationStrategy } from '@angular/common';
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
  pageNum: number;
  cita: CitaM = <CitaM>{};
  citas: Cita[];
  citasEdit: CitaM[] = [];
  public today: Date;
  tableData: any;
  campo: string;
  appointmentForm: FormGroup;
  options: IOption[];
  busqOption: IOption[];
  opBus: string = "";
  busForm: FormGroup;
  data: citaLista = <citaLista>{};
  a: string;
  b: string;
  stat: string;
  turn: number;
  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private location: LocationStrategy,
    private formBuilder: FormBuilder,
    private modal: TCModalService,
    private http: HttpClient,
    private toastr: ToastrService,
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
    this.stat = "";
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
    this.preventBackButton();
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
    if (this.opBus == "1") {
      this.buscarDNI(this.campo);
    }
    if (this.opBus == "2") {
      this.buscarEsp(this.campo);
    }
    if (this.opBus == "3") {
      this.buscarNumHist(this.campo);
    }
    if (this.opBus == "4") {
      this.buscarNom(this.campo);
    }
  }

  buscarEsp(valor: string) {
    // console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchHistCitasxEsp(this.campo).subscribe(data => {
        if (this.data.results.length == 0) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Mostrando Citas", "DNI: " + valor);
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
      this.httpSv.searchHistCitasxDni(this.campo).subscribe(data => {
        if (this.data.results.length == 0) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Mostrando Citas", "DNI: " + valor);
        }
      });
    }
  }

  buscarNumHist(valor: string) {
    console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchHistCitasxNumHist(this.campo).subscribe(data => {
        if (this.data.results.length == 0) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Mostrando Citas", "Historia: " + valor);
        }
      });
    }
  }


  buscarNom(valor: string) {
    console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadCitas();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.httpSv.searchHistCitasxNom(this.campo).subscribe(data => {
        if (this.data.results.length == 0) {
          this.toastr.info("No se encontraron coincidencias");
          this.loadCitas();
        } else {
          console.log(data);
          this.data = data;
          this.citasEdit = data.results;
          this.toastr.warning("Mostrando Citas", "Nombre: " + valor);
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

  
  openModal<T>(body: Content<T>,header: Content<T> = null,footer: Content<T> = null,) {
    this.initForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  initForm() {
    this.today = new Date();
    this.appointmentForm = this.formBuilder.group({
      fechaAtencion1: [
        formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') ? formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530') : "",
        Validators.required
      ],

    });
  }

  closeModal() {
    this.modal.close();
    this.appointmentForm.reset();
  }

  closeModalConf() {
    this.modal.close();
  }
  
  addAppointment(form: FormGroup) {
    if (form.valid) {
      this.today = new Date();
      let newAppointment: Cita = form.value;
      newAppointment.fechaAtencion = formatDate(form.value.fechaAtencion,"yyyy-MM-dd","en-US", '+0530');
      newAppointment.fechaSeparacion = formatDate(this.today,"yyyy-MM-dd","en-US", '+0530' );
      newAppointment.especialidad = form.value.especialidad;
      newAppointment.id = this.cita.id;
      newAppointment.numeroRecibo = this.cita.numeroRecibo;
      newAppointment.estadoCita = this.cita.estadoCita;
      newAppointment.estReg = this.cita.estReg;
      newAppointment.numeroHistoria = this.cita.numeroHistoria.id;
      newAppointment.exonerado = this.cita.exonerado;
      newAppointment.responsable = this.cita.responsable;
      this.updateCita(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
    }
  }

  updateCita(newCita: Cita) {
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
          newCita = <Cita>{};
          this.loadCitas();
        },
        error => {
          this.toastr.warning("Error Cita no Actualizada");
        }
      );
  }

  loadCitas() {
    this.httpSv.loadHistorialCitas().subscribe(data => {
      this.data = data;
      this.citasEdit = data.results;
    });
  }

  reporteDiario() {
    this.today=new Date();
    this.httpSv.cantidadCitasTurno(formatDate(this.today,"yyyy-MM-dd","en-US", '+0530' )).subscribe(historiales => {
      this.turn = historiales.orden;
      if (this.turn == 0) {
        this.toastr.warning("No hay citas disponibles");
        this.closeModal();
      } else {
        document.location.href = BASE_API_URL + "/admision/reporteDiarioCitas/";
    this.toastr.success("Se ha generado el Pdf");
        this.closeModal();
      }
    });
  }

  reporteRango(ab: FormGroup) {
    console.log(ab.get('fechaAtencion1').value)
    this.a = ab.get('fechaAtencion1').value;
    this.httpSv.cantidadCitasTurno(ab.get('fechaAtencion1').value).subscribe(historiales => {
      this.turn = historiales.orden;
      if (this.turn == 0) {
        this.toastr.warning("No hay citas disponibles");
        this.closeModal();
      } else {
        document.location.href = BASE_API_URL + "/admision/reporteCitasRangoFecha/" + this.a + "/";
        this.toastr.success("Se ha generado el Pdf");
        this.closeModal();
      }
    });
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

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
      this.closeModal();
      this.closeModalConf();
    });
  }


}
