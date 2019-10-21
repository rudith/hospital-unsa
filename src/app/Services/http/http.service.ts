import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Historial } from '../../interfaces/historial';
import { Cita } from '../../interfaces/cita';
import { Grupsang } from '../../interfaces/grupsang';
import { Distrito } from '../../interfaces/distrito';
import { Tipoexamen } from '../../interfaces/tipoexamen';
import { Provincia } from '../../interfaces/provincia';
import { Departamento } from '../../interfaces/departamento';
import { Especialidad } from '../../interfaces/especialidad';
import { Medico } from '../../interfaces/medico';
import { User } from '../../interfaces/user';
import { Triaje } from '../../interfaces/triaje';
import { ConsultaCompleta } from '../../interfaces/consulta-c';
import { Consulta } from '../../interfaces/consulta';
import { Cabeceralab } from '../../interfaces/cabeceralab';
import { CitaM } from '../../interfaces/cita-m';
import { ToastrService } from 'ngx-toastr';
import {Examen} from '../../interfaces/examen';
import {Detalle} from '../../interfaces/detalle';
import { Personal } from 'src/app/interfaces/personal';

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
	public TipoexamenGetUpdate: Tipoexamen[] = [];
	public ProvinciaGetUpdate: Provincia[] = [];
	public DepartamentoGetUpdate: Departamento[] = [];
	public EspecialidadGetUpdate: Especialidad[] = [];
	public MedicoGetUpdate: Medico[] = [];
	public historia: Historial;
	public cabecera: Cabeceralab[]=[];
	public detalle:Detalle[]=[];
	public cita: Cita[]=[];
	public examen:Examen[]=[];
	private nroHisCom: string;
	private idHisCom: number;

	constructor(private http: HttpClient, private toastr: ToastrService) {
	}

	getData(source: string) {
		return this.http.get(source).pipe(
			tap((res: any) => res),
			catchError(this.handleError)
		);
	}
	/***  
	 * autor: Milagros Motta R.
	 * getNroHC: devuelve el Nro de historia, establecido en setNroHC
	 ***/
	getNroHC(): string {
		return this.nroHisCom;
	}
	/***  
	 * autor: Milagros Motta R.
	 * getIdHC: devuelve el Id de la cita triada en el componente Consultas, establecido en setNroHC
	 ***/
	getIdHC(): number {
		return this.idHisCom;
	}
	/***  
	 * autor: Milagros Motta R.
	 * getNroHC: establece el Nro de historia y el Id de la cita triada
	 ***/
	setNroHC(change: string, cha: number) {

		this.nroHisCom = change;
		this.idHisCom = cha;
	}
	private handleError(error: any) {
		return observableThrowError(error.error || 'Server error');
	}
	searchCitaDNI(dni: string): Observable<any> {
		return this.http.get<any>("http://18.216.2.122:9000/consultorio/citadni/" + dni + "/");
	}
	searchCitaEsp(esp: string): Observable<any> {
		return this.http.get<any>("http://18.216.2.122:9000/consultorio/citasporespecialidad/" + esp + "/");
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
	loadCitasM(): Observable<CitaM[]> {
		return this.http.get<CitaM[]>("http://18.216.2.122:9000/consultorio/ver-citas/");
	}
	loadCitasT(): Observable<CitaM[]> {
		return this.http.get<CitaM[]>("http://18.216.2.122:9000/consultorio/citasenespera/");
	}
	loadCitasEdit(): Observable<CitaM[]> {
		return this.http.get<CitaM[]>("http://18.216.2.122:9000/consultorio/ver-citas/");
	}
	CancelarCita(id: number): Observable<Cita> {
		return this.http.get<Cita>("http://18.216.2.122:9000/consultorio/cancelarcita/" + id + "/");
	}
	TriarCita(id: number): Observable<Cita> {
		return this.http.get<Cita>("http://18.216.2.122:9000/consultorio/triarcita/" + id + "/");
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
	loadProvinciaId(id:number): Observable<Provincia[]> {
		return this.http.get<Provincia[]>("http://18.216.2.122:9000/admision/buscarprovincias/"+id+"/");
	}

	loadMedicosXesp(): Observable<Provincia[]> {
		return this.http.get<Provincia[]>("http://18.216.2.122:9000/admision/provincias/");
	}
	loadDepartamento(): Observable<Departamento[]> {
		return this.http.get<Departamento[]>("http://18.216.2.122:9000/admision/departamentos/");
	}
	searchCitasxEsp(id:number): Observable<CitaM[]> {
		return this.http.get<CitaM[]>("http://18.216.2.122:9000/consultorio/citasporespecialidad/"+id+"/");
	}
	searchHistoriaTriaje(dni: string): Observable<CitaM[]> {
		return this.http.get<CitaM[]>('http://18.216.2.122:9000/consultorio/citadniespera/?dni=' + dni);

	}
	crearTriaje(newTriaje: Triaje) {
		console.log('servicio triaje');
		console.log(newTriaje);
		this.http.post<any>('http://18.216.2.122:9000/consultorio/crear-triaje/',{
				talla: newTriaje.talla,
				peso: newTriaje.peso,
				temperatura: newTriaje.temperatura,
				frecuenciaR: newTriaje.frecuenciaR,
				frecuenciaC: newTriaje.frecuenciaC,
				presionArt: newTriaje.presionArt,
				numeroHistoria: newTriaje.numeroHistoria.id,
				cita: newTriaje.cita,
				personal: newTriaje.personal,

			}).subscribe(
				data => {
					this.toastr.success('', 'Triaje Creado');
					console.log('triaje creado completo');
				},
				error => {
					this.toastr.error('', 'No se pudo crear el Triaje');
					console.error(error);
				}
			);
	}
	createHISTORIAL(newHistoria: Historial) {
		console.log(newHistoria);
		this.http.post<any>('http://18.216.2.122:9000/admision/crear-historia/',{
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
					this.toastr.success("Historial Creado correctamente");
					console.log("CREAR Historial Completo");
				},
				error => {
					console.log(error.message);
					this.toastr.error("No se pudo crear el Historial");
					this.toastr.warning("Recuerde que no debe repetirse el DNI");
				});
	}
	searcHistoriasDNI(dni: string): Observable<Historial> {
		return this.http.get<Historial>('http://18.216.2.122:9000/admision/historiadni/' + dni + "/");
	}
	searcHistoriasNroR(nroR: string): Observable<Historial[]> {
		return this.http.get<Historial[]>('http://18.216.2.122:9000/admision/historianumero/?nro=' + nroR );
	}
	searcHistoriasNomAp(name: string): Observable<Historial[]> {
		return this.http.get<Historial[]>('http://18.216.2.122:9000/admision/historianombre/?nom=' + name);
	}
	searcDptoxP(id: number): Observable<any> {
		
		return this.http.get<any>('http://18.216.2.122:9000/admision/buscarprovincias/'+id+'/');
	}
	searcProxDist(id: number): Observable<any> {
		return this.http.get<any>('http://18.216.2.122:9000/admision/buscardistritos/'+id+'/');
	}
	searcMedxEsp(id: number): Observable<Personal[]> {
		console.log(id);
		return this.http.get<Personal[]>('http://18.216.2.122:9000/administrador/personalporespecialidad/?id='+id);
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
					this.toastr.success("Cita Agregada correctamente");
				},
				error => {
					console.log(error.message);
					this.toastr.error("No se pudo agregar la cita");
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

	/*  
	 * autor: Milagros Motta R.
	 * loadCitasMedico: recibe el id del medico
	 */
	loadCitasMedico(nro: number): Observable<any> {
		return this.http.get<any>('http://18.216.2.122:9000/consultorio/citaspormedico/?id=' + nro);
	}
	/*  
	 * autor: Milagros Motta R.
	 * searcHistoriaCompleta: recibe el nro de historia 
	 */
	searcHistoriaCompleta(nro: string): Observable<ConsultaCompleta[]> {
		return this.http.get<ConsultaCompleta[]>('http://18.216.2.122:9000/consultorio/buscarhistorialclinico/?nro=' + nro);
	}
	/*  
	 * autor: Milagros Motta R.
	 * searcTriajeC: recibe el id del medico
	 */
	searcTriajeC(nro: number): Observable<Triaje> {
		return this.http.get<Triaje>('http://18.216.2.122:9000/consultorio/triajeporcita/' + nro + "/");
	}
	/*  
	 * autor: Milagros Motta R.
	 * crearConsulta: recibe un objeto de tipo Consulta y asigna los valores de este a un json para que sea creado
	 * en el back correctamente.
	 */
	crearConsulta(newConsulta: Consulta) {
		console.log(JSON.stringify(newConsulta));
		this.http.post<any>('http://18.216.2.122:9000/consultorio/crear-consulta/',
			{
				motivoConsulta: newConsulta.motivoConsulta,
				apetito: newConsulta.apetito,
				orina: newConsulta.orina,
				deposiciones: newConsulta.deposiciones,
				examenFisico: newConsulta.examenFisico,
				diagnostico: newConsulta.diagnostico,
				tratamiento: newConsulta.tratamiento,
				proximaCita: newConsulta.proximaCita,
				triaje: newConsulta.triaje,
				numeroHistoria: newConsulta.numeroHistoria,
				medico: newConsulta.medico,
				especialidad:newConsulta.especialidad,
			}).subscribe(
				data => {
					this.toastr.success("Consulta Guardada correctamente");
					console.log("Crear Consulta Correcto");
				},
				error => {
					console.log(error.message);
					this.toastr.error("No se pudo agregar la Consulta");
				});
	}
	/*  
	 * autor: Milagros Motta R.
	 * AtenderCita: Cambia el estado de la cita a atendido, solo recibe el id de la cita.
	 */
	AtenderCita(id: number): Observable<Cita> {
		return this.http.get<Cita>("http://18.216.2.122:9000/consultorio/atendercita/" + id + "/");
	}	
}
