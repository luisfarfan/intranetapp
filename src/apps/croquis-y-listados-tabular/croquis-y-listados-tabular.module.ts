//Librerias importadas...
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
  CroquisylistadostabularService
} from './croquis-y-listados-tabular.service';
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
import {
  RegistroInterface
} from './registro.interface';
import 'jszip';
import { DomSanitizer } from "@angular/platform-browser";
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';
import { ToastyModule, ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

//Variable de tipo JQuery
declare var jQuery;

//Declaracion del componente
@Component({
  templateUrl: 'croquis-y-listados-tabular.html',
  styles: [`.intro { 
    background-color: #A9E2F3;
  }`],
  providers: [CroquisylistadostabularService]
})

class Croquisylistadostabular {

  //variables globables...
  private ccdd: any; //codigo del departamento
  private ccpp: any; //codigo de la provincia
  private ccdi: any; //codigo del distrito
  private zona: any = 0; //codigo de la zona
  private area: string = "0";  //determina el tipo de area ( urbano=0/rural=1)

  private aeu: any = 0; //guarda el area de empadronamiento urbano
  private seccion: any = 0; //guarda la seccion

  private urlCroquis: any; //guarda el url del croquis

  private verZona = false; //variable que muestra la zona
  private url: string = ''; //guarda la url
  private urlProcesar: string = ''; //guarda el url que se usara en el proceso
  private distrito: boolean = false; //variable para el distrito

  private tipo_cro: number = 0; //guarda el tipo de croquis
  private tabledata: boolean = false; //permite que se vea la tabla
  private seccionAux: boolean = false; //guarda el area de empadronamiento urbano
  private aeuAux: boolean = false; //guarda el area de empadronamiento urbano

  private registros: Object; //varaiable que guardara los registros
  private registro: RegistroInterface; //varaiable que guardara el registro
  private registros2: Object; //guarda los registros

  private departamentos: DepartamentoInterface; //variable que guardara los departamentos
  private provincias: ProvinciaInterface; //variable que guardara las provincias
  private distritos: DistritoInterface; //variable que guardara los distritos
  private zonas: ZonaInterface; //variable que guardara las zonas

  private urlSeccion: any = ""; //guarda el url de la seccion
  private urlEmpadronador: any = ""; //guarda el url del ae

  private nombreDepa: string = ""; //guarda el nombre del departamento
  private nombreProv: string = ""; //guarda el nombre de la provincia
  private nombreDist: string = ""; //guarda el nombre del distrito

  private verDistrito: boolean = false; //permite ver el distrito
  private urbanoZona: boolean = true;  //variable para el area urbana
  private ruralZona: boolean = false; //variable para e area rural

  //constructor...
  constructor(private croquisylistadostabular: CroquisylistadostabularService,
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig) {
    //se llama al metodo cargarDepa()
    this.cargarDepa(this.area)
    //se llama al metodo cargarTabla()
    this.cargarTabla("0", "0", "0", "0", "0")
    //se asigna el model al registro
    this.registro = this.model
    //se inicializa el toast como bootstrap
    this.toastyConfig.theme = 'bootstrap';
    //se inicializa el toast en posicion center-center
    this.toastyConfig.position = "center-center";
  }

  //se incializa el model como un RegistroInterface
  model = new RegistroInterface();

  //funcion para cargar los departamentos
  cargarDepa(area) {
    //se llama al servicion getDepartamentos()
    this.croquisylistadostabular.getDepartamentos(area).subscribe(res => {
      //se asigna el valor del res a la variable departamentos
      this.departamentos = <DepartamentoInterface>res;
    })
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
      this.croquisylistadostabular.getProvincias(ccdd, ccpp, this.area).subscribe(res => {
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
      this.croquisylistadostabular.getDistritos(this.ccdd, ccpp, "0", this.area).subscribe(res => {
        //se asigna el valor del res a la variable distritos
        this.distritos = <DistritoInterface>res;
      })
      //se llama al metodo cargarTabla()
      this.cargarTabla("2", this.ccdd, ccpp, "0", "0")
    } else {
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
      //se llama al metodo cargarTabla()
      this.cargarTabla("1", this.ccdd, "0", "0", "0")
    }
  }

  //funcion para cambiar el area
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
      //se llama al servicion getZonas()
      this.croquisylistadostabular.getZonas(ubigeo).subscribe(res => {
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
  cambiarArea(area: string) {
    //la variable distrito se setea como true
    this.distrito = false;
    //se asigna el valor del codigo del area
    this.area = area;
    //se asigna el valor del codigo del verDistrito
    this.verDistrito = false;
    //variable que muestra la zona
    this.verZona = false;
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
    this.cargarDepa(this.area)
    //se llama al metodo cargarTabla()
    this.cargarTabla("0", "0", "0", "0", "0")
    //se pone el valor de las provincias en null
    this.provincias = null;
    //se pone el valor de los distritos en null
    this.distritos = null;
    //se pone el valor de las zonas en null
    this.zonas = null;
  }

  //funcion para cargar las areas de empadronamiento urbano
  cargarAeu(zona: string) {
    //la variable verZona se setea como true
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
    //se llama al metodo getRuta()
    this.getRuta()
  }

  //funcion para cargar la tabla
  cargarTabla(tipo: string, ccdd: string, ccpp: string, ccdi: string, zona: string) {
    //se llama al servicion getTabla()
    this.croquisylistadostabular.getTabla(this.area, tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
      //la variable verZona se setea como true
      this.tabledata = true;
      //se asigna el valor del res a la variable registros
      this.registros = <RegistroInterface>res;
      //se asigna la data al model (atributo por atributo)
      this.nombreDepa = this.registros[0].DEPARTAMENTO;
      this.nombreProv = this.registros[0].PROVINCIA;
      this.nombreDist = this.registros[0].DISTRITO;
    })
  }

  //funcion para cargar la tabla
  getRegistro(tipo_cro) {
    //se asigna el valor del tipo de croquis
    this.tipo_cro = tipo_cro;
    //se valida si el tipo_cro es igual a 0
    if (this.tipo_cro == 0) {
      //la variable seccionAux se setea como falso
      this.seccionAux = false;
      //la variable aeuAux se setea como falso
      this.aeuAux = false;
      //se llama al metodo getRuta()
      this.getRuta();
    }
    //se valida si el tipo_cro es igual a 1
    if (this.tipo_cro == 1) {
      //la variable seccionAux se setea como true
      this.seccionAux = true;
      //la variable aeuAux se setea como falso
      this.aeuAux = false;
      //se llama al metodo cambiarPdfSeccion()
      this.cambiarPdfSeccion(1);
    }
    //se valida si el tipo_cro es igual a 2
    if (this.tipo_cro == 2) {
      //la variable seccionAux se setea como true
      this.seccionAux = true;
      //la variable aeuAux se setea como true
      this.aeuAux = true;
      //se llama al metodo cambiarPdfAeu()
      this.cambiarPdfAeu(1, 1);
    }
    //guarda la url
    this.url = this.tipo_cro + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    //se llama al servicio getRegistro()
    this.croquisylistadostabular.getRegistro(this.url).subscribe((data) => {
      //se asigna el valor del res a la variable registros2
      this.registros2 = <RegistroInterface>data;
    })
  }

  //funcion para cargar la ruta
  getRuta() {
    //declara la variable urlCroquisAux
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona;
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } else {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }
    //se asigna la url a la variable urlSeccion
    this.urlSeccion = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdftab/${ubigeo}/${this.zona}/1/${this.area}/`);
    //se asigna la url a la variable urlEmpadronador
    this.urlEmpadronador = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdftab/${ubigeo}/${this.zona}/2/${this.area}/`);
  }

  //funcion para recargar el archivo .pdf (seccion)
  cambiarPdfSeccion(seccion) {
    //se asigna el valor de la seccion
    this.seccion = seccion;
    //se asigna la url a la variable urlCroquisAux
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3);
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } else {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }
    //se declara el metodo del click para la tabla
    jQuery('#tablaCroTabAux tr').click(function () {
      //se recorre la tabla
      jQuery('#tablaCroTabAux tr').each(function () {
        //se remueve la clase
        jQuery(this).removeClass('intro')
      })
      //se agrega la clase
      jQuery(this).addClass('intro');
    });
  }

  //funcion para recargar el archivo .pdf (aeu)
  cambiarPdfAeu(seccion, aeu) {
    //se asigna el valor de la seccion
    this.seccion = seccion;
    //se asigna el valor del aeu
    //this.aeu = aeu;
    this.aeu = ('00' + aeu).slice(-3);
    //se asigna la url a la variable urlCroquisAux
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3) + this.aeu;
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } else {
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_tab/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }
    //se declara el metodo del click para la tabla
    jQuery('#tablaCroTabAux tr').click(function () {
      //se recorre la tabla
      jQuery('#tablaCroTabAux tr').each(function () {
        //se remueve la clase
        jQuery(this).removeClass('intro')
      })
      //se agrega la clase
      jQuery(this).addClass('intro');
    });
  }

  //funcion para descargar Excel
  descargarExcel(id, nom) {
    //se llama al metodo descargarExcel() desde el Helpers
    Helpers.descargarExcel(id, nom);
  }

  //funcion para procesar
  procesarCro() {
    //se inicializa la variable en vacio
    this.urlProcesar = '';
    //se valida si el area es igual a 0
    if (this.zona != '0') {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    } else {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/0/';
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
}

const routes: Routes = [{
  path: '',
  component: Croquisylistadostabular
}];

//declaracion del NgModule
@NgModule({
  //importaciones
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule, ToastyModule.forRoot()],
  //declaraciones
  declarations: [Croquisylistadostabular]
})

//exportaciones
export default class CroquisylistadostabularModule { }
