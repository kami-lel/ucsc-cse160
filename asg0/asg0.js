
const VECTOR_PIXEL_SCALER = 20;

function main() {
}

function drawVector(v, color) {
    /**
     * draw the vector with a scale of 20
     * @param v a Vector3 to be drawn
     * @param color string color, e.g. "red"
     */

    // get <canvas>
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // calc origin
    let origin_x = Math.floor(canvas.width / 2);
    let origin_y = Math.floor(canvas.height/ 2);

    // calc end point
    let end_x = origin_x + v.elements[0] * VECTOR_PIXEL_SCALER;
    let end_y = origin_y - v.elements[1] * VECTOR_PIXEL_SCALER;

    // get context & draw the line
    const ctxt = canvas.getContext('2d');  // create the context
    ctxt.beginPath();
    ctxt.moveTo(origin_x, origin_y);
    ctxt.lineTo(end_x, end_y);
    ctxt.strokeStyle = color;  // set color
    ctxt.stroke();
    ctxt.closePath();
}

function handleDrawEvent() {
    const canvas = document.getElementById("canvas");
    const ctxt = canvas.getContext("2d");

    // clear canvas
    ctxt.clearRect(0, 0, canvas.width, canvas.height);

    // draw v1
    let v1x = document.getElementById("v1x").value;
    let v1y = document.getElementById("v1y").value;
    const v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, "red");

    // draw v2
    let v2x = document.getElementById("v2x").value;
    let v2y = document.getElementById("v2y").value;
    const v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, "blue");


    // draw another vector
    const v3 = new Vector3();
    v3.set(v1);
    const v4 = new Vector3();
    v4.set(v2);
    let scalar = document.getElementById("scalar").value;

    switch (document.getElementById("op_select").value) {
        case "add":
            v3.add(v2);
            drawVector(v3, "green");
            break;

        case "sub":
            v3.sub(v2);
            drawVector(v3, "green");
            break;

        case "mul":
            v3.mul(scalar);
            v4.mul(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;

        case "div":
            v3.div(scalar);
            v4.div(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;

        case "magnitude":
            console.log("Magnitude v1: " + String(v1.magnitude()));
            console.log("Magnitude v2: " + String(v2.magnitude()));
            break;

        case "normalize":
            v3.normalize();
            v4.normalize();
            drawVector(v3, "green");
            drawVector(v4, "green");
            break;

        case "angle_between":
            console.log("Angle: " + String(angleBetween(v1, v2)));
            break;

        case "area":
            console.log("Area of the triangle: " + areaTriangle(v1, v2));
            break;

    }
}

function angleBetween(v1, v2) {
    /*
     * @return angle b/t v1 & v2, in degree
     */

    let cos_value = Vector3.dot(v1, v2) / v1.magnitude() / v2.magnitude();
    return Math.acos(cos_value) * 180 / Math.PI;
}

function areaTriangle(v1, v2) {
    const v3 = Vector3.cross(v1, v2);
    return v3.magnitude() / 2;
}
