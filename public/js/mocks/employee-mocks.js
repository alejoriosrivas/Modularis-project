"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUserDataMock = exports.employeeDataToUpdateMock = void 0;
var uuid_1 = require("uuid");
// Employee mock data to test the POST data functionallity
exports.employeeDataToUpdateMock = {
    "PersonID": "75cbf4ec-05e1-40a9-a0b7-ac43378eb877",
    "CreatedBy": "TechTest",
    "CreatedDate": "2022-03-07T04:43:09.9000000Z",
    "FirstName": "Dollar",
    "IsDeleted": false,
    "LastName": "Cents",
    "LastUpdatedBy": "admin",
    "LastUpdatedDate": "2022-03-07T04:52:20.8300000Z",
    "MiddleInitial": null,
    "SSN": "111-22-1111",
    "Timestamp": "AAAAAAAANrE=",
    "UserDefinedFields": null,
    "EmployeeNo": "0001",
    "EmploymentEndDate": null,
    "EmploymentStartDate": "2022-03-07T04:52:20.8300000Z",
    "Status": 0,
    "StatusDV": "Active",
    "EmployeeTimestamp": "AAAAAAAANrI="
};
exports.newUserDataMock = {
    // uuidv4 generates randomly the PersonID
    "PersonID": (0, uuid_1.v4)().toString(),
    "FirstName": "Robin",
    "LastName": "Hood",
    "LastUpdatedBy": "admin",
    "LastUpdatedDate": new Date(),
    // This operation generates randomly an SSN
    "SSN": (Math.floor(Math.random() * 10000000)).toString(),
    // Generate a random EmployeeNo
    "EmployeeNo": (Math.floor(Math.random() * 10000)).toString(),
    "EmploymentEndDate": null,
    "EmploymentStartDate": new Date(),
    "Status": 0
};
