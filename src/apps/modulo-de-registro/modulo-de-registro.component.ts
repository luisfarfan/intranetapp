import { Component, OnInit } from '@angular/core';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Helpers
} from './../../app/helper';
import { RegistroService } from './modulo-de-registro.service'
import { Local } from './local';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CustomValidators } from 'ng2-validation';
@Component({
  templateUrl: 'modulo-de-registro.html',
  providers: [RegistroService],
})
export class RegistroComponent implements OnInit {
  local = new Local();
  accion_addlocal: boolean = false;
  accion_editlocal: boolean = false;
  // Ubigeo data
  departamentos: Array<Object> = []
  provincias: Array<Object> = []
  distritos: Array<Object> = []
  selectedDepartamento: any;
  selectedProvincia: any;

  // Form

  submitted = false;
  localForm: FormGroup;
  formErrors = {
    'nombre_local': '',
    'direccion': '',
    'referencia': '',
    'total_pea': '',
    'total_aulas_max': '',
    'funcionario_nombre': '',
    'funcionario_email': '',
    'funcionario_celular': '',
    'contacto_nombre': '',
    'contacto_email': '',
    'contacto_celular': '',
    'telefono_local': '',
  };
  constructor(
    private registroservice: RegistroService,
    private fb: FormBuilder,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig, ) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.position = "bottom-right";
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
  ngOnInit() {
    this.getDepartamentos();
    this.local.nombre_local = 'LOCAL DE JUNIN';
    this.buildForm();
  }
  onSubmit() {
    this.submitted = true;
    this.local = this.localForm.value;
    let toastOptions: ToastOptions = {
      title: 'Agregar',
      msg: 'Local Agregado con Éxito',
      showClose: true,
      timeout: 5000,
    };
    this.registroservice.addLocal(this.local).subscribe(_ => {
      this.addToast(toastOptions, 'success');
    }
    )
  }

  buildForm() {
    this.localForm = this.fb.group({
      'nombre_local': [this.local.nombre_local, [Validators.required, Validators.minLength(10), Validators.maxLength(40),]
      ],
      'direccion': [this.local.direccion, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'referencia': [this.local.referencia, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'total_pea': [this.local.total_pea, [Validators.required, CustomValidators.range([1, 1000])],
      ],
      'total_aulas_max': [this.local.total_aulas_max, [Validators.required, CustomValidators.range([1, 30])],
      ],
      'funcionario_nombre': [this.local.funcionario_nombre, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'funcionario_email': [this.local.funcionario_email, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'funcionario_celular': [this.local.funcionario_celular, [Validators.required, Validators.minLength(9), Validators.maxLength(30)],
      ],
      'contacto_nombre': [this.local.contacto_nombre, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'contacto_email': [this.local.contacto_email, [Validators.required, Validators.minLength(10), Validators.maxLength(30)],
      ],
      'contacto_celular': [this.local.contacto_celular, [Validators.required, Validators.minLength(9), Validators.maxLength(30)],
      ],
      'telefono_local': [this.local.telefono_local, [Validators.required, Validators.minLength(9), Validators.maxLength(30)],
      ],

    });
    this.localForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    )
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
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

  validationMessages = {
    'nombre_local': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'Nombre del Local is required.'
    },
    'direccion': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'Dirección is required.'
    },
    'referencia': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'referencia is required.'
    },
    'total_pea': {
      'required': 'total_pea is required.',
      'range': 'No se encuentra dentro del Rango'
    },
    'total_aulas_max': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'total_aulas_max is required.'
    },
    'funcionario_nombre': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'funcionario_nombre is required.'
    },
    'funcionario_email': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'funcionario_email is required.'
    },
    'funcionario_celular': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'funcionario_celular is required.'
    },
    'contacto_nombre': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'contacto_nombre is required.'
    },
    'contacto_email': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'contacto_email is required.'
    },
    'contacto_celular': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'contacto_celular is required.'
    },
    'telefono_local': {
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
      'required': 'telefono_local is required.'
    },
  };
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
}