import * as THREE from 'three';

/** Vertical travel-mug grip loop on the +X wall, under the lid. */
export function createTravelMugHandleGeometry(
  mugRadius: number,
  mugHeight: number,
): THREE.TubeGeometry {
  const tubeRadius = 0.034;
  const topY = mugHeight * 0.36;
  const bottomY = mugHeight * 0.1;
  const outward = 0.13;
  const attachX = mugRadius + tubeRadius * 0.92;

  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(attachX, topY, 0),
    new THREE.Vector3(attachX + outward, topY, 0),
    new THREE.Vector3(attachX + outward, bottomY, 0),
    new THREE.Vector3(attachX, bottomY, 0),
  );

  return new THREE.TubeGeometry(curve, 28, tubeRadius, 12, false);
}
