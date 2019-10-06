import { Historial } from './historial';

export interface Triaje {
    id:number,
    numeroHistoria:Historial,
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
