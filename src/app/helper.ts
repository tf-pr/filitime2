export class Helper {
    private readonly msPerDay: number = 86400000;
    private readonly msPerHour: number = 3600000;
    private readonly msPerMinute: number = 60000;

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
}


export class Project {
    identifier: string;
    name: string;
    duration: number;
    endless: boolean;
    timeToAllocate: number;
    isConflicted: boolean;
    color: string;
    marker: string;
    markerColor: string;
    note: string;
    reserved: boolean;
    blockCode: string;
    finished: boolean;
    folder: string;

    constructor(identifier: string,
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
                folder: string) {
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
