import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from './../../../ui/interfaces/option';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Examen } from '../../../interfaces/examen';
import { Tipoexamen } from '../../../interfaces/tipoexamen';
import { Cabeceralab } from '../../../interfaces/cabeceralab';
import { Detalle } from '../../../interfaces/detalle';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { ExamenLista } from '../../../interfaces/examen-lista';
import { HostListener } from '@angular/core'; 

// BASE_API_URL
import { BASE_API_URL } from "../../../config/API";

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
	verMas: Examen[];
	rr: number;
	detalleT: Detalle[];
	examenLista: ExamenLista;
	data: ExamenLista = <ExamenLista>{};
	pageNum: number;
	exa: Examen[];
	tipo: string;

	constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
		private labService: LaboratorioService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr: ToastrService,
	) {
		super(store, httpSv);
		this.tipoExOption = [];
		this.tipoE = [];
		this.cabecera = [];
		this.examen = [];
		this.exa = [];
		this.detalleT = [];
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
		this.pageNum = 1;
		this.examen = [];
		this.exa = [];
		this.detalleT = [];
		this.examenCol = [];
		this.verMas = [];
		this.loadExamen();
	}
	ngOnChanges($event) {
		console.log();
	}
	public nextPage() {
		if (this.data.next) {
			this.pageNum++;
			this.labService.loadExamenPagination(this.data.next).subscribe(exam => {
				this.data = exam;
				this.examen = exam.results;
			});
		}
	}

	public prevPage() {
		if (this.pageNum > 1) {
			this.pageNum--;
			this.labService.loadExamenPagination(this.data.previous).subscribe(exam => {
				this.data = exam;
				this.examen = exam.results;
			});
		}
	}
	//Muestra el listado de exmenes en la tabla 
	loadExamen() {
		this.labService.loadExamen().subscribe(exam => {
			this.data = exam;
			this.examen = exam.results;

		});
	}

	cargarExamn() {
		this.labService.loadExamen().subscribe(exam => {
			this.data = exam;
			this.examen = exam.results;
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


	//Modal Crear Detalle:
	//openModaD: metodo de apertura del modal con los parametros necesario que recibe
	//initDetalleForm: Form que valida los datos ingresados en el formulario 

	openModaD<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Examen, options: any = null) {
		this.initDetalleForm();
		this.rr = row.id;
		console.log(this.rr);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: options

		});
	}
	closeModalD() {
		this.modal.close();
	}
	//Valida los campos del formulario de crear detalle
	initDetalleForm() {
		this.detalleForm = this.formBuilder.group({
			descripcion: ['', Validators.required],
			resultado_obtenido: ['', Validators.required],
			unidades: ['', Validators.required],
			rango_referencia: ['', Validators.required],
		});

	}
	//Fin de Modal Crear Detalle

	// Metodo de Crear detalle: llama al servicio de creacion createDetalle
	addDetalle(form: FormGroup) {
		if (form.valid) {
			let newDetalle: Detalle = form.value;
			newDetalle.descripcion = form.value.descripcion;
			newDetalle.rango_referencia = form.value.rango_referencia;
			newDetalle.resultado_obtenido = form.value.resultado_obtenido;
			newDetalle.unidades = form.value.unidades;
			newDetalle.codigoExam = this.rr;
			this.labService.createDetalle(newDetalle);
			this.detalleForm.reset();
		}
	}

	//Metodo que llama al servicio imprimirExam 
	imprimir(row: Examen) {
		document.location.href = BASE_API_URL + '/laboratorio/resultadoExamen/' + row.id;
		this.toastr.success("Se ha generado el Pdf");
	}



	// close modal window
	closeModal() {
		this.modal.close();
		//this.appointmentForm.reset();
	}

	//valida los valores de busqueda 
	initBusForm() {
		this.busForm = this.formBuilder.group({
			opBus: ['', Validators.required],
			datoBus: ['', Validators.required],
		});
	}

	//metodo que captura valores de busqueda y llama al metodo onChangeTable
	buscar(busca: FormGroup) {
		this.datoBus = busca.get('datoBus').value;
		this.opBus = busca.get('opBus').value;
		this.onChangeTable();
	}
	//Metodo que verifica el tipo de busqueda llamando respectivamente segun el tipo de busqueda elejido 
	onChangeTable() {
		if (this.opBus == "1") {
			this.labService.searchLabName(this.datoBus).subscribe(data => {
				if (data[0] == null) {
					this.toastr.error("No se han encontrado coincidencias");
					this.cargarExamn();
				} else {
					this.toastr.success('Búsqueda Exitosa');
					this.examen = [];
					this.examen = data;
				}
			}, error => {
				this.toastr.warning('No encontrado');
			});
		}
		else if (this.opBus == "2") {
			this.labService.searchLabFecha(this.datoBus).subscribe(data => {
				if (data[0] == null) {
					this.toastr.error("No se han encontrado coincidencias");
					this.cargarExamn();
				} else {
					this.toastr.success('Búsqueda Exitosa');
					this.examen = [];
					this.examen = data;
				}

			}, error => {
				this.toastr.warning('No encontrado');
			});
		} else if (this.opBus == "3") {
			this.labService.searchLabDni(this.datoBus).subscribe(data => {
				console.log(data);
				if (data[0] == null) {
					this.toastr.error("No se han encontrado coincidencias");
					this.cargarExamn();
				} else {
					this.toastr.success('Búsqueda Exitosa');
					this.examen = [];
					this.examen = data;
				}

			}, error => {
				this.toastr.warning('No encontrado');
			});
		}
	}



	// modal ver mas 
	openModalVerMas<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Examen) {
		this.initExamenForm(row);
		this.tipo = row.tipoExam.nombre;
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
		this.loadTabla(row);

	}
	//Valida y muestra los datos del modal ver mas 
	initExamenForm(data: Examen) {
		this.examenForm = this.formBuilder.group({
			nombre: [data.nombre ? data.nombre : '', Validators.required],
			dni: [data.dni ? data.dni : '', Validators.required],
			tipoExam: [this.tipo ? this.tipo : '', Validators.required],
			fecha: [data.fecha ? data.fecha : '', Validators.required],
			observaciones: [data.observaciones ? data.observaciones : '', Validators.required],
		});
	}
	//Metodo que muestra en un listado los detalles de examen llamando al servicio loadTabla
	loadTabla(row: Examen) {
		this.labService.loadTabla(row.id).subscribe(detalleT => {
			this.detalleT = detalleT;
		})
	}
	closeModalH() {
		this.modal.close();
	}
	
@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
	  this.closeModal();
	  this.closeModalD();
	  this.closeModalH();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }




}
