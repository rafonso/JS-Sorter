"use strict";

class Sounder {

    constructor(maxValue) {
        this.maxValue = maxValue;
        this.soundFactor = 5000.0;

        this.context = new AudioContext();
        this.oscillator = this.context.createOscillator();

        let gain = this.context.createGain();
        gain.gain.value = 0.2;
        this.oscillator.connect(gain);
        gain.connect(this.context.destination);
    }

    /**
     * 
     * @param {Array<number>} elements 
     * @param {Array<number>} positions 
     * @param {string} type 
     */
    emitSound(elements, positions, type) {
        this.oscillator.type = type;
        positions.forEach(pos =>
            this.oscillator.frequency.value = (elements[pos] / this.maxValue) * this.soundFactor
        );
    }

    /**
     * 
     * @param {SortEvent} event
     */
    notify(event) {
        switch (event.type) {
            case EventType.START:
                this.oscillator.start(0);
                break;
            case EventType.ENDED:
                this.oscillator.stop();
                if (this.context.close) { // MS has not context.close
                    this.context.close();
                }
                break;
                // "sine", "square", "sawtooth", "triangle"
            case EventType.COMPARSION:
                this.emitSound(event.elements, event.positions, "sine");
                break;
            case EventType.SET:
                this.emitSound(event.elements, event.positions, "square");
                break;
            case EventType.SWAP:
                this.emitSound(event.elements, event.positions, "sawtooth");
                break;
        }
    }

}
