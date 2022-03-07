export class Environment {
    public _APIUrl: string

    constructor() {
        this._APIUrl ='https://gateway.modularis.com/HRDemo/RESTActivityWebService/HRDemo.Example/Employees';
    }

    url() {
        return this._APIUrl;
    }
}