export interface Estudiante {
    id: string;
    id_carrera: string;
    nombre: string;
    apellido: string;
    edad: string;
    email: string;
    idOriginal: string; 
}

export interface EstudianteWithCarrera extends Estudiante {
    nombreCarrera?: string;
}