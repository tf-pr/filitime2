import { Component } from '@angular/core';
import { DbiService } from '../services/dbi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private dbi: DbiService) { }

  public loginClicked() {
    // this.dbi.logIn('', '').then(succes => {
    //   if (!succes) {
    //     // hmmmmm
    //     return;
    //   }

    //   this.
    // }).catch(err => {
    //   const detail:string = err;
    //   this.errorMassage('Login Fehlgeschlagen', detail);
    // });
  }
}
