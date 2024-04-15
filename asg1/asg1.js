// Vertex shader program
var VSHADER_SOURCE =
    `attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`;

// Fragment shader program
var FSHADER_SOURCE =
    `precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// set up global var
let canvas;
let gl;
let a_Postion;
let u_FragColor;
let u_Size;


function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preservedDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}


function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return ([x,y]);
}


const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


function turn_seg_slider(on) {
    let slider = document.getElementById('slider_p')
    if (on) {
        slider.style.display = "block";
    } else {
        slider.style.display = "none";
    }
}

let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selected_cirlce_segment = 10;

function addActionsForHtmlUI() {
    document.getElementById("green").onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; }
    document.getElementById("red").onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; }
    document.getElementById("blue").onclick = function () { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; }
    document.getElementById("white").onclick = function () { g_selectedColor = [1.0, 1.0, 1.0, 1.0]; }
    document.getElementById("cyan").onclick = function () { g_selectedColor = [0.0, 1.0, 1.0, 1.0]; }
    document.getElementById("magenta").onclick = function () { g_selectedColor = [1.0, 0.0, 1.0, 1.0]; }
    document.getElementById("yellow").onclick = function () { g_selectedColor = [1.0, 1.0, 0.0, 1.0]; }


    document.getElementById("clear").onclick = function () { g_shapeList = []; renderAllShapes(); }
    document.getElementById("example").onclick = draw_space_ship;

    document.getElementById("point").onclick = function () { g_selectedType= POINT; turn_seg_slider(false);}
    document.getElementById("triangle").onclick = function () { g_selectedType = TRIANGLE; turn_seg_slider(false);}
    document.getElementById("circle").onclick = function () { g_selectedType = CIRCLE; turn_seg_slider(true);}

    document.getElementById('red_slider').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('green_slider').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blue_slider').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
    document.getElementById('size_slider').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('circle_seg_cnt').addEventListener('mouseup', function() { g_selected_cirlce_segment = this.value; });
}


function sentTextToHTML(text, html_id) {
    let html_element = document.getElementById(html_id);
    if (!html_element) {
        console.log(`Failed to get ${html_id} from HTML`);
        return;
    }

    html_element.innerHTML = text;
}


function renderAllShapes() {
    let start_time = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapeList.length;
    for(var i = 0; i < len; i++) {
          g_shapeList[i].render();
    }

    let duration = performance.now() - start_time;
    let ms = Math.floor(duration);
    let fps = Math.floor(10000/duration);
    sentTextToHTML(`numdot:${len} ms:${ms} fps:${fps}`, 'numdot');
}

var g_shapeList = [];



function click(ev) {
    // extract WebGL coordinate
    [x,y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else if (g_selectedType == CIRCLE) {
        point = new Circle();
        point.segment_cnt = g_selected_cirlce_segment;
    } else {
        point = new Point();
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapeList.push(point);

    renderAllShapes();
}



function get_dark_green() {
    let r = 0.042 + Math.random() / 10;
    let g = 0.167 + Math.random() / 2;
    let b = 0.101 + Math.random() / 10;

    return [r, g, b, 1.0];
}

function get_dark_brown() {
    return [0.349, 0.250, 0.199, 1];
}

function draw_space_ship() {

    let t;
    let pos = [];
    let len;


    /* main tree log*/
    pos = [];

    pos.push([-0.065, -0.600]);
    pos.push([-0.065, -0.720]);
    pos.push([-0.065, -0.840]);
    pos.push([-0.065, -0.960]);

    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = pos[i];
        t.color = get_dark_brown();
        t.size = 25;
        t.direction = 0;
        g_shapeList.push(t);
    }

    pos = [];

    pos.push([ 0.065, -0.480]);
    pos.push([ 0.065, -0.600]);
    pos.push([ 0.065, -0.720]);
    pos.push([ 0.065, -0.840]);
    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = pos[i];
        t.color = get_dark_brown();
        t.size = 25;
        t.direction = 2;
        g_shapeList.push(t);
    }

    /* main tree branch */
    pos = [];
    pos.push([ 0.000, 0.480]);

    pos.push([ 0.115,  0.360]);
    pos.push([-0.115,  0.360]);

    pos.push([ 0.000, 0.240]);
    pos.push([ 0.230, 0.240]);
    pos.push([-0.230, 0.240]);

    pos.push([ 0.115,  0.120]);
    pos.push([-0.115,  0.120]);
    pos.push([ 0.345,  0.120]);
    pos.push([-0.345,  0.120]);

    pos.push([0.000, 0.000]);  // center
    pos.push([0.230, 0.000]);
    pos.push([-0.230, 0.000]);

    pos.push([ 0.115, -0.120]);
    pos.push([-0.115, -0.120]);
    pos.push([ 0.345, -0.120]);
    pos.push([-0.345, -0.120]);

    pos.push([0.000 , -0.240]);
    pos.push([0.230 , -0.240]);
    pos.push([-0.230, -0.240]);

    pos.push([ 0.115, -0.360]);
    pos.push([-0.115, -0.360]);
    pos.push([ 0.345, -0.360]);
    pos.push([-0.345, -0.360]);

    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = pos[i];
        t.color = get_dark_green();
        t.size = 25;
        t.direction = 1;
        g_shapeList.push(t);
    }

    draw_small_tree(0.7, 0.812);
    draw_small_tree(-0.63, 0.726);
    draw_small_tree(-0.83, -0.520);


    renderAllShapes();
}


function draw_small_tree(x, y) {
    let t;
    let pos = [];
    let len;

    pos = [];

    pos.push([-0.025, -0.260]);
    pos.push([-0.025, -0.300]);
    pos.push([-0.025, -0.340]);

    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = [pos[i][0]+x, pos[i][1]+y];
        t.color = get_dark_brown();
        t.size = 10;
        t.direction = 0;
        g_shapeList.push(t);
    }

    pos = [];

    pos.push([ 0.025, -0.215]);
    pos.push([ 0.025, -0.255]);
    pos.push([ 0.025, -0.295]);

    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = [pos[i][0]+x, pos[i][1]+y];
        t.color = get_dark_brown();
        t.size = 10;
        t.direction = 2;
        g_shapeList.push(t);
    }

    pos = [];

    pos.push([ 0.000,  0.000]);
    pos.push([ 0.000, -0.075]);
    pos.push([ 0.000, -0.150]);

    len = pos.length;
    for(var i = 0; i < len; i++) {
        t = new Triangle();
        t.position = [pos[i][0]+x, pos[i][1]+y];
        t.color = get_dark_green();
        t.size = 15;
        t.direction = 1;
        g_shapeList.push(t);
    }
}



function main() {

    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev); } };

    // clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify the color for clearing <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

    turn_seg_slider(false);
}
