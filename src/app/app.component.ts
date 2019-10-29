import { Component, HostListener } from '@angular/core';
import { DbiService } from './services/dbi.service';
import { Helper } from './helper';
import { LoadingHandlerService } from './services/loading-handler.service';
import { GlobalDataService } from './services/global-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isOffline = false;
  private isLoggedIn = false;
  private isLoading = false;

  public showLoginForm = true;

  private set loggedInSetter(value) {
    if (this.isLoggedIn === value) { return; }
    this.isLoggedIn = value;
    this.showLoginForm = !value;
  }

  public get isLoadingGetter(): boolean {
    return this.isLoading;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const target = event.target;
    this.globalData.setDeviceScreenVar(target.innerWidth, target.innerHeight);
  }

  constructor(private globalData: GlobalDataService, private dbi: DbiService, private loadingHandler: LoadingHandlerService) {
    this.loggedInSetter = dbi.getLoggedInState();
    dbi.loggedInStateChange.subscribe({
      next: value => {
        if (!Helper.checkForValidBoolean(value)) {
          console.error('Error: 46351354');
          return;
        }
        this.loggedInSetter = value;
      },
      error: err => {
        console.error('Error: 31351351' + ' | ' + err);
      }
    });

    this.isLoading = loadingHandler.getIsLoading();
    loadingHandler.loadingSateChange.subscribe({
      next: value => {
        this.isLoading = value;
      }
    });

    this.isOffline = this.globalData.getIsOffline();
    this.globalData.isOfflineSateChange.subscribe({ next: val => { this.isOffline = val; console.log(val);
     } });
  }
}
