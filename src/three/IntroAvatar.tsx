import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Avatar, Particles, GridFloor } from './Effects'

export default function IntroAvatar() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 2.2, 6.5], fov: 45 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#05060e']} />
        <fog attach="fog" args={['#05060e', 14, 40]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 4]} intensity={0.8} color="#9db8ff" />
        <Stars radius={50} depth={30} count={1500} factor={3} saturation={0.5} fade speed={0.5} />
        <Particles count={120} spread={24} />
        <GridFloor size={50} />
        <Avatar position={[0, 0, 0]} />
      </Canvas>
    </div>
  )
}
