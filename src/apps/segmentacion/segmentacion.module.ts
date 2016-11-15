//Libreias importadas...
import {
  AfterViewInit, ElementRef, Component
} from '@angular/core';
import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  CommonModule
} from '@angular/common';
import {
  SegmentacionService
} from './segmentacion.service';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  FormsModule
} from '@angular/forms';
import {
  ZonaInterface
} from './zona.interface';
import {
  ProvinciaInterface
} from './provincia.interface';
import {
  DistritoInterface
} from './distrito.interface';
import {
  DepartamentoInterface
} from './departamento.interface';
import { Helpers } from './../../app/helper';
import { DataTableModule, SharedModule, ButtonModule, ConfirmDialogModule } from 'primeng/primeng';
import { ToastyModule, ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import {
  RegistroInterface
} from './registro.interface';
import {
  RegistroInterfaceRural
} from './registrorural.interface';

//Declaracion del componente
@Component({
  templateUrl: 'segmentacion.html',
  providers: [SegmentacionService]
})

class Segmentacion {

  //variables globables...
  private ccdd: any; //codigo del departamento
  private ccpp: any; //codigo de la provincia
  private ccdi: any; //codigo del distrito
  private zona: any = 0; //variable de la zona
  private area: string = "0"; //determina el tipo de area ( urbano=0/rural=1)

  private urbanoZona: boolean = true;  //variable para el area urbana
  private ruralZona: boolean = false; //variable para e area rural

  private verZona = false; //variable que muestra la zona
  private url: string = ''; //guarda la url
  private urlProcesar: string = ''; //guarda el url que se usara en el proceso
  private distrito: boolean = false; //variable para el distrito

  private registros: Object; //varaiable que guardara los registros
  private registro: RegistroInterface; //varaiable que guardara el registro

  private departamentos: DepartamentoInterface; //variable que guardara los departamentos
  private provincias: ProvinciaInterface; //variable que guardara las provincias
  private distritos: DistritoInterface; //variable que guardara los distritos
  private zonas: ZonaInterface; //variable que guardara las zonas

  //constructor...
  constructor(private segmentacionservice: SegmentacionService,
    private elementRef: ElementRef,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) {
    //se llama al metodo cargarDepa()
    this.cargarDepa();
    //se llama al metodo cargarTabla()
    this.cargarTabla("0", "0", "0", "0", "0");
    //se asigna el model al registro
    this.registro = this.model;
    //se inicializa el toast como bootstrap
    this.toastyConfig.theme = 'bootstrap';
    //se inicializa el toast en posicion center-center
    this.toastyConfig.position = "center-center";
  }

  //se incializa el model como un RegistroInterface
  model = new RegistroInterface();

  //funcion para cargar los departamentos
  cargarDepa() {
    //valida si el codigo de departamento es distinto de 0
    if (this.ccdd != 0) {
      //se llama al servicion getDepartamentos()
      this.segmentacionservice.getDepartamentos().subscribe(res => {
        //se asigna el valor del res a la variable departamentos
        this.departamentos = <DepartamentoInterface>res;
      })
    }
  }

  //funcion para cargar los provincias
  cargarProvincias(ccdd: string, ccpp: string = "0") {
    //se asigna el valor del codigo del departamento
    this.ccdd = ccdd;
    //la variable distrito se setea como falso
    this.distrito = false;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se valida si el ccdd es distinto de 0
    if (this.ccdd != 0) {
      //se llama al servicion getProvincias()
      this.segmentacionservice.getProvincias(ccdd, ccpp).subscribe(res => {
        //se asigna el valor del res a la variable provincias
        this.provincias = <ProvinciaInterface>res;
      })
      //se llama al metodo cargarTabla()
      this.cargarTabla("1", ccdd, "0", "0", "0")
    } else {
      //se pone el valor de las provincias en null
      this.provincias = null;
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
      //se llama al metodo cargarTabla()
      this.cargarTabla("0", "0", "0", "0", "0")
    }
  }

  //funcion para cargar los distritos
  cargarDistritos(ccpp: string) {
    //se asigna el valor del codigo del departamento
    this.ccpp = ccpp;
    //la variable distrito se setea como falso
    this.distrito = false;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se valida si el ccpp es distinto de 0
    if (this.ccpp != 0) {
      //se llama al servicion getDistritos()
      this.segmentacionservice.getDistritos(this.ccdd, ccpp, "0").subscribe(res => {
        //se asigna el valor del res a la variable distritos
        this.distritos = <DistritoInterface>res;
      })
      //se llama al metodo cargarTabla()
      this.cargarTabla("2", this.ccdd, ccpp, "0", "0");
    } else {
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
      //se llama al metodo cargarTabla()
      this.cargarTabla("1", this.ccdd, "0", "0", "0");
    }
  }

  //funcion para cambiar el area
  cambiarArea(area: string) {
    //se asigna el valor del codigo del area
    this.area = area;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //la variable urbanoZona se setea como true
      this.urbanoZona = true;
      //la variable ruralZona se setea como falso
      this.ruralZona = false;
    } else {
      //la variable urbanoZona se setea como falso
      this.urbanoZona = false;
      //la variable ruralZona se setea como true
      this.ruralZona = true;
    }
    //se llama al metodo cargarDepa()
    this.cargarDepa()
    //se llama al metodo cargarTabla()
    this.cargarTabla("0", "0", "0", "0", "0")
    //se pone el valor de las provincias en null
    this.provincias = null;
    //se pone el valor de los distritos en null
    this.distritos = null;
    //se pone el valor de las zonas en null
    this.zonas = null;
  }

  //funcion para cargar las zonas
  cargarZonas(ccdi: string) {
    //se asigna el valor del codigo del distrito
    this.ccdi = ccdi;
    //la variable verZona se setea como falso
    this.verZona = false;
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + ccdi;
    //la variable distrito se setea como true
    this.distrito = true;
    //se valida si el ccdi es distinto de 0
    if (this.ccdi != 0) {
      //se llama al servicion getDistritos()
      this.segmentacionservice.getZonas(ubigeo).subscribe(res => {
        //se asigna el valor del res a la variable zonas
        this.zonas = <ZonaInterface>res;
      })
      //se llama al metodo cargarTabla()
      this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    } else {
      //se pone el valor de las zonas en null
      this.zonas = null;
      //la variable distrito se setea como falso
      this.distrito = false;
      //se llama al metodo cargarTabla()
      this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }
  }

  //funcion para cargar las areas de empadronamiento urbano
  cargarAeu(zona: string) {
    //la variable verZona se setea como falso
    this.verZona = true;
    //se asigna el valor del codigo de la zona
    this.zona = zona;
    //se valida si la zpna es distinto de 0
    if (zona != "0") {
      //se llama al metodo cargarTabla()
      this.cargarTabla("4", this.ccdd, this.ccpp, this.ccdi, this.zona)
    } else {
      //la variable verZona se setea como false
      this.verZona = false;
      //se llama al metodo cargarTabla()
      this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    }
  }

  //funcion para cargar la tabla
  cargarTabla(tipo: string, ccdd: string, ccpp: string, ccdi: string, zona: string) {
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se llama al servicion getTabla()
      this.segmentacionservice.getTabla(this.area, tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        //se asigna el valor del res a la variable registros
        this.registros = <RegistroInterface>res;
      })
    } else {
      //se llama al servicion getTabla()
      this.segmentacionservice.getTabla(this.area, tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        //se asigna el valor del res a la variable registros
        this.registros = <RegistroInterfaceRural>res;
      })
    }
  }

  //funcion para cargar los registros
  getRegistro() {
    //guarda la url
    this.url = '4/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    //se llama al servicio getRegistro()
    this.segmentacionservice.getRegistro(this.url).subscribe((data) => {
      //se asigna el valor del res a la variable registro
      this.registro = <RegistroInterface>data
      //se asigna la data al model (atributo por atributo)
      this.model.DEPARTAMENTO = this.registro[0].DEPARTAMENTO;
      this.model.PROVINCIA = this.registro[0].PROVINCIA;
      this.model.DISTRITO = this.registro[0].DISTRITO;
      this.model.NUM_SEC = this.registro[0].NUM_SEC;
      this.model.NUM_AEU = this.registro[0].NUM_AEU;
      this.model.ZONA = this.registro[0].ZONA;
      this.model.EST_SEG = this.registro[0].EST_SEG;
    })
  }

  //funcion para procesar
  procesarSeg() {
    //se inicializa la variable en vacio
    this.urlProcesar = '';
    //se valida si el area es distinto a 0
    if (this.zona != '0') {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.area + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    } else {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.area + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/0/';
    }
    //se inicializa el toast con su respectivo titulo
    let toastOptions1: ToastOptions = {
      title: 'PROCESANDO',
      msg: this.urlProcesar,
      showClose: true,
      timeout: 5000,
    };
    //se llama al metodo addToast()
    this.addToast(toastOptions1, 'info');
  }

  //funcion para agregar el tipo de toast
  addToast(options: ToastOptions, tipo: string = 'default') {
    //se declara la variable toastOptions...
    let toastOptions: ToastOptions = options
    switch (tipo) {
      //tipos de toast que se pueden elegir
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

  //funcion para descargar Excel
  descargarExcel(id, nom) {
    //se llama al metodo descargarExcel() desde el Helpers
    Helpers.descargarExcel(id, nom);
  }

}

const routes: Routes = [{
  path: '',
  component: Segmentacion
}];

//declaracion del NgModule
@NgModule({
  //importaciones
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule, ToastyModule.forRoot(), ConfirmDialogModule],
  //declaraciones
  declarations: [Segmentacion]
})

//exportaciones
export default class SegmentacionModule { }