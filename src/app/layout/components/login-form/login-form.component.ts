import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../../services/http/http.service";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import {LaboratorioService} from "../../../Services/Laboratorio/laboratorio.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpService,
    private toastr: ToastrService,
    private adminSV: AdministradorService,
    private labSV: LaboratorioService
  ) {
    http.loadCitas();
    http.loadHistorias();
    http.loadDepartamento();
    adminSV.loadAreas();
    adminSV.loadEspecialidades();
    adminSV.loadPersonal();
    adminSV.loadUser();
    labSV.loadExamen();
    labSV.loadOrden();
    http.cancelarCitasPasadas().subscribe(
      data => {
        http.loadCitas();
      });
   

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      pass: ["", Validators.required]
    });
  }

  iniciosesion(lg: FormGroup) {
   //usar el servicio debusqueda y compararlo con el area 
    this.adminSV.getToken(lg.get("login").value,lg.get("pass").value).subscribe(data => {
      //this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
      localStorage.setItem("token", data.token);
      if(data.tipoUser=="Administrador"){
        this.http.admin = true;
        this.http.admis = false;
        this.http.consultorio = false;
        this.http.triaje = false;
        this.http.laboratorio = false;
        this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
        this.router.navigate(["/vertical/personalAdm"]);
        
      }
      if(data.tipoUser=="Admision"){
        this.http.admin = false;
        this.http.admis = true;
        this.http.consultorio = false;
        this.http.triaje = false;
        this.http.laboratorio = false;
        this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
        this.router.navigate(["/vertical/historial"]);
      }
      if(data.tipoUser=="Consultorio" || data.tipoUser=="Medico"){
        this.http.admin = false;
        this.http.admis = false;
        this.http.consultorio = true;
        this.http.triaje = false;
        this.http.laboratorio = false;
        this.http.setIdMedico(data.id);
        this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
        this.router.navigate(["/vertical/consultas"]);
      }
     if(data.tipoUser=="Triaje"){
        this.http.admin = false;
        this.http.admis = false;
        this.http.consultorio = false;
        this.http.triaje = true;
        this.http.laboratorio = false;
        this.http.setIdUs(data.id);
        this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
        this.router.navigate(["/vertical/listar-datos"]);
      }
      
     if(data.tipoUser=="Laboratorio"){
        this.http.admin = false;
        this.http.admis = false;
        this.http.consultorio = false;
        this.http.triaje = false;
        this.http.laboratorio = true;
        this.http.setIdUs(data.id);
        console.log(data.id);
        this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
        this.router.navigate(["/vertical/ordenes"]);
      }
      if(data.tipoUser!="Laboratorio" && data.tipoUser!="Triaje" && data.tipoUser!="Consultorio" && data.tipoUser!="Medico" && data.tipoUser!="Administrador" && data.tipoUser!="Admision" ){
        this.toastr.error("Usuario:" + lg.get("login").value, "Usuario no registrado");
      }
    
      console.log(data.tipoUser)
    },
    error=>{
      this.toastr.error("Usuario no registrado");

    });
  }
}
