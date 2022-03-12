// uuid is a UserID random generator
import { v4 as uuidv4 } from 'uuid';

// Getting all HTML elements that we're gonna manipulate
const form                 = document.querySelector('#form')                       as HTMLFormElement;
const personSSNInput       = document.querySelector('#personSSNInput')             as HTMLInputElement; 
const firstNameInput       = document.querySelector('#firstNameInput')             as HTMLInputElement; 
const lastNameInput        = document.querySelector('#lastNameInput')              as HTMLInputElement; 
const personIdInput        = document.querySelector('#personIdInput')              as HTMLInputElement;
const saveEmployeeData     = document.querySelector('#createBtn')                  as HTMLButtonElement;
const createEmployeeBtn    = document.querySelector('#createEmployeeBtn')          as HTMLButtonElement;
const contentEmployees     = document.querySelector('#content_employees')          as HTMLElement; 
const contentForm          = document.querySelector('#content_form')               as HTMLElement; 
const deleteEmpModal       = document.querySelector('#deleteEmployeeConfirmModal') as HTMLElement; 
const editStatusEmpModal   = document.querySelector('#changeEmployeeStatusModal')  as HTMLElement; 
const modalBtnCancel       = document.querySelector('#modalBtnCancel')             as HTMLButtonElement;
const modalBtnConfirm      = document.querySelector('#modalBtnConfirm')            as HTMLButtonElement;
const editingEmplTitle     = document.querySelector('#editingEmployeeTitle')       as HTMLElement; 
const cancelSavingEmplData = document.querySelector('#cancelCreationBtn')          as HTMLButtonElement;
const employeeStatusInput  = document.querySelector('#employeeStatusInput')        as HTMLInputElement;

// Variable created for evaluating if creating or updating in form
let editing: boolean = false; 

// Api URL that consumes the service
const _APIUrl: string = 'https://gateway.modularis.com/HRDemo/RESTActivityWebService/HRDemo.Example/Employees';

// We're generating headers for consuming Services, setting up configuration for no having authentication errors
const headers = new Headers({
    'Accept'         : '*/*',
    'Accept-Encoding': 'gzip, defiate, br',
    'Connection'     : 'Keep-alive',
    'CustomerID'     : 'C93F949C-41B8-4C9E-95AA-B030B31F6F3F',
    'APIKey'         : 'JOhNpoolcUCi6Fnu5cAc38yJMRuHAXBne2bYq5',
    'Content-Type'   : 'application/json'
});

// Thats the consumer for the service to bring here all Employees
let employees: [] = [];
const getAllUsersRequest = new Request(_APIUrl, {
    method : 'GET',
    mode   : 'cors',
    headers: headers
});
const getAllUsers = () => {
    fetch(getAllUsersRequest)
        .then(response => response.json())
        .then(responseJson => {employees = responseJson; console.log(employees)})
        .then(() => renderTemplate())
        .catch(err => new Error(err));
};

// Service consumer that bring to front a employee consulted by ID
let employee: any = [];
const getEmployeeByIdRequest = (userID: string) => {
    return new Request(`${_APIUrl}(${userID})`, {
        method : 'GET',
        mode   : 'cors',
        headers: headers,
    });
};
const getEmployeeById = (userID: string) => {
    fetch(getEmployeeByIdRequest(userID))
        .then(response => response.json())
        .then(responseJson => employee = responseJson)
        .catch(err => new Error(err));
};

// Standing Service consumer to Create new Employees
const createEmplRequest = (data: any) => {
    return new Request(_APIUrl, {
        method : 'POST',
        mode   : 'cors',
        headers: headers,
        body   : JSON.stringify(data)
    })
};
const createEmployee = (data: any) => {
    fetch(createEmplRequest(data))
        .then(() => getAllUsers() )
        .catch(err => console.log(new Error(err)));
} ;

