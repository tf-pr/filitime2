import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
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
  public hideNavBar = true;

  private isLoggedIn = false;

  private routerPathAfterLogin: string;
  public currTabName = '';

  public customDrawer: number;

  private set isLoggedInSetter(isLoggedIn: boolean) {
    if (this.isLoggedIn === isLoggedIn) { return; }
    this.isLoggedIn = isLoggedIn;

    if (!!this.isLoggedIn) {
      if ( this.globalData.getQucikStartOpened() ) {
        this.globalData.qucikStartOpenedChange.toPromise().then(() => {
          this.router.navigate([this.routerPathAfterLogin]);
        });
        return;
      }
      this.router.navigate([this.routerPathAfterLogin]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  constructor(private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              private loadingHandler: LoadingHandlerService,
              private router: Router) {
    this.logger.setDbi = dbi;

    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});

    this.registerTabChange();
    this.registerRouterUrlChange();

    this.customDrawer = this.viewCodeToDrawerCode(this.globalData.getCurrViewCode());
    this.globalData.currViewCodeChange.subscribe({
      next: val => {
        if (this.customDrawer === val) { return; }

        this.hideNavBar = true;
        setTimeout(() => this.hideNavBar = false);
        this.customDrawer = this.viewCodeToDrawerCode(val);
      }
    });

    this.isLoggedInSetter = dbi.getLoggedInState();
    dbi.loggedInStateChange.subscribe({
      next:
        val => this.isLoggedInSetter = val
    });
  }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    const animationStr = 'animation';
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData[animationStr];
  }

  private viewCodeToDrawerCode(viewCode): number {
    // HIER
    switch (viewCode) {
      case 1:   return 1;
      default:  return undefined;
    }
  }

  private registerRouterUrlChange() {
    const thatRouter = this.router;
    this.router.events.subscribe({
      next: e => {
        // tslint:disable-next-line:no-string-literal
        this.setRouterPathAfterLogin(e['url']);

        const tempArr = thatRouter.url.split('/');
        if (!tempArr || tempArr.length < 2) { return; }
        this.globalData.setCurrTab(tempArr[1]);
      }
    });
  }

  private registerTabChange() {
    this.globalData.currRoutePathChange.subscribe({
      next: val => {
        this.convertRouterPathToTabName(val);
      }
    });
  }

  private convertRouterPathToTabName(arg) {
    let tempHideNavBar = false;
    switch (arg) {
      case 'login':
        this.currTabName = 'Login';
        tempHideNavBar = true;
        break;
      case 'planboard':
        this.currTabName = 'Plantafel';
        break;
      case 'projects':
        this.currTabName = 'Projekte';
        break;
      case 'employees':
        this.currTabName = 'Mitarbeiter';
        break;
      case 'analysis':
        this.currTabName = 'Auswertung';
        break;
      case 'lizenz':
        this.currTabName = 'Lizenz';
        break;
      case 'help':
        this.currTabName = 'Hilfe';
        break;
      default:
        this.currTabName = 'FiliTime';
        break;
    }
    this.hideNavBar = tempHideNavBar;
  }

  private setRouterPathAfterLogin(path: string) {
    if ( !!this.routerPathAfterLogin ) { return; }
    if ( path.startsWith('/login') ) { path = '/'; }
    this.routerPathAfterLogin = path;

    // console.log('go to "' + this.routerPathAfterLogin + '" after login');
  }

  public logoutClicked() {
    const waitCode = '231263464';
    this.loadingHandler.addWaitCode(waitCode);
    this.dbi.logOut()
      .then(() => { this.loadingHandler.removeWaitCode(waitCode); })
      .catch(err => {
        this.logger.logError('68343354', err);
        this.loadingHandler.removeWaitCode(waitCode);
      });
  }
}
