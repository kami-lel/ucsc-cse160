/**
 * With codesandbox we import our functions from the files they live in
 * rather than import that file in the HTML file like we usually do
 *
 * ALSO NOTE that there is NO main function being called.
 * index.js IS your main function and the code written in it is run
 * on page load.
 */
// import "./styles.css";
// import { initShaders } from "../lib/cuon-utils";
// import { Matrix4, Vector3 } from "../lib/cuon-matrix-cse160";

// HelloCube.js (c) 2012 matsuda
// Vertex shader program
// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec2 aPosition;
  uniform mat4 uModelMatrix;
  void main() {
    gl_Position = uModelMatrix * vec4(aPosition, 0.0, 1.0);
  }
  `;

// Fragment shader program
const FSHADER_SOURCE = `
  #ifdef GL_ES
  precision mediump float;
  #endif
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
  `;

// Retrieve <canvas> element
var canvas = document.getElementById("webgl");

// Get the rendering context for WebGL
var gl = canvas.getContext("webgl");
if (!gl) {
  console.log("Failed to get the rendering context for WebGL");
}

// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log("Failed to intialize shaders.");
}

// Set clear color
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 1.a
const verticies = new Float32Array([
    0, 1,      -1, 0,       1, 0
]);


const vertex_buf = gl.createBuffer();
if (!vertex_buf) { console.log('fail to crate buffer'); }

// 1.c
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buf);
gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

// 1.d
const aPosition_p = gl.getAttribLocation(gl.program, 'aPosition');
if (aPosition_p < 0) { console.log('fail to find aPosition pointer'); }
// 1.e
gl.vertexAttribPointer(aPosition_p, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition_p);

function draw_spaceship(gl, matrix) {
    const uModelMatrix_p = gl.getUniformLocation(gl.program, 'uModelMatrix');
    const m_cache = new Matrix4();

    // head
    m_cache.set(matrix);
    m_cache.translate(0.55, 0.55, 0);
    let scale_factor = 0.3;
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(-45, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // body top
    m_cache.set(matrix);
    scale_factor = 0.424264;
    m_cache.translate(0.33, 0.33, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // body bottom
    m_cache.set(matrix);
    m_cache.translate(0.33, 0.33, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(180, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // tail top
    m_cache.set(matrix);
    scale_factor = 0.15;
    m_cache.translate(0.035, 0.035, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // tail bottom
    m_cache.set(matrix);
    m_cache.translate(0.035, 0.035, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(180, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // left flame near
    m_cache.set(matrix);
    m_cache.translate(-0.115, 0.048, 0);
    scale_factor = 0.2;
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(45, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // left flame far
    m_cache.set(matrix);
    m_cache.translate(-0.405, 0.05, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(225, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // right flame near
    m_cache.set(matrix);
    m_cache.translate(0.055, -0.108, 0);
    scale_factor = 0.2;
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(225, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // righ flame far
    m_cache.set(matrix);
    m_cache.translate(0.05, -0.40, 0);
    m_cache.scale(scale_factor, scale_factor, scale_factor);
    m_cache.rotate(45, 0, 0, 1);
    gl.uniformMatrix4fv(uModelMatrix_p, false, m_cache.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}


// 1.f
const model_matrix = new Matrix4();


// largest
let scale_factor = 0.7;
model_matrix.setTranslate(-0.15, 0.15, 0);
model_matrix.scale(scale_factor, scale_factor, scale_factor);
model_matrix.rotate(40, 0, 0, 1);
draw_spaceship(gl, model_matrix);

// medium
model_matrix.setTranslate(0.5, -0.6, 0);
scale_factor = 0.5;
model_matrix.scale(scale_factor, scale_factor, scale_factor);
model_matrix.rotate(60, 0, 0, 1);
draw_spaceship(gl, model_matrix);

// small
model_matrix.setTranslate(-0.45, -0.55, 0);
scale_factor = 0.3;
model_matrix.scale(scale_factor, scale_factor, scale_factor);
model_matrix.rotate(20, 0, 0, 1);
draw_spaceship(gl, model_matrix);


