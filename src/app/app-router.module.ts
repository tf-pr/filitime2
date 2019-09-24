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

// import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  {
    path: 'planboard',
    component: PlanboardViewComponent
  },
  {
    path: 'projects',
    component: ProjectViewComponent
  },
  {
    path: 'employees',
    component: EmployeeViewComponent
  },
  {
    path: 'analysis',
    component: AnalysisViewComponent
  },
  {
    path: 'profile',
    component: ProfileViewComponent
  },
  {
    path: 'lizenz',
    component: LizenzViewComponent
  },
  {
    path: 'help',
    component: HelpViewComponent
  },
  { path: '', redirectTo: '/planboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: false, // <-- debugging purposes only
        // preloadingStrategy: SelectivePreloadingStrategyService,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
