"use strict";
// import { ListenerBuilder } from "./listener-builder";
// import { DOMElements } from "./dom-elements";
// import { IEmployee, Status } from './../core/interface/employee.interface'
// import { Renderer } from './../index';
// // const renderer = new Renderer();
// export class Listeners {
//     lb = new ListenerBuilder();
//     DE = new DOMElements();
//     editing: boolean = false;
//     // employee: IEmployee = {};
//     renderer = new Renderer();
//     constructor() { }
//     activateEventListenersForModals(personID: string, action: string, status?: any) {
//         this.addEventListenerCancelBtnModalElement(action);
//         this.addEventListenerConfirmEmployeeBtnModalElement(personID, action, status);
//     }
//     activateEventListenersForModalBtns(personID: string, action: string, status?: any) {
//         this.activateEventListenersForModals(personID, action, status);
//     }
//     addEventListenerCancelBtnModalElement(action: string) {
//         this.lb.$$('#modalBtnCancel').forEach(cancelModalBtn => {
//             cancelModalBtn.addEventListener('click', () => {
//                 if (action === 'delete') {
//                     this.DE.deleteEmpModal!.classList.add('hidden');
//                 } else if (action === 'status') {
//                     this.DE.editStatusEmpModal!.classList.add('hidden');
//                 }
//             });
//         })
//     }
//     addEventListenerConfirmEmployeeBtnModalElement(personID: string, action: string, status?: any) {
//         this.lb.$$('#modalBtnConfirm').forEach(confirmModalBtn => {
//             confirmModalBtn.addEventListener('click', () => {
//                 if (action === 'delete') {
//                     this.renderer.deleteEmployee(personID)
//                     this.DE.deleteEmpModal!.classList.add('hidden')
//                 } else if (action === 'status') {
//                     this.renderer.updateEmployeeStatus(personID, status)
//                     this.DE.editStatusEmpModal!.classList.add('hidden')
//                 }
//             });
//         })
//     }
//     addEventListenerToDeleteEmployeeElement() {
//         this.lb.$$('#deleteEmployee').forEach(eliminarEmployeeBtn => {
//             eliminarEmployeeBtn.addEventListener('click', (employee) => {
//                 const personID: string = (employee.target as HTMLButtonElement).getAttribute('data-id') as string;
//                 this.DE.deleteEmpModal!.classList.remove('hidden')
//                 this.activateEventListenersForModalBtns(personID, 'delete');
//                 this.DE.contentForm!.classList.add('hidden');
//             })
//         })
//     }
//     addEventListenerToEditEmployeeElement(employee: any) {
//         this.lb.$$('#editEmployee').forEach(editEmployeeBtn => {
//             editEmployeeBtn.addEventListener('click', (emp) => {
//                 this.editing = true;
//                 const PersonID : string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
//                 const SSN      : string = (emp.target as HTMLElement).getAttribute('data-ssn') as string;
//                 const FirstName: string = (emp.target as HTMLElement).getAttribute('data-name') as string;
//                 const LastName : string = (emp.target as HTMLElement).getAttribute('data-lname') as string;
//                 const Status   : string = (emp.target as HTMLElement).getAttribute('data-status') as string;
//                 // Saving employee info to persist the data
//                 employee = {
//                     PersonID,
//                     SSN,
//                     FirstName,
//                     LastName,
//                     Status: parseInt(Status),
//                 };
//                 this.DE.editingEmplTitle!.innerHTML = `> ${FirstName} ${LastName}`; 
//                 this.renderer.setEmployeeDataIntoFormToEdit(employee);
//             });
//         })
//     }
//     addEventListenerToStatusTogglerBtnElement() {
//         this.lb.$$('#statusToggler').forEach(updateEmployeeStatusBtn => {
//             // emp (employee)
//             updateEmployeeStatusBtn.addEventListener('click', (emp) => {
//                 const employeeID: string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
//                 const employeeStatus: any = (emp.target as HTMLElement).getAttribute('data-status');
//                 this.editing = true;
//                 this.DE.editStatusEmpModal!.classList.remove('hidden')
//                 let newStatus: number;
//                 if (employeeStatus == 0) {
//                     newStatus = 1;
//                 } else {
//                     newStatus = 0;
//                 }
//                 this.activateEventListenersForModalBtns(employeeID, 'status', newStatus);
//             })
//         })
//     }
//     addEventListenerToCreateEmployeeBtnElement() {
//         this.DE.createEmployeeBtn!.addEventListener('click', () => {
//             this.editing = false;
//             this.DE.form!.reset();
//             this.DE.contentEmployees!.classList.add('hidden')
//             this.DE.contentForm!.classList.remove('hidden');
//         });
//     }
//     addEventListenerToSaveEmployeeDataElement() {
//         this.DE.saveEmployeeData!.addEventListener('click', () => {
//             if ( this.editing ) {
//                 this.employee = {
//                     PersonID : this.DE.personIdInput!.value,
//                     SSN      : this.DE.personSSNInput!.value,
//                     LastName : this.DE.lastNameInput!.value,
//                     FirstName: this.DE.firstNameInput!.value,
//                     Status   : this.DE.employeeStatusInput!.checked ? 0 : 1,
//                     StatusDV : this.DE.employeeStatusInput!.checked ? Status.Active : Status.Suspended
//                 }
//                 console.log(this.employee)
//                 this.renderer.updateEmployee(this.employee)
//                 this.DE.form!.reset();
//                 this.DE.contentForm!.classList.add('hidden')
//                 this.DE.contentEmployees!.classList.remove('hidden')
//                 this.DE.editingEmplTitle!.innerHTML = '';
//             } else {
//                 this.employee = {
//                     PersonID : this.DE.personIdInput!.value,
//                     SSN      : this.DE.personSSNInput!.value,
//                     LastName : this.DE.lastNameInput!.value,
//                     FirstName: this.DE.firstNameInput!.value,
//                     Status   : this.DE.employeeStatusInput!.checked ? 0 : 1,
//                     StatusDV : this.DE.employeeStatusInput!.checked ? Status.Active : Status.Suspended
//                 }
//                 console.log(this.employee)
//                 this.renderer.createEmployee(this.renderer.transformEmployeeDataToJSON(this.employee))
//                 this.DE.contentForm!.classList.add('hidden')
//                 this.DE.contentEmployees!.classList.remove('hidden')
//                 this.DE.form!.reset();
//             }
//         });
//         this.DE.cancelSavingEmplData!.addEventListener('click', () => {
//             this.employee = {}
//             this.DE.editingEmplTitle!.innerHTML = '';
//             this.DE.contentEmployees!.classList.remove('hidden')
//             this.DE.contentForm!.classList.add('hidden');
//         });
//     }
//     addEventListenerToEmployeeStatusInput() {
//         this.DE.employeeStatusInput!.addEventListener('click', () => {
//             console.log(this.DE.employeeStatusInput!.checked)
//         })
//     }
// } 
