import { Component, OnInit } from '@angular/core';
import { DbiService } from '../services/dbi.service';
import { LoadingHandlerService } from '../services/loading-handler.service';
import { GlobalDataService } from '../services/global-data.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isMobile = false;
  public isLandscape = true;

  public formGroup: FormGroup;
  public titleAlert = 'This field is required';
  public post: any = '';

  public logInErrorMsg: string;

  constructor(private globalData: GlobalDataService,
              private dbi: DbiService,
              private loadingHandler: LoadingHandlerService,
              private formBuilder: FormBuilder) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});
  }

  ngOnInit() {
    this.createForm();
    // this.setChangeValidate();
  }

  createForm() {
    const emailregex: RegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source +
      /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);
    this.formGroup = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      password: [null, [Validators.required, this.checkPassword]],
      validate: ''
    });
  }

  // setChangeValidate() {
  //   this.formGroup.get('validate').valueChanges.subscribe(
  //     (validate) => {
  //       if (validate === '1') {
  //         this.formGroup.get('name').setValidators([Validators.required, Validators.minLength(3)]);
  //         this.titleAlert = "You need to specify at least 3 characters";
  //       } else {
  //         this.formGroup.get('name').setValidators(Validators.required);
  //       }
  //       this.formGroup.get('name').updateValueAndValidity();
  //     }
  //   );
  // }

  checkPassword(control) {
    const enteredPassword: string = control.value;
    // const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    // return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
    return (!!enteredPassword && enteredPassword.length < 6) ? { requirements: true } : null;
  }

  getErrorEmail() {
    return this.formGroup.get('email').hasError('required') ? 'Bitte gben Sie Ihre EMail-Adresse ein' :
      this.formGroup.get('email').hasError('pattern') ? 'Format der e-Mail-Adresse ungültig' : '';
  }

  getErrorPassword() {
    return this.formGroup.get('password').hasError('required') ? 'Bitte geben Sie Ihr Passwort ein' :
      this.formGroup.get('password').hasError('requirements') ? 'Das Passwort muss aus mindestens 6 Zeichen bestehen' : '';
  }

  onSubmit(post) {
    this.post = post;
  }

  public loginClicked() {
    const email: string = this.formGroup.get('email').value;
    const password: string = this.formGroup.get('password').value;

    if (!email || !password) {
      this.logInErrorMsg = 'Bitte geben Sie E-Mail und Passwort an';
      return;
    }

    this.logInErrorMsg = undefined;

    const waitCode = '843643544';
    this.loadingHandler.addWaitCode(waitCode);

    this.dbi.logIn(email, password).then(succes => {
      this.loadingHandler.removeWaitCode(waitCode);
      if (!succes) {
        console.error('Error: 89354343');
        return;
      }
      this.formGroup = undefined;
    }).catch(err => {
      const detail: string = err;
      // this.errorMassage('Login Fehlgeschlagen', detail);

      console.error('Error: 43546853 | ' + detail);
      this.logInErrorMsg = detail;
      this.loadingHandler.removeWaitCode(waitCode);
    });
  }
}
