import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Historial } from '../../interfaces/historial';
import { Cita } from '../../interfaces/cita';
import { Tipoexamen } from '../../interfaces/tipoexamen';
import { Cabeceralab } from '../../interfaces/cabeceralab';
import { ToastrService } from 'ngx-toastr';
import {Examen} from '../../interfaces/examen';
import {Detalle} from '../../interfaces/detalle';

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {
  private url: string = "http://18.216.2.122:9000/laboratorio";
	public historia: Historial;
	public cabecera: Cabeceralab[]=[];
	public detalle:Detalle[]=[];
	public cita: Cita[]=[];
	public examen:Examen[]=[];
	fi:string;
	ff:string;
  
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
  /*  
	 * autor: Milagros Motta R.
	 * searchExamenbDni: Busca el listado de examenes por DNI.
	 */
	searchExamenbDni(dni:string): Observable<Examen[]>{
		return this.http.get<Examen[]>(this.url+'/filtro/DNI/?dni='+ dni);
	}
		
	searchLabName(nombre: string): Observable<any> {
		return this.http.get<Cabeceralab>(this.url+'/filtro/?nombre=' + nombre);
	}
	searchLabFecha(fecha: string): Observable<any> {
		this.fi=fecha.substring(0,10);
		this.ff=fecha.substring(11,22);
		return this.http.get<any>(this.url+'/filtro/fecha/?fecha_inicio=' + this.fi +"&fecha_final=" +this.ff);
	}
	searchLabDni(dni:string): Observable<any>{
		return this.http.get<Examen>(this.url+'/filtro/DNI/?dni='+ dni);
	}
	loadTipoEx(): Observable<Tipoexamen[]> {
		return this.http.get<Tipoexamen[]>(this.url+"/TipoExamen/");
	}
	loadExamen():Observable<Examen[]> {
		return this.http.get<Examen[]> (this.url+"/ExamenLabCab/");

	}
	
	loadTabla(idEx:number):Observable<Detalle[]>{
		console.log("ENTRA AL SERVICIO de tabla");
		return this.http.get<Detalle[]>(this.url+'/filtro/Detalles/?id='+ idEx)
	}

	createDetalle(detalle: Detalle){
		console.log(detalle);
		this.http.post<any>(this.url+'/ExamenLabDet/',
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
	createCabecera(newCabecera: Cabeceralab) {
		console.log(newCabecera);
		this.http.post<any>(this.url+'/ExamenLabCab/',
			{
				nombre: newCabecera.nombre,
				dni: newCabecera.dni,
				orden: newCabecera.orden,
				fecha: newCabecera.fecha,
				observaciones: newCabecera.observaciones,
				tipoExam: newCabecera.tipoExam,
			}).subscribe(
				data => {
					this.toastr.success("","Se ha creado la cabecera");
					console.log("CREAR Cabecera Completo");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});
	}
}
