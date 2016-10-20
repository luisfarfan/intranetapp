import {
    Injectable
} from '@angular/core';
import {
    Http,
    Response
} from '@angular/http';
import {
    Headers,
    RequestOptions,
    RequestMethod,
    Request
} from '@angular/http';

import {
    Observable
} from 'rxjs/Observable';
// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ControldecalidadService {
    constructor(private http: Http) {}

    /*private depaUrl: string = 'http://192.168.200.123:8081/recargaDepa/';
    private provUrl: string = 'http://192.168.200.123:8081/recargaProv/';
    private distUrl: string = 'http://192.168.200.123:8081/recargaDis/';
    private zonaUrl: string = 'http://192.168.200.123:8081/recargaZona/';
    private tablaUrl: string = 'http://192.168.200.123:8081/recargaTabla/';
    private tablaUrlAux: string = 'http://192.168.200.123:8081/recargaTabla01/';*/


    private depaUrl: string = 'http://bromero.inei.com.pe:8000/recargaDepa/';
    private provUrl: string = 'http://bromero.inei.com.pe:8000/recargaProv/';
    private distUrl: string = 'http://bromero.inei.com.pe:8000/recargaDis/';
    private zonaUrl: string = 'http://bromero.inei.com.pe:8000/recargaZona/';
    private tablaUrlAux: string = 'http://bromero.inei.com.pe:8000/calidadrecargaTabla01/';
    private tablaUrlAux2: string = 'http://bromero.inei.com.pe:8000/calidadrecargaTabla02/';
    private tablaReporte: string = 'http://bromero.inei.com.pe:8000/tablaReporte/';
    
    /*private depaUrl: string = 'http://bromero.inei.com.pe:8090/recargaDepa/';
    private provUrl: string = 'http://bromero.inei.com.pe:8090/recargaProv/';
    private distUrl: string = 'http://bromero.inei.com.pe:8090/recargaDis/';
    private zonaUrl: string = 'http://bromero.inei.com.pe:8090/recargaZona/';
    private tablaUrlAux: string = 'http://bromero.inei.com.pe:8090/calidadrecargaTabla01/';*/

    getCargaDepaInicial(): Observable < Object >{
        return this.http.get(this.depaUrl).map(this.extractData).catch(this.handleError)
    }

    getDepartamentos(): Observable < Object > {
        return this.http.get(this.depaUrl).map(this.extractData).catch(this.handleError)
    }

    getProvincias(ccdd: string, ccpp:string): Observable < Object > {
        let queryparameters:string = `${ccdd}/${ccpp}/`;
        let url: string = this.provUrl+queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getDistritos(ccdd: string, ccpp:string, ccdi:string): Observable < Object > {
        let queryparameters:string = `${ccdd}/${ccpp}/${ccdi}/`;
        let url: string = this.distUrl + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getZonas(ubigeo: string): Observable < Object > {
        let queryparameters:string = `${ubigeo}/`;
        let url: string = this.zonaUrl + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTabla(tipo: string="0", ccdd: string="0", ccpp: string="0", ccdi: string="0" ,zona: string="0"): Observable < Object > {
        let queryparameters:string = `${tipo}/${ccdd}/${ccpp}/${ccdi}/${zona}/`;
        let url:string = this.tablaUrlAux + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTablaAux(tipo: string="0", ccdd: string="0", ccpp: string="0", ccdi: string="0"): Observable < Object > {
        let queryparameters:string = `${tipo}/${ccdd}${ccpp}${ccdi}/`;
        let url:string = this.tablaReporte + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    
    getRegistro(url:string=''): Observable < Object > {
        let tablaUrlAux3 = this.tablaUrlAux2 + url;
        if(url!=''){
            return this.http.get(tablaUrlAux3).map(this.extractData)
        }else{
            return this.http.get(this.tablaUrlAux).map(this.extractData)
        }        
    }
}