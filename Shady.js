var Shady = function() {};

Shady.prototype = {

};

Shady.SHADER_TYPE = {
  FRAGMENT: 1,
  VERTEX: 2
};

Shady.RawShader = function(shaderString) {
  this.shaderStr = shaderString;
  this.glShader = null;
  this.type = null;
  this.gl = null;
};
Shady.RawShader.prototype = {
  load: function(gl) {
    this.gl = gl;
    if (this.type === Shady.SHADER_TYPE.FRAGMENT) {
      this.glShader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (this.type === Shady.SHADER_TYPE.VERTEX) {
      this.glShader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      console.warn("Cannot load invalid shader type");
      return this;
    }

    gl.shaderSource(this.glShader, this.shaderStr);
    gl.compileShader(this.glShader);

    if (!this.glCompileStatus()) {
      console.warn(this.glInfoLog());
    }

    return this;
  },

  glCompileStatus: function() {
    return this.gl.getShaderParameter(this.glShader, this.gl.COMPILE_STATUS);
  },

  glInfoLog: function() {
    return this.gl.getShaderInfoLog(this.glShader);
  }
};

Shady.ShaderProgram = function(fragmentShader, vertexShader) {
  this.fragment = fragmentShader;
  this.vertex = vertexShader;
  this.glProgram = null;
  this.gl = null;
};
Shady.ShaderProgram.prototype = {
  load: function(gl) {
    this.gl = gl;
    this.glProgram = gl.createProgram();

    if (!this.fragment.gl) this.fragment.load(gl);
    if (!this.vertex.gl) this.vertex.load(gl);

    gl.attachShader(this.glProgram, this.fragment.glShader);
    gl.attachShader(this.glProgram, this.vertex.glShader);

    gl.linkProgram(this.glProgram);

    if (!this.linkStatus()) {
      console.warn("Shader initialization failed.");
      return this;
    }

    this.gl.useProgram(this.glProgram);
  },

  linkStatus: function() {
    return gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
  }
};

Shady.FragmentShader = function(shaderString) {
  Shady.RawShader.call(this, shaderString);
  this.type = Shady.SHADER_TYPE.FRAGMENT;
};
Shady.FragmentShader.prototype = Object.create(Shady.RawShader.prototype);

Shady.VertexShader = function(shaderString) {
  Shady.RawShader.call(this, shaderString);
  this.type = Shady.SHADER_TYPE.VERTEX;
};
Shady.VertexShader.prototype = Object.create(Shady.RawShader.prototype);

Shady.Canvas = function(canvasElement) {
  this.canvas = canvasElement;
  this.width = canvasElement.width;
  this.height = canvasElement.height;

  this.gl = null;
  this.isInitialized = false;

  this.clearColor = new vec4.fromValues(0, 0, 0, 1);
};

Shady.Canvas.prototype = {
  initGL: function() {
    try {
      this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}

    if (!this.gl) {
      throw "WebGL not supported in this environment."
    }

    this.isInitialized = true;
  },

  initDefaults: function() {
    this.gl.enable(gl.DEPTH_TEST);
  },

  clear: function() {
    gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
  }
};