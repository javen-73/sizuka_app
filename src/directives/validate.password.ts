import {Directive, forwardRef} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validators} from "@angular/forms";

const pattern = /^[a-zA-Z0-9]{6,10}$/;
@Directive({
  selector: `[ValidatePassword][formControlName],[ValidatePassword]
    [formControl],[ValidatePassword][ngModel]`,
  providers: [
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidatePassword),
      multi: true
    }
  ]
})
export class ValidatePassword implements Validators{
  validate(c: AbstractControl): ValidationErrors | any {
    const v = c.value;
    console.log('v=' + v);
    if(!pattern.test(v)){
      return {
        ValidatePassword:false
      }
    }
    return null;
  }
  constructor(){}
}
