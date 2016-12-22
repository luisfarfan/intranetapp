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
export class ImpresionesService {
    constructor(private http: Http) {}

    /*private depaUrl: string = 'http://192.168.200.123:8081/segrecargaDepa/';
    private provUrl: string = 'http://192.168.200.123:8081/segrecargaProv/';
    private distUrl: string = 'http://192.168.200.123:8081/segrecargaDis/';
    private zonaUrl: string = 'http://192.168.200.123:8081/segrecargaZona/';
    //private tablaUrl: string = 'http://192.168.200.123:8081/segrecargaTabla/';
    private tablaUrlAux: string = 'http://192.168.200.123:8081/crorecargaTabla01/';
    private tablaUrlAux2: string = 'http://192.168.200.123:8081/crorecargaTabla02/';*/

    /*private depaUrl: string = 'http://172.18.1.40:8000/recargaDepa/';
    private provUrl: string = 'http://172.18.1.40:8000/recargaProv/';
    private distUrl: string = 'http://172.18.1.40:8000/recargaDis/';
    private zonaUrl: string = 'http://172.18.1.40:8000/recargaZona/';
    private tablaUrlAux: string = 'http://172.18.1.40:8000/crorecargaTabla01/';
    private tablaUrlAux2: string = 'http://172.18.1.40:8000/crorecargaTabla02/';
    private tablaUrlZip: string = 'http://172.18.1.40:8000/crodescargarPdf/';*/

    // private depaUrl: string = 'http://172.18.1.40:8000/recargaDepa/';
    // private provUrl: string = 'http://172.18.1.40:8000/recargaProv/';
    // private distUrl: string = 'http://172.18.1.40:8000/recargaDis/';
    // private zonaUrl: string = 'http://172.18.1.40:8000/recargaZona/';
    // private aeuUrl: string = 'http://172.18.1.40:8000/recargaAeu/';
    private tablaReporte: string = 'http://172.18.1.40:8000/tablaReporte/';
    // private a: string = 'http://172.16.2.185:8000/impresionesaeus/'; #cargardepas
    private cargardepas: string = 'http://172.16.2.185:8000/cargardepas/'; //cargardeprov
    private cargarprov: string = 'http://172.16.2.185:8000/cargardeprov/'; //cargardistrito
    private cargardistrito: string = 'http://172.16.2.185:8000/cargardistrito/';
    private cargarzonas: string = 'http://172.16.2.185:8000/cargarzonas/';
    private tablaAes: string = 'http://172.16.2.185:8000/cargaraes/';
    private cantAesUrl: string = 'http://172.16.2.185:8000/cantidadaeus/';   //cargaraes paginas
    private AesUrl: string = 'http://172.16.2.185:8000/cargaraes/';
    private NumPaginas: string = 'http://172.16.2.185:8000/paginas/';
    private cargarAeuSecc: string = 'http://172.16.2.185:8000/cargaraeusseccion/';
    private cargarSeccZonas: string = 'http://172.16.2.185:8000/cargarseccionzonas/';
    private cargarZonasDistrito: string = 'http://172.16.2.185:8000/cargarzonasdistritos/';
    getCargaDepaInicial(): Observable < Object >{
        return this.http.get(this.cargardepas).map(this.extractData).catch(this.handleError)
    }

        getDepartamentos(): Observable < Object > {
        return this.http.get(this.cargardepas).map(this.extractData).catch(this.handleError)
    }

    getProvincias(ccdd: string): Observable < Object > {
        let queryparameters:string = `${ccdd}/`;
        let url: string = this.cargarprov+queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getDistritos(ccdd: string, ccpp:string): Observable < Object > {
        let queryparameters:string = `${ccdd}/${ccpp}/`;
        let url: string = this.cargardistrito + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getZonas(ubigeo: string): Observable < Object > {
        let queryparameters:string = `${ubigeo}/`;
        let url: string = this.cargarzonas + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTabla(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.tablaReporte + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTablaAes(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.tablaAes + queryparameters;
        console.log(url);
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getCantAeus(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.cantAesUrl + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTablaAeus(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.AesUrl + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getSeccAeus(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.cargarAeuSecc + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getZonasSecc(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/${zona}/`;
        let url:string = this.cargarSeccZonas + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getDistritoZonas(ubigeo: string="0", zona: string="0"): Observable < Object > {
        let queryparameters:string = `${ubigeo}/`;
        let url:string = this.cargarZonasDistrito + queryparameters;
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
}