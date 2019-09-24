import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { AnalysisViewComponent } from './navigator/analysis-view/analysis-view.component';
import { EmployeeViewComponent } from './navigator/employee-view/employee-view.component';
import { HelpViewComponent } from './navigator/help-view/help-view.component';
import { LizenzViewComponent } from './navigator/lizenz-view/lizenz-view.component';
import { PlanboardViewComponent } from './navigator/planboard-view/planboard-view.component';
import { ProfileViewComponent } from './navigator/profile-view/profile-view.component';
import { ProjectViewComponent } from './navigator/project-view/project-view.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PageNotFoundComponent } from './navigator/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigatorComponent,
    AnalysisViewComponent,
    EmployeeViewComponent,
    HelpViewComponent,
    LizenzViewComponent,
    PlanboardViewComponent,
    ProfileViewComponent,
    ProjectViewComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
