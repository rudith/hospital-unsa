import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Historial } from '../../interfaces/historial';
import { Cita } from '../../interfaces/cita';
import { Grupsang } from '../../interfaces/grupsang';
import { Distrito } from '../../interfaces/distrito';
import { Provincia } from '../../interfaces/provincia';
import { Departamento } from '../../interfaces/departamento';
import { Especialidad } from '../../interfaces/especialidad';
import { Medico } from '../../interfaces/medico';
import { User } from '../../interfaces/user';
import { Triaje } from '../../interfaces/triaje';
import { HistoriaCompleta } from '../../interfaces/historia-completa';
import { Consulta } from '../../interfaces/consulta';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	public admin: boolean = false;
	public admis: boolean = false;
	public triaje: boolean = false;
	public consultorio: boolean = false;
	public HistorialGetUpdate: Historial[] = [];
	public CitaGetUpdate: Cita[] = [];
	public GrupSangGetUpdate: Grupsang[] = [];
	public DistritoGetUpdate: Distrito[] = [];
	public ProvinciaGetUpdate: Provincia[] = [];
	public DepartamentoGetUpdate: Departamento[] = [];
	public EspecialidadGetUpdate: Especialidad[] = [];
	public MedicoGetUpdate: Medico[] = [];
	public historia: Historial;
	public cita: Cita;
	constructor(private http: HttpClient) { }

	getData(source: string) {
		return this.http.get(source).pipe(
			tap((res: any) => res),
			catchError(this.handleError)
		);
	}

	private handleError(error: any) {
		return observableThrowError(error.error || 'Server error');
	}
	searchCita(dni: string): Observable<any> {
		return this.http.get<any>("http://18.216.2.122:9000/consultorio/citadni/" + dni + "/");
	}
	loadEspecialidades(): Observable<Especialidad[]> {
		return this.http.get<Especialidad[]>("http://18.216.2.122:9000/administrador/especialidad/");
	}
	loadMedico(): Observable<Medico[]> {
		return this.http.get<Medico[]>("http://18.216.2.122:9000/administrador/ver-personal/");
	}
	loadHistorias(): Observable<Historial[]> {
		return this.http.get<Historial[]>("http://18.216.2.122:9000/admision/ver-historias/");
	}
	loadCitas(): Observable<Cita[]> {
		return this.http.get<Cita[]>("http://18.216.2.122:9000/consultorio/crear-cita/");
	}
	loadCitasTriaje(): Observable<Cita[]> {
		return this.http.get<Cita[]>("http://18.216.2.122:9000/consultorio/ver-citas/");
	}
	CancelarCita(id: number): Observable<Cita> {
		return this.http.get<Cita>("http://18.216.2.122:9000/consultorio/cancelarcita/" + id + "/");
	}
	loadGSang(): Observable<Grupsang[]> {
		return this.http.get<Grupsang[]>("http://18.216.2.122:9000/admision/grupo-sangre/");
	}
	loadDistrito(): Observable<Distrito[]> {
		return this.http.get<Distrito[]>("http://18.216.2.122:9000/admision/distritos/");
	}
	loadProvincia(): Observable<Provincia[]> {
		return this.http.get<Provincia[]>("http://18.216.2.122:9000/admision/provincias/");
	}
	loadDepartamento(): Observable<Departamento[]> {
		return this.http.get<Departamento[]>("http://18.216.2.122:9000/admision/departamentos/");
	}
	searchHistoriaTriaje(dni: string): Observable<any> {
		return this.http.get<any>('http://18.216.2.122:9000/consultorio/citadni/' + dni + "/");
	}
	crearTriaje(newTriaje: Triaje) {
		console.log('servicio triaje');
		console.log(newTriaje);
		this.http.post<any>('http://18.216.2.122:9000/consultorio/crear-triaje/',
			{

				talla: newTriaje.talla,
				peso: newTriaje.peso,
				temperatura: newTriaje.temperatura,
				frecuenciaR: newTriaje.frecuenciaR,
				frecuenciaC: newTriaje.frecuenciaC,
				presionArt: newTriaje.presionArt,
				numeroHistoria: newTriaje.numeroHistoria,
				cita: newTriaje.cita,
				personal: newTriaje.personal,


			}).subscribe(
				data => {

					console.log('triaje creado completo');
				},
				error => {
					console.log(error.message);
				}
			);
	}
	createHISTORIAL(newHistoria: Historial) {
		console.log(newHistoria);
		this.http.post<any>('http://18.216.2.122:9000/admision/crear-historia/',
			{
				numeroHistoria: newHistoria.numeroHistoria,
				dni: newHistoria.dni,
				nombres: newHistoria.nombres,
				apellido_paterno: newHistoria.apellido_paterno,
				apellido_materno: newHistoria.apellido_materno,
				sexo: newHistoria.sexo,
				edad: newHistoria.edad,
				fechaNac: newHistoria.fechaNac,
				celular: newHistoria.celular,
				telefono: newHistoria.telefono,
				estadoCivil: newHistoria.estadoCivil,
				gradoInstruccion: newHistoria.gradoInstruccion,
				ocupacion: newHistoria.ocupacion,
				direccion: newHistoria.direccion,
				nacionalidad: newHistoria.nacionalidad,
				email: newHistoria.email,
				estReg: newHistoria.estReg,
				distrito: newHistoria.distrito,
				provincia: newHistoria.provincia,
				departamento: newHistoria.departamento,
			}).subscribe(
				data => {
					console.log("CREAR Historial Completo");
				},
				error => {
					console.log(error.message);
				});
	}
	searcHistoriasDNI(dni: string): Observable<Historial> {
		return this.http.get<Historial>('http://18.216.2.122:9000/admision/historiadni/' + dni + "/");
	}
	searcHistoriasNroR(nroR: string): Observable<Historial> {
		return this.http.get<Historial>('http://18.216.2.122:9000/admision/historianumero/' + nroR + "/");
	}
	createCITA(newCita: Cita) {
		this.http
			.post<any>('http://18.216.2.122:9000/consultorio/crear-cita/', {
				numeroRecibo: newCita.numeroRecibo,
				fechaSeparacion: newCita.fechaSeparacion,
				fechaAtencion: newCita.fechaAtencion,
				estadoCita: newCita.estadoCita,
				estReg: newCita.estReg,
				especialidad: newCita.especialidad,
				numeroHistoria: newCita.numeroHistoria,
				medico: newCita.medico,
				responsable:newCita.responsable,
				exonerado:newCita.exonerado,
			})
			.subscribe(
				data => {
					newCita = <Cita>{};
					console.log('CITA Completo');
				},
				error => {
					console.log(error.message);
				}
			);
	}

	loadUsers(): Observable<User[]> {
		return this.http.get<User[]>("http://18.216.2.122:9000/administrador/usuarios/");
	}
	searchUsers(id: string): Observable<User> {
		return this.http.get<User>("http://18.216.2.122:9000/administrador/usuarios/" + id + "/");
	}
	DeleteUser(id: string) {
		return this.http.delete<any>("http://18.216.2.122:9000/administrador/usuarios/" + id + "/");
	}
	UpdateUser(user: User): Observable<User> {
		console.log(JSON.stringify(user));
		return this.http.put<any>("http://18.216.2.122:9000/administrador/usuarios/" + user.id + "/",
			{
				id: user.id,
				password: user.password,
				last_login: user.last_login,
				is_superuser: user.is_superuser,
				username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				is_staff: user.is_staff,
				is_active: user.is_active,
				date_joined: user.date_joined,
				groups: user.groups,
				user_permissions: user.user_permissions
			}
		);
	}
	CreateUser(user: User): Observable<any> {
		return this.http.post<any>("http://18.216.2.122:9000/administrador/usuarios/",
			{
				password: user.password,
				last_login: user.last_login,
				is_superuser: user.is_superuser,
				username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				is_staff: user.is_staff,
				is_active: user.is_active,
				date_joined: user.date_joined,
				groups: user.groups,
				user_permissions: user.user_permissions,
			}
		);
	}
	searcHistoriaCompleta(nro: string): Observable<HistoriaCompleta> {
		return this.http.get<HistoriaCompleta>('http://18.216.2.122:9000/consultorio/buscarhistorialclinico/' + nro + "/");
	}
	createConsulta(newConsulta: Consulta) {
		console.log(newConsulta);
		this.http.post<any>('http://18.216.2.122:9000/consultorio/crear-consulta/',
			{
				horaEntrada: newConsulta.horaEntrada,
				horaSalida: newConsulta.horaSalida,
				motivoConsulta: newConsulta.motivoConsulta,
				apetito: newConsulta.apetito,
				orina: newConsulta.orina,
				deposiciones: newConsulta.deposiciones,
				examenFisico: newConsulta.examenFisico,
				diagnostico: newConsulta.diagnostico,
				tratamiento: newConsulta.tratamiento,
				proximaCita: newConsulta.proximaCita,
				estadoAtencion: newConsulta.estadoAtencion,
				motivoAnulacion: newConsulta.motivoAnulacion,
				estReg: newConsulta.estReg,
				triaje: newConsulta.triaje,
				numeroHistoria: newConsulta.numeroHistoria,
				medico: newConsulta.medico,
			}).subscribe(
				data => {
					console.log("CREAR Consulta Completo");
				},
				error => {
					console.log(error.message);
				});
	}
}
