import { Component } from '@angular/core';
import { DbiService } from './services/dbi.service';
import { HelperFunctions } from './helper/helperFunctions';
import { LoadingHandlerService } from './services/loading-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private isLoggedIn = false;
  private isLoading = false;

  constructor(private dbi: DbiService, private loadingHandler: LoadingHandlerService) {
    this.isLoggedIn = dbi.getLoggedInSate();
    dbi.loggedInSateChange.subscribe({
      next: value => {
        if (!HelperFunctions.checkForValidBoolean(value)) {
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
