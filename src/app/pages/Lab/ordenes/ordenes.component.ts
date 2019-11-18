import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { Orden } from '../../../interfaces/orden';
import { Content } from '../../../ui/interfaces/modal';
import { Cabeceralab } from '../../../interfaces/cabeceralab';
import { OrdenLista } from '../../../interfaces/orden-lista';
import { formatDate } from '@angular/common';
import { Detalle } from '../../../interfaces/detalle';
import { Cabcrear } from '../../../interfaces/cabcrear';
import { Router } from '@angular/router';


@Component({
	selector: 'app-ordenes',
	templateUrl: './ordenes.component.html',
	styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

	ordenes: Orden[];
	idO:number;
	busForm: FormGroup;
	patientForm: FormGroup;
	cabecera: Cabeceralab[];
	cabcrear: Cabcrear[];
	today: Date;
	ordenLista: OrdenLista;
	data: OrdenLista = <OrdenLista>{};
	pageNum: number;
	dato: string;
	rr: number;
	detalleForm: FormGroup;
	public cab: Cabcrear;
	constructor(
		store: Store<IAppState>,
		httpSv: HttpService,
		private labService: LaboratorioService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr: ToastrService,
		private modaH: TCModalService,
		private router: Router,
	) {
		super(store, httpSv);
		this.ordenes = [];
		this.pageData = {
			title: 'Ordenes',
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
					title: 'ordenes'
				}
				,
				{
					title: 'Search'
				}
			]
		};
		this.pageNum = 1;
		this.ordenes = [];
		this.loadOrdenes();
	}

	ngOnChanges($event) {
		console.log();
	}
	initBusForm() {
		this.busForm = this.formBuilder.group({
			datoBus: ['', Validators.required],
		});
	}

	buscarOrden(dni: string) {
		this.labService.searchOrdenDni(dni).subscribe(data => {
			if(data.results.length==0){
				this.toastr.error("No se ha encontrado");
				this.loadOrdenes();
			}
			else{
				this.data=data;
				this.ordenes=data.results;
				this.toastr.info("Mostrando resultados");
			}
			
			
			console.log("entro busqueda" + dni);
		});;
	}
	buscar(busca: FormGroup) {
		this.dato = busca.get('datoBus').value;
		this.buscarOrden(this.dato);
	}
	ngOnInit() {
		super.ngOnInit();
		this.initBusForm();
		this.store.select('ordenes').subscribe(ordenes => {
			if (ordenes && ordenes.length) {
				this.ordenes = ordenes;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}

	public nextPage() {
		if (this.data.next) {
			this.pageNum++;
			this.labService.loadOrdenPAgination(this.data.next).subscribe(ord => {
				this.data = ord;
				this.ordenes = ord.results;
			});
		}
	}

	public prevPage() {
		if (this.pageNum > 1) {
			this.pageNum--;
			this.labService.loadOrdenPAgination(this.data.previous).subscribe(ord => {
				this.data = ord;
				this.ordenes = ord.results;
			});
		}
	}
	atender(dni: string, row: Orden) {
		this.initPatientForm(row);
		this.labService.setDni(dni);
		this.labService.setIdo(row.id);
		this.router.navigate(['/vertical/atender']);
	}

	initPatientForm(data: Orden) {
		this.patientForm = this.formBuilder.group({
			nombre: [data.nombre ? data.nombre : '', Validators.required],
			dni: [data.dni ? data.dni : '', Validators.required],
			orden: [data.orden ? data.orden : '',],
			observaciones: ['', Validators.required],
			tipoExam: [data.tipoExam ? data.tipoExam : '', Validators.required],
		});

		let newCab: Cabcrear = this.patientForm.value;
		this.today = new Date();
		newCab.nombre = data.nombre;
		newCab.dni = data.dni;
		newCab.fecha = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
		newCab.tipoExam = data.tipoExam;
		newCab.orden = data.orden;
		newCab.observaciones = "ninguna";
		this.labService.createCabecera(newCab);
		console.log("CABECERA CREADA ");


	}

	loadOrdenes() {
		this.labService.loadOrden().subscribe(ord => {
			this.data = ord;
			this.ordenes = ord.results;
			
		});
	}

	openModalH<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Orden) {
		//this.initPatientForm(row);
		this.initDetalleForm();
		//this.rr = row.id;
		this.modaH.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}
	closeModalH() {
		this.modaH.close();
		this.modal.close();
	}


	closeModalD() {
		this.modal.close();
		this.modaH.close();
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

	estado(row: number) {
		this.labService.cambioEstado(row).subscribe(ord => {
			this.loadOrdenes();
		});;
		console.log("ID de row" + row);
	}

}


