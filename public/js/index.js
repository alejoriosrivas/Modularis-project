"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// uuid is a UserID random generator
var uuid_1 = require("uuid");
// Getting all HTML elements that we're gonna manipulate
var form = document.querySelector('#form');
var personSSNInput = document.querySelector('#personSSNInput');
var firstNameInput = document.querySelector('#firstNameInput');
var lastNameInput = document.querySelector('#lastNameInput');
var personIdInput = document.querySelector('#personIdInput');
var saveEmployeeData = document.querySelector('#createBtn');
var createEmployeeBtn = document.querySelector('#createEmployeeBtn');
var contentEmployees = document.querySelector('#content_employees');
var contentForm = document.querySelector('#content_form');
var deleteEmpModal = document.querySelector('#deleteEmployeeConfirmModal');
var editStatusEmpModal = document.querySelector('#changeEmployeeStatusModal');
var modalBtnCancel = document.querySelector('#modalBtnCancel');
var modalBtnConfirm = document.querySelector('#modalBtnConfirm');
// Variable created for evaluating if creating or updating in form
var editing = false;
// Api URL that consumes the service
var _APIUrl = 'https://gateway.modularis.com/HRDemo/RESTActivityWebService/HRDemo.Example/Employees';
// We're generating headers for consuming Services, setting up configuration for no having authentication errors
var headers = new Headers({
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, defiate, br',
    'Connection': 'Keep-alive',
    'CustomerID': 'C93F949C-41B8-4C9E-95AA-B030B31F6F3F',
    'APIKey': 'JOhNpoolcUCi6Fnu5cAc38yJMRuHAXBne2bYq5',
    'Content-Type': 'application/json'
});
// Thats the consumer for the service to bring here all Employees
var employees = [];
var getAllUsersRequest = new Request(_APIUrl, {
    method: 'GET',
    mode: 'cors',
    headers: headers
});
var getAllUsers = function () {
    fetch(getAllUsersRequest)
        .then(function (response) { return response.json(); })
        .then(function (responseJson) { employees = responseJson; console.log(employees); })
        .then(function () { return renderTemplate(); })
        .catch(function (err) { return new Error(err); });
};
// Service consumer that bring to front a employee consulted by ID
var employee = [];
var getEmployeeByIdRequest = function (userID) {
    return new Request("".concat(_APIUrl, "(").concat(userID, ")"), {
        method: 'GET',
        mode: 'cors',
        headers: headers,
    });
};
var getEmployeeById = function (userID) {
    fetch(getEmployeeByIdRequest(userID))
        .then(function (response) { return response.json(); })
        .then(function (responseJson) { return employee = responseJson; })
        .catch(function (err) { return new Error(err); });
};
// Standing Service consumer to Create new Employees
var createEmplRequest = function (data) {
    return new Request(_APIUrl, {
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    });
};
var createEmployee = function (data) {
    fetch(createEmplRequest(data))
        .then(function () { return getAllUsers(); })
        .catch(function (err) { return console.log(new Error(err)); });
};
// Service consumer to update a employee 
var updateEmplRequest = function (data) {
    return new Request(_APIUrl, {
        method: 'PUT',
        mode: 'cors',
        headers: headers,
        body: JSON.stringify(data)
    });
};
var updateEmployee = function (data) {
    fetch(updateEmplRequest(data))
        .then(function () { return getAllUsers(); })
        .catch(function (err) { return new Error(err); });
};
// Service to delete employee by id
var deleteEmplRequest = function (employeeID) {
    return new Request("".concat(_APIUrl, "(").concat(employeeID, ")"), {
        method: 'DELETE',
        mode: 'cors',
        headers: headers
    });
};
var deleteEmployee = function (employeeID) {
    fetch(deleteEmplRequest(employeeID))
        .then(function () { return getAllUsers(); })
        .catch(function (err) { return new Error(err); });
};
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// We're building the application properties, functionallities and more...
function loadAPIConsumed() {
    getAllUsers();
}
// Function created to render Listeners, HTML elements, consuming the service...
function renderTemplate() {
    printEmployeesTableList();
    // Rendering all EventListeners when the app is starting 
    addEvenListenerListToElements();
}
function printEmployeesTableList() {
    var htmlTableContent = '';
    // We are creating an for cycle to render all employees inside the list, one by one
    employees.forEach(function (employee) {
        var SSN = employee.SSN, FirstName = employee.FirstName, LastName = employee.LastName, Status = employee.Status, PersonID = employee.PersonID;
        htmlTableContent += "\n            <tr>\n                <td> ".concat(SSN, " </td>\n                <td> ").concat(FirstName, " </td>\n                <td> ").concat(LastName, " </td>\n                <td> <button data-id=\"").concat(PersonID, "\" data-status=\"").concat(Status, "\" id=\"statusToggler\" class=\"").concat((Status === 0) ? 'active' : 'inactive', "\">").concat((Status === 0) ? 'ACTIVE' : 'INACTIVE', "</button> </td>\n                <td> \n                    <i id=\"editEmployee\" data-id=\"").concat(PersonID, "\" data-lname=\"").concat(LastName, "\" data-ssn=\"").concat(SSN, "\" data-name=\"").concat(FirstName, "\" class=\"fa-solid fa-pen-to-square\"></i> \n                    <i id=\"deleteEmployee\" data-id=\"").concat(PersonID, "\" class=\"fa-solid fa-trash-can\"></i>\n                </td>\n            </tr>\n        ");
    });
    // After iterating all employees, we are setting up into the HTML
    $('#listBody').innerHTML = htmlTableContent;
}
function addEvenListenerListToElements() {
    // Thats a iterator for each deleteEmployee button to add to it a listener, to every time we click on the button, it'll delete the selected Employee
    addEventListenerToDeleteEmployeeElement();
    // Iterator for adding listeners to every editEmployee button, every time we click on the button, it'll get the selected Employee data to the form, to be able to modify it
    addEventListenerToEditEmployeeElement();
    // that's a eventListener adder by a for each cycle, to be able to update the user state, just clicking on the button 'active' or 'inactive'
    addEventListenerToStatusTogglerBtnElement();
    // Adding createEmployeeBtn listener, to show the form, and reset possibly data inside
    addEventListenerToCreateEmployeeBtnElement();
    // Adding listener to saveEmployeeData to save the data, based on if is updating or saving data of the Employee for first time (creating...)
    addEventListenerToSaveEmployeeDataElement();
}
function activateEventListenersForModalBtns(personID, action, status) {
    activateEventListenersForModals(personID, action, status);
    console.log(personID);
}
function activateEventListenersForModals(personID, action, status) {
    addEventListenerCancelBtnModalElement(action);
    addEventListenerConfirmEmployeeBtnModalElement(personID, action, status);
}
function addEventListenerCancelBtnModalElement(action) {
    $$('#modalBtnCancel').forEach(function (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function () {
            if (action === 'delete') {
                deleteEmpModal.classList.add('hidden');
            }
            else if (action === 'status') {
                editStatusEmpModal.classList.add('hidden');
            }
        });
    });
}
function addEventListenerConfirmEmployeeBtnModalElement(personID, action, status) {
    $$('#modalBtnConfirm').forEach(function (confirmModalBtn) {
        confirmModalBtn.addEventListener('click', function () {
            if (action === 'delete') {
                deleteEmployee(personID);
                deleteEmpModal.classList.add('hidden');
            }
            else if (action === 'status') {
                updateEmployeeStatus(personID, status);
                editStatusEmpModal.classList.add('hidden');
            }
        });
    });
}
function addEventListenerToDeleteEmployeeElement() {
    $$('#deleteEmployee').forEach(function (eliminarEmployeeBtn) {
        eliminarEmployeeBtn.addEventListener('click', function (employee) {
            var personID = employee.target.getAttribute('data-id');
            deleteEmpModal.classList.remove('hidden');
            activateEventListenersForModalBtns(personID, 'delete');
            contentForm.classList.add('hidden');
        });
    });
}
function addEventListenerToEditEmployeeElement() {
    $$('#editEmployee').forEach(function (editEmployeeBtn) {
        editEmployeeBtn.addEventListener('click', function (emp) {
            editing = true;
            var PersonID = emp.target.getAttribute('data-id');
            var SSN = emp.target.getAttribute('data-ssn');
            var FirstName = emp.target.getAttribute('data-name');
            var LastName = emp.target.getAttribute('data-lname');
            // Saving employee info to persist the data
            employee = {
                PersonID: PersonID,
                SSN: SSN,
                FirstName: FirstName,
                LastName: LastName
            };
            // getEmployeeById(employeeID);
            setEmployeeDataIntoFormToEdit(employee);
        });
    });
}
function addEventListenerToStatusTogglerBtnElement() {
    $$('#statusToggler').forEach(function (updateEmployeeStatusBtn) {
        // emp (employee)
        updateEmployeeStatusBtn.addEventListener('click', function (emp) {
            var employeeID = emp.target.getAttribute('data-id');
            var employeeStatus = emp.target.getAttribute('data-status');
            editing = true;
            editStatusEmpModal.classList.remove('hidden');
            var newStatus;
            if (employeeStatus == 0) {
                newStatus = 1;
            }
            else {
                newStatus = 0;
            }
            activateEventListenersForModalBtns(employeeID, 'status', newStatus);
        });
    });
}
function addEventListenerToCreateEmployeeBtnElement() {
    createEmployeeBtn.addEventListener('click', function () {
        editing = false;
        form.reset();
        contentEmployees.classList.add('hidden');
        contentForm.classList.remove('hidden');
    });
}
function addEventListenerToSaveEmployeeDataElement() {
    saveEmployeeData.addEventListener('click', function () {
        if (editing) {
            employee = {
                PersonID: personIdInput.value,
                SSN: personSSNInput.value,
                LastName: lastNameInput.value,
                FirstName: firstNameInput.value
            };
            updateEmployee(employee);
            form.reset();
            contentForm.classList.add('hidden');
            contentEmployees.classList.remove('hidden');
        }
        else {
            employee = {
                PersonID: personIdInput.value,
                SSN: personSSNInput.value,
                LastName: lastNameInput.value,
                FirstName: firstNameInput.value
            };
            createEmployee(transformEmployeeDataToJSON(employee));
            contentForm.classList.add('hidden');
            contentEmployees.classList.remove('hidden');
            form.reset();
        }
        // loadAPIConsumed();
    });
}
// FUNCTIONS QUERYSELECTOR FOR HTMLELEMENTS THAT DOESN'T NEED DECLARE VARIABLE IN TS
// Function that gives us the facility to add listeners to an specific HTMLelement
function $(tagSelector) {
    return document.querySelector(tagSelector);
}
// Function to be able to add multiples listeners to a multiples buttons, that are equals, putting listeners by for each cycle
function $$(tagSelector) {
    return document.querySelectorAll(tagSelector);
}
// That set up the editing data into the form
function setEmployeeDataIntoFormToEdit(data) {
    personIdInput.value = data.PersonID;
    personSSNInput.value = data.SSN;
    lastNameInput.value = data.LastName;
    firstNameInput.value = data.FirstName;
    contentEmployees.classList.add('hidden');
    contentForm.classList.remove('hidden');
}
// Transforming the first body of the Employee, to a new formated body to be able to update it in the Service consume
function transformEmployeeDataToJSON(data) {
    return {
        "PersonID": data.PersonID != '' ? data.PersonID : (0, uuid_1.v4)(),
        "FirstName": data.FirstName,
        "LastName": data.LastName,
        "LastUpdatedBy": "admin",
        "LastUpdatedDate": new Date(),
        "SSN": data.SSN,
        "EmployeeNo": (Math.floor(Math.random() * 10000)).toString(),
        "EmploymentEndDate": null,
        "EmploymentStartDate": new Date,
        "Status": 0
    };
}
function updateEmployeeStatus(personID, status) {
    var employeeJSON = {
        PersonID: personID,
        Status: status
    };
    updateEmployee(employeeJSON);
}
loadAPIConsumed();
