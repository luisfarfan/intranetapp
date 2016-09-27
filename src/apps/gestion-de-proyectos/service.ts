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
import {Helpers} from './../../app/helper';

@Injectable()
export class GestionProyectosService {
    constructor(private http: Http) {}
    private proyectos_url: string = `${Settings.HOST()}api/v1/proyectos/`;

    getProyectos_list(): Observable < Object > {
        return this.http.get(this.proyectos_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }
    getProyectos_detail(pk): Observable < Object > {
        return this.http.get(this.proyectos_url + pk)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }
}