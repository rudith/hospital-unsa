import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { Area } from "../../../interfaces/area";
// import { ConfirmationService } from 'primeng/api';
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../services/http/http.service";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PersonalCreate } from "../../../interfaces/personalCreate";
import { Personal } from "../../../interfaces/personal";
import { IOption } from "../../../ui/interfaces/option";
import { User } from "../../../interfaces/user";
import { Tipopersonal } from "../../../interfaces/tipopersonal";
import { Especialidad } from "../../../interfaces/especialidad";
import { personalLista } from "../../../interfaces/personalLista";
@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.scss"]
})
export class PersonalComponent extends BasePageComponent implements OnInit {
  id: number;
  personales: Personal[] = [];
  data: personalLista = <personalLista>{};
  appointmentForm: FormGroup;
  personalForm: FormGroup;
  busForm: FormGroup;
  usersOpt: IOption[] = [];
  areasOpt: IOption[] = [];
  tiposOpt: IOption[] = [];
  busqOption: IOption[];
  especialidadesOpt: IOption[] = [];
  users: User[];
  areas: Area[];
  tipos: Tipopersonal[];
  especialidades: Especialidad[];
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  goToPage: EventEmitter<number> = new EventEmitter<number>();
  opBus: string;
  campo: string;
  constructor(
    httpSv: HttpService,
    private admService: AdministradorService,
    private toastr: ToastrService,
    store: Store<IAppState>,
    private modal: TCModalService,
    private formBuilder: FormBuilder // private conf: ConfirmationService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: "Personal",
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
          title: "personales"
        },
        {
          title: "Search"
        }
      ]
    };

    this.loadPersonal();
    this.users = [];
    this.areas = [];
    this.especialidades = [];
    this.tipos = [];
    this.admService.loadUser().subscribe(users => {
      this.users = users.results;
      this.loadOptionsUsers();
    });
    this.admService.loadAreas().subscribe(areas => {
      this.areas = areas.results;
      this.loadOptionsAreas();
    });
    this.admService.loadEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades.results;
      this.loadOptionsEsp();
    });
    this.admService.loadTPersonal().subscribe(tipos => {
      this.tipos = tipos.results;
      this.loadOptionsTipos();
    });
    this.pageNum = 1;
  }
  ngOnInit() {
    super.ngOnInit();
    this.store.select("personalLista").subscribe(data => {
      if (data && data.length) {
        this.data = data;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.getData("assets/data/opcionBusquedaPersonal.json", "busqOption");
    this.initBusForm();
  }

  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.admService
        .loadPersonalPagination(this.data.next)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.personales = this.data.results;
        });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.admService
        .loadPersonalPagination(this.data.previous)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.personales = this.data.results;
        });
    }
  }
  // carga personales
  loadPersonal() {
    this.admService.loadPersonal().subscribe(personalLista => {
      this.data = personalLista;
      this.personales = this.data.results;
      // console.log(JSON.stringify(this.personales));
    });
  }
  loadOptionsUsers() {
    for (let i in this.users) {
      this.usersOpt[i] = {
        label: this.users[i].username,
        value: this.users[i].id.toString()
      };
    }
  }
  loadOptionsAreas() {
    for (let i in this.areas) {
      this.areasOpt[i] = {
        label: this.areas[i].nombre,
        value: this.areas[i].id.toString()
      };
    }
  }
  loadOptionsTipos() {
    for (let i in this.tipos) {
      this.tiposOpt[i] = {
        label: this.tipos[i].nombre,
        value: this.tipos[i].id.toString()
      };
    }
  }
  loadOptionsEsp() {
    for (let i in this.especialidades) {
      this.especialidadesOpt[i] = {
        label: this.especialidades[i].nombre,
        value: this.especialidades[i].id.toString()
      };
    }
  }

  //busca segun el input y devuelve un mensaje de confirmación
  initBusForm() {
    this.busForm = this.formBuilder.group({
      opBus: ["", Validators.required],
      campo: ["", [Validators.required, Validators.pattern("[0-9]*"),Validators.minLength(1),Validators.maxLength(8)]]
    });
  }
  buscar(busca: FormGroup) {
    this.campo = busca.get("campo").value;
    this.opBus = busca.get("opBus").value;

    console.log("entra" + this.opBus + " " + this.campo);
    if (this.opBus == "1") {
      this.buscarDNI();
    }
    if (this.opBus == "2") {
      this.buscarId();
    }
  }
  buscarId() {
    console.log(this.id);
    if (this.campo === "" || this.campo === undefined) {
      this.loadPersonal();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.admService.searchPersonal(this.campo).subscribe(
        data => {
          this.personales = [];
          this.personales[0] = data;
          this.toastr.success("Personal(es) encontrado(s)");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
  buscarDNI() {
    console.log(this.campo);
    if (this.campo === "" || this.campo === undefined) {
      this.loadPersonal();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.admService.searchPersonalDNI(this.campo).subscribe(
        data => {
          this.personales = [];
          this.personales[0] = data;
          this.toastr.success("Personal(es) encontrado(s)");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
  // abre modal crear personal
  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null
  ) {
    this.initForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  // cierra modal
  closeModal() {
    this.modal.close();
  }

  //inicia formulario
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      user: ["", Validators.required],
      dni: ["", Validators.required],
      nombres: ["", Validators.required],
      apellido_paterno: ["", Validators.required],
      apellido_materno: ["", Validators.required],
      celular: ["", Validators.required],
      telefono: ["", Validators.required],
      direccion: ["", Validators.required],
      area: ["", Validators.required],
      tipo_personal: ["", Validators.required],
      especialidad: ["", Validators.required]
    });
  }
  //agrega area a la bd
  addAppointment(form: FormGroup) {
    if (form.valid) {
      let newAppointment: PersonalCreate = form.value;
      console.log(JSON.stringify(newAppointment));
      this.admService.createPersonal(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
      this.loadPersonal();
    }
  }

  //modal vermas

  openModalVerMas<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Personal
  ) {
    this.initPersonalForm(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  closeModalP() {
    this.modal.close();
  }

  initPersonalForm(data: Personal) {
    this.personalForm = this.formBuilder.group({
      user: [data.user.username ? data.user.username : "", Validators.required],
      area: [data.area.nombre ? data.area.nombre : "", Validators.required],
      tipo_personal: [
        data.tipo_personal.nombre ? data.tipo_personal.nombre : "",
        Validators.required
      ],
      especialidad: [
        data.especialidad.nombre ? data.especialidad.nombre : "Ninguna",
        Validators.required
      ],
      dni: [
        data.apellido_materno ? data.apellido_materno : "",
        Validators.required
      ],
      nombres: [data.nombres ? data.nombres : "", Validators.required],
      apellido_paterno: [
        data.apellido_paterno ? data.apellido_paterno : "",
        Validators.required
      ],
      apellido_materno: [
        data.apellido_materno ? data.apellido_materno : "",
        Validators.required
      ],
      celular: [data.celular ? data.celular : "", Validators.required],
      telefono: [data.telefono ? data.telefono : "", Validators.required],
      direccion: [data.direccion ? data.direccion : "", Validators.required],
      fechaReg: [data.fechaReg ? data.fechaReg : "", Validators.required],
      updated_at: [data.updated_at ? data.updated_at : "", Validators.required],
      estReg: [data.estReg ? data.estReg : "", Validators.required]
    });
  }
}
