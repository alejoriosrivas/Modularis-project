"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenerBuilder = void 0;
var ListenerBuilder = /** @class */ (function () {
    function ListenerBuilder() {
    }
    // FUNCTIONS QUERYSELECTOR FOR HTMLELEMENTS THAT DOESN'T NEED DECLARE VARIABLE IN TS
    // Function that gives us the facility to add listeners to an specific HTMLelement
    ListenerBuilder.prototype.$ = function (tagSelector) {
        return document.querySelector(tagSelector);
    };
    // Function to be able to add multiples listeners to a multiples buttons, that are equals, putting listeners by for each cycle
    ListenerBuilder.prototype.$$ = function (tagSelector) {
        return document.querySelectorAll(tagSelector);
    };
    return ListenerBuilder;
}());
exports.ListenerBuilder = ListenerBuilder;
