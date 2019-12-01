import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Historial } from '../../interfaces/historial';
import { Cita } from '../../interfaces/cita';
import { Tipoexamen } from '../../interfaces/tipoexamen';
import { Cabeceralab } from '../../interfaces/cabeceralab';
import { ToastrService } from 'ngx-toastr';
import { Examen } from '../../interfaces/examen';
import { Detalle } from '../../interfaces/detalle';
import { Orden } from '../../interfaces/orden';
import { ExamenLista } from '../../interfaces/examen-lista';
import { OrdenLista } from '../../interfaces/orden-lista';
import { Cabcrear } from '../../interfaces/cabcrear';
import { AdministradorService } from "../Administrador/administrador.service";

// BASE_API_URL
import { BASE_API_URL } from "../../config/API";
import { Personal } from '../../interfaces/personal';

@Injectable({
	providedIn: 'root'
})
export class LaboratorioService {
	private url: string = BASE_API_URL + "/laboratorio";
	public historia: Historial;
	public cabecera: Cabeceralab[] = [];
	public cabcrear: Cabcrear[] = [];
	public detalle: Detalle[] = [];
	public cita: Cita[] = [];
	public examen: Examen[] = [];
	public examneLis: ExamenLista[] = [];
	public ordenlis: OrdenLista[] = [];
	fi: string;
	ff: string;
	private tipo: number;
	private dni: string;
	private ido: number;
	private dd: number;
	private dis:number;
	private result:string;
	private unidad:string;
	private rango:string;

	constructor(private http: HttpClient, private toastr: ToastrService, private adminSv: AdministradorService) {


	}

	getData(source: string) {
		return this.http.get(source).pipe(
			tap((res: any) => res),
			catchError(this.handleError)
		);
	}
	private handleError(error: any) {
		return observableThrowError(error.error || 'Server error');
	}



	searchExamenbDni(dni: string): Observable<Examen[]> {
		return this.http.get<Examen[]>(this.url + '/filtro/DNI/?dni=' + dni, this.adminSv.getHeader());
	}
	searchExamenbName(nombre: string): Observable<Examen[]> {
		return this.http.get<Examen[]>(this.url + '/filtro/?nombre=' + nombre, this.adminSv.getHeader());
	}

	searchLabName(nombre: string): Observable<any> {
		return this.http.get<Cabeceralab>(this.url + '/filtro/?nombre=' + nombre, this.adminSv.getHeader());
	}
	searchLabFecha(fecha: string): Observable<any> {
		this.fi = fecha.substring(0, 10);
		this.ff = fecha.substring(11, 22);
		return this.http.get<any>(this.url + '/filtro/fecha/?fecha_inicio=' + this.fi + "&fecha_final=" + this.ff, this.adminSv.getHeader());
	}
	searchLabDni(dni: string): Observable<any> {
		return this.http.get<Examen>(this.url + '/filtro/DNI/?dni=' + dni, this.adminSv.getHeader());
	}


	loadTipoEx(): Observable<Tipoexamen[]> {
		return this.http.get<Tipoexamen[]>(this.url + "/TipoExamen/", this.adminSv.getHeader());
	}

	loadExamenPagination(url: string): Observable<ExamenLista> {
		return this.http.get<ExamenLista>(url, this.adminSv.getHeader());
	}
	/*** 
	 * autor: Milagros Motta R.
	 * searchExamDNIPagination: Carga los examenes paginados del paciente por dni
	***/
	searchExamDNIPagination(dni: string): Observable<ExamenLista> {
		return this.http.get<ExamenLista>(this.url + '/filtroCP/DNI/?dni=' + dni, this.adminSv.getHeader());
	}

	loadOrdenPAgination(url: string): Observable<OrdenLista> {
		return this.http.get<OrdenLista>(url, this.adminSv.getHeader())
	}

	//Cargar dos tipos de ordenes
	loadOrdenPagadas(): Observable<OrdenLista> {
		return this.http.get<OrdenLista>(BASE_API_URL + "/consultorio/ver-ordenLaboratorio", this.adminSv.getHeader());
	}
	loadOrdenCreadas(): Observable<OrdenLista> {
		return this.http.get<OrdenLista>(BASE_API_URL + "/consultorio/ver-orden/", this.adminSv.getHeader());
	}
	loadExamen(): Observable<ExamenLista> {
		return this.http.get<ExamenLista>(this.url + "/ExamenLabCab/", this.adminSv.getHeader());
	}

