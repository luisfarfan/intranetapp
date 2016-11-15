export class Reporte10Interface {
    constructor(
        public departamento : string = '',
        public provincia : string = '',
        public distritos : string = '',
        public centro_poblado : string = '',
        public categoria_ccpp : string = '',
        public seccion_censal : string = '',
        public aer : string = '',
        public tot_viv_ccpp : string = '',        
        public cont_rur_error_01 : string = '',
        public cont_rur_error_02 : string = '',
        public cont_rur_error_03 : string = '',
        public cont_rur_error_04 : string = ''
    ){}
}