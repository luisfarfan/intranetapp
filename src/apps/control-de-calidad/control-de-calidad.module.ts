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
  ControldecalidadService
} from './control-de-calidad.service';
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
import {
  Reporte01Interface
} from './reporte01.interface';
import {
  Reporte03Interface
} from './reporte03.interface';

declare var jQuery;

@Component({
  templateUrl: 'control-de-calidad.html',
  styles: [`.intro { 
    background-color: #A9E2F3;
  }`],
  providers: [ControldecalidadService]
})

class Controldecalidad {

  private ccdd: any;
  private ccpp: any;
  private ccdi: any;
  private zona: any = 0;
  private area: string="0";

  private urbanoZona :boolean=true;
  private ruralZona :boolean=false;

  private tipo_cro: number = 0;
  private contador: number = 0;
  private verZona = false;
  private url: string = '';
  private urlProcesar: string = '';
  private tabledata: boolean = false;
  private distrito: boolean = false;
  private registros: Object;
  private regTabla: Object;
  private registro: RegistroInterface;
  private departamentos: DepartamentoInterface;
  private provincias: ProvinciaInterface;
  private distritos: DistritoInterface;
  private zonas: ZonaInterface;
  private seccionAux: boolean = false;
  private aeuAux: boolean = false;
  private abc: boolean = true;
  private verZonaPrevia: boolean = false;
  private tablaaa: any;
  private tablaaa1: any;
  private registros2: Object;
  private obser: boolean = false;
  private aeu: any = 0;
  private seccion: any = 0;
  private urlCroquis: any;
  private urlSeccion: any = "";
  private urlEmpadronador: any = "";
  private datareporte01: Reporte01Interface;
  private datareporte03: Reporte03Interface;
  private tipo: string = '';

  private verDistrito: boolean=false;

  constructor(private controldecalidadservice: ControldecalidadService, private elementRef: ElementRef, private domSanitizer: DomSanitizer) {
    this.cargarDepaInicial()
    this.cargarTabla("0", "0", "0", "0", "0")
    this.registro = this.model
  }

  model = new RegistroInterface();

  cargarDepaInicial() {
    this.controldecalidadservice.getDepartamentos().subscribe(res => {
      this.departamentos = <DepartamentoInterface>res;
    })
  }

  cargarDepa() {
    if (this.ccdd != 0) {
      this.controldecalidadservice.getDepartamentos().subscribe(res => {
        this.departamentos = <DepartamentoInterface>res;
      })
    }
  }

  cargarProvincias(ccdd: string, ccpp: string = "0") {
    this.ccdd = ccdd;
    this.distrito = false;
    this.verDistrito=false;
    this.verZona = false;
    this.verZonaPrevia = false;
    if (this.ccdd != 0) {
      this.controldecalidadservice.getProvincias(ccdd, ccpp).subscribe(res => {
        this.provincias = <ProvinciaInterface>res;
      })
      this.cargarTabla("1", ccdd, "0", "0", "0")
    } else {
      this.provincias = null;
      this.distritos = null;
      this.zonas = null;
      this.cargarTabla("0", "0", "0", "0", "0")
    }
  }

  cargarDistritos(ccpp: string) {
    this.verDistrito=false;
    this.ccpp = ccpp;
    this.distrito = false;
    this.verZona = false;
    this.verZonaPrevia = false;
    if (this.ccpp != 0) {
      this.controldecalidadservice.getDistritos(this.ccdd, ccpp, "0").subscribe(res => {
        this.distritos = <DistritoInterface>res;
      })
      this.cargarTabla("2", this.ccdd, ccpp, "0", "0")
    } else {
      this.distritos = null;
      this.zonas = null;
      this.cargarTabla("1", this.ccdd, "0", "0", "0")
    }
  }

  cambiarArea(area: string){
    this.verDistrito=false;
    this.verZona = false;
    this.area = area;
    if(this.area=="0"){
      this.urbanoZona=true;
      this.ruralZona=false;
    }else{
      this.urbanoZona=false;
      this.ruralZona=true;
    }
    this.cargarDepa()
    this.cargarTabla("0","0","0","0","0") //se debe cambiar el query para cada area (urbana / rural)
    this.provincias=null;
    this.distritos=null;
    this.zonas=null;   
  }

