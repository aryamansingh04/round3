import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { Environment, Grid, Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function Car() {
  const group = useRef<THREE.Group | null>(null);
  const wheels = useRef<THREE.Mesh[]>([]);

  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0b1020"),
        metalness: 0.65,
        roughness: 0.18,
        envMapIntensity: 1.2,
      }),
    [],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0b132b"),
        metalness: 0.0,
        roughness: 0.08,
        transmission: 0.9,
        thickness: 0.4,
        ior: 1.6,
        envMapIntensity: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
      }),
    [],
  );

  const neonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#00e5ff"),
        emissive: new THREE.Color("#00e5ff"),
        emissiveIntensity: 3.2,
        metalness: 0.2,
        roughness: 0.35,
      }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 1.6) * 0.05;
    const roll = Math.sin(t * 0.7) * 0.07;
    const yaw = Math.sin(t * 0.45) * 0.12;

    if (group.current) {
      group.current.position.y = 0.35 + bob;
      group.current.rotation.z = roll * 0.18;
      group.current.rotation.y = yaw * 0.18;
    }

    const speed = 7.2;
    for (const w of wheels.current) w.rotation.x -= delta * speed;

    const px = clamp(state.pointer.x, -1, 1);
    const py = clamp(state.pointer.y, -1, 1);
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.position.x = THREE.MathUtils.lerp(cam.position.x, px * 0.8, 0.05);
    cam.position.y = THREE.MathUtils.lerp(cam.position.y, 1.35 + py * 0.25, 0.05);
    cam.lookAt(0, 0.35, 0);
  });

  return (
    <group ref={group} position={[0, 0.35, 0]}>
      {/* chassis */}
      <mesh castShadow receiveShadow material={bodyMat} position={[0, 0.0, 0]}>
        <boxGeometry args={[2.35, 0.45, 1.05]} />
      </mesh>
      {/* cabin */}
      <mesh castShadow receiveShadow material={glassMat} position={[0.2, 0.38, 0]}>
        <boxGeometry args={[1.15, 0.42, 0.9]} />
      </mesh>
      {/* splitter */}
      <mesh castShadow receiveShadow material={neonMat} position={[1.05, -0.16, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.95]} />
      </mesh>
      {/* rear light bar */}
      <mesh castShadow receiveShadow material={neonMat} position={[-1.16, 0.05, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.95]} />
      </mesh>

      {/* wheels */}
      {[
        [0.82, -0.24, 0.56],
        [0.82, -0.24, -0.56],
        [-0.78, -0.24, 0.56],
        [-0.78, -0.24, -0.56],
      ].map((p, i) => (
        <mesh
          // eslint-disable-next-line react/no-unknown-property
          key={i}
          ref={(el) => {
            if (!el) return;
            wheels.current[i] = el;
          }}
          castShadow
          receiveShadow
          position={p as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.23, 0.23, 0.2, 24, 1]} />
          <meshStandardMaterial color="#0a0d18" metalness={0.25} roughness={0.7} />
        </mesh>
      ))}

      {/* wheel hubs glow */}
      {[
        [0.82, -0.24, 0.56],
        [0.82, -0.24, -0.56],
        [-0.78, -0.24, 0.56],
        [-0.78, -0.24, -0.56],
      ].map((p, i) => (
        <mesh key={`hub-${i}`} position={p as [number, number, number]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#ff2bd6"
            emissive="#ff2bd6"
            emissiveIntensity={4.2}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 7, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3.5, 4.5, 2.2]}
        intensity={1.25}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 1.6, 2.2]} intensity={1.35} color="#00e5ff" />
      <pointLight position={[-1.9, 1.2, -1.8]} intensity={0.9} color="#ff2bd6" />

      <Grid
        position={[0, -0.02, 0]}
        args={[28, 28]}
        cellSize={0.55}
        cellThickness={0.45}
        cellColor={"#0d5bff"}
        sectionSize={3.3}
        sectionThickness={1.1}
        sectionColor={"#00e5ff"}
        fadeDistance={18}
        fadeStrength={3}
        infiniteGrid
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#02030a" roughness={1} metalness={0} />
      </mesh>

      <Car />

      <Sparkles count={110} speed={0.7} size={1.7} scale={[18, 8, 16]} position={[0, 2.2, 0]} color="#00e5ff" />
      <Sparkles count={65} speed={0.55} size={1.3} scale={[14, 6, 12]} position={[0, 1.1, 0]} color="#ff2bd6" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.15} luminanceThreshold={0.25} luminanceSmoothing={0.8} />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0014, 0.001)}
          radialModulation
          modulationOffset={0.42}
        />
        <Noise opacity={0.18} />
        <Vignette eskil={false} offset={0.2} darkness={0.82} />
      </EffectComposer>
    </>
  );
}

export function CarHeroScene(props: { className?: string }) {
  return (
    <div className={props.className}>
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ fov: 48, position: [0.2, 1.35, 4.2], near: 0.1, far: 100 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

