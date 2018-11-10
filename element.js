
class Element {

    constructor(value, representation) {
        this.value = value;
        this.representation = representation;
    }

    isLesser(otherElement) {
        return this.value < otherElement.value;
    }

    toString() {
        return this.value.toString();
    }

}