  cargarZonas(ccdi: string) {
    this.ccdi = ccdi;
    this.verZona = false;
    let ubigeo = this.ccdd + this.ccpp + ccdi;
    this.distrito = true;
    if (this.ccdi != 0) {
      if(this.area=="1"){        
        this.verDistrito=true;
      }
      this.controldecalidadservice.getZonas(ubigeo).subscribe(res => {
        this.zonas = <ZonaInterface>res;
      })
      this.verZonaPrevia = true;
      this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    } else {
      this.verDistrito=false;
      this.zonas = null;
      this.distrito = false;
      this.verZonaPrevia = false;
      this.cargarTabla("2", this.ccdd, this.ccpp, "0", "0")
    }
    this.cargarTablaAux();
  }

  cargarAeu(zona: string) {
    this.verZona = true;
    this.zona = zona;
    if (zona != "0") {
      this.cargarTabla("4", this.ccdd, this.ccpp, this.ccdi, this.zona)
    } else {
      this.verZona = false;
      this.cargarTabla("3", this.ccdd, this.ccpp, this.ccdi, "0")
    }
  }

  cargarTabla(tipo: string, ccdd: string, ccpp: string, ccdi: string, zona: string) {
    if(this.area=="0"){
      this.controldecalidadservice.getTabla(tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        this.registros = <RegistroInterface>res;
      })
    }else{
      this.controldecalidadservice.getTabla(tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        this.registros = <RegistroInterface>res;//null;
      })
    }
  }

  getRegistro(tipo_cro) {
    this.tipo_cro = tipo_cro;
    if (this.tipo_cro == 0) {
      this.obser = false;
      this.seccionAux = false;
      this.aeuAux = false;
      this.getRuta();
    }
    if (this.tipo_cro == 1) {
      this.obser = false;
      this.seccionAux = true;
      this.aeuAux = false;
      this.cambiarPdfSeccion(1);
    }
    if (this.tipo_cro == 2) {
      this.obser = true;
      this.seccionAux = true;
      this.aeuAux = true;
      this.cambiarPdfAeu(1, 1);
    }
    this.url = this.tipo_cro + '/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    this.controldecalidadservice.getRegistro(this.url).subscribe((data) => {
      this.registros2 = <RegistroInterface>data;
    })
  }

  getRuta() {
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona;
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    if(this.area=="0"){
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }else{
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    } 
    this.urlSeccion = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/${this.zona}/1/${this.area}/`);
    this.urlEmpadronador = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://172.16.2.205:8000/descargarPdf/${ubigeo}/${this.zona}/2/${this.area}/`);
  }

  cambiarPdfSeccion(seccion) {
    this.seccion = seccion;
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3);
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    if(this.area=="0"){
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }else{
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }
    jQuery('#tablaCroAux tr').click(function () {
      jQuery('#tablaCroAux tr').each(function () {
        jQuery(this).removeClass('intro')
      })
      jQuery(this).addClass('intro');
    });
  }

  cambiarPdfAeu(seccion, aeu) {
    this.seccion = seccion;
    this.aeu = aeu;
    let urlCroquisAux = this.ccdd + this.ccpp + this.ccdi + this.zona + ('00' + this.seccion).slice(-3) + this.aeu;
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    if(this.area=="0"){
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/urbano/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }else{
      this.urlCroquis = this.domSanitizer.bypassSecurityTrustResourceUrl(`http://192.168.221.123/desarrollo/cpv2017/segm_esp/rural/${ubigeo}/${this.zona}/${urlCroquisAux}.pdf`);
    }
    jQuery('#tablaCroAux tr').click(function () {
      jQuery('#tablaCroAux tr').each(function () {
        jQuery(this).removeClass('intro')
      })
      jQuery(this).addClass('intro');
    });
  }

  cargarTablaAux() {
    this.controldecalidadservice.getTablaAux('0', this.ccdd, this.ccpp, this.ccdi).subscribe(res => {
      this.datareporte01 = <Reporte01Interface>res;
      })
    this.controldecalidadservice.getTablaAux('2', this.ccdd, this.ccpp, this.ccdi).subscribe(res => {
      this.datareporte03 = <Reporte03Interface>res;
      })        
  }

  guardarObs(){
    let ubigeo = this.ccdd + this.ccpp + this.ccdi;
    var texto = jQuery("textarea#comentario").val();
    let data = {ubigeo:ubigeo,zona:this.zona,aeu:this.aeu,texto:texto}
    this.controldecalidadservice.guardarObservacion(data).subscribe(res => {      
    })
  }

  guardarInd(){
    
  }

  descargarExcel(id, nom) {
    Helpers.descargarExcel(id, nom);    
  }

}

const routes: Routes = [{
  path: '',
  component: Controldecalidad
}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule],
  declarations: [Controldecalidad]
})
export default class ControldecalidadModule { }