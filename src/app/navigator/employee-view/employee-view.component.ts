import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {
  public isMobile = false;
  public isLandscape = true;



  public sortBy: any;
  public sortDesc: any;

  public paginatorPageIndex: any;
  public paginatorLength: any;
  public paginatorPageSize: any;
  public paginatorPageSizeOptions: any;
  public textSearch: any;
  public disablePaginators: any;
  public disableBottomPaginator: any;
  public employeeListPaginated: any;

  public sortChanged(arg0?: any, arg1?: any): any {
  }

  public sortDirectionChanged(arg0?: any, arg1?: any): any {
  }

  public paginatorChanged(arg0?: any, arg1?: any): any {
  }

  public getMostReadableFontColor(arg0?: any, arg1?: any): any {
  }

  public changeCurrEmployeeId(arg0?: any, arg1?: any): any {
  }

  public addEmployeeButtonClicked(arg0?: any, arg1?: any): any {
  }

  constructor(private globalData: GlobalDataService) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});
  }

  ngOnInit() {
  }

}
