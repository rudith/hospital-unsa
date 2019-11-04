import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexionLaboratorioComponent } from './conexion-laboratorio.component';

describe('ConexionLaboratorioComponent', () => {
  let component: ConexionLaboratorioComponent;
  let fixture: ComponentFixture<ConexionLaboratorioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConexionLaboratorioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConexionLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
