export class Project {
    number: string;
    name: string;
    duration: number;
    timeToAllocate: number;
    isConflicted: boolean;
    color: string;
    marker: string;
    note: string;
    reserved: boolean;
    blockedAt;
    finished: boolean;
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
