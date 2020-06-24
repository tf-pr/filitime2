import { Component, OnInit, ViewChild } from '@angular/core';
import { DbiService } from '../services/dbi.service';
import { LoadingHandlerService } from '../services/loading-handler.service';
import { GlobalDataService } from '../services/global-data.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public isMobile = false;
  public isLandscape = true;

  public currMode: 'login'
    | 'register'
    | 'resetPassword'
    | 'registerCompany'
    | 'registerCompany2'
    | 'registerCompany3'
    | 'registerCompany4'
    | 'registerEmployee'
    | 'registerEmployee2';
  public registerMode: 'registerCompany' | 'registerEmployee';

  public showAni = true;

  public currFormGroup: FormGroup;
  public formGroupLogin: FormGroup;
  public formGroupResetPW: FormGroup;
  public formGroupRegisterC: FormGroup;
  public formGroupRegisterE: FormGroup;
  public formGroupRegisterE2: FormGroup;
  public titleAlert = 'This field is required';
  public post: any = '';

  public employeesToAdd: string[] = [];
  public employeeNameToAdd: string;
  public projectsToAdd: string[] = [];
  public projectNameToAdd: string;

  public resetPasswordErrorMsg: string;
  public logInErrorMsg: string;

  constructor(private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              private loadingHandler: LoadingHandlerService,
              private formBuilder: FormBuilder) {
    this.logger.setDbi = dbi;

    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});
  }

  public changeMode(mode: 'login'
    | 'register'
    | 'resetPassword'
    | 'registerCompany'
    | 'registerCompany2'
    | 'registerCompany3'
    | 'registerCompany4'
    | 'registerEmployee'
    | 'registerEmployee2') {
    this.currMode = mode;
    if (this.showAni) { this.showAni = false; }

    switch (this.currMode) {
      case 'login':
        this.createLoginForm();
        this.currFormGroup = this.formGroupLogin;
        break;
      case 'resetPassword':
        this.createResetPWForm();
        this.currFormGroup = this.formGroupResetPW;
        break;
      case 'register':
        break;
      case 'registerCompany':
        this.createRegisterCForm();
        this.currFormGroup = this.formGroupRegisterC;
        break;
      case 'registerCompany2':
        break;
      case 'registerCompany3':
        break;
      case 'registerCompany4':
        break;
      case 'registerEmployee':
        this.createRegisterEForm();
        this.currFormGroup = this.formGroupRegisterE;
        break;
      case 'registerEmployee2':
        break;
    }
  }

  ngOnInit() {
    this.changeMode('login');
    this.showAni = true;
  }

  private createLoginForm() {
    const emailregex: RegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source +
      /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);

    this.formGroupLogin = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      password: [null, [Validators.required, this.checkPassword]],
      validate: ''
    });
  }

  private createResetPWForm() {
    const emailregex: RegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source +
      /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);

    this.formGroupResetPW = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]]
    });
  }

  private createRegisterCForm() {
    const emailregex: RegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source +
      /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);

    this.formGroupRegisterC = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]],
      password: [null, [Validators.required, this.checkPassword]],
      repeatPassword: [null, [Validators.required, this.checkPassword]],
      companyName: [null, [Validators.required, this.checkCompanyName]],
      fullName: [null, [Validators.required, this.checkFullName]],
      phoneNumber: [null, [Validators.required, this.checkPhoneNumber]],
    });
  }

  private createRegisterEForm() {
    const emailregex: RegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/.source +
      /@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.source);

    this.formGroupRegisterE = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(emailregex)]]
    });
  }

  private createRegisterE2Form() {
    this.formGroupRegisterE2 = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required, this.checkPassword]],
      repeatPassword: [null, [Validators.required, this.checkPassword]]
    });
  }

  checkPassword(control) {
    const enteredPassword: string = control.value;
    // const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    // return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
    return (!!enteredPassword && enteredPassword.length < 6) ? { requirements: true } : null;
  }

  checkCompanyName(control) {
    const enteredName: string = control.value;
    // const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    // return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
    return (!!enteredName && enteredName.length < 3) ? { requirements: true } : null;
  }

  checkFullName(control) {
    const enteredName: string = control.value;
    // const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    // return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
    return (!!enteredName && enteredName.length < 7) ? { requirements: true } : null;
  }

  checkPhoneNumber(control) {
    const enteredNumber: string = control.value;
    // const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    // return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { requirements: true } : null;
    return (!!enteredNumber && enteredNumber.length < 6) ? { requirements: true } : null;
  }

  getErrorEmail() {
    if (!this.currFormGroup) { return; }

    return this.currFormGroup.get('email').hasError('required') ? 'Bitte gben Sie Ihre EMail-Adresse ein' :
      this.currFormGroup.get('email').hasError('pattern') ? 'Format der e-Mail-Adresse ungültig' : '';
  }

  getErrorPassword() {
    if (!this.currFormGroup) { return; }

    return this.currFormGroup.get('password').hasError('required') ? 'Bitte geben Sie Ihr Passwort ein' :
      this.currFormGroup.get('password').hasError('requirements') ? 'Das Passwort muss aus mindestens 6 Zeichen bestehen' : '';
  }

  onSubmit(post) {
    this.post = post;
  }

  public loginClicked() {
    const email: string = this.formGroupLogin.get('email').value;
    const password: string = this.formGroupLogin.get('password').value;

    if (!email || !password) {
      this.logInErrorMsg = 'Bitte geben Sie E-Mail und Passwort an';
      return;
    }

    this.logInErrorMsg = undefined;

    const waitCode = '843643544';
    this.loadingHandler.addWaitCode(waitCode);

    this.dbi.logIn(email, password)
      .then(succes => {
        this.loadingHandler.removeWaitCode(waitCode);
        if (!succes) {
          this.logger.logError('89354343');
          return;
        }
        this.formGroupLogin = undefined;
      })
      .catch(err => {
        const detail: string = err;
        this.logger.logError('43546853', detail);
        this.logInErrorMsg = detail;
        this.loadingHandler.removeWaitCode(waitCode);
      });
  }

  public registerModeNextClicked() {
    if ( this.registerMode === 'registerCompany' ) {
      this.changeMode('registerCompany');
    }
    if ( this.registerMode === 'registerEmployee' ) {
      this.changeMode('registerEmployee');
    }
  }

  public checkEmployeeMail() {
    // HIER // chcek if email is resevered for a new user
    this.changeMode('registerEmployee2');
  }

  public registerEmployee() {
    // HIER // register employee
    // now wait for login after register i gues?!
    // console.log('HI THERE, NEW EMPLOYEE!'); // HIER
  }

  public registerCompany() {
    // HIER register company
    const waitCode = '879643';
    this.loadingHandler.addWaitCode(waitCode);
    this.globalData.setQucikStartOpened = true;

    const email    =  this.formGroupRegisterC.get('email').value;
    const pw       =  this.formGroupRegisterC.get('password').value;
    const lang     =  'ger';
    const company  =  this.formGroupRegisterC.get('companyName').value;
    const phone    =  this.formGroupRegisterC.get('phoneNumber').value;
    const poc      =  this.formGroupRegisterC.get('fullName').value;

    this.dbi.setUpNewClient(email, pw, lang, company, phone, poc)
      .then(val => {
        this.loadingHandler.removeWaitCode(waitCode);
        this.changeMode('registerCompany2');
      })
      .catch(err => {
        // HIER throw an error o.d.s.
        this.loadingHandler.removeWaitCode(waitCode);
        this.globalData.setQucikStartOpened = false;
      });
  }

  public startQuickStart() {
    // this.dbi.setUpNewClient(
    //   email,
    //   password,
    //   employeeId,
    //   clientId,
    //   lang,
    //   company,
    //   phone,
    //   poc,
    // )
    //   .then(() => { this.changeMode('registerCompany3'); })
    //   .catch(err => {
    //     // HIER : throw error o.d.s
    //   });
  }

  public removeEmployeeToAdd(i: number) {
    this.employeesToAdd.splice(i, 1);
  }

  public addEmployeeToAdd(employeeNameToAdd) {
    if (!employeeNameToAdd) { return; }
    this.employeesToAdd.push(employeeNameToAdd);
    this.employeeNameToAdd = undefined;
  }

  public continueQuickStart() {
    this.changeMode('registerCompany4');
  }

  public removeProjectToAdd(i: number) {
    this.projectsToAdd.splice(i, 1);
  }

  public addProjectToAdd(projectNameToAdd) {
    if (!projectNameToAdd) { return; }
    this.projectsToAdd.push(projectNameToAdd);
    projectNameToAdd = undefined;
  }

  public finishQuickStart() {
    this.changeMode(undefined);

    // write all collected projects and employee to database via dbi... mkay!

    // this.globalData.setQucikStartOpened = false;
  }

  public cancelQuickStart() {
    this.changeMode(undefined);
    this.globalData.setQucikStartOpened = false;
  }

  public resetPasswordClicked() {
    console.log('nji'); // HIER
  }
}
