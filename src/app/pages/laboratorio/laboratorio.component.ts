import { User } from '../../interfaces/user';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { Cita } from '../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from './../../ui/interfaces/option';
import { Content } from '../../ui/interfaces/modal';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Historial } from '../../interfaces/historial';
import { Especialidad } from '../../interfaces/especialidad';
import * as jsPDF from 'jspdf';
import { Grupsang } from '../../interfaces/grupsang';
import { Provincia } from '../../interfaces/provincia';
import { Departamento } from '../../interfaces/departamento';
import { Distrito } from '../../interfaces/distrito';
import { Medico } from '../../interfaces/medico';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent extends BasePageComponent implements OnInit, OnDestroy{
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
	@ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
	public gruposang: Grupsang[];
	public gruposangOption: IOption[];
	public gradoInstruccionOption:IOption[];
	public departamentos: Departamento[];
	public departamentosOption: IOption[];
	public provincias: Provincia[];
	public provinciasOption: IOption[];
	public sexOption: IOption[];
	public ocupacionOption: IOption[];
	public distritos: Distrito[];
	public medicos: Medico[];
	public distritosOption: IOption[];
	public medOption: IOption[];
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
	public users:User[]=[];
  modal: any;
  formBuilder: any;
  toastr: any;


 constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
	

	) {
    super(store, httpSv);
    this.gruposang = [];
		this.gruposangOption = [];
		this.gradoInstruccionOption=[];
		this.departamentos = [];
		this.departamentosOption = [];
		this.provincias = [];
		this.provinciasOption = [];
		this.sexOption = [];
		this.ocupacionOption=[];
		this.distritos = [];
		this.medOption = [];
		this.distritosOption = [];
		this.medicos = [];
		this.loadData();
		this.historiales = [];
		this.espOption = [];
		this.newCita = <Cita>{};

		this.pageData = {
			title: 'Laboratorio',
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
					title: 'laboratorio'
				}
				,
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
			this.historiales = historiales
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
	}
	initPatientForm() {
		this.patientForm = this.formBuilder.group({
			numeroHistoria: ['', Validators.required],
			dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
			nombres: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			apellido_paterno: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			apellido_materno: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			sexo: ['', [Validators.required]],
			edad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
			fechaNac: ['', Validators.required],
			celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
			telefono: ['', [Validators.minLength(6), Validators.maxLength(6)]],
			estadoCivil: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			gradoInstruccion: ['', [Validators.pattern('[A-Za-z ]*')]],
			ocupacion: ['', [Validators.pattern('[A-Za-z ]*')]],
			direccion: ['', Validators.required],
			nacionalidad: ['', [Validators.pattern('[A-Za-z ]*')]],
			//descripcion: ['', [Validators.pattern('[A-Za-z ]*')]],
			email: [''],
			//grupoSanguineo: ['', Validators.required],
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
			this.toastr.success('','Historial Creado con Exito');
			this.closeModalH();
			this.loadHistorias();
			this.patientForm.reset();
		}
	}

	loadData() {
		/*this.httpSv.loadGSang().subscribe(gruposang => {
			this.gruposang = gruposang,
				this.loadSangre()
		});
		*/
		//Sexo
		this.sexOption[0] =	{ label: "Masculino",value: "Masculino",};
		this.sexOption[1] =	{label: "Femenino",	value: "Femenino",};

		//Ocupacion
		this.ocupacionOption[0] ={label: "Profesor",value: "Profesor",};
		this.ocupacionOption[1] ={label: "Doctor",	value: "Doctor",};
		this.ocupacionOption[2] ={label: "Licenciado",	value: "Licenciado",};
		this.ocupacionOption[3] ={label: "Medico",	value: "Medico",};
		this.ocupacionOption[4] ={label: "Ingeniero",	value: "Ingeniero",};
		this.ocupacionOption[5] ={label: "Otro",	value: "Otro",};
		this.ocupacionOption[6] ={label: "Independiente",	value: "Independiente",};


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
		// for (let i in this.medicos) {
		// 	this.medOption[i] =
		// 		{
		// 			label: this.medicos[i].nombres + " " + this.medicos[i].apellido_paterno + " " + this.medicos[i].apellido_materno,
		// 			value: this.medicos[i].id.toString()
		// 		};
		// }
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
			numeroRecibo: ['', Validators.required],
			fechaSeparacion: ['', Validators.required],
			especialidad: ['', Validators.required],
			medico: ['', Validators.required]
		});
	}
	initBusForm() {
		this.busForm = this.formBuilder.group({
			opBus: ['', Validators.required],
			datoBus: ['', Validators.required],
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
			newAppointment.estadoCita = 'E';
			newAppointment.estReg = true;
			newAppointment.numeroHistoria = this.numero;

			this.httpSv.createCITA(newAppointment);
			this.toastr.success('','Cita ha sido creada con exito');
			this.closeModal();
			this.appointmentForm.reset();
		}
	}


	onChangeTable() {
		if (this.opBus == " ") {
			this.httpSv.loadHistorias().subscribe(historiales => {
				this.historiales = historiales
			});
		} else if (this.opBus == "1") {
			this.httpSv.searcHistoriasDNI(this.datoBus).subscribe(data => {
				this.historiales = [];
				this.historiales[0] = data;
				console.log("entro bus" + this.datoBus);
			});;
		} else if (this.opBus == "2") {
			this.httpSv.searcHistoriasNroR(this.datoBus).subscribe(data => {
				this.historiales = [];
				this.historiales[0] = data;
				console.log("entro bus" + this.datoBus);
			});;
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
			//descripcion: [data.descripcion ? data.descripcion : '', Validators.required],
			email: [data.email ? data.email : '', Validators.required],
			estReg: [data.estReg ? data.estReg : '', Validators.required],
			//grupoSanguineo: [data.grupoSanguineo ? data.grupoSanguineo : '', Validators.required],
			distrito: [data.distrito ? data.distrito : '', Validators.required],
			provincia: [data.provincia ? data.provincia : '', Validators.required],
			departamento: [data.departamento ? data.departamento : '', Validators.required],
		});
	}


}
