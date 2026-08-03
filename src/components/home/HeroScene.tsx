'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Hero object: a polished metal knot lit by an accent rim.
 *
 * What separates this from a Three.js demo is the setup around the geometry,
 * not the geometry itself:
 *
 *  - ACESFilmic tone mapping and sRGB output. Without them everything reads
 *    flat and washed.
 *  - A half-float render target, so highlights can exceed 1.0 and bloom has
 *    real energy to pick up instead of blurring clipped white.
 *  - An environment map. `metalness: 1` with nothing to reflect is a black
 *    blob; RoomEnvironment gives reflections without shipping an HDRI file.
 *  - Damped motion. Nothing is assigned directly from the pointer; every value
 *    eases toward a target so the object never snaps.
 */

const DAMPING = 0.075;

/** Matches the stage panel behind the canvas in Hero.tsx. */
const STAGE_COLOR = '#0e0e10';

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      // No WebGL: leave the reserved box empty. The page still reads fine.
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    // The object sits on its own dark stage rather than on the page. Bloom and
    // ACES tone mapping both operate on the cleared background, so a
    // transparent canvas would tint the page behind it into a visible box.
    renderer.setClearColor(STAGE_COLOR, 1);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Reflections without an asset download.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;
    pmrem.dispose();

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.TorusKnotGeometry(1.15, 0.34, 260, 40);
    const material = new THREE.MeshPhysicalMaterial({
      color: '#43434b',
      metalness: 1,
      roughness: 0.28,
      // Just enough thin-film to catch the light. Higher values pushed the
      // whole object green, which fights the vermilion the brand runs on.
      iridescence: 0.12,
      iridescenceIOR: 1.35,
      envMapIntensity: 0.55,
    });
    const knot = new THREE.Mesh(geometry, material);
    group.add(knot);

    // The accent light is what bloom picks up, so the glow carries the brand
    // colour rather than a generic white bleed.
    const accentLight = new THREE.PointLight('#d14424', 90, 26);
    accentLight.position.set(2.8, 1.9, 2.4);
    scene.add(accentLight);

    // Neutral counter-light so the unlit side reads as metal, not as a hole.
    const fillLight = new THREE.PointLight('#ffffff', 26, 26);
    fillLight.position.set(-3.2, -1.8, 2.2);
    scene.add(fillLight);

    scene.add(new THREE.AmbientLight('#ffffff', 0.12));

    /* Post-processing ------------------------------------------------------ */
    const hdrTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
    });
    const composer = new EffectComposer(renderer, hdrTarget);
    composer.setPixelRatio(pixelRatio);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.45, 0.78);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    /* Theme ---------------------------------------------------------------- */
    const applyTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      const accent = (styles.getPropertyValue('--accent') || '#d14424').trim();

      accentLight.color.set(accent);
      // The stage is dark in both themes, so the object barely changes. Only
      // the exposure moves, to keep it from glaring on a light page.
      renderer.toneMappingExposure = isDark ? 1.15 : 1.0;
      bloom.strength = isDark ? 0.62 : 0.5;
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    /* Interaction ---------------------------------------------------------- */
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
      composer.setSize(w, h);
      bloom.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    /* Frame loop ----------------------------------------------------------- */
    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      current.x += (target.x - current.x) * DAMPING;
      current.y += (target.y - current.y) * DAMPING;

      group.rotation.y = elapsed * 0.16 + current.x * 0.5;
      group.rotation.x = Math.sin(elapsed * 0.22) * 0.12 + current.y * 0.35;
      group.position.y = Math.sin(elapsed * 0.5) * 0.06;

      composer.render();
      frame = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      group.rotation.set(0.2, 0.8, 0);
      composer.render();
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
      hdrTarget.dispose();
      composer.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="h-full w-full" />;
}
