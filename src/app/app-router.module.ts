// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class AppRouterModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

import { LoginComponent } from './login/login.component';
import { PlanboardViewComponent } from './navigator/planboard-view/planboard-view.component';
import { PageNotFoundComponent } from './navigator/page-not-found/page-not-found.component';
import { ProjectViewComponent } from './navigator/project-view/project-view.component';
import { EmployeeViewComponent } from './navigator/employee-view/employee-view.component';
import { AnalysisViewComponent } from './navigator/analysis-view/analysis-view.component';
import { ProfileViewComponent } from './navigator/profile-view/profile-view.component';
import { LizenzViewComponent } from './navigator/lizenz-view/lizenz-view.component';
import { HelpViewComponent } from './navigator/help-view/help-view.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' },
  },
  {
    path: 'planboard',
    component: PlanboardViewComponent,
    data: { animation: 'planboard' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'projects',
    component: ProjectViewComponent,
    data: { animation: 'projects' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'projects/:data',
    component: ProjectViewComponent,
    data: { animation: 'projects' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'employees',
    component: EmployeeViewComponent,
    data: { animation: 'employees' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'analysis',
    component: AnalysisViewComponent,
    data: { animation: 'analysis' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile',
    component: ProfileViewComponent,
    data: { animation: 'profile' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'lizenz',
    component: LizenzViewComponent,
    data: { animation: 'lizenz' },
    canActivate: [AuthGuardService],
  },
  {
    path: 'help',
    component: HelpViewComponent,
    data: { animation: 'help' },
    canActivate: [AuthGuardService],
  },
  // { path: '', redirectTo: '/planboard', pathMatch: 'full' },
  {
    path: '', pathMatch: 'full',
    component: PlanboardViewComponent,
    data: { animation: 'planboard' },
    canActivate: [AuthGuardService],
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
