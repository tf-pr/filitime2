import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { Project, Helper } from 'src/app/helper';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  private deepLinkData: {} = undefined;
  private readonly deepLinkFolderStr = 'f';
  private readonly deepLinkProjectIdStr = 'p';

  public isMobile = false;
  public isLandscape = true;

  private currFolder: string = undefined;
  private currProjectId: string = undefined;
  public readonly projectList: Project[] = [];

  public changeCurrFolder(value: string) {
    const newDeepLinkObj = this.buildDeepLinkObj(value, undefined);
    const encodedObjStr = Helper.encodeDeepLinkData(newDeepLinkObj);
    this.router.navigate( ['projects/' + encodedObjStr]);
  }

  public changeCurrProjectId(value: string) {
    let newfolder: string;
    if (!value) {
      newfolder = this.currFolder;
    } else {
      const tempProject = this.getProjectByIdentifier(value);
      if (!tempProject) { return; }

      if (tempProject.folder === this.currFolder) {
        newfolder = this.currFolder;
      } else {
        newfolder = undefined;
      }
    }

    const newDeepLinkObj = this.buildDeepLinkObj(newfolder, value);
    const encodedObjStr = Helper.encodeDeepLinkData(newDeepLinkObj);
    this.router.navigate( ['projects/' + encodedObjStr]);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private globalData: GlobalDataService) {
    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({next: val => { this.isMobile = val; }});

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({next: val => { this.isLandscape = val; }});

    this.addDummyProjects();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const deepLinkDataRowStr = params.get('data');
      const deocdeDeepLinkData = Helper.deocdeDeepLinkData(deepLinkDataRowStr);

      if (!deocdeDeepLinkData) {
        this.currFolder = undefined;
        this.currProjectId = undefined;
        return;
      }

      if (!!deocdeDeepLinkData[this.deepLinkFolderStr]) {
        this.currFolder = deocdeDeepLinkData[this.deepLinkFolderStr];
      } else {
        this.currFolder = undefined;
      }

      if (!!deocdeDeepLinkData[this.deepLinkProjectIdStr]) {
        this.currProjectId = deocdeDeepLinkData[this.deepLinkProjectIdStr];
      } else {
        this.currProjectId = undefined;
      }
    });
  }

  private addDummyProjects() {
    this.projectList.push(new Project(
      '81996303',
      'Schule',
      5409460,
      true,
      5409460,
      true,
      '#ffbb00',
      null,
      null,
      null,
      false,
      undefined,
      false,
      undefined
    ));

    this.projectList.push(new Project(
      '91312365',
      'Achtelstraße 8H',
      9180,
      false,
      0,
      false,
      '#cce3b9',
      null,
      null,
      'https://web.memomeister.com/channel/5c38b3bc8d517529fb848ae2#{%22search%22:'
      + '{%22order%22:{%22field%22:%22createdAt%22,%22direction%22:-1}}}',
      false,
      undefined,
      false,
      'Ordner1'
    ));

    this.projectList.push(new Project(
      '12-21-445D',
      'Maria-Himmelfahrtweg 5',
      19200,
      false,
      -3360,
      false,
      '#8c4300',
      'Rot',
      '#FF0000',
      'Allgemeine Notizen ASP Adresse Änderungen vorgenommen Neue Projektnotiz',
      false,
      undefined,
      false,
      undefined,
    ));

    this.projectList.push(new Project(
      '76691924',
      'Tiefgaragensanierung',
      2400,
      false,
      -2700,
      false,
      '#f0e0a2',
      'Rot',
      '#FF0000',
      null,
      false,
      undefined,
      false,
      undefined,
    ));

    // newly added at 19-10-08

    this.projectList.push(new Project(
      '74636862',
      'Ludwigsallee 7',
      7200,
      false,
      -3285,
      false,
      '#00a1f1',
      'Grün',
      '#00FF0D',
      'Meine Notizen zum Projekt',
      false,
      undefined,
      false,
      'Ordner1',
    ));
  }

  public projectIsFilterdIn(project: Project): boolean {
    if (!this.currFolder && !this.currProjectId) {
      return true;
    }

    if (!!this.currProjectId) {
      return project.identifier === this.currProjectId;
    }

    return project.folder === this.currFolder;
  }

  private buildDeepLinkObj(folder: string, projectId: string): {} {
    const obj = {};

    if (!!projectId) {
      obj[this.deepLinkProjectIdStr] = projectId;
    }
    if (!!folder) {
      obj[this.deepLinkFolderStr] = folder;
    }

    return obj;
  }

  public goBack() {
    if (!!this.currProjectId) {
      this.changeCurrProjectId(undefined);
      return;
    }

    this.changeCurrFolder(undefined);
  }

  public getProjectByIdentifier(projectId) {
    for (const project of this.projectList) {
      if (project.identifier === projectId) {
        return project;
      }
    }
    return undefined;
  }
}
