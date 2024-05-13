

class Mountain {
    constructor() {
        this.run = true;
        this.last = 0;
    }


    render() {
        if (this.run && (performance.now() - this.last > this.interval)) {
            this.last = performance.now();
            this.frame();
        }
    }

    frame() {

    }
}
