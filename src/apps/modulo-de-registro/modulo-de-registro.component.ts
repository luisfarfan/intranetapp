import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Helpers } from './../../app/helper';
import { RegistroService } from './modulo-de-registro.service'
import { Local, Aula } from './local';
import { Infraestructura } from './infraestructura';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { CustomValidators } from 'ng2-validation';
import { dateValidator, FechaisMayor } from './../CustomValidators';
declare var jQuery: any;

@Component({
  templateUrl: 'modulo-de-registro.html',
  providers: [RegistroService],
  styleUrls: ['styles.scss']
})
export class RegistroComponent implements OnInit {
  @Input() dateModel: Date;
  @Input() dateModel2: Date;
  @Input() label: string;
  private showDatepicker: boolean = false;
  private showDatepicker2: boolean = false;
  public formats: Array<string> = ['DD/MM/YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
  public format: string = this.formats[0];

  @ViewChild('fecha_inicio_input') fecha_inicio_input
  public mask_date = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  // Filtros variables
  departamentos: Array<Object> = [];
  selectedDepartamento: any;
  provincias: Array<Object> = [];
  selectedProvincia: any;
  distritos: Array<Object> = [];
  selectedDistrito: any;
  etapas: Array<Object> = [];
  cursos: Array<Object> = [];

  //arrays variables, set variables
  tipo_de_via: Array<Object> = [
    { via: 'AVENIDA', 'P20': 1, P20_NOMBRE: 'AV.' },
    { via: 'CALLE', 'P20': 2, P20_NOMBRE: 'CAL.' },
    { via: 'JIRON', 'P20': 3, P20_NOMBRE: 'JR.' },
    { via: 'PASAJE', 'P20': 4, P20_NOMBRE: 'PSJ.' },
    { via: 'CARRETERA', 'P20': 5, P20_NOMBRE: 'CARR.' },
    { via: 'OTRO', 'P20': 6, P20_NOMBRE: 'OTRO.' },
  ];
  tipo_de_via_selected: Object = {};
  findlocales: boolean = false;
  local = new Local();
  editLocal: boolean = false;
  addLocal: boolean = false;
  //data
  locales: Object;
  selectedLocal: any;

  // Form
  localForm: FormGroup;
  formErrors = {
    'id_curso': '',
    'tipo_via': '',
    'nombre_via': '',
    'n_direccion': '',
    'km_direccion': '',
    'mz_direccion': '',
    'lote_direccion': '',
    'piso_direccion': '',
    'telefono_local_fijo': '',
    'telefono_local_celular': '',
    'fecha_inicio': '',
    'fecha_fin': '',
    'turno_uso_local': '',
    'capacidad_local': '',
    'funcionario_nombre': '',
    'funcionario_email': '',
    'funcionario_telefono': '',
    'funcionario_celular': '',
    'responsable_nombre': '',
    'responsable_email': '',
    'responsable_telefono': '',
    'responsable_celular': '',
    'amb_aula': '',
    'amb_aula_cant': '',
    'amb_auditorio': '',
    'amb_auditorio_cant': '',
    'amb_salareuniones': '',
    'amb_salareuniones_cant': '',
    'amb_oficinaadm': '',
    'amb_oficinaadm_cant': '',
  };
  constructor(
    private registroservice: RegistroService,
    private fb: FormBuilder,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig, ) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = "bottom-right";
  }

