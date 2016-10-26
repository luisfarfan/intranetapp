import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

/** A hero's name can't match the given regular expression */
export function dateValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const name = control.value;
        const no = nameRe.test(name);
        return !no ? { 'dateValidator': { name } } : null;
    };
}

export function FechaisMayor(fechainicio: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        console.log(fechainicio);
        
        return {}
    };
}
