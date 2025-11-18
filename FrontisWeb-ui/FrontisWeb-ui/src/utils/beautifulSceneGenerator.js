/**
 * 精美大规模3D校园场景生成器
 * 根据真实地图数据创建高质量、细节丰富的校园场景
 */

import * as THREE from 'three'
import detailedCampusData from '../data/detailedCampusData.js'

/**
 * 创建高质量建筑模型
 * @param {Object} data - 建筑数据
 * @returns {THREE.Group} 建筑组
 */
export function createHighQualityBuilding(data) {
  const group = new THREE.Group()
  
  // 创建纹理生成器
  const textureGenerator = createTextureGenerator()
  
      // 建筑主体 - 性能优化：最小细分
      const geometry = new THREE.BoxGeometry(
        data.size.width,
        data.size.height,
        data.size.depth,
        1, // 从2减少到1，最小细分
        1,
        1
      )
  
  // 高质量PBR材质
  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.6,
    metalness: 0.2,
    emissive: new THREE.Color(data.color).multiplyScalar(0.03),
    envMapIntensity: 1.0,
    normalMap: textureGenerator.brickNormal,
    normalScale: new THREE.Vector2(0.3, 0.3)
  })
  
  const building = new THREE.Mesh(geometry, material)
  building.position.y = data.size.height / 2
  // 性能优化：只有大型建筑投射阴影
  if (data.size.width > 40 || data.size.height > 25) {
    building.castShadow = true
    building.receiveShadow = true
  } else {
    building.castShadow = false
    building.receiveShadow = false
  }
  group.add(building)
  
  // 根据建筑类型创建不同的屋顶
  createRoof(group, data)
  
  // 创建窗户系统（多层、多排）
  createWindows(group, data)
  
  // 创建门（主入口）
  createEntrance(group, data)
  
  // 创建建筑标识
  createBuildingLabel(group, data)
  
  group.position.set(data.position.x, 0, data.position.z)
  group.userData = {
    building: data,
    type: 'building'
  }
  
  return group
}

/**
 * 创建屋顶
 */
function createRoof(group, data) {
  const roofColor = new THREE.Color(data.color).multiplyScalar(0.7)
  
  switch (data.roofType) {
    case 'pitched':
      // 坡屋顶
      const roofGeometry = new THREE.ConeGeometry(
        data.size.width * 0.7,
        data.size.height * 0.3,
        8
      )
      const roofMaterial = new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.8,
        metalness: 0.1
      })
      const roof = new THREE.Mesh(roofGeometry, roofMaterial)
      roof.position.y = data.size.height + data.size.height * 0.15
      roof.rotation.y = Math.PI / 4
      roof.castShadow = true
      group.add(roof)
      break
      
    case 'dome':
      // 圆顶（校史馆）
      const domeGeometry = new THREE.SphereGeometry(
        data.size.width * 0.5,
        32,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      )
      const domeMaterial = new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.3,
        metalness: 0.7
      })
      const dome = new THREE.Mesh(domeGeometry, domeMaterial)
      dome.position.y = data.size.height
      dome.scale.y = 0.6
      dome.castShadow = true
      group.add(dome)
      break
      
    case 'modern':
      // 现代风格屋顶（多段式）
      for (let i = 0; i < 3; i++) {
        const segmentGeometry = new THREE.BoxGeometry(
          data.size.width * 0.9,
          data.size.height * 0.1,
          data.size.depth * 0.3
        )
        const segmentMaterial = new THREE.MeshStandardMaterial({
          color: roofColor,
          roughness: 0.4,
          metalness: 0.4
        })
        const segment = new THREE.Mesh(segmentGeometry, segmentMaterial)
        segment.position.y = data.size.height + (i * data.size.height * 0.05)
        segment.position.z = (i - 1) * (data.size.depth * 0.25)
        segment.castShadow = true
        group.add(segment)
      }
      break
      
    case 'garden':
      // 花园（低矮，绿色）
      const gardenGeometry = new THREE.BoxGeometry(
        data.size.width,
        data.size.height,
        data.size.depth
      )
      const gardenMaterial = new THREE.MeshStandardMaterial({
        color: 0x90EE90,
        roughness: 0.9
      })
      const garden = new THREE.Mesh(gardenGeometry, gardenMaterial)
      garden.position.y = data.size.height / 2
      group.add(garden)
      
      // 添加树木装饰
      for (let i = 0; i < 15; i++) {
        const tree = createTree()
        tree.position.set(
          (Math.random() - 0.5) * data.size.width * 0.8,
          0,
          (Math.random() - 0.5) * data.size.depth * 0.8
        )
        group.add(tree)
      }
      break
      
    default:
      // 平屋顶
      const flatRoofGeometry = new THREE.BoxGeometry(
        data.size.width * 1.05,
        data.size.height * 0.1,
        data.size.depth * 1.05
      )
      const flatRoofMaterial = new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.9
      })
      const flatRoof = new THREE.Mesh(flatRoofGeometry, flatRoofMaterial)
      flatRoof.position.y = data.size.height
      flatRoof.castShadow = true
      group.add(flatRoof)
  }
}

