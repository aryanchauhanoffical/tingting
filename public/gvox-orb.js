/* <gvox-orb> — live WebGL recreation of the GvoxAI frosted-glass orb.
   Closed glass sphere with liquid inside: a revolving wavy water surface.
   Transparent background. Attributes: color (hex), speed (number), listening (bool).
   Hover = glow + speed up. listening = voice-assistant pulse. */
(function () {
  if (customElements.get('gvox-orb')) return;

  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  var threePromise = null;
  function loadThree() {
    if (!threePromise) threePromise = import(THREE_URL);
    return threePromise;
  }

  /* Water surface: a disk clipped to the sphere, displaced by revolving waves.
     Fine parallel comb-lines ride on the surface like in the reference video. */
  var SURF_VERT = [
    'uniform float uTime;',
    'uniform float uAmp;',
    'uniform float uRd;',
    'varying vec3 vLocal;',
    'varying float vCrest;',
    'varying float vEdge;',
    'varying float vFront;',
    'void main(){',
    '  vec3 p = position;',
    '  vLocal = position;',
    '  float rad = length(p.xy) / uRd;',
    '  float ang = atan(p.y, p.x + 0.0001);',
    '  float t = uTime;',
    '  float h = 0.0;',
    '  float spiral = ang*2.0 - rad*4.5 + t*1.4;',
    '  h += sin(spiral) * (0.55 + 0.45*sin(t*0.6)) * rad;',
    '  float peak = sin(p.x*1.2 + p.y*0.5 + t*1.1);',
    '  h += sign(peak) * pow(abs(peak), 0.6) * 0.75;',
    '  h += sin(ang*3.0 + rad*6.0 - t*2.1) * 0.3 * rad;',
    '  float chop = sin(p.x*3.4 - p.y*2.6 + t*2.6);',
    '  h += sign(chop) * pow(abs(chop), 0.5) * 0.16;',
    '  float env = 0.3 + 0.7 * smoothstep(1.0, 0.45, rad);',
    '  float d = h * 0.34 * uAmp * env;',
    '  p.z += d;',
    '  vCrest = d;',
    '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
    '  vEdge = length(mv.xy) / 1.5;',
    '  vFront = smoothstep(-7.4, -5.4, mv.z);',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var SURF_FRAG = [
    'precision highp float;',
    'uniform vec3 uColA;',
    'uniform vec3 uColB;',
    'uniform float uGlow;',
    'varying vec3 vLocal;',
    'varying float vCrest;',
    'varying float vEdge;',
    'varying float vFront;',
    'void main(){',
    '  float f = abs(fract(vCrest*17.0) - 0.5) * 2.0;',
    '  float blur = max(smoothstep(0.3, 0.8, vEdge), 1.0 - vFront*0.85);',
    '  float w = mix(0.42, 1.0, blur);',
    '  float crest = smoothstep(0.0, 0.24, vCrest);',
    '  float line = smoothstep(w, w*0.06, f) * (0.3 + crest*0.7);',
    '  vec3 col = mix(uColA, uColB, crest);',
    '  col += uColB * pow(crest, 2.2) * 1.15 * uGlow;',
    '  col += vec3(0.85, 0.95, 1.0) * pow(crest, 6.0) * 0.8 * uGlow;',
    '  float rimFade = 1.0 - smoothstep(0.62, 0.92, vEdge);',
    '  float a = (line*0.95 + 0.22 + crest*0.65) * rimFade * mix(0.3, 1.0, vFront) * uGlow;',
    '  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));',
    '}'
  ].join('\n');

  /* Liquid body: blue volume filling the sphere below the waterline. */
  var BODY_VERT = [
    'varying float vY;',
    'varying float vEdge;',
    'void main(){',
    '  vY = position.y;',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vEdge = length(mv.xy) / 1.5;',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var BODY_FRAG = [
    'precision highp float;',
    'uniform vec3 uColShallow;',
    'uniform vec3 uColDeep;',
    'uniform float uLevel;',
    'uniform float uGlow;',
    'varying float vY;',
    'varying float vEdge;',
    'void main(){',
    '  float fill = smoothstep(uLevel + 0.18, uLevel - 0.5, vY);',
    '  vec3 col = mix(uColShallow, uColDeep, smoothstep(uLevel, -1.3, vY));',
    '  float a = fill * 0.30 * (0.85 + 0.3*(uGlow-1.0));',
    '  a *= 1.0 - smoothstep(0.85, 1.0, vEdge)*0.3;',
    '  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));',
    '}'
  ].join('\n');

  var SHELL_VERT = [
    'varying vec3 vN;',
    'varying vec3 vV;',
    'void main(){',
    '  vN = normalize(normalMatrix * normal);',
    '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
    '  vV = normalize(-mv.xyz);',
    '  gl_Position = projectionMatrix * mv;',
    '}'
  ].join('\n');

  var SHELL_FRAG = [
    'precision highp float;',
    'uniform vec3 uTint;',
    'varying vec3 vN;',
    'varying vec3 vV;',
    'void main(){',
    '  vec3 n = normalize(vN);',
    '  vec3 v = normalize(vV);',
    '  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.0);',
    '  vec3 L = normalize(vec3(0.25, 0.85, 0.55));',
    '  float ndl = max(dot(n, L), 0.0);',
    '  float spec = pow(max(dot(reflect(-L, n), v), 0.0), 55.0);',
    '  vec3 base = vec3(0.985, 0.99, 1.0);',
    '  vec3 rimCol = vec3(0.855, 0.885, 0.94);',
    '  vec3 col = mix(base, rimCol, fres);',
    '  float bottom = smoothstep(0.15, -0.85, n.y);',
    '  col = mix(col, uTint, bottom*0.35);',
    '  col += vec3(1.0) * (spec*0.4 + pow(ndl, 8.0)*0.18);',
    '  float alpha = 0.26 + fres*0.5 + spec*0.2;',
    '  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.97));',
    '}'
  ].join('\n');

  class GvoxOrb extends HTMLElement {
    static get observedAttributes() { return ['color', 'speed', 'listening', 'speaking', 'level']; }

    constructor() {
      super();
      this._color = '#4D9DFF';
      this._speed = 1;
      this._listening = false;
      this._speaking = false;
      this._level = 0;
      this._levelT = 0;
      this._speakT = 0;
      this._hover = false;
      this._hoverT = 0;
      this._listenT = 0;
      this._t = 0;
    }

    attributeChangedCallback(name, _old, val) {
      if (name === 'color' && val) { this._color = val; this._applyColor(); }
      if (name === 'speed') { var s = parseFloat(val); this._speed = isFinite(s) ? s : 1; }
      if (name === 'listening') { this._listening = val !== null && val !== 'false' && val !== '0'; }
      if (name === 'speaking') { this._speaking = val !== null && val !== 'false' && val !== '0'; }
      if (name === 'level') { var l = parseFloat(val); this._level = isFinite(l) ? Math.max(0, Math.min(1, l)) : 0; }
    }

    connectedCallback() {
      if (this._started) return;
      this._started = true;
      if (!this.style.display) this.style.display = 'block';
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      var self = this;
      this.addEventListener('pointerenter', function () { self._hover = true; });
      this.addEventListener('pointerleave', function () { self._hover = false; });
      this._init();
    }

    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._renderer) this._renderer.dispose();
      this.detachAudio();
      this._started = false;
    }

    /* ---- Audio reactivity API ----
       orb.attachStream(mediaStream)  — live mic / WebRTC remote stream
       orb.attachAudio(audioElement)  — an <audio>/<video> element (TTS playback)
       orb.setLevel(v)                — feed your own 0..1 level per frame
       orb.detachAudio()              — stop analysing */
    attachStream(stream) {
      this._setupAnalyser(function (ctx) { return ctx.createMediaStreamSource(stream); }, false);
    }

    attachAudio(el) {
      this._setupAnalyser(function (ctx) { return ctx.createMediaElementSource(el); }, true);
    }

    setLevel(v) {
      this._level = Math.max(0, Math.min(1, +v || 0));
    }

    detachAudio() {
      if (this._audioCtx) { try { this._audioCtx.close(); } catch (e) {} }
      this._audioCtx = null;
      this._analyser = null;
      this._level = 0;
    }

    _setupAnalyser(makeSource, routeToOutput) {
      this.detachAudio();
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = new AC();
      var src = makeSource(ctx);
      var analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;
      src.connect(analyser);
      if (routeToOutput) analyser.connect(ctx.destination);
      this._audioCtx = ctx;
      this._analyser = analyser;
      this._audioBuf = new Uint8Array(analyser.frequencyBinCount);
      if (ctx.state === 'suspended') ctx.resume();
    }

    _readAudioLevel() {
      if (!this._analyser) return null;
      this._analyser.getByteTimeDomainData(this._audioBuf);
      var sum = 0;
      for (var i = 0; i < this._audioBuf.length; i++) {
        var d = (this._audioBuf[i] - 128) / 128;
        sum += d * d;
      }
      var rms = Math.sqrt(sum / this._audioBuf.length);
      return Math.min(1, rms * 4.5);
    }

    _applyColor() {
      if (!this._surfMat || !this._THREE) return;
      var THREE = this._THREE;
      var base = new THREE.Color(this._color);
      var colA = base.clone().offsetHSL(0.0, -0.5, 0.30);
      var colB = base.clone().offsetHSL(-0.03, 0.3, -0.02);
      this._surfMat.uniforms.uColA.value.copy(colA);
      this._surfMat.uniforms.uColB.value.copy(colB);
      this._bodyMat.uniforms.uColShallow.value.copy(base.clone().offsetHSL(0.0, -0.4, 0.30));
      this._bodyMat.uniforms.uColDeep.value.copy(base.clone().offsetHSL(0.02, -0.15, 0.14));
      this._shellMat.uniforms.uTint.value.copy(base.clone().offsetHSL(0.0, -0.25, 0.28));
    }

    async _init() {
      var THREE;
      try { THREE = await loadThree(); } catch (e) { console.error('gvox-orb: three.js failed to load', e); return; }
      if (!this.isConnected) return;
      this._THREE = THREE;

      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
      this.appendChild(renderer.domElement);
      this._renderer = renderer;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0.95, 6.0);
      camera.lookAt(0, 0, 0);

      var group = new THREE.Group();
      group.rotation.z = -0.06;
      scene.add(group);
      var R = 1.5;
      var LEVEL = -0.05;
      var innerR = 1.44;
      var rd = Math.sqrt(innerR * innerR - LEVEL * LEVEL);

      // Liquid body below the waterline
      var bodyMat = new THREE.ShaderMaterial({
        vertexShader: BODY_VERT,
        fragmentShader: BODY_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uLevel: { value: LEVEL },
          uGlow: { value: 1 },
          uColShallow: { value: new THREE.Color('#9cc6ff') },
          uColDeep: { value: new THREE.Color('#4d7df0') }
        }
      });
      var body = new THREE.Mesh(new THREE.SphereGeometry(innerR, 80, 80), bodyMat);
      body.renderOrder = 1;
      group.add(body);
      this._bodyMat = bodyMat;

      // Revolving water surface
      var surfMat = new THREE.ShaderMaterial({
        vertexShader: SURF_VERT,
        fragmentShader: SURF_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 1 },
          uRd: { value: rd },
          uGlow: { value: 1 },
          uColA: { value: new THREE.Color('#5b5bf0') },
          uColB: { value: new THREE.Color('#6fd2ff') }
        }
      });
      var yaw = new THREE.Group();
      yaw.position.y = LEVEL;
      group.add(yaw);
      var surface = new THREE.Mesh(new THREE.RingGeometry(0.03, rd, 220, 48), surfMat);
      surface.rotation.x = -Math.PI / 2;
      surface.renderOrder = 2;
      yaw.add(surface);
      this._surfMat = surfMat;

      // Frosted glass shell
      var shellMat = new THREE.ShaderMaterial({
        vertexShader: SHELL_VERT,
        fragmentShader: SHELL_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uTint: { value: new THREE.Color('#c4d8ff') } }
      });
      var shell = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), shellMat);
      shell.renderOrder = 3;
      group.add(shell);
      this._shellMat = shellMat;

      this._applyColor();

      // Resize
      var self = this;
      function resize() {
        var w = self.clientWidth || 300;
        var h = self.clientHeight || w;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      this._ro = new ResizeObserver(resize);
      this._ro.observe(this);

      // Animation
      var clock = new THREE.Clock();
      function animate() {
        self._raf = requestAnimationFrame(animate);
        var dt = Math.min(clock.getDelta(), 0.05);
        self._hoverT += ((self._hover ? 1 : 0) - self._hoverT) * Math.min(1, dt * 6);
        self._listenT += ((self._listening ? 1 : 0) - self._listenT) * Math.min(1, dt * 5);
        self._speakT += ((self._speaking ? 1 : 0) - self._speakT) * Math.min(1, dt * 5);
        // Audio level: from analyser if attached, else the `level` attr / setLevel()
        var rawLevel = self._readAudioLevel();
        if (rawLevel === null) rawLevel = self._level;
        var rise = rawLevel > self._levelT ? 12 : 4; // fast attack, slow release
        self._levelT += (rawLevel - self._levelT) * Math.min(1, dt * rise);
        var lv = self._levelT;
        var now = performance.now() / 1000;
        // Speaking surge: irregular talking cadence when no real audio is driving it
        var surge = self._speakT * (0.45 + 0.3 * Math.sin(now * 5.1) + 0.18 * Math.sin(now * 8.7 + 1.3) + 0.12 * Math.sin(now * 2.3 + 0.5));
        surge = Math.max(0, surge) + lv * (1.2 + self._speakT * 0.4);
        var speed = self._speed * (1 + self._hoverT * 1.1 + self._listenT * 0.4 + self._speakT * 0.5 + lv * 0.8);
        self._t += dt * speed;
        var t = self._t;
        var pulse = self._listenT * (0.5 + 0.5 * Math.sin(now * Math.PI * 2 * 1.1));
        var glow = 1 + self._hoverT * 0.5 + pulse * 0.6 + surge * 0.55;
        var amp = 1 + self._hoverT * 0.3 + pulse * 0.7 + surge * 0.9;
        surfMat.uniforms.uTime.value = t;
        surfMat.uniforms.uAmp.value = amp;
        surfMat.uniforms.uGlow.value = glow;
        bodyMat.uniforms.uGlow.value = glow;
        // Energy vortex revolves with a dramatic swirl
        yaw.rotation.y = t * 0.55 + Math.sin(t * 0.43) * 0.4;
        yaw.rotation.x = Math.sin(t * 0.31) * 0.07;
        yaw.rotation.z = Math.cos(t * 0.23) * 0.08;
        var s = 1 + self._hoverT * 0.03 + pulse * 0.035 + surge * 0.02;
        group.scale.setScalar(s);
        group.rotation.y = Math.sin(t * 0.12) * 0.12;
        renderer.render(scene, camera);
      }
      animate();
    }
  }

  customElements.define('gvox-orb', GvoxOrb);
})();
