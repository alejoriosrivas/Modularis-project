// uuid is a UserID random generator
import { v4 as uuidv4 } from 'uuid';
import { DOMElements } from './assets/dom-elements';
import { ApiService } from './core/services/api-service';
import { Status } from './core/interface/employee.interface';
import { IEmployee } from './core/interface/employee.interface';
import { EditorType } from './core/interface/employee.interface';
import { ListenerBuilder } from './assets/listener-builder';

// const DE = new DOMElements(); // DE DOM Elements
const service = new ApiService();

export class Renderer {

    lb = new ListenerBuilder();

    DE = new DOMElements();
    // listener = new Listeners();

    employees: IEmployee[] = [];

    employee: IEmployee = {};

    editing: boolean = false;
    // lb = new ListenerBuilder();

    constructor() { }

    loadAPIConsumed() {
        this.getAllUsers();
    }
    
    renderTemplate() {
        this.printEmployeesTableList();
        // Rendering all EventListeners when the app is starting 
        this.addEvenListenerListToElements();
    }

    getAllUsers = () => {
        fetch(service.getAllUsersRequest)
            .then((response) => response.json())
            .then((responseJson: IEmployee[]) => {this.employees = responseJson})
            .then(() => this.renderTemplate())
            .catch(err => new Error(err));
    }

    getEmployeeById = (userID: string) => {
        fetch(service.getEmployeeByIdRequest(userID))
            .then(response => response.json())
            .then((responseJson: IEmployee) => this.employee = responseJson)
            .catch(err => new Error(err));
    }

    createEmployee = (data: IEmployee) => {
        fetch(service.createEmplRequest(data))
            .then(() => this.getAllUsers() )
            .catch(err => console.log(new Error(err)));
    }

    updateEmployee = (data: IEmployee) => {
        fetch(service.updateEmplRequest(data))
            .then(() => this.getAllUsers())
            .catch(err => new Error(err));
    }

    deleteEmployee = (employeeID: string) => {
        fetch(service.deleteEmplRequest(employeeID))
            .then(() => this.getAllUsers())
            .catch(err => new Error(err));
    }
    
    printEmployeesTableList() {
        let htmlTableContent = '';
    
        // We are creating an for cycle to render all employees inside the list, one by one
        this.employees.forEach((employee: IEmployee) => {
    
            const { SSN, FirstName, LastName, Status, PersonID } = employee;
    
            htmlTableContent += `
                <tr>
                    <td> ${ SSN } </td>
                    <td> ${ FirstName } </td>
                    <td> ${ LastName } </td>
                    <td> <button data-id="${PersonID}" data-status="${Status}" id="statusToggler" class="${ (Status === 0) ? 'active' : 'inactive' }">${ (Status === 0) ? 'ACTIVE' : 'INACTIVE' }</button> </td>
                    <td> 
                        <i id="editEmployee" data-id="${PersonID}" data-lname="${LastName}" data-ssn="${SSN}" data-name="${FirstName}" data-status="${Status}" class="fa-solid fa-pen-to-square"></i> 
                        <i id="deleteEmployee" data-id="${PersonID}" class="fa-solid fa-trash-can"></i>
                    </td>
                </tr>
            `
        });
        // After iterating all employees, we are setting up into the HTML
        this.lb.$('#listBody').innerHTML = htmlTableContent;
    }

    addEvenListenerListToElements() {
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
    }
    
    transformEmployeeDataToJSON(data: IEmployee) {

    return {
        SSN                : data.SSN,
        Status             : this.DE.employeeStatusInput!.checked ? 1 : 0,
        statusDV           : this.DE.employeeStatusInput!.checked ? Status.Active : Status.Suspended,
        PersonID           : data.PersonID != '' ? data.PersonID : uuidv4(),
        LastName           : data.LastName,
        FirstName          : data.FirstName,
        EmployeeNo         : (Math.floor(Math.random() * 10000)).toString(),
        LastUpdatedBy      : EditorType.Admin,
        LastUpdatedDate    : new Date(),
        EmploymentEndDate  : null,
        EmploymentStartDate: new Date,
    }
    }

    setEmployeeDataIntoFormToEdit(data: any) {

        this.DE.personSSNInput!.value        = data.SSN;
        this.DE.personIdInput!.value         = data.PersonID;
        this.DE.lastNameInput!.value         = data.LastName;
        this.DE.firstNameInput!.value        = data.FirstName;
        this.DE.employeeStatusInput!.checked = data.Status == 0 ? true : false;

        this.DE.contentEmployees!.classList.add('hidden')
        this.DE.contentForm!.classList.remove('hidden');
    }

    updateEmployeeStatus(personID: string, status: number) {
        const employeeJSON: IEmployee = {
            PersonID: personID,
            Status  : status
        }
        this.updateEmployee(employeeJSON);
    }

    activateEventListenersForModals(personID: string, action: string, status?: any) {
        this.addEventListenerCancelBtnModalElement(action);
        this.addEventListenerConfirmEmployeeBtnModalElement(personID, action, status);
    }

    activateEventListenersForModalBtns(personID: string, action: string, status?: any) {
        this.activateEventListenersForModals(personID, action, status);
    }
    
    addEventListenerCancelBtnModalElement(action: string) {
        this.lb.$$('#modalBtnCancel').forEach(cancelModalBtn => {
            cancelModalBtn.addEventListener('click', () => {
                if (action === 'delete') {
                    this.DE.deleteEmpModal!.classList.add('hidden');
                } else if (action === 'status') {
                    this.DE.editStatusEmpModal!.classList.add('hidden');
                }
            });
        })
    }
    
