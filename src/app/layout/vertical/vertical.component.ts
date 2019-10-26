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
import { AdministradorService } from "../../services/Administrador/administrador.service";

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
    this.admService.getToken().subscribe(data => {
      localStorage.setItem("token", data.token);
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.dispatch(new SettingsActions.Update({ layout: "vertical" }));
  }
}
