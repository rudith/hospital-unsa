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
import { HttpClient } from "@angular/common/http";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.scss"]
})
export class PersonalComponent extends BasePageComponent implements OnInit {
  id: number;
  idPersonal: string;
  personales: Personal[] = [];
  data: personalLista = <personalLista>{};
  appointmentForm: FormGroup;
  personalForm: FormGroup;
  busForm: FormGroup;
  usersOpt: IOption[] = [];
  areasOpt: IOption[] = [];
  tiposOpt: IOption[] = [];
  // busqOption: IOption[];
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
  labelUser: string;
  labelArea: string;
  labelEsp: string;
  labelTipo: string;
  edit: boolean;
  constructor(
    httpSv: HttpService,
    private http: HttpClient,
    private admService: AdministradorService,
    private toastr: ToastrService,
    store: Store<IAppState>,
    private modal: TCModalService,
    private formBuilder: FormBuilder // private conf: ConfirmationService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: "",
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
    this.admService.loadUserSP().subscribe(users => {
      this.users = users;
      this.loadOptionsUsers();
    });
    this.admService.loadAreasSP().subscribe(areas => {
      this.areas = areas;
      // console.log(JSON.stringify(areas));
      this.loadOptionsAreas();
    });
    this.admService.loadEspecialidadesSP().subscribe(especialidades => {
      this.especialidades = especialidades;
      this.loadOptionsEsp();
    });
    this.admService.loadTPersonalSP().subscribe(tipos => {
      this.tipos = tipos;
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
    // this.getData("assets/data/opcionBusquedaPersonal.json", "busqOption");
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
    });
  }

  loadusersSP(data: Personal) {
    if (data != null) {
      this.labelArea = "";
      this.labelEsp = "";
      this.labelTipo = "";
      this.labelUser = "";
      this.labelTipo = data.tipo_personal.nombre;
      if (data.especialidad == null) this.labelEsp = "Ninguna";
      else this.labelEsp = data.especialidad.nombre;
      if (data.user == null) this.labelUser = "Sin usuario";
      else this.labelUser = data.user.username;
      if (data.area == null) this.labelArea = "Sin area";
      else this.labelArea = data.area.nombre;
      if (data.tipo_personal == null) this.labelTipo = "Sin Tipo";
      else this.labelTipo =data.tipo_personal.nombre;
    }
    this.admService.loadUserSP().subscribe(users => {
      this.users = users;
      console.log(users)
      this.loadOptionsUsers();
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
      // opBus: ["", Validators.required],
      campo: [
        "",
        [
          Validators.required,
          Validators.pattern("[0-9]*"),
          Validators.minLength(1),
          Validators.maxLength(8)
        ]
      ]
    });
  }
  buscar(busca: FormGroup) {
    this.campo = busca.get("campo").value;
  
    this.buscarDNI();
    
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
    footer: Content<T> = null,
    row: Personal
  ) {
    if (row == null) this.initForm();
    else this.initFormEdit(row);
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
    this.edit = false;
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      id: ["", Validators.required],
      dni: ["", Validators.required],
      nombres: ["", Validators.required],
      apellido_paterno: ["", Validators.required],
      apellido_materno: ["", Validators.required],
      celular: ["", ],
      telefono: ["", ],
      direccion: ["",],
      area: ["", Validators.required],
      tipo_personal: ["", Validators.required],
      especialidad: [""]
    });
  }
  initFormEdit(data: Personal) {
    this.edit = true;
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      id: data.id,
      dni: [data.dni, Validators.required],
      nombres: [data.nombres, Validators.required],
      apellido_paterno: [data.apellido_paterno, Validators.required],
      apellido_materno: [data.apellido_materno, Validators.required],
      celular: [data.celular, ],
      telefono: [data.telefono, ],
      direccion: [data.direccion, ],
      area: ["", [Validators.required]],
      tipo_personal: ["", [Validators.required]],
      especialidad: [""]
    });
  }
  addAppointment(form: FormGroup) {
    if (form.valid) {
      let newAppointment: PersonalCreate = form.value;
     
      console.log(newAppointment)

      this.admService.createPersonal(newAppointment).subscribe(
        data => {
          this.closeModal();
          this.appointmentForm.reset();
          this.loadPersonal();
          this.toastr.success("personal Creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear personal");
        }
      );
    }
  }
  editPersonal(form: FormGroup) {
    if (form.valid) {
      let newAppointment: PersonalCreate = form.value;
      // console.log(JSON.stringify(newAppointment));

      // setTimeout(() => {
      //   if (this.admService.createPersonal(newAppointment)) {
      this.admService.updatePersonal(newAppointment).subscribe(
        data => {
          this.closeModal();
          this.appointmentForm.reset();
          this.loadPersonal();
          this.toastr.success("Edicion correcta");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo editar personal");
        }
      );
      //   }
      // }, 2000);
      // this.loadPersonal();
    }
  }

  //modal vermas

  openModalVerMas<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Personal
  ) {
    if (row.especialidad) {
      //this.initPersonalForm(row, row.especialidad.nombre);
    } else {
      row.especialidad.nombre= "Ninguna";
    }

    if (row.area) {
      //this.initPersonalForm(row, row.especialidad.nombre);
    } else {
      row.area.nombre= "Ninguna";
    }

    if (row.user.username) {
      //this.initPersonalForm(row, row.especialidad.nombre);
    } else {
      row.user.username= "Ninguna";
    }


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
  openModalEliminar<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    id: string,
    options: any = null
  ) {
    this.idPersonal = id;
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: options
    });
  }
  //eliminarpersonal
  Eliminarpersonal() {
    this.admService.eliminarPers(this.idPersonal).subscribe(
      data => {
        this.loadPersonal();
        this.toastr.success("Personal eliminado");
      },
      error => {
        console.log(error.message);
        this.toastr.error("No se pudo eliminar personal");
      }
    );
    this.closeModal();
  }
  initPersonalForm(data: Personal) {
    console.log(data)
    
    this.personalForm = this.formBuilder.group({
      user: [data.user.username ? data.user.username : "", Validators.required],
      area: [data.area.nombre ? data.area.nombre : "", Validators.required],
      tipo_personal: [
        data.tipo_personal.nombre ? data.tipo_personal.nombre : "",
        Validators.required
      ],
      especialidad: [data.especialidad.nombre],
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
  @HostListener("document:keydown", ["$event"]) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === "Escape") {
      this.closeModal();
      this.closeModalP();
    }
    if (event.key === "Enter") {
      return false;
    }
  }
}
