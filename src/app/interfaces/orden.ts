export interface Orden {
    id?: number,
    numeroHistoria?: number,
    dni?: string,
    nombre?: string,
    medico?: string,
    orden? : string,
    tipoExam?: {
        id?: number,
        nombre?: string,
    },
    fechaA?: string,
    estadoOrden?:string
    nroRecibo?:string,
        monto?:string,
}
