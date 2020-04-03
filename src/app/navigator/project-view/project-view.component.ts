import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { Project, Helper } from 'src/app/helper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DbiService } from 'src/app/services/dbi.service';
import { LoggerService } from 'src/app/services/logger.service';
import { MatBadgePosition } from '@angular/material';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { WeekViewService } from '../planboard-view/week-view/week-view.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  @Input() isSideNav;

  private deepLinkData: {} = undefined;
  private readonly deepLinkFolderStr = 'f';
  private readonly deepLinkProjectIdStr = 'p';

  public readonly matBadgePositionBefore = 'before' as MatBadgePosition;

  public isMobile = false;
  public isLandscape = true;

  public currFolder: string = undefined;
  public currProjectId: string = undefined;
  private projectList: Project[] = [];

  private projectListFiltered: Project[] = [];
  private projectListSorted: Project[] = [];
  public projectListPaginated: Project[] = [];

  public filterReserved = false;
  public filterZeroTTA = false;
  public filterCompleted = false;
  public sortBy = 'createdAt';
  public sortDesc = false;
  private currTextSearch: string;

  private syncProjOrderBy: 'createTS' | 'editTS' | 'useTS' = 'createTS';
  // private syncProjStartAt = new Date( Date.now() - 30 * Helper.msPerDay );
  private syncProjStartAt = new Date(0);
  // private syncProjEndBefore = new Date( Date.now() ); // HIER
  private syncProjEndBefore = new Date( Date.now() + 30 * Helper.msPerDay );
  public projStartAtDispStr = Helper.getEuropeanDateString(this.syncProjStartAt, true);
  public projEndAtDispStr = Helper.getEuropeanDateString(this.syncProjEndBefore, true);
  public displayProjectOrder: string;

  private currOrderBy: 'name' | 'identifier' | 'createdAt' = 'createdAt';
  private currOrderDirection: 'asc' | 'desc' = 'asc';

  public disablePaginators = true;
  public disableBottomPaginator = true;
  public paginatorLength = 0;
  public paginatorPageSizeOptions: number[] = [5, 10, 25, 50, 100, 200];
  public paginatorPageSize = this.paginatorPageSizeOptions[3];
  public paginatorPageEvent: PageEvent;
  public paginatorPageIndex = 0;

  public projectIdsToDelete: string[] = [];

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

  public reservedFilterChange() {
    this.queryProjctList('filter');
  }

  public zeroFilterChange() {
    this.queryProjctList('filter');
  }

  public completedFilterChange() {
    this.queryProjctList('filter');
  }

  public textSearchChanged() {
    this.queryProjctList('filter');
  }

  public sortDirectionChanged() {
    const newDirection = this.sortDesc ? 'desc' : 'asc';
    if ( this.currOrderDirection === newDirection ) { return; }
    this.currOrderDirection = newDirection;
    this.queryProjctList('sort');
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
    this.queryProjctList('sort');
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private globalData: GlobalDataService,
              private dbi: DbiService,
              private logger: LoggerService,
              public dialog: MatDialog,
              private wvs: WeekViewService) {
    this.logger.setDbi = dbi;

    this.isMobile = globalData.getIsMobile();
    this.globalData.isMobileSateChange.subscribe({ next: val => { this.isMobile = val; } });

    this.isLandscape = globalData.getIsLandscape();
    this.globalData.isLandscapeSateChange.subscribe({ next: val => { this.isLandscape = val; } });

    this.initProjectListSubscription();

    console.log('isSideNav', this.isSideNav);
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

      this.queryProjctList('filter');
    });

    let newDisplayStr = '';
    switch (this.syncProjOrderBy) {
      case 'createTS':
        newDisplayStr = 'erstellt';
        break;
      case 'editTS':
        newDisplayStr = 'verändert';
        break;
      case 'useTS':
        newDisplayStr = 'benutzt';
        break;
    }
    this.displayProjectOrder =
      newDisplayStr +
      ' vom ' +
      Helper.getEuropeanDateString(this.syncProjStartAt, true) +
      ' bis ' +
      Helper.getEuropeanDateString(this.syncProjEndBefore, true);

    this.dbi.startSyncProjects(
      this.syncProjOrderBy,
      this.syncProjStartAt,
      this.syncProjEndBefore);
  }

  //#region HIER

  private setAnimationState(pdId: string, aniState: 'addAni' | 'changeAni' | 'removedAni' | 'noAni') {
    /* THIS */

    // const i = getIndexOfProject( pdId );
    // this.projectAniList[i] = aniState;

    // if (aniState === 'noAni') { return; }

    // setTimeout( () => {
    //   this.projectAniList[i] = 'noAni';
    // }, 1000 );

    /* OR THAT */

    // const i = getIndexOfProject( pdId );
    // if ( this.projectAniList[i] !== aniState || aniState === 'noAni' ) {
    //   this.projectAniList[i] = aniState;
    // } else {
    //   this.projectAniList[i] = 'noAni';
    //   setTimeout(() => {
    //     this.projectAniList[i] = aniState;
    //   }, 100);
    // }
  }

  public getAnimationState(porjDocId: string) {
    // const i = getIndexOfProject( pdId );
    // const aniState = this.projectAniList[i];
    // switch (this.projectAniList[i]) {
    //   case 'addAni':
    //     return '';
    //   case 'changeAni':
    //     return '';
    //   case 'removedAni':
    //     return '';
    //   case 'noAni':
    //   default:
    //     return 'unset' or 'none' kp...;
    // }
  }

  //#endregion

  public isDeleting(projectDocId: string) {
    return this.projectIdsToDelete.indexOf(projectDocId) !== -1;
  }

  private initProjectListSubscription() {
    // this.projectList = this.dpo.getProjectList();
    // this.queryProjctList('filter');

    // this.paginatorLength = this.projectList.length;
    // this.disablePaginators = this.paginatorLength === 0;
    // this.disableBottomPaginator = this.paginatorPageSize <= 5;

    this.dbi.dpo.projectAdd.subscribe({
      next: project => {
        this.projectList.push(project);
        this.queryProjctList('filter');
      }
    });

    this.dbi.dpo.projectModify.subscribe({
      next: project => {
        console.log('mod me:');
        console.log(project);
        for (let i = 0; i < this.projectList.length; i++) {
          if (this.projectList[i].docId === project.docId) {
            this.projectList[i] = project;
            // this.projectList.splice(i, 1, project);
            console.log('chaged!');
            this.queryProjctList('filter');
            break;
          }
        }
      }
    });

    this.dbi.dpo.projectRemove.subscribe({
      next: project => {
        this.projectIdsToDelete.push( project.docId );
        setTimeout(() => {
          for (let i = 0; i < this.projectList.length; i++) {
            if (this.projectList[i].docId === project.docId) {
              this.projectList.splice(i, 1);
              this.queryProjctList('filter');
              break;
            }
          }
          const i2 = this.projectIdsToDelete.indexOf(project.docId);
          this.projectIdsToDelete.splice(i2, 1);
        }, 800);
      }
    });
  }

  private filterProjectList(projects: Project[]): Project[] {
    return projects.filter((project) => {
      return this.projectIsFilterdIn(project);
    });
  }

  private projectIsFilterdIn(project: Project): boolean {
    if (!!this.currTextSearch) {
      if ((!project.name || !project.name.toUpperCase().includes(this.currTextSearch.toUpperCase())) &&
          (!project.identifier || !project.identifier.toUpperCase().includes(this.currTextSearch.toUpperCase())) &&
          (!project.note || !project.note.toUpperCase().includes(this.currTextSearch.toUpperCase()))) {
        return false;
      }
    }

    if (      !!this.currFolder && project.folder !== this.currFolder)          { return false; }
    if (   !!this.currProjectId && project.identifier !== this.currProjectId)   { return false; }
    if ( !!this.filterCompleted && project.finished === false)                  { return false; }
    if (  !!this.filterReserved && project.reserved === false)                  { return false; }
    if (   !!this.filterZeroTTA && project.allocatedTime === project.duration)  { return false; }
    return true;
  }

  private sortProjectList(projects: Project[]): Project[] {
    const newProjects =  projects.slice(0);
    newProjects.sort((a, b ) => {
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

    return ( this.currOrderDirection === 'desc' ) ? newProjects.reverse() : newProjects;
  }

  private paginateProjectList(projects: Project[]): Project[] {
    const sliceFrom: number = this.paginatorPageIndex * this.paginatorPageSize;
    const sliceTo: number = (this.paginatorPageIndex + 1) * this.paginatorPageSize;
    return projects.slice( sliceFrom, sliceTo);
  }

  public queryProjctList(queryTyp: 'filter' | 'sort' | 'paginate') {
    const oldLength = this.projectListFiltered.length;
    switch (queryTyp) {
      case 'filter':
        this.projectListFiltered = this.filterProjectList(this.projectList);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'sort':
        this.projectListSorted = this.sortProjectList(this.projectListFiltered);
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'paginate':
        this.projectListPaginated = this.paginateProjectList(this.projectListSorted);
        if ( this.projectListFiltered.length !== oldLength ) {
          this.paginatorLength = this.projectListFiltered.length;
          this.disablePaginators = this.paginatorLength === 0;
        }
    }
  }

  public paginatorChanged(event) {
    this.paginatorPageEvent = event;
    this.paginatorPageIndex = event.pageIndex;
    this.paginatorPageSize = event.pageSize;

    this.disablePaginators = this.paginatorLength === 0;
    this.disableBottomPaginator = this.paginatorPageSize <= 5;

    this.queryProjctList('paginate');
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

  public addProjectButtonClicked() {
    const data = {};
    if (!!this.currFolder) { data[Project.folderKeyStr] = this.currFolder; }
    if (!!this.filterReserved) { data[Project.reservedKeyStr] = this.filterReserved; }

    const dialog = this.dialog.open(CreateProjectDialogComponent, { data });

    dialog.afterClosed().subscribe(result => {
      if (!result) {
        console.warn('Ok ciao...');
        return;
      }
      console.log( 'pls add this to the db... ok... thx' );
      console.log(result);
      const projIdentifier = result[Project.identifierKeyStr];
      const projName = result[Project.nameKeyStr];
      const projDuration = result[Project.durationKeyStr];
      const projEndless = result[Project.endlessKeyStr];
      const projColor = result[Project.colorKeyStr];
      const projMarker = result[Project.markerKeyStr];
      const projMarkerColor = result[Project.markerColorKeyStr];
      const projNote = result[Project.noteKeyStr];
      const projReserved = result[Project.reservedKeyStr];
      const projFolder = result[Project.folderKeyStr];

      if (!projName || !projIdentifier || ( !projDuration && !projEndless ) ) {
        return;
      }

      this.dbi.addProjectToDB(projIdentifier, projName, projDuration, projEndless, projColor, projMarker,
                             projMarkerColor, projNote, projReserved, projFolder)
        .then(() => { console.warn('throw a toast'); })
        .catch(err => {
          this.logger.logError(31436414, err);
          console.warn('throw a toast');
        });
    });
  }

  public changeProjectQueryoptionsClicked() {
    const data = {};
    // data[ProjectQueryoptionsDialogComponent.queryByKeyStr] = ; // HIER
    // data[ProjectQueryoptionsDialogComponent.queryByKeyStr] = ; // HIER
    // data[ProjectQueryoptionsDialogComponent.queryByKeyStr] = ; // HIER

    const dialog = this.dialog.open(ProjectQueryoptionsDialogComponent, { data });

    dialog.afterClosed().subscribe(result => {
      if (!result) {
        console.warn('Ok ciao...');
        return;
      }

      console.log('das ist der neue query stuff', result ); // HIER
    });
  }

  public pcDragStarted(e: { source: CdkDrag }, project: Project) {
    if ( !e || !e.source || !e.source.dropContainer ) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }
    e.source.data = 'project';
    e.source.dropContainer.connectedTo = this.wvs.getRegisteredEmployeeDayDropRef;
    this.wvs.dragProjectStart(project); // HIER
  }
}

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: 'create-project-dialog.html',
})
export class CreateProjectDialogComponent {
  public projIdentifierKeyStr = Project.identifierKeyStr;
  public projNameKeyStr = Project.nameKeyStr;
  public projDurationKeyStr = Project.durationKeyStr;
  public projEndlessKeyStr = Project.endlessKeyStr;
  public projColorKeyStr = Project.colorKeyStr;
  public projMarkerKeyStr = Project.markerKeyStr;
  public projMarkerColorKeyStr = Project.markerColorKeyStr;
  public projNoteKeyStr = Project.noteKeyStr;
  public projReservedKeyStr = Project.reservedKeyStr;
  public projFolderKeyStr = Project.folderKeyStr;

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {}) {
    data[this.projNameKeyStr] = '';
    data[this.projIdentifierKeyStr] = '';
    data[this.projEndlessKeyStr] = false;
    data[this.projDurationKeyStr] = undefined;
    data[this.projColorKeyStr] = '#ff0000';
    data[this.projMarkerKeyStr] = '';
    data[this.projMarkerColorKeyStr] = '#00ff00';
    data[this.projNoteKeyStr] = '';
    data[this.projReservedKeyStr] = false;
    data[this.projFolderKeyStr] = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-project-queryoptions-dialog',
  templateUrl: 'project-queryoptions-dialog.html',
})
export class ProjectQueryoptionsDialogComponent {
  public static queryByKeyStr = 'queryBy';
  public static queryFromKeyStr = 'queryFrom';
  public static queryToKeyStr = 'queryTo';

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {}) {
    data[ProjectQueryoptionsDialogComponent.queryByKeyStr] = undefined;
    data[ProjectQueryoptionsDialogComponent.queryFromKeyStr] = undefined;
    data[ProjectQueryoptionsDialogComponent.queryToKeyStr] = undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
