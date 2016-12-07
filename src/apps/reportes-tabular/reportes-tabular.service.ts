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
export class ReportestabularService {

    //constructor
    constructor(private http: Http) { }

    //urls de los servicios
    private depaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDepa/';
    private provUrl: string = 'http://lfarfan.inei.com.pe:81/recargaProv/';
    private distUrl: string = 'http://lfarfan.inei.com.pe:81/recargaDis/';
    private zonaUrl: string = 'http://lfarfan.inei.com.pe:81/recargaZona/';
    private tablaReporte: string = 'http://lfarfan.inei.com.pe:81/tablaReportetabular/';

    //funcion que obtiene los departamentos
    getCargaDepaInicial(): Observable<Object> {
        //variable que retorna
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
    getTabla(tipo: string = "0", ccdd: string = "0", ccpp: string = "0", ccdi: string = "0"): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${tipo}/${ccdd}${ccpp}${ccdi}/`;
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