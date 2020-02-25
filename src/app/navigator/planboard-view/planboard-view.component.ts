/*  This component ist here to detect wich view should be served at runtime */

import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { PlanboardViewServiceService, planboardView } from './planboard-view-service.service';

@Component({
  selector: 'app-planboard-view',
  templateUrl: './planboard-view.component.html',
  styleUrls: ['./planboard-view.component.css']
})
export class PlanboardViewComponent implements OnInit {
  public isMobile = this.myService.isMobile;          // HIER : this will not work!
  public isLandscape = this.myService.isLandscape;    // HIER : this will not work!

  public currView: planboardView = planboardView.dvTimeEmployee;

  constructor(private myService: PlanboardViewServiceService) {
  }

  ngOnInit() {
  }

}
