import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[maxLength]'
})
export class MaxLengthDirective {

  @Input() max: number;

  @HostListener('keypress', ['$event']) onKeypress(e) {
    if (isNaN(this.max)) {
      return true;
    }

    if (e.target.value.length === +this.max) {
      e.preventDefault();
    }
  }

}
