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

import {
    Settings
} from './../../app/app.settings';
import { Helpers } from './../../app/helper';

@Injectable()
export class RegistroService {
    dpto_url: string = `${Settings.HOST_LOCAL()}departamentos/`;
    prov_url: string = `${Settings.HOST_LOCAL()}provincias/`;
    dist_url: string = `${Settings.HOST_LOCAL()}distritos/`;

    constructor(private http: Http) { }

    getDepartamentos(): Observable<Object> {
        return this.http.get(this.dpto_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getProvincias(ccdd: string): Observable<Object> {
        return this.http.get(this.prov_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getDistritos(ccdd: string, ccpp: string): Observable<Object> {
        return this.http.get(this.dist_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }



}