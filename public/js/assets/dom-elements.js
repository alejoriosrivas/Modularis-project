"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMElements = void 0;
var DOMElements = /** @class */ (function () {
    function DOMElements() {
        this.form = document.querySelector('#form');
        this.personSSNInput = document.querySelector('#personSSNInput');
        this.firstNameInput = document.querySelector('#firstNameInput');
        this.lastNameInput = document.querySelector('#lastNameInput');
        this.personIdInput = document.querySelector('#personIdInput');
        this.saveEmployeeData = document.querySelector('#createBtn');
        this.createEmployeeBtn = document.querySelector('#createEmployeeBtn');
        this.contentEmployees = document.querySelector('#content_employees');
        this.contentForm = document.querySelector('#content_form');
        this.deleteEmpModal = document.querySelector('#deleteEmployeeConfirmModal');
        this.editStatusEmpModal = document.querySelector('#changeEmployeeStatusModal');
        this.modalBtnCancel = document.querySelector('#modalBtnCancel');
        this.modalBtnConfirm = document.querySelector('#modalBtnConfirm');
        this.editingEmplTitle = document.querySelector('#editingEmployeeTitle');
        this.cancelSavingEmplData = document.querySelector('#cancelCreationBtn');
        this.employeeStatusInput = document.querySelector('#employeeStatusInput');
    }
    return DOMElements;
}());
exports.DOMElements = DOMElements;
