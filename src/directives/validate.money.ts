import {Directive, forwardRef} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validators} from "@angular/forms";

const pattern =  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
@Directive({
  selector: `[ValidateMoney][formControlName],[ValidateMoney]
    [formControl],[ValidateMoney][ngModel]`,
  providers: [
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateMoney),
      multi: true
    }
  ]
})
export class ValidateMoney implements Validators{
  validate(c: AbstractControl): ValidationErrors | any {
    const v = c.value;
    console.log('v=' + v);
    if(!pattern.test(v)){
      return {
        ValidateMoney:false
      }
    }
    return null;
  }
  constructor(){}
}
