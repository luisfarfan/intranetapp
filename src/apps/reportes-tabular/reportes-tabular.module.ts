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
  ReportestabularService
} from './reportes-tabular.service';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  FormsModule
} from '@angular/forms';
import {
  Reporte01Interface
} from './reporte01.interface';
import {
  Reporte02Interface
} from './reporte02.interface';
import {
  Reporte03Interface
} from './reporte03.interface';
import {
  Reporte04Interface
} from './reporte04.interface';
import {
  Reporte05Interface
} from './reporte05.interface';
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
import { DomSanitizer } from "@angular/platform-browser";
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';

//Declaracion del componente
@Component({
  templateUrl: 'reportes-tabular.html',
  styles: [`.intro { 
    background-color: #A9E2F3;
}`],
  providers: [ReportestabularService]
})

class Reportestabular {

  //variables globables...
  private ccdd: any; //codigo del departamento
  private ccpp: any; //codigo de la provincia
  private ccdi: any; //codigo del distrito
  private zona: any = 0; //codigo de la zona

  private aeu: any = 0; //area de empadronamiento urbano
  private verZona = false; //variable que muestra la zona
  private url: string = ''; //guarda la url
  private urlCroquis: any; //guarda el url del croquis
  private urlProcesar: any; //guarda el url que se usara en el proceso
  private tipo_cro: number = 0; //guarda el tipo de croquis
  private tabledata: boolean = false; //
  private distrito: boolean = false; //
  private area: string = "0";

  private registros: Object; //variable que guardara los registros
  private registro: RegistroInterface; //variable que guardara el registro

  private departamentos: DepartamentoInterface; //variable que guardara los departamentos
  private provincias: ProvinciaInterface; //variable que guardara las provincias
  private distritos: DistritoInterface; //variable que guardara los distritos
  private zonas: ZonaInterface; //variable que guardara las zonas

  private reporteDepa: boolean = true; //variable que muestra el reporte
  private reporteDepa01: boolean = false; //variable que muestra el reporte 

  private reporte01: boolean = true; //variable que muestra el reporte 01
  private reporte02: boolean = false; //variable que muestra el reporte 02
  private reporte03: boolean = false; //variable que muestra el reporte 03
  private reporte04: boolean = false; //variable que muestra el reporte 04
  private reporte05: boolean = false; //variable que muestra el reporte 05

  private tipo: string = ''; //variable que guarda el tipo

  private datareporte01: Reporte01Interface; //variable que guarda el reporte 01
  private datareporte02: Reporte02Interface; //variable que guarda el reporte 02
  private datareporte03: Reporte03Interface; //variable que guarda el reporte 03
  private datareporte04: Reporte04Interface; //variable que guarda el reporte 04
  private datareporte05: Reporte05Interface; //variable que guarda el reporte 05

  //constructor...
  constructor(private reportestabular: ReportestabularService, private elementRef: ElementRef, private domSanitizer: DomSanitizer) {
    //se llama al metodo cargarDepa()
    this.cargarDepa(this.area);
    //se asigna el model al registro
    this.registro = this.model;
  }

  //se incializa el model como un RegistroInterface
  model = new RegistroInterface();

