import { DbiService } from './services/dbi.service';
import { LoggerService } from './services/logger.service';

export class Helper {
    public static readonly msPerDay: number = 86400000;
    public static readonly msPerHour: number = 3600000;
    public static readonly msPerMinute: number = 60000;
    private static readonly regExpEMail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    private static logger: LoggerService;

    constructor(private dbi: DbiService, private logger: LoggerService) {
        if (!Helper.logger) {
            Helper.logger = logger;
        }
    }

    public static checkForValidBoolean(val: any): boolean {
        if (typeof val !== 'boolean') {
            return false;
        }

        if (val === false) {
            return true;
        }

        if (!val) {
            return false;
        }

        return true;
    }

    public static checkForValidNumber(val: any): boolean {
        if (typeof val !== 'number') {
            return false;
        }

        if (val === 0) {
            return true;
        }

        if (!val) {
            return false;
        }

        return true;
    }

    // public static removeItemFromArrayAtIndex(array: any[], i: number): boolean {
    //     if (i < 0 || i > array.length) {
    //         return false;
    //     }

    //     array.splice(i, 1);
    //     return true;
    // }

    // public static removeItemFromArray(array: any[], item: any): boolean {
    //     const i = array.indexOf(item);
    //     if (i === -1) {
    //         return false;
    //     }

    //     return this.removeItemFromArrayAtIndex(array, i);
    // }

    public static emailFormatCheck(email: string): boolean {
        const result = this.regExpEMail.test(email);
        return result;
    }

    public static encodeDeepLinkData( dataObj: {} ): string {
        let paresedObjStr: string;
        let stringifyFailed = false;
        try {
            paresedObjStr = JSON.stringify(dataObj);
        } catch (error) {
            stringifyFailed = true;
        }

        if (!!stringifyFailed) {
            Helper.logger.logError(54635463);
            return undefined;
        }

        let encodedStr: string;
        let uriDecodingFailed = false;
        try {
            encodedStr = encodeURIComponent(paresedObjStr);
        } catch (error) {
            uriDecodingFailed = true;
        }

        if (!!uriDecodingFailed) {
            Helper.logger.logError(63543473);
            return undefined;
        }

        return encodedStr;
    }

    public  static deocdeDeepLinkData( dataStr: string ): {} {
        let decodedStr: string;
        let uriDecodingFailed = false;
        try {
            decodedStr = decodeURIComponent(dataStr);
        } catch (error) {
            Helper.logger.logError(89436435);
            uriDecodingFailed = true;
        }

        if (!!uriDecodingFailed) {
            return undefined;
        }

        let paresedObj: {};
        let jsonParseingFailed = false;
        try {
            paresedObj = JSON.parse(decodedStr);
        } catch (error) {
            Helper.logger.logError(68354867);
            jsonParseingFailed = true;
        }

        if (!!jsonParseingFailed) {
            return undefined;
        }

        return paresedObj;
    }

    public static getEuropeanDateString( date: Date, shortYear?: boolean ): string {
        let yearNum = date.getFullYear();
        if ( !!shortYear ) {
            yearNum = yearNum - Math.floor( yearNum / 100 ) * 100;
        }
        let yearStr = yearNum.toString();
        yearStr = yearStr.length > 1 ? yearStr : '0' + yearStr;

        let monthStr: string = (1 + date.getMonth()).toString();
        monthStr = monthStr.length > 1 ? monthStr : '0' + monthStr;

        let dayStr = date.getDate().toString();
        dayStr = dayStr.length > 1 ? dayStr : '0' + dayStr;

        return dayStr + '.' + monthStr + '.' + yearStr;
    }

    public static isColorDark(colorHexStr: string) {
        const colorHexNum: number = + ('0x' + colorHexStr.slice(1).replace(colorHexStr.length < 5 && /./g, '$&$&'));
        // tslint:disable:no-bitwise
        const r = colorHexNum >> 16;
        const g = colorHexNum >> 8 & 255;
        const b = colorHexNum & 255;
        // tslint:enable:no-bitwise

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        return (hsp < 127.5);
    }
}

export class Project {
    public static readonly docIdKeyStr          = 'docId';
    public static readonly identifierKeyStr     = 'identifier';
    public static readonly nameKeyStr           = 'name';
    public static readonly durationKeyStr       = 'duration';
    public static readonly endlessKeyStr        = 'endless';
    public static readonly allocatedTimeKeyStr  = 'allocatedTime';
    public static readonly isConflictedKeyStr   = 'isConflicted';
    public static readonly colorKeyStr          = 'color';
    public static readonly markerKeyStr         = 'marker';
    public static readonly markerColorKeyStr    = 'markerColor';
    public static readonly noteKeyStr           = 'note';
    public static readonly reservedKeyStr       = 'reserved';
    public static readonly blockCodeKeyStr      = 'blockCode';
    public static readonly finishedKeyStr       = 'finished';
    public static readonly folderKeyStr         = 'folder';
    public static readonly createTsKeyStr       = 'createTS';
    public static readonly createIdKeyStr       = 'createId';
    public static readonly createNameKeyStr     = 'createName';
    public static readonly editTsKeyStr         = 'editTS';
    public static readonly editIdKeyStr         = 'editId';
    public static readonly editNameKeyStr       = 'editName';
    public static readonly useTsKeyStr          = 'useTS';
    public static readonly useIdKeyStr          = 'useId';
    public static readonly useNameKeyStr        = 'useName';

