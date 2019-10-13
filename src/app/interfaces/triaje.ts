import { Historial } from './historial';

export interface Triaje {
    id:number,
    numeroHistoria?: {
        id?: number,
        numeroHistoria?: number,
    },
    talla: number,
    peso: number,
    temperatura:number,
    frecuenciaR: number,
    frecuenciaC: number,
    presionArt: string,
    fechaReg:string,
    personal: number,
    cita: number
}
