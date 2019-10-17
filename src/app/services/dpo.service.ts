import { Injectable, EventEmitter } from '@angular/core';
import { Project } from '../helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DpoService {
  private projectList: Project[] = [];

  private projectListChangeEmitter = new EventEmitter<Project[]>();
  public projectListChange: Observable<Project[]> = this.projectListChangeEmitter.asObservable();

  private projectAddEmitter = new EventEmitter<[Project, number]>();
  public projectAdd: Observable<[Project, number]> = this.projectAddEmitter.asObservable();

  constructor() {
    //
  }

  public getProjectList(): Project[] {
    return this.projectList;
  }

  private addProject(project: Project) {
    this.projectList.push(project);
    const newLength = this.projectList.length;
    this.projectListChangeEmitter.emit(this.projectList);
    this.projectAddEmitter.emit([this.projectList[(newLength - 1)], (newLength - 1)]);
  }

  /**
   * do not use this
   */
  public addProjects(projectTupleList: [Project[], string[]]) {
    const projects = projectTupleList[0];
    projects.forEach(project => {
      this.addProject(project);
    });
  }
}
