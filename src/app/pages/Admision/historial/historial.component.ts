import { User } from './../../../interfaces/user';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { Cita } from '../../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from './../../../ui/interfaces/option';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Historial } from '../../../interfaces/historial';
import { Especialidad } from '../../../interfaces/especialidad';
import * as jsPDF from 'jspdf';
import { Grupsang } from '../../../interfaces/grupsang';
import { Provincia } from '../../../interfaces/provincia';
import { Departamento } from '../../../interfaces/departamento';
import { Distrito } from '../../../interfaces/distrito';
import { Medico } from '../../../interfaces/medico';
import {ToastrService} from 'ngx-toastr';


@Component({
	selector: 'app-historial',
	templateUrl: './historial.component.html',
	styleUrls: ['./historial.component.scss'],
	
})
export class HistorialComponent extends BasePageComponent
	implements OnInit, OnDestroy, OnChanges {
	@ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
	@ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
	public gruposang: Grupsang[];
	public gruposangOption: IOption[];
	public gradoInstruccionOption: IOption[];
	public estadoCivilOption:IOption[];
	public departamentosOption: IOption[];
	public provinciasOption: IOption[];
	public sexOption: IOption[];
	public ocupacionOption: IOption[];
	public distritosOption: IOption[];
	public medOption: IOption[];
	public provincias: Provincia[];
	public departamentos: Departamento[];
	public distritos: Distrito[];
	public medicos: Medico[];
	today: Date;
	datoBus: string;
	opBus: string;
	estadoBusq: boolean;
	tableData: any[];
	appointmentForm: FormGroup;
	historiaForm: FormGroup;
	historiales: Historial[];
	numero: number;
	busForm: FormGroup;
	patientForm: FormGroup;
	depa: number;
	public newCita: Cita;
	public espOption: IOption[];
	public busqOption: IOption[];
	public especialidades: Especialidad[];
	public users: User[] = [];
	constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr:ToastrService
	) {
		super(store, httpSv);
		this.gruposang = [];
		this.gruposangOption = [];
		this.gradoInstruccionOption = [];
		this.departamentos = [];
		this.departamentosOption = [];
		this.provincias = [];
		this.provinciasOption = [];
		this.sexOption = [];
		this.ocupacionOption = [];
		this.distritos = [];
		this.medOption = [];
		this.distritosOption = [];
		this.estadoCivilOption=[];
		this.medicos = [];
		this.loadData();
		this.historiales = [];
		this.espOption = [];
		this.newCita = <Cita>{};
		this.pageData = {
			title: 'Historiales',
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
					title: 'Historiales'
				},
				{
					title: 'Search'
				}

			]
		};
		this.tableData = [];
		this.historiales = [];
		this.loadHistorias();
		this.loadData();
		this.httpSv.loadEspecialidades().subscribe(especialidades => {
			this.especialidades = especialidades;
			this.loadOptions();
		});
	}
	ngOnChanges($event) {
		console.log();
	}
	loadHistorias() {
		this.httpSv.loadHistorias().subscribe(historiales => {
			this.historiales = historiales;
			
		});

	}
	ngOnInit() {
		super.ngOnInit();
		this.estadoBusq = false;
		this.initBusForm();
		this.getData('assets/data/opcionBusqueda.json', 'busqOption');
		this.store.select('historiales').subscribe(historiales => {
			if (historiales && historiales.length) {
				this.historiales = historiales;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	loadOptions() {
		for (let i in this.especialidades) {
			this.espOption[i] = {
				label: this.especialidades[i].nombre,
				value: this.especialidades[i].id.toString()
			};
		}
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}
	//Modal Historial
	openModalH<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, options: any = null) {
		this.initPatientForm();
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: options
		});
	}

	closeModalH() {
		this.modal.close();
		this.loadHistorias();
	}
	
	initPatientForm() {
		this.patientForm = this.formBuilder.group({
			numeroHistoria: ['', [Validators.required,Validators.pattern('[0-9]*')]],
			dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
			nombres: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			apellido_paterno: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			apellido_materno: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			sexo: ['', [Validators.required]],
			fechaNac: ['', [Validators.required]],
			celular: ['', [ Validators.minLength(9), Validators.maxLength(9)]],
			telefono: ['', [Validators.minLength(6), Validators.maxLength(6)]],
			estadoCivil: ['', [Validators.required]],
			gradoInstruccion: ['', [Validators.required]],
			ocupacion: ['', [Validators.required]],
			direccion: ['', Validators.required],
			nacionalidad: [ 'Peruana', [Validators.pattern('[A-Za-z ]*')]],
			email: [''],
			distrito: ['', Validators.required],
			provincia: ['', Validators.required],
			departamento: ['', Validators.required]
		});
	}

	addPatient(form: FormGroup) {
		if (form.valid) {
			let newPatient: Historial = form.value;
			newPatient.fechaNac = formatDate(form.value.fechaNac, 'yyyy-MM-dd', 'en-US', '+0530');
			newPatient.estReg = true;
			this.httpSv.createHISTORIAL(newPatient);
			this.closeModalH();
			this.loadHistorias();
			this.patientForm.reset();
		}
	}

	loadData() {

		//Sexo
		this.sexOption[0] = { label: "Masculino", value: "Masculino", };
		this.sexOption[1] = { label: "Femenino", value: "Femenino", };

		//Ocupacion
		this.ocupacionOption[0] = { label: "Profesor", value: "Profesor", };
		this.ocupacionOption[1] = { label: "Doctor", value: "Doctor", };
		this.ocupacionOption[2] = { label: "Licenciado", value: "Licenciado", };
		this.ocupacionOption[3] = { label: "Medico", value: "Medico", };
		this.ocupacionOption[4] = { label: "Ingeniero", value: "Ingeniero", };
		this.ocupacionOption[5] = { label: "Otro", value: "Otro", };
		this.ocupacionOption[6] = { label: "Independiente", value: "Independiente", };

		//Grado de Instruccion
		this.gradoInstruccionOption[0]={ label: "Primaria", value: "Primaria", };
		this.gradoInstruccionOption[1]={ label: "Secundaria", value: "Secundaria", };
		this.gradoInstruccionOption[2]={ label: "Sup. Tecnico", value: "Sup. Tecnico", };
		this.gradoInstruccionOption[3]={ label: "Universitario", value: "Universitario", };

		//Estado Civil
		this.estadoCivilOption[0]={ label: "Soltero(a)", value: "Soltero(a)", };
		this.estadoCivilOption[1]={ label: "Casado(a)", value: "Casado(a)", };
		this.estadoCivilOption[2]={ label: "Viudo(a)", value: "Viudo(a)", };
		this.estadoCivilOption[3]={ label: "Divorciado(a)", value: "Divorciado(a)", };
		this.estadoCivilOption[4]={ label: "Conviviente", value: "Conviviente", };


		this.loadprovincias();
		this.httpSv.loadProvincia().subscribe(provincias => {
			this.provincias = provincias,
				this.loadprovincias()
		});
		this.httpSv.loadDepartamento().subscribe(departamentos => {
			this.departamentos = departamentos,
				this.loaddepartamentos()
		});
		this.httpSv.loadDistrito().subscribe(distritos => {
			this.distritos = distritos,
				this.loaddistritos()
		});
		this.httpSv.loadMedico().subscribe(medicos => {
			this.medicos = medicos,
				this.loadmedicos()
		});
		this.httpSv.loadUsers().subscribe(medicos => {
			this.users = medicos,
				this.loadmedicos()
		});

	}

	loadSangre() {
		for (let i in this.gruposang) {
			this.gruposangOption[i] =
				{
					label: this.gruposang[i].descripcion,
					value: this.gruposang[i].id.toString()
				};
		}
	}
	loadprovincias() {
		for (let i in this.provincias) {
			this.provinciasOption[i] =
				{
					label: this.provincias[i].nombre,
					value: this.provincias[i].id.toString()
				};
		}
	}
	loaddepartamentos() {
		for (let i in this.departamentos) {
			this.departamentosOption[i] =
				{
					label: this.departamentos[i].nombre,
					value: this.departamentos[i].id.toString()
				};
		}
	}
	loaddistritos() {
		for (let i in this.distritos) {
			this.distritosOption[i] =
				{
					label: this.distritos[i].nombre,
					value: this.distritos[i].id.toString()
				};
		}
	}

	loadmedicos() {
		for (let i in this.users) {
			this.medOption[i] =
				{
					label: this.users[i].username,
					value: this.users[i].id.toString()
				};
		}
	}

	// open modal Cita
	openModal(body: any,
		header: any = null,
		footer: any = null,
		data: any = null,
		id: any,
	) {
		this.initAppoForm(data);
		this.modal.open({
			body: body,
			header: header,
			footer: footer
		});
	}

	// close modal window
	closeModal() {
		this.modal.close();
		this.appointmentForm.reset();
	}

	// init form
	initAppoForm(data: any) {
		// this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
		this.appointmentForm = this.formBuilder.group({
			numeroRecibo: ['',[Validators.pattern('[0-9]*')]],
			fechaSeparacion: ['', Validators.required],
			especialidad: ['', Validators.required],
			medico: ['', Validators.required],
			responsable: ['',],
			eleccion: ['',],
		});
	}
	initBusForm() {
		this.busForm = this.formBuilder.group({
			opBus: ['', Validators.required],
			datoBus: ['', [Validators.required, Validators.pattern('[0-9]*')]],
		});
	}

	getHistoria(n: number) {
		this.numero = n;
		console.log(this.numero);
	}
	// add new appointment
	addAppointment(form: FormGroup) {
		// console.log(JSON.stringify(form));
		if (form.valid) {
			this.today = new Date();
			let newAppointment: Cita = form.value;
			newAppointment.fechaAtencion = formatDate(
				form.value.fechaSeparacion,
				'yyyy-MM-dd',
				'en-US',
				'+0530'
			);
			newAppointment.fechaSeparacion = formatDate(
				this.today,
				'yyyy-MM-dd',
				'en-US',
				'+0530'
			);

			newAppointment.estadoCita = 'Espera';
			newAppointment.estReg = true;
			newAppointment.numeroHistoria = this.numero;
			
			if (newAppointment.responsable == "") {
				newAppointment.exonerado = false;
				
			}
			else {
				newAppointment.numeroRecibo=null;
				newAppointment.exonerado = true;
			}

			this.httpSv.createCITA(newAppointment);
			this.closeModal();
			this.appointmentForm.reset();
		}
	}


	onChangeTable() {
		
		if (this.opBus == " ") {
			this.toastr.warning('Ningun valor ingresado');
			this.httpSv.loadHistorias().subscribe(historiales => {
				this.historiales = historiales;
				
			});
		} else if (this.opBus == "1") {
			
			this.toastr.warning('Buscando...');
			this.httpSv.searcHistoriasDNI(this.datoBus).subscribe(data => {
				this.historiales = [];
				this.historiales[0] = data;
				console.log("entro bus" + this.datoBus);
			}, error => {
				this.toastr.warning('No encontrado');
			});
		
		} else if (this.opBus == "2") {
			this.toastr.warning('Buscando...');
			this.httpSv.searcHistoriasNroR(this.datoBus).subscribe(data => {
				this.historiales = [];
				this.historiales[0] = data;
				console.log("entro bus" + this.datoBus);
			}, error => {
				this.toastr.warning('No encontrado');
			});
		}

	}
	buscar(busca: FormGroup) {
		this.datoBus = busca.get('datoBus').value;
		this.opBus = busca.get('opBus').value;
		this.onChangeTable();
	}

	// Ver Mas Historial
	openModalVerMas<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Historial) {
		this.initHistoriaForm(row);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}

	closeModalVH() {
		this.modal.close();
	}

	initHistoriaForm(data: Historial) {
		this.historiaForm = this.formBuilder.group({
			numeroHistoria: [data.numeroHistoria ? data.numeroHistoria : '', Validators.required],
			dni: [data.dni ? data.dni : '', Validators.required],
			nombres: [data.nombres ? data.nombres : '', Validators.required],
			apellido_paterno: [data.apellido_paterno ? data.apellido_paterno : '', Validators.required],
			apellido_materno: [data.apellido_materno ? data.apellido_materno : '', Validators.required],
			sexo: [data.sexo ? data.sexo : '', Validators.required],
			edad: [data.edad ? data.edad : '', Validators.required],
			fechaNac: [data.fechaNac ? data.fechaNac : '', Validators.required],
			celular: [data.celular ? data.celular : '', Validators.required],
			telefono: [data.telefono ? data.telefono : '', Validators.required],
			estadoCivil: [data.estadoCivil ? data.estadoCivil : '', Validators.required],
			gradoInstruccion: [data.gradoInstruccion ? data.gradoInstruccion : '', Validators.required],
			ocupacion: [data.ocupacion ? data.ocupacion : '', Validators.required],
			direccion: [data.direccion ? data.direccion : '', Validators.required],
			nacionalidad: [data.nacionalidad ? data.nacionalidad : '', Validators.required],
			email: [data.email ? data.email : '', Validators.required],
			estReg: [data.estReg ? data.estReg : '', Validators.required],
			distrito: [data.distrito ? data.distrito : '', Validators.required],
			provincia: [data.provincia ? data.provincia : '', Validators.required],
			departamento: [data.departamento ? data.departamento : '', Validators.required],
		});
	}

	private selectedLink: string = "rec";
	setradio(e: string): void {
		this.selectedLink = e;
	}

	isSelected(name: string): boolean {
		if (!this.selectedLink) {
			return false;
		}
		return (this.selectedLink === name); // if current radio button is selected, return true, else return false  
	}


	// Imprimir Historial

	imprimir(data) {
		var doc = new jsPDF();
		var imgData =
			'data:image/jpeg;base64,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';

		doc.addImage(imgData, 'JPEG', 15, 20, 42, 14);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.text('HOSPITAL DOCENTE - UNSA', 67, 30);

		doc.setFontSize(20);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('HISTORIA CLINICA', 60, 40);

		doc.setFontSize(20);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('HISTORIA Nº', 140, 25);

		doc.line(140, 30, 185, 30);
		doc.line(140, 45, 185, 45);
		doc.line(185, 45, 185, 30);
		doc.line(140, 30, 140, 45);
		doc.setFontSize(20);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text(data.id.toString(), 145, 40);

		// Fila 1

		doc.line(20, 65, 185, 65);
		doc.line(20, 85, 185, 85);

		doc.line(20, 65, 20, 85);
		doc.line(70, 65, 70, 85);
		doc.line(120, 65, 120, 85);
		doc.line(185, 65, 185, 85);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('APELLIDO PATERNO', 25, 70);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.apellido_paterno, 25, 80);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('APELLIDO MATERNO', 75, 70);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.apellido_materno, 75, 80);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('NOMBRES', 125, 70);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.nombres, 125, 80);

		// fila 2

		doc.line(20, 90, 185, 90);
		doc.line(20, 110, 185, 110);

		doc.line(20, 90, 20, 110);
		doc.line(70, 90, 70, 110);
		doc.line(120, 90, 120, 110);
		doc.line(155, 90, 155, 110);
		doc.line(185, 90, 185, 110);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('FECHA DE NACIMIENTO', 25, 95);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.fechaNac, 25, 105);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('LUGAR DE NACIMIENTO', 75, 95);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.departamento.toString(), 75, 105);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('DNI', 125, 95);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.dni.toString(), 125, 105);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('EDAD', 160, 95);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.edad.toString(), 160, 105);

		// fila 3

		doc.line(20, 115, 185, 115);
		doc.line(20, 135, 185, 135);

		doc.line(20, 115, 20, 135);
		doc.line(120, 115, 120, 135);
		doc.line(185, 115, 185, 135);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('DIRECCIÓN', 25, 120);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.direccion, 25, 130);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('DISTRITO', 125, 120);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text('', 125, 130);

		// fila 4

		doc.line(20, 140, 185, 140);
		doc.line(20, 160, 185, 160);

		doc.line(20, 140, 20, 160);
		doc.line(55, 140, 55, 160);
		doc.line(90, 140, 90, 160);
		doc.line(145, 140, 145, 160);
		doc.line(185, 140, 185, 160);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('SEXO', 25, 145);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.sexo, 25, 155);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('ESTADO CIVIL', 60, 145);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.estadoCivil, 60, 155);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('PROFESION/OCUPACIÓN', 95, 145);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.ocupacion, 95, 155);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('TELEFONO', 150, 145);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.telefono, 150, 155);

		// fila 5

		doc.line(20, 165, 185, 165);
		doc.line(20, 185, 185, 185);

		doc.line(20, 165, 20, 185);
		doc.line(80, 165, 80, 185);
		doc.line(125, 165, 125, 185);
		doc.line(185, 165, 185, 185);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('GRADO DE INSTRUCCIÒN', 25, 170);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.gradoInstruccion, 25, 180);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('PROCEDENCIA', 90, 170);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.departamento.toString(), 90, 180);

		doc.setFontSize(10);
		doc.setFont('helvetica');
		doc.setFontStyle('bold');
		doc.text('FECHA DE APERTURA', 135, 170);

		doc.setFontSize(12);
		doc.setFont('helvetica');
		doc.setFontStyle('normal');
		doc.text(data.fechaReg, 135, 180);

		doc.save(
			data.id +
			'_' +
			data.apellido_paterno +
			'_' +
			data.apellido_materno +
			'.pdf'
		);
		this.toastr.success("Se ha generado el pdf con exito");
	}

}
