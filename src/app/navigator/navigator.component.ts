import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animations';
import { DbiService } from '../services/dbi.service';
import { LoadingHandlerService } from '../services/loading-handler.service';
import { GlobalDataService } from '../services/global-data.service';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
  animations: [
    slideInAnimation,
  ]
})
export class NavigatorComponent implements OnInit {
  public outlet;

  public isMobile = false;
  public isLandscape = true;
  public navigatorPageIndex = 0;
  public colapsed = false;

  constructor(private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              private loadingHandler: LoadingHandlerService) {
    this.logger.setDbi = dbi;

    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});
  }

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
    this.dbi.logOut()
      .then(() => { this.loadingHandler.removeWaitCode(waitCode); })
      .catch(err => {
        this.logger.logError(68343354, err);
        this.loadingHandler.removeWaitCode(waitCode);
      });
  }
}
