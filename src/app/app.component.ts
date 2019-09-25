import { Component } from '@angular/core';
import { DbiService } from './services/dbi.service';
import { HelperFunctions } from './helper/helperFunctions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private dbi: DbiService) {
    this.isLoggedIn = dbi.getLoggedInSate();
    dbi.loggedInSateChange.subscribe({
      next: value => {
        if (!HelperFunctions.checkForValidBoolean(value)) {
          console.error('Error: 46351354');
          return;
        }
        // console.log(value)
        this.isLoggedIn = value;
      },
      error: err => {
        console.error('Error: 31351351 | ' + err);
      }
    });
  }

  private isLoggedIn = false;
}
