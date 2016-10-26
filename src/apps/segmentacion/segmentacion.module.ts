import {
  AfterViewInit,ElementRef,Component
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
import {Helpers} from './../../app/helper';
import {DataTableModule,SharedModule,ButtonModule} from 'primeng/primeng';
import {
  RegistroInterface
} from './registro.interface';


@Component({
  templateUrl: 'segmentacion.html',
  providers: [SegmentacionService]
})

class Segmentacion{

  private ccdd :any;
  private ccpp :any;
  private ccdi :any;
  private area :string="0";
  
  private urbanoZona :boolean=true;
  private ruralZona :boolean=false;

  private zona :any=0;
  private contador :number=0;
  private verZona=false;
  private url :string='';
  private urlProcesar :string='';
  private tabledata:boolean = false;
  private distrito:boolean = false;
  private registros:Object;
  private regTabla:Object;
  private registro:RegistroInterface;
  private departamentos:DepartamentoInterface;
  private provincias:ProvinciaInterface;
  private distritos:DistritoInterface;
  private zonas:ZonaInterface;

  constructor(private segmentacionservice: SegmentacionService, private elementRef: ElementRef) {
    this.cargarDepa()
    this.cargarTabla("0","0","0","0","0")
    this.registro = this.model
  }

  model = new RegistroInterface();

  cargarDepa() {
    if(this.ccdd!=0){
      this.segmentacionservice.getDepartamentos().subscribe(res => {
          this.departamentos = <DepartamentoInterface>res;
      })
    }    
  }

  cargarProvincias(ccdd: string, ccpp: string = "0") {
    this.ccdd = ccdd;
    this.distrito=false;
    this.verZona=false;
    if(this.ccdd!=0){
      this.segmentacionservice.getProvincias(ccdd, ccpp).subscribe(res => {
        this.provincias = < ProvinciaInterface > res;
      })
      this.cargarTabla("1",ccdd,"0","0","0")
    }else{
      this.provincias=null;
      this.distritos=null;
      this.zonas=null;
      this.cargarTabla("0","0","0","0","0")
    }     
  }

  cargarDistritos(ccpp: string) {
    this.ccpp=ccpp;
    this.distrito=false;
    this.verZona=false;
    if(this.ccpp!=0){
      this.segmentacionservice.getDistritos(this.ccdd, ccpp,"0").subscribe(res => {
        this.distritos = < DistritoInterface > res;
      })
      this.cargarTabla("2",this.ccdd,ccpp,"0","0")
    }else{
      this.distritos=null;
      this.zonas=null;
      this.cargarTabla("1",this.ccdd,"0","0","0")
    }    
  }

  cambiarArea(area: string){
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
    this.verZona=false;
    let ubigeo = this.ccdd + this.ccpp + ccdi;
    this.distrito = true;
    if(this.ccdi!=0){
      this.segmentacionservice.getZonas(ubigeo).subscribe(res => {
        this.zonas = < ZonaInterface > res;
      })
      this.cargarTabla("3",this.ccdd,this.ccpp,this.ccdi,"0")
    }else{
      this.zonas=null;
      this.distrito=false;
      this.cargarTabla("2",this.ccdd,this.ccpp,"0","0")
    }
  }

  cargarAeu(zona: string) {
    this.verZona=true;
    this.zona=zona;
    if(zona!="0"){
      this.cargarTabla("4",this.ccdd,this.ccpp,this.ccdi,this.zona)
    }else{
      this.verZona=false;
      this.cargarTabla("3",this.ccdd,this.ccpp,this.ccdi,"0")
    }
  }

  cargarTabla(tipo: string, ccdd: string, ccpp: string, ccdi: string, zona: string){
    if(this.area=="0"){
      this.segmentacionservice.getTabla(tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        this.registros= < RegistroInterface > res;      
      })
    }else{
      this.segmentacionservice.getTabla(tipo, ccdd, ccpp, ccdi, zona).subscribe(res => {
        this.registros= null;      
      })
    }
    
  }

  getRegistro() {
    this.url = '4/' + this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    this.segmentacionservice.getRegistro(this.url).subscribe((data) => {
      this.registro = < RegistroInterface > data
      this.model.DEPARTAMENTO = this.registro[0].DEPARTAMENTO;
      this.model.PROVINCIA = this.registro[0].PROVINCIA;
      this.model.DISTRITO = this.registro[0].DISTRITO;
      this.model.NUM_SEC = this.registro[0].NUM_SEC;
      this.model.NUM_AEU = this.registro[0].NUM_AEU;
      this.model.ZONA = this.registro[0].ZONA;
      this.model.EST_SEG = this.registro[0].EST_SEG;
    })
  }

  procesarSeg(){
    this.urlProcesar = '';
    if(this.zona!='0'){
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/' + this.zona + '/';
    }else{
      this.urlProcesar = this.ccdd + '/' + this.ccpp + '/' + this.ccdi + '/0/';
    }
    alert("PROCESANDO SEGMENTACION: "+this.urlProcesar)
  }

  descargarExcel(id,nom){
    Helpers.descargarExcel(id,nom);
  }  

}

const routes: Routes = [{
  path: '',
  component: Segmentacion
}];

@NgModule({
  imports: [CommonModule,RouterModule.forChild(routes), FormsModule, DataTableModule,SharedModule,ButtonModule],
  declarations: [Segmentacion]
})
export default class SegmentacionModule {}