import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoExamenComponent } from './tipo-examen.component';

describe('TipoExamenComponent', () => {
  let component: TipoExamenComponent;
  let fixture: ComponentFixture<TipoExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
