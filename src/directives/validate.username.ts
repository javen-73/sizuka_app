import {Directive, forwardRef} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validators} from "@angular/forms";

const pattern = /^[A-Za-z][A-Za-z1-9_-]+$/;
@Directive({
  selector: `[ValidateUsername][formControlName],[ValidateUsername]
    [formControl],[ValidateUsername][ngModel]`,
  providers: [
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateUsername),
      multi: true
    }
  ]
})
export class ValidateUsername implements Validators{
  validate(c: AbstractControl): ValidationErrors | any {
    const v = c.value;
    console.log('v=' + v);
    if(!pattern.test(v)){
      return {
        ValidateUsername:false
      }
    }
    return null;
  }
  constructor(){}
}