/**
 * 创建窗户系统（性能优化：减少窗户数量）
 */
function createWindows(group, data) {
  // 性能优化：完全禁用窗户以大幅提升性能
  return
}

/**
 * 创建入口
 */
function createEntrance(group, data) {
  if (data.type === 'landscape') return
  
  const entranceGeometry = new THREE.BoxGeometry(4, 6, 0.5)
  const entranceMaterial = new THREE.MeshStandardMaterial({
    color: 0x654321,
    roughness: 0.7,
    metalness: 0.1
  })
  const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial)
  entrance.position.set(0, 3, data.size.depth / 2 + 0.25)
  group.add(entrance)
}

/**
 * 创建建筑标签（3D文字位置）
 */
function createBuildingLabel(group, data) {
  // 创建不可见的碰撞检测盒子
  const labelGeometry = new THREE.BoxGeometry(
    data.size.width + 4,
    4,
    data.size.depth + 4
  )
  const labelMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    visible: false
  })
  const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial)
  labelMesh.position.y = 2
  labelMesh.userData = { building: data }
  group.add(labelMesh)
}

/**
 * 创建纹理生成器
 */
function createTextureGenerator() {
  // 砖墙法线贴图（程序生成）
  const brickNormal = new THREE.DataTexture(
    new Uint8Array(64 * 64).map((_, i) => {
      const x = i % 64
      const y = Math.floor(i / 64)
      return Math.sin(x * 0.2) * Math.cos(y * 0.2) * 128 + 128
    }),
    64,
    64,
    THREE.LuminanceFormat
  )
  brickNormal.needsUpdate = true
  brickNormal.wrapS = THREE.RepeatWrapping
  brickNormal.wrapT = THREE.RepeatWrapping
  
  return { brickNormal }
}

/**
 * 创建单个树木
 * @param {THREE.Vector3} position - 树木位置（可选）
 */
export function createTree(position = null) {
  const treeGroup = new THREE.Group()
  
  // 树干
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.6, 4, 8)
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
  trunk.position.y = 2
  // 性能优化：禁用树木阴影投射以大幅提升性能
  trunk.castShadow = false
  treeGroup.add(trunk)
  
  // 树冠（多层，减少层数以提升性能）
  for (let i = 0; i < 2; i++) { // 从3层减少到2层
    const crownGeometry = new THREE.ConeGeometry(
      2 - i * 0.4,
      3 - i * 0.8,
      6 // 从8减少到6，减少几何复杂度
    )
    const crownMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x228B22).lerp(new THREE.Color(0x32CD32), i * 0.3)
    })
    const crown = new THREE.Mesh(crownGeometry, crownMaterial)
    crown.position.y = 4 + i * 2.5
    // 性能优化：禁用树木阴影投射以大幅提升性能
    crown.castShadow = false
    treeGroup.add(crown)
  }
  
  // 如果提供了位置，设置位置
  if (position) {
    treeGroup.position.copy(position)
  }
  
  return treeGroup
}

/**
 * 创建高质量道路
 */
