
import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { IPatient } from '../../../interfaces/patient';
import { Cita } from '../../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import { Content } from '../../../ui/interfaces/modal';
import * as PatientsActions from '../../../store/actions/patients.actions';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Especialidad } from '../../../interfaces/especialidad';
import { User } from '../../../interfaces/user';
import { MessageService } from 'primeng/components/common/messageservice';
import { Personal } from '../../../interfaces/personal';

@Component({
	selector: 'app-editar',
	templateUrl: './editar.component.html',
	styleUrls: ['./editar.component.scss',
		// '../../../../../node_modules/primeng/resources/primeng.css'],
	],
	providers: [MessageService]
})
export class EditarComponent extends BasePageComponent
	implements OnInit, OnDestroy {
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

	constructor(
		private formBuilder: FormBuilder,
		store: Store<IAppState>,
		httpSv: HttpService,
		private modal: TCModalService,
		private fb: FormBuilder,
		private http: HttpClient,
		private messageService: MessageService
	) {

		super(store, httpSv);

		this.pageData = {
			title: 'Editar',
			loaded: true,
			breadcrumbs: [
				{
					title: 'Administrar'
				}
				,
				{
					title: 'Editar'
				}
			]
		};
		this.tableData = [];
		this.users = [];
		this.user = <User>{};
		this.loadUsers();

	}

	ngOnInit() {
		super.ngOnInit();
		this.store.select('users').subscribe(users => {
			if (users && users.length) {
				this.users = users;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	ngOnChanges($event) {
		console.log(this.id);
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}
	// Elimina usuario de se envia el id y retorna un mensaje de confirmacion
	deleteUser(id: string) {
		this.httpSv.DeleteUser(id).subscribe(
			data => {
				this.messageService.add({ severity: 'info', summary: 'Datos Eliminado' });
				this.loadUsers();
			}
		);
	}
	// Verifica el campo de texto antes de la busqueda  y devuelve un mensaje de confirmacion
	onChangeTable() {

		if (this.id == "" || this.id == undefined) {
			this.httpSv.loadUsers().subscribe(users => {
				this.users = users;
				this.messageService.add({ severity: 'info', summary: 'Campo Vacio' });
			});
		} else {

			this.httpSv.searchUsers(this.id).subscribe(data => {
				this.messageService.add({ severity: 'info', summary: 'Datos CArgados' });
				this.users = []
				this.users[0] = data;
				console.log(JSON.stringify(data));
			});;
		}
	}
	loadOptions() {

	}
	// abre modal
	openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null) {
		this.initForm();
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}
	// inicia el formulario
	initForm() {
		// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
		this.appointmentForm = this.formBuilder.group({
			username: ["", Validators.required],
			email: ["", Validators.required],
			password: ["", Validators.required],
		});
	}
	// inicia el formulario de edicion
	openModalEdit<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: User) {
		// console.log(JSON.stringify(row));
		this.initFormEdit(row);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}
	// abre el modal de personal
	openModalPersonal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Personal) {
		this.initFormPersonal(row);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}
	// init form
	initFormEdit(data: User) {
		// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
		this.appointmentForm = this.formBuilder.group({
			username: [data.username, Validators.required],
			email: [data.email, Validators.required],
			password: [data.password, Validators.required],
		});
	}
	initFormPersonal(row: Personal) {
		this.PersonalForm = this.formBuilder.group({
			nombre: ["", Validators.required]
		});
	}
	// cierra modal
	updateEst(bool: boolean) {
		this.update = bool;
	}
	// guarda el usuario para edicion
	sendUser(user: User) {
		this.user = user;
	}
	// cierra modal
	closeModal() {
		this.modal.close();
		this.appointmentForm.reset();
	}
	// cierra modal
	closeModalPersonal() {
		this.modal.close();
		this.PersonalForm.reset();
	}
	// verifica formulario del modal personal y agregara a la bd, devuelve un mensaje de confirmación
	addPersonal(form: FormGroup) {
		console.log(JSON.stringify(form.value));
		if (form.valid) {
			// console.log(JSON.stringify(form));
			this.PersonalForm.reset();
			this.closeModalPersonal();
		}

	}
	// verifica formulario del modal usuario y agregara a la bd, devuelve un mensaje de confirmación
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
			}
			else {
				newAppointment.is_superuser = true;
				newAppointment.is_staff = true;
				newAppointment.is_active = true;
				this.createUser(newAppointment);
			}

			this.update = false;
			this.appointmentForm.reset();
		}

	}
	// actualiza usuario y devuelve un mensaje de confirmación
	updateUser(User: User) {
		this.httpSv.UpdateUser(User).subscribe(
			data => {
				this.messageService.add({ severity: 'info', summary: 'Usuario Actualizado' });
				this.loadUsers();
				this.closeModal();
			},
		);
	}
	// actualiza usuario y devuelve un mensaje de confirmación
	createUser(newUser: User) {
		this.httpSv.CreateUser(newUser).subscribe(
			data => {
				this.messageService.add({ severity: 'info', summary: 'Usuario Creado' });
				this.loadUsers();
				this.closeModal();
			}
		);
	}
	// carga usuarios y devuelve un mensaje de confirmación
	loadUsers() {
		this.httpSv.loadUsers().subscribe(users => {
			this.users = users
		});
	}

}
