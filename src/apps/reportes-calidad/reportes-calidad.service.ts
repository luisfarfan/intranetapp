//Librerias importadas...
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
export class ReportescalidadService {

    //constructor
    constructor(private http: Http) { }

    //urls de los servicios
    private depaUrl: string = 'http://172.16.2.185:8000/cargardepas/';
    private provUrl: string = 'http://172.16.2.185:8000/cargardeprov/';
    private distUrl: string = 'http://172.16.2.185:8000/cargardistrito/';
    private zonaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaZona/';
    //private tablaReporte: string = 'http://172.16.2.185:8000/tablaReportetabular/'; //tablaReporte
    private tablaReporte: string = 'http://172.16.2.185:8000/tablaReporte/';
    //funcion que obtiene los departamentos
    getCargaDepaInicial(): Observable<Object> {
        //variable que retorna
        return this.http.get(this.depaUrl).map(this.extractData).catch(this.handleError)
    }

    getDepartamentos(tipo: string = "0"): Observable<Object> {
        //variable que retorna
        let url: string = `${this.depaUrl}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los provincias
    getProvincias(ccdd: string): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/`;
        //variable local para la ruta
        let url: string = this.provUrl + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los distritos
    getDistritos(ccdd: string, ccpp:string): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/${ccpp}/`;
        //variable local para la ruta
        let url: string = this.distUrl + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los zonas
    getZonas(ubigeo: string): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ubigeo}/`;
        //variable local para la ruta
        let url: string = this.zonaUrl + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene la data de la tabla
    getTabla(ccdd: string = "00", ccpp: string = "00", ccdi: string = "00"): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/${ccpp}/${ccdi}/`;
        //variable local para la ruta
        let url: string = this.tablaReporte + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que extrae la data
    private extractData(res: Response) {
        //se guarda el rsultado en la variable body
        let body = res.json();
        //variable que retorna
        return body || {};
    }

    //funcion que obtiene la cabecera del error
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        //muestra el error en consola
        console.error(errMsg);
        //variable que retorna
        return Observable.throw(errMsg);
    }
}