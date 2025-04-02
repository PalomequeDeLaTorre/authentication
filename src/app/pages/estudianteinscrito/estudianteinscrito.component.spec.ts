import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteinscritoComponent } from './estudianteinscrito.component';

describe('EstudianteinscritoComponent', () => {
  let component: EstudianteinscritoComponent;
  let fixture: ComponentFixture<EstudianteinscritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteinscritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudianteinscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
