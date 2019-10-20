import { Component, OnInit, OnChanges } from '@angular/core';
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { CitaM } from '../../../interfaces/cita-m';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Historial } from '../../../interfaces/historial';
import { Especialidad } from '../../../interfaces/especialidad';


@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.component.html',
	styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent extends BasePageComponent implements OnInit, OnChanges {
	tableData: any;
	cita: CitaM;
	CitasC: CitaM[];
	historialesC: Historial;
	especialidadesC: Especialidad;
	busForm: FormGroup;
	public today: Date;
	public dni: string;
	private idMedico: number;


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
		this.idMedico = 1;
		this.CitasC=[];
		this.loadCitas();
	}

	ngOnInit() {
		super.ngOnInit();
		this.store.select('citas').subscribe(citas => {
			if (citas && citas.length) {
				this.CitasC=[];
				this.CitasC = citas.citasM;
				!this.pageData.loaded ? this.setLoaded() : null;
			}
		});
	}
	ngOnChanges($event) {	}
	
	/*** 
	 * autor: Milagros Motta R.
	 * LoadCitas: Hace una llamada al servicio Http en el cual le envia el id del medico actual y 
	 * este le retorna la lista de todas sus citas a atender, se asigna esta data a CitasC que muestra por interfaz los datos requeridos.
	 * la plantilla no permite asignar valores de segundos niveles en json a traves de la interfaz, por lo que se asignaron en este metodo para visualizarlos
	 ***/
	loadCitas() {
		this.httpSv.loadCitasMedico(this.idMedico).subscribe(data => {
			this.CitasC=[];
			this.CitasC = data;
			for(let i in this.CitasC){
				this.CitasC[i].numeroRecibo=this.CitasC[i].numeroHistoria.numeroHistoria;
				this.CitasC[i].responsable=this.CitasC[i].numeroHistoria.nombres+" "+this.CitasC[i].numeroHistoria.apellido_paterno+" "+this.CitasC[i].numeroHistoria.apellido_materno;
				this.CitasC[i].fechaAtencion=this.CitasC[i].especialidad.nombre;
			}
		});
		
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}/*
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
  initBusForm() {
    this.busForm = this.formBuilder.group({
      datoBus: ['', Validators.required],
    });
    this.dni=this.busForm.get('datoBus').value;
	} */

	/*** 
	 * autor: Milagros Motta R.
	 * parametros: nro de historia, id de la cita
	 * atender: Hace uso de un servicio para pasar los parametros al componente Lconsultas
	 ***/
	atender(nro: string, id: number) {
		this.httpSv.setNroHC(nro, id);
		this.router.navigate(['/vertical/Lconsultas']);
	}
}
