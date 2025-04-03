import { Component } from '@angular/core';
import { CarreraService } from '../../services/carrera.service';
import { FormsModule } from '@angular/forms';
import { Carrera } from '../../models/carrera.models';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-carrera',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {
  carreras: Carrera[] = [];
  carrera: Partial<Carrera> = {
    id: '',
    idOriginal: '',
    facultad: '',
    nombre: '',
    duracion: ''
  };
  mostrarErrores = false;
  enModoEdicion = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  cargando = false;
  estaAutenticado = false; 

  constructor(private carreraService: CarreraService, private authService: AuthService) {
    this.loadCarreras();
    this.verificarAutenticacion();
  }

  private verificarAutenticacion() {
    this.authService.user$.subscribe(user => {
      this.estaAutenticado = !!user;
    });
  }

  loadCarreras(): void {
    this.cargando = true;
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        this.errorMessage = null;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.errorMessage = 'Error al cargar las carreras. Intente recargar la página.';
        this.cargando = false;
      }
    });
  }


  isValidIdFormat(): boolean {
    return /^\d+$/.test(this.carrera.id || '');
  }

  isValidIdValue(): boolean {
    if (!this.isValidIdFormat()) return false;
    return parseInt(this.carrera.id || '0') > 0;
  }

  isIdValid(): boolean {
    return this.isValidIdFormat() && this.isValidIdValue();
  }
  

  async insertarCarrera() {
    this.mostrarErrores = true;
    this.errorMessage = null;

    if (!this.isValidIdFormat()) {
      this.errorMessage = 'El ID solo puede contener números';
      return;
    }

    if (!this.isValidIdValue()) {
      this.errorMessage = 'El ID debe ser un número mayor a 0';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.carreras.some(c => c.id === this.carrera.id)) {
      this.errorMessage = 'El ID de la carrera ya existe';
      return;
    }

    try {
      this.cargando = true;
      await this.carreraService.agregarCarrera(this.carrera as Carrera);
      this.successMessage = 'Carrera agregada correctamente';
      this.loadCarreras();
      this.resetForm();
    } catch (error) {
      this.handleError(error, 'agregar');
    } finally {
      this.cargando = false;
    }
  }

  selectCarrera(carreraSeleccionada: Carrera) {
    this.carrera = { 
      ...carreraSeleccionada,
      idOriginal: carreraSeleccionada.id
    };
    this.enModoEdicion = true;
    this.clearMessages();
  }

  async updateCarrera() {
    this.mostrarErrores = true;
    this.errorMessage = null;

    if (!this.isValidIdFormat()) {
      this.errorMessage = 'El ID solo puede contener números';
      return;
    }

    if (!this.isValidIdValue()) {
      this.errorMessage = 'El ID debe ser un número mayor a 0';
      return;
    }

    if (!this.isFormValid()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.carrera.idOriginal !== this.carrera.id && 
        this.carreras.some(c => c.id === this.carrera.id)) {
      this.errorMessage = 'El nuevo ID de carrera ya existe';
      return;
    }

    try {
      this.cargando = true;
      await this.carreraService.modificarCarrera(this.carrera as Carrera);
      this.successMessage = 'Carrera actualizada correctamente';
      this.loadCarreras();
      this.resetForm();
    } catch (error) {
      this.handleError(error, 'actualizar');
    } finally {
      this.cargando = false;
    }
  }

  async deleteCarrera() {
    if (confirm('¿Está seguro de eliminar esta carrera?')) {
      try {
        this.cargando = true;
        await this.carreraService.eliminarCarrera(this.carrera as Carrera);
        this.successMessage = 'Carrera eliminada correctamente';
        this.loadCarreras();
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
    this.carrera = {
      id: '',
      idOriginal: '',
      facultad: '',
      nombre: '',
      duracion: ''
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
    console.error(`Error al ${action} carrera:`, error);
    this.errorMessage = error instanceof Error ? error.message : `Error al ${action} la carrera`;
  }
  
  isFormValid(): boolean {
    return !!this.carrera.id?.trim() &&
           !!this.carrera.nombre?.trim() &&
           !!this.carrera.facultad?.trim() &&
           !!this.carrera.duracion?.trim();
  }
}