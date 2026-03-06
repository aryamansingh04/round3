import { cn } from "@/lib/utils";
import { CursorSpotlight } from "@/components/motion/CursorSpotlight";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Car, Gauge, Layers, Play, Shield, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CarHeroScene = lazy(() =>
  import("@/components/three/CarHeroScene").then((m) => ({ default: m.CarHeroScene })),
);

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true })
    );
  } catch {
    return false;
  }
}

function Pill(props: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground/80 backdrop-blur",
        "shadow-[0_0_0_1px_hsl(var(--primary)/0.08),0_0_30px_-18px_hsl(var(--primary)/0.32)]",
        props.className,
      )}
    >
      {props.children}
    </span>
  );
}

function Feature(props: { icon: React.ReactNode; title: string; description: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const }}
      className="group relative overflow-hidden rounded-3xl border border-border/70 bg-[linear-gradient(145deg,hsl(var(--card))/0.70,hsl(var(--background))/0.35)] p-6 backdrop-blur"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-12 bg-[radial-gradient(circle_at_30%_20%,hsla(var(--primary)/0.30),transparent_55%),radial-gradient(circle_at_80%_70%,hsla(var(--accent)/0.22),transparent_50%)]" />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-border/60 bg-card/60 glow">
            {props.icon}
          </div>
          <div className="h-2.5 w-2.5 rounded-full bg-primary/70 shadow-[0_0_24px_hsl(var(--primary)/0.55)]" />
        </div>
        <div className="mt-5 text-lg font-semibold tracking-tight text-foreground">{props.title}</div>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{props.description}</div>
        <div className="mt-6 h-1.5 w-full rounded-full bg-muted/40">
          <div className="h-1.5 w-1/3 rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)))] transition-all duration-500 group-hover:w-3/4" />
        </div>
      </div>
    </motion.div>
  );
}

function HeroVisual(props: { className?: string }) {
  const reduce = useReducedMotion();
  const [webglOk, setWebglOk] = useState(false);
  const [videoOk, setVideoOk] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setWebglOk(supportsWebGL());
  }, [reduce]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/landing/road.mp4", { method: "HEAD", signal: controller.signal })
      .then((r) => setVideoOk(r.ok))
      .catch(() => setVideoOk(false));
    return () => controller.abort();
  }, []);

  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden rounded-[32px] border border-border/60", props.className)}>
      {/* optional video layer (place file at public/landing/road.mp4) */}
      {videoOk ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/landing/road.mp4" type="video/mp4" />
        </video>
      ) : null}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsla(var(--primary)/0.25),transparent_60%),radial-gradient(circle_at_80%_70%,hsla(var(--accent)/0.18),transparent_55%),linear-gradient(180deg,hsla(var(--background)/0.15),hsla(var(--background)/0.85))]" />
      <div className="absolute inset-0 scanlines opacity-[0.14]" />
      <div className="absolute inset-0 noise-overlay opacity-[0.05] mix-blend-overlay" />

      <AnimatePresence initial={false} mode="wait">
        {webglOk ? (
          <motion.div
            key="webgl"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const }}
            className="absolute inset-0"
          >
            <Suspense fallback={null}>
              <CarHeroScene className="absolute inset-0" />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,hsla(var(--primary)/0.20),transparent_55%),radial-gradient(circle_at_70%_70%,hsla(var(--accent)/0.16),transparent_60%)]" />
            <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(90deg,transparent,hsla(var(--primary)/0.18),transparent)] opacity-0 animate-scan" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,transparent_25%,hsla(var(--background)/0.75)_70%)]" />
    </div>
  );
}

