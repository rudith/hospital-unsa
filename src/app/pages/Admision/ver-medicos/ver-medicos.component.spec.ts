import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMedicosComponent } from './ver-medicos.component';

describe('VerMedicosComponent', () => {
  let component: VerMedicosComponent;
  let fixture: ComponentFixture<VerMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
