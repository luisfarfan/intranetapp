import {
    Http,
    Response
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

export class Helpers {
    public static extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    public static handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    public static logout(key: string = '') {
        localStorage.removeItem(key === '' ? 'usuario' : key);
        localStorage.removeItem('menu');
    }

    public static getJsonSession(key: string = '') {
        return JSON.parse(localStorage.getItem(key === '' ? 'usuario' : key));
    }

    public static isValidSession(key: string = ''): boolean {
        let sesion = localStorage.getItem(key === '' ? 'usuario' : key);
        return sesion == null ? false : true;
    }

    public static descargarExcel(id, nom) {
        // Creamos un Elemento Temporal en forma de enlace
        let tmpElemento = document.createElement('a');
        // obtenemos la información desde el div que lo contiene en el html
        // Obtenemos la información de la tabla
        let data_type = 'data:application/vnd.ms-excel';
        let tabla_div = document.getElementById(id);
        let tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        // Asignamos el nombre a nuestro EXCEL
        tmpElemento.download = nom + '.xls';
        // Simulamos el click al elemento creado para descargarlo
        tmpElemento.click();
    }

    public static lengthobj(obj: Object): number {
        console.log(obj);
        return Object.keys(obj).length;
    }

    public static diffObjects(obj: Object, obj2: Object) {
        let BreakException = {};
        let mayor: Object;
        let menor: Object;
        let resultado: Array<any> = [];
        if (this.lengthobj(obj) > this.lengthobj(obj2)) {
            mayor = obj;
            menor = obj2;
        } else {
            mayor = obj2;
            menor = obj;
        }
        for (let i in mayor) {
            for (let ii in menor) {
                if ((this.isEquivalent(mayor[i], menor[ii]))) {
                    delete mayor[i];
                    break;
                }
            }
        }
        for (let i in mayor) {
            mayor[i] != undefined ? resultado.push(mayor[i]) : '';
        }
        return resultado;
    }

    public static isEquivalent(a, b) {
        // Create arrays of property names
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    public static generateCokie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2)
            return parts.pop().split(";").shift();
    }
}