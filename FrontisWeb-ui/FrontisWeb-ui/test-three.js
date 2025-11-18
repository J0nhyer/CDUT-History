// 测试Three.js是否正常工作
// 在浏览器控制台运行这个脚本

console.log('测试开始...')

// 检查Three.js是否加载
if (typeof THREE === 'undefined') {
  console.error('❌ THREE 未定义！请检查Three.js是否正确导入')
} else {
  console.log('✓ THREE已加载', THREE.REVISION)
}

// 创建一个简单的测试场景
const testScene = new THREE.Scene()
const testCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const testRenderer = new THREE.WebGLRenderer()

testRenderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(testRenderer.domElement)

// 创建一个测试立方体
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
testScene.add(cube)

testCamera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  testRenderer.render(testScene, testCamera)
}

animate()
console.log('如果看到绿色旋转立方体，Three.js正常工作！')

