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
  personales: Personal[];
  data: personalLista = <personalLista>{};
  appointmentForm: FormGroup;
  usersOpt: IOption[] = [];
  areasOpt: IOption[] = [];
  tiposOpt: IOption[] = [];
  especialidadesOpt: IOption[] = [];
  users: User[];
  areas: Area[];
  tipos: Tipopersonal[];
  especialidades: Especialidad[];
  pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
  goToPage: EventEmitter<number> = new EventEmitter<number>();

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
      title: "Personal (no implementado)",
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
      this.users = users;
      this.loadOptionsUsers();
    });
    this.admService.loadAreas().subscribe(areas => {
      this.areas = areas;
      this.loadOptionsAreas();
    });
    this.admService.loadEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
      this.loadOptionsEsp();
    });
    this.admService.loadTPersonal().subscribe(tipos => {
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
  buscar() {
    if (this.id == 0 || this.id == undefined) {
      this.loadPersonal();
      this.toastr.warning("Todas las citas cargadas", "Ningun valor ingresado");
    } else {
      this.admService.searchPersonal(this.id).subscribe(
        personales => {
          this.personales = [];
          this.personales[0] = personales;
          this.toastr.success("Personal(es) encontrado(s)");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
  // abre modal
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
      this.admService.createPersonal(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
      this.loadPersonal();
    }
  }
}
