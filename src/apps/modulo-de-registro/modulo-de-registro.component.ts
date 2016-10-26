import { Component, OnInit, ViewChild } from '@angular/core';
import { TableOptions, TableColumn, ColumnMode } from 'angular2-data-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Helpers } from './../../app/helper';
import { RegistroService } from './modulo-de-registro.service'
import { Local, Aula } from './local';
import { Infraestructura } from './infraestructura';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { CustomValidators } from 'ng2-validation';
import { dateValidator, FechaisMayor } from './../CustomValidators';
@Component({
  templateUrl: 'modulo-de-registro.html',
  providers: [RegistroService],
  styleUrls: ['styles.scss']
})
export class RegistroComponent implements OnInit {
  @ViewChild('fecha_inicio_input') fecha_inicio_input
  public mask_date = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  local = new Local();
  aula = new Aula();
  deleteaula: boolean = false;
  infraestructuras: any;
  accion_addlocal: boolean = false;
  accion_editlocal: boolean = false;
  registrarAula: boolean = false;
  selectsInfraestructuras: boolean = false;
  aulasbylocal: any;
  selectedAula: any;
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
  submitted: boolean = false;
  searchedlocales: boolean = false;
  max_aulas: boolean = false;

  // Form

  localForm: FormGroup;
  formErrors = {
    'nombre_local': '',
    'fecha_inicio': '',
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
    this.local = new Local();
    this.buildForm();
    this.getInfraestructura();
  }