    addEventListenerConfirmEmployeeBtnModalElement(personID: string, action: string, status?: any) {
        this.lb.$$('#modalBtnConfirm').forEach(confirmModalBtn => {
            confirmModalBtn.addEventListener('click', () => {
                if (action === 'delete') {
                    this.deleteEmployee(personID)
                    this.DE.deleteEmpModal!.classList.add('hidden')
                } else if (action === 'status') {
                    this.updateEmployeeStatus(personID, status)
                    this.DE.editStatusEmpModal!.classList.add('hidden')
                }
            });
        })
    }

    addEventListenerToDeleteEmployeeElement() {
        this.lb.$$('#deleteEmployee').forEach(eliminarEmployeeBtn => {
            eliminarEmployeeBtn.addEventListener('click', (employee) => {
                const personID: string = (employee.target as HTMLButtonElement).getAttribute('data-id') as string;
    
                this.DE.deleteEmpModal!.classList.remove('hidden')
    
                this.activateEventListenersForModalBtns(personID, 'delete');
    
                this.DE.contentForm!.classList.add('hidden');
            })
        })
    }

    addEventListenerToEditEmployeeElement() {
        this.lb.$$('#editEmployee').forEach((editEmployeeBtn: any) => {
            editEmployeeBtn.addEventListener('click', (emp: any) => {
                this.editing = true;
                const PersonID : string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
                const SSN      : string = (emp.target as HTMLElement).getAttribute('data-ssn') as string;
                const FirstName: string = (emp.target as HTMLElement).getAttribute('data-name') as string;
                const LastName : string = (emp.target as HTMLElement).getAttribute('data-lname') as string;
                const Status   : string = (emp.target as HTMLElement).getAttribute('data-status') as string;
    
                // Saving employee info to persist the data
                this.employee = {
                    PersonID,
                    SSN,
                    FirstName,
                    LastName,
                    Status: parseInt(Status),
                };
    
                this.DE.editingEmplTitle!.innerHTML = `> ${FirstName} ${LastName}`; 
    
                this.setEmployeeDataIntoFormToEdit(this.employee);
            });
        })
    }

    addEventListenerToStatusTogglerBtnElement() {
        this.lb.$$('#statusToggler').forEach(updateEmployeeStatusBtn => {
            // emp (employee)
            updateEmployeeStatusBtn.addEventListener('click', (emp) => {
                const employeeID: string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
                const employeeStatus: any = (emp.target as HTMLElement).getAttribute('data-status');
                this.editing = true;
    
                this.DE.editStatusEmpModal!.classList.remove('hidden')
    
                let newStatus: number;
                
                if (employeeStatus == 0) {
                    newStatus = 1;
                } else {
                    newStatus = 0;
                }
    
                this.activateEventListenersForModalBtns(employeeID, 'status', newStatus);
            })
        })
    }

    addEventListenerToCreateEmployeeBtnElement() {
        this.DE.createEmployeeBtn!.addEventListener('click', () => {
            this.editing = false;
            this.DE.form!.reset();
            this.DE.contentEmployees!.classList.add('hidden')
            this.DE.contentForm!.classList.remove('hidden');
        });
    }
    
    addEventListenerToSaveEmployeeDataElement() {
        this.DE.saveEmployeeData!.addEventListener('click', () => {
             
            if ( this.editing ) {
    
                this.employee = {
                    PersonID : this.DE.personIdInput!.value,
                    SSN      : this.DE.personSSNInput!.value,
                    LastName : this.DE.lastNameInput!.value,
                    FirstName: this.DE.firstNameInput!.value,
                    Status   : this.DE.employeeStatusInput!.checked ? 0 : 1,
                    StatusDV : this.DE.employeeStatusInput!.checked ? Status.Active : Status.Suspended
                }
            
                this.updateEmployee(this.employee)
    
                this.DE.form!.reset();
    
                this.DE.contentForm!.classList.add('hidden')
                this.DE.contentEmployees!.classList.remove('hidden')
    
                this.DE.editingEmplTitle!.innerHTML = '';
    
            } else {
                this.employee = {
                    PersonID : this.DE.personIdInput!.value,
                    SSN      : this.DE.personSSNInput!.value,
                    LastName : this.DE.lastNameInput!.value,
                    FirstName: this.DE.firstNameInput!.value,
                    Status   : this.DE.employeeStatusInput!.checked ? 0 : 1,
                    StatusDV : this.DE.employeeStatusInput!.checked ? Status.Active : Status.Suspended
                }
                console.log(this.employee)
                this.createEmployee(this.transformEmployeeDataToJSON(this.employee))
    
                this.DE.contentForm!.classList.add('hidden')
                this.DE.contentEmployees!.classList.remove('hidden')
    
                this.DE.form!.reset();
            }
        });
    
        this.DE.cancelSavingEmplData!.addEventListener('click', () => {
    
            this.employee = {}
    
            this.DE.editingEmplTitle!.innerHTML = '';
            this.DE.contentEmployees!.classList.remove('hidden')
            this.DE.contentForm!.classList.add('hidden');
    
        });
    }

    addEventListenerToEmployeeStatusInput() {
        this.DE.employeeStatusInput!.addEventListener('click', () => {

        })
    }
    
}

const renderer = new Renderer();

renderer.loadAPIConsumed();  
