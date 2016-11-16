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
    local_url: string = `${Settings.HOST_LOCAL()}api/local/`;
    localubigeo_url: string = `${Settings.HOST_LOCAL()}localubigeo/`;
    etapa_url: string = `${Settings.HOST_LOCAL()}api/etapa/`;
    cursos_url: string = `${Settings.HOST_LOCAL()}cursosetapa/`;
    aula_url: string = `${Settings.HOST_LOCAL()}api/aula/`;
    aulabylocal_url: String = `${Settings.HOST_LOCAL()}aulabylocal/`;

    constructor(private http: Http) { }

    getDepartamentos(): Observable<Object> {
        return this.http.get(this.dpto_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getProvincias(ccdd: string): Observable<Object> {
        return this.http.get(`${this.prov_url}${ccdd}`)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getDistritos(ccdd: string, ccpp: string): Observable<Object> {
        return this.http.get(`${this.dist_url}${ccdd}/${ccpp}`)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getEtapa(): Observable<Object> {
        return this.http.get(this.etapa_url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getCursosbyEtapa(idetapa: any): Observable<Object> {
        return this.http.get(`${this.cursos_url}${idetapa}/`)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    addLocal(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.local_url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }
    editLocal(pk, data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let url: string = `${this.local_url}${pk}/`;
        return this.http.put(url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }

    deleteLocal(pk): Observable<Object> {
        let url: string = `${this.local_url}${pk}/`;
        return this.http.delete(url)
            .map(() => null)
            .catch(Helpers.handleError)
    }

    getLocal(param): Observable<Object> {
        let url: string = `${this.localubigeo_url}${param}/`;
        return this.http.get(url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    getAula(param = null): Observable<Object> {
        let url = param != null ? `${this.aulabylocal_url}${param}/` : this.aula_url;

        return this.http.get(url)
            .map(Helpers.extractData)
            .catch(Helpers.handleError)
    }

    addAula(data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.aula_url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }
    editAula(pk, data): Observable<Object> {
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let url: string = `${this.aula_url}${pk}/`;
        return this.http.put(url, body, options)
            .map(Helpers.extractData)
            .catch(Helpers.handleError);
    }

    deleteAula(pk): Observable<Object> {
        let url: string = `${this.aula_url}${pk}/`;
        return this.http.delete(url)
            .map(() => null)
            .catch(Helpers.handleError)
    }

}
