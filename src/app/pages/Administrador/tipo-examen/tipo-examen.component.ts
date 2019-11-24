import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { Component, OnInit } from "@angular/core";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../services/http/http.service";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Tipoexamen } from "../../../interfaces/tipoexamen";
import { HostListener } from '@angular/core'; 
@Component({
  selector: 'app-tipo-examen',
  templateUrl: './tipo-examen.component.html',
  styleUrls: ['./tipo-examen.component.scss']
})
export class TipoExamenComponent extends BasePageComponent implements OnInit {
  data: any = <any>{};
  pageNum: number;
  id: string;
  tipoExamen: Tipoexamen[];
  TipoExamenForm: FormGroup;
  constructor(
    httpSv: HttpService,
    private admService: AdministradorService,
    private toastr: ToastrService,
    store: Store<IAppState>,
    private modal: TCModalService,
    private formBuilder: FormBuilder // private conf: ConfirmationService
  ) {
    super(store, httpSv);
    this.pageData = {
      title: "Tipo de Exámenes",
      loaded: true,
      breadcrumbs: [
        {
          title: "UI Kit",
          route: "default-dashboard"
        },
        {
          title: "Tables",
          route: "default-dashboard"
        },
        {
          title: "Tipo de Exámenes"
        },
        {
          title: "Search"
        }
      ]
    };
    this.pageNum = 1;
    this.loadTipoExamen();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.select("tipoExamen").subscribe(tipoExamen => {
      if (tipoExamen && tipoExamen.length) {
        this.tipoExamen = tipoExamen;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }
  /*Paginacion
  public nextPage() {
    console.log(JSON.stringify(this.data));
    if (this.data.next) {
      this.pageNum++;
      this.admService
        .loadTipoExamenPagination(this.data.next)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.tipoExamen = this.data.results;
        });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.admService
        .loadTipoExamenPagination(this.data.previous)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.tipoExamen = this.data.results;
        });
    }
  }
  //carga tipoExamen*/
  loadTipoExamen() {
    this.admService.loadTipoExamen().subscribe(tipoExamen => {
      console.log(tipoExamen);
      this.data=tipoExamen; 
      this.tipoExamen = tipoExamen;
    });
  }
  /*buscara segun el campo de texto y devuelve un mensaje de confirmación
  buscar() {
    if (this.id == "" || this.id == undefined) {
      this.loadTipoExamen();
      this.toastr.warning(
        "Todas las Tipo de Exámen cargadas",
        "Ningun valor ingresado"
      );
    } else {
      this.admService.searchTipoExamen(this.id).subscribe(
        TipoExamen => {
          this.tipoExamen = [];
          this.tipoExamen = TipoExamen;
          this.toastr.info("Tipo de Exámen con: "+this.id,"Buscando...");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }*/
  //abre modal
  openModal<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null
  ) {
    this.initForm();
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }
  //cierra modal
  closeModal() {
    this.modal.close();
    this.loadTipoExamen();
  }
  //inicia formulario
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.TipoExamenForm = this.formBuilder.group({
      nombre: ["", Validators.required]
    });
  }
  // crea TipoExamen y devuelve un mensaje de confirmación
  agregarTipoExamen(form: FormGroup) {
    // console.log(JSON.stringify(form));
    if (form.valid) {
      let newTypeE: Tipoexamen = form.value;
      console.log(JSON.stringify(newTypeE));
      this.admService.createTipoExamen(newTypeE);
      this.closeModal();
      this.TipoExamenForm.reset();
      this.loadTipoExamen();
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
      this.closeModal();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }
}
