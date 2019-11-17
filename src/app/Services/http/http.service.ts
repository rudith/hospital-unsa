import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError as observableThrowError, Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Historial } from "../../interfaces/historial";
import { Cita } from "../../interfaces/cita";
import { Grupsang } from "../../interfaces/grupsang";
import { Distrito } from "../../interfaces/distrito";
import { Tipoexamen } from "../../interfaces/tipoexamen";
import { Provincia } from "../../interfaces/provincia";
import { Departamento } from "../../interfaces/departamento";
import { Especialidad } from "../../interfaces/especialidad";
import { Medico } from "../../interfaces/medico";
import { User } from "../../interfaces/user";
import { Triaje } from "../../interfaces/triaje";
import { Consulta } from "../../interfaces/consulta";
import { CitaM } from "../../interfaces/cita-m";
import { ToastrService } from "ngx-toastr";
import { Examen } from "../../interfaces/examen";
import { Detalle } from "../../interfaces/detalle";
import { Personal } from "../../interfaces/personal";
import { citaLista } from "../../interfaces/citaLista";
import { ConsultasPaginadas } from "../../interfaces/consultas-paginadas";
import { HistorialLista } from "../../interfaces/historial-lista";
import { EspecialidadLista } from "../../interfaces/especialidad-lista";
import { TCModalService } from "../../ui/services/modal/modal.service";
import { SolicitudLista } from "../../interfaces/solicitud-lista";
import { Orden } from "../../interfaces/orden";

