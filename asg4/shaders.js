/* Vertex shader program */
let VSHADER_SOURCE = `
    precision mediump float;

    attribute vec4 a_Position;
    attribute vec2 a_UV;

    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    varying vec2 v_UV;

    void main() {
        v_UV = a_UV;
        gl_Position = u_ProjectionMatrix*u_ViewMatrix*u_ModelMatrix*a_Position;
    }
    `;












/* Fragment shader program */
let FSHADER_SOURCE = `
    precision mediump float;

    varying vec2 v_UV;

    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_WhichTexture;

    void main() {

        if (u_WhichTexture == -3) {  // uv debug color
            gl_FragColor = vec4(v_UV, 0, 1);

        } else if (u_WhichTexture == -2) {  // missing texture, purple
            gl_FragColor = vec4(1, 0, 1, 1);

        } else if (u_WhichTexture == -1) {  // frag color
            gl_FragColor = u_FragColor;

        } else if (u_WhichTexture == 0) {  // texture 0
            gl_FragColor = texture2D(u_Sampler0, v_UV);

        } else if (u_WhichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);

        } else if (u_WhichTexture == 2) {
            gl_FragColor = texture2D(u_Sampler2, v_UV);

        } else {  // error, show red
            gl_FragColor = vec4(1, 0, 0, 1);
        }
    }
    `;
;