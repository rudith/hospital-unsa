export interface Cabeceralab {
    nombre?:string;
    dni?:string;
    orden?:string;
    fecha?:string;
    tipoExam?: {
        id?: number,
        nombre?: string,
    };
    observaciones?:string;
}

