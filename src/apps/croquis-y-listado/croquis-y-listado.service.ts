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
import { Helpers } from './../../app/helper';
@Injectable()
export class CroquisylistadoService {

    //constructor
    constructor(private http: Http) { }

    //variable que guarda el perfil
    private cargo: string = 'DEPARTAMENTAL';
    //urls de los servicios
    private depaUrl: string = 'http://172.18.1.40:8000/recargaDepa/';
    private provUrl: string = 'http://172.18.1.40:8000/recargaProv/';
    private distUrl: string = 'http://172.18.1.40:8000/recargaDis/';
    private zonaUrl: string = 'http://172.18.1.40:8000/recargaZona/';
    private tablaUrlAux: string = 'http://172.18.1.40:8000/crorecargaTabla01/';
    private tablaUrlAux2: string = 'http://172.18.1.40:8000/crorecargaTabla02/';
    private tablaUrlZip: string = 'http://172.18.1.40:8000/crodescargarPdf/';

    //funcion que obtiene los departamentos
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
    getDistritos(ccdd: string, ccpp: string, tipo: string = "0"): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}/${ccpp}/0/${tipo}/`;
        //variable local para la ruta
        let url: string = this.distUrl + queryparameters;
        console.log(url);
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene los zonas
    getZonas(ubigeo: string): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ubigeo}/`;
        //variable local para la ruta
        let url: string = this.zonaUrl + queryparameters;
        console.log(url);
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que obtiene la data de la tabla
    getTabla(area: string = "0", tipo: string = "0", ccdd: string = "0", ccpp: string = "0", ccdi: string = "0", zona: string = "0"): Observable<Object> {
        //se guarda el rsultado en la variable session
        let session = Helpers.getJsonSession();
        //se ponen las restricciones segun el perfil
        let ccdd_s = session[0].ccdd == '00' ? ccdd : session[0].ccdd;
        let ccpp_s = session[0].ccpp == '00' ? ccpp : session[0].ccpp;
        let ccdi_s = session[0].ccdi == '00' ? ccdi : session[0].ccdi;
        let zona_s = session[0].zona == '0' ? zona : session[0].zona;
        //variable local para unir los parametros
        let queryparameters: string;
        //se valida el ccdd_s , ccdd y tipo
        if (ccdd_s == "0" && ccdd == "0" && tipo == '0') {
            //variable local para unir los parametros
            queryparameters = `${area}/${tipo}/${ccdd_s}/${ccpp_s}/${ccdi_s}/${zona_s}/`;
        } else {
            //se valida el ccdd_s y tipo
            if (ccdd_s != "00" && tipo == '0') {
                //se asigna el valor 1 a la variable tipo
                tipo = '1';
                //variable local para unir los parametros
                queryparameters = `${area}/${tipo}/${ccdd_s}/${ccpp_s}/${ccdi_s}/${zona_s}/`;
            } else {
                //variable local para unir los parametros
                queryparameters = `${area}/${tipo}/${ccdd_s}/${ccpp_s}/${ccdi_s}/${zona_s}/`;
            }
        }
        //variable local para la ruta
        let url: string = this.tablaUrlAux + queryparameters;
        //variable que retorna
        return this.http.get(url).map(this.extractData).catch(this.handleError)
    }

    //funcion que extrae la data
    private extractData(res: Response) {
        //se guarda el rsultado en la variable body
        let body = res.json();
        //se guarda el rsultado en la variable session
        let session = Helpers.getJsonSession();
        session = session[0];
        let resultado: Array<Object> = [];
        //se guarda el valor en la variable usuario_ubigeo
        let usuario_ubigeo = { ccdd: session.ccdd, ccpp: session.ccpp, ccdi: session.ccdi, zona: session.zona }
        //proceso que valida los valores
        if (usuario_ubigeo.ccpp == '00' || usuario_ubigeo.ccdi == '00' || usuario_ubigeo.zona == '00000') {
            this.cargo = 'DEPARTAMENTAL';
        } else if (usuario_ubigeo.ccpp != '00' || usuario_ubigeo.ccdi == '00' || usuario_ubigeo.zona == '00000') {
            this.cargo = 'PROVINCIAL';
        } else if (usuario_ubigeo.ccdi != '00' || usuario_ubigeo.zona == '00000') {
            this.cargo = 'DISTRITAL';
        } else if (usuario_ubigeo.zona != '00000') {
            this.cargo = 'ZONAL';
        }
        resultado = Helpers.findUbigeoByBody(body);
        //variable que retorna
        return resultado || {};
    }

    //funcion que obtiene la data del registro
    getRegistro(url: string = ''): Observable<Object> {
        //variable local para la ruta
        let tablaUrlAux3 = this.tablaUrlAux2 + url;
        if (url != '') {
            //variable que retorna
            return this.http.get(tablaUrlAux3).map(this.extractData)
        } else {
            //variable que retorna
            return this.http.get(this.tablaUrlAux).map(this.extractData)
        }
    }

    //funcion para zipear
    getZip(ccdd: string = '', ccpp: string = '', ccdi: string = '', zona: string = '', tipo: string = ''): Observable<Object> {
        //variable local para unir los parametros
        let queryparameters: string = `${ccdd}${ccpp}${ccdi}/${zona}/${tipo}/`;
        //variable local para la ruta
        let tablaUrlAux3 = this.tablaUrlZip + queryparameters;
        //variable que retorna
        return this.http.get(tablaUrlAux3).map(this.extractData);
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