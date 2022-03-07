"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var api_url_1 = require("./environment/api-url");
var api_service_1 = require("./services/api-service");
var env = new api_url_1.Environment();
var svc = new api_service_1.ApiService();
var form = document.querySelector('#form');
var personIdInput = document.querySelector('#personId');
var firstNameInput = document.querySelector('#firstName');
var lastNameInput = document.querySelector('#lastName');
var saveEmployeeData = document.querySelector('#createBtn');
var createEmployeeBtn = document.querySelector('#createEmployeeBtn');
var editing = false;
var ApiUrl = env._APIUrl;
var headers = svc.headers;
var employees = [];
var getUsers = new Request(ApiUrl, {
    method: 'GET',
    mode: 'cors',
    headers: svc.headers
});
var getAllUsers = function () {
    fetch(getUsers)
        .then(function (response) { return response.json(); })
        .then(function (responseJson) {
        employees = responseJson;
        renderTemplate();
    })
        .catch(function (err) { return new Error(err); });
};
var mockUserID = '75cbf4ec-04e1-40a9-a0b7-ac43278eb877';
var employee = [];
var getEmployee = function (userID) {
    return new Request("".concat(ApiUrl, "(").concat(userID, ")"), {
        method: 'GET',
        mode: 'cors',
        headers: headers,
    });
};
var getEmployeeById = function (userID) {
    fetch(getEmployee(userID))
        .then(function (response) { return response.json(); })
        .then(function (responseJson) { return employee = responseJson; })
        .catch(function (err) { return new Error(err); });
};
var create = function (data) {
    return new Request(ApiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    });
};
var createEmployee = function (data) {
    fetch(create(data))
        .then(function (response) {
        getAllUsers();
    })
        .catch(function (err) { return new Error(err); });
};
var updateEmpl = function (data) {
    return new Request(ApiUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    });
};
var updateEmployee = function (data) {
    fetch(updateEmpl(data))
        .then(function (response) {
        getAllUsers();
    })
        .catch(function (err) { return new Error(err); });
};
var deleteEmpl = function (employeeID) {
    return new Request("".concat(ApiUrl, "(").concat(employeeID, ")"), {
        method: 'DELETE',
        mode: 'cors',
        headers: headers
    });
};
var deleteEmployee = function (employeeID) {
    fetch(deleteEmpl(employeeID))
        .then(function (response) { return response.json(); })
        .then(function (responseJson) { return console.log(responseJson); })
        .catch(function (err) { return new Error(err); });
};
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
function loadAPIConsumed() {
    getAllUsers();
}
function renderTemplate() {
    var htmlTableContent = '';
    employees.forEach(function (employee) {
        var SSN = employee.SSN, FirstName = employee.FirstName, LastName = employee.LastName, StatusDV = employee.StatusDV, PersonID = employee.PersonID;
        htmlTableContent += "\n            <tr>\n                <td> ".concat(SSN, " </td>\n                <td> ").concat(FirstName, " </td>\n                <td> ").concat(LastName, " </td>\n                <td> <button data-id=\"").concat(PersonID, "\" id=\"statusToggler\" class=\"").concat((StatusDV === 'Active') ? 'active' : 'inactive', "\">").concat(StatusDV, "</button> </td>\n                <td> \n                    <i id=\"editEmployee\" data-id=\"").concat(PersonID, "\" class=\"fa-solid fa-pen-to-square\"></i> \n                    <i id=\"deleteEmployee\" data-id=\"").concat(PersonID, "\" class=\"fa-solid fa-trash-can\"></i>\n                </td>\n            </tr>\n        ");
    });
    $('#listBody').innerHTML = htmlTableContent;
    $$('#deleteEmployee').forEach(function (eliminarEmployeeBtn) {
        eliminarEmployeeBtn.addEventListener('click', function (employee) {
            var employeeID = employee.target.getAttribute('data-id');
            form.classList.add('hidden');
            deleteEmployee(employeeID);
            loadAPIConsumed();
        });
    });
    $$('#editEmployee').forEach(function (editEmployeeBtn) {
        editEmployeeBtn.addEventListener('click', function (emp) {
            var employeeID = emp.target.getAttribute('data-id');
            console.log(employee);
            editing = true;
            getEmployeeById(employeeID);
            editEmployee(employee);
        });
    });
    $$('#statusToggler').forEach(function (updateEmployeeStatusBtn) {
        updateEmployeeStatusBtn.addEventListener('click', function (emp) {
            var employeeID = emp.target.getAttribute('data-id');
            editing = true;
            getEmployeeById(employeeID);
            var newStatus;
            if (employee == 0) {
                newStatus = 1;
            }
            else {
                newStatus = 0;
            }
            updateEmployee(transformEmployeeDataToJSON(employeeID, newStatus));
        });
    });
    createEmployeeBtn.addEventListener('click', function () {
        editing = false;
        form.reset();
        form.classList.remove('hidden');
    });
    saveEmployeeData.addEventListener('click', function () {
        if (editing) {
            var employeeID = employee.PersonID;
            updateEmployee(transformEmployeeDataToJSON(employeeID));
            form.reset();
        }
        else {
            createEmployee(transformEmployeeDataToJSON());
            form.reset();
        }
        // loadAPIConsumed();
    });
}
function $(tagSelector) {
    return document.querySelector(tagSelector);
}
function $$(tagSelector) {
    return document.querySelectorAll(tagSelector);
}
function editEmployee(data) {
    personIdInput.value = data.SSN;
    lastNameInput.value = data.LastName;
    firstNameInput.value = data.FirstName;
    form.classList.remove('hidden');
}
function transformEmployeeDataToJSON(personID, status) {
    return {
        "PersonID": personID ? personID : (0, uuid_1.v4)(),
        "FirstName": firstNameInput.value,
        "LastName": lastNameInput.value,
        "LastUpdatedBy": "admin",
        "LastUpdatedDate": new Date(),
        "SSN": personIdInput.value,
        "EmployeeNo": (Math.floor(Math.random() * 10000)).toString(),
        "EmploymentEndDate": null,
        "EmploymentStartDate": new Date,
        "Status": status ? status : 0
    };
}
loadAPIConsumed();
