import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPersonalComponent } from './tipo-personal.component';

describe('TipoPersonalComponent', () => {
  let component: TipoPersonalComponent;
  let fixture: ComponentFixture<TipoPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
