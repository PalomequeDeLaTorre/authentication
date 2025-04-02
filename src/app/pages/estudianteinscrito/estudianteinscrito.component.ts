import { Component, OnInit } from '@angular/core';
import { EstudianteinscritoService } from '../../services/estudianteinscrito.service';
import { CarreraService } from '../../services/carrera.service';
import { EstudianteinscritoWithCarrera } from '../../models/estudianteinscrito.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudianteinscrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estudianteinscrito.component.html',
  styleUrls: ['./estudianteinscrito.component.css']
})
export class EstudianteinscritoComponent implements OnInit {
  estudiantes: EstudianteinscritoWithCarrera[] = [];
  carreras: any[] = [];
  cargando = true;
  errorMessage: string | null = null;

  constructor(
    private estudianteService: EstudianteinscritoService,
    private carreraService: CarreraService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.cargarCarreras();
  }

  cargarEstudiantes(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.enriquecerConCarreras();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.errorMessage = 'Error al cargar los estudiantes. Intente recargar la página.';
        this.cargando = false;
      }
    });
  }

  cargarCarreras(): void {
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        this.enriquecerConCarreras();
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
      }
    });
  }

  private enriquecerConCarreras(): void {
    if (this.estudiantes.length > 0 && this.carreras.length > 0) {
      this.estudiantes.forEach(estudiante => {
        const carrera = this.carreras.find(c => c.id === estudiante.id_carrera);
        estudiante.nombreCarrera = carrera ? carrera.nombre : 'Carrera no encontrada';
      });
    }
  }

  getNombreCarrera(idCarrera: string): string {
    const carrera = this.carreras.find(c => c.id === idCarrera);
    return carrera ? carrera.nombre : 'Carrera no encontrada';
  }
}