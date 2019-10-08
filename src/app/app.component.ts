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
  private isLoggedIn = false;
  private isLoading = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const target = event.target;
    this.globalData.setDeviceScreenVar(target.innerWidth, target.innerHeight);
  }

  constructor(private globalData: GlobalDataService, private dbi: DbiService, private loadingHandler: LoadingHandlerService) {
    this.isLoggedIn = dbi.getLoggedInState();
    dbi.loggedInSateChange.subscribe({
      next: value => {
        if (!Helper.checkForValidBoolean(value)) {
          console.error('Error: 46351354');
          return;
        }
        this.isLoggedIn = value;
      },
      error: err => {
        console.error('Error: 31351351 | ' + err);
      }
    });

    this.isLoading = loadingHandler.getIsLoading();
    loadingHandler.loadingSateChange.subscribe({
      next: value => {
        this.isLoading = value;
      }
    });
  }
}
