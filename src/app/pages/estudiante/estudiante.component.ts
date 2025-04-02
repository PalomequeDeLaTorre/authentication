import { Component } from '@angular/core';
import { EstudianteService } from '../../services/estudiante.service';
import { CarreraService } from '../../services/carrera.service';
import { FormsModule } from '@angular/forms';
import { Estudiante, EstudianteWithCarrera } from '../../models/estudiante.models';
import { Carrera } from '../../models/carrera.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiante',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent {
  estudiantes: EstudianteWithCarrera[] = [];
  carreras: Carrera[] = [];
  estudiante: Partial<Estudiante> = {
    id: '',
    id_carrera: '',
    nombre: '',
    apellido: '',
    edad: '',
    email: ''
  };
  mostrarErrores = false;
  enModoEdicion = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  cargando = false;

  constructor(
    private estudianteService: EstudianteService,
    private carreraService: CarreraService
  ) {
    this.loadEstudiantes();
    this.loadCarreras();
  }

  loadEstudiantes(): void {
    this.cargando = true;
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.enrichEstudiantesWithCarreras();
        this.errorMessage = null;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
        this.errorMessage = 'Error al cargar los estudiantes. Intente recargar la página.';
        this.cargando = false;
      }
    });
  }

  loadCarreras(): void {
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
      }
    });
  }

  private enrichEstudiantesWithCarreras(): void {
    this.estudiantes.forEach(estudiante => {
      const carrera = this.carreras.find(c => c.id === estudiante.id_carrera);
      estudiante.nombreCarrera = carrera ? carrera.nombre : 'Carrera no encontrada';
    });
  }

  getNombreCarrera(idCarrera: string): string {
    const carrera = this.carreras.find(c => c.id === idCarrera);
    return carrera ? carrera.nombre : 'Carrera no encontrada';
  }

  async insertarEstudiante() {
    this.mostrarErrores = true;
    this.errorMessage = null;

    if (!this.isFormValid()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.estudiantes.some(e => e.id === this.estudiante.id)) {
      this.errorMessage = 'El ID del estudiante ya existe';
      return;
    }

    try {
      this.cargando = true;
      await this.estudianteService.agregarEstudiante(this.estudiante as Estudiante);
      this.successMessage = 'Estudiante agregado correctamente';
      this.loadEstudiantes();
      this.resetForm();
    } catch (error) {
      this.handleError(error, 'agregar');
    } finally {
      this.cargando = false;
    }
  }

  selectEstudiante(estudianteSeleccionado: EstudianteWithCarrera) {
    this.estudiante = { 
      ...estudianteSeleccionado,
      idOriginal: estudianteSeleccionado.id
    };
    this.enModoEdicion = true;
    this.clearMessages();
  }

  async updateEstudiante() {
    this.mostrarErrores = true;
    this.errorMessage = null;

    if (!this.isFormValid()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    // Validar si el ID fue modificado y ya existe
    if (this.estudiante.idOriginal && this.estudiante.idOriginal !== this.estudiante.id && 
      this.estudiantes.some(e => e.id === this.estudiante.id)) {
      this.errorMessage = 'El nuevo ID de estudiante ya existe';
      return;
    }

    try {
      this.cargando = true;
      await this.estudianteService.modificarEstudiante(this.estudiante as Estudiante);
      this.successMessage = 'Estudiante actualizado correctamente';
      this.loadEstudiantes();
      this.resetForm();
    } catch (error) {
      this.handleError(error, 'actualizar');
    } finally {
      this.cargando = false;
    }
  }

  async deleteEstudiante() {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      try {
        this.cargando = true;
        await this.estudianteService.eliminarEstudiante(this.estudiante as Estudiante);
        this.successMessage = 'Estudiante eliminado correctamente';
        this.loadEstudiantes();
        this.resetForm();
      } catch (error) {
        this.handleError(error, 'eliminar');
      } finally {
        this.cargando = false;
      }
    }
  }

  clearSelection() {
    this.resetForm();
  }

  private resetForm() {
    this.estudiante = {
      id: '',
      id_carrera: '',
      nombre: '',
      apellido: '',
      edad: '',
      email: ''
    };
    this.mostrarErrores = false;
    this.enModoEdicion = false;
    this.clearMessages();
  }

  private clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  private handleError(error: unknown, action: string) {
    console.error(`Error al ${action} estudiante:`, error);
    this.errorMessage = error instanceof Error ? error.message : `Error al ${action} el estudiante`;
  }

  isFormValid(): boolean {
    return !!this.estudiante.id?.trim() &&
           !!this.estudiante.id_carrera?.trim() &&
           !!this.estudiante.nombre?.trim() &&
           !!this.estudiante.apellido?.trim() &&
           !!this.estudiante.edad?.trim() &&
           !!this.estudiante.email?.trim();
  }
}