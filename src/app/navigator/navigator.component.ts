import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animations';
import { DbiService } from '../services/dbi.service';
import { LoadingHandlerService } from '../services/loading-handler.service';

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

  constructor(private dbi: DbiService, private loadingHandler: LoadingHandlerService) { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    const animationStr = 'animation';
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData[animationStr];
  }

  public logoutClicked() {
    const waitCode = '231263464';
    this.loadingHandler.addWaitCode(waitCode);
    this.dbi.logOut().then(() => {
      this.loadingHandler.removeWaitCode(waitCode);
    }).catch(err => {
      console.error('Error: 68343354 | ' + err);
      this.loadingHandler.removeWaitCode(waitCode);
    });
  }
}
