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
  CroquisylistadoService
} from './croquis-y-listado.service';
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
import {
  RegistroInterfaceRural
} from './registrorural.interface';
import 'jszip';
import { DomSanitizer } from "@angular/platform-browser";
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';
import { ToastyModule, ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

//Variable de tipo JQuery
declare var jQuery;

//Declaracion del componente
@Component({
  templateUrl: 'croquis-y-listado.html',
  styles: [`.intro { 
    background-color: #A9E2F3;
  }`],
  providers: [CroquisylistadoService]
})

class Croquisylistado {

  //variables globables...
  private ccdd: any; //codigo del departamento
  private ccpp: any; //codigo de la provincia
  private ccdi: any; //codigo del distrito
  private zona: any = 0; //codigo de la zona
  private area: string = "0";  //determina el tipo de area ( urbano=0/rural=1)

  private verDistrito: boolean = false; //permite ver el distrito
  private urbanoZona: boolean = true;  //variable para el area urbana
  private ruralZona: boolean = false; //variable para e area rural

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
  private aeuAuxRural: boolean = false; //guarda el area de empadronamiento rural

  private registros: Object; //varaiable que guardara los registros
  private registro: RegistroInterface; //varaiable que guardara el registro
  private registros2: Object; //guarda los registros

  private departamentos: DepartamentoInterface; //variable que guardara los departamentos
  private provincias: ProvinciaInterface; //variable que guardara las provincias
  private distritos: DistritoInterface; //variable que guardara los distritos
  private zonas: ZonaInterface; //variable que guardara las zonas

  private nombreDepa: string = ""; //guarda el nombre del departamento
  private nombreProv: string = ""; //guarda el nombre de la provincia
  private nombreDist: string = ""; //guarda el nombre del distrito

  private urlSeccion: any = ""; //guarda el url de la seccion
  private urlEmpadronador: any = ""; //guarda el url del ae

  private urlSeccionRural: any = ""; //guarda el url de la seccion rural
  private urlEmpadronadorRural: any = "";  //guarda el url del ae rural

  //constructor...
  constructor(private croquisylistado: CroquisylistadoService,
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
    this.croquisylistado.getDepartamentos(area).subscribe(res => {
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
    //la variable distrito se setea como true
    this.verDistrito = false;
    //se valida si el ccdi es distinto de 0
    console.log(this.area);
    if (this.ccdd != 0) {
      //se llama al servicion getProvincias()
      this.croquisylistado.getProvincias(ccdd, ccpp, this.area).subscribe(res => {
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
    //la variable verDistrito se setea como falso
    this.verDistrito = false;
    //se valida si el ccpp es distinto de 0
    console.log(this.area);
    if (this.ccpp != 0) {
      //se llama al servicion getDistritos()
      this.croquisylistado.getDistritos(this.ccdd, ccpp, this.area).subscribe(res => {
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
    //se valida si el area es igual a 1
    if (this.area == "1") {
      //la variable verDistrito se setea como true
      this.verDistrito = true;
      //se llama al metodo getRuta()
      this.getRuta();
    }
    //se valida si el area es igual a 1
    if (this.ccdi != 0) {
      //se llama al servicion getZonas()
      this.croquisylistado.getZonas(ubigeo).subscribe(res => {
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

  //funcion para cambiar el area
  cambiarArea(area: string) {
    //la variable distrito se setea como falso
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
    this.croquisylistado.getTabla(this.area, tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
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

  //funcion para destruir la tabla
  destruir() {
    //muestra el modal mediante jQuery
    jQuery('#modal_croquis').modal('show');
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna el valor 0 al combo
      jQuery("#combo_urbano").val('0');
    } else {
      //se asigna el valor 1 al combo
      jQuery("#combo_rural").val('1');
    }
  }

  //funcion para cargar los registros
  getRegistro(tipo_cro) {
    //se asigna el valor del tipo de croquis
    this.tipo_cro = tipo_cro;
    //se valida si el area es igual de 0
    if (this.area == "0") {
      //se valida si el tipo_cro es igual de 0
      if (this.tipo_cro == 0) {
        //la variable seccionAux se setea como falso
        this.seccionAux = false;
        //la variable aeuAux se setea como falso
        this.aeuAux = false;
        //se llama al metodo getRuta()
        this.getRuta();
      }
      //se valida si el tipo_cro es igual de 1
      if (this.tipo_cro == 1) {
        //la variable seccionAux se setea como falso
        this.seccionAux = true;
        //la variable aeuAux se setea como falso
        this.aeuAux = false;
        //se llama al metodo cambiarPdfSeccion()
        this.cambiarPdfSeccion(1);
      }
      //se valida si el tipo_cro es igual de 2
      if (this.tipo_cro == 2) {
        //la variable seccionAux se setea como true
        this.seccionAux = true;
        //la variable aeuAux se setea como true
        this.aeuAux = true;
        //se llama al metodo cambiarPdfAeu()
        this.cambiarPdfAeu(1, 1);
      }
      //guarda la url
      this.url = this.area + '/' + this.tipo_cro + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
      //se llama al servicion getRegistro()
      this.croquisylistado.getRegistro(this.url).subscribe((data) => {
        //se asigna el valor del res a la variable registros2
        this.registros2 = <RegistroInterface>data;
      })
    } else {
      //guarda la url
      this.url = this.area + '/' + this.tipo_cro + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + "0" + '/';
      //se llama al servicion getRegistro()
      this.croquisylistado.getRegistro(this.url).subscribe((data) => {
        //se asigna el valor del res a la variable registros2
        this.registros2 = <RegistroInterfaceRural>data;
      });
      //se llama al servicion getRegistro()
      this.croquisylistado.getRegistro(this.url).subscribe((data) => {
        //se valida si el tipo_cro es igual de 1
        if (this.tipo_cro == 1) {
          //la variable aeuAuxRural se setea como falso
          this.aeuAuxRural = false;
          //se llama al metodo cambiarPdfSeccion()
          this.cambiarPdfSeccion(this.registros2[0].NUM_SEC);
        }
        //se valida si el tipo_cro es igual de 2
        if (this.tipo_cro == 2) {
          //la variable aeuAuxRural se setea como true
          this.aeuAuxRural = true;
          //se llama al metodo cambiarPdfAeu()
          this.cambiarPdfAeu(this.registros2[0].NUM_SEC, this.registros2[0].NUM_AERS);
        }
      });
    }
  }

  //funcion para cargar la ruta
  getRuta() {
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona;
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
      //se asigna la url a la variable urlSeccion
      this.urlSeccion = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/${this.zona}/1/${this.area}/`);
      //se asigna la url a la variable urlEmpadronador
      this.urlEmpadronador = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/${this.zona}/2/${this.area}/`);
    } else {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi;
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${urlCroquisAux}.pdf`);
      //se asigna la url a la variable urlSeccion
      this.urlSeccionRural = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/0/1/${this.area}/`);
      //se asigna la url a la variable urlEmpadronador
      this.urlEmpadronadorRural = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/0/2/${this.area}/`);
    }
  }

  //funcion para recargar el archivo .pdf (seccion)
  cambiarPdfSeccion(seccion) {
    //se asigna el valor de la seccion
    console.log(seccion);
    this.seccion = seccion;
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi) 
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3);
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } else {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + '-' + this.seccion;
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${urlCroquisAux}.pdf`);
    }
    //se declara el metodo del click para la tabla
    jQuery('#tablaCroAux tr').click(function () {
      //se recorre la tabla
      jQuery('#tablaCroAux tr').each(function () {
        //se remueve la clase
        jQuery(this).removeClass('intro')
      })
      //se agrega la clase
      jQuery(this).addClass('intro');
    });
  }

  //funcion para recargar el archivo .pdf (aeu)
  cambiarPdfAeu(seccion, aeu) {
    console.log(seccion,aeu);
    //se asigna el valor de la seccion
    console.log(seccion, aeu);
    this.seccion = seccion
    //se asigna el valor del aeu

    this.aeu = ('00' + aeu).slice(-3);
    //se construye el valor del ubigeo (ccdd + ccpp + ccdi)
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    //se valida si el area es igual a 0
    if (this.area == "0") {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3) + this.aeu;
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } else {
      //se asigna la url a la variable urlCroquisAux
      let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + '-' + this.seccion + '-' + this.aeu;
      //se asigna la url a la variable urlCroquis
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${ubigeo}-${seccion}-${aeu}.pdf`);
    }
    //se declara el metodo del click para la tabla
    jQuery('#tablaCroAux tr').click(function () {
      //se recorre la tabla
      jQuery('#tablaCroAux tr').each(function () {
        //se remueve la clase
        jQuery(this).removeClass('intro')
      })
      //se agrega la clase
      jQuery(this).addClass('intro');
    });
  }

  //funcion para procesar
  procesarCro() {
    //se inicializa la variable en vacio
    this.urlProcesar = '';
    //se valida si el area es distinto a 0
    if (this.zona != '0') {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.area + '/' + this.zona + '/';
    } else {
      //se construye el valor del urlProcesar (area + ccdd + ccpp + ccdi + zona)
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.area + '/' + '/0/';
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
  component: Croquisylistado
}];

//declaracion del NgModule
@NgModule({
  //importaciones
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule, ToastyModule.forRoot()],
  //declaraciones
  declarations: [Croquisylistado]
})

//exportaciones
export default class CroquisylistadoModule { }
