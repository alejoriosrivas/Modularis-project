"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
// uuid is a UserID random generator
var uuid_1 = require("uuid");
var dom_elements_1 = require("./assets/dom-elements");
var api_service_1 = require("./core/services/api-service");
var employee_interface_1 = require("./core/interface/employee.interface");
var employee_interface_2 = require("./core/interface/employee.interface");
var listener_builder_1 = require("./assets/listener-builder");
// const DE = new DOMElements(); // DE DOM Elements
var service = new api_service_1.ApiService();
var Renderer = /** @class */ (function () {
    // lb = new ListenerBuilder();
    function Renderer() {
        var _this = this;
        this.lb = new listener_builder_1.ListenerBuilder();
        this.DE = new dom_elements_1.DOMElements();
        // listener = new Listeners();
        this.employees = [];
        this.employee = {};
        this.editing = false;
        this.getAllUsers = function () {
            fetch(service.getAllUsersRequest)
                .then(function (response) { return response.json(); })
                .then(function (responseJson) { _this.employees = responseJson; })
                .then(function () { return _this.renderTemplate(); })
                .catch(function (err) { return new Error(err); });
        };
        this.getEmployeeById = function (userID) {
            fetch(service.getEmployeeByIdRequest(userID))
                .then(function (response) { return response.json(); })
                .then(function (responseJson) { return _this.employee = responseJson; })
                .catch(function (err) { return new Error(err); });
        };
        this.createEmployee = function (data) {
            fetch(service.createEmplRequest(data))
                .then(function () { return _this.getAllUsers(); })
                .catch(function (err) { return console.log(new Error(err)); });
        };
        this.updateEmployee = function (data) {
            fetch(service.updateEmplRequest(data))
                .then(function () { return _this.getAllUsers(); })
                .catch(function (err) { return new Error(err); });
        };
        this.deleteEmployee = function (employeeID) {
            fetch(service.deleteEmplRequest(employeeID))
                .then(function () { return _this.getAllUsers(); })
                .catch(function (err) { return new Error(err); });
        };
    }
    Renderer.prototype.loadAPIConsumed = function () {
        this.getAllUsers();
    };
    Renderer.prototype.renderTemplate = function () {
        this.printEmployeesTableList();
        // Rendering all EventListeners when the app is starting 
        this.addEvenListenerListToElements();
    };
    Renderer.prototype.printEmployeesTableList = function () {
        var htmlTableContent = '';
        // We are creating an for cycle to render all employees inside the list, one by one
        this.employees.forEach(function (employee) {
            var SSN = employee.SSN, FirstName = employee.FirstName, LastName = employee.LastName, Status = employee.Status, PersonID = employee.PersonID;
            htmlTableContent += "\n                <tr>\n                    <td> ".concat(SSN, " </td>\n                    <td> ").concat(FirstName, " </td>\n                    <td> ").concat(LastName, " </td>\n                    <td> <button data-id=\"").concat(PersonID, "\" data-status=\"").concat(Status, "\" id=\"statusToggler\" class=\"").concat((Status === 0) ? 'active' : 'inactive', "\">").concat((Status === 0) ? 'ACTIVE' : 'INACTIVE', "</button> </td>\n                    <td> \n                        <i id=\"editEmployee\" data-id=\"").concat(PersonID, "\" data-lname=\"").concat(LastName, "\" data-ssn=\"").concat(SSN, "\" data-name=\"").concat(FirstName, "\" data-status=\"").concat(Status, "\" class=\"fa-solid fa-pen-to-square\"></i> \n                        <i id=\"deleteEmployee\" data-id=\"").concat(PersonID, "\" class=\"fa-solid fa-trash-can\"></i>\n                    </td>\n                </tr>\n            ");
        });
        // After iterating all employees, we are setting up into the HTML
        this.lb.$('#listBody').innerHTML = htmlTableContent;
    };
    Renderer.prototype.addEvenListenerListToElements = function () {
        // Thats a iterator for each deleteEmployee button to add to it a listener, to every time we click on the button, it'll delete the selected Employee
        this.addEventListenerToDeleteEmployeeElement();
        // Iterator for adding listeners to every editEmployee button, every time we click on the button, it'll get the selected Employee data to the form, to be able to modify it
        this.addEventListenerToEditEmployeeElement();
        // that's a eventListener adder by a for each cycle, to be able to update the user state, just clicking on the button 'active' or 'inactive'
        this.addEventListenerToStatusTogglerBtnElement();
        // Adding createEmployeeBtn listener, to show the form, and reset possibly data inside
        this.addEventListenerToCreateEmployeeBtnElement();
        // Adding listener to saveEmployeeData to save the data, based on if is updating or saving data of the Employee for first time (creating...)
        this.addEventListenerToSaveEmployeeDataElement();
        this.addEventListenerToEmployeeStatusInput();
    };
    Renderer.prototype.transformEmployeeDataToJSON = function (data) {
        return {
            SSN: data.SSN,
            Status: this.DE.employeeStatusInput.checked ? 1 : 0,
            statusDV: this.DE.employeeStatusInput.checked ? employee_interface_1.Status.Active : employee_interface_1.Status.Suspended,
            PersonID: data.PersonID != '' ? data.PersonID : (0, uuid_1.v4)(),
            LastName: data.LastName,
            FirstName: data.FirstName,
            EmployeeNo: (Math.floor(Math.random() * 10000)).toString(),
            LastUpdatedBy: employee_interface_2.EditorType.Admin,
            LastUpdatedDate: new Date(),
            EmploymentEndDate: null,
            EmploymentStartDate: new Date,
        };
    };
    Renderer.prototype.setEmployeeDataIntoFormToEdit = function (data) {
        this.DE.personSSNInput.value = data.SSN;
        this.DE.personIdInput.value = data.PersonID;
        this.DE.lastNameInput.value = data.LastName;
        this.DE.firstNameInput.value = data.FirstName;
        this.DE.employeeStatusInput.checked = data.Status == 0 ? true : false;
        this.DE.contentEmployees.classList.add('hidden');
        this.DE.contentForm.classList.remove('hidden');
    };
    Renderer.prototype.updateEmployeeStatus = function (personID, status) {
        var employeeJSON = {
            PersonID: personID,
            Status: status
        };
        this.updateEmployee(employeeJSON);
    };
    Renderer.prototype.activateEventListenersForModals = function (personID, action, status) {
        this.addEventListenerCancelBtnModalElement(action);
        this.addEventListenerConfirmEmployeeBtnModalElement(personID, action, status);
    };
    Renderer.prototype.activateEventListenersForModalBtns = function (personID, action, status) {
        this.activateEventListenersForModals(personID, action, status);
    };
    Renderer.prototype.addEventListenerCancelBtnModalElement = function (action) {
        var _this = this;
        this.lb.$$('#modalBtnCancel').forEach(function (cancelModalBtn) {
            cancelModalBtn.addEventListener('click', function () {
                if (action === 'delete') {
                    _this.DE.deleteEmpModal.classList.add('hidden');
                }
                else if (action === 'status') {
                    _this.DE.editStatusEmpModal.classList.add('hidden');
                }
            });
        });
    };
    Renderer.prototype.addEventListenerConfirmEmployeeBtnModalElement = function (personID, action, status) {
        var _this = this;
        this.lb.$$('#modalBtnConfirm').forEach(function (confirmModalBtn) {
            confirmModalBtn.addEventListener('click', function () {
                if (action === 'delete') {
                    _this.deleteEmployee(personID);
                    _this.DE.deleteEmpModal.classList.add('hidden');
                }
                else if (action === 'status') {
                    _this.updateEmployeeStatus(personID, status);
                    _this.DE.editStatusEmpModal.classList.add('hidden');
                }
            });
        });
    };
    Renderer.prototype.addEventListenerToDeleteEmployeeElement = function () {
        var _this = this;
        this.lb.$$('#deleteEmployee').forEach(function (eliminarEmployeeBtn) {
            eliminarEmployeeBtn.addEventListener('click', function (employee) {
                var personID = employee.target.getAttribute('data-id');
                _this.DE.deleteEmpModal.classList.remove('hidden');
                _this.activateEventListenersForModalBtns(personID, 'delete');
                _this.DE.contentForm.classList.add('hidden');
            });
        });
    };
    Renderer.prototype.addEventListenerToEditEmployeeElement = function () {
        var _this = this;
        this.lb.$$('#editEmployee').forEach(function (editEmployeeBtn) {
            editEmployeeBtn.addEventListener('click', function (emp) {
                _this.editing = true;
                var PersonID = emp.target.getAttribute('data-id');
                var SSN = emp.target.getAttribute('data-ssn');
                var FirstName = emp.target.getAttribute('data-name');
                var LastName = emp.target.getAttribute('data-lname');
                var Status = emp.target.getAttribute('data-status');
                // Saving employee info to persist the data
                _this.employee = {
                    PersonID: PersonID,
                    SSN: SSN,
                    FirstName: FirstName,
                    LastName: LastName,
                    Status: parseInt(Status),
                };
                _this.DE.editingEmplTitle.innerHTML = "> ".concat(FirstName, " ").concat(LastName);
                _this.setEmployeeDataIntoFormToEdit(_this.employee);
            });
        });
    };
    Renderer.prototype.addEventListenerToStatusTogglerBtnElement = function () {
        var _this = this;
        this.lb.$$('#statusToggler').forEach(function (updateEmployeeStatusBtn) {
            // emp (employee)
            updateEmployeeStatusBtn.addEventListener('click', function (emp) {
                var employeeID = emp.target.getAttribute('data-id');
                var employeeStatus = emp.target.getAttribute('data-status');
                _this.editing = true;
                _this.DE.editStatusEmpModal.classList.remove('hidden');
                var newStatus;
                if (employeeStatus == 0) {
                    newStatus = 1;
                }
                else {
                    newStatus = 0;
                }
                _this.activateEventListenersForModalBtns(employeeID, 'status', newStatus);
            });
        });
    };
    Renderer.prototype.addEventListenerToCreateEmployeeBtnElement = function () {
        var _this = this;
        this.DE.createEmployeeBtn.addEventListener('click', function () {
            _this.editing = false;
            _this.DE.form.reset();
            _this.DE.contentEmployees.classList.add('hidden');
            _this.DE.contentForm.classList.remove('hidden');
        });
    };
    Renderer.prototype.addEventListenerToSaveEmployeeDataElement = function () {
        var _this = this;
        this.DE.saveEmployeeData.addEventListener('click', function () {
            if (_this.editing) {
                _this.employee = {
                    PersonID: _this.DE.personIdInput.value,
                    SSN: _this.DE.personSSNInput.value,
                    LastName: _this.DE.lastNameInput.value,
                    FirstName: _this.DE.firstNameInput.value,
                    Status: _this.DE.employeeStatusInput.checked ? 0 : 1,
                    StatusDV: _this.DE.employeeStatusInput.checked ? employee_interface_1.Status.Active : employee_interface_1.Status.Suspended
                };
                _this.updateEmployee(_this.employee);
                _this.DE.form.reset();
                _this.DE.contentForm.classList.add('hidden');
                _this.DE.contentEmployees.classList.remove('hidden');
                _this.DE.editingEmplTitle.innerHTML = '';
            }
            else {
                _this.employee = {
                    PersonID: _this.DE.personIdInput.value,
                    SSN: _this.DE.personSSNInput.value,
                    LastName: _this.DE.lastNameInput.value,
                    FirstName: _this.DE.firstNameInput.value,
                    Status: _this.DE.employeeStatusInput.checked ? 0 : 1,
                    StatusDV: _this.DE.employeeStatusInput.checked ? employee_interface_1.Status.Active : employee_interface_1.Status.Suspended
                };
                console.log(_this.employee);
                _this.createEmployee(_this.transformEmployeeDataToJSON(_this.employee));
                _this.DE.contentForm.classList.add('hidden');
                _this.DE.contentEmployees.classList.remove('hidden');
                _this.DE.form.reset();
            }
        });
        this.DE.cancelSavingEmplData.addEventListener('click', function () {
            _this.employee = {};
            _this.DE.editingEmplTitle.innerHTML = '';
            _this.DE.contentEmployees.classList.remove('hidden');
            _this.DE.contentForm.classList.add('hidden');
        });
    };
    Renderer.prototype.addEventListenerToEmployeeStatusInput = function () {
        this.DE.employeeStatusInput.addEventListener('click', function () {
        });
    };
    return Renderer;
}());
exports.Renderer = Renderer;
var renderer = new Renderer();
renderer.loadAPIConsumed();
