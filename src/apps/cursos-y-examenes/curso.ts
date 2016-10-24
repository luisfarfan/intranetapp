export class Curso {
    constructor(
        public id_capacitacion: string = '',
        public titulo_capacitacion: string = '',
        public desc_capacitacion: string = '',
        public nivel: string = '',
    ) {

    }
}

export class Criterio {
    constructor(
        public id_criterio_evaluacion: string = '',
        public desc_examen: string = '',
    ) {
    }
}

export class CursoCriterio {
    constructor(
        public id_capacitacion_criterio_evaluacion: string = '',
        public id_criterio_evaluacion: string = '',
        public id_capacitacion: string = '',
        public nota_minima: string = '',
        public duracion: string = '',
        public hora:string = '',
        public porcentaje:string = ''
    ) {
    }
} 