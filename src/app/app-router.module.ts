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
    path: 'planboard',
    component: PlanboardViewComponent,
    data: { animation: 'planboard' },
  },
  {
    path: 'projects',
    component: ProjectViewComponent,
    data: { animation: 'projects' },
  },
  {
    path: 'projects/:data',
    component: ProjectViewComponent,
    data: { animation: 'projects' }
  },
  {
    path: 'employees',
    component: EmployeeViewComponent,
    data: { animation: 'employees' },
  },
  {
    path: 'analysis',
    component: AnalysisViewComponent,
    data: { animation: 'analysis' },
  },
  {
    path: 'profile',
    component: ProfileViewComponent,
    data: { animation: 'profile' },
  },
  {
    path: 'lizenz',
    component: LizenzViewComponent,
    data: { animation: 'lizenz' },
  },
  {
    path: 'help',
    component: HelpViewComponent,
    data: { animation: 'help' },
  },
  { path: '', redirectTo: '/planboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
