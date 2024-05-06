

VSHADER_SOURCE =`
precision mediump float;

attribute vec2 a_Position;
attribute vec3 a_Color;

varying vec3 v_Color;

void main() {
    v_Color = a_Color;
    gl_Position = vec4(a_Position, 0, 1);
}
`;

FSHADER_SOURCE = `
    precision mediump float;
    varying vec3 v_Color;

    void main() {
        gl_FragColor = vec4(v_Color, 1);
    }
    `

/* declare global var */
let canvas;
let gl;







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

    // === VERTEX BUFFER SETUP IN JAVASCRIPT
    buffer_vertex = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_vertex);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0,  0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    let vertices = new Float32Array([
        -1, -1,
        0, 1,
        1, -1,

        0, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3 );

}