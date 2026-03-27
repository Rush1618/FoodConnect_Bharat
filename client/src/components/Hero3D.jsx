import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, TorusKnot, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function TechKnot() {
  const mesh = useRef();
  
  useFrame((state) => {
    if (!mesh.current) return;
    // Mouse movement influence
    const targetX = state.mouse.y * 0.4;
    const targetY = state.mouse.x * 0.4;
    
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetX, 0.05);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetY, 0.05);
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
      <TorusKnot ref={mesh} args={[1, 0.3, 128, 16]}>
        <meshStandardMaterial 
          color="#f97316" 
          wireframe={true} 
          emissive="#f97316"
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.6}
        />
      </TorusKnot>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fb923c" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ef4444" />
        
        <TechKnot />
        
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.3} 
          scale={8} 
          blur={2} 
          far={3} 
        />
      </Canvas>
    </div>
  );
}
