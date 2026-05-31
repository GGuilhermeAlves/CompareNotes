import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function CameraRig({ view }: { view: string }) {
  useFrame((state) => {
    if (view === "free") return

    const targetPos = new THREE.Vector3()
    const d = 3

    if (view === "top") targetPos.set(0, d + 4, 0.01)
    else if (view === "side") targetPos.set(4, 0, 0)
    else if (view === "front") targetPos.set(0, 0, 4)
    else targetPos.set(0, 1.5, 4.5)

    state.camera.position.lerp(targetPos, 0.05)
    state.camera.lookAt(0, 0.5, 0)
  })
  return null
}
