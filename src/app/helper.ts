export class Helper {
    public static readonly msPerDay: number = 86400000;
    public static readonly msPerHour: number = 3600000;
    public static readonly msPerMinute: number = 60000;
    private static readonly regExpEMail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');

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
            console.error('Error: 54635463');
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
            console.error('Error: 63543473');
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
            console.error('Error: 89436435');
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
            console.error('Error: 68354867');
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
    public static readonly docIdKeyStr = 'docId';
    public static readonly identifierKeyStr = 'identifier';
    public static readonly nameKeyStr = 'name';
    public static readonly durationKeyStr = 'duration';
    public static readonly endlessKeyStr = 'endless';
    public static readonly timeToAllocateKeyStr = 'timeToAllocate';
    public static readonly isConflictedKeyStr = 'isConflicted';
    public static readonly colorKeyStr = 'color';
    public static readonly markerKeyStr = 'marker';
    public static readonly markerColorKeyStr = 'markerColor';
    public static readonly noteKeyStr = 'note';
    public static readonly reservedKeyStr = 'reserved';
    public static readonly blockCodeKeyStr = 'blockCode';
    public static readonly finishedKeyStr = 'finished';
    public static readonly folderKeyStr = 'folder';
    public static readonly createTsKeyStr = 'create_ts';
    public static readonly createIdKeyStr = 'create_id';
    public static readonly createNameKeyStr = 'create_name';
    public static readonly editTsKeyStr = 'edit_ts';
    public static readonly editIdKeyStr = 'edit_id';
    public static readonly editNameKeyStr = 'edit_name';
    public static readonly useTsKeyStr = 'use_ts';
    public static readonly useIdKeyStr = 'use_id';
    public static readonly useNameKeyStr = 'use_name';

    public docId: string;
    public identifier: string;
    public name: string;
    public duration: number;
    public endless: boolean;
    public timeToAllocate: number;
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
                timeToAllocate: number,
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
        this.timeToAllocate = timeToAllocate;
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
}

export class Employee {
    name: string;
    number: string;
    dept: string;
    group: string;
    user: boolean;
    scheduler: boolean;
    selfEdit: boolean;
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
