import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { DbiService } from 'src/app/services/dbi.service';
import { Employee } from 'src/app/helper';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  public isMobile = false;
  public isLandscape = true;

  public email: string;
  private usersEmployee: Employee;
  public employeeDataIdentifier: string;
  public employeeDataName: string;
  public employeeDataDept: string;
  public employeeDataDeptColor: string;
  public employeeDataGroup: string;
  public employeeDataGroupColor: string;





  public changeEMailClicked(arg0?: any, arg1?: any): any {
    // HIER
  }

  public changePasswordClicked(arg0?: any, arg1?: any): any {
    // HIER
  }

  public deleteUserClicked(arg0?: any, arg1?: any): any {
    // HIER
  }




  public set setUsersEmployee(value: Employee) {
    if (Employee.employeesAreEqual(this.usersEmployee, value)) { return; }

    this.usersEmployee = value;
    if (value.identifier !== this.employeeDataIdentifier ) { this.employeeDataIdentifier = value.identifier; }
    if (value.name !== this.employeeDataName )             { this.employeeDataName       = value.name; }
    if (value.dept !== this.employeeDataDept )             { this.employeeDataDept       = value.dept; }
    if (value.deptColor !== this.employeeDataDeptColor )   { this.employeeDataDeptColor  = value.deptColor; }
    if (value.group !== this.employeeDataGroup )           { this.employeeDataGroup      = value.group; }
    if (value.groupColor !== this.employeeDataGroupColor ) { this.employeeDataGroupColor = value.groupColor; }
  }

  constructor(private globalData: GlobalDataService, private dbi: DbiService) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});

    this.email = dbi.getUsersEMail();
    this.setUsersEmployee = dbi.getUsersEmployee();
    console.warn(543133543);
    console.warn(this.usersEmployee);
    dbi.usersEmployeeChange.subscribe({
      next: val => {
        this.setUsersEmployee = val;
        console.warn(354354);
        console.warn(this.usersEmployee);
      }
    });
  }

  ngOnInit() {
  }
}
