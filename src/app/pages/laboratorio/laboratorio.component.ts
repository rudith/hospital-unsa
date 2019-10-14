import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../base-page';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { IAppState } from '../../interfaces/app-state';
import { HttpService } from '../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from './../../ui/interfaces/option';
import { Content } from '../../ui/interfaces/modal';
import { TCModalService } from '../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import * as jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Examen } from '../../interfaces/examen';
import { Tipoexamen } from '../../interfaces/tipoexamen';
import { Cabeceralab } from '../../interfaces/cabeceralab';
import { Detalle } from '../../interfaces/detalle';
@Component({
	selector: 'app-laboratorio',
	templateUrl: './laboratorio.component.html',
	styleUrls: ['./laboratorio.component.scss']
})
export class LaboratorioComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {
	@ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
	@ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
	public tipoExOption: IOption[];
	public tipoE: Tipoexamen[];
	idCab: number;
	datoBus: string;
	opBus: string;
	estadoBusq: boolean;
	examenForm: FormGroup;
	examenCol: Examen[];
	busForm: FormGroup;
	patientForm: FormGroup;
	detalleForm: FormGroup;
	public busqOption: IOption[];
	examen: Examen[];
	cabecera: Cabeceralab[];
	verMas:Examen[];
	rr:number;

	constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr: ToastrService,
	) {
		super(store, httpSv);
		this.tipoExOption = [];
		this.tipoE = [];
		this.cabecera = [];
		this.examen=[];
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
		this.examen = [];
		this.examenCol = [];
		this.verMas=[];
		this.loadData();
		this.loadExamen();
	}
	ngOnChanges($event) {
		console.log();
	}

	loadExamen() {
		this.httpSv.loadExamen().subscribe(examen => {
			this.examen = examen;
		});
	}

	ngOnInit() {
		super.ngOnInit();
		this.estadoBusq = false;
		this.initBusForm();
		this.getData('assets/data/opcionBusquedaLab.json', 'busqOption');
		this.store.select('examen').subscribe(examen => {
			if (examen && examen.length) {
				this.examen = examen;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}

	//MOdal crear cabecera
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
			dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
			nombre: ['', [Validators.required, Validators.pattern('[A-Za-z ]*')]],
			fecha: ['', Validators.required],
			orden: ['', Validators.required],
			observaciones: ['', Validators.required],
			tipoExam: ['', Validators.required],
		});	
	}
	// fin modal crear cabecera

	//Crear cabecera
	addExamen(form: FormGroup) {
		if (form.valid) {
			let newExamen: Cabeceralab = form.value;
			newExamen.fecha = formatDate(form.value.fecha, 'yyyy-MM-dd', 'en-US', '+0530');
			this.httpSv.createCabecera(newExamen);
			this.closeModalH();
		}
	}


	//modal crear detalle
	openModaD<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null,row:Examen) {
		this.initDetalleForm();
		this.rr=row.id;
		console.log(this.rr);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,

		});
	}
	closeModalD() {
		this.modal.close();
	}
	initDetalleForm() {
		this.detalleForm = this.formBuilder.group({
			descripcion: ['', Validators.required],
			resultado_obtenido: ['', Validators.required],
			unidades: ['', Validators.required],
			rango_referencia: ['', Validators.required],
		});
		
	}
	//fin de modal crear detalle


	// crear detalle 
	addDetalle(form: FormGroup) {
		if (form.valid) {
			let newDetalle: Detalle = form.value;
			newDetalle.descripcion=form.value.descripcion;
			newDetalle.rango_referencia=form.value.rango_referencia;
			newDetalle.resultado_obtenido=form.value.resultado_obtenido;
			newDetalle.unidades=form.value.unidades;
			newDetalle.codigoExam = this.rr;
			this.httpSv.createDetalle(newDetalle);
			this.closeModalD();
			this.detalleForm.reset();
		}
	}

	loadData() {
		this.httpSv.loadTipoEx().subscribe(tipo => {
			this.tipoE = tipo,
				this.loadtipoex()
		});

	}
	//tipo de examen
	loadtipoex() {
		for (let i in this.tipoE) {
			this.tipoExOption[i] =
				{
					label: this.tipoE[i].nombre,
					value: this.tipoE[i].id.toString()
				};
		}
	}


	// close modal window
	closeModal() {
		this.modal.close();
		//this.appointmentForm.reset();
	}


	initBusForm() {
		this.busForm = this.formBuilder.group({
			//opBus: ['', Validators.required],
			datoBus: ['', Validators.required],
		});
	}


	buscar(busca: FormGroup) {
		this.datoBus = busca.get('datoBus').value;
		//this.opBus = busca.get('opBus').value;
		this.onChangeTable();
	}

	onChangeTable() {
		if (this.datoBus == "") {
			this.toastr.warning('Ningun valor ingresado');
			this.httpSv.loadExamen().subscribe(examen => {
				this.examen = examen;
			});
		} else if (this.opBus == "1") {
			this.httpSv.searchLabName(this.datoBus).subscribe(data => {
				this.examen = [];
				this.examen[0] = data;
				this.toastr.success('Examen  encontrado');
				console.log("entro bus " + this.datoBus);
			}, error => {
				this.toastr.warning('No encontrado');
			});;
		} 
		else if (this.opBus == "2") {
			this.httpSv.searchLabFecha(this.datoBus).subscribe(data => {
				this.examen = [];
				this.examen[0] = data;
				console.log("entro bus " + this.datoBus);
			});;
		} else if (this.opBus=="3") {
			this.httpSv.searchLabDni(this.datoBus).subscribe(data => {
				this.examen = [];
				this.examen[0] = data;
				console.log("entro bus " + this.datoBus);
			});;
		}
	}
	

	// modal ver mas 
	openModalVerMas<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Examen) {
		this.initExamenForm(row);
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

	initExamenForm(data: Examen) {
		this.examenForm = this.formBuilder.group({
			nombre: [data.nombre ? data.nombre : '', Validators.required],
			dni: [data.dni ? data.dni : '', Validators.required],
			tipoExam: [data.tipoExam ? data.tipoExam : '', Validators.required],
			fecha: [data.fecha ? data.fecha : '', Validators.required],
			observaciones: [data.observaciones ? data.observaciones : '', Validators.required],
		});
	}

	// fin modal ver mas 



}
