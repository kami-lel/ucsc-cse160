


class Mountain {
    constructor() {
        this.run = false;
        this.interval = 15;
        this.blocks = [];
    }

    start(i, j) {
        if (this.run) {
            return;
        }

        this.origin_i = i;
        this.origin_j = j;

        if (this.origin_i < 0) {this.origin_i = 0;}
        if (this.origin_j < 0) {this.origin_j = 0;}
        if (this.origin_i >= map_size) {this.origin_i = map_size-1;}
        if (this.origin_j >= map_size) {this.origin_j = map_size-1;}

        // randomly decide mountain size
        this.w = Math.floor(Math.random() * 9) + 3;

        this.populate_blocks();

        this.i = 0;
        this.l = 0;
        this.j = 0;

        this.run = true;
        this.last = performance.now();
    }

    render() {
        if (this.run && ((performance.now() - this.last) > this.interval)) {
            this.last = performance.now();
            this.frame();
        }
    }

    frame() {
        maps[this.l][this.i+this.origin_i][this.j+this.origin_j] = 
        this.blocks[this.l][this.i][this.j];

        this.j += 1;
        if (this.j >= this.w) {
            this.j = 0;
            this.i += 1;

            if (this.i == this.w) {
                this.i = 0;
                this.l += 1;

                if (this.l == map_layers) {
                    this.run = false;
                }
            }
        }
    }

    populate_blocks() {
        this.blocks = [];
        // create empty blocks
        for (let l = 0; l < map_layers; l++) {
            let layer = [];
            for (let i = 0; i < this.w; i++) {
                let col = [];
                for (let j = 0; j < this.w; j++) {
                    col.push(0);
                }
                layer.push(col);
            }
            this.blocks.push(layer);
        }


        let l = 0;  // 1st layer
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.w; j++) {
                let v = Math.random();
                if (v > 0.2) {
                    this.blocks[l][i][j] = 3;
                }
            }
        }

        l = 1;  // 2nd layer
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.w; j++) {
                if (this.blocks[0][i][j] > 0) {  // prvent hanging block
                    let v = Math.random();
                    if (v > 0.4) {
                        this.blocks[l][i][j] = 3;
                    }
                }
            }
        }

        l = 2;  // 3rd layer
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.w; j++) {
                if (this.blocks[1][i][j] > 0) {  // prvent hanging block
                    let v = Math.random();
                    if (v > 0.6) {
                        this.blocks[l][i][j] = 3;
                    }
                }
            }
        }

        l = 3;  // 4th layer
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.w; j++) {
                if (this.blocks[2][i][j] > 0) {  // prvent hanging block
                    let v = Math.random();
                    if (v > 0.8) {
                        this.blocks[l][i][j] = 3;
                    }
                }
            }
        }


    }

}


