import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  collection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Estudianteinscrito } from '../models/estudianteinscrito.models';
import { CarreraService } from './carrera.service';

@Injectable({
  providedIn: 'root'
})
export class EstudianteinscritoService {
  private firestore: Firestore = inject(Firestore);
  private estudiantesCollection = collection(this.firestore, 'estudiantes');

  constructor(private carreraService: CarreraService) {}

  getEstudiantes(): Observable<Estudianteinscrito[]> {
    return collectionData(this.estudiantesCollection, { idField: 'id' }) as Observable<Estudianteinscrito[]>;
  }
}