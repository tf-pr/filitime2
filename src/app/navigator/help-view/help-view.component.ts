import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-help-view',
  templateUrl: './help-view.component.html',
  styleUrls: ['./help-view.component.css']
})
export class HelpViewComponent implements OnInit {
  public isMobile = false;
  public isLandscape = true;

  constructor(private globalData: GlobalDataService) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});
  }

  ngOnInit() {
  }

}
