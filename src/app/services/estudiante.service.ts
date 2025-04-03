import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  deleteDoc, 
  doc, 
  updateDoc, 
  setDoc,
  collection
} from '@angular/fire/firestore';
import { Observable, first } from 'rxjs';
import { Estudiante } from '../models/estudiante.models';
import { CarreraService } from './carrera.service';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private firestore: Firestore = inject(Firestore);
  private estudiantesCollection = collection(this.firestore, 'estudiantes');

  constructor(private carreraService: CarreraService) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return collectionData(this.estudiantesCollection, { idField: 'id' }).pipe(
      first()
    ) as Observable<Estudiante[]>;
  }

  async agregarEstudiante(estudiante: Estudiante): Promise<void> {
    try {
      const estudianteDoc = doc(this.firestore, `estudiantes/${estudiante.id}`);
      await setDoc(estudianteDoc, {
        id_carrera: estudiante.id_carrera,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        edad: estudiante.edad,
        email: estudiante.email
      });
    } catch (error) {
      console.error('Error Firestore al agregar estudiante:', error);
      throw new Error('Error al guardar el estudiante. Verifica los datos.');
    }
  }

  async modificarEstudiante(estudiante: Estudiante): Promise<void> {
    try {

      if (estudiante.idOriginal && estudiante.idOriginal !== estudiante.id) {

      const nuevoDoc = doc(this.firestore, `estudiantes/${estudiante.id}`);
      await setDoc(nuevoDoc, {
        id_carrera: estudiante.id_carrera,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        edad: estudiante.edad,
        email: estudiante.email
      });

        const viejoDoc = doc(this.firestore, `estudiantes/${estudiante.idOriginal}`);
        await deleteDoc(viejoDoc);
      } else {
     
        const estudianteDoc = doc(this.firestore, `estudiantes/${estudiante.id}`);
        await updateDoc(estudianteDoc, {
          id_carrera: estudiante.id_carrera,
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          edad: estudiante.edad,
          email: estudiante.email
        });
      }
    } catch (error) {
      console.error('Error Firestore al modificar estudiante:', error);
      throw new Error('Error al actualizar el estudiante.');
    }
  }

  async eliminarEstudiante(estudiante: Estudiante): Promise<void> {
    try {
      const estudianteDoc = doc(this.firestore, `estudiantes/${estudiante.id}`);
      await deleteDoc(estudianteDoc);
    } catch (error) {
      console.error('Error Firestore al eliminar estudiante:', error);
      throw new Error('Error al eliminar el estudiante.');
    }
  }
}