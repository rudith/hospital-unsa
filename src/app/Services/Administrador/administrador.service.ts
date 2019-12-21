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
import { personalLista } from "../../interfaces/personalLista";
import { Tipoexamen } from "../../interfaces/tipoexamen";
import { TipoExamenP } from "../../interfaces/tipoExamenP";

// BASE_API_URL
import { BASE_API_URL } from "../../config/API";
import { Personal } from '../../interfaces/personal';

@Injectable({
  providedIn: "root"
})
export class AdministradorService {
  bool: boolean;
  private url: string = "/administrador";
  medOption: IOption[];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

   /***
   * autor: Gerson Huarcaya
   * loadAreas: Servicio para cargar todas las areas con paginacion 
   ***/
  loadAreas(): Observable<any> {
    return this.http.get<any>(this.url + "/areas/", this.getHeader());
  }

  /***
   * autor: Gerson Huarcaya
   * loadAreasPagination: Servicio para cargar la paginacion 
   ***/
  loadAreasPagination(pag: string): Observable<any> {
    return this.http.get<any>(pag,this.getHeader());
  }

  /***
   * autor: Gerson Huarcaya
   * loadAreasSP: Servicio para cargar todas las areas sin paginacion 
   ***/ 
  loadAreasSP(): Observable<any> {
    return this.http.get<any>(this.url + "/areasSP/", this.getHeader());
  }

  /***
   * autor: Gerson Huarcaya
   * searchArea: Servicio para buscar areas por nombre
   ***/
  searchArea(id: string): Observable<any> {
    return this.http.get<any>(
      "/administrador/buscararea/?ar=" + id,
      this.getHeader()
    );
  }

