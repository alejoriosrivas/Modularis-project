"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
var api_url_1 = require("../../environment/api-url");
var env = new api_url_1.Environment();
var ApiService = /** @class */ (function () {
    function ApiService() {
        var _this = this;
        this._APIUrl = env._APIUrl;
        this.employees = [];
        this.employee = {};
        this.headers = new Headers({
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, defiate, br',
            'Connection': 'Keep-alive',
            'CustomerID': 'C93F949C-41B8-4C9E-95AA-B030B31F6F3F',
            'APIKey': 'JOhNpoolcUCi6Fnu5cAc38yJMRuHAXBne2bYq5',
            'Content-Type': 'application/json'
        });
        this.getAllUsersRequest = new Request(this._APIUrl, {
            method: 'GET',
            mode: 'cors',
            headers: this.headers
        });
        this.getEmployeeByIdRequest = function (userID) {
            return new Request("".concat(_this._APIUrl, "(").concat(userID, ")"), {
                method: 'GET',
                mode: 'cors',
                headers: _this.headers,
            });
        };
        this.createEmplRequest = function (data) {
            return new Request(_this._APIUrl, {
                method: 'POST',
                mode: 'cors',
                headers: _this.headers,
                body: JSON.stringify(data)
            });
        };
        this.updateEmplRequest = function (data) {
            return new Request(_this._APIUrl, {
                method: 'PUT',
                mode: 'cors',
                headers: _this.headers,
                body: JSON.stringify(data)
            });
        };
        this.deleteEmplRequest = function (employeeID) {
            return new Request("".concat(_this._APIUrl, "(").concat(employeeID, ")"), {
                method: 'DELETE',
                mode: 'cors',
                headers: _this.headers
            });
        };
    }
    return ApiService;
}());
exports.ApiService = ApiService;
