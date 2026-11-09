"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type CatlasLogoProps = {
  className?: string;
};

export function CatlasLogo({ className }: CatlasLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    const root = new THREE.Group();
    const frontMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.36,
      metalness: 0.12,
    });
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: "#263852",
      roughness: 0.3,
      metalness: 0.32,
    });
    const badge = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.15, 0.12),
      [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, edgeMaterial],
    );
    root.add(badge);
    scene.add(root);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/logo.png", () => {
      texture.colorSpace = THREE.SRGBColorSpace;
      frontMaterial.map = texture;
      frontMaterial.needsUpdate = true;
      renderer.render(scene, camera);
      setIsReady(true);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x28354b, 2));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(-2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7db5ff, 1.4);
    rim.position.set(2, 1, -3);
    scene.add(rim);
    camera.position.set(0, 0, 4.3);
    camera.lookAt(0, 0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const resize = () => {
      const width = Math.max(canvas.clientWidth, 1);
      const height = Math.max(canvas.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;
    const animate = (time: number) => {
      if (reducedMotion.matches || document.hidden) {
        renderer.render(scene, camera);
        return;
      }
      root.rotation.y = Math.sin(time * 0.00065) * 0.24;
      root.rotation.x = Math.sin(time * 0.0009) * 0.035;
      root.position.y = Math.sin(time * 0.0014) * 0.035;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      texture.dispose();
      scene.traverse((item) => {
        if (item instanceof THREE.Mesh) {
          item.geometry.dispose();
          if (Array.isArray(item.material)) {
            item.material.forEach((material) => material.dispose());
          } else {
            item.material.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={`catlas-logo ${className ?? ""}`}
    >
      <img
        alt=""
        className={`catlas-logo-fallback ${isReady ? "is-hidden" : ""}`}
        src="/logo.png"
      />
      <canvas className="catlas-logo-canvas" ref={canvasRef} />
    </span>
  );
}
