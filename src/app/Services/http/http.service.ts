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
import { OrdenLista } from "../../interfaces/orden-lista";
import { AdministradorService } from '../Administrador/administrador.service';

// BASE_API_URL
import { BASE_API_URL } from "../../config/API";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  // public admin: boolean = false;
  // public admis: boolean = false;
  // public triaje: boolean = false;
  // public consultorio: boolean = false;
  // public laboratorio: boolean = false;
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
  private nomMedico: string;
  private idUser: number;

  constructor(private http: HttpClient, private toastr: ToastrService, private adminService: AdministradorService) { }

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

  getNomMed(): string {
    return this.nomMedico;
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

  setNomMedico(med: string) {
    this.nomMedico = med;
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


  loadEspecialidadesSP(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/especialidadSP/", this.adminService.getHeader()
    );
  }
  loadEspecialidades(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/especialidad/", this.adminService.getHeader()
    );
  }
  loadEspecialidadesPag(): Observable<EspecialidadLista> {
    return this.http.get<EspecialidadLista>(
      BASE_API_URL + "/administrador/especialidad/", this.adminService.getHeader()
    );
  }

  loadMedicoSP(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/ver-personalSP/", this.adminService.getHeader()
    );
  }
  loadMedico(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/ver-personal/", this.adminService.getHeader()
    );
  }
  loadMedicoEsp(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/personalporespecialidad/?" + id + "=idEspecialidad", this.adminService.getHeader()
    );
  }
  loadHistorias(): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(
      BASE_API_URL + "/admision/ver-historias/", this.adminService.getHeader()
    );
  }
  loadHistoriaPagination(url: string): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(url, this.adminService.getHeader());
  }
  loadCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(BASE_API_URL + "/consultorio/crear-cita/", this.adminService.getHeader()
    );
  }
  loadCitasM(): Observable<CitaM[]> {
    return this.http.get<CitaM[]>(
      BASE_API_URL + "/consultorio/ver-citas/", this.adminService.getHeader()
    );
  }
  loadCitasT(): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citasenespera/", this.adminService.getHeader()
    );
  }

  loadHistorialCitas(): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/historialdecitas/", this.adminService.getHeader()
    );
  }





  loadCitasTPag(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url, this.adminService.getHeader());
  }
  loadCitasEdit(): Observable<any> {
    return this.http.get<any>(BASE_API_URL + "/consultorio/ver-citas/", this.adminService.getHeader()
    );
  }
  loadCitaPagination(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url, this.adminService.getHeader());
  }
  CancelarCita(id: string): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/cancelarcita/" + id + "/", this.adminService.getHeader()
    );
  }
  TriarCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/triarcita/" + id + "/", this.adminService.getHeader()
    );
  }
  loadGSang(): Observable<Grupsang[]> {
    return this.http.get<Grupsang[]>(
      BASE_API_URL + "/admision/grupo-sangre/", this.adminService.getHeader()
    );
  }

  loadDistrito(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(
      BASE_API_URL + "/admision/distritos/", this.adminService.getHeader()
    );
  }
  loadProvincia(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(
      BASE_API_URL + "/admision/provincias/", this.adminService.getHeader()
    );
  }
  loadProvinciaId(id: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(
      BASE_API_URL + "/admision/buscarprovincias/" + id + "/", this.adminService.getHeader()
    );
  }
  loadDepartamento(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(
      BASE_API_URL + "/admision/departamentos/", this.adminService.getHeader()
    );
  }

  cancelarCitasPasadas(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/admision/cancelarCitasFecha/", this.adminService.getHeader());
  }

  searchCitasxEsp(id: number): Observable<CitaM[]> {
    return this.http.get<CitaM[]>(
      BASE_API_URL + "/consultorio/citasporespecialidad/" + id + "/", this.adminService.getHeader()
    );
  }

  //Busqueda de citas para buscar cita (espera y triadas)
  searchCitaDNI(dni: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citadni/?dni=" + dni, this.adminService.getHeader()
    );
  }

  searchCitaEsp(esp: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citasporespecialidad2/?esp=" + esp, this.adminService.getHeader()
    );
  }

  searchCitaNom(dni: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citaspornombre/?nom=" + dni, this.adminService.getHeader()
    );
  }

  searchCitaNroHist(esp: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/citasporhistoria/?nro=" + esp, this.adminService.getHeader()
    );
  }

  //Busqueda de citas por dni para Triaje
  searchHistoriaTriaje(dni: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citadniespera/?dni=" + dni, this.adminService.getHeader()
    );
  }

  //Busqueda para Historial de Citas
  searchHistCitasxDni(id: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citaHdni/?dni=" + id, this.adminService.getHeader()
    );
  }
  searchHistCitasxEsp(id: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citasporespecialidad2H/?esp=" + id, this.adminService.getHeader()
    );
  }
  searchHistCitasxNom(id: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citasHpornombre/?nom=" + id, this.adminService.getHeader()
    );
  }
  searchHistCitasxNumHist(id: string): Observable<citaLista> {
    return this.http.get<citaLista>(
      BASE_API_URL + "/consultorio/citasHporhistoria/?nro=" + id, this.adminService.getHeader()
    );
  }

  //Buscra para ordens
  searchOrdenesDni(ab: string): Observable<OrdenLista> {
    return this.http.get<OrdenLista>(BASE_API_URL + "/consultorio/buscarOrden/?dni=" + ab, this.adminService.getHeader());
  }

  searchOrdenesNom(ab: string): Observable<OrdenLista> {
    return this.http.get<OrdenLista>(BASE_API_URL + "/consultorio/buscarNombreOrden/?nom=" + ab, this.adminService.getHeader());
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
      }, this.adminService.getHeader())
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
  createOrden(newOrden: Orden, modal: TCModalService, a: number, e: number) {
    console.log(newOrden);
    if (a == 0) {
      newOrden.estadoOrden = "Creado";
    }
    else {
      newOrden.estadoOrden = "Pagado";
    }
    this.http
      .post<any>(BASE_API_URL + "/consultorio/crear-orden/", {
        numeroHistoria: newOrden.numeroHistoria,
        dni: newOrden.dni,
        nombre: newOrden.nombre,
        medico: newOrden.medico,
        orden: newOrden.orden,
        tipoExam: newOrden.tipoExam,
        fechaA: newOrden.fechaA,
        estadoOrden: newOrden.estadoOrden,
      }, this.adminService.getHeader())
      .subscribe(
        data => {
          this.toastr.success("Orden Creada correctamente");
          console.log("CREAR Historial Completo");
          if (e == 2)
            modal.close();
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Orden");
        }
      );
  }
  updateOrden(newOrden: Orden, modal: TCModalService, id: number) {
    console.log(newOrden);
    this.http
      .put<any>(BASE_API_URL + "/consultorio/crear-orden/" + id + "/", {
        numeroHistoria: newOrden.numeroHistoria,
        dni: newOrden.dni,
        nombre: newOrden.nombre,
        medico: newOrden.medico,
        orden: newOrden.orden,
        tipoExam: newOrden.tipoExam,
        fechaA: newOrden.fechaA,
        estadoOrden: "Pagado",
      }, this.adminService.getHeader())
      .subscribe(
        data => {
          this.toastr.success("Orden Creada correctamente");
          console.log("Orden Actualizada ");
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
      }, this.adminService.getHeader())
      .subscribe(
        data => {
          this.toastr.success("Historial Creado correctamente");
          console.log("CREAR Historial Completo");
          modal.close();
        },
        error => {
          console.error("Leer errores de back", error)
          this.toastr.error("No se pudo crear el Historial");
        }
      );
  }
  searcHistoriasDNI(dni: string): Observable<Historial> {
    return this.http.get<Historial>(
      BASE_API_URL + "/admision/historiadni/" + dni + "/", this.adminService.getHeader()
    );
  }
  searcHistoriasNroR(nroR: string): Observable<Historial[]> {
    return this.http.get<Historial[]>(
      BASE_API_URL + "/admision/historianumero/?nro=" + nroR, this.adminService.getHeader()
    );
  }
  searcHistoriasNomAp(name: string): Observable<HistorialLista> {
    return this.http.get<HistorialLista>(
      BASE_API_URL + "/admision/historianombre/?nom=" + name, this.adminService.getHeader()
    );
  }
  searcDptoxP(id: number): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/admision/buscarprovincias/" + id + "/", this.adminService.getHeader()
    );
  }
  searcProxDist(id: number): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/admision/buscardistritos/" + id + "/", this.adminService.getHeader()
    );
  }
  searcMedxEsp(id: number): Observable<Personal[]> {
    console.log(id);
    return this.http.get<Personal[]>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id, this.adminService.getHeader()
    );
  }

  searchMedicoporEsp(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id, this.adminService.getHeader()
    );
  }

  searcMedxEspPag(id: number): Observable<Personal[]> {
    console.log(id);
    return this.http.get<Personal[]>(
      BASE_API_URL + "/administrador/personalporespecialidad/?id=" + id, this.adminService.getHeader()
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
      }, this.adminService.getHeader())
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
      BASE_API_URL + "/administrador/usuarios/", this.adminService.getHeader()
    );
  }
  searchUsers(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/buscarusuario/?us=" + id, this.adminService.getHeader()
    );
  }

  DeleteUser(id: string) {
    return this.http.delete<any>(
      BASE_API_URL + "/administrador/usuarios/" + id + "/", this.adminService.getHeader()
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
      }, this.adminService.getHeader()
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
      BASE_API_URL + "/consultorio/citaspormedico/?id=" + nro, this.adminService.getHeader()
    );
  }

  /*
   * autor: Milagros Motta R.
   * searcHistoriaCompleta: recibe el nro de historia
   */
  searcHistoriaCompleta(nro: string): Observable<ConsultasPaginadas> {
    return this.http.get<ConsultasPaginadas>(
      BASE_API_URL + "/consultorio/buscarhistorialclinico/?nro=" + nro, this.adminService.getHeader()
    );
  }
  /***
   * autor: Milagros Motta R.
   * paginacionConsultasHistoriaC: Recibe la url de la paginación correspondiente, devolviendo así la data organizada con el modelo ConsultasPaginadas.
   ***/
  paginacionConsultasHistoriaC(url: string): Observable<ConsultasPaginadas> {
    return this.http.get<ConsultasPaginadas>(url, this.adminService.getHeader());
  }

  /***
   * autor: Milagros Motta R.
   * searcTriajeC: recibe el id del medico
   ***/
  searcTriajeC(nro: number): Observable<Triaje> {
    return this.http.get<Triaje>(
      BASE_API_URL + "/consultorio/triajeporcita/" + nro + "/", this.adminService.getHeader()
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
      }, this.adminService.getHeader())
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
   * deleteOrden: Elimina la Orden creada desde consultorio.
   ***/
  deleteOrden(id: string) {
    return this.http.delete<any>(
      BASE_API_URL + "/consultorio/crear-orden/" + id + "/", this.adminService.getHeader()
    );
  }
  /***
   * autor: Milagros Motta R.
   * AtenderCita: Cambia el estado de la cita a atendido, solo recibe el id de la cita.
   ***/
  AtenderCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(
      BASE_API_URL + "/consultorio/atendercita/" + id + "/", this.adminService.getHeader()
    );
  }

  /***
   * autor: Milagros Motta R.
   * paginacionCitasM: Recibe la url de la paginación correspondiente, devolviendo así la data organizada con el modelo CitasMPaginadas.
   ***/
  paginacionCitasM(url: string): Observable<citaLista> {
    return this.http.get<citaLista>(url, this.adminService.getHeader());
  }

  
  /***
   * autor: Milagros Motta R.
   * createTipoExamen: recibe un objeto de tipo Tipoexamen y asigna los valores de este a un json para que sea creado
   * en el back correctamente.
   ***/
  listarOrdenesDNIPaginacion(dni:string): Observable<any>{
    return this.http.get<any>(
      BASE_API_URL + "/consultorio/buscarOrden/?dni="+dni ,this.adminService.getHeader()
    );
  }

  generarReporteDiario(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + '/admision/reporteDiarioCitas', this.adminService.getHeader());
  }

  searchOrdenDniAdmis(dni: string): Observable<any> {
    return this.http.get<any>(BASE_API_URL + '/consultorio/buscarNombreOrden/?nom=' + dni, this.adminService.getHeader());
  }
}
