// export default class Circle {

class Circle {
  constructor() {
    this.type = "circle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.segments = 10;

      this.buffer = null;
      this.vertices = null;
  }

    render(gl) {
        // pass color
        let [r, g, b, a] = this.color;
        const uFragColor = gl.getUniformLocation(gl.program, "uFragColor");
        // Pass the color of a point to uFragColor variable
        gl.uniform4f(uFragColor, r, g, b, a);

        // grab position
        const aPosition = gl.getAttribLocation(gl.program, "aPosition");

        if (this.vertices == null) {
            this.generate_vertices();
        }

        // Create a buffer object
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();

            if (!this.buffer) {
                console.log("Failed to create the buffer object");
                return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        // Assign the buffer object to aPosition variable
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to aPosition variable
        gl.enableVertexAttribArray(aPosition);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/2);
    }

    generate_vertices() {
        let [x, y] = this.position;
        // Draw
        var d = this.size / 200.0; // delta

        let v = [];
        let angleStep = 360 / this.segments;

        for (var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [x, y];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [
                Math.cos((angle1 * Math.PI) / 180) * d,
                Math.sin((angle1 * Math.PI) / 180) * d
            ];
            let vec2 = [
                Math.cos((angle2 * Math.PI) / 180) * d,
                Math.sin((angle2 * Math.PI) / 180) * d
            ];
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            v.push(x, y, pt1[0], pt1[1], pt2[0], pt2[1]);
        }

        this.vertices = new Float32Array(v);
    }

}
