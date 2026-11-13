"use client";

import { useEffect, useRef } from "react";
import type { Material } from "three";
import { getWebGL2Context } from "@/lib/webgl";

export function Hero3DAnimation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const staticScene = reducedMotion || connection?.saveData === true;
    let cancelled = false;
    let dispose = () => {};

    async function start() {
      const THREE = await import("three");
      if (cancelled || !host) return;

      const canvas = document.createElement("canvas");
      const context = getWebGL2Context(canvas);

      if (!context) {
        return;
      }

      const scene = new THREE.Scene();
      scene.background = null;
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        context,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x697386, 2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
      keyLight.position.set(-4, 7, 8);
      scene.add(keyLight);

      const blue = new THREE.MeshStandardMaterial({
        color: "#1d4ed8",
        roughness: 0.45,
      });
      const ink = new THREE.MeshStandardMaterial({
        color: "#252a35",
        roughness: 0.6,
      });
      const cream = new THREE.MeshStandardMaterial({
        color: "#f5f3ef",
        roughness: 0.75,
      });
      const red = new THREE.MeshStandardMaterial({
        color: "#ef4444",
        roughness: 0.5,
      });
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 18),
        new THREE.MeshStandardMaterial({
          color: "#e9edf4",
          roughness: 1,
        }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.35;
      scene.add(ground);

      const building = new THREE.Group();
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.6, 1.2),
        cream,
      );
      block.position.y = 0;
      building.add(block);
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.3, 0.85, 4),
        blue,
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 1.65;
      building.add(roof);
      for (const x of [-1, 0, 1]) {
        const column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 1.8, 12),
          ink,
        );
        column.position.set(x, -0.05, 0.66);
        building.add(column);
      }
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.95, 0.08),
        ink,
      );
      door.position.set(0, -0.82, 0.66);
      building.add(door);
      building.position.set(3.4, 0, -3.5);
      building.scale.setScalar(0.08);
      scene.add(building);

      const figure = new THREE.Group();
      const limb = (
        length: number,
        radius: number,
        material: Material,
      ) => new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 10),
        material,
      );
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 18, 14),
        blue,
      );
      head.position.y = 1.15;
      figure.add(head);
      const torso = limb(0.9, 0.1, blue);
      torso.position.y = 0.55;
      figure.add(torso);
      const armLeft = limb(0.66, 0.07, blue);
      armLeft.position.set(-0.36, 0.57, 0.05);
      armLeft.rotation.z = -0.55;
      figure.add(armLeft);
      const armRight = limb(0.66, 0.07, blue);
      armRight.position.set(0.36, 0.57, 0.05);
      armRight.rotation.z = 0.55;
      figure.add(armRight);
      const legLeft = limb(0.72, 0.08, blue);
      legLeft.position.set(-0.17, -0.25, 0);
      figure.add(legLeft);
      const legRight = limb(0.72, 0.08, blue);
      legRight.position.set(0.17, -0.25, 0);
      figure.add(legRight);
      figure.position.set(-2, 0, 0);
      scene.add(figure);

      const phone = new THREE.Group();
      const phoneBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.55, 0.12),
        ink,
      );
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.78, 1.36),
        new THREE.MeshBasicMaterial({ color: "#f8fafc" }),
      );
      screen.position.z = 0.067;
      phone.add(phoneBody, screen);
      const noticePanel = new THREE.Mesh(
        new THREE.PlaneGeometry(0.68, 0.64),
        new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      );
      noticePanel.position.set(0, -0.02, 0.078);
      phone.add(noticePanel);
      const mascot = new THREE.Group();
      const catHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 12),
        blue,
      );
      catHead.scale.set(1.05, 0.95, 0.4);
      catHead.position.set(0, 0.12, 0.09);
      mascot.add(catHead);
      for (const x of [-0.1, 0.1]) {
        const ear = new THREE.Mesh(
          new THREE.ConeGeometry(0.055, 0.14, 4),
          blue,
        );
        ear.position.set(x, 0.25, 0.09);
        mascot.add(ear);
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.014, 8, 6),
          ink,
        );
        eye.position.set(x * 0.65, 0.14, 0.16);
        mascot.add(eye);
      }
      mascot.position.set(0, 0, 0.08);
      phone.add(mascot);
      const screenRoute = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.018, 6, 32, Math.PI * 1.45),
        red,
      );
      screenRoute.position.set(0, -0.08, 0.075);
      screenRoute.rotation.z = -0.4;
      phone.add(screenRoute);
      const mapDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 12, 10),
        blue,
      );
      mapDot.position.set(-0.2, -0.42, 0.09);
      phone.add(mapDot);
      phone.position.set(0.5, 0.7, 0.4);
      phone.rotation.y = -0.08;
      figure.add(phone);

      const route = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, -1.28, 0.1),
            new THREE.Vector3(-1, -1.27, -1),
            new THREE.Vector3(0.6, -1.27, -2),
            new THREE.Vector3(3.4, -1.27, -2.7),
          ]),
          36,
          0.025,
          8,
          false,
        ),
        red,
      );
      scene.add(route);

      camera.position.set(0, 0.2, 10);
      camera.lookAt(0, 0, 0);

      const resize = () => {
        const width = Math.max(host.clientWidth, 1);
        const height = Math.max(host.clientHeight, 1);
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let visible = true;
      let frame = 0;
      let elapsed = 0;
      let previous = 0;
      const loop = (now: number) => {
        frame = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        if (previous) elapsed += Math.min(now - previous, 50);
        previous = now;
        const time = staticScene || reduced.matches
          ? 16_500
          : elapsed % 19_000;
        const progress = (time / 19_000) * Math.PI * 2;
        const walk = time >= 6_800 && time < 9_800;
        const endScene = time >= 15_100;
        const phoneRise = Math.min(time / 800, 1);
        const mapProgress = Math.max(
          0,
          Math.min((time - 3_400) / 2_600, 1),
        );

        building.scale.setScalar(
          time < 6_800
            ? 0.08
            : Math.min(1, 0.08 + (time - 6_800) / 3_000),
        );
        figure.position.x = endScene
          ? -2.5
          : walk
          ? -2 + ((time - 6_800) / 3_000) * 2
          : -2;
        legLeft.rotation.x = walk ? Math.sin(progress * 18) * 0.55 : 0;
        legRight.rotation.x = walk ? -Math.sin(progress * 18) * 0.55 : 0;
        armLeft.rotation.x = walk ? -Math.sin(progress * 18) * 0.35 : 0;
        armRight.rotation.x = walk ? Math.sin(progress * 18) * 0.35 : 0;
        armRight.rotation.z = endScene ? -2.4 : 0.55;
        figure.position.y = walk
          ? Math.abs(Math.sin(progress * 18)) * 0.08
          : Math.sin(now * 0.002) * 0.025;
        phone.visible = time < 15_000;
        phone.scale.setScalar(time < 3_400 ? 1.2 : 0.72);
        noticePanel.visible = time >= 12_100 && time < 14_300;
        mascot.visible = noticePanel.visible;
        screenRoute.visible = !noticePanel.visible;
        mapDot.visible = !noticePanel.visible;
        phone.position.y = time < 800
          ? -1.25 + phoneRise * 1.95
          : time > 12_000 && time < 15_000
          ? 1.05
          : 0.7;
        phone.rotation.z = time >= 10_300 && time < 11_300
          ? Math.sin(time * 0.04) * 0.055
          : Math.sin(now * 0.0012) * 0.008;
        mapDot.position.set(
          -0.2 + mapProgress * 0.42,
          -0.42 + mapProgress * 0.56,
          0.09,
        );
        head.rotation.z = walk
          ? Math.sin(progress * 18) * 0.04
          : Math.sin(now * 0.001) * 0.015;
        const closePhone = time < 3_400 ||
          (time >= 11_300 && time < 14_300);
        const zoomOutProgress = Math.max(
          0,
          Math.min((time - 3_400) / 2_600, 1),
        );
        camera.position.z = closePhone
          ? 4.7
          : 6.5 + zoomOutProgress * 3.5;
        camera.position.x = closePhone ? -1.45 : 0;
        camera.lookAt(closePhone ? -1.45 : 0, 0, 0);
        renderer.render(scene, camera);
        if (staticScene || reduced.matches) {
          cancelAnimationFrame(frame);
        }
      };

      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      visibilityObserver.observe(host);
      resize();
      frame = requestAnimationFrame(loop);

      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibilityObserver.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    }

    start().catch(() => undefined);

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <div
      aria-label="A 3D campus navigation animation"
      className="hero-story hero-story-3d"
      ref={hostRef}
      role="img"
    />
  );
}
