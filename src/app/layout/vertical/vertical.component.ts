import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { IAppState } from "../../interfaces/app-state";
import { BaseLayoutComponent } from "../base-layout/base-layout.component";
import { HttpService } from "../../services/http/http.service";
import { TCModalService } from "../../ui/services/modal/modal.service";
import * as SettingsActions from "../../store/actions/app-settings.actions";
import { AdministradorService } from "../../Services/Administrador/administrador.service";

@Component({
  selector: "vertical-layout",
  templateUrl: "./vertical.component.html",
  styleUrls: [
    "../base-layout/base-layout.component.scss",
    "./vertical.component.scss"
  ]
})
export class VerticalLayoutComponent extends BaseLayoutComponent
  implements OnInit {
  url: string;
  constructor(
    private http: HttpClient,
    store: Store<IAppState>,
    fb: FormBuilder,
    httpSv: HttpService,
    router: Router,
    elRef: ElementRef,

    private modal: TCModalService,
    private admService: AdministradorService
  ) {
    super(store, fb, httpSv, router, elRef);
    this.setUrl();
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.dispatch(new SettingsActions.Update({ layout: "vertical" }));
  }
  setUrl() {
    if (localStorage.getItem("menu")=="admin") {
      this.url = "assets/data/menu-admision4.json";
    }
    if (localStorage.getItem("menu")=="admision") {
      this.url = "assets/data/menu-admision1.json";
    }
    if (localStorage.getItem("menu")=="consultorio") {
      this.url = "assets/data/menu-admision3.json";
    }
    if (localStorage.getItem("menu")=="triaje") {
      this.url = "assets/data/menu-admision2.json";
    }
    if (localStorage.getItem("menu")=="laboratorio") {
      this.url = "assets/data/menu-admision5.json";
    }
    console.log("menu cargando" + this.url);
  }
}
