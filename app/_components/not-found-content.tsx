"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFoundContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const targetRefs = useRef<Array<HTMLElement | null>>([]);
  const [destroyedTargets, setDestroyedTargets] = useState<boolean[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!canvas || !content) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const launchButton = content.querySelector<HTMLElement>(".not-found-launch-button");
    const launchBounds = launchButton?.getBoundingClientRect();
    const rocket = {
      x: Math.min(window.innerWidth - 32, (launchBounds?.right ?? window.innerWidth / 2) + 46),
      y: launchBounds ? launchBounds.top + launchBounds.height / 2 : window.innerHeight / 2,
      vx: 0,
      vy: 0,
      angle: 0,
    };
    const projectiles: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
    const pressedKeys = new Set<string>();
    const rocks = Array.from({ length: 14 }, (_, index) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 5 + Math.random() * 13,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.012,
      sides: 5 + (index % 3),
      active: true,
      respawn: 0,
    }));
    let animationFrame = 0;
    let previousTime = performance.now();

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const fire = () => {
      const angle = rocket.angle;
      projectiles.push({
        x: rocket.x + Math.cos(angle) * 18,
        y: rocket.y + Math.sin(angle) * 18,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        life: 90,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
        event.preventDefault();
        pressedKeys.add(event.code);
      }
      if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) fire();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.code);
    };

    const hitTarget = (x: number, y: number) => {
      const targetIndex = targetRefs.current.findIndex((target) => {
        if (!target || target.classList.contains("not-found-target-destroyed")) return false;
        const bounds = target.getBoundingClientRect();
        return x >= bounds.left - 8 && x <= bounds.right + 8 && y >= bounds.top - 8 && y <= bounds.bottom + 8;
      });

      if (targetIndex < 0) return false;
      setDestroyedTargets((current) => {
        const next = [...current];
        next[targetIndex] = true;
        return next;
      });
      return true;
    };

    const drawRocket = () => {
      context.save();
      context.translate(rocket.x, rocket.y);
      context.rotate(rocket.angle + Math.PI / 2);
      context.fillStyle = "#ec3013";
      context.beginPath();
      context.moveTo(0, -14);
      context.lineTo(8, 10);
      context.lineTo(0, 7);
      context.lineTo(-8, 10);
      context.closePath();
      context.fill();
      context.fillStyle = "#201e1d";
      context.fillRect(-3, 4, 6, 8);
      context.restore();
    };

    const drawRocks = (delta: number) => {
      context.fillStyle = "rgba(32, 30, 29, 0.2)";
      context.strokeStyle = "rgba(32, 30, 29, 0.38)";
      context.lineWidth = 1;
      rocks.forEach((rock) => {
        if (!rock.active) {
          rock.respawn -= delta;
          if (rock.respawn <= 0) {
            rock.x = Math.random() * window.innerWidth;
            rock.y = Math.random() * window.innerHeight;
            rock.active = true;
          }
          return;
        }
        rock.x += rock.vx * delta;
        rock.y += rock.vy * delta;
        rock.rotation += rock.rotationSpeed * delta;
        if (rock.x < -rock.radius * 2) rock.x = window.innerWidth + rock.radius;
        if (rock.x > window.innerWidth + rock.radius * 2) rock.x = -rock.radius;
        if (rock.y < -rock.radius * 2) rock.y = window.innerHeight + rock.radius;
        if (rock.y > window.innerHeight + rock.radius * 2) rock.y = -rock.radius;

        context.save();
        context.translate(rock.x, rock.y);
        context.rotate(rock.rotation);
        context.beginPath();
        for (let point = 0; point < rock.sides; point += 1) {
          const angle = (point / rock.sides) * Math.PI * 2;
          const pointRadius = rock.radius * (0.75 + ((point * 13) % 5) / 10);
          const x = Math.cos(angle) * pointRadius;
          const y = Math.sin(angle) * pointRadius;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
      });
    };

    const createRockBurst = (rock: (typeof rocks)[number]) => {
      for (let index = 0; index < 8; index += 1) {
        const angle = (index / 8) * Math.PI * 2;
        particles.push({
          x: rock.x,
          y: rock.y,
          vx: Math.cos(angle) * (1 + Math.random() * 1.5),
          vy: Math.sin(angle) * (1 + Math.random() * 1.5),
          life: 28,
          size: 1 + Math.random() * 2,
        });
      }
      rock.active = false;
      rock.respawn = 90 + Math.random() * 100;
    };

    const hitRock = (x: number, y: number) => {
      const rock = rocks.find((candidate) => {
        if (!candidate.active) return false;
        return Math.hypot(candidate.x - x, candidate.y - y) <= candidate.radius + 4;
      });
      if (!rock) return false;
      createRockBurst(rock);
      return true;
    };

    const animate = (time: number) => {
      const delta = Math.min(2, (time - previousTime) / 16.67);
      previousTime = time;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const keyboardX = Number(pressedKeys.has("ArrowRight") || pressedKeys.has("KeyD")) - Number(pressedKeys.has("ArrowLeft") || pressedKeys.has("KeyA"));
      const keyboardY = Number(pressedKeys.has("ArrowDown") || pressedKeys.has("KeyS")) - Number(pressedKeys.has("ArrowUp") || pressedKeys.has("KeyW"));
      if (keyboardX || keyboardY) {
        const keyboardLength = Math.hypot(keyboardX, keyboardY) || 1;
        rocket.vx += (keyboardX / keyboardLength) * 0.55 * delta;
        rocket.vy += (keyboardY / keyboardLength) * 0.55 * delta;
      }
      const maxSpeed = 8;
      const speed = Math.hypot(rocket.vx, rocket.vy);
      if (speed > maxSpeed) {
        rocket.vx = (rocket.vx / speed) * maxSpeed;
        rocket.vy = (rocket.vy / speed) * maxSpeed;
      }
      rocket.vx *= Math.pow(0.9, delta);
      rocket.vy *= Math.pow(0.9, delta);
      rocket.x += rocket.vx * delta;
      rocket.y += rocket.vy * delta;
      rocket.x = (rocket.x + window.innerWidth) % window.innerWidth;
      rocket.y = (rocket.y + window.innerHeight) % window.innerHeight;
      if (Math.hypot(rocket.vx, rocket.vy) > 0.2) rocket.angle = Math.atan2(rocket.vy, rocket.vx);

      drawRocks(delta);
      context.fillStyle = "rgba(236, 48, 19, 0.75)";
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.life -= delta;
        context.globalAlpha = Math.max(0, particle.life / 28);
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
        if (particle.life <= 0) particles.splice(index, 1);
      }
      context.globalAlpha = 1;
      context.fillStyle = "#ec3013";
      for (let index = projectiles.length - 1; index >= 0; index -= 1) {
        const projectile = projectiles[index];
        projectile.x += projectile.vx * delta;
        projectile.y += projectile.vy * delta;
        projectile.life -= delta;
        context.beginPath();
        context.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
        context.fill();
        if (projectile.life <= 0 || projectile.x < -20 || projectile.x > window.innerWidth + 20 || projectile.y < -20 || projectile.y > window.innerHeight + 20) {
          projectiles.splice(index, 1);
        } else {
          if (hitRock(projectile.x, projectile.y) || hitTarget(projectile.x, projectile.y)) {
            projectiles.splice(index, 1);
          }
        }
      }

      drawRocket();
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrame = window.requestAnimationFrame(animate);

    if (reduceMotion) {
      rocket.vx = 0;
      rocket.vy = 0;
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const resetGame = () => {
    setDestroyedTargets([]);
  };

  return (
    <section ref={contentRef} className="not-found-content" aria-labelledby="not-found-title">
      <canvas ref={canvasRef} className="not-found-game-canvas" aria-hidden="true" />
      <button type="button" className="not-found-reset" onClick={resetGame}>
        Reset game
      </button>
      <div className="not-found-scanline" aria-hidden="true" />
      <span className="not-found-marker not-found-marker-one" aria-hidden="true" />
      <span className="not-found-marker not-found-marker-two" aria-hidden="true" />

      <div className="not-found-container">
        <h1 className={`not-found-code not-found-fade-up ${destroyedTargets[0] ? "not-found-target-destroyed" : ""}`} aria-label="404" ref={(element) => { targetRefs.current[0] = element; }}>
          4<span className="accent">0</span>4
        </h1>
        <h2 id="not-found-title" className={`not-found-title not-found-fade-up not-found-delay-one ${destroyedTargets[1] ? "not-found-target-destroyed" : ""}`} ref={(element) => { targetRefs.current[1] = element; }}>
          Page not found<span className="accent">.</span>
        </h2>
        <p className={`not-found-description not-found-fade-up not-found-delay-two ${destroyedTargets[2] ? "not-found-target-destroyed" : ""}`} ref={(element) => { targetRefs.current[2] = element; }}>
          The tool you are looking for has been misplaced, deleted, or never existed
          in the first place. Let&apos;s get you back to the simple stuff.
        </p>
        <div className={`not-found-fade-up not-found-delay-three ${destroyedTargets[3] ? "not-found-target-destroyed" : ""}`} ref={(element) => { targetRefs.current[3] = element; }}>
          <Link href="/" className="btn btn-primary not-found-launch-button">
            Back to tools
          </Link>
        </div>
      </div>

      <div className="not-found-status" aria-hidden="true">
        <span className="pulse-dot" />
        arrows / WASD move · space fire
      </div>
    </section>
  );    
}
