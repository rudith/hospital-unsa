import { Examen } from './examen';
export interface ExamenLista {
    count?: number,
    next?: string,
    previous?: string,
    results?: Examen[]
}
