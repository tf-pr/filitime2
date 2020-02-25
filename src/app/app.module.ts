// tslint:disable:max-line-length
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-router.module';
import { LoginComponent } from './login/login.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { AnalysisViewComponent } from './navigator/analysis-view/analysis-view.component';
import { EmployeeViewComponent } from './navigator/employee-view/employee-view.component';
import { HelpViewComponent } from './navigator/help-view/help-view.component';
import { LizenzViewComponent } from './navigator/lizenz-view/lizenz-view.component';
import { PlanboardViewComponent } from './navigator/planboard-view/planboard-view.component';
import { ProfileViewComponent } from './navigator/profile-view/profile-view.component';
import { ProjectViewComponent,
         CreateProjectDialogComponent,
         ProjectQueryoptionsDialogComponent } from './navigator/project-view/project-view.component';
import { PageNotFoundComponent } from './navigator/page-not-found/page-not-found.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginatorIntl  } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule, MatDatepickerIntl } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/';
import {MatSelectModule} from '@angular/material/select';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ColorPickerModule } from 'primeng/colorpicker';

import { ButtonModule } from 'primeng/button';
import { PaginatorTranslator } from './PaginatorTranslator';
import { DatePickerTranslator } from './DatePickerTranslator';
import { FiddleComponent } from './fiddle/fiddle.component';
import { MdFocusOnInitDirective } from './directives/md-focus-on-init.directive';
import { WvEmployeeTimeComponent } from './navigator/planboard-view/week-view/wv-employee-time/wv-employee-time.component';
import { WvTimeEmployeeComponent } from './navigator/planboard-view/week-view/wv-time-employee/wv-time-employee.component';
import { DvEmployeeTimeComponent } from './navigator/planboard-view/day-view/dv-employee-time/dv-employee-time.component';
import { DvTimeEmployeeComponent } from './navigator/planboard-view/day-view/dv-time-employee/dv-time-employee.component';
import { ToolBarComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/tool-bar/tool-bar.component';
import { PlanboardTableComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/planboard-table/planboard-table.component';
import { EmployeeColumnComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/employee-column/employee-column.component';
import { TimeAxisComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/time-axis/time-axis.component';
import { WeekRowComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/week-row/week-row.component';
import { DayRowComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/day-row/day-row.component';
import { AssignmentCardComponent } from './navigator/planboard-view/week-view/wv-employee-time/components/assignment-card/assignment-card.component';
// tslint:enable:max-line-length

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
    CreateProjectDialogComponent,
    ProjectQueryoptionsDialogComponent,
    PageNotFoundComponent,
    LoadingScreenComponent,
    FiddleComponent,
    MdFocusOnInitDirective,
    WvEmployeeTimeComponent,
    WvTimeEmployeeComponent,
    DvEmployeeTimeComponent,
    DvTimeEmployeeComponent,
    ToolBarComponent,
    PlanboardTableComponent,
    EmployeeColumnComponent,
    TimeAxisComponent,
    WeekRowComponent,
    DayRowComponent,
    AssignmentCardComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.fs_conf),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    ColorPickerModule,
    ButtonModule,
  ],
  entryComponents: [CreateProjectDialogComponent, ProjectQueryoptionsDialogComponent],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorTranslator},
              {provide: MatDatepickerIntl, useClass: DatePickerTranslator}],
  bootstrap: [AppComponent]
})
export class AppModule { }
