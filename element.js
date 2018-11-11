
class Element {

    /**
     * 
     * @param {number} value 
     * @param {*} representation 
     */
    constructor(value, representation) {
        this.value = value;
        this.representation = representation;
    }

    /**
     * 
     * @param {Element} otherElement 
     * @returns true if this.value < otherElement.value
     */
    isLesser(otherElement) {
        return this.value < otherElement.value;
    }

    toString() {
        return this.value.toString();
    }

}