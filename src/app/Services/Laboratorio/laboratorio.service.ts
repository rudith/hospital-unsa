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


@Injectable({
	providedIn: 'root'
})
export class LaboratorioService {
	private url: string = "http://18.216.2.122:9000/laboratorio";
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

	constructor(private http: HttpClient, private toastr: ToastrService) {


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
		return this.http.get<Examen[]>(this.url + '/filtro/DNI/?dni=' + dni);
	}

	searchLabName(nombre: string): Observable<any> {
		return this.http.get<Cabeceralab>(this.url + '/filtro/?nombre=' + nombre);
	}
	searchLabFecha(fecha: string): Observable<any> {
		this.fi = fecha.substring(0, 10);
		this.ff = fecha.substring(11, 22);
		return this.http.get<any>(this.url + '/filtro/fecha/?fecha_inicio=' + this.fi + "&fecha_final=" + this.ff);
	}
	searchLabDni(dni: string): Observable<any> {
		return this.http.get<Examen>(this.url + '/filtro/DNI/?dni=' + dni);
	}
	loadTipoEx(): Observable<Tipoexamen[]> {
		return this.http.get<Tipoexamen[]>(this.url + "/TipoExamen/");
	}

	loadExamenPagination(url: string): Observable<ExamenLista> {
		return this.http.get<ExamenLista>(url);
	}
	loadOrdenPAgination(url: string): Observable<OrdenLista> {
		return this.http.get<OrdenLista>(url)
	}
	loadOrden(): Observable<OrdenLista> {
		return this.http.get<OrdenLista>("http://18.216.2.122:9000/consultorio/ver-orden/");
	}
	loadExamen(): Observable<ExamenLista> {
		return this.http.get<ExamenLista>(this.url + "/ExamenLabCab/");
	}

	loadTabla(idEx: number): Observable<Detalle[]> {
		console.log("ENTRA AL SERVICIO de tabla");
		return this.http.get<Detalle[]>(this.url + '/filtro/Detalles/?id=' + idEx)
	}
	cambioEstado(id: number): Observable<Orden> {
		return this.http.get<Orden>('http://18.216.2.122:9000/consultorio/atenderOrden/' + id);
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
			}).subscribe(
				data => {
					this.toastr.success("El detalle ha sido crado con exito");
					console.log("CREAR detalle Completo");
				},
				error => {
					console.log(error.message);
					this.toastr.error("El detalle no se ha creado");
				});

	}
	//crear cabecer
	createCabecera(newCabecera: Cabcrear) {
		console.log("ENTRA A SERVICIO ");
		this.http.post<Cabcrear>(this.url + '/CrearExamenLabCab/',
			{
				nombre: newCabecera.nombre,
				dni: newCabecera.dni,
				orden: newCabecera.orden,
				fecha: newCabecera.fecha,
				tipoExam: newCabecera.tipoExam,
				observaciones: newCabecera.observaciones,
			}).subscribe(
				data => {
					this.toastr.success("", "Se ha creado la cabecera");
					console.log("CREAR Cabecera Completo");

				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});
	}
}
