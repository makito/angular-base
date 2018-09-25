import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[preventDefault]'
})
export class PreventDefaultDirective {

  @HostListener('click', ['$event']) onclick(e: Event) {
    e.preventDefault();
  }

}
