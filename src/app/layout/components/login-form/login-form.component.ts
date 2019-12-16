import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpService } from "../../../services/http/http.service";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { LaboratorioService } from "../../../Services/Laboratorio/laboratorio.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder,
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
    labSV.loadOrdenPagadas();
    labSV.loadOrdenCreadas();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ["", Validators.required],
      pass: ["", Validators.required]
    });
  }

  iniciosesion(lg: FormGroup) {
    this.adminSV
      .getToken(lg.get("login").value, lg.get("pass").value)
      .subscribe(
        data => {
          localStorage.setItem("token", data.token);
          if (data.tipoUser == "Administrador") {
            localStorage.setItem("menu", "admin");
            this.toastr.info(data.username, "Bienvenido");
            this.router.navigate(["/vertical/personalAdm"]);
          }
          if (data.tipoUser == "Admision" || data.tipoUser == "Admisión") {
            localStorage.setItem("menu", "admision");
            this.toastr.info(data.username, "Bienvenido");
            this.router.navigate(["/vertical/historial"]);
          }
          if (data.tipoUser == "Consultorio" || data.tipoUser == "Medico" || data.tipoUser == "Médico") {
            localStorage.setItem("menu", "consultorio");
            console.log("Entro consultorio " + data.personal_id)
            this.http.setIdMedico(data.personal_id);
            this.toastr.info(data.username, "Bienvenido");
            this.router.navigate(["/vertical/consultas"]);
          }
          if (data.tipoUser == "Triaje") {
            localStorage.setItem("menu", "triaje");
            this.http.setIdUs(data.personal_id);
            this.toastr.info(data.username, "Bienvenido");
            this.router.navigate(["/vertical/listar-datos"]);
          }

          if (data.tipoUser == "Laboratorio") {
            localStorage.setItem("menu", "laboratorio");
            console.log("Entro lab " + data.personal_id)
            this.http.setIdUs(data.personal_id);
            this.toastr.info(data.username, "Bienvenido");
            this.router.navigate(["/vertical/ordenes"]);
          }
          if (data.tipoUser != "Laboratorio" && data.tipoUser != "Triaje" && data.tipoUser != "Consultorio" && data.tipoUser != "Medico" && data.tipoUser != "Administrador" && data.tipoUser != "Admision") {
            this.toastr.error("Usuario:" + lg.get("login").value, "Usuario no registrado");
          }

          console.log(data.tipoUser);
        },
        error => {
          this.toastr.error("Usuario no registrado");
        }
      );
  }
}
