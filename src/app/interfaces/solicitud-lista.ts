import { Solicitud } from './solicitud';

export interface SolicitudLista {
    count:number;
    next:string;
    previus:string;
    results:Solicitud[];
}
