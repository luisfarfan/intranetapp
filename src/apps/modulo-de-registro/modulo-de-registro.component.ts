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
  provincias: Array<Object> = [];
  distritos: Array<Object> = [];
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

  local = new Local();

  // Form
  localForm: FormGroup;
  formErrors: Object = {};
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
      'cursos': [this.local.cursos, [Validators.required],
      ],
      'tipo_via': [this.local.tipo_via, [Validators.required],
      ],
      'nombre_via': [this.local.nombre_via, [Validators.required],
      ],
      'referencia': [this.local.referencia, [Validators.required],
      ],
      'n_direccion': [this.local.n_direccion, [Validators.required],
      ],
      'km_direccion': [this.local.km_direccion, [Validators.required],
      ],
      'mz_direccion': [this.local.mz_direccion, [Validators.required],
      ],
      'lote_direccion': [this.local.lote_direccion, [Validators.required],
      ],
      'piso_direccion': [this.local.piso_direccion, [Validators.required],
      ],
      'telefono_local_fijo': [this.local.telefono_local_fijo, [Validators.required],
      ],
      'telefono_local_celular': [this.local.telefono_local_celular, [Validators.required],
      ],
      'fecha_inicio': [this.local.fecha_inicio, [Validators.required],
      ],
      'fecha_fin': [this.local.fecha_fin, [Validators.required],
      ],
      'turno_uso_local': [this.local.turno_uso_local, [Validators.required],
      ],
      'capacidad_local': [this.local.capacidad_local, [Validators.required],
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
      'amb_aula': [this.local.amb_aula, [Validators.required],
      ],
      'amb_aula_cant': [this.local.amb_aula_cant, [Validators.required],
      ],
      'amb_auditorio': [this.local.amb_auditorio, [Validators.required],
      ],
      'amb_auditorio_cant': [this.local.amb_auditorio_cant, [Validators.required],
      ],
      'amb_salareuniones': [this.local.amb_salareuniones, [Validators.required],
      ],
      'amb_salareuniones_cant': [this.local.amb_salareuniones_cant, [Validators.required],
      ],
      'amb_oficinaadm': [this.local.amb_oficinaadm, [Validators.required],
      ],
      'amb_oficinaadm_cant': [this.local.amb_oficinaadm_cant, [Validators.required],
      ],
    });
    this.localForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    )
    this.onValueChanged();
  }
  validationMessages = {
    'cursos': {
      'required': 'Este campo es requerido'
    },
    'tipo_via': {
      'required': 'Este campo es requerido'
    },
    'nombre_via': {
      'required': 'Este campo es requerido'
    },
    'referencia': {
      'required': 'Este campo es requerido'
    },
    'n_direccion': {
      'required': 'Este campo es requerido'
    },
    'km_direccion': {
      'required': 'Este campo es requerido'
    },
    'mz_direccion': {
      'required': 'Este campo es requerido'
    },
    'lote_direccion': {
      'required': 'Este campo es requerido'
    },
    'piso_direccion': {
      'required': 'Este campo es requerido'
    },
    'telefono_local_fijo': {
      'required': 'Este campo es requerido'
    },
    'telefono_local_celular': {
      'required': 'Este campo es requerido'
    },
    'fecha_inicio': {
      'required': 'Este campo es requerido'
    },
    'fecha_fin': {
      'required': 'Este campo es requerido'
    },
    'turno_uso_local': {
      'required': 'Este campo es requerido'
    },
    'capacidad_local': {
      'required': 'Este campo es requerido'
    },
    'funcionario_nombre': {
      'required': 'Este campo es requerido'
    },
    'funcionario_email': {
      'required': 'Este campo es requerido'
    },
    'funcionario_telefono': {
      'required': 'Este campo es requerido'
    },
    'funcionario_celular': {
      'required': 'Este campo es requerido'
    },
    'responsable_nombre': {
      'required': 'Este campo es requerido'
    },
    'responsable_email': {
      'required': 'Este campo es requerido'
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
    this.formErrors = new Local();
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
    console.log(this.formErrors);
    console.log(form);
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

  onSubmit() {
    let data = Helpers.booleanToNumber(this.localForm.value);
    console.log(data);
    this.registroservice.addLocal(data).subscribe(res => {
      let toastOptions: ToastOptions = { title: 'Agregar', msg: 'Local Agregado con Éxito', showClose: true, timeout: 5000, };
      console.log(res)
      this.addToast(toastOptions, 'success');
      this.localForm.reset();
    });
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

  setFechaIni(event) {
    this.dateModel = event;
    let day = ('0' + this.dateModel.getDate()).slice(-2);
    let month = ('0' + this.dateModel.getMonth()).slice(-2);
    this.local.fecha_inicio = `${day}/${(month)}/${this.dateModel.getFullYear()}`;

  }

  setFechaFin(event) {
    this.dateModel = event;
    let day = ('0' + this.dateModel.getDate()).slice(-2);
    let month = ('0' + this.dateModel.getMonth()).slice(-2);
    this.local.fecha_fin = `${day}/${(month)}/${this.dateModel.getFullYear()}`;

  }
}