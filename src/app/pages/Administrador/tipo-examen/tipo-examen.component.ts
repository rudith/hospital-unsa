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
import { TipoExamenP } from "../../../interfaces/tipoExamenP";
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-tipo-examen',
  templateUrl: './tipo-examen.component.html',
  styleUrls: ['./tipo-examen.component.scss']
})
export class TipoExamenComponent extends BasePageComponent implements OnInit {
  data: TipoExamenP = <TipoExamenP>{};
  pageNum: number;
  nameTipo: string;
  tipo: Tipoexamen;
  update: boolean;
  tipoExamen: Tipoexamen[];
  TipoExamenForm: FormGroup;
  TipoExamenEditForm: FormGroup;
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

  public nextPage() {
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

  /*** 
	 * autor: Milagros Motta R.
	 * loadTipoExamen: Carga lo datos de los tipos de examen haciendo una llamata al servicio
	***/
  loadTipoExamen() {
    this.admService.loadTipoExamenP().subscribe(tipoExamen => {
      this.data = tipoExamen;
      this.tipoExamen = tipoExamen.results;

    });
  }
  /*** 
	 * autor: Milagros Motta R.
	 * buscarTipoE: Carga lo datos del paciente haciendo una llamata al servicio
	***/
  buscarTipoE() {
    if (this.nameTipo == "" || this.nameTipo == undefined) {
      this.loadTipoExamen();
      this.toastr.warning(
        "Todos los Tipos de Examen cargadas",
        "Ningun valor ingresado"
      );
    } else {
      this.admService.searchTipoExamen(this.nameTipo).subscribe(
        TipoExamen => {
          this.tipoExamen = [];
          this.tipoExamen = TipoExamen;
          this.toastr.info("Tipo de Examen con: " + this.nameTipo, "Buscando...");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
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
    if (form.valid) {
      let newTypeE: Tipoexamen = form.value;
      if (this.update) {
        newTypeE.id = this.tipo.id;
        this.updateTipo(newTypeE);
      } else {
        this.admService.createTipoExamen(newTypeE);
        this.closeModal();
        this.TipoExamenForm.reset();
        this.loadTipoExamen();
      }
    }
  }
  //editar tipo de Examen
  /***
   * autor: Milagros Motta R.
   * openModalEdit: Abre Modal para modificar el tipo de examen 
   ***/
  openModalEdit<T>(
    body: Content<T>,
    header: Content<T> = null,
    footer: Content<T> = null,
    row: Tipoexamen
  ) {
    this.initFormEdit(row);
    this.modal.open({
      body: body,
      header: header,
      footer: footer,
      options: null
    });
  }

  /***
   * autor: Milagros Motta R.
   * initFormEdit: Inicializa el formulario para modificar usuario
   ***/
  initFormEdit(data: Tipoexamen) {
    this.TipoExamenEditForm = this.formBuilder.group({
      nombre: [data.nombre, Validators.required]
    });
  }

  /***
   * autor: Milagros Motta R.
   * closeModalPersonal:Cierra el Modal
   ***/
  closeModalE() {
    this.modal.close();
    this.TipoExamenEditForm.reset();
  }
  /***
   * autor: Milagros Motta R.
   * updateEst:Actualizar el estado
   ***/
  updateEst(bool: boolean) {
    this.update = bool;
    console.log(this.update);
  }

  /***
   * autor: Milagros Motta R.
   * sendUser:guarda el usuario para edicion
   ***/
  sendTipo(tipo: Tipoexamen) {
    this.tipo = tipo;
  }

  /***
   * autor: Milagros Motta R.
   * updateUser:actualiza usuario y devuelve un mensaje de confirmación
   ***/

  updateTipo(tipo: Tipoexamen) {
    this.admService.updateTipo(tipo).subscribe(data => {
      this.toastr.success("Tipo de Examen Actualizado");
      this.loadTipoExamen();
      this.closeModal();
    });
  }

  //close Edit


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.closeModal();
    }
    if (event.key === "Enter") {
      return false;
    }
  }
}
