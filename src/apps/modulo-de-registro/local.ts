export class Local {
    constructor(
        public nombre_local: string = '',
        public direccion: string = '',
        public referencia: string = '',
        public telefono_local:string = '',
        public total_pea: number = 0,
        public total_aulas_max: number = 0,
        public funcionario_nombre: string = '',
        public funcionario_email: string = '',
        public funcionario_celular: string = '',
        public contacto_nombre: string = '',
        public contacto_email: string = '',
        public contacto_celular: string = '',
        public estado: string = '',
        public usr_registro: string = '',
        public ubigeo: string = '',
    ) {
    }
}