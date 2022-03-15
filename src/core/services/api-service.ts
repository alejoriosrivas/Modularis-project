import { Environment } from "../../environment/api-url";
import { IEmployee } from "../interface/employee.interface";

const env = new Environment();

export class ApiService {

    _APIUrl = env._APIUrl;

    headers!: Headers;

    getAllUsersRequest!: Request;

    getEmployeeByIdRequest!: any;

    createEmplRequest!: any;

    updateEmplRequest!: any;

    deleteEmplRequest!: any;

    employees: IEmployee[] = [];

    employee: IEmployee = {};

    constructor() {
        this.headers = new Headers({
            'Accept'         : '*/*',
            'Accept-Encoding': 'gzip, defiate, br',
            'Connection'     : 'Keep-alive',
            'CustomerID'     : 'C93F949C-41B8-4C9E-95AA-B030B31F6F3F',
            'APIKey'         : 'JOhNpoolcUCi6Fnu5cAc38yJMRuHAXBne2bYq5',
            'Content-Type'   : 'application/json'
        })

        this.getAllUsersRequest = new Request(this._APIUrl, {
            method : 'GET',
            mode   : 'cors',
            headers: this.headers
        })

        this.getEmployeeByIdRequest = (userID: string) => {
            return new Request(`${this._APIUrl}(${userID})`, {
                method : 'GET',
                mode   : 'cors',
                headers: this.headers,
            });
        }

        this.createEmplRequest = (data: IEmployee) => {
            return new Request(this._APIUrl, {
                method : 'POST',
                mode   : 'cors',
                headers: this.headers,
                body   : JSON.stringify(data)
            })
        }

        this.updateEmplRequest = (data: IEmployee) => {
            return new Request(this._APIUrl, {
                method : 'PUT',
                mode   : 'cors',
                headers: this.headers,
                body   : JSON.stringify(data)
            });
        }

        this.deleteEmplRequest = (employeeID: string) => {
            return new Request(`${this._APIUrl}(${employeeID})`, {
                method : 'DELETE',
                mode   : 'cors',
                headers: this.headers
            });
        }
    }

    
}