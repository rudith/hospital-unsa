import { Component, OnInit } from "@angular/core";
import { BasePageComponent } from '../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';
import { HttpService } from '../../../services/http/http.service';
import { CitaM } from '../../../interfaces/cita-m';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TCModalService } from '../../../ui/services/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LaboratorioService } from '../../../Services/Laboratorio/laboratorio.service';
import { citaLista } from '../../../interfaces/citaLista';


@Component({
	selector: 'app-consultas',
	templateUrl: './consultas.component.html',
	styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent extends BasePageComponent implements OnInit {
	CitasC: CitaM[];
    data: citaLista = <citaLista>{};
	busForm: FormGroup;
	pages: Array<number>;
  pagesNumber: number;
  pageNum: number;
	private idMedico: number;
	private hayCitas:boolean;

	constructor(
		private formBuilder: FormBuilder,
		store: Store<IAppState>,
		httpSv: HttpService,
		private labservice:LaboratorioService,
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
		this.pageNum = 1;
		this.idMedico = 5;
		this.hayCitas=true;
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
	
	/*** 
	 * autor: Milagros Motta R.
	 * LoadCitas: Hace una llamada al servicio Http en el cual le envia el id del medico actual y 
	 * este le retorna la lista de todas sus citas a atender, se asigna esta data a CitasC que muestra por interfaz los datos requeridos.
	 * la plantilla no permite asignar valores de segundos niveles en json a traves de la interfaz, por lo que se asignaron en este metodo para visualizarlos
	 ***/
	loadCitas() {
		this.httpSv.loadCitasMedico(this.idMedico).subscribe(data => {
			this.data = data;
			this.CitasC=[];
			this.CitasC = data.results;
			if(this.CitasC.length>0){
				this.hayCitas=false;
			}
			for(let i in this.CitasC){
				this.CitasC[i].numeroRecibo=this.CitasC[i].numeroHistoria.numeroHistoria;
				this.CitasC[i].responsable=this.CitasC[i].numeroHistoria.nombres+" "+this.CitasC[i].numeroHistoria.apellido_paterno+" "+this.CitasC[i].numeroHistoria.apellido_materno;
				this.CitasC[i].fechaAtencion=this.CitasC[i].especialidad.nombre;
			}
		});
		
	}
	ngOnDestroy() {
		super.ngOnDestroy();
	}
	/*** 
	 * autor: Milagros Motta R.
	 * parametros: nro de historia, id de la cita, idMedico
	 * atender: Hace uso de un servicio para pasar los parametros al componente Lconsultas
	 ***/
	atender(nro: string, id: number) {
		this.httpSv.setNroHC(nro, id,this.idMedico);
		this.router.navigate(['/vertical/Lconsultas']);
	}
	/*** 
	 * autor: Milagros Motta R.
	 * nextPage: si se hace click en siguiente, se aumenta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
	public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.httpSv.paginacionCitasM(this.data.next).subscribe(citasPaginadas => {
          this.data = citasPaginadas;
					this.CitasC = this.data.results;
					for(let i in this.CitasC){
						this.CitasC[i].numeroRecibo=this.CitasC[i].numeroHistoria.numeroHistoria;
						this.CitasC[i].responsable=this.CitasC[i].numeroHistoria.nombres+" "+this.CitasC[i].numeroHistoria.apellido_paterno+" "+this.CitasC[i].numeroHistoria.apellido_materno;
						this.CitasC[i].fechaAtencion=this.CitasC[i].especialidad.nombre;
					}
      });
    }
  }
	/*** 
	 * autor: Milagros Motta R.
	 * prevPage: si se hace click en anterior, se resta el contador de la página 'pageNum' y se envia el url al servicio
	 ***/
  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.httpSv.paginacionCitasM(this.data.previous).subscribe(citasPaginadas => {
				this.data = citasPaginadas;
				this.CitasC = this.data.results;
				for(let i in this.CitasC){
					this.CitasC[i].numeroRecibo=this.CitasC[i].numeroHistoria.numeroHistoria;
					this.CitasC[i].responsable=this.CitasC[i].numeroHistoria.nombres+" "+this.CitasC[i].numeroHistoria.apellido_paterno+" "+this.CitasC[i].numeroHistoria.apellido_materno;
					this.CitasC[i].fechaAtencion=this.CitasC[i].especialidad.nombre;
				}
			});
    }
  }
}