export function createHighQualityRoad(path, width) {
  const roadGroup = new THREE.Group()
  
  // 创建道路网格
  const points = path.map(p => new THREE.Vector3(p[0], 0.02, p[1]))
  const curve = new THREE.CatmullRomCurve3(points)
  
  const roadGeometry = new THREE.TubeGeometry(curve, 64, width / 2, 8, false)
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.8,
    metalness: 0.1
  })
  const road = new THREE.Mesh(roadGeometry, roadMaterial)
  road.receiveShadow = true
  roadGroup.add(road)
  
  // 添加道路标线
  const lineGeometry = new THREE.TubeGeometry(curve, 64, 0.2, 4, false)
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFF00,
    emissive: 0xFFFF00,
    emissiveIntensity: 0.3
  })
  const centerLine = new THREE.Mesh(lineGeometry, lineMaterial)
  centerLine.position.y = 0.03
  roadGroup.add(centerLine)
  
  return roadGroup
}

/**
 * 创建高质量河流
 */
export function createHighQualityRiver(riverData) {
  const riverGroup = new THREE.Group()
  
  // 创建更弯曲的平滑曲线路径（使用CatmullRom曲线，增加中间控制点）
  const originalPoints = riverData.path.map(p => new THREE.Vector3(p[0], 0, p[1]))
  
  // 添加中间控制点，使河流更弯曲自然
  const curvedPoints = []
  for (let i = 0; i < originalPoints.length - 1; i++) {
    const p1 = originalPoints[i]
    const p2 = originalPoints[i + 1]
    
    // 添加起点
    if (i === 0) {
      curvedPoints.push(p1)
    }
    
    // 在两点之间添加弯曲的控制点
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
    
    // 计算垂直于两点连线的方向，用于创建弯曲
    const direction = new THREE.Vector3().subVectors(p2, p1).normalize()
    const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)
    
    // 添加弯曲幅度（交替方向，使河流呈现S型弯曲）
    const bendSign = (i % 2 === 0 ? 1 : -1) // 交替弯曲方向
    const bendAmount = 60 + Math.sin(i) * 30 // 60-90单位的弯曲，带波动
    const curvedMid = mid.clone().add(perpendicular.multiplyScalar(bendAmount * bendSign))
    
    curvedPoints.push(curvedMid)
    
    // 如果不是最后一个点，添加终点
    if (i === originalPoints.length - 2) {
      curvedPoints.push(p2)
    }
  }
  
  // 使用CatmullRom曲线，张力参数调小以增加弯曲（0.3 = 更弯曲）
  const curve = new THREE.CatmullRomCurve3(curvedPoints, false, 'catmullrom', 0.3)
  
  // 更蓝的河流颜色
  const riverBottomColor = 0x4682B4 // 钢蓝色底部
  const waterBlue = 0x1E90FF // 道奇蓝（更蓝）
  const brightBlue = 0x00BFFF // 深天蓝（水面的高光）
  
  // 河床（深蓝色底部）
  const riverGeometry = new THREE.TubeGeometry(curve, 128, riverData.width / 2, 16, false)
  const riverMaterial = new THREE.MeshStandardMaterial({
    color: riverBottomColor,
    roughness: 0.9,
    metalness: 0.1
  })
  const river = new THREE.Mesh(riverGeometry, riverMaterial)
  river.receiveShadow = true
  riverGroup.add(river)
  
  // 水面（更蓝，半透明，带反射效果）
  const waterGeometry = new THREE.TubeGeometry(curve, 128, riverData.width / 2, 16, false)
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: waterBlue, // 使用更蓝的颜色
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    metalness: 0.8,
    emissive: new THREE.Color(brightBlue).multiplyScalar(0.15), // 增加蓝色发光效果
    side: THREE.DoubleSide
  })
  const water = new THREE.Mesh(waterGeometry, waterMaterial)
  water.position.y = 0.1
  water.receiveShadow = true
  riverGroup.add(water)
  
  // 河岸（添加一些装饰）- 使用原始点或曲线上的采样点
  const samplePoints = curve.getPoints(20) // 从曲线上采样20个点
  for (let i = 0; i < samplePoints.length; i += 3) { // 每隔3个点放置一棵树
    const point = samplePoints[i]
    const tree = createTree()
    tree.position.copy(point)
    tree.position.y = 0
    tree.scale.set(0.8, 0.8, 0.8)
    // 在垂直于河流方向随机偏移
    tree.position.x += (Math.random() - 0.5) * riverData.width * 0.8
    tree.position.z += (Math.random() - 0.5) * riverData.width * 0.8
    riverGroup.add(tree)
  }
  
  return riverGroup
}

