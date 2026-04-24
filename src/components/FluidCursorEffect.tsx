import { memo, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function CursorOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const current = useRef(new THREE.Vector3(0, 0, 0));
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const x = state.pointer.x * (viewport.width * 0.5);
    const y = state.pointer.y * (viewport.height * 0.5);
    target.current.set(x, y, 0);

    const follow = 1 - Math.exp(-delta * 10);
    current.current.lerp(target.current, follow);

    if (orbRef.current) {
      orbRef.current.position.copy(current.current);
      orbRef.current.rotation.y += delta * 0.6;
      orbRef.current.rotation.x += delta * 0.4;
    }

    if (lightRef.current) {
      lightRef.current.position.set(current.current.x, current.current.y, 1.8);
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight ref={lightRef} intensity={1.7} distance={3.2} color="#ff2a2a" />

      <mesh ref={orbRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.18, 6]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.08}
          thickness={1.8}
          ior={1.13}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationDistance={0.4}
          attenuationColor="#ff2a2a"
          color="#ffffff"
          emissive="#2a0000"
          emissiveIntensity={0.34}
        />
      </mesh>
    </>
  );
}

const FluidCursorEffect = memo(function FluidCursorEffect() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 900px)');
    const evaluate = () => setEnabled(!media.matches && !mobile.matches);
    evaluate();
    media.addEventListener('change', evaluate);
    mobile.addEventListener('change', evaluate);
    return () => {
      media.removeEventListener('change', evaluate);
      mobile.removeEventListener('change', evaluate);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor-fluid-layer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 34 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.25]}>
        <CursorOrb />
      </Canvas>
    </div>
  );
});

export default FluidCursorEffect;
