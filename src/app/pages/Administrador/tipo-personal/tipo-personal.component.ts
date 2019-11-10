import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { Component, OnInit } from "@angular/core";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { Tipopersonal } from "../../../interfaces/tipopersonal";
// import { ConfirmationService } from 'primeng/api';
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../services/http/http.service";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-tipo-personal",
  templateUrl: "./tipo-personal.component.html",
  styleUrls: ["./tipo-personal.component.scss"]
})
export class TipoPersonalComponent extends BasePageComponent implements OnInit {
  data: any = <any>{};
  pageNum: number;
  id: string;
  tipopersonal: Tipopersonal[];
  appointmentForm: FormGroup;
  constructor(
    httpSv: HttpService,
    private admService: AdministradorService,
    private toastr: ToastrService,
    store: Store<IAppState>,
    private modal: TCModalService,
    private formBuilder: FormBuilder
  ) // private conf: ConfirmationService
  {
    super(store, httpSv);
    this.pageData = {
      title: "Tipo Personal",
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
          title: "Areas"
        },
        {
          title: "Search"
        }
      ]
    };
    this.pageNum = 1;
    this.loadTipopersonal();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.select("Tipopersonal").subscribe(tipopersonal => {
      if (tipopersonal && tipopersonal.length) {
        this.tipopersonal = tipopersonal;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
  }
  //Paginacion
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.admService
        .loadTPersonalPagination(this.data.next)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.tipopersonal = this.data.results;
        });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.admService
        .loadTPersonalPagination(this.data.previous)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.tipopersonal = this.data.results;
        });
    }
  }
  //carga lisata de tipos
  loadTipopersonal() {
    this.admService.loadTPersonal().subscribe(tipopersonal => {
      this.data = tipopersonal;
      this.tipopersonal = tipopersonal.results;
    });
  }
  //busca segun el input y devuelve un mensaje de confirmación
  buscar() {
    if (this.id == "" || this.id == undefined) {
      this.loadTipopersonal();
      this.toastr.warning("Todas los Tipos cargados", "Ningun valor ingresado");
    } else {
      this.admService.searchTPersonal(this.id).subscribe(
        area => {
          this.tipopersonal = [];
          this.tipopersonal = area;
          this.toastr.info("Tipos de usuarios con: "+this.id,"Buscando...");
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
    this.loadTipopersonal();
  }
  //inicia Formulario
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      nombre: ["", Validators.required]
    });
  }

  // Agrega un tipo a la bd
  addAppointment(form: FormGroup) {
    // console.log(JSON.stringify(form));
    if (form.valid) {
      let newAppointment: Tipopersonal = form.value;
      // console.log(JSON.stringify(newAppointment));
      this.admService.createTPersonal(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
      this.loadTipopersonal();
    }
  }
}
