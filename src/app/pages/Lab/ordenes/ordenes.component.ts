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
import { IOption } from './../../../ui/interfaces/option';

import { HostListener } from '@angular/core';


@Component({
	selector: 'app-ordenes',
	templateUrl: './ordenes.component.html',
	styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

	datoBus: string;
	opBus: string;
	estadoBusq: boolean;
	public busqOption: IOption[];
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
	num:number;
	manda:number;
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
			opBus: ['', Validators.required],
			datoBus: ['', Validators.required],
		});
	}



	buscar(busca: FormGroup) {
		this.datoBus = busca.get('datoBus').value;
		this.opBus = busca.get('opBus').value;
		this.onChangeTable();
	}

	onChangeTable() {
		if (this.opBus == "1") {
			//console.log("VA ALL SERVICIO");
			this.labService.searchOrdenDniLab(this.datoBus).subscribe(data => {
				//console.log("DATO DNI "+ this.datoBus);
				if (data.results.length==null) {
					this.toastr.error("No se han encontrado coincidencias");
					this.loadOrdenes();
					
				} else {
					this.toastr.success('Búsqueda Exitosa');
					//this.ordenes = [];
					this.data=data;
					this.ordenes = data.results;
					
				}
			}, error => {
				this.toastr.warning('No encontrado');
			});
		}
		else if (this.opBus == "2") {
			console.log("VA ALL SERVICIO");
			this.labService.searchOrdenNombreLab(this.datoBus).subscribe(data => {
				//console.log("DATO NOMBRE "+ this.datoBus);
				if (data.results.length==null) {
					this.toastr.error("No se han encontrado coincidencias");
					this.loadOrdenes();
					
				} else {
					this.toastr.success('Búsqueda Exitosa');
					//this.ordenes = [];
					this.data=data;
					this.ordenes = data.results;
					
				}

			}, error => {
				this.toastr.warning('No encontrado');
			});
		} 
	}








	ngOnInit() {
		super.ngOnInit();
		this.estadoBusq = false;
		this.initBusForm();
		this.getData('assets/data/opcionBusquedaOrd.json', 'busqOption');
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
			id:[data.id?data.id:'',Validators.required]
			
		});
		this.num=data.tipoExam.id;
console.log("tipo de examen "+ this.num)
		let newCab: Cabcrear = this.patientForm.value;
		this.today = new Date();
		newCab.nombre = data.nombre;
		newCab.dni = data.dni;
		newCab.fecha = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
		newCab.tipoExam = data.tipoExam.id;
		newCab.orden = data.orden;
		newCab.observaciones = "Ninguna";
		this.labService.createCabecera(newCab);
		console.log("CABECERA enviada  ");
		console.log("datos: "+ newCab)
		


	}

	loadOrdenes() {
		this.labService.loadOrdenPagadas().subscribe(ord => {
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
	
@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
	  this.closeModalD();
	  this.closeModalH();

    }
    if (event.key === "Enter") { 
      return false;
    }
  }

}


