export class RegistroInterface {
    constructor(
        public DEPARTAMENTO : string = '',
        public PROVINCIA : string = '',
        public DISTRITO : string = '',
        public NUM_SEC : number = 0,
        public NUM_AEU : number = 0,
        public ZONA : string = '',
        public EST_CALIDAD_SEL : string = '',
        public EST_CONT : number = 0
    ){}
}