  ngOnInit() {
    this.getDepartamentos();
    this.getEtapas();
    this.local = new Local();
    this.buildForm();

  }
  addToast(options: ToastOptions, tipo: string = 'default') {
    // Just add default Toast with title only
    // Or create the instance of ToastOptions
    let toastOptions: ToastOptions = options
    switch (tipo) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }
  buildForm() {
    this.localForm = this.fb.group({
      'id_curso': [this.local.id_curso, [Validators.required],
      ],
      'tipo_via': [this.local.tipo_via, [Validators.required],
      ],
      'nombre_via': [this.local.nombre_via, [Validators.required, Validators.minLength(10), Validators.maxLength(100)],
      ],
      'referencia': [this.local.referencia, [Validators.required, Validators.minLength(10), Validators.maxLength(100)],
      ],
      'n_direccion': [this.local.n_direccion, [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
      ],
      'km_direccion': [this.local.km_direccion, [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ],
      'mz_direccion': [this.local.mz_direccion, [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      'lote_direccion': [this.local.lote_direccion, [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      'piso_direccion': [this.local.piso_direccion, [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
      ],
      'telefono_local_fijo': [this.local.telefono_local_fijo, [Validators.required, Validators.minLength(1), Validators.maxLength(7)],
      ],
      'telefono_local_celular': [this.local.telefono_local_celular, [Validators.required, Validators.minLength(1), Validators.maxLength(9)],
      ],
      'fecha_inicio': [this.local.fecha_inicio, [Validators.required, dateValidator(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)],
      ],
      'fecha_fin': [this.local.fecha_fin, [Validators.required, dateValidator(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)],
      ],
      'turno_uso_local': [this.local.turno_uso_local, [Validators.required],
      ],
      'capacidad_local': [this.local.capacidad_local, [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ],
      'funcionario_nombre': [this.local.funcionario_nombre, [Validators.required],
      ],
      'funcionario_email': [this.local.funcionario_email, [Validators.required],
      ],
      'funcionario_telefono': [this.local.funcionario_telefono, [Validators.required],
      ],
      'funcionario_celular': [this.local.funcionario_celular, [Validators.required],
      ],
      'responsable_nombre': [this.local.responsable_nombre, [Validators.required],
      ],
      'responsable_email': [this.local.responsable_email, [Validators.required],
      ],
      'responsable_telefono': [this.local.responsable_telefono, [Validators.required],
      ],
      'responsable_celular': [this.local.responsable_celular, [Validators.required],
      ],
      'amb_aula': [this.local.amb_aula, [],
      ],
      'amb_aula_cant': [this.local.amb_aula, [],
      ],
      'amb_auditorio': [this.local.amb_auditorio, [],
      ],
      'amb_auditorio_cant': [this.local.amb_auditorio_cant, [],
      ],
      'amb_salareuniones': [this.local.amb_salareuniones, [],
      ],
      'amb_salareuniones_cant': [this.local.amb_salareuniones_cant, [],
      ],
      'amb_oficinaadm': [this.local.amb_oficinaadm, [],
      ],
      'amb_oficinaadm_cant': [this.local.amb_oficinaadm_cant, [],
      ],
    });
    this.localForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    )
    this.onValueChanged();
  }
  validationMessages = {
    'id_curso': {
      'required': 'Este campo es requerido'
    },
    'tipo_via': {
      'required': 'Este campo es requerido'
    },
    'nombre_via': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'referencia': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'n_direccion': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'km_direccion': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'mz_direccion': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'lote_direccion': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'piso_direccion': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'telefono_local_fijo': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'telefono_local_celular': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'fecha_inicio': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'fecha_fin': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido',
      'maxLength': 'No cumple con el máximo permitido'
    },
    'turno_uso_local': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'capacidad_local': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'funcionario_nombre': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'funcionario_email': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'funcionario_telefono': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'funcionario_celular': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'responsable_nombre': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'responsable_email': {
      'required': 'Este campo es requerido',
      'minLength': 'No cumple con el minimo permitido'
    },
    'responsable_telefono': {
      'required': 'Este campo es requerido'
    },
    'responsable_celular': {
      'required': 'Este campo es requerido'
    },
    'amb_aula': {
      'required': 'Este campo es requerido'
    },
    'amb_aula_cant': {
      'required': 'Este campo es requerido'
    },
    'amb_auditorio': {
      'required': 'Este campo es requerido'
    },
    'amb_auditorio_cant': {
      'required': 'Este campo es requerido'
    },
    'amb_salareuniones': {
      'required': 'Este campo es requerido'
    },
    'amb_salareuniones_cant': {
      'required': 'Este campo es requerido'
    },
    'amb_oficinaadm': {
      'required': 'Este campo es requerido'
    },
  };

  onValueChanged(data?: any) {
    console.log(this.localForm)
    if (!this.localForm) { return; }
    const form = this.localForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  getDepartamentos() {
    this.registroservice.getDepartamentos().subscribe(departamentos => {
      this.departamentos = <Array<Object>>departamentos;
    })
  }
  getProvincias() {
    this.registroservice.getProvincias(this.selectedDepartamento).subscribe(provincias => {
      this.provincias = <Array<Object>>provincias;
      console.log(this.selectedDepartamento);
    })
  }
  getDistritos() {
    this.registroservice.getDistritos(this.selectedDepartamento, this.selectedProvincia).subscribe(distritos => {
      this.distritos = <Array<Object>>distritos;
    })
  }

  getEtapas() {
    this.registroservice.getEtapa().subscribe(etapas => this.etapas = <Object[]>etapas);
  }

  getCursosByEtapa(value: any) {
    this.registroservice.getCursosbyEtapa(value).subscribe(cursos => this.cursos = <Object[]>cursos);
  }
  accionAddLocal() {
    this.editLocal = false;
    this.addLocal = true;
    this.buildForm();
  }
  onSubmit() {
    this.local.ubigeo = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`
    if (this.editLocal) {
      let data = Helpers.booleanToNumber(this.localForm.value);
      this.registroservice.editLocal(this.local.id_local, data).subscribe(res => {
        let toastOptions: ToastOptions = { title: 'Editar', msg: 'Local Editado con éxito', showClose: true, timeout: 5000, };
        this.addToast(toastOptions, 'success');
        this.localForm.reset();
      });
    } else {
      this.local = this.localForm.value;
      this.local.ubigeo = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`;
      let data = Helpers.booleanToNumber(this.local);
      this.registroservice.addLocal(data).subscribe(res => {
        let toastOptions: ToastOptions = { title: 'Agregar', msg: 'Local Agregado con Éxito', showClose: true, timeout: 5000, };
        //console.log(res)
        this.addToast(toastOptions, 'success');
        this.localForm.reset();
      });
    }

  }

  showPopup(num: any) {
    if (num == 1) {
      this.showDatepicker = true;
      this.showDatepicker2 = false;
    } else {
      this.showDatepicker = false;
      this.showDatepicker2 = true;
    }
    jQuery('#datepickermodal').modal('show');
  }

  findLocal() {
    let ubigeo = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`
    this.registroservice.getLocal(ubigeo).subscribe(data => {
      this.locales = data;
      this.findlocales = true;
      jQuery('#locales_finded').modal('show');
    })
  }

  setLocalForm() {
    this.local = this.selectedLocal;
    this.buildForm();
    jQuery('#locales_finded').modal('hide');
    this.editLocal = true;
  }

  setFechaIni(event) {
    this.dateModel = event;
    let day = ('0' + this.dateModel.getDate()).slice(-2);
    let month = ('0' + this.dateModel.getMonth()).slice(-2);
    this.local.fecha_inicio = `${day}/${(month + 1)}/${this.dateModel.getFullYear()}`;
    this.buildForm();
  }

  setFechaFin(event) {
    this.dateModel = event;
    let day = ('0' + this.dateModel.getDate()).slice(-2);
    let month = ('0' + this.dateModel.getMonth()).slice(-2);
    this.local.fecha_fin = `${day}/${(month + 1)}/${this.dateModel.getFullYear()}`;
    this.buildForm();
  }
}