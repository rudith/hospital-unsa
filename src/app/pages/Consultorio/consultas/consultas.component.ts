import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { Cita } from '../../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Content } from '../../../ui/interfaces/modal';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.component.html',
	styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent extends BasePageComponent implements OnInit, OnChanges {
	cita: Cita;
	citas: Cita[];
	public today: Date;
	tableData: any;
	public dni: string;
  busForm: FormGroup;
	constructor(
		private formBuilder: FormBuilder,
		store: Store<IAppState>,
		httpSv: HttpService,
		private modal: TCModalService,
		private http: HttpClient
	) {

		super(store, httpSv);

		this.pageData = {
			title: 'Citas Programadas',
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
	}

	ngOnInit() {
    super.ngOnInit();
    this.initBusForm();
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
		if (this.dni == "" || this.dni == undefined) {
			this.httpSv.loadCitas().subscribe(citas => {
				this.citas = citas
			});
		} else {
			this.httpSv.searchCita(this.dni).subscribe(data => {
				this.citas = data.citas;
			});;
		}
	}
	// open modal window
	openModal<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Cita) {
		console.log(JSON.stringify(row));
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
	}

	// close modal window
	closeModal() {
		this.modal.close();
	}
	loadCitas() {
		this.httpSv.loadCitas().subscribe(citas => {
			this.citas = citas
		});
	}
  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ['', Validators.required],
    });
    this.dni=this.busForm.get('datoBus').value;
  }

}
