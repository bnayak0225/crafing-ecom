'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Print3DModelConfig } from '@/config/print-3d-models';
import { COFFEE_MUG_WRAP } from '@/components/studio/print-3d/coffee-mug-wrap-design';

const SEGMENTS = 60;
const LIP_HEIGHT = 0.024;
const LIP_BEVEL = 0;
/** Torus lip only: negative moves ring down (into wall), positive moves up. */
const TORUS_LIP_Y_OFFSET = -0.02;

/** ~11 oz ceramic sublimation mug proportions. */
const MUG = {
  radius: 0.5,
  height: 2.0,
  wall: 0.042,
  bottom: 0.055,
  handleTube: 0.040,
  handleOut: -0.0,
} as const;
/** Positive = shift handle toward mug body (closes gap at attachment). */
const HANDLE_BODY_INSET = 0.012;

/** Rotate wrap so the design faces the camera (handle stays on the side). */
const WRAP_U_OFFSET = COFFEE_MUG_WRAP.uOffset;

type CoffeeMugProps = {
  params: NonNullable<Print3DModelConfig['procedural']['params']>;
  map?: THREE.Texture;
};

type MugLayout = {
  radius: number;
  height: number;
  bottom: number;
  inner: number;
  yTop: number;
  yBottom: number;
  wallTop: number;
  wallHeight: number;
  wallCenterY: number;
};

function layoutMug(params: CoffeeMugProps['params']): MugLayout {
  const radius = params.bodyRadius ?? MUG.radius;
  const height = params.bodyHeight ?? MUG.height;
  const bottom = MUG.bottom;
  const inner = radius - MUG.wall;
  const yTop = height / 2;
  const yBottom = -height / 2 + bottom;
  const wallTop = yTop - LIP_HEIGHT;
  const wallHeight = wallTop - yBottom;
  const wallCenterY = yBottom + wallHeight / 2;
  return { radius, height, bottom, inner, yTop, yBottom, wallTop, wallHeight, wallCenterY };
}

function buildOuterWall(radius: number, wallHeight: number, centerY: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, wallHeight, SEGMENTS, 1, true);
  geo.translate(0, centerY, 0);
  return geo;
}

function buildInnerWall(inner: number, wallHeight: number, centerY: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(inner, inner, wallHeight, SEGMENTS, 1, true);
  geo.translate(0, centerY, 0);
  return geo;
}

/** Flat extruded annulus lip (previous style). */
function buildExtrudedTopRing(radius: number, inner: number, yTop: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: LIP_HEIGHT,
    bevelEnabled: true,
    bevelSize: LIP_BEVEL,
    bevelThickness: LIP_BEVEL,
    bevelSegments: 0,
    curveSegments: SEGMENTS,
  });
  geo.rotateX(Math.PI / 2);
  geo.translate(0, yTop, 0);
  return geo;
}

/** Rounded torus lip — tube diameter equals inner-to-outer gap, mounted on wall top. */
function buildTorusTopRing(radius: number, inner: number, wallTop: number): THREE.BufferGeometry {
  const lipGap = radius - inner;
  const tubeRadius = lipGap / 2;
  const majorRadius = inner + tubeRadius;

  const geo = new THREE.TorusGeometry(majorRadius, tubeRadius, 20, SEGMENTS);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, wallTop + tubeRadius + TORUS_LIP_Y_OFFSET, 0);
  return geo;
}

function buildTopRing(layout: MugLayout, extrudedLip: boolean): THREE.BufferGeometry {
  if (extrudedLip) {
    return buildExtrudedTopRing(layout.radius, layout.inner, layout.yTop);
  }
  return buildTorusTopRing(layout.radius, layout.inner, layout.wallTop);
}

function buildBase(radius: number, bottom: number, height: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(radius, radius, bottom, SEGMENTS);
  geo.translate(0, -height / 2 + bottom / 2, 0);
  return geo;
}

function buildHandle(radius: number, height: number): THREE.BufferGeometry {
  const attachY = height * 0.3;
  const outward = MUG.handleOut;
  const cx = radius + outward;
  const arcR = Math.hypot(outward, attachY);
  const topAngle = Math.atan2(attachY, -outward);
  const bottomAngle = Math.atan2(-attachY, -outward);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 36; i += 1) {
    const t = i / 36;
    const angle = topAngle + t * (bottomAngle - topAngle);
    points.push(new THREE.Vector3(cx + arcR * Math.cos(angle), arcR * Math.sin(angle), 0));
  }

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
  const geo = new THREE.TubeGeometry(curve, 40, MUG.handleTube, 14, false);
  geo.translate(-HANDLE_BODY_INSET, 0, 0);
  return geo;
}

export function CoffeeMug({ params, map }: CoffeeMugProps) {
  const extrudedLip = params.extrudedLip ?? false;
  const layout = useMemo(() => layoutMug(params), [params.bodyRadius, params.bodyHeight]);

  useEffect(() => {
    if (!map) return;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.offset.set(WRAP_U_OFFSET, 0);
    map.needsUpdate = true;
    return () => {
      map.offset.set(0, 0);
    };
  }, [map]);

  const geometries = useMemo(
    () => ({
      outerWall: buildOuterWall(layout.radius, layout.wallHeight, layout.wallCenterY),
      innerWall: buildInnerWall(layout.inner, layout.wallHeight, layout.wallCenterY),
      topRing: buildTopRing(layout, extrudedLip),
      base: buildBase(layout.radius, layout.bottom, layout.height),
      handle: buildHandle(layout.radius, layout.height),
    }),
    [layout, extrudedLip],
  );

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geo) => geo.dispose());
    };
  }, [geometries]);

  const ceramic = {
    color: '#ffffff' as const,
    roughness: params.roughness ?? 0.16,
    metalness: params.metalness ?? 0.01,
  };

  const bodyMaterial = map
    ? { ...ceramic, map, color: '#ffffff' as const, roughness: 0.22 }
    : ceramic;

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <mesh geometry={geometries.outerWall} castShadow receiveShadow>
        <meshStandardMaterial {...bodyMaterial} />
      </mesh>
      <mesh geometry={geometries.innerWall} castShadow receiveShadow>
        <meshStandardMaterial {...ceramic} side={THREE.BackSide} roughness={0.2} />
      </mesh>
      <mesh geometry={geometries.topRing} castShadow receiveShadow>
        <meshStandardMaterial {...ceramic} roughness={0.12} />
      </mesh>
      <mesh geometry={geometries.base} castShadow receiveShadow>
        <meshStandardMaterial {...ceramic} roughness={0.18} />
      </mesh>
      <mesh geometry={geometries.handle} castShadow>
        <meshStandardMaterial {...ceramic} roughness={0.18} />
      </mesh>
    </group>
  );
}
