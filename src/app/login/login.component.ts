import { Component } from '@angular/core';
import { DbiService } from '../services/dbi.service';
import { LoadingHandlerService } from '../services/loading-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private dbi: DbiService, private loadingHandler: LoadingHandlerService) { }

  public loginClicked() {
    // const imWaiting = this.loadingHandler.addWaitCode('WARTE FÜR IMMER, MUHAHAHAHAHA!');
    // console.log({imWaiting});
    const waitCode = '843643544';
    this.loadingHandler.addWaitCode(waitCode);

    this.dbi.logIn('', '').then(succes => {
      this.loadingHandler.removeWaitCode(waitCode);
      if (!succes) {
        console.error('Error: 89354343');
        return;
      }
    }).catch(err => {
      const detail: string = err;
      // this.errorMassage('Login Fehlgeschlagen', detail);

      console.error('Error: 43546853 | ' + detail);
      this.loadingHandler.removeWaitCode(waitCode);
    });
  }
}
