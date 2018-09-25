import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * директива для блокировки полей ввода
 */
@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl(condition: boolean) {
    const action = condition ?
      'disable' :
      'enable';
    this._ngControl.control[action]();
  }

  constructor(
    private _ngControl: NgControl
  ) { }

}
