import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animations';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
  animations: [
    slideInAnimation,
  ]
})
export class NavigatorComponent implements OnInit {
  navigatorPageIndex = 0;
  colased = false;

  constructor() { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    const animationStr = 'animation';
    return outlet &&
    outlet.activatedRouteData &&
    outlet.activatedRouteData[animationStr];
  }
}
