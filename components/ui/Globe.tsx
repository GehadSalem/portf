"use client";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

// ✅ Correct import as CLASS
import GeoJsonGeometry from "three-geojson-geometry";

const cameraZ = 300;

type Marker = {
  id?: string;
  city?: string;
  color: string;
  coordinates: [number, number]; // [lng, lat]
};

type GlobeConfig = {
  globeColor: string;
  showGraticules: boolean;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  polygonColor: string;
  ambientLight: string;
  directionalLeftLight: string;
  directionalTopLight: string;
  pointLight: string;
};

export type GlobeProps = {
  markers: Marker[];
  globeConfig: GlobeConfig;
};

function latLongToVector3(
  lat: number,
  lon: number,
  radius: number
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    if (!gl || !size) return;

    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0); // Transparent background
  }, [gl, size]);

  return null;
}

function GlobeMesh({ globeConfig, markers }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const radius = 200;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Globe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          color={globeConfig.globeColor}
          emissive={globeConfig.emissive}
          emissiveIntensity={globeConfig.emissiveIntensity}
          shininess={globeConfig.shininess}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Atmosphere */}
      {globeConfig.showAtmosphere && (
        <mesh>
          <sphereGeometry
            args={[radius + globeConfig.atmosphereAltitude, 64, 64]}
          />
          <meshBasicMaterial
            color={globeConfig.atmosphereColor}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Country Borders */}
      <group>
        {countries.features.map((feature: any, idx: number) => {
          const geometry = new GeoJsonGeometry(feature, radius);
          return (
            <lineSegments key={idx} geometry={geometry}>
              <lineBasicMaterial
                color={globeConfig.polygonColor}
                linewidth={1}
              />
            </lineSegments>
          );
        })}
      </group>

      {/* Markers */}
      {markers.map((marker) => {
        const pos = latLongToVector3(
          marker.coordinates[1], // lat
          marker.coordinates[0], // lng
          radius + 1
        );
        return (
          <mesh key={marker.id} position={pos}>
            <sphereGeometry args={[3, 8, 8]} />
            <meshStandardMaterial color={marker.color} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Globe(props: GlobeProps) {
  const { globeConfig } = props;

  return (
    <Canvas
      camera={{
        fov: 50,
        position: [0, 0, cameraZ],
        near: 180,
        far: 1800,
      }}
    >
      <WebGLRendererConfig />

      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={[-400, 100, 400]}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={[-200, 500, 200]}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />

      <GlobeMesh {...props} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