    public docId: string;
    public identifier: string;
    public name: string;
    public duration: number;
    public endless: boolean;
    public allocatedTime: number;
    public isConflicted: boolean;
    public color: string;
    public marker: string;
    public markerColor: string;
    public note: string;
    public reserved: boolean;
    public blockCode: string;
    public finished: boolean;
    public folder: string;
    public createTS: Date;
    public createId: string;
    public createName: string;
    public editTS: Date;
    public editId: string;
    public editName: string;
    public useTS: Date;
    public useId: string;
    public useName: string;

    constructor(docId: string,
                identifier: string,
                name: string,
                duration: number,
                endless: boolean,
                allocatedTime: number,
                isConflicted: boolean,
                color: string,
                marker: string,
                markerColor: string,
                note: string,
                reserved: boolean,
                blockCode: string,
                finished: boolean,
                folder: string,
                createTS: Date,
                createId: string,
                createName: string,
                editTS: Date,
                editId: string,
                editName: string,
                useTS: Date,
                useId: string,
                useName: string) {
        this.docId = docId;
        this.identifier = identifier;
        this.name = name;
        this.duration = duration;
        this.endless = endless;
        this.allocatedTime = allocatedTime;
        this.isConflicted = isConflicted;
        this.color = color;
        this.marker = marker;
        this.markerColor = markerColor;
        this.note = note;
        this.reserved = reserved;
        this.blockCode = blockCode;
        this.finished = finished;
        this.folder = folder;
        this.createTS = createTS;
        this.createId = createId;
        this.createName = createName;
        this.editTS = editTS;
        this.editId = editId;
        this.editName = editName;
        this.useTS = useTS;
        this.useId = useId;
        this.useName = useName;
    }

    public static projectsAreEqual(project1: Project, project2: Project): boolean {
        if (!project1 && !project2) { return true; }
        if (!project1 || !project2) { return false; }

        return (
            project1.docId === project2.docId
            && project1.identifier === project2.identifier
            && project1.name === project2.name
            && project1.duration === project2.duration
            && project1.endless === project2.endless
            && project1.allocatedTime === project2.allocatedTime
            && project1.isConflicted === project2.isConflicted
            && project1.color === project2.color
            && project1.marker === project2.marker
            && project1.markerColor === project2.markerColor
            && project1.note === project2.note
            && project1.reserved === project2.reserved
            && project1.blockCode === project2.blockCode
            && project1.finished === project2.finished
            && project1.folder === project2.folder
            && project1.createTS === project2.createTS
            && project1.createId === project2.createId
            && project1.createName === project2.createName
            && project1.editTS === project2.editTS
            && project1.editId === project2.editId
            && project1.editName === project2.editName
            && project1.useTS === project2.useTS
            && project1.useId === project2.useId
            && project1.useName === project2.useName
        );
    }
}

export class Employee {
    public static docIdKeyStr      = 'docId';
    public static identifierKeyStr = 'identifier';
    public static nameKeyStr       = 'name';
    public static deptKeyStr       = 'dept';
    public static deptColorKeyStr  = 'deptColor';
    public static groupKeyStr      = 'group';
    public static groupColorKeyStr = 'groupColor';
    public static userKeyStr       = 'user';
    public static schedulerKeyStr  = 'scheduler';
    public static selfEditKeyStr   = 'selfEdit';
    public static createTSKeyStr   = 'createTS';
    public static createIdKeyStr   = 'createId';
    public static createNameKeyStr = 'createName';
    public static editTSKeyStr     = 'editTS';
    public static editIdKeyStr     = 'editId';
    public static editNameKeyStr   = 'editName';

    public docId: string;
    public identifier: string;
    public name: string;
    public dept: string;
    public deptColor: string;
    public group: string;
    public groupColor: string;
    public user: boolean;
    public scheduler: boolean;
    public selfEdit: boolean;
    public createTS: Date;
    public createId: string;
    public createName: string;
    public editTS: Date;
    public editId: string;
    public editName: string;

    constructor(docId: string,
                identifier: string,
                name: string,
                dept: string,
                deptColor: string,
                group: string,
                groupColor: string,
                user: boolean,
                scheduler: boolean,
                selfEdit: boolean,
                createTS: Date,
                createId: string,
                createName: string,
                editTS: Date,
                editId: string,
                editName: string) {
        this.docId = docId;
        this.identifier = identifier;
        this.name = name;
        this.dept = dept;
        this.deptColor = deptColor;
        this.group = group;
        this.groupColor = groupColor;
        this.user = user;
        this.scheduler = scheduler;
        this.selfEdit = selfEdit;
        this.createTS = createTS;
        this.createId = createId;
        this.createName = createName;
        this.editTS = editTS;
        this.editId = editId;
        this.editName = editName;
    }

    public static employeesAreEqual(employee1: Employee, employee2: Employee): boolean {
        if (!employee1 && !employee2) { return true; }
        if (!employee1 || !employee2) { return false; }

        return (
            employee1.docId === employee2.docId
            && employee1.identifier === employee2.identifier
            && employee1.name === employee2.name
            && employee1.dept === employee2.dept
            && employee1.deptColor === employee2.deptColor
            && employee1.group === employee2.group
            && employee1.groupColor === employee2.groupColor
            && employee1.user === employee2.user
            && employee1.scheduler === employee2.scheduler
            && employee1.selfEdit === employee2.selfEdit
            && employee1.createTS === employee2.createTS
            && employee1.createId === employee2.createId
            && employee1.createName === employee2.createName
            && employee1.editTS === employee2.editTS
            && employee1.editId === employee2.editId
            && employee1.editName === employee2.editName
        );
    }
}

export class Assignment {
    employeeId: string;
    projectId: string;
    start: number;
    end: number;
    note: string;
    isConflicted: boolean;
    blockedAt;
}
