
/* declare animal body parts */
let body_center;
let body_front1;
let neck1;
let neck2;
let horn1;
let horn2;
let larm1;
let larm2;
let rarm1;
let rarm2;
let lleg1;
let lleg2;
let rleg1;
let rleg2;
let tail1;
let tail2;
let tail3;
let lwing;
let rwing;


let shapes = [];




function init_dragon() {
    body_center = new Cube();
    body_center.color = convert_hex_to_rgba(0x840800);
    shapes.push(body_center);

    body_front1 = new Cube();
    body_front1.color = convert_hex_to_rgba(0xB86514);
    shapes.push(body_front1);

    neck1 = new CubeNC();
    neck1.color = convert_hex_to_rgba(0x4E0008);
    shapes.push(neck1);

    neck2 = new TrianglePrism();
    neck2.color = convert_hex_to_rgba(0x4E1020);
    shapes.push(neck2);

    head = new CubeNC();
    head.color = convert_hex_to_rgba(0x7D2E00);
    shapes.push(head);

    nose = new CubeNC();
    nose.color = convert_hex_to_rgba(0x4E0008);
    shapes.push(nose);

    mouth = new CubeNC();
    mouth.color = convert_hex_to_rgba(0x782900);
    shapes.push(mouth);

    horn1 = new Horn();
    horn1.color = convert_hex_to_rgba(0xFF5800);
    shapes.push(horn1);

    horn2 = new Horn();
    horn2.color = convert_hex_to_rgba(0xFF5800);
    shapes.push(horn2);

    horn3 = new Horn();
    horn3.color = convert_hex_to_rgba(0xFF5800);
    shapes.push(horn3);

    let arm_leg_color = convert_hex_to_rgba(0x210003);

    larm1 = new CubeNC();
    larm1.color = arm_leg_color;
    shapes.push(larm1);

    larm2 = new CubeNC();
    larm2.color = arm_leg_color;
    shapes.push(larm2);

    rarm1 = new CubeNC();
    rarm1.color = arm_leg_color;
    shapes.push(rarm1);

    rarm2 = new CubeNC();
    rarm2.color = arm_leg_color;
    shapes.push(rarm2);

    lleg1 = new CubeNC();
    lleg1.color = arm_leg_color;
    shapes.push(lleg1);

    lleg2 = new CubeNC();
    lleg2.color = arm_leg_color;
    shapes.push(lleg2);

    rleg1 = new CubeNC();
    rleg1.color = arm_leg_color;
    shapes.push(rleg1);

    rleg2 = new CubeNC();
    rleg2.color = arm_leg_color;
    shapes.push(rleg2);

    tail1 = new CubeNC();
    tail1.color = convert_hex_to_rgba(0x4E0008);
    shapes.push(tail1);

    tail2 = new CubeNC();
    tail2.color = convert_hex_to_rgba(0xB86514);
    shapes.push(tail2);

    tail3 = new Horn();
    tail3.color = convert_hex_to_rgba(0x8E3D00);
    shapes.push(tail3);

    lwing = new Wing();
    lwing.color = convert_hex_to_rgba(0xBB4100);
    shapes.push(lwing);

    rwing = new Wing();
    rwing.color = convert_hex_to_rgba(0xBB4100);
    shapes.push(rwing);
}

let dragon_x = 15;
let dragon_y = 10;
let dragon_z = 15;
let dragon_bearing = 20;

class DragonControl {
    constructor() {
        this.start_time = -1;
    }

    start(tx, ty, tz, tb) {
        if (this.start_time != -1) {
            return;
        }

        this.start_time = performance.now();
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
        this.tb = tb;

        if (this.ty < 1.2) {
            this.ty = 1.2;
        }
    }

    render() {
        if (this.start_time < 0) {
            return;
        }
        let timer = performance.now() - this.start_time;

        if (timer < 4000) {  // flying to player
            dragon_x = 15 + (this.tx - 15) * (timer/4000);
            dragon_z = 15 + (this.tz - 15) * (timer/4000);
        } else if (timer < 6000) {  // landing
            let d = (timer - 4000) / 2000;
            io_stand_up = d * 75;
            dragon_y = 10 + (this.ty - 10) * d;
        } else if (timer < 13000) {  // do nothing
        } else if (timer < 15000) {  // go up
            let d = (1-(timer-13000)/2000);
            dragon_y = 10 + (this.ty - 10) * d;
            io_stand_up = d*75;
        } else if (timer < 17000) {  // go back
            let d = (1-(timer-15000)/2000);
            dragon_x = 15 + (this.tx - 15) * d;
            dragon_z = 15 + (this.tz - 15) * d;
        } else {
            dragon_x = 15;
            dragon_y = 10;
            dragon_z = 15;
            io_stand_up = 0;
            this.start_time = -1;
        }
    }

}


