export interface Estudianteinscrito {
    id: string;
    id_carrera: string;
    nombre: string;
    apellido: string;
    edad: string;
    email: string;
}

export interface EstudianteinscritoWithCarrera extends Estudianteinscrito {
    nombreCarrera?: string;
}