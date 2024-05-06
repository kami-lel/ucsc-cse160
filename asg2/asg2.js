
// Vertex shader program
let VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        gl_PointSize = u_Size;
    }
    `;

// Fragment shader program
let FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
    `;





/* global constant */
let PIXEL_PER_DEGREE = 5;   // convert drag pixel count to degree
let PARICLE_COUNT = 50;
let PARICLE_DISTANCE = 0.5;





/* declare global var */
let canvas;
let gl;
let vertex_buffer;
let a_Postion;
let u_FragColor;
let u_ModelMatrix;
let u_Size;
let u_GlobalRotateMatrix;

let camera_delta_x = 0;
let camera_delta_y = 0;

let io_enable_animation = true;
let io_zoom = 1;
let io_rotate_slider = 0;
let io_free_cam = true;
let io_stand_up = 0;
let io_look_x = 0;
let io_look_y = 0;

let global_rotating_matrix = new Matrix4();
let program_start_time;

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


let shift_click_time = -500000;

let shapes = [];


let cloud1;
let cloud2;
let cloud3;
let clouds = [];

let ground;

let particles = [];






function main() {
    /* set up */
    // canvas
    canvas = document.getElementById('webgl');

    // context
    gl = canvas.getContext("webgl", {preservedDrawingBuffer: true});
    if (!gl) {
        console.log('error: can not get rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);

    // shader
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('error: can not intialize shaders.');
        return;
    }

    // buffer object
    vertex_buffer = gl.createBuffer();
    if (!vertex_buffer) {
        console.log('error: can not create buffer object');
        return
    }



    /* connect GLSL variables */
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('error: can not get a_Position location');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('error: can not get u_FragColor location');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('error: can not get u_Size location');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('error: can not get u_ModelMatrix location');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('error: can not get u_GlobalRotateMatrix location');
        return;
    }



    /* init */
    global_rotating_matrix.setIdentity();



    /* set up IO */
    // mouse dragging
    var mouse_is_down = false;
    var cache_mouse_x, cache_mouse_y;

    canvas.onmousedown = function(ev) {  // start dragging
        mouse_is_down = true;
        io_free_cam = true;
        cache_mouse_x = ev.clientX;
        cache_mouse_y = ev.clientY;
    };

    canvas.onmousemove = function(ev) {  // during dragging
        if (mouse_is_down) {
            camera_delta_x += (ev.clientX - cache_mouse_x);
            camera_delta_y += (ev.clientY - cache_mouse_y);

            cache_mouse_x = ev.clientX;
            cache_mouse_y = ev.clientY;
        }
    }

    document.onmouseup = function() { mouse_is_down = false; }  // end dragging

    // anime on/off button
    document.getElementById("anime_on").onclick = function () { io_enable_animation=true; }
    document.getElementById("anime_off").onclick = function () { io_enable_animation=false; }

    // zoom slider
    document.getElementById('zoom_slider').addEventListener('mousemove', function() { io_zoom= (this.value)/100+0.5; });
    document.getElementById('rotate_slider').addEventListener('mousemove', function() {
        io_rotate_slider = this.value;
        io_free_cam = false;
    });

    // stand up slider
    document.getElementById('stand_up_slider').addEventListener('mousemove', function() { io_stand_up = this.value; });
    document.getElementById('look_x_slider').addEventListener('mousemove', function() { io_look_x = this.value; });
    document.getElementById('look_y_slider').addEventListener('mousemove', function() { io_look_y= this.value; });

    document.onclick = function(ev) {
        if (ev.shiftKey) {
            shift_click_time = performance.now();
        }
    }



    /* init animal bodies */
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


    /* clouds */
    cloud1 = new Cube();
    cloud1.color = convert_hex_to_rgba(0xFFFFFF);
    clouds.push(cloud1);

    cloud2 = new Cube();
    cloud2.color = convert_hex_to_rgba(0xF4F0F4);
    clouds.push(cloud2);

    cloud3 = new Cube();
    cloud3.color = convert_hex_to_rgba(0xF0F0F0);
    clouds.push(cloud3);


    ground = new Cube();
    ground.color = convert_hex_to_rgba(0x3F9B0B);
    shapes.push(ground);


    /* init particles */
    for (let i=0; i < PARICLE_COUNT; i++) {
        let p = new Horn();
        p.color[0] = Math.random()*0.25+0.75;
        p.color[1] = Math.random()*0.25+0.20;
        p.color[2] = Math.random()*0.25+0.20;
        p.color[3] = 1;

        p.rotate_x = Math.random() * 90 - 45;
        p.rotate_y = Math.random() * 90 - 45;
        p.offset = Math.random();

        particles.push(p);
    }

    /* start */
    program_start_time = performance.now();

    tick();
}


