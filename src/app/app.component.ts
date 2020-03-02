import { Component, HostListener } from '@angular/core';
import { DbiService } from './services/dbi.service';
import { Helper } from './helper';
import { LoadingHandlerService } from './services/loading-handler.service';
import { GlobalDataService } from './services/global-data.service';
import { TesterService } from './services/tester.service';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private fiddlify = false;

  public isOffline = false;
  // private isLoggedIn = false;
  private isLoading = false;
  private qucikStartOpened = false;

  // public showLoginForm = true;

  // private set loggedInSetter(value) {
  //   if (this.isLoggedIn === value) { return; }
  //   this.isLoggedIn = value;


  //   // this.checkShowLoginFormState();
  // }

  public get isLoadingGetter(): boolean {
    return this.isLoading;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const target = event.target;
    this.globalData.setDeviceScreenVar(target.innerWidth, target.innerHeight);
  }

  constructor(// private testerService: TesterService,
              private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              private loadingHandler: LoadingHandlerService) {
    this.logger.setDbi = dbi;

    // this.qucikStartOpened = this.globalData.getQucikStartOpened();
    // this.globalData.qucikStartOpenedChange.subscribe({
    //   next: val => {
    //     this.qucikStartOpened = val;
    //     // this.checkShowLoginFormState();
    //   }
    // });

    // this.loggedInSetter = dbi.getLoggedInState();
    // // this.checkShowLoginFormState();
    // dbi.loggedInStateChange.subscribe({
    //   next: value => {
    //     if (!Helper.checkForValidBoolean(value)) {
    //       this.logger.logError(46351354);
    //       return;
    //     }
    //     this.loggedInSetter = value;
    //   },
    //   error: err => {
    //     this.logger.logError(31351351, err);
    //   }
    // });

    this.isLoading = loadingHandler.getIsLoading();
    loadingHandler.loadingSateChange.subscribe({
      next: value => {
        this.isLoading = value;
      }
    });

    this.isOffline = this.globalData.getIsOffline();
    this.globalData.isOfflineSateChange.subscribe({
      next: val => {
        this.isOffline = val;
        if ( val === true )  { console.log('u r on the line!'); }
        if ( val === false ) { console.log('u r off the line!'); }
        if ( val !== true && val !== false ) { console.log('ur line is broken!'); }
      }
    });
  }

  // private checkShowLoginFormState() {
  //   if (!!this.qucikStartOpened) {
  //     this.showLoginForm = true;
  //     return;
  //   }
  //   this.showLoginForm = !this.isLoggedIn;
  // }
}
