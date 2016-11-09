export class Local {
    constructor(
        public id_local: string = '',
        public id_curso: string = '',
        public ubigeo: string = '',
        public nombre_local: string = '',
        public tipo_via: string = '',
        public nombre_via: string = '',
        public referencia: string = '',
        public n_direccion: string = '',
        public km_direccion: string = '',
        public mz_direccion: string = '',
        public lote_direccion: string = '',
        public piso_direccion: string = '',
        public telefono_local_fijo: string = '',
        public telefono_local_celular: string = '',
        public fecha_inicio: string = '',
        public fecha_fin: string = '',
        public turno_uso_local: string = '',
        public capacidad_local: string = '',
        public funcionario_nombre: string = '',
        public funcionario_email: string = '',
        public funcionario_telefono: string = '',
        public funcionario_celular: string = '',
        public responsable_nombre: string = '',
        public responsable_email: string = '',
        public responsable_telefono: string = '',
        public responsable_celular: string = '',
        public amb_aula: boolean = false,
        public amb_aula_cant: string = '',
        public amb_auditorio: boolean = false,
        public amb_auditorio_cant: string = '',
        public amb_salareuniones: boolean = false,
        public amb_salareuniones_cant: string = '',
        public amb_oficinaadm: boolean = false,
        public amb_oficinaadm_cant: string = '',

    ) {
    }
}

export class Aula {
    constructor(
        public id_local: string = '',
        public num_aula: string = '',
        public mobiliario: string = '',
        public internet: boolean = false,
        public audio: boolean = false,
        public proyector: boolean = false,
        public pizarra: boolean = false,
        public mesas: string = '',
        public sillas: string = '',
        public unipersonales: boolean = false,
        public bipersonales: string = '',
    ) {
    }
}