import { Component, OnInit, Inject } from '@angular/core';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { Employee, Helper } from 'src/app/helper';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { DbiService } from 'src/app/services/dbi.service';
import { MatBadgePosition } from '@angular/material';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {
  // public readonly docIdKeyStr = Employee.docIdKeyStr;
  // public readonly identifierKeyStr = Employee.identifierKeyStr;
  // public readonly nameKeyStr = Employee.nameKeyStr;
  // public readonly deptKeyStr = Employee.deptKeyStr;
  // public readonly deptColorKeyStr = Employee.deptColorKeyStr;
  // public readonly groupKeyStr = Employee.groupKeyStr;
  // public readonly groupColorKeyStr = Employee.groupColorKeyStr;
  // public readonly userKeyStr = Employee.userKeyStr;
  // public readonly schedulerKeyStr = Employee.schedulerKeyStr;
  // public readonly selfEditKeyStr = Employee.selfEditKeyStr;
  // public readonly createTSKeyStr = Employee.createTSKeyStr;
  // public readonly createIdKeyStr = Employee.createIdKeyStr;
  // public readonly createNameKeyStr = Employee.createNameKeyStr;
  // public readonly editTSKeyStr = Employee.editTSKeyStr;
  // public readonly editIdKeyStr = Employee.editIdKeyStr;
  // public readonly editNameKeyStr = Employee.editNameKeyStr;
  private deepLinkData: {} = undefined;
  private readonly deepLinkDeptStr = 'd';
  private readonly deepLinkGroupStr = 'd';
  private readonly deepLinkEmployeeIdStr = 'e';

  public isMobile = false;
  public isLandscape = true;

  public currDept: string = undefined;
  public currEmployeeId: string = undefined;
  private employeeList: Employee[] = [];

  private employeeListFiltered: Employee[] = [];
  private employeeListSorted: Employee[] = [];
  public employeeListPaginated: Employee[] = [];

  public filterReserved = false;
  public filterZeroTTA = false;
  public filterCompleted = false;
  public sortBy = 'createdAt';
  public sortDesc = false;
  private currTextSearch: string;

  private currOrderBy: 'name' | 'identifier' | 'createdAt' = 'createdAt';
  private currOrderDirection: 'asc' | 'desc' = 'asc';

  public disablePaginators = true;
  public disableBottomPaginator = true;
  public paginatorLength = 0;
  public paginatorPageSizeOptions: number[] = [5, 10, 25, 50, 100, 200];
  public paginatorPageSize = this.paginatorPageSizeOptions[3];
  public paginatorPageEvent: PageEvent;
  public paginatorPageIndex = 0;

  public employeeIdsToDelete: string[] = [];

  public getMostReadableFontColor(bgColor: string): string {
    const bgIsDark = Helper.isColorDark(bgColor);
    return bgIsDark ? '#eeeeee' : '#000000';
  }

  public get textSearch(): string {
    return this.currTextSearch;
  }

  public set textSearch(value: string) {
    if (this.currTextSearch === value) { return; }
    this.currTextSearch = value;
    this.textSearchChanged();
  }

  public changeCurrDept(value: string) {
    const newDeepLinkObj = this.buildDeepLinkObj(value, undefined);
    const encodedObjStr = Helper.encodeDeepLinkData(newDeepLinkObj);
    this.router.navigate( ['employees/' + encodedObjStr]);
  }

  public changeCurrEmployeeId(value: string) {
    let newDept: string;
    if (!value) {
      newDept = this.currDept;
    } else {
      const tempEmployee = this.getEmployeeByIdentifier(value);
      if (!tempEmployee) { return; }

      if (tempEmployee.dept === this.currDept) {
        newDept = this.currDept;
      } else {
        newDept = undefined;
      }
    }

    const newDeepLinkObj = this.buildDeepLinkObj(newDept, value);
    const encodedObjStr = Helper.encodeDeepLinkData(newDeepLinkObj);
    this.router.navigate( ['employees/' + encodedObjStr]);
  }

  public reservedFilterChange() {
    this.queryEmployeeList('filter');
  }

  public zeroFilterChange() {
    this.queryEmployeeList('filter');
  }

  public completedFilterChange() {
    this.queryEmployeeList('filter');
  }

  public textSearchChanged() {
    this.queryEmployeeList('filter');
  }

  public sortDirectionChanged() {
    const newDirection = this.sortDesc ? 'desc' : 'asc';
    if ( this.currOrderDirection === newDirection ) { return; }
    this.currOrderDirection = newDirection;
    this.queryEmployeeList('sort');
  }

  public sortChanged() {
    let newSortBy: 'name' | 'identifier' | 'createdAt';

    switch (this.sortBy) {
      case 'name':
        newSortBy = 'name';
        break;
      case 'identifier':
        newSortBy = 'identifier';
        break;
      case 'createdAt':
      default:
        newSortBy = 'createdAt';
        break;
    }

    if (this.currOrderBy === newSortBy) {
      return;
    }

    this.currOrderBy = newSortBy;
    this.queryEmployeeList('sort');
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              public dialog: MatDialog) {
    this.logger.setDbi = dbi;

    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});

    // HIER
    this.initEmployeeListSubscription();
    // BUT WHAT IS WITH THE USERS EMPLOYEE, its in employees if user is admin...
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const deepLinkDataRowStr = params.get('data');
      const deocdeDeepLinkData = Helper.deocdeDeepLinkData(deepLinkDataRowStr);

      if (!deocdeDeepLinkData) {
        this.currDept = undefined;
        this.currEmployeeId = undefined;
        return;
      }

      if (!!deocdeDeepLinkData[this.deepLinkDeptStr]) {
        this.currDept = deocdeDeepLinkData[this.deepLinkDeptStr];
      } else {
        this.currDept = undefined;
      }

      if (!!deocdeDeepLinkData[this.deepLinkEmployeeIdStr]) {
        this.currEmployeeId = deocdeDeepLinkData[this.deepLinkEmployeeIdStr];
      } else {
        this.currEmployeeId = undefined;
      }

      this.queryEmployeeList('filter');
    });
  }

  public isDeleting(employeeDocId: string) {
    return this.employeeIdsToDelete.indexOf(employeeDocId) !== -1;
  }

  private initEmployeeListSubscription() {
    const tempList = [];
    // console.log('const tempList = [];'); console.log(tempList);
    // const wonEmployee = this.dpo.usersEmployeeAccessesAdd;
    // tempList.push(ownEmployee);

    const tempList2 = this.dbi.dpo.getEmployees();
    // console.log('const tempList2 = this.dpo.getEmployees();'); console.log(tempList2);
    tempList.push(...tempList2);
    // console.log('tempList.push(tempList2);'); console.log(tempList);
    this.employeeList = tempList;
    // console.log('this.employees = tempList;'); console.log(this.employeeList);
    this.queryEmployeeList('filter');
    // tslint:disable-next-line:quotemark
    // console.log("this.queryEmployeeList('filter');"); console.log(this.employeeListPaginated);

    this.dbi.dpo.employeeAdd.subscribe({
      next: employee => {
        this.employeeList.push(employee);
        this.queryEmployeeList('filter');
      }
    });

    this.dbi.dpo.employeeModify.subscribe({
      next: employee => {
        for (let i = 0; i < this.employeeList.length; i++) {
          if (this.employeeList[i].docId === employee.docId) {
            this.employeeList[i] = employee;
            this.queryEmployeeList('filter');
            return;
          }
        }
        // CHANGING AN EMPLOYEE THAT IS UNKNOWN IS NOT PSOOIBLE
        this.logger.logError('88377355');
      }
    });

    this.dbi.dpo.employeeRemove.subscribe({
      next: employee => {
        this.employeeIdsToDelete.push( employee.docId );
        setTimeout(() => {
          for (let i = 0; i < this.employeeList.length; i++) {
            if (this.employeeList[i].docId === employee.docId) {
              this.employeeList.splice(i, 1);
              this.queryEmployeeList('filter');
              break;
            }
          }
          const i2 = this.employeeIdsToDelete.indexOf(employee.docId);
          this.employeeIdsToDelete.splice(i2, 1);
        }, 800);
      }
    });
  }

  private filterEmployeeList(employees: Employee[]): Employee[] {
    return employees.filter((employee) => {
      return this.employeeIsFilterdIn(employee);
    });
  }

  private employeeIsFilterdIn(employee: Employee): boolean {
    if (!!this.currTextSearch) {
      if ((!employee.name || !employee.name.toUpperCase().includes(this.currTextSearch.toUpperCase())) &&
          (!employee.identifier || !employee.identifier.toUpperCase().includes(this.currTextSearch.toUpperCase())) &&
          (!employee.dept || !employee.dept.toUpperCase().includes(this.currTextSearch.toUpperCase()))) {
        return false;
      }
    }

    if (         !!this.currDept && employee.dept !== this.currDept)              { return false; }
    if (   !!this.currEmployeeId && employee.identifier !== this.currEmployeeId)  { return false; }

    // HIER Hier hier
    // if ( !!this.filterCompleted && employee.finished === false)                  { return false; }
    // if (  !!this.filterReserved && employee.reserved === false)                  { return false; }
    // if (   !!this.filterZeroTTA && employee.allocatedTime === employee.duration)  { return false; }
    return true;
  }

  private sortEmployeeList(employees: Employee[]): Employee[] {
    const newEmployees =  employees.slice(0);
    newEmployees.sort((a, b ) => {
      switch (this.currOrderBy) {
        case 'identifier':
            return (a.identifier.toUpperCase() > b.identifier.toUpperCase()) ? 1 :
              (a.identifier.toUpperCase() < b.identifier.toUpperCase()) ? -1 : 0;
        case 'name':
          return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 :
            (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 0;
        case 'createdAt':
        default:
            return (a.createTS > b.createTS) ? 1 :
              (a.createTS < b.createTS) ? -1 : 0;
      }
    });

    return ( this.currOrderDirection === 'desc' ) ? newEmployees.reverse() : newEmployees;
  }

  private paginateEmployeeList(employees: Employee[]): Employee[] {
    const sliceFrom: number = this.paginatorPageIndex * this.paginatorPageSize;
    const sliceTo: number = (this.paginatorPageIndex + 1) * this.paginatorPageSize;
    return employees.slice( sliceFrom, sliceTo);
  }

  public queryEmployeeList(queryTyp: 'filter' | 'sort' | 'paginate') {
    const oldLength = this.employeeListFiltered.length;
    switch (queryTyp) {
      case 'filter':
        this.employeeListFiltered = this.filterEmployeeList(this.employeeList);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'sort':
        this.employeeListSorted = this.sortEmployeeList(this.employeeListFiltered);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'paginate':
        this.employeeListPaginated = this.paginateEmployeeList(this.employeeListSorted);
        if (this.employeeListFiltered.length !== oldLength) {
          this.paginatorLength = this.employeeListFiltered.length;
          this.disablePaginators = this.paginatorLength === 0;
        }
    }
    // this.employeeListPaginated = this.employees;
  }

  public paginatorChanged(event) {
    // console.log('paginatorChanged');
    // console.log(this.paginatorPageEvent);

    this.paginatorPageEvent = event;
    this.paginatorPageIndex = event.pageIndex;
    this.paginatorPageSize = event.pageSize;

    this.disablePaginators = this.paginatorLength === 0;
    this.disableBottomPaginator = this.paginatorPageSize <= 5;

    this.queryEmployeeList('paginate');
  }

  private buildDeepLinkObj(dept: string, employeeId: string): {} {
    const obj = {};

    if (!!employeeId) {
      obj[this.deepLinkEmployeeIdStr] = employeeId;
    }
    if (!!dept) {
      obj[this.deepLinkDeptStr] = dept;
    }

    return obj;
  }

  public goBack() {
    if (!!this.currEmployeeId) {
      this.changeCurrEmployeeId(undefined);
      return;
    }

    this.changeCurrDept(undefined);
  }

  public getEmployeeByIdentifier(employeeId) {
    for (const employee of this.employeeList) {
      if (employee.identifier === employeeId) {
        return employee;
      }
    }
    return undefined;
  }

  public addEmployeeButtonClicked() {
    console.log('HIER');
    const data = {};
    // if (!!this.currFolder) { data[Project.folderKeyStr] = this.currFolder; }
    // if (!!this.filterReserved) { data[Project.reservedKeyStr] = this.filterReserved; }

    const dialog = this.dialog.open(CreateEmployeeDialogComponent, { data });

    dialog.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      console.log( 'pls add this to the db... ok... thx' );
      console.log(result);
      const identifier = result[Employee.identifierKeyStr];
      const name       = result[Employee.nameKeyStr];
      const dept       = result[Employee.deptKeyStr];
      const deptColor  = result[Employee.deptColorKeyStr];
      const group      = result[Employee.groupKeyStr];
      const groupColor = result[Employee.groupColorKeyStr];
      const user       = result[Employee.userKeyStr];
      const scheduler  = result[Employee.schedulerKeyStr];
      const selfEdit   = result[Employee.selfEditKeyStr];

      if (!name || !identifier) { return; }

      this.dbi.addEmployeeToDB(identifier,
                               name,
                               dept,
                               deptColor,
                               group,
                               groupColor,
                               user,
                               scheduler,
                               selfEdit)
        .then(() => {
          console.log('BENE!');
        })
        .catch(err => {
          this.logger.logError('94885585', err);
        });
    //   this.dbi.addProjectToDB(projIdentifier, projName, projDuration, projEndless, projColor, projMarker,
    //                          projMarkerColor, projNote, projReserved, projFolder)
    //     .then(() => { console.warn('throw a toast'); })
    //     .catch(err => {
    //       this.logger.logError(31436414, err);
    //       console.warn('throw a toast');
    //     });
    });
  }

  // HIER : add dialog stuff
}