// Service consumer to update a employee 
const updateEmplRequest = (data: any) => {
    return new Request(_APIUrl, {
        method : 'PUT',
        mode   : 'cors',
        headers: headers,
        body   : JSON.stringify(data)
    });
}
const updateEmployee = (data: any) => {
    fetch(updateEmplRequest(data))
        .then(() => getAllUsers())
        .catch(err => new Error(err));
};

// Service to delete employee by id
const deleteEmplRequest = (employeeID: string) => {
    return new Request(`${_APIUrl}(${employeeID})`, {
        method : 'DELETE',
        mode   : 'cors',
        headers: headers
    });
};
const deleteEmployee = (employeeID: string) => {
    fetch(deleteEmplRequest(employeeID))
        .then(() => getAllUsers())
        .catch(err => new Error(err));
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
    let htmlTableContent = '';

    // We are creating an for cycle to render all employees inside the list, one by one
    employees.forEach((employee: any) => {

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

    addEventListenerToEmployeeStatusInput();
}

function addEventListenerToEmployeeStatusInput() {
    employeeStatusInput.addEventListener('click', () => {
        console.log(employeeStatusInput.checked)
    })
}

function activateEventListenersForModalBtns(personID: string, action: string, status?: any) {
    activateEventListenersForModals(personID, action, status);
}

function activateEventListenersForModals(personID: string, action: string, status?: any) {
    addEventListenerCancelBtnModalElement(action);
    addEventListenerConfirmEmployeeBtnModalElement(personID, action, status);
}

function addEventListenerCancelBtnModalElement(action: string) {
    $$('#modalBtnCancel').forEach(cancelModalBtn => {
        cancelModalBtn.addEventListener('click', () => {
            if (action === 'delete') {
                deleteEmpModal.classList.add('hidden');
            } else if (action === 'status') {
                editStatusEmpModal.classList.add('hidden');
            }
        });
    })
}

function addEventListenerConfirmEmployeeBtnModalElement(personID: string, action: string, status?: any) {
    $$('#modalBtnConfirm').forEach(confirmModalBtn => {
        confirmModalBtn.addEventListener('click', () => {
            if (action === 'delete') {
                deleteEmployee(personID)
                deleteEmpModal.classList.add('hidden')
            } else if (action === 'status') {
                updateEmployeeStatus(personID, status)
                editStatusEmpModal.classList.add('hidden')
            }
        });
    })
}

function addEventListenerToDeleteEmployeeElement() {
    $$('#deleteEmployee').forEach(eliminarEmployeeBtn => {
        eliminarEmployeeBtn.addEventListener('click', (employee) => {
            const personID: string = (employee.target as HTMLButtonElement).getAttribute('data-id') as string;

            deleteEmpModal.classList.remove('hidden')

            activateEventListenersForModalBtns(personID, 'delete');

            contentForm.classList.add('hidden');
        })
    })
}

function addEventListenerToEditEmployeeElement() {
    $$('#editEmployee').forEach(editEmployeeBtn => {
        editEmployeeBtn.addEventListener('click', (emp) => {
            editing = true;
            const PersonID : string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
            const SSN      : string = (emp.target as HTMLElement).getAttribute('data-ssn') as string;
            const FirstName: string = (emp.target as HTMLElement).getAttribute('data-name') as string;
            const LastName : string = (emp.target as HTMLElement).getAttribute('data-lname') as string;
            const Status   : string = (emp.target as HTMLElement).getAttribute('data-status') as string;

            // Saving employee info to persist the data
            employee = {
                PersonID,
                SSN,
                FirstName,
                LastName,
                Status,
            };

            editingEmplTitle.innerHTML = `> ${FirstName} ${LastName}`; 

            setEmployeeDataIntoFormToEdit(employee);
        });
    })
}

function addEventListenerToStatusTogglerBtnElement() {
    $$('#statusToggler').forEach(updateEmployeeStatusBtn => {
        // emp (employee)
        updateEmployeeStatusBtn.addEventListener('click', (emp) => {
            const employeeID: string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
            const employeeStatus: any = (emp.target as HTMLElement).getAttribute('data-status');
            editing = true;

            editStatusEmpModal.classList.remove('hidden')

            let newStatus: number;
            
            if (employeeStatus == 0) {
                newStatus = 1;
            } else {
                newStatus = 0;
            }

            activateEventListenersForModalBtns(employeeID, 'status', newStatus);
        })
    })
}

function addEventListenerToCreateEmployeeBtnElement() {
    createEmployeeBtn.addEventListener('click', () => {
        editing = false;
        form.reset();
        contentEmployees.classList.add('hidden')
        contentForm.classList.remove('hidden');
    });
}

function addEventListenerToSaveEmployeeDataElement() {
    saveEmployeeData.addEventListener('click', () => {
         
        if ( editing ) {

            employee = {
                PersonID : personIdInput.value,
                SSN      : personSSNInput.value,
                LastName : lastNameInput.value,
                FirstName: firstNameInput.value,
                Status   : employeeStatusInput.checked ? 0 : 1,
                StatusSV : employeeStatusInput.checked ? 'Active' : 'Suspended'
            }

            console.log(employee)
            updateEmployee(employee)

            form.reset();

            contentForm.classList.add('hidden')
            contentEmployees.classList.remove('hidden')

            editingEmplTitle.innerHTML = '';

        } else {
            employee = {
                PersonID : personIdInput.value,
                SSN      : personSSNInput.value,
                LastName : lastNameInput.value,
                FirstName: firstNameInput.value,
                Status   : employeeStatusInput.checked ? 0 : 1,
                StatusSV : employeeStatusInput.checked ? 'Active' : 'Suspended'
            }
            console.log(employee)
            createEmployee(transformEmployeeDataToJSON(employee))

            contentForm.classList.add('hidden')
            contentEmployees.classList.remove('hidden')

            form.reset();
        }
    });

    cancelSavingEmplData.addEventListener('click', () => {

        employee = {}

        editingEmplTitle.innerHTML = '';
        contentEmployees.classList.remove('hidden')
        contentForm.classList.add('hidden');

    });
}
 

// FUNCTIONS QUERYSELECTOR FOR HTMLELEMENTS THAT DOESN'T NEED DECLARE VARIABLE IN TS
// Function that gives us the facility to add listeners to an specific HTMLelement
function $(tagSelector: string): HTMLElement {
    return document.querySelector(tagSelector) as HTMLElement;
}

// Function to be able to add multiples listeners to a multiples buttons, that are equals, putting listeners by for each cycle
function $$(tagSelector: string): NodeListOf<Element> {
    return document.querySelectorAll(tagSelector) as NodeListOf<Element>
}

// That set up the editing data into the form
function setEmployeeDataIntoFormToEdit(data: any) {

    personSSNInput.value        = data.SSN;
    personIdInput.value         = data.PersonID;
    lastNameInput.value         = data.LastName;
    firstNameInput.value        = data.FirstName;
    employeeStatusInput.checked = data.Status == 0 ? true : false;

    contentEmployees.classList.add('hidden')
    contentForm.classList.remove('hidden');
}

// Transforming the first body of the Employee, to a new formated body to be able to update it in the Service consume
function transformEmployeeDataToJSON(data: any) {

    return {
        PersonID           : data.PersonID != '' ? data.PersonID : uuidv4(),
        FirstName          : data.FirstName,
        LastName           : data.LastName,
        LastUpdatedBy      : "admin",
        LastUpdatedDate    : new Date(),
        SSN                : data.SSN,
        EmployeeNo         : (Math.floor(Math.random() * 10000)).toString(),
        EmploymentEndDate  : null,
        EmploymentStartDate: new Date,
        Status             : employeeStatusInput.checked ? 1 : 0,
        statusDV           : employeeStatusInput.checked ? 'Active' : 'Suspended'
    }
}

function updateEmployeeStatus(personID: string, status: number) {
    const employeeJSON = {
        PersonID: personID,
        Status  : status
    }
    updateEmployee(employeeJSON);
}

loadAPIConsumed();