export interface Examen {
    id?:number,
    nombre?: string,
    dni?: string,
    tipoExam?: {
        id?: number,
        nombre?: string,
    },
    detalles?: {
        id?: number,
        descripcion?: string,
        resultado_obtenido?: string,
        unidades?: string,
        rango_referencia?: string,
        codigoExam?: number,
    },
    orden?: string,
    fecha?: string,
    observaciones?: string,
}