function render_dragon() {
    /* body */
    // set coordiante
    body_center.cor.setTranslate(dragon_x, dragon_y, dragon_z);
    body_center.cor.rotate(dragon_bearing,0, 1,0);
    body_center.cor.scale(4, 4, 4);
    body_center.cor.rotate(io_stand_up, 1, 0, 0);
    body_center.init_mat();
    body_center.mat.scale(1, 0.9, 1.2);

    // set coordiante
    body_front1.cor.set(body_center.cor);

    if (io_enable_animation) {
        body_front1.cor.rotate(Math.sin(elapsed_time/650)*5, 0, 1, 0);
    }

    body_front1.cor.translate(0, 0.03, -0.1);
    // set transforms
    body_front1.init_mat();
    body_front1.mat.scale(0.7, 0.7, 0.6);

    /* neck */
    // set coordiante
    neck1.cor.set(body_front1.cor);

    if (io_enable_animation) {
        neck1.cor.rotate(Math.sin(elapsed_time/650)*20, 0, 1, 0);
        neck1.cor.rotate(Math.sin(elapsed_time/2000)*5, 1, 0, 0);
    }


    neck1.cor.rotate(io_look_y/4, 1, 0, 0);
    neck1.cor.rotate(io_stand_up/3*2, -1, 0, 0);

    neck1.cor.translate(0, 0.18, -0.14);
    // set transforms
    neck1.init_mat();
    neck1.mat.rotate(60, 1, 0, 0);
    neck1.mat.scale(0.4, 0.35, 2);

    // set coordiante
    neck2.cor.set(neck1.cor);

    if (io_enable_animation) {
        neck2.cor.rotate(Math.sin(elapsed_time/2000)*10, 1, 0, 0);
    }

    neck2.cor.rotate(io_look_y/3, 1, 0, 0);
    neck2.cor.rotate(io_stand_up/3, -1, 0, 0);
    neck2.cor.translate(0, -0.01, 0.02);
    neck2.cor.rotate(200, 1, 0, 0);
    // set transforms
    neck2.init_mat();
    neck2.cor.rotate(180, 0, 0, 1);
    neck2.cor.rotate(180, 0, 0, 1);
    neck2.mat.scale(0.35, 0.3, 2);

    /* head */
    head.cor.set(neck2.cor);
    head.cor.translate(0, -0.03, 0.16);
    head.cor.rotate(io_look_y, 1, 0, 0);
    head.cor.rotate(io_look_x, 0, 1, 0);
    head.cor.rotate(-20, 1, 0, 0);
    head.init_mat();
    head.mat.scale(0.55, 0.55, 1.2);

    /* nose */
    nose.cor.set(head.cor);
    nose.cor.translate(0, 0.019, 0.1);
    nose.init_mat();
    nose.mat.scale(0.3, 0.3, 0.8);

    /* mouth */
    mouth.cor.set(head.cor);
    mouth.cor.translate(0, 0.06, 0.05);
    mouth.init_mat();

    if (io_enable_animation) {
        mouth.mat.rotate(Math.sin(elapsed_time/500)*10-15, 1, 0, 0);
    } else {
        mouth.mat.rotate(-20, 1, 0, 0);
    }
    mouth.mat.scale(0.4, 0.15, 1.1);

    /* honrs */
    horn1.cor.set(head.cor);
    horn1.init_mat();
    horn1.mat.translate(0, -0.05, 0.01);
    horn1.mat.rotate(180, 1, 0, 0);
    horn1.mat.scale(0.1, .4, 0.15);

    horn2.cor.set(head.cor);
    horn2.init_mat();
    horn2.mat.translate(0, -0.05, 0.05);
    horn2.mat.rotate(180, 1, 0, 0);
    horn2.mat.scale(0.1, 0.35, 0.15);

    horn3.cor.set(head.cor);
    horn3.init_mat();
    horn3.mat.translate(0, -0.05, 0.09);
    horn3.mat.rotate(180, 1, 0, 0);
    horn3.mat.scale(0.1, 0.3, 0.15);

    /* larm */
    larm1.cor.set(body_center.cor);
    larm1.cor.translate(0.068, -0.06, -0.1);
    larm1.cor.rotate(io_stand_up/2, 0, 0, 1);
    larm1.cor.rotate(15, 1, 0, 0);
    larm1.init_mat();
    larm1.mat.rotate(90, 1, 0, 0);
    larm1.mat.scale(0.27, 0.255, 1.4);

    larm2.cor.set(larm1.cor);
    larm2.cor.translate(0, -0.13, 0);
    larm2.cor.rotate(io_stand_up/3, -1, 0, 0);
    larm2.cor.rotate(-15, 1, 0, 0);
    larm2.init_mat();
    larm2.mat.rotate(90, 1, 0, 0);
    larm2.mat.scale(0.26, 0.245, 1.2);

    /* rarm */
    rarm1.cor.set(body_center.cor);
    rarm1.cor.translate(-0.068, -0.06, -0.1);
    rarm1.cor.rotate(io_stand_up/2, 0, 0, -1);
    rarm1.cor.rotate(15, 1, 0, 0);
    rarm1.init_mat();
    rarm1.mat.rotate(90, 1, 0, 0);
    rarm1.mat.scale(0.27, 0.255, 1.4);

    rarm2.cor.set(rarm1.cor);
    rarm2.cor.translate(0, -0.13, 0);
    rarm2.cor.rotate(io_stand_up/3, -1, 0, 0);
    rarm2.cor.rotate(-15, 1, 0, 0);
    rarm2.init_mat();
    rarm2.mat.rotate(90, 1, 0, 0);
    rarm2.mat.scale(0.26, 0.245, 1.2);

    /* lleg */
    lleg1.cor.set(body_center.cor);



    lleg1.cor.translate(0.068, -0.06,  0.13);
    lleg1.cor.rotate(io_stand_up/4*3, -1, 0, 0);
    lleg1.cor.rotate(15, 1, 0, 0);
    lleg1.init_mat();
    lleg1.mat.rotate(90, 1, 0, 0);
    lleg1.mat.scale(0.27, 0.255, 1.4);

    lleg2.cor.set(lleg1.cor);
    lleg2.cor.translate(0, -0.13, 0);
    lleg2.cor.rotate(-15, 1, 0, 0);
    lleg2.init_mat();
    lleg2.mat.rotate(90, 1, 0, 0);
    lleg2.mat.scale(0.26, 0.245, 1.2);

    /* rleg */
    rleg1.cor.set(body_center.cor);
    rleg1.cor.translate(-0.068, -0.06, 0.13);
    rleg1.cor.rotate(io_stand_up/4*3, -1, 0, 0);
    rleg1.cor.rotate(15, 1, 0, 0);
    rleg1.init_mat();
    rleg1.mat.rotate(90, 1, 0, 0);
    rleg1.mat.scale(0.27, 0.255, 1.4);

    rleg2.cor.set(rleg1.cor);
    rleg2.cor.translate(0, -0.13, 0);
    rleg2.cor.rotate(-15, 1, 0, 0);
    rleg2.init_mat();
    rleg2.mat.rotate(90, 1, 0, 0);
    rleg2.mat.scale(0.26, 0.245, 1.2);

    /* tail */
    tail1.cor.set(body_center.cor);

    if (io_enable_animation) {
        tail1.cor.rotate(Math.sin(elapsed_time/1000)*5, 1, 0, 0);
        tail1.cor.rotate(Math.sin(elapsed_time/1500)*5, 0, 1, 0);
    }


    tail1.cor.translate(0, -.025, 0.105);
    tail1.cor.rotate(io_stand_up/2, -1, 0, 0);

    tail1.cor.rotate(-10, 1, 0, 0);
    tail1.init_mat();
    tail1.mat.scale(0.82, 0.77, 2.2);

    tail2.cor.set(tail1.cor);

    if (io_enable_animation) {
        tail2.cor.rotate(Math.sin(elapsed_time/1200)*5, 1, 0, 0);
        tail2.cor.rotate(Math.sin(elapsed_time/1500)*5, 0, 1, 0);
    }
    tail2.cor.translate(0, 0.01, 0.20);
    tail2.cor.rotate(-15, 1, 0, 0);
    tail2.init_mat();
    tail2.mat.scale(0.5, 0.5, 2);

    tail3.cor.set(tail2.cor);
    tail3.cor.translate(0, 0, 0.15);
    tail3.init_mat();
    tail3.mat.rotate(-25, 1, 0, 0);
    tail3.mat.scale(0.45, 0.45, 2.5);
    tail3.mat.rotate(90, 1, 0, 0);

    /* wings */
    lwing.cor.set(body_center.cor);
    lwing.cor.translate(0, 0.05, 0.08);
    lwing.init_mat();

    if (io_enable_animation) {
        lwing.mat.rotate(Math.sin(elapsed_time/400)*30, 1, 1, 1);
    }

    lwing.mat.rotate(-20, 1, 0, 0);
    lwing.mat.rotate(-65, 0, 0, 1);
    lwing.mat.rotate(-90, 0, 1, 0);
    lwing.mat.scale(1.8, 2.5, 0.15);

    rwing.cor.set(body_center.cor);
    rwing.cor.translate(0, 0.05, 0.08);
    rwing.init_mat();

    if (io_enable_animation) {
        rwing.mat.rotate(Math.sin(elapsed_time/400)*30, 1, -1, -1);
    }
    rwing.mat.rotate(-20, 1, 0, 0);
    rwing.mat.rotate(65, 0, 0, 1);
    rwing.mat.rotate(90, 0, 1, 0);
    rwing.mat.scale(1.8, 2.5, 0.15);



    // render all shapes
    for (shape of shapes) {
        shape.render();
    }
}

