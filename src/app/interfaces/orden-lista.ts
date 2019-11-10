import {Orden} from './orden'
export interface OrdenLista {
    count?: number,
    next?: string,
    previous?: string,
    results?: Orden[]
}
