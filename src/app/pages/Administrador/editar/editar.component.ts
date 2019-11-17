import { Component, OnDestroy, OnInit, OnChanges } from "@angular/core";
import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { HttpService } from "../../../services/http/http.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IOption } from "../../../ui/interfaces/option";
import { Content } from "../../../ui/interfaces/modal";
import * as PatientsActions from "../../../store/actions/patients.actions";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { HttpClient } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { User } from "../../../interfaces/user";
import { MessageService } from "primeng/components/common/messageservice";
import { Personal } from "../../../interfaces/personal";
import { ToastrService } from "ngx-toastr";
import { AdministradorService } from "../../../services/Administrador/administrador.service";

@Component({
  selector: "app-editar",
  templateUrl: "./editar.component.html",
  styleUrls: ["./editar.component.scss"],
  providers: [MessageService]
})
export class EditarComponent extends BasePageComponent
  implements OnInit, OnDestroy {
  data: any = <any>{};
  pageNum: number;
  user: User;
  users: User[];
  tableData: any;
  gender: IOption[];
  status: IOption[];
  public id: string;
  appointmentForm: FormGroup;
  PersonalForm: FormGroup;
  public update: boolean = false;
  val: number;
  opBus: string;
  busqOption: IOption[];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    store: Store<IAppState>,
    httpSv: HttpService,
    private modal: TCModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private admService: AdministradorService
  ) {
    super(store, httpSv);

    this.pageData = {
      title: "",
      loaded: true,
      breadcrumbs: [
        {
          title: "Administrar"
        },
        {
          title: "Editar"
        }
      ]
    };
    this.pageNum = 1;
    this.tableData = [];
    this.users = [];
    this.user = <User>{};
    this.loadUsers();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.select("users").subscribe(users => {
      if (users && users.length) {
        this.users = users;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }
  //Paginacion
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.admService
        .loadUserPagination(this.data.next)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.users = this.data.results;
        });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.admService
        .loadUserPagination(this.data.previous)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.users = this.data.results;
        });
    }
  }
  ngOnChanges($event) {
    console.log(this.id);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /***
   * autor: Gerson Huarcaya
   * deleteUser: Elimina un  usuario.,se envia el id y retorna un mensaje de confirmacion
   ***/
  deleteUser(id: string) {
    this.httpSv.DeleteUser(id).subscribe(data => {
      this.toastr.info("Datos Eliminados");
      this.loadUsers();
    });
  }

  /***
   * autor: Gerson Huarcaya
   * onChangeTable: Verifica el campo de texto antes de la busqueda  y devuelve un mensaje de confirmacion
   ***/
  onChangeTable() {
    if (this.id == "" || this.id == undefined) {
      this.httpSv.loadUsers().subscribe(users => {
        this.users = users;
        this.toastr.info("Campo vacio");
      });
    } else {
      this.httpSv.searchUsers(this.id).subscribe(data => {
        this.toastr.info("Usuarios con: "+this.id,"Buscando...");
        this.users = [];
        this.users = data;
        console.log(JSON.stringify(data));
      });
    }
  }

  /***
   * autor: Gerson Huarcaya
   * openModal: Abre Modal para crear un usuario
   ***/
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

  /***
   * autor: Gerson Huarcaya
   * initForm: Inicializa el formulario para crear usuario
   ***/
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  /***
   * autor: Gerson Huarcaya
   * openModalEdit: Abre Modal para modificar un usuario
   ***/
  openModalEdit<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: User
  ) {
    // console.log(JSON.stringify(row));
    this.initFormEdit(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  /***
   * autor: Gerson Huarcaya
   * openModalPersonal: Abre Modal para crear un personal
   ***/
  openModalPersonal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Personal
  ) {
    this.initFormPersonal(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  /***
   * autor: Gerson Huarcaya
   * initFormEdit: Inicializa el formulario para modificar usuario
   ***/
  initFormEdit(data: User) {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      username: [data.username, Validators.required],
      password: [data.password, Validators.required]
    });
  }

  /***
   * autor: Gerson Huarcaya
   * initFormPersonal:
   ***/
  initFormPersonal(row: Personal) {
    this.PersonalForm = this.formBuilder.group({
      nombre: ["", Validators.required]
    });
  }

  /***
   * autor: Gerson Huarcaya
   * updateEst:Actualizar el estado
   ***/
  updateEst(bool: boolean) {
    this.update = bool;
  }

  /***
   * autor: Gerson Huarcaya
   * sendUser:guarda el usuario para edicion
   ***/
  sendUser(user: User) {
    this.user = user;
  }

  /***
   * autor: Gerson Huarcaya
   * closeModal:Cierra el Modal
   ***/ l;
  closeModal() {
    this.modal.close();
    this.appointmentForm.reset();
  }

  /***
   * autor: Gerson Huarcaya
   * closeModalPersonal:Cierra el Modal
   ***/
  closeModalPersonal() {
    this.modal.close();
    this.PersonalForm.reset();
  }

  /***
   * autor: Gerson Huarcaya
   * addPersonal:verifica formulario del modal personal y agregara a la bd, devuelve un mensaje de confirmación
   ***/

  addPersonal(form: FormGroup) {
    console.log(JSON.stringify(form.value));
    if (form.valid) {
      // console.log(JSON.stringify(form));
      this.PersonalForm.reset();
      this.closeModalPersonal();
    }
  }

  /***
   * autor: Gerson Huarcaya
   * addAppointment:verifica formulario del modal usuario y agregara a la bd, devuelve un mensaje de confirmación
   ***/

  addAppointment(form: FormGroup) {
    // console.log(JSON.stringify(form));
    if (form.valid) {
      let newAppointment: User = form.value;
      newAppointment.first_name = this.user.first_name;
      newAppointment.last_name = this.user.last_name;
      newAppointment.last_login = this.user.last_login;
      newAppointment.date_joined = this.user.date_joined;
      newAppointment.groups = this.user.groups;
      newAppointment.user_permissions = this.user.user_permissions;
      newAppointment.is_superuser = this.user.is_superuser;
      newAppointment.is_staff = this.user.is_superuser;
      newAppointment.is_active = this.user.is_superuser;
      if (this.update) {
        newAppointment.id = this.user.id;
        this.updateUser(newAppointment);
      } else {
        newAppointment.is_superuser = true;
        newAppointment.is_staff = true;
        newAppointment.is_active = true;
        this.createUser(newAppointment);
      }

      this.update = false;
      this.appointmentForm.reset();
    }
  }

  /***
   * autor: Gerson Huarcaya
   * updateUser:actualiza usuario y devuelve un mensaje de confirmación
   ***/

  updateUser(User: User) {
    this.httpSv.UpdateUser(User).subscribe(data => {
      this.toastr.success("Usuario Actualizado");
      this.loadUsers();
      this.closeModal();
    });
  }

  /***
   * autor: Gerson Huarcaya
   * createUser:crea usuario y devuelve un mensaje de confirmación
   ***/

  createUser(newUser: User) {
    this.httpSv.CreateUser(newUser).subscribe(data => {
      this.toastr.success("Usuario Creado");
      this.loadUsers();
      this.closeModal();
    });
  }

  /***
   * autor: Gerson Huarcaya
   * loadUsers:carga usuarios y devuelve un mensaje de confirmación
   ***/

  loadUsers() {
    this.admService.loadUser().subscribe(users => {
      this.data = users;
      this.users = users.results;
    });
  }
}
