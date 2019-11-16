import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCitasComponent } from './historial-citas.component';

describe('HistorialCitasComponent', () => {
  let component: HistorialCitasComponent;
  let fixture: ComponentFixture<HistorialCitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialCitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
