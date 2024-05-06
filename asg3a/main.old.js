// Vertex shader program
let VSHADER_SOURCE = `
    precision mediump float;

    attribute vec4 a_Position;
    attribute vec2 a_UV;

    varying vec2 v_UV;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;

    void main() {
        // gl_Position = 
        // u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;


        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

        v_UV = a_UV;
    }
    `;




// Fragment shader program
let FSHADER_SOURCE = `
    precision mediump float;

    uniform vec4 u_FragColor;

    varying vec2 v_UV;

    void main() {
        //gl_FragColor = vec4(v_UV, 1.0, 1.0);
        gl_FragColor = u_FragColor;
    }
    `;














/* global constant */
let PIXEL_PER_DEGREE = 5;   // convert drag pixel count to degree





/* declare global var */
let canvas;
let gl;
let time_program_start;
let global_rotating_matrix = new Matrix4();
let shapes = [];
let scren_aspect_ratio;



/* passed-in var */
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;



/* buffers  */
let buffer_vertex
let buffer_uv



/* io var */
let io_mouse_is_down;
let io_mouse_x_cache, io_mouse_y_cache;
let camera_delta_x;
let camera_delta_y;












function main() {
    /* set up */
    // canvas
    canvas = document.getElementById('webgl');
    scren_aspect_ratio = canvas.width/canvas.height;

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





    /* connect GLSL variables */
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('error: can not get a_Position location');
        return;
    }


    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('error: can not get a_UV location');
        return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('error: can not get u_FragColor location');
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





    /* create buffer objects */
    buffer_vertex = gl.createBuffer();
    if (!buffer_vertex) {
        console.log('error: can not create buffer_vertex');
        return
    }

    buffer_uv = gl.createBuffer();
    if (!buffer_uv) {
        console.log('error: can not create buffer_uv');
        return
    }




    /* IO */
    // mouse dragging
    io_mouse_is_down = false;

    canvas.onmousedown = function(ev) {  // start dragging
        io_mouse_is_down = true;
        io_mouse_x_cache = ev.clientX;
        io_mouse_y_cache = ev.clientY;
    };

    canvas.onmousemove = function(ev) {  // during dragging
        if (io_mouse_is_down) {
            camera_delta_x += (ev.clientX - io_mouse_x_cache);
            camera_delta_y += (ev.clientY - io_mouse_y_cache);

            io_mouse_x_cache = ev.clientX;
            io_mouse_y_cache = ev.clientY;
        }
    }

    document.onmouseup = function() { io_mouse_is_down = false; }  // end dragging





    /* init bodies */
    var body_center = new Cube();
    body_center.color = convert_hex_to_rgba(0x840800);
    shapes.push(body_center);




    /* start */
    time_program_start = performance.now();
    global_rotating_matrix.setIdentity();
    tick()
}










function clear_canvas(rgba=[0,0,0,1]) {
    gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}












function convert_hex_to_rgba(hex, alpha=1) {  // convert color in hex e.g. 0xFFFFF to rgba e.g. [1,1,1,1]
    let r = (hex & 0xFF0000) / 0xFF0000;  // red
    let g = (hex & 0x00FF00) / 0xFF00;  // green
    let b = (hex & 0x0000FF) / 0xFF;  // blue

    return [r,g,b,alpha];
}













function render_scene() {
    clear_canvas(convert_hex_to_rgba(0xBDEAFF));

    global_rotating_matrix.setIdentity();  // todo
    /* pass in global rotating matrix */
    global_rotating_matrix.setRotate(camera_delta_x / PIXEL_PER_DEGREE, 0, -1, 0);
    global_rotating_matrix.rotate(camera_delta_y / PIXEL_PER_DEGREE, -1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, global_rotating_matrix.elements);



    // render all shapes
    for (shape of shapes) {
        shape.render();
    }
}













function tick() {
    let scene_start_time = performance.now();

    render_scene()

    // update fps values
    let fps = Math.floor(10000/(performance.now()-scene_start_time));
    document.getElementById('fps_indicator').innerText = `fps:${fps}`;

    requestAnimationFrame(tick);
}


function drawTriangle3D(vertices) {
    let n = 3; // The number of vertices

    // set up buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_vertex);
    // write data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign buffer to a_Position
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);  // enable

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}