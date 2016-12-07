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
import { Helpers } from './../../app/helper';
import {
    IndicadoresInterface
} from './IndicadoresInterface.interface';

@Injectable()
export class ControldecalidadService {
    constructor(private http: Http) { }

    private depaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDepa/';
    private provUrl: string = 'http://lfarfan.inei.com.pe:81/recargaProv/';
    private distUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDis/';
    private zonaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaZona/';
    private tablaUrlAux: string = 'http://lfarfan.inei.com.pe:81/calidadrecargaTabla01/';
    private tablaUrlAux2: string = 'http://lfarfan.inei.com.pe:81/calidadrecargaTabla02/';
    private tablaUrlAux4: string = 'http://lfarfan.inei.com.pe:81/CalidadList/';
    private tablaReporte: string = 'http://lfarfan.inei.com.pe:81/tablaReporte/';
    private tablaIndicador: string = 'http://lfarfan.inei.com.pe:81/tablaIndicador/';

    private guardarObservaciones: string = 'http://lfarfan.inei.com.pe:81/tablaIndicador2/';
    private guardarIndicador: string = 'http://lfarfan.inei.com.pe:81/tablaIndicador3/';

    /*private depaUrl: string = 'http://bromero.inei.com.pe:8090/recargaDepa/';
    private provUrl: string = 'http://bromero.inei.com.pe:8090/recargaProv/';
    private distUrl: string = 'http://bromero.inei.com.pe:8090/recargaDis/';
    private zonaUrl: string = 'http://bromero.inei.com.pe:8090/recargaZona/';
    private tablaUrlAux: string = 'http://bromero.inei.com.pe:8090/calidadrecargaTabla01/';*/

    getCargaDepaInicial(): Observable<Object> {
        return this.http.get(this.depaUrl).map(this.extractData).catch(this.handleError)
    }

    getDepartamentos(tipo: string = "0"): Observable<Object> {
        //variable que retorna
        let url: string = `${this.depaUrl}${tipo}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los provincias
    getProvincias(ccdd: string, ccpp: string, tipo: string = "0"): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/${ccpp}/${tipo}/`;
        //variable local para la ruta
        let url: string = this.provUrl + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los distritos
    getDistritos(ccdd: string, ccpp: string, ccdi: string, tipo: string = "0"): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/${ccpp}/${ccdi}/${tipo}/`;
        //variable local para la ruta
        let url: string = this.distUrl + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getZonas(ubigeo: string): Observable<Object> {
        let queryparameters: string = `${ubigeo}/`;
        let url: string = this.zonaUrl + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTabla(area: string = "0", tipo: string = "0", ccdd: string = "0", ccpp: string = "0", ccdi: string = "0", zona: string = "0"): Observable<Object> {
        let queryparameters: string = `${area}/${tipo}/${ccdd}/${ccpp}/${ccdi}/${zona}/`;
        let url: string = this.tablaUrlAux + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    getTablaAux(tipo: string = "0", ccdd: string = "0", ccpp: string = "0", ccdi: string = "0"): Observable<Object> {
        let queryparameters: string = `${tipo}/${ccdd}${ccpp}${ccdi}/`;
        let url: string = this.tablaReporte + queryparameters;
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

    getRegistro(url: string = ''): Observable<Object> {
        let tablaUrlAux3 = this.tablaUrlAux2 + url;
        if (url != '') {
            return this.http.get(tablaUrlAux3).map(this.extractData).catch(this.handleError)
        } else {
            return this.http.get(tablaUrlAux3).map(this.extractData).catch(this.handleError)
        }
    }

    obtenerIndicadores(area: string = "", ubigeo: string = "", zona: string = "", aeu: string = "") {
        let queryparameters: string = `${area}/${ubigeo}/${zona}/${aeu}/`;
        let url: string = this.tablaIndicador + queryparameters;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    guardarObservacion(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.guardarObservaciones, body, options).map(Helpers.extractData).catch(Helpers.handleError);
    }

    guardarIndicadores(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.guardarIndicador, body, options).map(Helpers.extractData).catch(Helpers.handleError);
    }
}