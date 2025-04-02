import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  deleteDoc, 
  doc, 
  updateDoc, 
  setDoc
} from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable, first, map } from 'rxjs';
import { Carrera } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private firestore: Firestore = inject(Firestore);
  private carrerasCollection = collection(this.firestore, 'carreras');

  constructor() {}

  getCarreras(): Observable<Carrera[]> {
    return collectionData(this.carrerasCollection, { idField: 'id' }).pipe(
      map(data => data as Carrera[]),
      first()
    );
  }

  async agregarCarrera(carrera: Carrera): Promise<void> {
    try {
      const carreraDoc = doc(this.firestore, `carreras/${carrera.id}`);
      await setDoc(carreraDoc, {
        nombre: carrera.nombre,
        facultad: carrera.facultad,
        duracion: carrera.duracion
      });
    } catch (error) {
      console.error('Error Firestore al agregar carrera:', error);
      throw new Error('Error al guardar la carrera. Verifica los datos.');
    }
  }

  async modificarCarrera(carrera: Carrera): Promise<void> {
    try {
      // Si el ID cambió (tenemos idOriginal y es diferente)
      if (carrera.idOriginal && carrera.idOriginal !== carrera.id) {
        // Crear nuevo documento con el nuevo ID
        const nuevoDoc = doc(this.firestore, `carreras/${carrera.id}`);
        await setDoc(nuevoDoc, {
          nombre: carrera.nombre,
          facultad: carrera.facultad,
          duracion: carrera.duracion
        });
        
        // Eliminar el documento antiguo
        const viejoDoc = doc(this.firestore, `carreras/${carrera.idOriginal}`);
        await deleteDoc(viejoDoc);
      } else {
        // Actualización normal (ID no cambió)
        const carreraDoc = doc(this.firestore, `carreras/${carrera.id}`);
        await updateDoc(carreraDoc, {
          nombre: carrera.nombre,
          facultad: carrera.facultad,
          duracion: carrera.duracion
        });
      }
    } catch (error) {
      console.error('Error Firestore al modificar carrera:', error);
      throw new Error('Error al actualizar la carrera.');
    }
  }

  async eliminarCarrera(carrera: Carrera): Promise<void> {
    try {
      const carreraDoc = doc(this.firestore, `carreras/${carrera.id}`);
      await deleteDoc(carreraDoc);
    } catch (error) {
      console.error('Error Firestore al eliminar carrera:', error);
      throw new Error('Error al eliminar la carrera.');
    }
  }
}