function tick() {
    render_scene();
    requestAnimationFrame(tick);
}



function convert_hex_to_rgba(hex, alpha=1) {  // convert color in hex e.g. 0xFFFFF to rgba e.g. [1,1,1,1]
    let r = (hex & 0xFF0000) / 0xFF0000;  // red
    let g = (hex & 0x00FF00) / 0xFF00;  // green
    let b = (hex & 0x0000FF) / 0xFF;  // blue

    return [r,g,b,alpha];
}




function clear_canvas(rgba=[0,0,0,1]) {
    gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}





function render_scene() {
    let scene_start_time = performance.now();
    let elapsed_time = (performance.now() - program_start_time);

    let special_anime = (performance.now() - shift_click_time < 5000);

    clear_canvas(convert_hex_to_rgba(0xBDEAFF));

    /* pass in global rotating matrix */
    if (io_free_cam) {
        global_rotating_matrix.setRotate(camera_delta_x / PIXEL_PER_DEGREE, 0, -1, 0);
        global_rotating_matrix.rotate(camera_delta_y / PIXEL_PER_DEGREE, -1, 0, 0);
    } else {
        global_rotating_matrix.setRotate(io_rotate_slider, 0, -1, 0);
    }
    global_rotating_matrix.scale(io_zoom, io_zoom, io_zoom);
    global_rotating_matrix.translate(0, -0.1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, global_rotating_matrix.elements);





    /* animal */
    /* body */
    // set coordiante
    body_center.cor.setIdentity();
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


    let ground_distance = io_stand_up / 100;

    /* clouds */
    if (io_enable_animation) {

        cloud1.mat.setTranslate(0.2, -0.9+ground_distance*3, (elapsed_time % 6000)/500-6);
        cloud1.mat.scale(3, 2, 5);

        cloud2.mat.setTranslate(-0.5, -0.8+ground_distance*3, ((elapsed_time+2000) % 6000)/500-6);
        cloud2.mat.scale(3.2, 1.8, 4);


        cloud3.mat.setTranslate(1, -0.8+ground_distance*3, ((elapsed_time+4000) % 6000)/500-6);
        cloud3.mat.scale(2.2, 1.4, 2);


        for (c of clouds) {
            c.render();
        }
    }


    /* ground */
    ground.mat.setTranslate(0, ground_distance - 1.51, 0);
    ground.mat.scale(5, 4, 5);






    // render all shapes
    for (shape of shapes) {
        shape.render();
    }

    // render particles
    if (special_anime) {
        for (p of particles) {
            p.mat.set(head.cor);


            p.mat.translate(0, 0, ((elapsed_time % 500)/500+p.offset)*PARICLE_DISTANCE);

            p.mat.rotate(p.rotate_x, 0, 1, 0);
            p.mat.rotate(p.rotate_y, 1, 0, 0);

            p.mat.translate(0, 0.07, 0.15);
            p.mat.rotate(elapsed_time, 1, 1, 1);
            p.mat.scale(0.1, 0.15, 0.1);
            p.render();
        }
    }



    // update fps values
    let fps = Math.floor(10000/(performance.now()-scene_start_time));
    document.getElementById('fps_indicator').innerText = `fps:${fps}`;
}
