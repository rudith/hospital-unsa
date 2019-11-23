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
import {Examen } from '../../../interfaces/examen';
import { Content } from '../../../ui/interfaces/modal';
import { OrdenLista } from '../../../interfaces/orden-lista';

import { formatDate } from '@angular/common';
import { Detalle } from '../../../interfaces/detalle'; 
import {Cabcrear} from '../../../interfaces/cabcrear';
import { Router } from '@angular/router';
import { Orden } from '../../../interfaces/orden';

import { HostListener } from '@angular/core'; 




@Component({
  selector: 'app-atender',
  templateUrl: './atender.component.html',
  styleUrls: ['./atender.component.scss']
})
export class AtenderComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges{
  @ViewChild('modalBody', { static: true }) modalBody: ElementRef<any>;
  @ViewChild('modalFooter', { static: true }) modalFooter: ElementRef<any>;
  //data: Cabeceralab[];
  
  datoBus: string;
  ordenes:Orden[];
  private nombreR:string;
  private dniR:string;
  private tipoEr:string;
  private ordenR:string;
  private fechaR:string;
  private tipoExId: number;
  private idcab:number;

  detalleForm: FormGroup;
  cabeceraForm: FormGroup;
  examenForm: FormGroup;
  rr: number;
  ido:number;
  detalleT: Detalle[];
  data:OrdenLista = <OrdenLista>{};
  
  constructor(
    store: Store<IAppState>,
		httpSv: HttpService,
		private labService: LaboratorioService,
		private modal: TCModalService,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		private toastr: ToastrService,
		private router: Router,
  ) {
    super(store, httpSv);
    this.detalleT = [];
		this.pageData = {
			title: 'Atender Ordenes',
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
					title: 'atender'
				}
				,
				{
					title: 'Search'
				}
			]
    };
    
    this.detalleT = []; 
    this.datoBus = this.labService.getDni();
	this.cargarDatos();
	this.initDetalleForm();
	this.initcabeceraForm();
	this.loadOrdenes();
	
   }

  ngOnInit() {
	super.ngOnInit();
	this.initDetalleForm();
	this.initcabeceraForm();
  }
  ngOnChanges($event) {
		console.log();
  }
  cargarDatos() {
    this.labService.searchExamenbName(this.datoBus).subscribe(data => {
      this.dniR=data[0].dni;
      this.tipoEr=data[0].tipoExam.nombre;
      this.ordenR=data[0].orden;
	  this.fechaR=data[0].fecha;
	  this.tipoExId=data[0].tipoExam.id;
	  this.idcab=data[0].id;
    });
  }

  //Metodo que muestra en un listado los detalles de examen llamando al servicio loadTabla
	loadTabla(row: number) {
		this.labService.loadTabla(row).subscribe(detalleT => {
			this.detalleT = detalleT;
		})
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
		//Valida los campos del formulario de observaciones 
	initcabeceraForm(){
		this.cabeceraForm=this.formBuilder.group({
			observaciones: ['',Validators.required]
		});
	}
	updateCabecera(form:FormGroup){
		if(form.valid){
			let newcab: Cabcrear=form.value;
			newcab.observaciones=form.value.observaciones;
			newcab.nombre=this.datoBus;
			newcab.dni=this.dniR;
			newcab.orden=this.ordenR;
			newcab.fecha=this.fechaR;
			newcab.tipoExam=this.tipoExId;
			//console.log("1"+this.datoBus+"2"+this.dniR+"3"+this.ordenR +"4"+ this.fechaR +"5"+ this.tipoExId);
			//this.idcab=this.labService.getIdOrden();
			this.labService.updateCabecera(newcab);
			
		}
	}

	// Metodo de Crear detalle: llama al servicio de creacion createDetalle
	addDetalle(form: FormGroup) {
		if (form.valid) {
			let newDetalle: Detalle = form.value;
			let exam:Examen;
			newDetalle.descripcion = form.value.descripcion;
			newDetalle.rango_referencia = form.value.rango_referencia;
			newDetalle.resultado_obtenido = form.value.resultado_obtenido;
      		newDetalle.unidades = form.value.unidades;
			  this.rr =this.labService.getIdCabecera();
			  console.log("DETALlEFORM="+this.rr)
			newDetalle.codigoExam = this.rr;
			this.labService.createDetalle(newDetalle);
			this.detalleForm.reset();
			this.loadTabla(this.rr);
		}
		
	}
	cancelar(){
		this.labService.eliminarCabecera(this.labService.getIdCabecera()).subscribe(cita => {
			console.log("Aparentemente lo hizo "+cita.id)
			this.cargarDatos();
		  });
		this.router.navigate(['/vertical/ordenes']);

		
	}

	
	irLaboratorio(){
		this.router.navigate(['/vertical/laboratorio']);
	}
	loadOrdenes() {
		this.labService.loadOrden().subscribe(ord => {
			this.data=ord;
			this.ordenes=ord.results;
		});
  }
	estado(row: number) {
		this.ido=this.labService.getIdOrden();
		row=this.ido;
		console.log("ID de row CAMBIO DE ESTADO"+row);
		this.labService.cambioEstado(row).subscribe(ord => {
			this.loadOrdenes();
			this.irLaboratorio();
		});;
		
	}
	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
		if (event.key === "Enter") { 
		  return false;
		}
	  }

}
