import { BasePageComponent } from "../../base-page";
import { Store } from "@ngrx/store";
import { IAppState } from "../../../interfaces/app-state";
import { Component, OnInit } from "@angular/core";
import { AdministradorService } from "../../../services/Administrador/administrador.service";
import { Area } from "../../../interfaces/area";
// import { ConfirmationService } from 'primeng/api';
import { ToastrService } from "ngx-toastr";
import { HttpService } from "../../../services/http/http.service";
import { Content } from "../../../ui/interfaces/modal";
import { TCModalService } from "../../../ui/services/modal/modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HostListener } from '@angular/core'; 
import { formatDate, LocationStrategy } from '@angular/common';


@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"]
  // providers: [ConfirmationService]
})
export class AreaComponent extends BasePageComponent implements OnInit {
  id: string;
  data: any = <any>{};
  pageNum: number;
  areas: Area[];
  area:Area;
  appointmentForm: FormGroup;
  areaEdit:FormGroup;
  constructor(
    private location: LocationStrategy,
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
      title: "ÁREAS",
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
    this.loadAreas();
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.select("areas").subscribe(areas => {
      if (areas && areas.length) {
        this.areas = areas;
        !this.pageData.loaded ? this.setLoaded() : null;
      }
    });
    this.preventBackButton();
  }
  //Paginacion
  public nextPage() {
    if (this.data.next) {
      this.pageNum++;
      this.admService
        .loadAreasPagination(this.data.next)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.areas = this.data.results;
        });
    }
  }

  public prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.admService
        .loadAreasPagination(this.data.previous)
        .subscribe(personalLista => {
          this.data = personalLista;
          this.areas = this.data.results;
        });
    }
  }
  // carga areas
  loadAreas() {
    this.admService.loadAreas().subscribe(areas => {
      this.data=areas;
      this.areas = areas.results;
    });
  }
  //busca segun el input y devuelve un mensaje de confirmación
  buscar() {
    if (this.id == "" || this.id == undefined) {
      this.loadAreas();
      this.toastr.warning("Todas las áreas cargadas", "Ningún valor ingresado");
    } else {
      this.admService.searchArea(this.id).subscribe(
        area => {
          this.areas = [];
          this.areas = area;
          this.toastr.info("Areas con: "+this.id,"Buscando...");
        },
        error => {
          this.toastr.warning("No encontrado");
        }
      );
    }
  }
  // abre modal
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

  // cierra modal
  closeModal() {
    this.modal.close();
    this.loadAreas();
  }

  //inicia formulario
  initForm() {
    // this.user.BirthdayDate = this.datePipe.transform(this.user.BirthdayDate, 'dd-MM-yyyy');
    this.appointmentForm = this.formBuilder.group({
      nombre: ["", Validators.required]
    });
  }
  //agrega area a la bd
  addAppointment(form: FormGroup) {
    // console.log(JSON.stringify(form));
    if (form.valid) {
      let newAppointment: Area = form.value;
      // console.log(JSON.stringify(newAppointment));
      this.admService.createArea(newAppointment);
      this.closeModal();
      this.appointmentForm.reset();
      this.loadAreas();
    }
  }

  openModalVerMas<T>(body: Content<T>, header: Content<T> = null, footer: Content<T> = null, row: Area) {
		this.initAreaForm(row);
		this.modal.open({
			body: body,
			header: header,
			footer: footer,
			options: null
		});
  }
  initAreaForm(data: Area) {
		this.areaEdit = this.formBuilder.group({
      nombre: [data.nombre ? data.nombre : '', Validators.required],
      id: [data.id ? data.id : '', Validators.required],
		});
  }

  updateArea(form:FormGroup){
		if(form.valid){
			let newcab: Area=form.value;
			newcab.nombre=form.value.nombre;
      this.admService.updateArea(newcab);
      this.loadAreas();
      this.closeModalH();
    }
  }	
		
  closeModalH() {
		this.modal.close();
	}


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) { 
    if (event.key === "Escape") { 
      this.closeModal();
    }
    if (event.key === "Enter") { 
      return false;
    }
  }
  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
      this.closeModal();
    });
  }
}
