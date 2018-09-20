import { FormGroup, AbstractControl, FormArray } from '@angular/forms';

/**
 * класс для валидации форм
 */
export class Validator {

  /**
   * показывает ошибки формы
   */
  static showErrors(group: FormGroup) {
    Object.keys(group.controls).forEach(name => {
      const element: AbstractControl = group.get(name);
      if (element instanceof FormArray) {
        element.controls.forEach(control => {
          // если это группа, рекурсим
          if (control instanceof FormGroup) {
            Validator.showErrors(control);
          } else {
            control.markAsTouched();
          }
        });
        // если это группа, рекурсим
      } else if (element instanceof FormGroup) {
        Validator.showErrors(element);
      } else {
        element.markAsTouched();
      }
    });
  }

}
