import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";

//interfaces
import { Area } from "../../interfaces/area";
import { Especialidad } from "../../interfaces/especialidad";
import { Tipopersonal } from "../../interfaces/tipopersonal";
import { PersonalCreate } from "../../interfaces/personalCreate";
import { IOption } from "../../ui/interfaces/option";
import { User } from "../../interfaces/user";
import { personalLista } from "../../interfaces/personalLista";
import { Tipoexamen } from "../../interfaces/tipoexamen";

// BASE_API_URL
import { BASE_API_URL } from "../../config/API";
import { Personal } from "../../interfaces/personal";

@Injectable({
  providedIn: "root"
})
export class AdministradorService {
  bool: boolean;
  private url: string = BASE_API_URL + "/administrador";
  medOption: IOption[];
  //username: string = "adminq";
  //password: string = "admin";
  constructor(private http: HttpClient, private toastr: ToastrService) {}
  //Areas
  loadAreas(): Observable<any> {
    return this.http.get<any>(this.url + "/areas/", this.getHeader());
  }
  loadAreasPagination(pag: string): Observable<any> {
    return this.http.get<any>(pag);
  }
  loadAreasSP(): Observable<any> {
    return this.http.get<any>(this.url + "/areasSP/", this.getHeader());
  }
  searchArea(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/buscararea/?ar=" + id,
      this.getHeader()
    );
  }
  createArea(area: Area) {
    this.http
      .post<any>(
        this.url + "/areas/",
        {
          nombre: area.nombre
        },
        this.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("Area Creada correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Area");
        }
      );
  }

  //Especialidades
  loadEspecialidades(): Observable<any> {
    return this.http.get<any>(this.url + "/especialidad/", this.getHeader());
  }
  loadEspecialidadesPagination(pag: string): Observable<any> {
    return this.http.get<any>(pag);
  }
  loadEspecialidadesSP(): Observable<any> {
    return this.http.get<any>(this.url + "/especialidadSP/", this.getHeader());
  }
  searchEspecialidad(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/buscarespecialidad/?esp=" + id,
      this.getHeader()
    );
  }
  createEspecialidad(especialidad: Especialidad) {
    this.http
      .post<any>(
        this.url + "/especialidad/",
        {
          nombre: especialidad.nombre,
          descripcion: especialidad.descripcion
        },
        this.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("Especialidad Creada correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear la Especialidad");
        }
      );
  }
  //TipoPersonal
  loadTPersonal(): Observable<any> {
    return this.http.get<any>(this.url + "/tipo-personal/", this.getHeader());
  }
  loadTPersonalPagination(pag: string): Observable<any> {
    return this.http.get<any>(pag);
  }
  loadTPersonalSP(): Observable<any> {
    return this.http.get<any>(this.url + "/tipo-personalSP/", this.getHeader());
  }
  searchTPersonal(id: string): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/administrador/buscartipousuario/?tip=" + id,
      this.getHeader()
    );
  }
  createTPersonal(tipo: Tipopersonal) {
    this.http
      .post<any>(
        this.url + "/tipo-personal/",
        {
          nombre: tipo.nombre
        },
        this.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("Tipo personal Creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear el tipo personal");
        }
      );
  }
  //o gettoken, despues de implementarse en el login se cambiaran estos metodos
  getToken(user: string, pass: string) {
    return this.http.post<any>(BASE_API_URL + "/administrador/login/", {
      username: user,
      password: pass
    });
  }

  getHeader() {
    var headers_object = new HttpHeaders({
      Authorization: "token " + localStorage.getItem("token")
    });

    var httpOptions = {
      headers: headers_object
    };
    // console.log(
    //   "entro" + JSON.stringify(headers_object) + localStorage.getItem("token")
    // );
    return httpOptions;
  }
  // getHeader() {
  //   let token = new HttpHeaders({ "Content-Type": "application/json" });
  //   token = token.append(
  //     "Authorization",
  //     "Bearer" + localStorage.getItem("token")
  //   );
  //   console.log(
  //     "entro" + JSON.stringify(token) + " " + localStorage.getItem("token")
  //   );
  //   return token;
  // }
  // Personal
  loadPersonal(): Observable<any> {
    return this.http.get<any>(this.url + "/ver-personales/", this.getHeader());
  }
  loadPersonalPagination(url: string): Observable<personalLista> {
    return this.http.get<personalLista>(url, this.getHeader());
  }
  searchPersonal(id: string): Observable<any> {
    return this.http.get<any>(
      this.url + "/ver-personal/" + id + "/",
      this.getHeader()
    );
  }
  searchPersonalDNI(dni: string): Observable<any> {
    return this.http.get<any>(
      this.url + "/personaldni/" + dni + "/",
      this.getHeader()
    );
  }
  createPersonal(tipo: PersonalCreate) {
    // console.log(JSON.stringify(tipo));
    return this.http
      .post<any>(
        this.url + "/crear-personal/",
        {
          user: tipo.user,
          dni: tipo.dni,
          nombres: tipo.nombres,
          apellido_paterno: tipo.apellido_paterno,
          apellido_materno: tipo.apellido_materno,
          celular: tipo.celular,
          telefono: tipo.telefono,
          direccion: tipo.direccion,
          area: tipo.area,
          tipo_personal: tipo.tipo_personal,
          especialidad: tipo.especialidad
        },
        this.getHeader()
      );

  }
  updatePersonal(tipo: PersonalCreate) {
    console.log(JSON.stringify(tipo));
    return this.http
      .put<any>(
        this.url + "/ver-personal/" + tipo.user + "/",
        {
          usuarioId: tipo.user,
          areaId: tipo.area,
          tipo_personalId: tipo.tipo_personal,
          especialidadId: tipo.especialidad,
          dni: tipo.dni,
          nombres: tipo.nombres,
          apellido_paterno: tipo.apellido_paterno,
          apellido_materno: tipo.apellido_materno,
          celular: tipo.celular,
          telefono: tipo.telefono,
          direccion: tipo.direccion
        },
        this.getHeader()
      );
  }
  eliminarPers(id: string) {
    return this.http.delete<any>(
      this.url + "/ver-personal/" + id + "/",
      this.getHeader()
    );
  }
  //user
  loadUser(): Observable<any> {
    return this.http.get<any>(this.url + "/usuarios/", this.getHeader());
  }
  loadUserPagination(pag: string): Observable<any> {
    return this.http.get<any>(pag, this.getHeader());
  }
  loadUserSP(): Observable<any> {
    return this.http.get<any>(this.url + "/usuariosSP/", this.getHeader());
  }
  /***
   * autor: Milagros Motta R.
   * createTipoExamen: recibe un objeto de tipo Tipoexamen y asigna los valores de este a un json para que sea creado
   * en el back correctamente.
   ***/
  createTipoExamen(tipo:Tipoexamen){
    this.http
      .post<any>(
        BASE_API_URL + "/laboratorio/TipoExamen/",
        {
          nombre: tipo.nombre
        },
        this.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("Tipo de exámen creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear el tipo de exámen");
        }
      );
  }
  /***
   * autor: Milagros Motta R.
   * loadCitasMedico: recibe el id del medico
   ***/
  loadTipoExamen(): Observable<any> {
    return this.http.get<any>(
      BASE_API_URL + "/laboratorio/TipoExamen" ,this.getHeader()
    );
  }
}
