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
import {Orden } from '../../../interfaces/orden';
import { Content } from '../../../ui/interfaces/modal';
import { Cabeceralab } from '../../../interfaces/cabeceralab';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

  ordenes:Orden[];
  patientForm: FormGroup;
  cabecera: Cabeceralab[];

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
    this.ordenes=[];
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
    this.ordenes=[];
    this.loadOrdenes();
	}
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnChanges($event) {
		console.log();
  }
  loadOrdenes() {
		this.labService.loadOrden().subscribe(ord => {
			this.ordenes = ord;
		});
  }
  
  openModalH<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Orden) {
		this.initPatientForm(row);
		this.modal.open({
			body: body,
			header: header,
      footer: footer,
      options: null
		});
  }
  closeModalH() {
		this.modal.close();
	}
	initPatientForm(data:Orden) {
		this.patientForm = this.formBuilder.group({
      nombre: [data.nombre?data.nombre: '', Validators.required],
      dni: [ data.dni?data.dni:'', Validators.required],
			fecha: ['', Validators.required],
			orden: [data.orden?data.orden:'', Validators.required],
			observaciones: ['', Validators.required],
      tipoExam: [data.tipoExam?data.tipoExam:'', Validators.required],
		});
  }

  addExamen(form: FormGroup) {
		if (form.valid) {
      let newCabecera: Cabeceralab = form.value;
      newCabecera.nombre= form.value.nombre;
      newCabecera.dni=form.value.dni;
      newCabecera.fecha= formatDate(form.value.fecha, 'yyyy-MM-dd', 'en-US', '+0530');
      newCabecera.tipoExam=form.value.tipoExam;
      newCabecera.orden=form.value.orden;
      newCabecera.observaciones=form.value.observaciones;
			this.labService.createCabecera(newCabecera);
			this.closeModalH();
		}
	}
}


