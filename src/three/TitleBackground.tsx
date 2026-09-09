import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Particles, GridFloor } from './Effects'

export default function TitleBackground() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 6, 22], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={['#05060e']} />
        <fog attach="fog" args={['#05060e', 30, 90]} />
        <ambientLight intensity={0.3} />
        <Stars radius={80} depth={40} count={2600} factor={4} saturation={0.6} fade speed={0.8} />
        <Particles count={220} spread={70} />
        <GridFloor size={100} />
      </Canvas>
    </div>
  )
}
