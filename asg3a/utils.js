

function convert_hex_to_rgba(hex, alpha=1) {  // convert color in hex e.g. 0xFFFFF to rgba e.g. [1,1,1,1]
    let r = (hex & 0xFF0000) / 0xFF0000;  // red
    let g = (hex & 0x00FF00) / 0xFF00;  // green
    let b = (hex & 0x0000FF) / 0xFF;  // blue

    return [r,g,b,alpha];
}







function set_texture2glsl(image, i) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

    // Enable texture unit0
    if (i==0) {
        gl.activeTexture(gl.TEXTURE0);
    } else if (i==1) {
        gl.activeTexture(gl.TEXTURE1);
    } else if (i==2) {
        gl.activeTexture(gl.TEXTURE2);
    }

    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    switch (i) {
    case 0:
        gl.uniform1i(u_Sampler0, 0);
        break;
    case 1:
        gl.uniform1i(u_Sampler1, 1);
        break;
    case 2:
        gl.uniform1i(u_Sampler2, 2);
        break;
    } 

    console.log('finished load texture ' + i)
}