  /***
   * autor: Gerson Huarcaya
   * createArea: Servicio para crear areas el cual recibe un objeto de tipo Area
   ***/
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
    return this.http.get<any>(pag,this.getHeader());
  }
  loadEspecialidadesSP(): Observable<any> {
    return this.http.get<any>(this.url + "/especialidadSP/", this.getHeader());
  }
  searchEspecialidad(id: string): Observable<any> {
    return this.http.get<any>(
      "/administrador/buscarespecialidad/?esp=" + id,
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
    return this.http.get<any>(pag,this.getHeader());
  }
  loadTPersonalSP(): Observable<any> {
    return this.http.get<any>(this.url + "/tipo-personalSP/", this.getHeader());
  }
  searchTPersonal(id: string): Observable<any> {
    return this.http.get<any>(
      "/administrador/buscartipousuario/?tip=" + id,
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
    return this.http.post<any>("/administrador/login/", {
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

  // Personal
  loadPersonal(): Observable<any> {
    return this.http.get<any>(this.url + "/ver-personales/", this.getHeader());
  }

  loadMedicos(): Observable<any> {
    return this.http.get<any>(this.url + "/ver-medicos/", this.getHeader());
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
  searchMedicoDNI(dni: string): Observable<any> {
    return this.http.get<any>(
      this.url + "/medicodni/" + dni + "/",
      this.getHeader()
    );
  }
  createPersonal(tipo: PersonalCreate) {
    console.log(tipo)
    return this.http
      .post<any>(
        this.url + "/crear-personal/",
        {
          user: tipo.id,
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

  createMedico(tipo: Personal) {
    return this.http
      .post<any>(
        this.url + "/crear-personal/",
        {
          dni: tipo.dni,
          nombres: tipo.nombres,
          apellido_paterno: tipo.apellido_paterno,
          apellido_materno: tipo.apellido_materno,
          especialidad: tipo.especialidad,
          estReg:tipo.estReg,
        },this.getHeader())
        .subscribe(
          data => {
            this.toastr.success("", "Medico Creado");
            console.log("medico creado completo");
          },
          error => {
            this.toastr.error("", "No se pudo crear medico");
            console.error(error);
          }
        );
    }

    updateMedico(tipo: PersonalCreate,a:number) {
      console.log(JSON.stringify(tipo));
      return this.http
        .put<any>(
          this.url + "/crear-personal/" + tipo.id + "/",
          {
            especialidad: tipo.especialidad,
            dni: tipo.dni,
            nombres: tipo.nombres,
            apellido_paterno: tipo.apellido_paterno,
            apellido_materno: tipo.apellido_materno,
            estReg:tipo.estReg,      
          },
          
          this.getHeader())
          .subscribe(
            data => {
              this.toastr.success("", "Médico Modificado");
              console.log("medico creado completo");
            },
            error => {
              this.toastr.error("", "No se pudo modificar medico");
              console.error(error);
            }
          );
    }
  updatePersonal(tipo: PersonalCreate) {
    console.log(JSON.stringify(tipo));
    return this.http
      .put<any>(
        this.url + "/crear-personal/" + tipo.id + "/",
        {
          usuarioId: tipo.id,
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
        "/laboratorio/TipoExamen/",
        {
          nombre: tipo.nombre
        },
        this.getHeader()
      )
      .subscribe(
        data => {
          this.toastr.success("Tipo de examen creado correctamente");
        },
        error => {
          console.log(error.message);
          this.toastr.error("No se pudo crear el tipo de exámen");
        }
      );
  }
  /***
   * autor: Milagros Motta R.
   * loadTipoExamen: recibe listado de tipo de examenes
   ***/
  loadTipoExamen(): Observable<any> {
    return this.http.get<any>(
      "/laboratorio/TipoExamen" ,this.getHeader()
    );
  }

  

  updateArea(dato: Area){
    this.http.put<Area>(this.url + "/areas/" + dato.id + "/", {
			nombre: dato.nombre
		}, this.getHeader())
			.subscribe(
				data => {
          console.log("ACTUALIZAR  ");
          this.toastr.success("Área actualizada con éxito");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});

  }

  updatePer(dato: Tipopersonal){
    this.http.put<Tipopersonal>(this.url + "/tipo-personal/" + dato.id + "/", {
			nombre: dato.nombre
		}, this.getHeader())
			.subscribe(
				data => {
          console.log("ACTUALIZAR  ");          
          this.toastr.success("Tipo de Personal actualizado con éxito");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});

  }

  

  updateEspecialidad(dato: Especialidad){
    this.http.put<Tipopersonal>(this.url + "/especialidad/" + dato.id + "/", {
      nombre: dato.nombre,
      descripcion: dato.descripcion 
		}, this.getHeader())
			.subscribe(
				data => {
          this.toastr.success("Especialidad actualizada con éxito");
				},
				error => {
					this.toastr.error(error);
					console.log(error);
				});

  }
  
  /***
   * autor: Milagros Motta R.
   * loadTipoExamenP: recibe listado de tipo de examenes paginados
   ***/
  loadTipoExamenP(): Observable<any> {
    return this.http.get<any>(
      "/laboratorio/TipoExamenPa" ,this.getHeader()
    );
  }

  /***
   * autor: Milagros Motta R.
   * loadTipoEPagination: recibe listado de tipo de examenes paginados a traves de a url ingresada 
   ***/
  loadTipoExamenPagination(url: string): Observable<TipoExamenP> {
    return this.http.get<TipoExamenP>(url, this.getHeader());
  }
  

  /***
   * autor: Milagros Motta R.
   * searchTipoExamen: recibe el nombre del tipo de examen para buscar
   ***/
  searchTipoExamen(name:string): Observable<any> {
    return this.http.get<any>(
      "/laboratorio/buscarTipoExamen/?tipo="+name,this.getHeader()
    );
  }

  /***
   * autor: Milagros Motta R.
   * searchTipoExamen: recibe el nombre del tipo de examen para buscar
   ***/
  updateTipo(tipo: Tipoexamen): Observable<Tipoexamen> {
    console.log(JSON.stringify(tipo));
    return this.http.put<any>(
      "/laboratorio/TipoExamen/" + tipo.id + "/",
      {
        id: tipo.id,
        nombre: tipo.nombre,
      }, this.getHeader()
);
  }






}
