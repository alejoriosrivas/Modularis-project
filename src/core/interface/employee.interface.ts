export interface IEmployee {
    SSN?:                 string;
    Status?:              number;
    PersonID?:            string;
    StatusDV?:            Status;
    LastName?:            string;
    CreatedBy?:           EditorType;
    FirstName?:           string;
    IsDeleted?:           boolean;
    Timestamp?:           string;
    EmployeeNo?:          string;
    CreatedDate?:         Date;
    MiddleInitial?:       any;
    LastUpdatedBy?:       EditorType;
    LastUpdatedDate?:     Date;
    UserDefinedFields?:   any;
    EmployeeTimestamp?:   string;
    EmploymentEndDate?:   Date | null;
    EmploymentStartDate?: Date;
}

export enum EditorType {
    Admin    = "admin",
    System   = "system",
    TechTest = "TechTest",
}

export enum Status {
    Active    = "Active",
    Suspended = "Suspended",
}
