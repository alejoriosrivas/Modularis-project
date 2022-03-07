"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
var Environment = /** @class */ (function () {
    function Environment() {
        this._APIUrl = 'https://gateway.modularis.com/HRDemo/RESTActivityWebService/HRDemo.Example/Employees';
    }
    Environment.prototype.url = function () {
        return this._APIUrl;
    };
    return Environment;
}());
exports.Environment = Environment;
