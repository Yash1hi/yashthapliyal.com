
import React, { useEffect, useRef, useState } from 'react';

interface ThrownBubble {
  id: number;
  role: string;
  startX: number;
  startY: number;
  landX: number;
  landY: number;
  width: number;
  height: number;
  throwStartTime: number;
}

const ROLES = ['Software Developer', 'Hacker', 'Photographer', 'Designer', 'Scholar', 'Musician', 'Creative', 'Researcher', 'Pokemon Trainer', 'Maker', 'Wizard', 'Traveler', 'Coffee Addict', 'Fashionista', 'Speedrunner', 'Buff', 'Dungeon Master', 'GOAT', 'Chud'];
const ROLE_INTERVAL_MS = 2000;
const FADE_DURATION_MS = 1000;
const FADE_DELAY_MS = (ROLES.length - 1) * ROLE_INTERVAL_MS;
const LIFESPAN_MS = FADE_DELAY_MS + FADE_DURATION_MS;

const REPEL_RADIUS = 220;
const PUSH_ACCEL = 5200;            // px/s^2 at point-blank; falls off quadratically with distance
const FRICTION_PER_SECOND = 0.08;   // velocity multiplier per 1s (lower = more friction); ice-ish glide
const WALL_PADDING = 12;
const LN_FRICTION = Math.log(FRICTION_PER_SECOND);

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [thrown, setThrown] = useState<ThrownBubble[]>([]);
  const nextIdRef = useRef(0);
  const currentRoleRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeBubbleRef = useRef<HTMLSpanElement>(null);
  const thrownRef = useRef<ThrownBubble[]>([]);
  const bubbleElRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const bubbleStateRef = useRef<Map<number, { x: number; y: number; vx: number; vy: number }>>(new Map());
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const cursorElRef = useRef<HTMLDivElement>(null);
  const [cursorOverHero, setCursorOverHero] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    thrownRef.current = thrown;
  }, [thrown]);

  const triggerThrow = (role: string) => {
    const section = sectionRef.current;
    const bubble = activeBubbleRef.current;
    if (!section || !bubble) return;

    const sectionRect = section.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();
    const startX = bubbleRect.left - sectionRect.left;
    const startY = bubbleRect.top - sectionRect.top;
    const width = bubbleRect.width;
    const height = bubbleRect.height;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const marginX = Math.min(120, vw * 0.08) + width / 2;
    const marginY = Math.min(100, vh * 0.1) + height / 2;
    const minDistFromActive = Math.min(280, Math.min(vw, vh) * 0.28);
    const overlapPadding = 14;

    const activeCenterX = bubbleRect.left + width / 2;
    const activeCenterY = bubbleRect.top + height / 2;

    const existing = thrownRef.current.map((b) => ({
      centerX: sectionRect.left + b.landX + b.width / 2,
      centerY: sectionRect.top + b.landY + b.height / 2,
      halfW: b.width / 2,
      halfH: b.height / 2,
    }));

    let bestCenterX = activeCenterX;
    let bestCenterY = activeCenterY;
    let bestScore = -Infinity;
    let found = false;

    for (let i = 0; i < 40; i++) {
      const cx = marginX + Math.random() * Math.max(0, vw - marginX * 2);
      const cy = marginY + Math.random() * Math.max(0, vh - marginY * 2);

      const distFromActive = Math.hypot(cx - activeCenterX, cy - activeCenterY);
      if (distFromActive < minDistFromActive) continue;

      let overlapping = false;
      let minClearance = Infinity;
      for (const other of existing) {
        const ax = Math.abs(cx - other.centerX);
        const ay = Math.abs(cy - other.centerY);
        const combinedHalfW = width / 2 + other.halfW + overlapPadding;
        const combinedHalfH = height / 2 + other.halfH + overlapPadding;
        if (ax < combinedHalfW && ay < combinedHalfH) {
          overlapping = true;
          break;
        }
        const clearance = Math.min(ax - combinedHalfW, ay - combinedHalfH);
        if (clearance < minClearance) minClearance = clearance;
      }
      if (overlapping) continue;

      const score = (existing.length ? minClearance : 0) + distFromActive * 0.1;
      if (score > bestScore) {
        bestScore = score;
        bestCenterX = cx;
        bestCenterY = cy;
        found = true;
      }
    }

    if (!found) {
      const angle = Math.random() * Math.PI * 2;
      bestCenterX = activeCenterX + Math.cos(angle) * minDistFromActive;
      bestCenterY = activeCenterY + Math.sin(angle) * minDistFromActive;
    }

    const landX = bestCenterX - sectionRect.left - width / 2;
    const landY = bestCenterY - sectionRect.top - height / 2;

    const id = nextIdRef.current++;
    setThrown((t) => [
      ...t,
      { id, role, startX, startY, landX, landY, width, height, throwStartTime: performance.now() },
    ]);
    setTimeout(() => {
      setThrown((t) => t.filter((b) => b.id !== id));
    }, LIFESPAN_MS);
  };

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => {
      const prev = currentRoleRef.current;
      triggerThrow(ROLES[prev]);
      const next = (prev + 1) % ROLES.length;
      currentRoleRef.current = next;
      setCurrentRole(next);
    }, ROLE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastOver = false;
    const handleMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      const el = cursorElRef.current;
      if (el) {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const section = sectionRef.current;
      if (section) {
        const r = section.getBoundingClientRect();
        const inside =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (inside !== lastOver) {
          lastOver = inside;
          setCursorOverHero(inside);
        }
      }
    };
    const handleOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        cursorRef.current = null;
        if (lastOver) {
          lastOver = false;
          setCursorOverHero(false);
        }
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseout', handleOut);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseout', handleOut);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('hero-cursor-hidden', cursorOverHero);
    return () => {
      document.body.classList.remove('hero-cursor-hidden');
    };
  }, [cursorOverHero]);

  useEffect(() => {
    let prevTime = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.033);
      prevTime = now;

      const section = sectionRef.current;
      if (section) {
        const sectionRect = section.getBoundingClientRect();
        const cursor = cursorRef.current;
        const decay = Math.pow(FRICTION_PER_SECOND, dt);
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        for (const b of thrownRef.current) {
          const el = bubbleElRefs.current.get(b.id);
          if (!el) continue;

          let st = bubbleStateRef.current.get(b.id);
          if (!st) {
            // Pick initial velocity so the asymptote (with this friction) is the landing point.
            st = {
              x: b.startX,
              y: b.startY,
              vx: (b.landX - b.startX) * -LN_FRICTION,
              vy: (b.landY - b.startY) * -LN_FRICTION,
            };
            bubbleStateRef.current.set(b.id, st);
          }

          if (cursor) {
            const centerX = sectionRect.left + st.x + b.width / 2;
            const centerY = sectionRect.top + st.y + b.height / 2;
            const dx = centerX - cursor.x;
            const dy = centerY - cursor.y;
            const dist = Math.hypot(dx, dy);
            if (dist < REPEL_RADIUS && dist > 0) {
              const t = 1 - dist / REPEL_RADIUS;
              const accel = t * t * PUSH_ACCEL;
              st.vx += (dx / dist) * accel * dt;
              st.vy += (dy / dist) * accel * dt;
            }
          }

          st.x += st.vx * dt;
          st.y += st.vy * dt;
          st.vx *= decay;
          st.vy *= decay;

          // Soft walls: clamp position to viewport, zero velocity component into the wall.
          const minX = -sectionRect.left + WALL_PADDING;
          const maxX = -sectionRect.left + vw - b.width - WALL_PADDING;
          const minY = -sectionRect.top + WALL_PADDING;
          const maxY = -sectionRect.top + vh - b.height - WALL_PADDING;
          if (st.x < minX) { st.x = minX; if (st.vx < 0) st.vx = 0; }
          else if (st.x > maxX) { st.x = maxX; if (st.vx > 0) st.vx = 0; }
          if (st.y < minY) { st.y = minY; if (st.vy < 0) st.vy = 0; }
          else if (st.y > maxY) { st.y = maxY; if (st.vy > 0) st.vy = 0; }

          el.style.transform = `translate3d(${st.x - b.startX}px, ${st.y - b.startY}px, 0)`;
        }

        for (const id of Array.from(bubbleStateRef.current.keys())) {
          if (!thrownRef.current.some((b) => b.id === id)) {
            bubbleStateRef.current.delete(id);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center noise-bg overflow-hidden"
    >
      <div className="container px-4 mx-auto text-center">
        <h1 className={`font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Yash Thapliyal
        </h1>
        <div className={`mt-4 sm:mt-6 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-lg sm:text-xl md:text-2xl">
            I am a{' '}
            <span
              ref={activeBubbleRef}
              key={currentRole}
              className="highlight inline-block bubble-enter"
            >
              {ROLES[currentRole]}
            </span>
          </p>
        </div>
      </div>
      {thrown.map((b) => (
        <span
          key={b.id}
          ref={(el) => {
            if (el) bubbleElRefs.current.set(b.id, el);
            else bubbleElRefs.current.delete(b.id);
          }}
          className="highlight bubble-thrown absolute font-mono text-lg sm:text-xl md:text-2xl"
          style={{
            left: `${b.startX}px`,
            top: `${b.startY}px`,
            ['--fade-duration' as string]: `${FADE_DURATION_MS}ms`,
            ['--fade-delay' as string]: `${FADE_DELAY_MS}ms`,
          } as React.CSSProperties}
        >
          {b.role}
        </span>
      ))}
      <div
        ref={cursorElRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-2.5 h-2.5 bg-gray-900 pointer-events-none z-50 transition-opacity duration-150 ${cursorOverHero ? 'opacity-100' : 'opacity-0'}`}
      />
    </section>
  );
};

export default Hero;