export default function LandingPage() {
  const reduce = useReducedMotion();

  const container = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const } },
    }),
    [reduce],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <CursorSpotlight />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsla(var(--primary)/0.10),transparent_45%),radial-gradient(circle_at_bottom,hsla(var(--accent)/0.10),transparent_45%)]" />

      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-card/50 glow">
              <Car className="h-5 w-5 text-primary" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm tracking-wider text-foreground">
                TELEMETRY <span className="text-gradient">WHISPER</span>
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">3D landing · neon theme</div>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-semibold text-muted-foreground hover:text-foreground" href="#features">
              Features
            </a>
            <a className="text-sm font-semibold text-muted-foreground hover:text-foreground" href="#preview">
              Preview
            </a>
            <a className="text-sm font-semibold text-muted-foreground hover:text-foreground" href="#cta">
              Start
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Magnetic>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:bg-card/60"
              >
                Open console <ArrowRight className="h-4 w-4 opacity-80" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 md:grid-cols-12 md:items-center md:px-6 md:pb-20 md:pt-16">
          <motion.div variants={container} initial="hidden" animate="show" className="md:col-span-6">
            <div className="flex flex-wrap gap-2">
              <Pill>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Crazy motion, but readable UI
              </Pill>
              <Pill className="shadow-[0_0_0_1px_hsl(var(--accent)/0.10),0_0_30px_-18px_hsl(var(--accent)/0.30)]">
                <Zap className="h-3.5 w-3.5 text-accent" />
                Neon theme refresh
              </Pill>
            </div>

            <div className="mt-8 text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-6xl">
              A 3D landing page
              <br />
              built for <span className="text-gradient">telemetry</span>.
            </div>

            <div className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Animated, glassy, and fast. The hero runs a real WebGL scene (procedural car + neon grid) with a video fallback.
              Everything uses your Tailwind + CSS-variable theme.
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#preview"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)))] px-5 py-2.5 text-sm font-semibold text-background transition hover:-translate-y-0.5"
                >
                  Watch the preview <Play className="h-4 w-4" />
                </a>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:bg-card/60"
                >
                  Enter the console <ArrowRight className="h-4 w-4 opacity-80" />
                </Link>
              </Magnetic>
            </div>

            <div className="mt-8 grid gap-2 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card/35 p-4 backdrop-blur glow">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Render</div>
                <div className="mt-2 text-lg font-semibold">WebGL + video</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/35 p-4 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Motion</div>
                <div className="mt-2 text-lg font-semibold">Bloom + scan</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/35 p-4 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Theme</div>
                <div className="mt-2 text-lg font-semibold">Cyan / Magenta</div>
              </div>
            </div>
          </motion.div>

          <div className="md:col-span-6">
            <HeroVisual className={cn("h-[420px] md:h-[520px]", !reduce && "animate-float-slow")} />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.30em] text-muted-foreground">Features</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Neon, glass, and depth.</div>
              <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                The hero is a real 3D scene (procedural car) with post-processing, plus a video layer you can swap for a real
                road clip.
              </div>
            </div>
            <div className="hidden text-sm font-semibold text-muted-foreground md:block">
              <span className="inline-block animate-glitch">GLITCH READY</span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Car className="h-5 w-5 text-primary" />}
              title="3D hero car"
              description="Procedural geometry (no model file needed) with animated wheels, camera parallax, and neon accents."
            />
            <Feature
              icon={<Layers className="h-5 w-5 text-accent" />}
              title="Crazy layers"
              description="Scanlines, noise, radial glows, and gradient masks that keep the scene cinematic without killing readability."
            />
            <Feature
              icon={<Gauge className="h-5 w-5 text-primary" />}
              title="Performance-aware"
              description="Reduced-motion users skip the WebGL animation. Everyone else gets a crisp, bloom-heavy scene."
            />
          </div>
        </section>

        <section id="preview" className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
          <div className="rounded-[32px] border border-border/60 bg-card/30 p-8 backdrop-blur md:p-12">
            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <div className="text-xs font-semibold uppercase tracking-[0.30em] text-muted-foreground">Preview</div>
                <div className="mt-4 text-4xl font-semibold leading-[1.0] tracking-tight md:text-5xl">
                  Plug in a real car model
                  <br />
                  or ship with video.
                </div>
                <div className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  If you want an actual 3D car asset, drop a `.glb` in `public/` and we can load it with `drei` in minutes.
                  If you prefer video, put a clip at `public/landing/road.mp4`.
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="grid gap-3">
                  <Magnetic>
                    <Link
                      to="/vehicles"
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/30 px-5 py-4 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5"
                    >
                      Explore vehicles <ArrowRight className="h-4 w-4 opacity-80" />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      to="/telemetry"
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/30 px-5 py-4 text-sm font-semibold backdrop-blur transition hover:-translate-y-0.5"
                    >
                      Live telemetry <ArrowRight className="h-4 w-4 opacity-80" />
                    </Link>
                  </Magnetic>
                  <div className="rounded-2xl border border-border/60 bg-background/20 px-5 py-4 text-sm text-muted-foreground">
                    Tip: add a real asset later—this landing page is already shippable today.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-6xl px-4 pb-20 md:px-6 md:pb-28">
          <div className="relative overflow-hidden rounded-[34px] border border-border/60 bg-[radial-gradient(circle_at_20%_25%,hsla(var(--primary)/0.20),transparent_55%),radial-gradient(circle_at_80%_65%,hsla(var(--accent)/0.18),transparent_55%),linear-gradient(180deg,hsla(var(--card)/0.55),hsla(var(--background)/0.55))] p-10 backdrop-blur md:p-14">
            <div className="pointer-events-none absolute inset-0 noise-overlay opacity-[0.06] mix-blend-overlay" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-24 w-[520px] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,hsla(var(--primary)/0.28),transparent)] blur-2xl" />

            <div className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.30em] text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" /> Ready
                </div>
                <div className="mt-4 text-4xl font-semibold leading-[1.0] tracking-tight md:text-6xl">
                  Ship a landing page
                  <br />
                  that feels <span className="text-gradient">alive</span>.
                </div>
                <div className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  This updates your theme + adds a 3D hero with postprocessing, layered motion effects, and clean CTAs into the
                  existing console.
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="grid gap-3">
                  <Magnetic>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-between rounded-2xl bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--accent)))] px-6 py-4 text-sm font-semibold text-background transition hover:-translate-y-0.5"
                    >
                      Open the console <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Magnetic>
                  <div className="rounded-2xl border border-border/60 bg-background/25 px-6 py-4 text-sm text-muted-foreground">
                    Want it more insane? We can add scroll-synced camera moves, glitch typography, and section transitions.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-border/60 pt-6 text-xs font-semibold uppercase tracking-[0.30em] text-muted-foreground">
              © {new Date().getFullYear()} · Telemetry Whisper
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

