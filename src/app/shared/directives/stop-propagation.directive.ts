import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('click', ['$event']) onclick(e: Event) {
    e.stopPropagation();
  }

}
