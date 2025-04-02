export interface Carrera {
    id: string;           // ID actual (siempre requerido)
    idOriginal: string;  // Solo necesario durante edición (opcional)
    facultad: string;     // Campo obligatorio
    nombre: string;       // Campo obligatorio
    duracion: string;     // Campo obligatorio
}