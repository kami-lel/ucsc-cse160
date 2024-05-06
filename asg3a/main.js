/* global constant */
let PIXEL_PER_DEGREE = 5;   // convert drag pixel count to degree
IMG_PATHS = ["./grass_block_side.png", "./stone.png", "./dirt_path_top.png"]





/* declare global var */
let canvas;
let gl;
let global_rotating_matrix = new Matrix4();
let program_start_time;
let elapsed_time;
let world = {};
let camera;
let map_offset;



/* buffer */
let buffer_vertex;
let buffer_uv;



/* passed in var */
let a_Postion;
let a_UV;

let u_FragColor;
let u_ModelMatrix;
let u_Sample0;
let u_Sample1;
let u_Sample2;
let u_WhichTexture;



/* io */
let io_mouse_is_down = false;
let io_mouse_x_cache, io_mouse_y_cache;
// todo
let io_stand_up = 1;
let io_enable_animation = true;
let io_look_x = 0;
let io_look_y = 0;


let test_block;













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





    /* create buffer */
    // vertex
    buffer_vertex = gl.createBuffer();
    if (!buffer_vertex) {
        console.log('error: can not create vertex buffer object');
        return
    }

    // uv
    buffer_uv = gl.createBuffer();
    if (!buffer_uv) {
        console.log('error: can not create uv buffer object');
        return
    }





    /* connect GLSL variables */
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('error: can not get a_Position location');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_Position < 0) {
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

    u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
    if (!u_WhichTexture) {
        console.log('error: can not get u_WhichTexture location');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('error: can not get u_ProjectionMatrix location');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('error: can not get u_ViewMatrix location');
        return;
    }


    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler0) {
        console.log('error: can not get u_Sampler0 location');
        return;
    }
    if (!u_Sampler1) {
        console.log('error: can not get u_Sampler1 location');
        return;
    }
    if (!u_Sampler2) {
        console.log('error: can not get u_Sampler2 location');
        return;
    }





    /* init texture */
    let image0 = new Image();
    image0.onload = function() { set_texture2glsl(image0, 0); }
    image0.src = IMG_PATHS[0];

    let image1 = new Image();
    image1.onload = function() { set_texture2glsl(image1, 1); }
    image1.src = IMG_PATHS[1];

    let image2 = new Image();
    image2.onload = function() { set_texture2glsl(image2, 2); }
    image2.src = IMG_PATHS[2];





    /* inits */
    init_dragon();

    let ground = new Cube();
    ground.color = convert_hex_to_rgba(0x77b74e);
    ground.mat.setScale(160, 0.1, 160);
    world.ground= ground;

    let sky = new Cube();
    sky.color = convert_hex_to_rgba(0xBDEAFF)
    sky.mat.setScale(500, 500, 500);
    world.sky = sky;  // todo sky have fake lighting


    //init_dragon();
    test_block = new CubeNew();


    /* set up camera control */
    camera = new Camera();
    document.addEventListener('keydown', function(ev) {
        if (ev.key == 'w') {
            camera.move_forward();
        } else if (ev.key == 's') {
            camera.move_backward();
        } else if (ev.key == 'a') {
            camera.move_left();
        } else if (ev.key == 'd') {
            camera.move_right();
        } else if (ev.key == 'q') {
            camera.pan_left();
        } else if (ev.key == 'e') {
            camera.pan_right();
        } else if (ev.key == 'c') {
            camera.click();
        } else if (ev.key == 'i') {
            camera.lookupdown(10);
        } else if (ev.key == 'k') {
            camera.lookupdown(-10);
        }





    })

    // mouse dragging
    io_mouse_is_down = false;
    canvas.onmousedown = function(ev) {  // start dragging
        io_mouse_is_down = true;
        io_mouse_x_cache = ev.clientX;
        io_mouse_y_cache = ev.clientY;
    };

    canvas.onmousemove = function(ev) {  // during dragging
        if (io_mouse_is_down) {
            //camera_delta_x += (ev.clientX - io_mouse_x_cache);
            //camera_delta_y += (ev.clientY - io_mouse_y_cache);
            let drag_x = (ev.clientX - io_mouse_x_cache) / 10;
            let drag_y = (ev.clientY - io_mouse_y_cache) / 10;

            io_mouse_x_cache = ev.clientX;
            io_mouse_y_cache = ev.clientY;
            camera.pan(drag_x);
            camera.lookupdown(drag_y);
        }
    }

    document.onmouseup = function() { io_mouse_is_down = false; }  // end dragging




    /* start */
    program_start_time = performance.now();
    global_rotating_matrix.setIdentity();

    tick();
}













function render_scene() {
    clear_canvas(convert_hex_to_rgba(0x0));


    render_dragon();

    gl.uniformMatrix4fv(u_ProjectionMatrix , false, camera.proj_mat.elements);
    gl.uniformMatrix4fv(u_ViewMatrix , false, camera.view_mat.elements);


    // render world
    world.ground.render();
    world.sky.render();


    // create blocks
    world.blocks = [];
    let map_size = MAPS.length;
    map_offset = map_size / 2;
    for (let x = 0; x < map_size; x++) {
        for (let z = 0; z < map_size; z++) {
            let v = MAPS[x][z];
            let t = TEXTURES[x][z];
            if (v > 0) {

                let x_cor = x - map_offset;
                let z_cor = z - map_offset;
                let y_cor = 0.5;

                for (let y = 0; y < v; y++) {
                    let block = new CubeNew();
                    block.mat.setTranslate(x_cor, y_cor, z_cor);
                    block.texture_index = t;
                    block.render();

                    y_cor += 1;
                }

            }
        }
    }

    // render world
//    for (block of world.blocks) {
//        block.render();
//    }


}







function clear_canvas(rgba=[0,0,0,1]) {
    gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}




function tick() {
    let scene_start_time = performance.now();
    elapsed_time = (performance.now() - program_start_time);

    render_scene();

    // update fps values
    let fps = Math.floor(10000/(performance.now()-scene_start_time));
    document.getElementById('fps_indicator').innerText = `fps:${fps}`;

    requestAnimationFrame(tick);
}