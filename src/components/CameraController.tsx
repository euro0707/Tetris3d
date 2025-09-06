import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

export function CameraController() {
  const { camera, gl } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const originalPosition = useRef(new THREE.Vector3(15, 18, 15))
  const originalTarget = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const controls = new OrbitControlsImpl(camera, gl.domElement)
    controlsRef.current = controls
    
    // 基本設定
    controls.enablePan = false
    controls.enableZoom = true
    controls.minPolarAngle = Math.PI / 6  // 30度
    controls.maxPolarAngle = Math.PI / 2  // 90度
    controls.minDistance = 10
    controls.maxDistance = 40
    
    // 初期位置設定
    camera.position.copy(originalPosition.current)
    controls.target.copy(originalTarget.current)
    controls.update()

    // キーボードイベントリスナー
    const handleKeyDown = (e: KeyboardEvent) => {
      const moveSpeed = 2
      const rotateSpeed = 0.1
      
      console.log('CameraController received key:', e.key)
      
      // カメラ操作キーの場合は、他のイベントリスナーを止める
      const cameraKeys = ['i', 'I', 'k', 'K', 'j', 'J', 'l', 'L', 'u', 'U', 'o', 'O', 'v', 'V']
      if (cameraKeys.includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        console.log('Camera key detected, preventing other handlers')
        
        // WASD: カメラ回転移動
        if (e.key === 'i' || e.key === 'I') {
          // 上方向にカメラ移動
          const spherical = new THREE.Spherical()
          spherical.setFromVector3(camera.position.clone().sub(controls.target))
          spherical.phi = Math.max(0.1, spherical.phi - rotateSpeed)
          camera.position.copy(controls.target.clone().add(new THREE.Vector3().setFromSpherical(spherical)))
          controls.update()
        }
        
        if (e.key === 'k' || e.key === 'K') {
          // 下方向にカメラ移動
          const spherical = new THREE.Spherical()
          spherical.setFromVector3(camera.position.clone().sub(controls.target))
          spherical.phi = Math.min(Math.PI - 0.1, spherical.phi + rotateSpeed)
          camera.position.copy(controls.target.clone().add(new THREE.Vector3().setFromSpherical(spherical)))
          controls.update()
        }
        
        if (e.key === 'j' || e.key === 'J') {
          // 左回転
          const spherical = new THREE.Spherical()
          spherical.setFromVector3(camera.position.clone().sub(controls.target))
          spherical.theta += rotateSpeed
          camera.position.copy(controls.target.clone().add(new THREE.Vector3().setFromSpherical(spherical)))
          controls.update()
        }
        
        if (e.key === 'l' || e.key === 'L') {
          // 右回転
          const spherical = new THREE.Spherical()
          spherical.setFromVector3(camera.position.clone().sub(controls.target))
          spherical.theta -= rotateSpeed
          camera.position.copy(controls.target.clone().add(new THREE.Vector3().setFromSpherical(spherical)))
          controls.update()
        }
        
        // U/O: ズーム
        if (e.key === 'u' || e.key === 'U') {
          // ズームイン
          const direction = controls.target.clone().sub(camera.position).normalize()
          camera.position.add(direction.multiplyScalar(moveSpeed))
          controls.update()
        }
        
        if (e.key === 'o' || e.key === 'O') {
          // ズームアウト
          const direction = camera.position.clone().sub(controls.target).normalize()
          camera.position.add(direction.multiplyScalar(moveSpeed))
          controls.update()
        }
        
        // V: 視点リセット
        if (e.key === 'v' || e.key === 'V') {
          console.log('V key pressed - attempting camera reset')
          console.log('Current position:', camera.position)
          console.log('Target position:', originalPosition.current)
          camera.position.copy(originalPosition.current)
          controls.target.copy(originalTarget.current)
          controls.update()
          console.log('Camera reset completed')
          console.log('New position:', camera.position)
        }
      }
    }

    // カメラコントロール用のキーイベントを最優先で登録
    window.addEventListener('keydown', handleKeyDown, { capture: true })
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      controls.dispose()
    }
  }, [camera, gl])

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return null
}