  accionAddLocal() {
    this.accion_editlocal = false;
    this.accion_addlocal = true;
    this.registrarAula = false;
  }
  onRowSelect(e) {
    this.accion_addlocal = false;
    this.accion_editlocal = true;
    this.registrarAula = true;
    this.local = this.selectedLocal
    console.log(this.selectedLocal);
    this.buildForm();
    //console.log(this.selectedLocal, this.local)
    for (let i in this.infraestructuras) {
      for (let p in this.selectedLocal.infraestructuras) {
        if (this.selectedLocal.infraestructuras[p].desc_infraestructura == this.infraestructuras[i].desc_infraestructura) {
          this.infraestructuras[i].estado1 = this.selectedLocal.infraestructuras[p].estado;
        }
      }
    }
    this.getAulas();
    //console.log(this.infraestructuras);
    this.aulasbylocal = this.selectedLocal.aulas;
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

  getInfraestructura() {
    this.registroservice.getInfraestructura().subscribe(infra => {
      for (let key in infra) {
        if (infra[key].desc_infraestructura == "SS.HH") {
          infra[key].estado = ['SI', 'NO']
        } else {
          infra[key].estado = ['MALO', 'BUENO', 'REGULAR']
        }
        infra[key].estado1 = '';
      }
      this.infraestructuras = infra;
    });
  }

  setEstadoInfra(val, i) {
    console.log(val, i);
    console.log(this.infraestructuras[i].estado1 = val);
    console.log(this.infraestructuras)
    let count = 0;
    for (let k in this.infraestructuras) {
      if (this.infraestructuras[k].estado1 == '') {
        count++;
      }
    }
    count > 0 ? this.selectsInfraestructuras = false : this.selectsInfraestructuras = true;
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
    let toastOptions: ToastOptions = { title: 'Agregar', msg: 'Local Agregado con Éxito', showClose: true, timeout: 5000, };

    if (this.accion_addlocal) {
      this.registroservice.addLocal(this.local).subscribe(response => {
        res = response;
        for (let key in this.infraestructuras) {
          post = { id_local: res.id_local, id_infraestructura: this.infraestructuras[key].id_infraestructura, estado: this.infraestructuras[key].estado1 }
          this.registroservice.addInfraLocal(post).subscribe(_ => console.log(_))
        }
        this.addToast(toastOptions, 'success');
        setTimeout(_ => {
          this.accion_editlocal = false
          this.accion_editlocal = true
          this.submitted = true;
          this.localForm.reset();
        }, 2000)
        this.submitted = false;
        console.log(this.submitted)
      }
      )
    }
    else if (this.accion_editlocal) {
      for (let key in this.infraestructuras) {
        this.registroservice.editLocal(this.selectedLocal.id_local, this.local).subscribe(_ => true)
        this.registroservice.getInfraestructuraLocal(this.selectedLocal.id_local, this.infraestructuras[key].id_infraestructura).subscribe(res => {
          let data = { estado: this.infraestructuras[key].estado1 }
          console.log(res[0].id_infraestructuralocal, this.infraestructuras[key])
          this.registroservice.editInfraLocal(res[0].id_infraestructuralocal, data).subscribe(_ => true)
        }
        )
      }
      this.findLocales();
      toastOptions.title = 'Editar'
      toastOptions.msg = 'Registro Editado con Éxito'
      this.addToast(toastOptions, 'success');
      setTimeout(_ => {
        this.accion_editlocal = false
        this.submitted = true;
        this.localForm.reset();
      }, 2000)
      this.submitted = false;
      console.log(this.submitted)
    }

  }

  buildForm() {
    this.localForm = this.fb.group({
      'nombre_local': [this.local.nombre_local, [Validators.required, Validators.minLength(10), Validators.maxLength(200),]
      ],
      'fecha_inicio': [this.local.fecha_inicio, [Validators.required, dateValidator(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]
      ],
      'fecha_fin': [this.local.fecha_fin, [Validators.required, dateValidator(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)]
      ],
      'direccion': [this.local.direccion, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'referencia': [this.local.referencia, [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
      ],
      'total_pea': [this.local.total_pea, [Validators.required],
      ],
      'total_aulas_max': [this.local.total_aulas_max, [Validators.required, CustomValidators.number],
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
    this.localForm.valueChanges.subscribe(
      data => this.onValueChanged(data)
    )
    this.onValueChanged();
    console.log(this.local);
  }
  validationMessages = {
    'nombre_local': {
      'required': 'Nombre Local es requerido',
      'minlength': 'Nombre de Local muy corto.',
      'maxlength': 'Nombre de local paso del maximo permitido.',
    },
    'fecha_fin': {
      'required': 'Fecha fin es requerido',
      'dateValidator': 'Fecha no valida'
    },
    'fecha_inicio': {
      'required': 'Fecha inicio es requerido',
      'dateValidator': 'Fecha no valida'
    },
    'direccion': {
      'required': 'Dirección es requerido',
      'minlength': 'Nombre de Local muy corto.',
      'maxlength': 'Nombre de local paso del maximo permitido.',
    },
    'referencia': {
      'required': 'Referencia es requerida',
      'minlength': 'Referencia muy corto.',
      'maxlength': 'Referencia paso del maximo permitido.',
    },
    'total_pea': {
      'required': 'Total PEA es requerido',
      'minlength': 'Total PEA muy corto.',
      'maxlength': 'Total PEA paso del maximo permitido.',
    },
    'total_aulas_max': {
      'required': 'Total Aulas Máximo is required.',
      'minlength': 'Total Aulas Máximo muy corto.',
      'maxlength': 'Total Aulas Máximo paso del maximo permitido.',
    },
    'funcionario_nombre': {
      'required': 'Funcionario nombre es requerido.',
      'minlength': 'Funcionario nombre muy corto.',
      'maxlength': 'Funcionario nombre paso del maximo permitido.',
    },
    'funcionario_email': {
      'required': 'Funcionario email is required.',
      'minlength': 'Funcionario email muy corto.',
      'maxlength': 'Funcionario email paso del maximo permitido.',
    },
    'funcionario_celular': {
      'required': 'Funcionario Celular is required.',
      'minlength': 'Funcionario Celular muy corto.',
      'maxlength': 'Funcionario Celular paso del maximo permitido.',
    },
    'contacto_nombre': {
      'required': 'Contacto Nombre is required.',
      'minlength': 'Contacto Nombre muy corto.',
      'maxlength': 'Contacto Nombre paso del maximo permitido.',
    },
    'contacto_email': {
      'required': 'Contacto Email is required.',
      'minlength': 'Contacto Email muy corto.',
      'maxlength': 'Contacto Email paso del maximo permitido.',
    },
    'contacto_celular': {
      'required': 'Contacto Celular is required.',
      'minlength': 'Contacto Celular muy corto.',
      'maxlength': 'Contacto Celular paso del maximo permitido.',
    },
    'telefono_local': {
      'required': 'Teléfono Local is required.',
      'minlength': 'Teléfono Local muy corto.',
      'maxlength': 'Teléfono Local paso del maximo permitido.',
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
    this.accion_editlocal = false;
    console.log(this.submitted = false)
    let ubigeo: string = `${this.selectedDepartamento}${this.selectedProvincia}${this.selectedDistrito}`
    this.registroservice.getLocalbyUbigeo(ubigeo).subscribe(data => {
      this.search_locales = data;
      if (!this.search_locales || Helpers.lengthobj(this.search_locales) == 0) {
        this.alert_nofindlocales = true;
      } else {
        this.alert_nofindlocales = false;
        this.searchedlocales = true;
      }
    });
  }

  addAula() {
    this.aula.id_local = this.local.id_local
    console.log(this.aula);
    let data = Helpers.booleanToYesNo(this.aula)
    if (this.selectedAula) {
      this.registroservice.editAula(this.selectedAula.id_aula, data).subscribe(_ => {
        this.aula = new Aula();
        this.getAulas();
      })
    } else {
      if (this.selectedLocal.total_aulas_max <= Helpers.lengthobj(this.aulasbylocal)) {
        this.max_aulas = true;
        this.aula = new Aula();
        this.getAulas();
      } else {
        this.registroservice.addAula(data).subscribe(
          _ => {
            this.aula = new Aula();
            this.getAulas();
          }
        )
      }

    }
  }

  getAulas() {
    this.registroservice.getAula(this.local.id_local).subscribe(aulasbylocal => {
      this.aulasbylocal = aulasbylocal
    })
  }
  onRowSelect2(e) {
    this.deleteaula = true;
    this.aula = <Aula>Helpers.YesNoToboolean(this.selectedAula);
  }
  onRowUnSelect2(e) {
    this.deleteaula = false;
    this.aula = new Aula();
  }
  deleteAula() {
    this.registroservice.deleteAula(this.selectedAula.id_aula).subscribe(_ => {
      this.getAulas()
      this.aula = new Aula();
      this.deleteaula = false;
    })

  }
}