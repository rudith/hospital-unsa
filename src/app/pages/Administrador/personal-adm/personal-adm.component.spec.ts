import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAdmComponent } from './personal-adm.component';

describe('PersonalAdmComponent', () => {
  let component: PersonalAdmComponent;
  let fixture: ComponentFixture<PersonalAdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
