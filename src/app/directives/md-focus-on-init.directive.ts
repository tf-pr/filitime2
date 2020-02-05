import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMdFocusOnInit]'
})
export class MdFocusOnInitDirective implements OnInit {

  constructor( private element: ElementRef ) { }

  ngOnInit() {
    this.element.nativeElement.focus();
    console.log('hi there');
  }
}
