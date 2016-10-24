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
export class CursoCriterioService {
    url: string = `${Settings.HOST_LOCAL()}api/capacitacionCriterioEvaluacion/`;
    url2: string = `${Settings.HOST_LOCAL()}criteriosbycapacitacion/`;
    constructor(private http: Http) { }

    get(pk = null): Observable<Object> {
        return this.http.get(pk != null ? `${this.url}${pk}/` : this.url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getby(pk) {
        return this.http.get(pk != null ? `${this.url2}${pk}/` : this.url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    edit(pk, data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.url + pk + '/', body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }

    add(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }
    delete(pk): Observable<Object> {
        return this.http.delete(`${this.url}${pk}/`)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }



}