// BASE_API_URL
import { BASE_API_URL } from "../../config/API";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  public admin: boolean = false;
  public admis: boolean = false;
  public triaje: boolean = false;
  public consultorio: boolean = false;
  public laboratorio: boolean = false;
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
  public historiaLis: HistorialLista;
  public detalle: Detalle[] = [];
  public cita: Cita[] = [];
  public examen: Examen[] = [];
  private nroHisCom: string;
  private idHisCom: number;
  private idMedico: number;
  private idUser: number;

  constructor(private http: HttpClient, private toastr: ToastrService) { }
  getHeader() {
    var headers_object = new HttpHeaders({
      Authorization: "token " + localStorage.getItem("token")
    });

    var httpOptions = {
      headers: headers_object
    };
    console.log(
      "entro" + JSON.stringify(headers_object) + localStorage.getItem("token")
    );
    return httpOptions;
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
   * getIdMed: devuelve el Id del medico del componente Consultas, establecido en setNroHC
   ***/
  getIdMed(): number {
    return this.idMedico;
  }

  /***
   * autor: Shirley Romero.
   * setIdMedico: establece el  id del usuario logeado
   ***/
  setIdUs(us: number) {
    this.idUser = us;
  }

  /***
 * autor: Milagros Motta R.
 * getIdMed: devuelve el Id del medico del componente Consultas, establecido en setNroHC
 ***/
  getIdUs(): number {
    return this.idUser;
  }

  /***
   * autor: Milagros Motta R.
   * setIdMedico: establece el del medico logueado
   ***/
  setIdMedico(med: number) {
    this.idMedico = med;
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
    return observableThrowError(error.error || "Server error");
  }

  searchCitaDNI(dni: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citadni/?dni=" + dni,this.getHeader()
    );
  }

  searchCitaEsp(esp: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citasporespecialidad2/?esp=" + esp,this.getHeader()
    );
  }
  loadEspecialidadesSP(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/especialidadSP/",this.getHeader()
    );
  }
  loadEspecialidades(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/especialidad/"
    );
  }
  loadEspecialidadesPag(): Observable<EspecialidadLista> {
    return this.http.get<EspecialidadLista>(
      BASE_API_URL + "/administrador/especialidad/"
    );
  }
  loadMedicoSP(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/ver-personalSP/",this.getHeader()
    );
  }
  loadMedico(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/ver-personal/"
    );
  }
  loadMedicoEsp(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/personalporespecialidad/?" +
      id +
      "=idEspecialidad"
    );
  }
  loadHistorias(): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(
      BASE_API_URL + "/admision/ver-historias/"
    );
  }
  loadHistoriaPagination(url: string): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(url);
  }
  loadCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(
      BASE_API_URL + "/consultorio/crear-cita/"
    );
  }
  loadCitasM(): Observable<CitaM[]> {
    return this.http.get<CitaM[]>(
      BASE_API_URL + "/consultorio/ver-citas/"
    );
  }
  loadCitasT(): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citasenespera/"
    );
  }
  loadSolicitudes(): Observable<SolicitudLista> {
    return this.http.get<SolicitudLista>(
      BASE_API_URL + "/consultorio/ver-solicitudes/"
    );
  }
  loadSolicitudesPag(url: string): Observable<SolicitudLista> {
    return this.http.get<SolicitudLista>(url);
  }

  loadCitasTPag(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url);
  }
  loadCitasEdit(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/ver-citas/",this.getHeader()
    );
  }
  loadCitaPagination(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url,this.getHeader());
  }
  CancelarCita(id: string): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/cancelarcita/" + id + "/",this.getHeader()
    );
  }
  TriarCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/triarcita/" + id + "/"
    );
  }
  loadGSang(): Observable<Grupsang[]> {
    return this.http.get<Grupsang[]>(
      BASE_API_URL + "/admision/grupo-sangre/"
    );
  }

  loadDistrito(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(
      BASE_API_URL + "/admision/distritos/"
    );
  }
  loadProvincia(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(
      BASE_API_URL + "/admision/provincias/"
    );
  }
  loadProvinciaId(id: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(
      BASE_API_URL + "/admision/buscarprovincias/" + id + "/"
    );
  }
  loadDepartamento(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(
      BASE_API_URL + "/admision/departamentos/"
    );
  }
  searchCitasxEsp(id: number): Observable<CitaM[]> {
    return this.http.get<CitaM[]>(
      BASE_API_URL + "/consultorio/citasporespecialidad/" + id + "/"
    );
  }
  cancelarCitasPasadas(): Observable<any> {
    return this.http.post<any>(
      BASE_API_URL + "/admision/cancelarCitasFecha/",this.getHeader());
  }

  searchHistoriaTriaje(dni: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citadniespera/?dni=" + dni
    );
  }
  crearTriaje(newTriaje: Triaje) {
    console.log("servicio triaje");
    console.log(newTriaje);
    this.http
      .post<any>(BASE_API_URL + "/consultorio/crear-triaje/", {
        talla: newTriaje.talla,
        peso: newTriaje.peso,
        temperatura: newTriaje.temperatura,
        frecuenciaR: newTriaje.frecuenciaR,
        frecuenciaC: newTriaje.frecuenciaC,
        presionArt: newTriaje.presionArt,
        numeroHistoria: newTriaje.numeroHistoria.id,
        cita: newTriaje.cita,
        personal: newTriaje.personal
      })
      .subscribe(
        data => {
          this.toastr.success("", "Triaje Creado");
          console.log("triaje creado completo");
        },
        error => {
          this.toastr.error("", "No se pudo crear el Triaje");
          console.error(error);
        }
      );
  }
  createOrden(newOrden: Orden, modal: TCModalService) {
    console.log(newOrden);
    this.http
      .post<any>(BASE_API_URL + "/consultorio/crear-orden/", {
        numeroHistoria: newOrden.numeroHistoria,
        dni: newOrden.dni,
        nombre: newOrden.nombre,
        medico: newOrden.medico,
        orden: newOrden.orden,
        tipoExam: newOrden.tipoExam,
        fechaA: newOrden.fechaA,
        estadoOrden: "Creada",
      })
      .subscribe(
        data => {
          this.toastr.success("Orden Creada correctamente");
          console.log("CREAR Historial Completo");
          modal.close();
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Orden");
        }
      );
  }
  createHISTORIAL(newHistoria: Historial, modal: TCModalService) {
    
    this.http
      .post<any>(BASE_API_URL + "/admision/crear-historia/", {
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
        departamento: newHistoria.departamento
      })
      .subscribe(
        data => {
          this.toastr.success("Historial Creado correctamente");
          console.log("CREAR Historial Completo");
          modal.close();
        },
        error => {
          console.error("Leer errores de back",error)
          this.toastr.error("No se pudo crear el Historial");
        }
      );
  }
  searcHistoriasDNI(dni: string): Observable<Historial> {
    return this.http.get<Historial>(
      BASE_API_URL + "/admision/historiadni/" + dni + "/"
    );
  }
  searcHistoriasNroR(nroR: string): Observable<Historial[]> {
    return this.http.get<Historial[]>(
      BASE_API_URL + "/admision/historianumero/?nro=" + nroR
    );
  }
  searcHistoriasNomAp(name: string): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(
      BASE_API_URL + "/admision/historianombre/?nom=" + name
    );
  }
  searcDptoxP(id: number): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/admision/buscarprovincias/" + id + "/"
    );
  }
  searcProxDist(id: number): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/admision/buscardistritos/" + id + "/"
    );
  }
  searcMedxEsp(id: number): Observable<Personal[]> {
    console.log(id);
    return this.http.get<Personal[]>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id
    );
  }

  searchMedicoporEsp(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id,this.getHeader()
    );
  }

  searcMedxEspPag(id: number): Observable<Personal[]> {
    console.log(id);
    return this.http.get<Personal[]>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id
    );
  }

  createCITA(newCita: Cita, modal: TCModalService) {
    this.http
      .post<any>(BASE_API_URL + "/consultorio/crear-cita/", {
        numeroRecibo: newCita.numeroRecibo,
        fechaSeparacion: newCita.fechaSeparacion,
        fechaAtencion: newCita.fechaAtencion,
        estadoCita: newCita.estadoCita,
        estReg: newCita.estReg,
        especialidad: newCita.especialidad,
        numeroHistoria: newCita.numeroHistoria,
        medico: newCita.medico,
        responsable: newCita.responsable,
        exonerado: newCita.exonerado
      })
      .subscribe(
        data => {
          newCita = <Cita>{};
          console.log("CITA Completo");
          modal.close();
          this.toastr.success("Cita Agregada correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo agregar la cita,no ingrese fechas pasadas");
        }
      );
  }

  loadUsers(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/usuarios/",this.getHeader()
    );
  }
  searchUsers(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/buscarusuario/?us=" + id,this.getHeader()
    );
  }

  DeleteUser(id: string) {
    return this.http.delete<any>(
      BASE_API_URL + "/administrador/usuarios/" + id + "/",this.getHeader()
    );
  }
  UpdateUser(user: User): Observable<User> {
    console.log(JSON.stringify(user));
    return this.http.put<any>(
      BASE_API_URL + "/administrador/usuarios/" + user.id + "/",
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
      },this.getHeader()
    );
  }
  CreateUser(user: User): Observable<any> {
    return this.http.post<any>(
      BASE_API_URL + "/api/rest-auth/registration/",
      {
        username: user.username,
        password1: user.password,
        password2: user.password,
        is_superuser: user.is_superuser,
        //email: user.email,
        is_staff: user.is_staff,
      }
      , this.getHeaderUser());
  }

  getHeaderUser() {
    var headers_object = new HttpHeaders({ "Content-Type": "application/json" });
    var httpOptions = { headers: headers_object };
    return httpOptions;
  }

  /***
   * autor: Milagros Motta R.
   * loadCitasMedico: recibe el id del medico
   ***/
  loadCitasMedico(nro: number): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citaspormedico/?id=" + nro
    );
  }

  /*
   * autor: Milagros Motta R.
   * searcHistoriaCompleta: recibe el nro de historia
   */
  searcHistoriaCompleta(nro: string): Observable<ConsultasPaginadas> {
    return this.http.get<ConsultasPaginadas>(
      BASE_API_URL + "/consultorio/buscarhistorialclinico/?nro=" + nro
    );
  }
  /***
   * autor: Milagros Motta R.
   * paginacionConsultasHistoriaC: Recibe la url de la paginación correspondiente, devolviendo así la data organizada con el modelo ConsultasPaginadas.
   ***/
  paginacionConsultasHistoriaC(url: string): Observable<ConsultasPaginadas> {
    return this.http.get<ConsultasPaginadas>(url);
  }

  /***
   * autor: Milagros Motta R.
   * searcTriajeC: recibe el id del medico
   ***/
  searcTriajeC(nro: number): Observable<Triaje> {
    return this.http.get<Triaje>(
      BASE_API_URL + "/consultorio/triajeporcita/" + nro + "/"
    );
  }
  /***
   * autor: Milagros Motta R.
   * crearConsulta: recibe un objeto de tipo Consulta y asigna los valores de este a un json para que sea creado
   * en el back correctamente.
   ***/
  crearConsulta(newConsulta: Consulta) {
    this.http
      .post<any>(BASE_API_URL + "/consultorio/crear-consulta/", {
        motivoConsulta: newConsulta.motivoConsulta,
        apetito: newConsulta.apetito,
        orina: newConsulta.orina,
        deposiciones: newConsulta.deposiciones,
        examenFisico: newConsulta.examenFisico,
        diagnostico: newConsulta.diagnostico,
        tratamiento: newConsulta.tratamiento,
        proximaCita: newConsulta.proximaCita,
        triaje: newConsulta.triaje,
        ordenExam: newConsulta.ordenExam,
        numeroHistoria: newConsulta.numeroHistoria,
        medico: newConsulta.medico
      })
      .subscribe(
        data => {
          this.toastr.success("Consulta Guardada correctamente");
          console.log("Crear Consulta Correcto");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo agregar la Consulta");
        }
      );
  }
  /***
   * autor: Milagros Motta R.
   * AtenderCita: Cambia el estado de la cita a atendido, solo recibe el id de la cita.
   ***/
  AtenderCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/atendercita/" + id + "/"
    );
  }

  /***
   * autor: Milagros Motta R.
   * paginacionCitasM: Recibe la url de la paginación correspondiente, devolviendo así la data organizada con el modelo CitasMPaginadas.
   ***/
  paginacionCitasM(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url);
  }
}
