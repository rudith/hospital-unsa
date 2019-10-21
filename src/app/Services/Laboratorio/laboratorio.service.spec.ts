import { TestBed } from '@angular/core/testing';

import { LaboratorioService } from './laboratorio.service';

describe('LaboratorioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaboratorioService = TestBed.get(LaboratorioService);
    expect(service).toBeTruthy();
  });
});
