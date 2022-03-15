export class ListenerBuilder {

    constructor() { }

    // FUNCTIONS QUERYSELECTOR FOR HTMLELEMENTS THAT DOESN'T NEED DECLARE VARIABLE IN TS
    // Function that gives us the facility to add listeners to an specific HTMLelement
    $(tagSelector: string): HTMLElement {
        return document.querySelector(tagSelector) as HTMLElement;
    }
    
    // Function to be able to add multiples listeners to a multiples buttons, that are equals, putting listeners by for each cycle
    $$(tagSelector: string): NodeListOf<Element> {
        return document.querySelectorAll(tagSelector) as NodeListOf<Element>
    }

}