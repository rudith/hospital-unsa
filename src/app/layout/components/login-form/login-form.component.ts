import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  iniciosesion(lg: FormGroup) {
    if (lg.get('login').value === "admin" && lg.get('pass').value === "admin") {
      this.http.admin = true;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.router.navigate(['/vertical/adminUser']);
    }
    if (lg.get('login').value === "admis" && lg.get('pass').value === "admis") {
      this.http.admin = false;
      this.http.admis = true;
      this.http.consultorio = false;
      this.http.triaje = false;
      this.router.navigate(['/vertical/historial']);
    }
    if (lg.get('login').value === "cons" && lg.get('pass').value === "cons") {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = true;
      this.http.triaje = false;
      this.router.navigate(['/vertical/consultas']);
    }
    if (lg.get('login').value === "triaje" && lg.get('pass').value === "triaje") {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = true;
      this.router.navigate(['/vertical/listar-datos']);
    }
    if (lg.get('login').value === "lab" && lg.get('pass').value === "lab") {
      this.http.admin = false;
      this.http.admis = false;
      this.http.consultorio = false;
      this.http.triaje = true;
      this.router.navigate(['/vertical/laboratorio']);
    }
  }
}
