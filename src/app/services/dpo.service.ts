import { Injectable, EventEmitter } from '@angular/core';
import { Project } from '../helper';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DpoService {
  //#region projectView properites

  private projectList: Project[] = [];
  private projectIdList: string[] = [];

  private projectListChangeEmitter = new EventEmitter<Project[]>();
  public projectListChange: Observable<Project[]> = this.projectListChangeEmitter.asObservable();

  private projectAddEmitter = new EventEmitter<[Project, number]>();
  public projectAdd: Observable<[Project, number]> = this.projectAddEmitter.asObservable();

  private projectRemoveEmitter = new EventEmitter<[Project, number]>();
  public projectRemove: Observable<[Project, number]> = this.projectRemoveEmitter.asObservable();

  private projectModifyEmitter = new EventEmitter<[Project, number]>();
  public projectModify: Observable<[Project, number]> = this.projectModifyEmitter.asObservable();

  private projectAddSub: Subscription;
  private projectModifySub: Subscription;
  private projectRemoveSub: Subscription;

  //#endregion

  constructor() {
    //
  }

  public get usersEmployeeId(): string {
    return '1YUxaezJagyTIL1AUmB8'; // HIER
  }

  public get usersEmployeeName(): string {
    return 'Chef'; // HIER
  }

  //#region projectView getter&setter

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
    for (let i = 0; i < tempList.length; i++) {
      this.projectRemoveEmitter.emit([tempList[i], i]);
    }
  }

  private buildProjectIdList() {
    let temp = [];
    temp = this.projectList.map(project => {
      return project.docId;
    });
    this.projectIdList = temp;
  }

   /**
    * do not use this
    */
  public setProjectList(projectList: Project[]) {
    const oldList = this.projectList.slice(0);
    this.projectList = projectList;
    this.buildProjectIdList();
    this.projectListChangeEmitter.emit(this.projectList);
    for (let i = 0; i < oldList.length; i++) {
      this.projectRemoveEmitter.emit([oldList[i], i]);
    }
    for (let i = 0; i < this.projectList.length; i++) {
      this.projectAddEmitter.emit([this.projectList[i], i]);
    }
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
    this.projectAddEmitter.emit([this.projectList[(newLength - 1)], (newLength - 1)]);
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

    this.projectList[i] = project;
    this.projectListChangeEmitter.emit(this.projectList);
    this.projectModifyEmitter.emit([project, i]);
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
    this.projectRemoveEmitter.emit([project, i]);
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
}