  //funcion para cargar los departamentos
  cargarDepa(area) {
    //se llama al servicion getDepartamentos()
    this.reportestabular.getDepartamentos(area).subscribe(res => {
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
    //se pone el valor de los datareporte01 en null
    this.datareporte01 = null;
    //se pone el valor de los datareporte02 en null
    this.datareporte02 = null;
    //se pone el valor de los datareporte03 en null
    this.datareporte03 = null;
    //se pone el valor de los datareporte04 en null
    this.datareporte04 = null;
    //se pone el valor de los datareporte05 en null
    this.datareporte05 = null;
    //se valida si el ccpp es departamento a 0
    if (this.ccdd != 0) {
      //se llama al servicion getProvincias()
      this.reportestabular.getProvincias(ccdd, ccpp).subscribe(res => {
        //se asigna el valor del res a la variable provincias
        this.provincias = <ProvinciaInterface>res;
      })
      //se llama al metodo cargarTabla2()
      this.cargarTablaAux2();
    } else {
      //se pone el valor de las provincias en null
      this.provincias = null;
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
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
    //se pone el valor de los datareporte01 en null
    this.datareporte01 = null;
    //se pone el valor de los datareporte02 en null
    this.datareporte02 = null;
    //se pone el valor de los datareporte03 en null
    this.datareporte03 = null;
    //se pone el valor de los datareporte04 en null
    this.datareporte04 = null;
    //se pone el valor de los datareporte05 en null
    this.datareporte05 = null;
    //se valida si el ccpp es distinto de 0
    if (this.ccpp != 0) {
      //se llama al servicio getDistritos()
      this.reportestabular.getDistritos(this.ccdd, ccpp, "0").subscribe(res => {
        //se asigna el valor del res a la variable distritos
        this.distritos = <DistritoInterface>res;
      });
      //se llama al metodo cargarTablaAux()
      this.cargarTablaAux();
    } else {
      //se pone el valor de los distritos en null
      this.distritos = null;
      //se pone el valor de las zonas en null
      this.zonas = null;
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
    //se valida si el ccdi es distinto de 0
    if (this.ccdi != 0) {
      //se llama al servicion getZonas()
      this.reportestabular.getZonas(ubigeo).subscribe(res => {
        //se asigna el valor del res a la variable zonas
        this.zonas = <ZonaInterface>res;
      })
    } else {
      //se pone el valor de las zonas en null
      this.zonas = null;
      //la variable distrito se setea como falso
      this.distrito = false;
    }
  }

  //funcion para cargar la tabla
  cargarTabla(ccdi: string) {
    //se asigna el valor del codigo del distrito
    this.ccdi = ccdi;
    //valida el reporte01 (verdadero entra)
    if (this.reporte01) {
      //asigna el valor a tipo = 0
      this.tipo = '0';
    }
    //valida el reporte02 (verdadero entra)
    if (this.reporte02) {
      //asigna el valor a tipo = 1
      this.tipo = '1';
    }
    //valida el reporte03 (verdadero entra)
    if (this.reporte03) {
      //asigna el valor a tipo = 2
      this.tipo = '2';
    }
    //se llama al servicion getTabla()
    this.reportestabular.getTabla(this.tipo, this.ccdd, this.ccpp, this.ccdi).subscribe(res => {
      //la variable tabledata se setea como true
      this.tabledata = true;
      //valida el reporte01 (verdadero entra)
      if (this.reporte01) {
        //se asigna el valor del res a la variable datareporte01
        this.datareporte01 = <Reporte01Interface>res;
      }
      //valida el reporte02 (verdadero entra)
      if (this.reporte02) {
        //se asigna el valor del res a la variable datareporte02
        this.datareporte02 = <Reporte02Interface>res;
      }
      //valida el reporte03 (verdadero entra)
      if (this.reporte03) {
        //se asigna el valor del res a la variable datareporte03
        this.datareporte03 = <Reporte03Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  cargarTablaAux() {
    //asigna el valor a tipo = 3
    this.tipo = '3';
    //valida el reporte04 (verdadero entra)
    if (this.reporte04) {
      //asigna el valor a tipo = 3
      this.tipo = '3';
    }
    //se llama al servicion getTabla()
    this.reportestabular.getTabla(this.tipo, this.ccdd, this.ccpp, '0').subscribe(res => {
      //valida el reporte04 (verdadero entra)
      if (this.reporte04) {
        //se asigna el valor del res a la variable datareporte04
        this.datareporte04 = <Reporte04Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  cargarTablaAux2() {
    //asigna el valor a tipo = 4
    this.tipo = '4';
    //valida el reporte05 (verdadero entra)
    if (this.reporte05) {
      //asigna el valor a tipo = 4
      this.tipo = '4';
    }
    //se llama al servicion getTabla()
    this.reportestabular.getTabla(this.tipo, this.ccdd, this.ccpp, '0').subscribe(res => {
      //valida el reporte04 (verdadero entra)
      if (this.reporte05) {
        //se asigna el valor del res a la variable datareporte05
        this.datareporte05 = <Reporte05Interface>res;
      }
    })
  }

  //funcion para cargar la tabla
  elegirReporte(reporte) {
    //asigna el valor a reporte01 = false
    this.reporte01 = false;
    //asigna el valor a reporte02 = false
    this.reporte02 = false;
    //asigna el valor a reporte03 = false
    this.reporte03 = false;
    //asigna el valor a reporte04 = false
    this.reporte04 = false;
    //asigna el valor a reporte05 = false
    this.reporte05 = false;
    //asigna el valor a reporteDepa = false
    this.reporteDepa = false;
    //asigna el valor a reporteDepa01 = false
    this.reporteDepa01 = false;
    //valida el reporte (0 o 1 o 2)
    if (reporte == "0" || reporte == "1" || reporte == "2") {
      switch (reporte) {
        //tipo de reporte (0 , 1 , 2)
        case "0": this.reporte01 = true; break;
        case "1": this.reporte02 = true; break;
        case "2": this.reporte03 = true; break;
      }
      //se llama al metodo cargarTabla()
      this.cargarTabla(this.ccdi);
      //asigna el valor a reporteDepa = true
      this.reporteDepa = true;
      //asigna el valor a reporteDepa01 = true
      this.reporteDepa01 = true;
    }
    //valida el reporte (3)
    if (reporte == "3") {
      //asigna el valor a reporte04 = true
      this.reporte04 = true;
      //se llama al metodo cargarTabla()
      this.cargarTablaAux();
      //asigna el valor a reporteDepa01 = true
      this.reporteDepa01 = true;
    }
    //valida el reporte (4)
    if (reporte == "4") {
      //asigna el valor a reporte05 = true
      this.reporte05 = true;
      //se llama al metodo cargarTabla()
      this.cargarTablaAux2();
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
  component: Reportestabular
}];

//declaracion del NgModule
@NgModule({
  //importaciones
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, DataTableModule, SharedModule, ButtonModule],
  //declaraciones
  declarations: [Reportestabular]
})

//exportaciones
export default class ReportestabularModule { }
