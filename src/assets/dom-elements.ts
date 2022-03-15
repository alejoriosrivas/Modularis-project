export class DOMElements {

    form!:                 HTMLFormElement   | null;
    personSSNInput!:       HTMLInputElement  | null;
    firstNameInput!:       HTMLInputElement  | null;
    lastNameInput!:        HTMLInputElement  | null;
    personIdInput!:        HTMLInputElement  | null;
    saveEmployeeData!:     HTMLButtonElement | null;
    createEmployeeBtn!:    HTMLButtonElement | null;
    contentEmployees!:     HTMLElement       | null;
    contentForm!:          HTMLElement       | null;
    deleteEmpModal!:       HTMLElement       | null;
    editStatusEmpModal!:   HTMLElement       | null;
    modalBtnCancel!:       HTMLButtonElement | null;
    modalBtnConfirm!:      HTMLButtonElement | null;
    editingEmplTitle!:     HTMLElement       | null;
    cancelSavingEmplData!: HTMLButtonElement | null;
    employeeStatusInput!:  HTMLInputElement  | null;

    constructor() {

        this.form = document.querySelector('#form')
        this.personSSNInput = document.querySelector('#personSSNInput')
        this.firstNameInput = document.querySelector('#firstNameInput')
        this.lastNameInput = document.querySelector('#lastNameInput')
        this.personIdInput = document.querySelector('#personIdInput')
        this.saveEmployeeData = document.querySelector('#createBtn')
        this.createEmployeeBtn = document.querySelector('#createEmployeeBtn')
        this.contentEmployees = document.querySelector('#content_employees')
        this.contentForm = document.querySelector('#content_form')
        this.deleteEmpModal = document.querySelector('#deleteEmployeeConfirmModal')
        this.editStatusEmpModal = document.querySelector('#changeEmployeeStatusModal')
        this.modalBtnCancel = document.querySelector('#modalBtnCancel')
        this.modalBtnConfirm = document.querySelector('#modalBtnConfirm')
        this.editingEmplTitle = document.querySelector('#editingEmployeeTitle')
        this.cancelSavingEmplData = document.querySelector('#cancelCreationBtn')
        this.employeeStatusInput = document.querySelector('#employeeStatusInput')
        
    }
}