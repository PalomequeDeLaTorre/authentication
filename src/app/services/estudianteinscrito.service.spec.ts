import { TestBed } from '@angular/core/testing';

import { EstudianteinscritoService } from './estudianteinscrito.service';

describe('EstudianteinscritoService', () => {
  let service: EstudianteinscritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstudianteinscritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