/**
 * 创建高质量绿地
 */
export function createHighQualityPark(parkData) {
  const parkGroup = new THREE.Group()
  
  // 地面
  const groundGeometry = new THREE.PlaneGeometry(parkData.size.width, parkData.size.depth)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x90EE90,
    roughness: 0.9
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0.01
  ground.receiveShadow = true
  parkGroup.add(ground)
  
  // 性能优化：完全移除公园树木以大幅提升性能
  const treeCount = 0 // 完全移除树木
  for (let i = 0; i < treeCount; i++) {
    const tree = createTree()
    tree.position.set(
      (Math.random() - 0.5) * parkData.size.width * 0.8,
      0,
      (Math.random() - 0.5) * parkData.size.depth * 0.8
    )
    tree.scale.set(
      0.7 + Math.random() * 0.6,
      0.7 + Math.random() * 0.6,
      0.7 + Math.random() * 0.6
    )
    parkGroup.add(tree)
  }
  
  parkGroup.position.set(parkData.position.x, 0, parkData.position.z)
  
  return parkGroup
}

/**
 * 创建标准的椭圆形田径场（真实尺寸）
 * 标准400米田径场：椭圆跑道 + 中间矩形足球场
 */
export function createStadium(stadiumData) {
  const stadiumGroup = new THREE.Group()
  
  // 标准400米田径场尺寸（按比例）
  // 椭圆长轴（跑道直道部分）
  const straightLength = Math.min(stadiumData.size.width, stadiumData.size.depth) * 0.5
  // 椭圆短轴（跑道弯道部分）
  const curveLength = Math.min(stadiumData.size.width, stadiumData.size.depth) * 0.35
  
  // 中间的足球场尺寸（矩形）
  const fieldLength = straightLength * 0.9 // 足球场长度
  const fieldWidth = curveLength * 1.2 // 足球场宽度
  
  // 椭圆形跑道（内圈和外圈）
  const trackInnerSemiMajor = straightLength / 2 // 内圈长半轴
  const trackInnerSemiMinor = curveLength / 2 // 内圈短半轴
  const trackWidth = 10 // 跑道宽度
  const trackOuterSemiMajor = trackInnerSemiMajor + trackWidth // 外圈长半轴
  const trackOuterSemiMinor = trackInnerSemiMinor + trackWidth // 外圈短半轴
  
  // ===== 1. 场地基础地面（立体的，有足够厚度避免闪烁）=====
  const groundHeight = 1.0 // 增加地面厚度，避免闪烁
  const groundGeometry = new THREE.BoxGeometry(
    stadiumData.size.width, 
    groundHeight, 
    stadiumData.size.depth
  )
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x7CB342, // 更自然的草地绿色
    roughness: 0.95,
    metalness: 0.0
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.position.y = groundHeight / 2 // 底部对齐到0
  ground.receiveShadow = true
  ground.castShadow = true
  stadiumGroup.add(ground)
  
  // ===== 2. 椭圆形跑道（立体，有足够厚度避免闪烁）=====
  const trackThickness = 0.25 // 增加跑道厚度，确保立体感
  
  // 创建椭圆形跑道（外椭圆减去内椭圆）
  const trackShape = new THREE.Shape()
  const trackHole = new THREE.Path()
  
  // 外椭圆（跑道外圈）
  const trackSegments = 128 // 增加细分度，更圆滑
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * trackOuterSemiMajor
    const z = Math.sin(angle) * trackOuterSemiMinor
    if (i === 0) {
      trackShape.moveTo(x, z)
    } else {
      trackShape.lineTo(x, z)
    }
  }
  
  // 内椭圆（孔，跑道内圈，与足球场连接）
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * trackInnerSemiMajor
    const z = Math.sin(angle) * trackInnerSemiMinor
    if (i === 0) {
      trackHole.moveTo(x, z)
    } else {
      trackHole.lineTo(x, z)
    }
  }
  trackShape.holes.push(trackHole)
  
  // 使用ExtrudeGeometry创建立体的椭圆形跑道
  const trackGeometry = new THREE.ExtrudeGeometry(trackShape, {
    depth: trackThickness,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
    curveSegments: trackSegments
  })
  trackGeometry.rotateX(-Math.PI / 2)
  
  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0xC62828, // 鲜红色塑胶跑道
    roughness: 0.6, // 更光滑，模拟塑胶材质
    metalness: 0.0
  })
  const track = new THREE.Mesh(trackGeometry, trackMaterial)
  track.position.y = groundHeight + trackThickness / 2 // 在地面上方，形成立体跑道
  track.receiveShadow = true
  track.castShadow = true
  stadiumGroup.add(track)
  
  // ===== 3. 跑道分道线（立体的椭圆形白色标线）=====
  const lineHeight = 0.05 // 增加标线高度，更立体
  const lineThickness = 0.2
  
  // 内圈线（椭圆形内圈）
  const innerLineShape = new THREE.Shape()
  const innerLineHole = new THREE.Path()
  
  // 外椭圆（内圈线外侧）
  const innerLineOuterSemiMajor = trackInnerSemiMajor + lineThickness
  const innerLineOuterSemiMinor = trackInnerSemiMinor + lineThickness
  
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * innerLineOuterSemiMajor
    const z = Math.sin(angle) * innerLineOuterSemiMinor
    if (i === 0) {
      innerLineShape.moveTo(x, z)
    } else {
      innerLineShape.lineTo(x, z)
    }
  }
  
  // 内椭圆（孔）
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * trackInnerSemiMajor
    const z = Math.sin(angle) * trackInnerSemiMinor
    if (i === 0) {
      innerLineHole.moveTo(x, z)
    } else {
      innerLineHole.lineTo(x, z)
    }
  }
  innerLineShape.holes.push(innerLineHole)
  
  const innerLineGeometry = new THREE.ExtrudeGeometry(innerLineShape, {
    depth: lineHeight,
    bevelEnabled: false,
    curveSegments: trackSegments
  })
  innerLineGeometry.rotateX(-Math.PI / 2)
  
  const innerLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.3,
    metalness: 0.5,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.2
  })
  const innerLine = new THREE.Mesh(innerLineGeometry, innerLineMaterial)
  innerLine.position.y = groundHeight + trackThickness + lineHeight / 2 // 在跑道上方
  innerLine.castShadow = true
  stadiumGroup.add(innerLine)
  
  // 外圈线（椭圆形外圈）
  const outerLineShape = new THREE.Shape()
  const outerLineHole = new THREE.Path()
  
  // 外椭圆（外圈线外侧）
  const outerLineOuterSemiMajor = trackOuterSemiMajor
  const outerLineOuterSemiMinor = trackOuterSemiMinor
  // 内椭圆（外圈线内侧）
  const outerLineInnerSemiMajor = trackOuterSemiMajor - lineThickness
  const outerLineInnerSemiMinor = trackOuterSemiMinor - lineThickness
  
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * outerLineOuterSemiMajor
    const z = Math.sin(angle) * outerLineOuterSemiMinor
    if (i === 0) {
      outerLineShape.moveTo(x, z)
    } else {
      outerLineShape.lineTo(x, z)
    }
  }
  
  for (let i = 0; i <= trackSegments; i++) {
    const angle = (i / trackSegments) * Math.PI * 2
    const x = Math.cos(angle) * outerLineInnerSemiMajor
    const z = Math.sin(angle) * outerLineInnerSemiMinor
    if (i === 0) {
      outerLineHole.moveTo(x, z)
    } else {
      outerLineHole.lineTo(x, z)
    }
  }
  outerLineShape.holes.push(outerLineHole)
  
  const outerLineGeometry = new THREE.ExtrudeGeometry(outerLineShape, {
    depth: lineHeight,
    bevelEnabled: false,
    curveSegments: trackSegments
  })
  outerLineGeometry.rotateX(-Math.PI / 2)
  
  const outerLine = new THREE.Mesh(outerLineGeometry, innerLineMaterial)
  outerLine.position.y = groundHeight + trackThickness + lineHeight / 2 // 在跑道上方
  outerLine.castShadow = true
  stadiumGroup.add(outerLine)
  
  // ===== 4. 中央足球场草坪（矩形，与椭圆形跑道内圈完美连接）=====
  // 使用矩形足球场，与椭圆形跑道内圈连接
  const fieldThickness = 0.2 // 增加草坪厚度，确保立体感和避免闪烁
  
  // 创建矩形足球场（与跑道内圈连接）
  const fieldShape = new THREE.Shape()
  fieldShape.moveTo(-fieldLength / 2, -fieldWidth / 2)
  fieldShape.lineTo(fieldLength / 2, -fieldWidth / 2)
  fieldShape.lineTo(fieldLength / 2, fieldWidth / 2)
  fieldShape.lineTo(-fieldLength / 2, fieldWidth / 2)
  fieldShape.closePath()
  
  // 创建草坪纹理（程序生成）
  const grassTextureSize = 256 // 提高分辨率
  const grassCanvas = document.createElement('canvas')
  grassCanvas.width = grassTextureSize
  grassCanvas.height = grassTextureSize
  const grassContext = grassCanvas.getContext('2d')
  
  // 绘制草坪纹理（径向渐变 + 随机草地点，更自然）
  const centerX = grassTextureSize / 2
  const centerY = grassTextureSize / 2
  const gradient = grassContext.createRadialGradient(centerX, centerY, 0, centerX, centerY, grassTextureSize / 2)
  gradient.addColorStop(0, '#66BB6A') // 中心稍亮
  gradient.addColorStop(0.5, '#4CAF50')
  gradient.addColorStop(1, '#388E3C') // 边缘稍深
  grassContext.fillStyle = gradient
  grassContext.fillRect(0, 0, grassTextureSize, grassTextureSize)
  
  // 添加随机草地点（更多，更自然）
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * grassTextureSize
    const y = Math.random() * grassTextureSize
    const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
    const maxDist = grassTextureSize / 2
    
    // 在边缘区域添加更多变化
    const alpha = 0.2 + (distFromCenter / maxDist) * 0.3
    grassContext.fillStyle = `rgba(${40 + Math.random() * 40}, ${140 + Math.random() * 60}, ${40 + Math.random() * 40}, ${alpha})`
    grassContext.beginPath()
    grassContext.arc(x, y, Math.random() * 4 + 1, 0, Math.PI * 2)
    grassContext.fill()
  }
  
  const grassTexture = new THREE.CanvasTexture(grassCanvas)
  grassTexture.wrapS = THREE.RepeatWrapping
  grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(3, 3)
  
  // 使用ExtrudeGeometry创建有足够厚度的草坪（与跑道连接）
  const fieldExtrudeGeometry = new THREE.ExtrudeGeometry(fieldShape, {
    depth: fieldThickness,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    curveSegments: 32
  })
  fieldExtrudeGeometry.rotateX(-Math.PI / 2)
  
  const fieldMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    color: 0x4CAF50,
    roughness: 0.95,
    metalness: 0.0
  })
  const field = new THREE.Mesh(fieldExtrudeGeometry, fieldMaterial)
  // 草坪高度与跑道内圈高度相同，确保完美连接
  field.position.y = groundHeight + trackThickness / 2 // 与跑道同一高度，完美连接
  field.receiveShadow = true
  field.castShadow = true
  stadiumGroup.add(field)
  
  // ===== 5. 足球场标线（矩形边线，立体的）=====
  const fieldLineHeight = 0.05 // 足球场标线高度
  const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xFFFFFF,
    emissiveIntensity: 0.3,
    side: THREE.DoubleSide
  })
  
  // 足球场边线（矩形，立体的）
  const borderLineWidth = 0.3
  const fieldLineShape = new THREE.Shape()
  fieldLineShape.moveTo(-fieldLength / 2 - borderLineWidth / 2, -fieldWidth / 2 - borderLineWidth / 2)
  fieldLineShape.lineTo(fieldLength / 2 + borderLineWidth / 2, -fieldWidth / 2 - borderLineWidth / 2)
  fieldLineShape.lineTo(fieldLength / 2 + borderLineWidth / 2, fieldWidth / 2 + borderLineWidth / 2)
  fieldLineShape.lineTo(-fieldLength / 2 - borderLineWidth / 2, fieldWidth / 2 + borderLineWidth / 2)
  fieldLineShape.closePath()
  
  // 内框（孔）
  const fieldLineHole = new THREE.Path()
  fieldLineHole.moveTo(-fieldLength / 2 + borderLineWidth / 2, -fieldWidth / 2 + borderLineWidth / 2)
  fieldLineHole.lineTo(fieldLength / 2 - borderLineWidth / 2, -fieldWidth / 2 + borderLineWidth / 2)
  fieldLineHole.lineTo(fieldLength / 2 - borderLineWidth / 2, fieldWidth / 2 - borderLineWidth / 2)
  fieldLineHole.lineTo(-fieldLength / 2 + borderLineWidth / 2, fieldWidth / 2 - borderLineWidth / 2)
  fieldLineHole.closePath()
  fieldLineShape.holes.push(fieldLineHole)
  
  const fieldLineGeometry = new THREE.ExtrudeGeometry(fieldLineShape, {
    depth: fieldLineHeight,
    bevelEnabled: false
  })
  fieldLineGeometry.rotateX(-Math.PI / 2)
  
  const fieldLine = new THREE.Mesh(fieldLineGeometry, lineMaterial)
  fieldLine.position.y = groundHeight + trackThickness + fieldLineHeight / 2 // 在草坪上方
  fieldLine.castShadow = true
  stadiumGroup.add(fieldLine)
  
  // 中圈（圆形）
  const centerCircleRadius = fieldLength * 0.15
  const centerCircleShape = new THREE.Shape()
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    const x = Math.cos(angle) * centerCircleRadius
    const z = Math.sin(angle) * centerCircleRadius
    if (i === 0) {
      centerCircleShape.moveTo(x, z)
    } else {
      centerCircleShape.lineTo(x, z)
    }
  }
  
  const centerCircleGeometry = new THREE.ExtrudeGeometry(centerCircleShape, {
    depth: fieldLineHeight,
    bevelEnabled: false,
    curveSegments: 64
  })
  centerCircleGeometry.rotateX(-Math.PI / 2)
  
  const centerCircle = new THREE.Mesh(centerCircleGeometry, lineMaterial)
  centerCircle.position.y = groundHeight + trackThickness + fieldLineHeight / 2
  centerCircle.castShadow = true
  stadiumGroup.add(centerCircle)
  
  // 中心点（圆形）
  const centerDotRadius = 0.8
  const centerDotShape = new THREE.Shape()
  for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2
    const x = Math.cos(angle) * centerDotRadius
    const z = Math.sin(angle) * centerDotRadius
    if (i === 0) {
      centerDotShape.moveTo(x, z)
    } else {
      centerDotShape.lineTo(x, z)
    }
  }
  
  const centerDotGeometry = new THREE.ExtrudeGeometry(centerDotShape, {
    depth: fieldLineHeight,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    curveSegments: 32
  })
  centerDotGeometry.rotateX(-Math.PI / 2)
  
  const centerDot = new THREE.Mesh(centerDotGeometry, lineMaterial)
  centerDot.position.y = groundHeight + trackThickness + fieldLineHeight / 2
  centerDot.castShadow = true
  stadiumGroup.add(centerDot)
  
  // 中轴线（矩形线）
  const centerLineWidth = 0.25
  const centerLineShape = new THREE.Shape()
  centerLineShape.moveTo(-centerLineWidth / 2, -fieldWidth / 2)
  centerLineShape.lineTo(centerLineWidth / 2, -fieldWidth / 2)
  centerLineShape.lineTo(centerLineWidth / 2, fieldWidth / 2)
  centerLineShape.lineTo(-centerLineWidth / 2, fieldWidth / 2)
  centerLineShape.closePath()
  
  const centerLineGeometry = new THREE.ExtrudeGeometry(centerLineShape, {
    depth: fieldLineHeight,
    bevelEnabled: false
  })
  centerLineGeometry.rotateX(-Math.PI / 2)
  
  const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial)
  centerLine.position.y = groundHeight + trackThickness + fieldLineHeight / 2
  centerLine.castShadow = true
  stadiumGroup.add(centerLine)
  
  // ===== 6. 跑道起点标记（椭圆形起点线）=====
  const startMarkThickness = 0.06
  // 在椭圆形跑道的起点位置添加标记线
  const startMarkShape = new THREE.Shape()
  startMarkShape.moveTo(-1, -trackOuterSemiMinor * 0.8)
  startMarkShape.lineTo(1, -trackOuterSemiMinor * 0.8)
  startMarkShape.lineTo(1, -trackOuterSemiMinor * 1.2)
  startMarkShape.lineTo(-1, -trackOuterSemiMinor * 1.2)
  startMarkShape.closePath()
  
  const startMarkGeometry = new THREE.ExtrudeGeometry(startMarkShape, {
    depth: startMarkThickness,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02
  })
  startMarkGeometry.rotateX(-Math.PI / 2)
  
  const startMarkMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFD700, // 金色起点标记
    roughness: 0.4,
    metalness: 0.6,
    emissive: 0xFFD700,
    emissiveIntensity: 0.2
  })
  const startMark = new THREE.Mesh(startMarkGeometry, startMarkMaterial)
  startMark.position.set(0, groundHeight + trackThickness + startMarkThickness / 2, -trackOuterSemiMinor * 0.98)
  startMark.castShadow = true
  stadiumGroup.add(startMark)
  
  // ===== 7. 跑道分道线（在椭圆跑道上的标记点）=====
  const laneMarkHeight = 0.04
  const laneMarkRadius = 0.3
  
  // 在椭圆跑道上的关键位置添加分道线标记
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    // 计算椭圆上的点位置
    const radius = trackInnerSemiMajor + trackWidth / 2
    const x = Math.cos(angle) * trackInnerSemiMajor
    const z = Math.sin(angle) * trackInnerSemiMinor
    
    // 创建立体的圆形标记（圆柱体）
    const laneMarkShape = new THREE.Shape()
    for (let j = 0; j <= 16; j++) {
      const markAngle = (j / 16) * Math.PI * 2
      const markX = Math.cos(markAngle) * laneMarkRadius
      const markZ = Math.sin(markAngle) * laneMarkRadius
      if (j === 0) {
        laneMarkShape.moveTo(markX, markZ)
      } else {
        laneMarkShape.lineTo(markX, markZ)
      }
    }
    
    const laneMarkGeometry = new THREE.ExtrudeGeometry(laneMarkShape, {
      depth: laneMarkHeight,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      curveSegments: 16
    })
    laneMarkGeometry.rotateX(-Math.PI / 2)
    
    const laneMarkMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0xFFFFFF,
      emissiveIntensity: 0.2
    })
    const laneMark = new THREE.Mesh(laneMarkGeometry, laneMarkMaterial)
    laneMark.position.set(
      x,
      groundHeight + trackThickness + laneMarkHeight / 2,
      z
    )
    laneMark.castShadow = true
    stadiumGroup.add(laneMark)
  }
  
  stadiumGroup.position.set(stadiumData.position.x, 0, stadiumData.position.z)
  
  return stadiumGroup
}

// 注意：所有函数都已经通过 export function 单独导出了，不需要在这里重复导出
// - createHighQualityBuilding (第14行)
// - createHighQualityRoad (第352行)
// - createHighQualityRiver (第386行)
// - createHighQualityPark (第437行)
// - createTree (第314行)
// - createStadium (第477行)

// 导出详细数据
export { detailedCampusData as default }

