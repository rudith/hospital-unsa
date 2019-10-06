import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { Cita } from '../../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../../ui/interfaces/option';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Especialidad } from '../../../interfaces/especialidad';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-citas',
	templateUrl: './citas.component.html',
	styleUrls: ['./citas.component.scss'],
	providers: [ConfirmationService]
})
export class CitasComponent extends BasePageComponent implements OnInit, OnChanges {
	cita: Cita;
	citas: Cita[];
	public today: Date;
	tableData: any;
	patientForm: FormGroup;
	gender: IOption[];
	status: IOption[];
	public dni: string;
	appointmentForm: FormGroup;
	public espOption: IOption[];
	public especialidades: Especialidad[] = [];
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
			title: 'Citas',
			loaded: true,
			breadcrumbs: [
				{
					title: 'UI Kit',
					route: 'default-dashboard'
				},
				{
					title: 'Tables',
					route: 'default-dashboard'
				},
				{
					title: 'Citas'
				}
				,
				{
					title: 'Search'
				}
			]
		};
		this.tableData = [];
		this.citas = [];
		this.loadCitas();
		this.espOption = [];
		this.httpSv.loadEspecialidades().subscribe(especialidades => {
			this.especialidades = especialidades;
			this.loadOptions();
		});
	}
	confirm() {
		this.conf.confirm({
			message: 'Are you sure that you want to perform this action?',
			accept: () => {
				this.toastr.success('', 'Cita ACtualizad2a');
			}
		});
	}
	ngOnInit() {
		super.ngOnInit();
		this.store.select('citas').subscribe(citas => {
			if (citas && citas.length) {
				this.citas = citas;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	ngOnChanges($event) {
		console.log(this.dni);
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}

	onChangeTable() {
		console.log("Entra");
		if (this.dni == "" || this.dni == undefined) {
			this.httpSv.loadCitas().subscribe(citas => {
				this.citas = citas
			});
		} else {
			this.httpSv.searchCita(this.dni).subscribe(data => {
				this.citas = data.citas;
				// console.log(JSON.stringify(this.citas));
			});;
		}
	}
	loadOptions() {
		for (let i in this.especialidades) {
			this.espOption[i] = {
				label: this.especialidades[i].nombre,
				value: this.especialidades[i].id.toString()
			};
		}
	}
	// open modal window
	openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Cita) {
		// console.log(JSON.stringify(row));
		this.initForm();
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
		console.log("Cita obtenida" + JSON.stringify(row));
	}
	initForm() {
		// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
		this.appointmentForm = this.formBuilder.group({
			fechaSeparacion: ['', Validators.required],
			especialidad: ['', Validators.required]
		});
	}
	// init form
	// initForm(data: Cita) {
	// 	// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
	// 	this.appointmentForm = this.formBuilder.group({
	// 		fechaSeparacion: [data.fechaSeparacion, Validators.required],
	// 		especialidad: [data.especialidad, Validators.required]
	// 	});
	// }

	// close modal window
	closeModal() {
		this.modal.close();
		this.appointmentForm.reset();
	}
	sendCita(cita: Cita) {
		this.cita = cita;
	}
	addAppointment(form: FormGroup) {
		// console.log(JSON.stringify(form));
		if (form.valid) {
			this.today = new Date();
			let newAppointment: Cita = form.value;
			newAppointment.fechaSeparacion = formatDate(
				form.value.fechaSeparacion,
				'yyyy-MM-dd',
				'en-US',
				'+0530'
			);
			newAppointment.fechaAtencion = this.cita.fechaAtencion;
			newAppointment.especialidad = form.value.especialidad;
			newAppointment.id = this.cita.id;
			newAppointment.numeroRecibo = this.cita.numeroRecibo;
			newAppointment.estadoCita = this.cita.estadoCita;
			newAppointment.estReg = this.cita.estReg;
			newAppointment.numeroHistoria = this.cita.numeroHistoria;
			newAppointment.exonerado = this.cita.exonerado;
			newAppointment.responsable = this.cita.responsable;
			newAppointment.medico = this.cita.medico;
			this.updateCita(newAppointment);

			this.closeModal();
			this.appointmentForm.reset();
		}
	}
	updateCita(newCita: Cita) {
		console.log(JSON.stringify(newCita));
		this.http.put<any>('http://18.216.2.122:9000/consultorio/crear-cita/' + newCita.id + "/", {
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
		})
			.subscribe(
				data => {
					this.toastr.success('', 'Cita ACtualizad2a');
					// this.messageService.add({ severity: 'info', summary: 'Cita Actualizada' });
					newCita = <Cita>{};
					this.loadCitas();
				},
				error => {
					console.log(error.message);
				}
			);
		// console.log(JSON.stringify(this.newHistoria));
	}

	// init form

	loadCitas() {
		this.httpSv.loadCitas().subscribe(citas => {
			this.citas = citas

		});
	}
	CancelarCita(id: number) {
		// this.http.get("http://18.216.2.122:9000/consultorio/cancelarcita/"+id).subscribe((data: Cita[]) => {
		// 		this.citas = data;
		// 		console.log("cita eliminada");
		// 	}, error => {
		// 		console.log(error.message);
		// });
		this.httpSv.CancelarCita(id).subscribe(cita => {
			this.loadCitas();
			// this.messageService.add({ severity: 'info', summary: 'Cita Cancelada' });
		});
	}

}