@Component({
  selector: 'app-create-employee-dialog',
  templateUrl: 'create-employee-dialog.html',
})
export class CreateEmployeeDialogComponent {
  public empIdentifierKeyStr = Employee.identifierKeyStr;
  public empNameKeyStr       = Employee.nameKeyStr;
  public empDeptKeyStr       = Employee.deptKeyStr;
  public empDeptColorKeyStr  = Employee.deptColorKeyStr;
  public empGroupKeyStr      = Employee.groupKeyStr;
  public empGroupColorKeyStr = Employee.groupColorKeyStr;
  public empUserKeyStr       = Employee.userKeyStr;
  public empSchedulerKeyStr  = Employee.schedulerKeyStr;
  public empSelfEditKeyStr   = Employee.selfEditKeyStr;

  constructor(public dialogRef: MatDialogRef<CreateEmployeeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {}) {
    data[this.empIdentifierKeyStr] = undefined;
    data[this.empNameKeyStr] = undefined;
    data[this.empDeptKeyStr] = undefined;
    data[this.empDeptColorKeyStr] = undefined;
    data[this.empGroupKeyStr] = undefined;
    data[this.empGroupColorKeyStr] = undefined;
    data[this.empUserKeyStr] = undefined;
    data[this.empSchedulerKeyStr] = undefined;
    data[this.empSelfEditKeyStr] = undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
