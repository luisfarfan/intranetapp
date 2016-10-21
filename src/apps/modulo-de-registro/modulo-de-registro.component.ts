import { Component, OnInit, ViewChild } from '@angular/core';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Helpers } from './../../app/helper';
import { RegistroService } from './modulo-de-registro.service'
import { Local } from './local';
import { Infraestructura } from './infraestructura';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CustomValidators } from 'ng2-validation';
@Component({
  templateUrl: 'modulo-de-registro.html',
  providers: [RegistroService],
  styles: [`
  .form-group label {
    float: left;
    text-align: left;
    font-weight: normal;
}

.form-group select {
    display: inline-block;
    width: auto;
    vertical-align: middle;
}
  `]
})
export class RegistroComponent implements OnInit {
  local = new Local();
  infraestructuras = new Infraestructura();
  accion_addlocal: boolean = false;
  accion_editlocal: boolean = false;
  // Ubigeo data
  departamentos: Array<Object> = []
  selectedLocal: any;
  alert_nofindlocales: boolean = false;
  provincias: Array<Object> = []
  distritos: Array<Object> = []
  selectedDepartamento: any;
  selectedProvincia: any;
  selectedDistrito: any;
  _infraestucturas: any;
  infraestucturas: any;
  infraSelected: Array<Object>;
  search_locales: Object;
  estado_infraestuctura: Object = {

  }

  // Form

  submitted = false;
  localForm: FormGroup;
  infraForm: FormGroup;
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

  ngOnInit() {
    this.getDepartamentos();
    this.buildForm();
    this.local = new Local();
    this.local.direccion = 'hola!'
    this.registroservice.getLocalBy('10').subscribe(_ => console.log(_))
    this.getInfraesctura();
  }

  accionAddLocal() {
    this.accion_editlocal = false;
    this.accion_addlocal = true;
  }
  onRowSelect(e) {
    this.accion_addlocal = true;
    console.log(this.search_locales)
    this.buildForm();
    this.local = this.selectedLocal
    console.log(this.selectedLocal, this.local)
    for (let i in this.infraestructuras) {
      for (let p in this.selectedLocal.infraestructuras) {
        if (this.selectedLocal.infraestructuras[p].desc_infraestructura == this.infraestructuras[i].desc_infraestructura) {
          this.infraestructuras[i].estado1 = this.selectedLocal.infraestructuras[p].estado;
        }
      }
    }
    console.log(this.infraestructuras);
    this.accion_addlocal = true;
  }

  onRowUnselect(e) {
    console.log(this.search_locales)
    //this.accion_addlocal = false;
    this.buildForm();
    this.localForm.reset();
    for (let k in this.infraestructuras) {
      this.infraestructuras[k].estado1 = '';
    }
  }

  getInfraesctura() {
    this.registroservice.getInfraestructura().subscribe(infra => {
      console.log(infra);
      this.infraestructuras = <Infraestructura>infra;
      console.log(this.infraestructuras);
      for (let key in infra) {
        if (infra[key].desc_infraestructura == "SS.HH") {
          infra[key].estado = ['SI', 'NO']
        } else {
          infra[key].estado = ['MALO', 'BUENO', 'REGULAR']
        }
        infra[key].estado1 = '';
      }
    });
  }

  setEstadoInfra(val, i) {
    console.log(val, i);
    console.log(this.infraestructuras[i].estado1 = val);
    console.log(this.infraestructuras)
    //this.infraSelected.push({id_infraestructura : this.infraestructuras[i].id_infraestructura, estado:val})
    //console.log(this.infraestucturas[i].estado = val);
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
  onSubmit() {
    let ubigeo: string = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`
    console.log(this.infraestucturas);
    let post: Object;
    let res: any;
    this.submitted = true;
    this.local = this.localForm.value;
    this.local.ubigeo = ubigeo
    let toastOptions: ToastOptions = {
      title: 'Agregar',
      msg: 'Local Agregado con Éxito',
      showClose: true,
      timeout: 5000,
    };
    this.registroservice.addLocal(this.local).subscribe(response => {
      res = response;
      for (let key in this.infraestucturas) {
        post = { id_local: res.id_local, id_infraestructura: this.infraestucturas[key].id_infraestructura, estado: this.infraestucturas[key].estado1 }
        this.registroservice.addInfraLocal(post).subscribe(_ => true)
      }
      this.addToast(toastOptions, 'success');
      setTimeout(_ => {
        this.accion_editlocal = false
        this.accion_editlocal = true
        this.localForm.reset();
      }, 2000)
    }
    )
  }

  buildForm() {
    this.localForm = this.fb.group({
      'nombre_local': [this.local.nombre_local, [Validators.required, Validators.minLength(10), Validators.maxLength(200),]
      ],
      'direccion': [this.local.direccion, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'referencia': [this.local.referencia, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'total_pea': [this.local.total_pea, [Validators.required, Validators.pattern('^[1-9][0-9]$')],
      ],
      'total_aulas_max': [this.local.total_aulas_max, [Validators.required, Validators.pattern('^[1-9][0-9]{6}$'), CustomValidators.number],
      ],
      'funcionario_nombre': [this.local.funcionario_nombre, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'funcionario_email': [this.local.funcionario_email, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'funcionario_celular': [this.local.funcionario_celular, [Validators.required, Validators.minLength(8), Validators.maxLength(9)],
      ],
      'contacto_nombre': [this.local.contacto_nombre, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'contacto_email': [this.local.contacto_email, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'contacto_celular': [this.local.contacto_celular, [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      'telefono_local': [this.local.telefono_local, [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],

    });
    this.infraForm = this.fb.group({
      'nombre_local': [this.infraestructuras.desc_infraestructura, [Validators.required, Validators.minLength(10), Validators.maxLength(200),]
      ],
    })
    this.localForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    )
    this.onValueChanged();
  }
  validationMessages = {
    'nombre_local': {
      'required': 'Nombre Local es requerido',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'direccion': {
      'required': 'Dirección es requerido',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'referencia': {
      'required': 'Referencia es requerida',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'total_pea': {
      'required': 'Total PEA es requerido',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'total_aulas_max': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'funcionario_nombre': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'funcionario_email': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'funcionario_celular': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'contacto_nombre': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'contacto_email': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'contacto_celular': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
    'telefono_local': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 4 characters long.',
      'maxlength': 'Name cannot be more than 24 characters long.',
    },
  };

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

  findLocales() {
    this.accion_addlocal = false;
    let ubigeo: string = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`
    this.registroservice.getLocalbyUbigeo(ubigeo).subscribe(data => {
      this.search_locales = data;
      if (!this.search_locales || Helpers.lengthobj(this.search_locales) == 0) {
        this.alert_nofindlocales = true;
      } else {
        this.accion_editlocal = true;
        this.alert_nofindlocales = false;
      }
    });
  }

}