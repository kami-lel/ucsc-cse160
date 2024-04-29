




function drawTriangle3D(vertices) {
    let n = 3; // The number of vertices

    // set up buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // write data to buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign buffer to a_Position
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);  // enable

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
}



class Shape {
    constructor() {
        this.color = [1, 1, 1, 1];
        this.cor = new Matrix4();
        this.mat = new Matrix4();
    }

    init_mat() {
        this.mat.set(this.cor);
    }
}


var s = 0.1;  // scale


class Cube extends Shape {
    constructor() {
        super();
        this.type = 'cube';
    }

    render() {
        // pass in color
        let rgba = this.color;

        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);

        // draw front
        let lighting = 0.9;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s, -s,     -s,  s, -s,      s,  s, -s]);
        drawTriangle3D([-s, -s, -s,      s, -s, -s,      s,  s, -s]);

        // draw back
        lighting = 0.7;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  s,     -s,  s,  s,      s,  s,  s]);
        drawTriangle3D([-s, -s,  s,      s, -s,  s,      s,  s,  s]);

        // draw left
        lighting = 0.95;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s, -s,     -s,  s, -s,     -s,  s,  s]);
        drawTriangle3D([-s, -s, -s,     -s, -s,  s,     -s,  s,  s]);

        // draw right
        lighting = 0.85;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ s, -s, -s,      s,  s, -s,      s,  s,  s]);
        drawTriangle3D([ s, -s, -s,      s, -s,  s,      s,  s,  s]);

        // draw top
        lighting = 1;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s,  s, -s,      s,  s, -s,      s,  s,  s]);
        drawTriangle3D([-s,  s, -s,     -s,  s,  s,      s,  s,  s]);

        // draw bottom
        lighting = 0.5;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s, -s,      s, -s, -s,      s, -s,  s]);
        drawTriangle3D([-s, -s, -s,     -s, -s,  s,      s, -s,  s]);
    }
}





class CubeNC extends Shape {
    constructor() {
        super();
        this.type = 'cube_nc';
    }

    render() {
        // pass in color
        let rgba = this.color;

        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);

        // draw front
        let lighting = 0.9;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  0,     -s,  s,  0,      s,  s,  0]);
        drawTriangle3D([-s, -s,  0,      s, -s,  0,      s,  s,  0]);

        // draw back
        lighting = 0.7;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  s,     -s,  s,  s,      s,  s,  s]);
        drawTriangle3D([-s, -s,  s,      s, -s,  s,      s,  s,  s]);

        // draw left
        lighting = 0.95;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  0,     -s,  s,  0,     -s,  s,  s]);
        drawTriangle3D([-s, -s,  0,     -s, -s,  s,     -s,  s,  s]);

        // draw right
        lighting = 0.85;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ s, -s,  0,      s,  s,  0,      s,  s,  s]);
        drawTriangle3D([ s, -s,  0,      s, -s,  s,      s,  s,  s]);

        // draw top
        lighting = 1;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s,  s,  0,      s,  s,  0,      s,  s,  s]);
        drawTriangle3D([-s,  s,  0,     -s,  s,  s,      s,  s,  s]);

        // draw bottom
        lighting = 0.5;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  0,      s, -s,  0,      s, -s,  s]);
        drawTriangle3D([-s, -s,  0,     -s, -s,  s,      s, -s,  s]);
    }
}






class TrianglePrism extends Shape {
    constructor() {
        super();
        this.type = 'triangle_prism';
    }

    render() {
        // pass in color
        let rgba = this.color;

        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);

        // draw bottom
        let lighting = 0.8;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, -s,  0,     -s, -s,  s,      s, -s,  s]);
        drawTriangle3D([-s, -s,  0,      s, -s,  0,      s, -s,  s]);

        // draw left
        lighting = 1;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([  0,  s,  0,      0,  s,  s,      -s, -s,  0]);
        drawTriangle3D([ -s, -s,  s,      0,  s,  s,      -s, -s,  0]);

        // draw right
        lighting = 0.9;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([  0,  s,  0,      0,  s,  s,       s, -s,  0]);
        drawTriangle3D([  s, -s,  s,      0,  s,  s,       s, -s,  0]);

    }
}






class Horn extends Shape {
    constructor() {
        super();
        this.type = 'horn';
    }

    render() {
        // pass in color
        let rgba = this.color;

        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);

        let lighting = 1;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  s,  0,     -s,  0, -s,      s,  0, -s]);  // front

        lighting = 0.8;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  s,  0,     -s,  0,  s,      s,  0,  s]);  // back

        lighting = 0.9;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  s,  0,     -s,  0, -s,     -s,  0,  s]);  // left

        lighting = 0.85;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  s,  0,      s,  0, -s,      s,  0,  s]);  // right

        // bottom
        lighting = 0.7;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([-s, 0,  s,       -s, 0, -s,      s,  0, -s]);
        drawTriangle3D([-s, 0,  s,        s, 0,  s,      s,  0, -s]);

    }
}






class Wing extends Shape {
    constructor() {
        super();
        this.type = 'wing';
    }

    render() {
        // pass in color
        let rgba = this.color;

        // pass in model mat
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.mat.elements);

        let lighting = 1;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  0,  0,       -s, 2*s,  s,      s, 2*s, s]);  // up short

        lighting = 0.95;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  3*s,  0,       -s, 2*s,  s,      s, 2*s, s]);  // up long

        lighting = 0.85;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  0,  0,       -s, 2*s,  -s,     s, 2*s, -s]);  // down short

        lighting = 0.8;
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  3*s,  0,       -s, 2*s,  -s,      s, 2*s, -s]);  // down long

        lighting = 0.5;  //sides
        gl.uniform4f(u_FragColor, rgba[0]*lighting, rgba[1]*lighting, rgba[2]*lighting, rgba[3]);
        drawTriangle3D([ 0,  0,  0,       s, 2*s, -s,      s, 2*s, s]);
        drawTriangle3D([ 0,  0,  0,       -s, 2*s,  -s,    -s, 2*s, s]);
        drawTriangle3D([ 0,  3*s,  0,        s, 2*s, -s,      s, 2*s, s]);
        drawTriangle3D([ 0,  3*s,  0,       -s, 2*s,  -s,     -s, 2*s, s]);

    }
}
