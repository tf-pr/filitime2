import { Injectable, EventEmitter } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlanboardViewServiceService {
  public isMobile = false;
  public isLandscape = true;

  private currView: planboardView = planboardView.wvEmployeeTime;
  private currViewEmitter = new EventEmitter<planboardView>();
  public currViewSateChange: Observable<planboardView> = this.currViewEmitter.asObservable();

  constructor(private globalData: GlobalDataService) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({ next: val => { this.isMobile = val; } });

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({ next: val => { this.isLandscape = val; } });
  }
}

export enum planboardView {
  wvEmployeeTime = 0,
  dvEmployeeTime = 1,
  wvTimeEmployee = 2,
  dvTimeEmployee = 3,
}
