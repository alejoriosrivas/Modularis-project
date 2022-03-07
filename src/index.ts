// uuid is a UserID random generator
import { v4 as uuidv4 } from 'uuid';

// Getting all HTML elements that we're gonna manipulate
const form              = document.querySelector('#form')              as HTMLFormElement;
const personIdInput     = document.querySelector('#personId')          as HTMLInputElement; 
const firstNameInput    = document.querySelector('#firstName')         as HTMLInputElement; 
const lastNameInput     = document.querySelector('#lastName')          as HTMLInputElement; 
const saveEmployeeData  = document.querySelector('#createBtn')         as HTMLButtonElement;
const createEmployeeBtn = document.querySelector('#createEmployeeBtn') as HTMLButtonElement;

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
const getUsers = new Request(_APIUrl, {
    method : 'GET',
    mode   : 'cors',
    headers: headers
});
const getAllUsers = () => {
    fetch(getUsers)
    .then(response => response.json())
    .then(responseJson => {
        employees = responseJson;
        renderTemplate();
    })
    .catch(err => new Error(err));
};

// Service consumer that bring to front a employee consulted by ID
let employee: any = [];
const getEmployee = (userID: string) => {
    return new Request(`${_APIUrl}(${userID})`, {
        method : 'GET',
        mode   : 'cors',
        headers: headers,
    });
};
const getEmployeeById = (userID: string) => {
    fetch(getEmployee(userID))
        .then(response => response.json())
        .then(responseJson => employee = responseJson)
        .catch(err => new Error(err));
};

// Standing Service consumer to Create new Employees
const create = (data: any) => {
    return new Request(_APIUrl, {
        method : 'POST',
        mode   : 'cors',
        headers: headers,
        body   : JSON.stringify(data)
    })
};
const createEmployee = (data: any) => {
    fetch(create(data))
        .then(response => {
            getAllUsers();
        })
        .catch(err => new Error(err));
} ;

// Service consumer to update a employee 
const updateEmpl = (data: any) => {
    return new Request(_APIUrl, {
        method : 'PUT',
        mode   : 'cors',
        headers: headers,
        body   : JSON.stringify(data)
    });
}
const updateEmployee = (data: any) => {
    fetch(updateEmpl(data))
        .then(response => {
            getAllUsers();
        })
        .catch(err => new Error(err));
};

// Service to delete employee by id
const deleteEmpl = (employeeID: string) => {
    return new Request(`${_APIUrl}(${employeeID})`, {
        method : 'DELETE',
        mode   : 'cors',
        headers: headers
    });
};
const deleteEmployee = (employeeID: string) => {
    fetch(deleteEmpl(employeeID))
        .then(response => response.json())
        .then(responseJson => console.log(responseJson))
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
function renderTemplate(): void {

    let htmlTableContent = '';

    // We are creating an for cycle to render all employees inside the list, one by one
    employees.forEach((employee: any) => {

        const { SSN, FirstName, LastName, StatusDV, PersonID } = employee;

        htmlTableContent += `
            <tr>
                <td> ${ SSN } </td>
                <td> ${ FirstName } </td>
                <td> ${ LastName } </td>
                <td> <button data-id="${PersonID}" id="statusToggler" class="${ (StatusDV === 'Active') ? 'active' : 'inactive' }">${ StatusDV }</button> </td>
                <td> 
                    <i id="editEmployee" data-id="${PersonID}" class="fa-solid fa-pen-to-square"></i> 
                    <i id="deleteEmployee" data-id="${PersonID}" class="fa-solid fa-trash-can"></i>
                </td>
            </tr>
        `
    });
    // After iterating all employees, we are setting up into the HTML
    $('#listBody').innerHTML = htmlTableContent;

    // Thats a iterator for each deleteEmployee button to add to it a listener, to every time we click on the button, it'll delete the selected Employee
    $$('#deleteEmployee').forEach(eliminarEmployeeBtn => {
        eliminarEmployeeBtn.addEventListener('click', (employee) => {
            const employeeID: string = (employee.target as HTMLButtonElement).getAttribute('data-id') as string;
            
            form.classList.add('hidden');
            deleteEmployee(employeeID);
            loadAPIConsumed();
        })
    })

    // Iterator for adding listeners to every editEmployee button, every time we click on the button, it'll get the selected Employee data to the form, to be able to modify it
    $$('#editEmployee').forEach(editEmployeeBtn => {
        editEmployeeBtn.addEventListener('click', (emp) => {
            const employeeID: string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
            console.log(employee)
            editing = true;
            getEmployeeById(employeeID);
            editEmployee(employee);
        });
    })

    // that's a eventListener adder by a for each cycle, to be able to update the user state, just clicking on the button 'active' or 'inactive'
    $$('#statusToggler').forEach(updateEmployeeStatusBtn => {
        updateEmployeeStatusBtn.addEventListener('click', (emp) => {
            const employeeID: string = (emp.target as HTMLButtonElement).getAttribute('data-id') as string;
            editing = true;
            getEmployeeById(employeeID)
            let newStatus: number;
            if (employee == 0) {
                newStatus = 1;
            } else {
                newStatus = 0;
            }
            updateEmployee(transformEmployeeDataToJSON(employeeID, newStatus));
        })
    })
    
    // Adding createEmployeeBtn listener, to show the form, and reset possibly data inside
    createEmployeeBtn.addEventListener('click', () => {
        editing = false;
        form.reset();
        form.classList.remove('hidden');
    });

    // Adding listener to saveEmployeeData to save the data, based on if is updating or saving data of the Employee for first time (creating...)
    saveEmployeeData.addEventListener('click', () => {

        if ( editing ) {
            let employeeID = employee.PersonID;
            updateEmployee(transformEmployeeDataToJSON(employeeID));
            form.reset();
        } else {
            createEmployee(transformEmployeeDataToJSON())
            form.reset();
        }
        // loadAPIConsumed();
    });
}

// Function that gives us the facility to add listeners to an specific HTMLelement
function $(tagSelector: string): HTMLElement {
    return document.querySelector(tagSelector) as HTMLElement;
}

// Function to be able to add multiples listeners to a multiples buttons, that are equals, putting listeners by for each cycle
function $$(tagSelector: string): NodeListOf<Element> {
    return document.querySelectorAll(tagSelector) as NodeListOf<Element>
}

// That set up the editing data into the form
function editEmployee(data: any) {

    personIdInput.value  = data.SSN;
    lastNameInput.value  = data.LastName;
    firstNameInput.value = data.FirstName;

    form.classList.remove('hidden');
}

// Transforming the first body of the Employee, to a new formated body to be able to update it in the Service consume
function transformEmployeeDataToJSON(personID?: string, status?: number) {

    return {
        "PersonID"           : personID ? personID : uuidv4(),
        "FirstName"          : firstNameInput.value,
        "LastName"           : lastNameInput.value,
        "LastUpdatedBy"      : "admin",
        "LastUpdatedDate"    : new Date(),
        "SSN"                : personIdInput.value,
        "EmployeeNo"         : (Math.floor(Math.random() * 10000)).toString(),
        "EmploymentEndDate"  : null,
        "EmploymentStartDate": new Date,
        "Status"             : status ? status : 0
    }
}

loadAPIConsumed();