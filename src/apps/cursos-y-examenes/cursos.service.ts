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
export class CursosService {
    capa_url: string = `${Settings.HOST_LOCAL()}api/capacitacion/`;

    constructor(private http: Http) { }

    get(pk = null): Observable<Object> {
        return this.http.get(pk != null ? `${this.capa_url}${pk}/` : this.capa_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    edit(pk, data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.capa_url + pk + '/', body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }

    add(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.capa_url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }
    delete(pk): Observable<Object> {
        return this.http.delete(`${this.capa_url}${pk}/`)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }



}