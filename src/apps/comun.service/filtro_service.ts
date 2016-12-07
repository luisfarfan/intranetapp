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

@Injectable()
export class FiltroService {
    constructor(private http: Http) { }
    private depaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDepa/';
    private provUrl: string = 'http://lfarfan.inei.com.pe:81/recargaProv/';
    private distUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDis/';
    private zonaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaZona/';
    private tablaUrlAux: string = 'http://lfarfan.inei.com.pe:81/segrecargaTabla01/';

    getDepartamentos(): Observable<Object> {
        return this.http.get(this.depaUrl).map(Helpers.extractData).catch(Helpers.handleError)
    }

    getProvincias(ccdd: string, ccpp: string): Observable<Object> {
        let queryparameters: string = `${ccdd}/${ccpp}/`;
        let url: string = this.provUrl + queryparameters;
        console.log(url);
        return this.http.get(url).map(Helpers.extractData).catch(Helpers.handleError);
    }

    getDistritos(ccdd: string, ccpp: string, ccdi: string): Observable<Object> {
        let queryparameters: string = `${ccdd}/${ccpp}/${ccdi}/`;
        let url: string = this.distUrl + queryparameters;
        console.log(url);
        return this.http.get(url).map(Helpers.extractData).catch(Helpers.handleError);
    }

    getZonas(ubigeo: string): Observable<Object> {
        let queryparameters: string = `${ubigeo}/`;
        let url: string = this.zonaUrl + queryparameters;
        return this.http.get(url).map(Helpers.extractData).catch(Helpers.handleError);
    }

}