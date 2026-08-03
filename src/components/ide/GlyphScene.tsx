'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A 3D form drawn out of code glyphs.
 *
 * Every particle is a character sampled from an atlas painted at runtime on a
 * canvas, so nothing is downloaded and the glyph set can be edited in one
 * string. Each particle cycles through the atlas on its own offset, which
 * gives the shape the churn of a terminal without any of it being a video.
 *
 * The particles sit on a torus knot rather than in a cloud: a closed path
 * keeps the silhouette readable while the characters themselves stay noisy.
 */

const GLYPHS = '01{}[]()<>/\\;:=+-*&|!?#$%@_ABCDEFabcdef01<>{}[]/*+=;:';
const GRID = 8; // 8x8 atlas
const CELL = 64; // px per cell
const PARTICLE_COUNT = 2600;

function buildAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = GRID * CELL;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${CELL * 0.72}px "IBM Plex Mono", ui-monospace, monospace`;

  for (let i = 0; i < GRID * GRID; i++) {
    const ch = GLYPHS[i % GLYPHS.length];
    const col = i % GRID;
    const row = Math.floor(i / GRID);
    ctx.fillText(ch, col * CELL + CELL / 2, row * CELL + CELL / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function knotPoint(t: number, target: THREE.Vector3) {
  const u = t * Math.PI * 4;
  const v = t * Math.PI * 6;
  const r = 1.5 + 0.52 * Math.cos(v);
  return target.set(r * Math.cos(u), r * Math.sin(u), 0.52 * Math.sin(v));
}

const VERT = /* glsl */ `
  attribute float aGlyph;
  attribute float aSize;
  attribute vec3 aOffset;
  attribute float aProgress;
  attribute float aPhase;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vGlyph;
  varying float vProgress;
  varying float vFade;

  void main() {
    vec3 drift = aOffset * (1.0 + 0.16 * sin(uTime * 0.8 + aPhase));
    vec4 mv = modelViewMatrix * vec4(position + drift, 1.0);
    gl_Position = projectionMatrix * mv;

    vFade = 1.0 - clamp((-mv.z - 2.0) / 7.0, 0.0, 1.0) * 0.82;
    // Each particle steps through the atlas at its own rate, so the surface
    // churns like a scrolling buffer instead of blinking in unison.
    vGlyph = mod(aGlyph + floor(uTime * 5.0 + aPhase * 3.0), 64.0);
    vProgress = aProgress;

    gl_PointSize = aSize * uPixelRatio * (74.0 / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uFlow;
  uniform float uOpacity;

  varying float vGlyph;
  varying float vProgress;
  varying float vFade;

  void main() {
    float idx = floor(vGlyph);
    float col = mod(idx, 8.0);
    float row = floor(idx / 8.0);
    vec2 uv = vec2(
      (col + gl_PointCoord.x) / 8.0,
      1.0 - (row + gl_PointCoord.y) / 8.0
    );

    vec4 tex = texture2D(uAtlas, uv);
    if (tex.a < 0.12) discard;

    // A bright band travels the path, so the eye follows the loop.
    float band = fract(vProgress - uFlow);
    float lead = smoothstep(0.0, 0.14, band) * (1.0 - smoothstep(0.14, 0.42, band));
    vec3 color = mix(uColorA, uColorB, clamp(lead * 1.6, 0.0, 1.0));

    gl_FragColor = vec4(color, tex.a * vFade * uOpacity);
  }
`;

export default function GlyphScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6;

    const group = new THREE.Group();
    scene.add(group);

    /* Geometry -------------------------------------------------------------- */
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const offsets = new Float32Array(PARTICLE_COUNT * 3);
    const progress = new Float32Array(PARTICLE_COUNT);
    const glyphs = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const p = new THREE.Vector3();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      knotPoint(t, p);
      positions.set([p.x, p.y, p.z], i * 3);

      const theta = Math.random() * Math.PI * 2;
      const radius = 0.36 * Math.pow(Math.random(), 0.5);
      offsets.set(
        [
          Math.cos(theta) * radius,
          Math.sin(theta) * radius,
          (Math.random() - 0.5) * 0.5,
        ],
        i * 3,
      );

      progress[i] = t;
      glyphs[i] = Math.floor(Math.random() * 64);
      sizes[i] = 0.9 + Math.random() * 0.9;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
    geometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1));
    geometry.setAttribute('aGlyph', new THREE.BufferAttribute(glyphs, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const atlas = buildAtlas();
    const uniforms = {
      uTime: { value: 0 },
      uFlow: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uAtlas: { value: atlas },
      uColorA: { value: new THREE.Color('#2f6f45') },
      uColorB: { value: new THREE.Color('#4ade80') },
      uOpacity: { value: 1 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });

    group.add(new THREE.Points(geometry, material));

    /* Theme ----------------------------------------------------------------- */
    const applyTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      const accent = (styles.getPropertyValue('--ide-accent') || '#4ade80').trim();
      const dim = (styles.getPropertyValue('--ide-gutter') || '#3a463d').trim();

      uniforms.uColorA.value.set(dim);
      uniforms.uColorB.value.set(accent);
      // Additive only works on a dark ground; on a light IDE theme it washes
      // out to nothing, so the glyphs go back to normal blending.
      material.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      uniforms.uOpacity.value = isDark ? 1 : 0.9;
      material.needsUpdate = true;
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    /* Interaction ----------------------------------------------------------- */
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const handlePointer = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    if (!reduceMotion) {
      mount.addEventListener('pointermove', handlePointer);
      mount.addEventListener('pointerleave', handleLeave);
    }

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    /* Frame loop ------------------------------------------------------------ */
    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      uniforms.uFlow.value = (t * 0.11) % 1;

      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      group.rotation.y = t * 0.14 + current.x * 0.45;
      group.rotation.x = Math.sin(t * 0.2) * 0.14 + current.y * 0.3;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      uniforms.uTime.value = 1.4;
      uniforms.uFlow.value = 0.2;
      group.rotation.set(0.2, 0.7, 0);
      renderer.render(scene, camera);
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      resizeObserver.disconnect();
      mount.removeEventListener('pointermove', handlePointer);
      mount.removeEventListener('pointerleave', handleLeave);
      geometry.dispose();
      material.dispose();
      atlas.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="h-full w-full" />;
}