	loadTabla(idEx: number): Observable<Detalle[]> {
		//console.log("ENTRA AL SERVICIO de tabla");
		return this.http.get<Detalle[]>(this.url + '/filtro/Detalles/?id=' + idEx, this.adminSv.getHeader())
	}
	cambioEstado(id: number): Observable<Orden> {
		console.log("Entra al servicio=" + id);
		return this.http.get<Orden>(BASE_API_URL + "/consultorio/atenderOrden/" + id, this.adminSv.getHeader());
	}
	setDni(dnir: string) {
		this.dni = dnir;
	}
	getDni(): string {
		return this.dni;
	}


	//crear cabecer
	createCabecera(newCabecera: Cabcrear) {
		console.log(newCabecera);
		this.http.post<Cabcrear>(this.url + '/CrearExamenLabCab/', {
			nombre: newCabecera.nombre,
			dni: newCabecera.dni,
			orden: newCabecera.orden,
			fecha: newCabecera.fecha,
			tipoExam: newCabecera.tipoExam,
			observaciones: newCabecera.observaciones,
		}, this.adminSv.getHeader())
			.subscribe(
				data => {
					this.tipo = data.id;
					console.log("SERVICIO=" + data.id);
					console.log("CREAR Cabecera Completo");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});


	}
	updateCabecera(update: Cabcrear) {
		console.log(update);
		this.dd = this.getIdCabecera();
		this.http.put<Cabcrear>(this.url + '/CrearExamenLabCab/' + this.dd + "/", {
			nombre: update.nombre,
			dni: update.dni,
			orden: update.orden,
			fecha: update.fecha,
			tipoExam: update.tipoExam,
			observaciones: update.observaciones,
		}, this.adminSv.getHeader())
			.subscribe(
				data => {
					console.log("ACTUALIZAR Cabecera ");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});
	}

	
	getIdCabecera(): number {
		return this.tipo;
	}
	setIdo(ido: number) {
		this.ido = ido;
	}
	getIdOrden(): number {
		return this.ido;
	}
	createDetalle(detalle: Detalle) {
		console.log(detalle);
		this.http.post<any>(this.url + '/ExamenLabDet/',
			{
				descripcion: detalle.descripcion,
				resultado_obtenido: detalle.resultado_obtenido,
				unidades: detalle.unidades,
				rango_referencia: detalle.rango_referencia,
				codigoExam: detalle.codigoExam,
			}, this.adminSv.getHeader())
			.subscribe(
				data => {

					this.toastr.success("El detalle ha sido crado con exito");
					console.log("CREAR detalle Completo");
				},
				error => {
					console.log(error.message);
					this.toastr.error("El detalle no se ha creado");
				});

	}
	eliminarCabecera(a: number): Observable<Orden> {
		console.log("vino al servicio");
		return this.http.get<Orden>(this.url + "/eliminarExamenCompleto/" + a, this.adminSv.getHeader());
	}
	cancelarOrden(a: number): Observable<Orden> {
		console.log("vino al servicio de cancelar orden");
		return this.http.get<Orden>(BASE_API_URL + "/consultorio/cancelarOrden/" + a, this.adminSv.getHeader());
	}
	docName(id: number): Observable<Personal> {
		return this.http.get<Personal>(BASE_API_URL + "/administrador/ver-personal/" + id, this.adminSv.getHeader());
	}
	searchOrdenDniLab(dni: string): Observable<OrdenLista> {
		console.log("ENTRA AL SERVICIO " + dni);
		return this.http.get<OrdenLista>(BASE_API_URL + '/consultorio/buscarOrdenLab/?dni=' + dni, this.adminSv.getHeader());
	}

	searchOrdenNombreLab(nombre: string): Observable<OrdenLista> {
		console.log("ENTRA AL SERVICIO " + nombre);
		return this.http.get<OrdenLista>(BASE_API_URL + '/consultorio/buscarNombreOrdenLab/?nom=' + nombre, this.adminSv.getHeader());
	}
	elimiarDet(det: number) {
		this.http.delete<Detalle>(this.url + '/ExamenLabDet/' + det + "/"  ,this.adminSv.getHeader())
			.subscribe(
				data => {
					this.toastr.success("Detalle Eliminado");
					console.log("Detalle Eliminado ");
				
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});
				
	}


}
