
let CAMERA_FOV = 60;
let CAMERA_NEAR = 0.1;
let CAMERA_FAR = 100;
let CAMERA_SPEED = 0.25;
let CAMERA_PAN_DEGREE = 15;



class Camera {

    constructor() {

        this.eye = new Vector3([0, 0.5, 0]);
        this.at = new Vector3([0, 0.5, -1]);
        this.up = new Vector3([0, 1, 0]);

        // view mat
        this.view_mat = new Matrix4();
        this.update_view_mat();

        // projection mat
        let screen_aspect_ratio = canvas.width/canvas.height;
        this.proj_mat = new Matrix4();
        this.proj_mat.setPerspective(CAMERA_FOV, screen_aspect_ratio, CAMERA_NEAR, CAMERA_FAR);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.proj_mat.elements);



    }

    update_view_mat() {
        this.view_mat.setLookAt(
                this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                this.at.elements[0], this.at.elements[1], this.at.elements[2],
                this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    move_forward() {
        let delta = new Vector3();
        delta.set(this.at);
        delta.sub(this.eye);
        delta.normalize();
        delta.mul(CAMERA_SPEED);

        this.eye.add(delta);
        this.at.add(delta);

        this.update_view_mat();
    }

    move_backward() {
        let delta = new Vector3();
        delta.set(this.eye);
        delta.sub(this.at);
        delta.normalize();
        delta.mul(CAMERA_SPEED);

        this.eye.add(delta);
        this.at.add(delta);

        this.update_view_mat();
    }

    move_left() {
        let delta = new Vector3();
        delta.set(this.eye);
        delta.sub(this.at);

        delta = Vector3.cross(delta, this.up);
        delta.normalize();
        delta.mul(CAMERA_SPEED)

        this.eye.add(delta);
        this.at.add(delta);

        this.update_view_mat();
    }

    move_right() {
        let delta = new Vector3();
        delta.set(this.at);
        delta.sub(this.eye);

        delta = Vector3.cross(delta, this.up);
        delta.normalize();
        delta.mul(CAMERA_SPEED)

        this.eye.add(delta);
        this.at.add(delta);
        this.at.add(delta);

        this.update_view_mat();
    }

    pan_left() {
        let delta = new Vector3();
        delta.set(this.at);
        delta.sub(this.eye);

        let rotate_matrix = new Matrix4();
        rotate_matrix.setRotate(CAMERA_PAN_DEGREE,
                this.up.elements[0], this.up.elements[1], this.up.elements[2])

        let change = rotate_matrix.multiplyVector3(delta);

        this.at.set(this.eye);
        this.at.add(change);
        this.update_view_mat();
    }

    pan_right() {
        let delta = new Vector3();
        delta.set(this.at);
        delta.sub(this.eye);

        let rotate_matrix = new Matrix4();
        rotate_matrix.setRotate(-CAMERA_PAN_DEGREE,
                this.up.elements[0], this.up.elements[1], this.up.elements[2])

        let change = rotate_matrix.multiplyVector3(delta);

        this.at.set(this.eye);
        this.at.add(change);
        this.update_view_mat();

    }

    pan(degree) {

        let delta = new Vector3();
        delta.set(this.at);
        delta.sub(this.eye);

        let rotate_matrix = new Matrix4();
        rotate_matrix.setRotate(degree,
                this.up.elements[0], this.up.elements[1], this.up.elements[2])

        let change = rotate_matrix.multiplyVector3(delta);

        this.at.set(this.eye);
        this.at.add(change);
        this.update_view_mat();
    }

    lookupdown(degree) {
        let front = new Vector3();
        front.set(this.at);
        front.sub(this.eye);
        front.normalize();

        let right = new Vector3();
        right = Vector3.cross(front, this.up)
        right.normalize();

        let rotate_matrix = new Matrix4();
        rotate_matrix.setRotate(degree, right.elements[0], right.elements[1], right.elements[2]);

        let change = rotate_matrix.multiplyVector3(front);
        this.at.set(this.eye);
        this.at.add(change);


        this.update_view_mat();
    }

    click() {
        let l = this.at_l();
        let i = this.at_i();
        let j = this.at_j();

        let t = maps[l][i][j]
        if (t > 0) {  // destroy
            t = 0;
        } else {
            t = 1;
        }
        maps[l][i][j] = t;
    }

    at_l(){
        return Math.floor(this.at.elements[1]);
    }

    at_i() {
        return Math.floor(this.at.elements[0]) + map_offset;
    }

    at_j() {
        return Math.floor(this.at.elements[2]) + map_offset;
    }




}

