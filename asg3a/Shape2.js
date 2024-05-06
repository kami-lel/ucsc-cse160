
function drawTriangle3DUV(vertices, uv_arg) {
    let n = 3; // The number of vertices

    /* vertext buffer */
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_vertex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);   // write data to buffer
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);  // assign buffer to a_Position
    gl.enableVertexAttribArray(a_Position);  // enable

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_uv);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_arg), gl.DYNAMIC_DRAW);   // write data to buffer
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);  // assign buffer to a_Position
    gl.enableVertexAttribArray(a_UV);  // enable

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}



function draw_plane(v) {
    drawTriangle3DUV([
        v[0], v[1], v[2],
        v[3], v[4], v[5],
        v[6], v[7], v[8]
    ],[
        0,1,
        1,1,
        1,0
    ])

    drawTriangle3DUV([
        v[0], v[1], v[2],
        v[6], v[7], v[8],
        v[9], v[10], v[11],
    ],[
        0,1,
        1,0,
        0,0
    ])
}

let unit = 0.5;


class CubeNew extends Shape {
    constructor() {
        super();
        this.texture_index = -2;  // default to missing texture
    }

    render() {
        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);
        // pass in texture selector
        console.log(this.texture_index);
        gl.uniform1i(u_WhichTexture, this.texture_index)

        // draw front & back
        draw_plane([
            -unit,  unit, -unit,
             unit,  unit, -unit,
             unit, -unit, -unit,
            -unit, -unit, -unit,
        ])
        draw_plane([
             unit,  unit,  unit,
            -unit,  unit,  unit,
            -unit, -unit,  unit,
             unit, -unit,  unit,
        ])

        // draw left & right
        draw_plane([
            -unit,  unit,  unit,
            -unit,  unit, -unit,
            -unit, -unit, -unit,
            -unit, -unit,  unit,
        ])
        draw_plane([
             unit,  unit, -unit,
             unit,  unit,  unit,
             unit, -unit,  unit,
             unit, -unit, -unit,
        ])

        // draw top & bottom
        draw_plane([
            -unit,  unit,  unit,
             unit,  unit,  unit,
             unit,  unit, -unit,
            -unit,  unit, -unit,
        ])

        draw_plane([
            -unit, -unit, -unit,
             unit, -unit, -unit,
             unit, -unit,  unit,
            -unit, -unit,  unit,
        ])
    }
}
