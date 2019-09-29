import { Component , OnInit, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { Cita } from '../../../interfaces/cita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.component.html',
	styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent extends BasePageComponent implements OnInit, OnChanges {
	tableData: any;
	cita: Cita;
	citas: Cita[];
  busForm: FormGroup;
	public today: Date;
	public dni: string;
	private idMedico:number;
	

	constructor(
		private formBuilder: FormBuilder,
		store: Store<IAppState>,
		httpSv: HttpService,
		private modal: TCModalService,
		private http: HttpClient,
		private router: Router,
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
		this.idMedico=2;
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
	loadCitas() {
		this.httpSv.loadCitasMedico(this.idMedico).subscribe(citas => {
			this.citas = citas.citasM;
		});
	}
  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ['', Validators.required],
    });
    this.dni=this.busForm.get('datoBus').value;
	}
	atender(nro:string,id:number){
		this.httpSv.setNroHC(nro,id);
		this.router.navigate(['/vertical/Lconsultas']);
	}
}
