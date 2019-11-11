import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../../services/http/http.service";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
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
    private adminSV: AdministradorService
  ) {
    http.loadCitas();
    http.loadHistorias();
    http.loadDepartamento();
    adminSV.loadAreas();
    adminSV.loadEspecialidades();
    adminSV.loadPersonal();
    adminSV.loadUser();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      pass: ["", Validators.required]
    });
  }

  iniciosesion(lg: FormGroup) {
    /*
    if (lg.get("login").value === "adminq" && lg.get("pass").value === "admin") {
      this.http.admin = true;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.http.laboratorio = false;
      this.router.navigate(["/vertical/adminUser"]);
    }
    if (lg.get("login").value === "admis" && lg.get("pass").value === "admis") {
      this.http.admin = false;
      this.http.admis = true;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.http.laboratorio = false;
      this.router.navigate(["/vertical/historial"]);
    }
    if (lg.get("login").value === "cons" && lg.get("pass").value === "cons") {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = true;
      this.http.triaje = false;
      this.http.laboratorio = false;
      this.router.navigate(["/vertical/consultas"]);
    }
    if (
      lg.get("login").value === "triaje" &&
      lg.get("pass").value === "triaje"
    ) {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = true;
      this.http.laboratorio = false;
      this.router.navigate(["/vertical/listar-datos"]);
    }
    if (lg.get("login").value === "lab" && lg.get("pass").value === "lab") {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.http.laboratorio = true;
      this.router.navigate(["/vertical/laboratorio"]);
    }
    */

    this.adminSV.getToken(lg.get("login").value,lg.get("pass").value).subscribe(data => {
      //this.toastr.info("Usuario:" + lg.get("login").value, "Bienvenido");
      localStorage.setItem("token", data.token);
      if(data.tipoUser=="Administrador"){
        this.http.admin = true;
        this.http.admis = false;
        this.http.consultorio = false;
        this.http.triaje = false;
        this.http.laboratorio = false;
        this.router.navigate(["/vertical/adminUser"]);
      }
      if(data.tipoUser=="Admision"){
        this.http.admin = false;
        this.http.admis = true;
        this.http.consultorio = false;
        this.http.triaje = false;
        this.http.laboratorio = false;
        this.router.navigate(["/vertical/historial"]);
      }
      if(data.tipoUser=="Medico"){
        this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = true;
      this.http.triaje = false;
      this.http.laboratorio = false;
      this.router.navigate(["/vertical/consultas"]);
      }
      if(data.tipoUser=="Triaje"){
        this.http.admin = false;
        this.http.admis = false;
        this.http.consultorio = false;
        this.http.triaje = true;
        this.http.laboratorio = false;
        this.router.navigate(["/vertical/listar-datos"]);
      }
      if(data.tipoUser=="Laboratorio"){
        this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.http.laboratorio = true;
      this.router.navigate(["/vertical/ordenes"]);
      }
      console.log(data.tipoUser)
    });
  }
}
