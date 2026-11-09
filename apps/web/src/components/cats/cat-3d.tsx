"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Cat3DProps = {
  mood: "happy" | "crying" | "searching" | "calm";
  size: number;
  className?: string;
};

function sphere(
  material: THREE.Material,
  scale: [number, number, number],
  position: [number, number, number],
) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 24, 18),
    material,
  );
  mesh.scale.set(...scale);
  mesh.position.set(...position);
  return mesh;
}

export function Cat3D({ mood, size, className }: Cat3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
    const fur = new THREE.MeshStandardMaterial({
      color: "#f2f0ec",
      roughness: 0.42,
    });
    const innerEar = new THREE.MeshStandardMaterial({
      color: "#4385ed",
      roughness: 0.5,
    });
    const face = new THREE.MeshStandardMaterial({
      color: "#343844",
      roughness: 0.3,
    });
    const blue = new THREE.MeshStandardMaterial({
      color: "#3c8df2",
      roughness: 0.24,
      metalness: 0.08,
    });
    const rig = new THREE.Group();
    const body = sphere(fur, [0.46, 0.35, 0.48], [0, -0.2, 0]);
    const head = new THREE.Group();
    head.position.set(0, 0.27, 0.25);
    head.add(sphere(fur, [0.4, 0.37, 0.31], [0, 0, 0.04]));

    for (const x of [-0.25, 0.25]) {
      const ear = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.38, 5),
        fur,
      );
      ear.position.set(x, 0.34, 0.02);
      ear.rotation.z = x < 0 ? 0.18 : -0.18;
      head.add(ear);
      const inner = new THREE.Mesh(
        new THREE.ConeGeometry(0.085, 0.22, 5),
        innerEar,
      );
      inner.position.set(x, 0.36, 0.145);
      inner.rotation.z = x < 0 ? 0.18 : -0.18;
      head.add(inner);
    }

    const eyes = new THREE.MeshStandardMaterial({
      color: mood === "calm" ? "#b78b32" : "#24262c",
      roughness: 0.2,
    });
    const eyeMeshes: THREE.Mesh[] = [];
    for (const x of [-0.145, 0.145]) {
      const eye = sphere(
        eyes,
        [0.042, mood === "calm" ? 0.09 : 0.07, 0.025],
        [x, mood === "crying" ? 0.01 : -0.02, 0.335],
      );
      head.add(eye);
      if (mood === "calm") {
        eye.scale.y = 0.018;
      }
      eyeMeshes.push(eye);
    }

    const nose = sphere(face, [0.055, 0.036, 0.03], [0, -0.13, 0.36]);
    head.add(nose);
    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.085, -0.19, 0.36),
      new THREE.Vector3(0, mood === "crying" ? -0.25 : -0.11, 0.37),
      new THREE.Vector3(0.085, -0.19, 0.36),
    );
    head.add(new THREE.Mesh(
      new THREE.TubeGeometry(mouthCurve, 12, 0.012, 6, false),
      face,
    ));
    rig.add(body, head);

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.37, -0.22, -0.2),
      new THREE.Vector3(-0.65, -0.03, -0.22),
      new THREE.Vector3(-0.7, 0.3, -0.2),
      new THREE.Vector3(-0.53, 0.5, -0.16),
    ]);
    const tail = new THREE.Mesh(
      new THREE.TubeGeometry(tailCurve, 24, 0.075, 10, false),
      fur,
    );
    rig.add(tail);

    const tears: THREE.Mesh[] = [];
    if (mood === "crying") {
      for (const x of [-0.15, 0.15]) {
        const tear = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 12, 10),
          blue,
        );
        tear.scale.y = 1.6;
        tear.position.set(x, -0.14, 0.37);
        head.add(tear);
        tears.push(tear);
      }
    }

    if (mood === "searching") {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.34, 10),
        face,
      );
      handle.position.set(0.48, -0.42, 0.34);
      handle.rotation.z = -0.7;
      const glass = new THREE.Mesh(
        new THREE.TorusGeometry(0.17, 0.025, 10, 24),
        blue,
      );
      glass.position.set(0.62, -0.2, 0.37);
      rig.add(handle, glass);
    }

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.62, 32),
      new THREE.MeshBasicMaterial({
        color: 0x17181c,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.62;
    scene.add(rig, shadow);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x596071, 2));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-2, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8bbdff, 1.1);
    rim.position.set(3, 2, -3);
    scene.add(rim);
    camera.position.set(0, 0.05, 4.4);
    camera.lookAt(0, 0.02, 0);
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
      rig.position.y = mood === "happy"
        ? Math.max(0, Math.sin(time * 0.004) * 0.12)
        : Math.sin(time * 0.0018) * 0.018;
      rig.rotation.y = mood === "searching"
        ? Math.sin(time * 0.0015) * 0.18
        : Math.sin(time * 0.0008) * 0.035;
      rig.rotation.z = mood === "crying"
        ? Math.sin(time * 0.001) * 0.025
        : 0;
      if (mood === "calm") {
        const blink = Math.max(
          0.018,
          Math.abs(Math.sin(time * 0.00062)) > 0.985 ? 0.018 : 0.07,
        );
        eyeMeshes.forEach((eye) => {
          eye.scale.y = blink;
        });
      }
      tail.rotation.x = Math.sin(time * (mood === "happy" ? 0.004 : 0.002))
        * (mood === "happy" ? 0.3 : 0.14);
      tears.forEach((tear, index) => {
        tear.position.y = -0.14 - ((time * 0.0005 + index * 0.5) % 0.2);
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
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
  }, [mood]);

  return (
    <canvas
      aria-hidden="true"
      className={`cat-3d ${className ?? ""}`}
      height={size}
      ref={canvasRef}
      style={{ width: size, height: size }}
      width={size}
    />
  );
}
