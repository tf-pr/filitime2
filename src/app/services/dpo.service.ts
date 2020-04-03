import { Injectable, EventEmitter } from '@angular/core';
import { Project, Employee, Assignment, Helper } from '../helper';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DpoService {
  //#region projectView properties

  private projectList: Project[] = [];
  private projectIdList: string[] = [];

  private projectListChangeEmitter = new EventEmitter<Project[]>();
  public projectListChange: Observable<Project[]> = this.projectListChangeEmitter.asObservable();

  private projectAddEmitter = new EventEmitter<Project>();
  public projectAdd: Observable<Project> = this.projectAddEmitter.asObservable();

  private projectRemoveEmitter = new EventEmitter<Project>();
  public projectRemove: Observable<Project> = this.projectRemoveEmitter.asObservable();

  private projectModifyEmitter = new EventEmitter<Project>();
  public projectModify: Observable<Project> = this.projectModifyEmitter.asObservable();

  private projectAddSub: Subscription;
  private projectModifySub: Subscription;
  private projectRemoveSub: Subscription;

  //#endregion

  //#region employee properties

  private usersEmployeeAccesses: [string, boolean][] = [];
  private usersEmployeeAccessesEmpIds: string[] = [];

  private usersEmployeeAccessesChangeEmitter = new EventEmitter<[string, boolean][]>();
  public usersEmployeeAccessesChange = this.usersEmployeeAccessesChangeEmitter.asObservable();

  private usersEmployeeAccessesAddEmitter = new EventEmitter<[string, boolean][]>();
  public usersEmployeeAccessesAdd = this.usersEmployeeAccessesAddEmitter.asObservable();

  private usersEmployeeAccessesRemoveEmitter = new EventEmitter<[string, boolean][]>();
  public usersEmployeeAccessesRemove = this.usersEmployeeAccessesRemoveEmitter.asObservable();

  private usersEmployeeAccessesModifyEmitter = new EventEmitter<[string, boolean][]>();
  public usersEmployeeAccessesModify = this.usersEmployeeAccessesModifyEmitter.asObservable();

  private usersEmployeeAccessesSub: Subscription;

  private employees: Employee[] = [];
  private employeeIds: string[] = [];

  private employeesChangeEmitter = new EventEmitter<Employee[]>();
  public employeesChange = this.employeesChangeEmitter.asObservable();

  private employeeAddEmitter = new EventEmitter<Employee>();
  public employeeAdd = this.employeeAddEmitter.asObservable();

  private employeeRemoveEmitter = new EventEmitter<Employee>();
  public employeeRemove = this.employeeRemoveEmitter.asObservable();

  private employeeModifyEmitter = new EventEmitter<Employee>();
  public employeeModify = this.employeeModifyEmitter.asObservable();

  private employeeSubs: [string, Subscription][] = [];

  private allEmployeesAddSub: Subscription;
  private allEmployeesModifySub: Subscription;
  private allEmployeesRemoveSub: Subscription;

  //#endregion

  //#region planboard weekView

  private tableCwIndexes: number[] = [];
  private tableEmployeeIds: string[] = [];
  private tableSubs: Subscription[][];

  public getTableCwIndexes() {
    return this.tableCwIndexes.slice(0);
  }

  public getTableEmployeeIds() {
    return this.tableEmployeeIds.slice(0);
  }

  public getTableSubs() {
    if (!this.tableSubs || this.tableSubs.length === 0) {
      return ([] as Subscription[][]);
    }
    return this.tableSubs.slice(0);
  }

  public addCwToTable( newCwIndex: number, newSubs: Subscription[] ): boolean {
    if ( newSubs.length !== this.tableEmployeeIds.length ) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return false;
    }

    const cwListWasEmpty = ( this.tableCwIndexes.length === 0 );
    if (cwListWasEmpty) {
      this.tableCwIndexes.push(newCwIndex);
      this.tableSubs.push(newSubs.slice(0));
      return true;
    }

    const firstIndex = this.tableCwIndexes[0];
    const lastIndex = this.tableCwIndexes[this.tableCwIndexes.length - 1];

    const tempDate1 = new Date(firstIndex);
    const tempDate2 = new Date(lastIndex);

    Helper.subtractDaysOfDate(tempDate1, 7);
    Helper.addDaysToDate(tempDate2, 7);

    const addBefore = newCwIndex !== tempDate1.valueOf();
    const addAfter = newCwIndex !== tempDate2.valueOf();

    if (addAfter) {
      this.tableCwIndexes.push(newCwIndex);
      this.tableSubs.push(newSubs.slice(0));
      return true;
    }
    if (addBefore) {
      this.tableCwIndexes.unshift(newCwIndex);
      this.tableSubs.unshift(newSubs.slice(0));
      return true;
    }

    // tslint:disable-next-line:no-debugger
    debugger;
    return false;
  }

  public addEmployeeToTable( newEmployeeId: string, newSubs: Subscription[] ): boolean {
    if ( newSubs.length !== this.tableCwIndexes.length ) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return false;
    }

    if (this.tableEmployeeIds.indexOf(newEmployeeId) !== -1) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    this.tableEmployeeIds.push(newEmployeeId);
    this.tableSubs.push(newSubs.slice(0));
    return true;
  }

  //#endregion

  constructor() {
    //
  }

  /**
   * do not use this
   */
  public reset() {
    this.stopSyncProjects();
    this.projectList = [];
    this.projectIdList = [];
  }

  //#region projectView getter

  public getProjectList(): Project[] {
    return this.projectList;
  }

  //#endregion

  //#region projectView methodes

  /**
   * do not use this
   */
  public emptyProjectList() {
    const tempList = this.projectList.slice(0);
    this.projectList = [];
    this.projectIdList = [];
    this.projectListChangeEmitter.emit(this.projectList);
    tempList.forEach(tempListItem => {
      this.projectRemoveEmitter.emit(tempListItem);
    });
  }

  private buildProjectIdList() {
    this.projectIdList = this.projectList.length === 0 ? [] : this.projectList.map(project => project.docId );
  }

   /**
    * do not use this
    */
  public setProjectList(projectList: Project[]) {
    const oldList = this.projectList.slice(0);
    this.projectList = projectList;
    this.buildProjectIdList();
    this.projectListChangeEmitter.emit(this.projectList);
    oldList.forEach(oldListItem => {
      this.projectRemoveEmitter.emit(oldListItem);
    });
    this.projectList.forEach(projectListItem => {
      this.projectAddEmitter.emit(projectListItem);
    });
  }

  /**
   * do not use this
   */
  public stopSyncProjects() {
    if ( !!this.projectAddSub    ) { this.projectAddSub.unsubscribe();    }
    if ( !!this.projectModifySub ) { this.projectModifySub.unsubscribe(); }
    if ( !!this.projectRemoveSub ) { this.projectRemoveSub.unsubscribe(); }
    this.projectAddSub    = undefined;
    this.projectModifySub = undefined;
    this.projectRemoveSub = undefined;
  }

  /**
   * do not use this
   */
  public startSyncProjects(projectAddSub: Subscription, projectModifySub: Subscription, projectRemoveSub: Subscription) {
    this.stopSyncProjects();

    this.projectAddSub = projectAddSub;
    this.projectModifySub = projectModifySub;
    this.projectRemoveSub = projectRemoveSub;
  }

  /**
   * do not use this
   */
  public addProject(project: Project) {
    this.projectList.push(project);
    this.projectIdList.push(project.docId);
    const newLength = this.projectList.length;
    this.projectListChangeEmitter.emit(this.projectList);
    this.projectAddEmitter.emit(this.projectList[(newLength - 1)]);
  }

  /**
   * do not use this
   */
  public addProjects(projects: Project[]) {
    projects.forEach(project => {
      this.addProject(project);
    });
  }

  /**
   * do not use this
   */
  public modifyProject(project: Project) {
    const projDocId = project.docId;
    let i = this.projectIdList.indexOf( projDocId );
    if (i === -1) {
      console.warn('Warning: 43415364');
      this.buildProjectIdList();
      i = this.projectIdList.indexOf( projDocId );

      if ( i === -1 ) {
        console.warn('Error: 34135464');
        this.addProject(project);
        return;
      }
    }

    // HIER check for project changes via areProjectEquel o.d.s

    this.projectList[i] = project;
    this.projectListChangeEmitter.emit(this.projectList);
    this.projectModifyEmitter.emit(project);
  }

  /**
   * do not use this
   */
  public modifyProjects(projects: Project[]) {
    projects.forEach(project => {
      this.modifyProject(project);
    });
  }

  /**
   * do not use this
   */
  public removeProject(project: Project) {
    console.log('removeProject');
    const projDocId = project.docId;
    let i = this.projectIdList.indexOf(projDocId);
    console.log({i});
    if (i === -1) {
      console.warn('Warning: 46116986');
      this.buildProjectIdList();
      i = this.projectIdList.indexOf(projDocId);
      if (i === -1) {
        console.error('Error: 16438565');
        return;
      }
    }

    this.projectList.splice(i, 1);
    this.projectIdList.splice(i, 1);
    this.projectListChangeEmitter.emit(this.projectList);
    this.projectRemoveEmitter.emit(project);
  }

  /**
   * do not use this
   */
  public removeProjects(projects: Project[]) {
    console.log('removeProjects');
    console.log(projects);
    projects.forEach(project => {
      this.removeProject(project);
    });
  }

  //#endregion

  //#region employee getter & setter

  /**
   * DO NOT USE THIS!!!
   */
  public setUsersEmployeeAccesses(newAccesses: [string, boolean][]) {
    this.usersEmployeeAccesses = newAccesses;
    this.usersEmployeeAccessesEmpIds = this.usersEmployeeAccesses.map(access => access[0]);
  }

  public getUsersEmployeeAccesses(): [string, boolean][] {
    return this.usersEmployeeAccesses.slice(0);
  }

  private getEmployeeIdsOfEmployeeSubs(): string[] {
    return this.employeeSubs.map(employeeSubsItem => employeeSubsItem[0]);
  }

  public getEmployees(): Employee[] {
    return this.employees.slice(0);
  }

  //#endregion

  //#region employee methodes

  public startSyncUsersEmployeeAccesses(accessesSub: Subscription) {
    this.stopSyncUsersEmployeeAccesses();
    this.usersEmployeeAccessesSub = accessesSub;
  }

  public stopSyncUsersEmployeeAccesses() {
    if (!this.usersEmployeeAccessesSub) { return; }
    this.usersEmployeeAccessesSub.unsubscribe();
    this.usersEmployeeAccessesSub = undefined;
  }

  public startSyncEmployee(employeeId: string, employeeSub: Subscription) {
    const i = this.getEmployeeIdsOfEmployeeSubs().indexOf(employeeId);
    if (i !== -1) {
      console.error('U RLY WANNA DOUBLE SYNC THE SAME EMPLOYEE?! ... GO FU SOAB!!');
      return;
    }
    this.employeeSubs.push([employeeId, employeeSub]);
  }

  public stopSyncEmployee(employeeId) {
    const i = this.getEmployeeIdsOfEmployeeSubs().indexOf(employeeId);
    if (i === -1) {
      console.error('U RLY WANNA UNSYNC AN EMPLOYEE NOT BEEING LISTED?! ... GO FU SOAB!!');
      return;
    }
    const empSubTuple = this.employeeSubs.splice(i, 1)[0];
    empSubTuple[1].unsubscribe();
  }

  /**
   * do not use this
   */
  public stopSyncAllEmployees() {
    if ( !!this.allEmployeesAddSub    ) { this.allEmployeesAddSub.unsubscribe();    }
    if ( !!this.allEmployeesModifySub ) { this.allEmployeesModifySub.unsubscribe(); }
    if ( !!this.allEmployeesRemoveSub ) { this.allEmployeesRemoveSub.unsubscribe(); }
    this.allEmployeesAddSub    = undefined;
    this.allEmployeesModifySub = undefined;
    this.allEmployeesRemoveSub = undefined;
  }

  /**
   * do not use this
   */
  public startSyncAllEmployees(projectAddSub: Subscription, projectModifySub: Subscription, projectRemoveSub: Subscription) {
    this.stopSyncAllEmployees();

    this.allEmployeesAddSub = projectAddSub;
    this.allEmployeesModifySub = projectModifySub;
    this.allEmployeesRemoveSub = projectRemoveSub;
  }

  public modifyEmployeeAccess(access: [string, boolean]) {
    const i = this.usersEmployeeAccessesEmpIds.indexOf(access[0]);
    if (i === -1) {
      console.error('DUDE!!! WTF IS THIS?!?!?');
      return;
    }

    if (this.usersEmployeeAccesses[i][0] !== access[0]) {
      console.error('WOW U STUPID FUCK MANAGED TO FUCK UP THE IDS! WOW! GJ!');
      console.error('1: ' + JSON.stringify(this.usersEmployeeAccessesEmpIds));
      console.error('2: ' + JSON.stringify(this.usersEmployeeAccesses));
      console.error('NOW LOOK AT 1 AND 2 AND THAN GO FUCK YOURSELF!');
      return;
    }

    this.usersEmployeeAccesses[i][1] = access[1];
  }

  private buildEmployeeIds() {
    this.employeeIds = this.employees.length === 0 ? [] : this.employees.map(employee => employee.docId);
  }

  /**
   * do not use this
   */
  public addOrModifyEmployee(employee: Employee) {
    const empDocId = employee.docId;
    const i = this.employeeIds.indexOf( empDocId );

    if ( i !== -1 ) {
      this.modifyEmployee(employee);
      return;
    }
    this.addEmployee(employee);
  }

  /**
   * do not use this
   */
  public addEmployee(employee: Employee) {
    this.employees.push(employee);
    this.employeeIds.push(employee.docId);
    const newLength = this.employees.length;
    this.employeesChangeEmitter.emit(this.employees);
    this.employeeAddEmitter.emit(this.employees[(newLength - 1)]);
  }

  /**
   * do not use this
   */
  public modifyEmployee(employee: Employee) {
    const empDocId = employee.docId;
    let i = this.employeeIds.indexOf( empDocId );
    if (i === -1) {
      console.warn('Warning: 76469785');
      this.buildEmployeeIds();
      i = this.employeeIds.indexOf( empDocId );

      if ( i === -1 ) {
        console.warn('Error: 57628195');
        this.addEmployee(employee);
        return;
      }
    }

    // HIER check for project changes via areProjectEquel o.d.s

    this.employees[i] = employee;
    this.employeesChangeEmitter.emit(this.employees);
    this.employeeModifyEmitter.emit(employee);
  }

  /**
   * do not use this
   */
  public removeEmployee(employeeId: string) {
    console.log('removeEmployee');
    let i = this.employeeIds.indexOf(employeeId);
    console.log({ i });
    if (i === -1) {
      console.warn('Warning: 78398218');
      this.buildEmployeeIds();
      i = this.employeeIds.indexOf(employeeId);
      if (i === -1) {
        console.error('Error: 85614532');
        return;
      }
    }

    const employee = this.employees.splice(i, 1)[0];
    this.employeeIds.splice(i, 1);
    this.employeesChangeEmitter.emit(this.employees);
    this.employeeRemoveEmitter.emit(employee);
  }

  //#endregion
}
