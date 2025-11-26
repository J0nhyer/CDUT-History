<template>
  <div class="keyword-rain-3d">
    <div ref="container" class="canvas-container"></div>
    
    <!-- 返回按钮 -->
    <button class="back-button" @click.stop.prevent="goBack" @mousedown.stop.prevent="goBack">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- 标题 -->
    <div class="title-overlay">
      <h1>词林雨露 3D</h1>
      <p>WASD移动 | 鼠标控制视角 | 点击关键词查看详情</p>
    </div>

    <!-- 控制说明 -->
    <div class="controls-hint">
      <div class="hint-item"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 移动</div>
      <div class="hint-item"><kbd>空格</kbd> 跳跃</div>
      <div class="hint-item"><kbd>鼠标</kbd> 视角</div>
      <div class="hint-item"><kbd>点击</kbd> 接住</div>
      <div class="hint-item"><kbd>ESC</kbd> 解锁</div>
      <div class="hint-item"><kbd>Q</kbd> 返回</div>
      <div class="hint-item">接住: {{ caughtCount }}</div>
      <div class="hint-item">位置: X:{{ playerPos.x }} Z:{{ playerPos.z }}</div>
      <div class="hint-item">关键词: {{ keywordMeshes.length }}</div>
      <div class="hint-item" :class="{ active: isGrounded }">{{ isGrounded ? '🚶 地面' : '🪂 空中' }}</div>
      <div class="hint-item" :class="{ active: isLocked }">{{ isLocked ? '🔒 已锁定' : '🔓 未锁定' }}</div>
    </div>
    
    <!-- 准星 -->
    <div class="crosshair"></div>

    <!-- 学院信息弹窗 -->
    <div class="institute-modal" v-if="selectedInstitute" @click="closeInstitute">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeInstitute">×</button>
        <div class="institute-info">
          <h2>{{ selectedInstitute.name }}</h2>
          <p class="title" v-if="selectedInstitute.title">{{ selectedInstitute.title }}</p>
          <div class="description" v-if="selectedInstitute.description">{{ selectedInstitute.description }}</div>
        </div>
      </div>
    </div>

    <!-- 专业信息弹窗 -->
    <div class="major-modal" v-if="selectedMajor" @click="closeMajor">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeMajor">×</button>
        <div class="major-info">
          <h2>{{ selectedMajor.name }}</h2>
          <p class="major-level" v-if="selectedMajor.level">层次：{{ selectedMajor.level }}</p>
          <div class="description" v-if="selectedMajor.description">{{ selectedMajor.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import axios from 'axios';
import { markRaw } from 'vue';

export default {
  name: 'KeywordRain3D',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      keywords: [],
      keywordMeshes: [],
      caughtCount: 0,
      playerPos: { x: 0, z: 0 },
      
      // 移动控制
      moveState: {
        forward: false,
        backward: false,
        left: false,
        right: false
      },
      velocity: null,
      direction: null,
      
      // 鼠标控制
      euler: null,
      isLocked: false,
      
      // 射线检测 - 在mounted中初始化
      raycaster: null,
      mouse: null,
      
      animationId: null,
      rainSystem: null,
      selectedInstitute: null,
      selectedMajor: null,
      
      // 物理系统
      gravity: -6.67,
      verticalVelocity: 0,
      isGrounded: true,
      playerHeight: 1.8,
      playerRadius: 0.4,
      jumpForce: 2.67,
      canJump: true,
      buildings: []
    };
  },
  mounted() {
    console.log('🚀 3D词林雨露加载中...');
    // 初始化Three.js对象，使用markRaw防止响应式
    this.velocity = markRaw(new THREE.Vector3());
    this.direction = markRaw(new THREE.Vector3());
    this.euler = markRaw(new THREE.Euler(0, 0, 0, 'YXZ'));
    this.raycaster = markRaw(new THREE.Raycaster());
    this.mouse = markRaw(new THREE.Vector2());
    
    this.init();
    this.loadKeywords();
    this.setupControls();
    this.animate();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    init() {
      const container = this.$refs.container;
      
      // 场景 - 使用markRaw防止Vue响应式包装
      this.scene = markRaw(new THREE.Scene());
      this.scene.background = new THREE.Color(0x0a1428);
      this.scene.fog = new THREE.Fog(0x0a1428, 10, 100);
      
      // 相机 (第一人称视角)
      this.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      ));
      this.camera.position.set(0, this.playerHeight, 0); // 玩家高度1.8米（眼睛高度）
      
      // 渲染器
      this.renderer = markRaw(new THREE.WebGLRenderer({ antialias: true }));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);
      
      // 光照
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight.position.set(10, 50, 10);
      this.scene.add(directionalLight);
      
      // 地面
      this.createGround();
      
      // 天空球
      this.createSkybox();
      
      // 道路系统
      this.createRoads();
      
      // 建筑物
      this.createBuildings();
      
      // 初始化碰撞盒
      this.initCollisionBoxes();
      
      // 雨滴效果
      this.createRainEffect();
      
      // 粒子背景
      this.createParticles();
      
      // 窗口resize
      window.addEventListener('resize', this.onWindowResize);
    },
    
    createGround() {
      // 草地地面（方块化纹理）
      const geometry = new THREE.PlaneGeometry(200, 200);
      const material = new THREE.MeshStandardMaterial({
        color: 0x2d5016, // 草地绿
        roughness: 1.0,
        metalness: 0
      });
      const ground = new THREE.Mesh(geometry, material);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = 0;
      ground.receiveShadow = true;
      this.scene.add(ground);
      
      // 方块网格
      const gridHelper = new THREE.GridHelper(200, 100, 0x1a3a0a, 0x1a3a0a);
      gridHelper.position.y = 0.01;
      this.scene.add(gridHelper);
    },
    
    createSkybox() {
      const geometry = new THREE.SphereGeometry(500, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x0a1428,
        side: THREE.BackSide
      });
      const skybox = new THREE.Mesh(geometry, material);
      this.scene.add(skybox);
    },
    
    createRoads() {
      // 创建石板路（十字形道路）
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666, // 石板灰
        roughness: 0.9
      });
      
      // 主干道（东西向）
      const roadEW = new THREE.Mesh(
        new THREE.BoxGeometry(100, 0.2, 6),
        roadMaterial
      );
      roadEW.position.set(0, 0.1, 0);
      this.scene.add(roadEW);
      
      // 主干道（南北向）
      const roadNS = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.2, 100),
        roadMaterial
      );
      roadNS.position.set(0, 0.1, 0);
      this.scene.add(roadNS);
      
      // 路灯
      this.createStreetLights();
    },
    
    createStreetLights() {
      const positions = [
        [-30, 0, -3], [-15, 0, -3], [0, 0, -3], [15, 0, -3], [30, 0, -3],
        [-30, 0, 3], [-15, 0, 3], [15, 0, 3], [30, 0, 3],
        [-3, 0, -30], [-3, 0, -15], [-3, 0, 15], [-3, 0, 30],
        [3, 0, -30], [3, 0, -15], [3, 0, 15], [3, 0, 30]
      ];
      
      positions.forEach(([x, y, z]) => {
        // 路灯柱
        const pole = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 5, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        pole.position.set(x, 2.5, z);
        this.scene.add(pole);
        
        // 路灯头
        const light = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.3, 0.8),
          new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
          })
        );
        light.position.set(x, 5.2, z);
        this.scene.add(light);
        
        // 点光源
        const pointLight = new THREE.PointLight(0xffffaa, 0.5, 15);
        pointLight.position.set(x, 5, z);
        this.scene.add(pointLight);
      });
    },
    
    createBuildings() {
      // 建筑材质
      const materials = [
        new THREE.MeshStandardMaterial({ color: 0x8b4513 }), // 棕色（木头）
        new THREE.MeshStandardMaterial({ color: 0xdc143c }), // 红色（砖）
        new THREE.MeshStandardMaterial({ color: 0x4169e1 }), // 蓝色
        new THREE.MeshStandardMaterial({ color: 0xffa500 })  // 橙色
      ];
      
      // 建筑位置和尺寸
      const buildings = [
        // 左上区域
        { x: -25, z: -25, w: 8, h: 12, d: 8, roof: 0x8b0000 },
        { x: -40, z: -25, w: 6, h: 8, d: 6, roof: 0x006400 },
        { x: -25, z: -40, w: 10, h: 15, d: 10, roof: 0x8b4513 },
        
        // 右上区域
        { x: 25, z: -25, w: 7, h: 10, d: 7, roof: 0x4169e1 },
        { x: 40, z: -25, w: 9, h: 13, d: 9, roof: 0xdc143c },
        { x: 25, z: -40, w: 6, h: 9, d: 6, roof: 0xffa500 },
        
        // 左下区域
        { x: -25, z: 25, w: 8, h: 11, d: 8, roof: 0x2f4f4f },
        { x: -40, z: 25, w: 7, h: 14, d: 7, roof: 0x8b0000 },
        { x: -25, z: 40, w: 9, h: 10, d: 9, roof: 0x006400 },
        
        // 右下区域
        { x: 25, z: 25, w: 6, h: 12, d: 6, roof: 0x4169e1 },
        { x: 40, z: 25, w: 10, h: 9, d: 10, roof: 0x8b4513 },
        { x: 25, z: 40, w: 8, h: 13, d: 8, roof: 0xdc143c }
      ];
      
      buildings.forEach((b, i) => {
        // 建筑主体
        const building = new THREE.Mesh(
          new THREE.BoxGeometry(b.w, b.h, b.d),
          materials[i % materials.length]
        );
        building.position.set(b.x, b.h / 2, b.z);
        building.castShadow = true;
        this.scene.add(building);
        
        // 屋顶（金字塔形）
        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(b.w * 0.7, 3, 4),
          new THREE.MeshStandardMaterial({ color: b.roof })
        );
        roof.rotation.y = Math.PI / 4;
        roof.position.set(b.x, b.h + 1.5, b.z);
        this.scene.add(roof);
        
        // 窗户
        for (let j = 0; j < 3; j++) {
          const window1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.5, 0.1),
            new THREE.MeshStandardMaterial({
              color: 0xffff00,
              emissive: 0xffaa00,
              emissiveIntensity: 0.3
            })
          );
          window1.position.set(b.x + b.w/2 + 0.05, 2 + j * 3, b.z);
          this.scene.add(window1);
        }
      });
    },
    
    createRainEffect() {
      // 创建雨滴粒子系统（减少数量提高性能）
      const rainCount = 800; // 从2000减少到80%
      const rainGeometry = new THREE.BufferGeometry();
      const rainPositions = new Float32Array(rainCount * 3);
      const rainVelocities = [];
      
      for (let i = 0; i < rainCount; i++) {
        rainPositions[i * 3] = (Math.random() - 0.5) * 100;
        rainPositions[i * 3 + 1] = Math.random() * 50;
        rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        rainVelocities.push(-0.2 - Math.random() * 0.2); // 降低背景雨滴速度
      }
      
      rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
      
      const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaff,
        size: 0.12,
        transparent: true,
        opacity: 0.5
      });
      
      const rain = markRaw(new THREE.Points(rainGeometry, rainMaterial));
      rain.userData.velocities = rainVelocities;
      this.scene.add(rain);
      
      // 保存雨滴引用用于动画
      this.rainSystem = rain;
    },
    
    createParticles() {
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 200; // 从500减少到200
      const positions = new Float32Array(particlesCount * 3);
      
      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: 0.4
      });
      
      const particles = markRaw(new THREE.Points(particlesGeometry, particlesMaterial));
      this.scene.add(particles);
    },
    
    async loadKeywords() {
      try {
        const [personsRes, eventsRes, nodesRes, majorsRes] = await Promise.allSettled([
          axios.get('/api/person'),
          axios.get('/api/history/events'),
          axios.get('/api/academic-universe/nodes'),
          axios.get('/api/academic-universe/majors')
        ]);
        
        this.keywords = [];
        
        // 人物
        if (personsRes.status === 'fulfilled' && personsRes.value.data) {
          const personData = Array.isArray(personsRes.value.data) ? personsRes.value.data : [];
          const persons = personData
            .filter(p => p.name && p.personId)
            .map(p => ({
              id: `person-${p.personId}`,
              name: p.name,
              type: 'person',
              route: `/person/${p.personId}`,
              color: 0xffffff
            }));
          this.keywords.push(...persons);
        }
        
        // 事件
        if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
          const eventData = eventsRes.value.data.data || eventsRes.value.data;
          const events = (Array.isArray(eventData) ? eventData : [])
            .filter(e => e.title && e.id)
            .map(e => ({
              id: `event-${e.id}`,
              name: e.title,
              type: 'event',
              route: `/event/${e.year}`,
              color: 0xffd700
            }));
          this.keywords.push(...events);
        }
        
        // 学院
        if (nodesRes.status === 'fulfilled' && nodesRes.value.data) {
          const nodeData = nodesRes.value.data.data || nodesRes.value.data;
          const nodes = (Array.isArray(nodeData) ? nodeData : [])
            .filter(n => n.name && n.nodeId)
            .map(n => ({
              id: `node-${n.nodeId}`,
              name: n.name,
              type: 'institute',
              route: `/academic-universe?node=${n.nodeId}`,
              color: 0x87ceeb
            }));
          this.keywords.push(...nodes);
        }
        
        // 专业
        if (majorsRes.status === 'fulfilled' && majorsRes.value.data) {
          const majorData = Array.isArray(majorsRes.value.data) ? majorsRes.value.data : [];
          const majors = majorData
            .filter(m => m.name && m.majorId)
            .map(m => ({
              id: `major-${m.majorId}`,
              name: m.name,
              type: 'major',
              route: `/academic-universe?major=${m.majorId}`,
              color: 0x98fb98
            }));
          this.keywords.push(...majors);
        }
        
        console.log('✅ 3D关键词数据加载完成:', this.keywords.length);
        this.startKeywordRain();
      } catch (error) {
        console.error('加载失败:', error);
      }
    },
    
    startKeywordRain() {
      // 立即添加一些关键词
      // 初始立即生成3个
      for (let i = 0; i < 3; i++) {
        this.addKeywordMesh();
      }
      
      setInterval(() => {
        // 限制最大数量，避免太多影响性能
        if (this.keywordMeshes.length < 12) {
          this.addKeywordMesh();
        }
      }, 800); // 降低生成频率
    },
    
    addKeywordMesh() {
      if (this.keywords.length === 0) return;
      
      const keyword = this.keywords[Math.floor(Math.random() * this.keywords.length)];
      
      // 创建简单雨滴（只用Sprite，性能最优）
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      
      const size = 128;
      const centerX = 128;
      const centerY = 100;
      
      // 绘制雨滴形状
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.7);
      const colorStr = `#${keyword.color.toString(16).padStart(6, '0')}`;
      gradient.addColorStop(0, colorStr);
      gradient.addColorStop(0.5, colorStr);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      // 雨滴主体（水滴形）
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY - 10, size * 0.4, 0, Math.PI * 2);
      context.fill();
      
      // 尖角部分
      context.beginPath();
      context.moveTo(centerX, centerY + size * 0.5);
      context.lineTo(centerX - size * 0.3, centerY);
      context.lineTo(centerX + size * 0.3, centerY);
      context.closePath();
      context.fill();
      
      // 外边框
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      context.lineWidth = 3;
      context.beginPath();
      context.arc(centerX, centerY - 10, size * 0.4, 0, Math.PI * 2);
      context.stroke();
      
      // 高光
      context.fillStyle = 'rgba(255, 255, 255, 0.6)';
      context.beginPath();
      context.arc(centerX - 15, centerY - 25, 15, 0, Math.PI * 2);
      context.fill();
      
      // 文字
      context.fillStyle = '#ffffff';
      context.font = 'Bold 32px "Microsoft YaHei", Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = 'rgba(0, 0, 0, 0.9)';
      context.shadowBlur = 6;
      context.fillText(keyword.name, centerX, centerY + size * 0.8);
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthTest: true
      });
      
      const sprite = markRaw(new THREE.Sprite(material));
      sprite.scale.set(2.5, 2.5, 1);
      
      // 随机位置
      const playerX = this.camera.position.x;
      const playerZ = this.camera.position.z;
      sprite.position.set(
        playerX + (Math.random() - 0.5) * 60,
        25 + Math.random() * 15,
        playerZ + (Math.random() - 0.5) * 60
      );
      
      sprite.userData = {
        keyword: keyword,
        velocity: -0.03 - Math.random() * 0.02, // 降低关键词雨滴速度
        rotation: (Math.random() - 0.5) * 0.01
      };
      
      this.scene.add(sprite);
      this.keywordMeshes.push(sprite);
      
      console.log(`💧 添加雨滴: ${keyword.name}, 位置: (${sprite.position.x.toFixed(1)}, ${sprite.position.y.toFixed(1)}, ${sprite.position.z.toFixed(1)}), 当前总数: ${this.keywordMeshes.length}`);
    },
    
    setupControls() {
      // 键盘控制
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
      
      // 鼠标控制
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('click', this.onClick);
      
      // 指针锁定
      const container = this.$refs.container;
      container.addEventListener('click', () => {
        container.requestPointerLock();
      });
      
      document.addEventListener('pointerlockchange', () => {
        this.isLocked = document.pointerLockElement === container;
        console.log('🔄 指针锁定状态变化:', this.isLocked ? '已锁定' : '未锁定');
      });
    },
    
    onKeyDown(event) {
      switch (event.code) {
        case 'KeyW': this.moveState.forward = true; break;
        case 'KeyS': this.moveState.backward = true; break;
        case 'KeyA': this.moveState.left = true; break;
        case 'KeyD': this.moveState.right = true; break;
        case 'Space':
          // 空格键跳跃
          event.preventDefault();
          if (this.isGrounded && this.canJump) {
            this.verticalVelocity = this.jumpForce;
            this.isGrounded = false;
            this.canJump = false;
            console.log('🤸 跳跃!');
          }
          break;
        case 'Escape':
          // ESC键退出指针锁定
          if (document.pointerLockElement) {
            document.exitPointerLock();
          }
          break;
        case 'KeyQ':
          // Q键返回首页
          this.goBack();
          break;
      }
    },
    
    onKeyUp(event) {
      switch (event.code) {
        case 'KeyW': this.moveState.forward = false; break;
        case 'KeyS': this.moveState.backward = false; break;
        case 'KeyA': this.moveState.left = false; break;
        case 'KeyD': this.moveState.right = false; break;
        case 'Space':
          // 释放空格后允许再次跳跃
          this.canJump = true;
          break;
      }
    },
    
    onMouseMove(event) {
      if (!this.isLocked) return;
      
      let movementX = event.movementX || 0;
      let movementY = event.movementY || 0;
      
      // 限制单次移动的最大值，防止瞬移
      const maxMovement = 100;
      if (Math.abs(movementX) > maxMovement || Math.abs(movementY) > maxMovement) {
        console.warn('⚠️ 检测到异常鼠标移动，已忽略:', movementX, movementY);
        return;
      }
      
      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= movementX * 0.002;
      this.euler.x -= movementY * 0.002;
      
      // 限制俯仰角，防止翻转
      this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
      
      this.camera.quaternion.setFromEuler(this.euler);
    },
    
    onClick() {
      if (!this.isLocked) return;
      
      // 从屏幕中心发射射线
      this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      const intersects = this.raycaster.intersectObjects(this.keywordMeshes);
      
      if (intersects.length > 0) {
        const selected = intersects[0].object;
        this.catchKeyword(selected);
      }
    },
    
    catchKeyword(sprite) {
      this.caughtCount++;
      
      this.scene.remove(sprite);
      const index = this.keywordMeshes.indexOf(sprite);
      if (index > -1) this.keywordMeshes.splice(index, 1);
      
      const keyword = sprite.userData.keyword;
      
      if (keyword.type === 'institute') {
        this.showInstituteDetail(keyword);
      } else if (keyword.type === 'major') {
        this.showMajorDetail(keyword);
      } else {
        setTimeout(() => {
          if (keyword.type === 'person' || keyword.type === 'event') {
            this.$router.push({
              path: keyword.route,
              query: { from: 'keyword-rain-3d' }
            });
          } else {
            this.$router.push(keyword.route);
          }
        }, 100);
      }
    },

    async showInstituteDetail(keyword) {
      try {
        const nodeId = keyword.id.replace('node-', '');
        const response = await axios.get(`/api/academic-universe/nodes/${nodeId}`);
        this.selectedInstitute = response.data;
      } catch (error) {
        console.error('获取学院详情失败:', error);
        this.$router.push(keyword.route);
      }
    },

    closeInstitute() {
      this.selectedInstitute = null;
    },

    async showMajorDetail(keyword) {
      try {
        const majorId = keyword.id.replace('major-', '');
        const response = await axios.get(`/api/academic-universe/majors/${majorId}`);
        this.selectedMajor = response.data;
      } catch (error) {
        console.error('获取专业详情失败:', error);
        this.$router.push(keyword.route);
      }
    },

    closeMajor() {
      this.selectedMajor = null;
    },
    
    updateMovement(delta) {
      const speed = 8.0; // 移动速度
      const friction = 8.0;
      
      // 水平移动阻力
      this.velocity.x -= this.velocity.x * friction * delta;
      this.velocity.z -= this.velocity.z * friction * delta;
      
      // 只在地面上时才能移动
      if (this.isGrounded) {
        this.direction.z = Number(this.moveState.forward) - Number(this.moveState.backward);
        this.direction.x = Number(this.moveState.right) - Number(this.moveState.left);
        this.direction.normalize();
        
        if (this.moveState.forward || this.moveState.backward) {
          this.velocity.z -= this.direction.z * speed * delta;
        }
        if (this.moveState.left || this.moveState.right) {
          this.velocity.x += this.direction.x * speed * delta;
        }
      }
      
      // 应用重力
      this.verticalVelocity += this.gravity * delta;
      
      // 保存旧位置用于碰撞检测
      const oldX = this.camera.position.x;
      const oldY = this.camera.position.y;
      const oldZ = this.camera.position.z;
      
      // 应用水平移动
      this.camera.translateX(this.velocity.x * delta);
      this.camera.translateZ(this.velocity.z * delta);
      
      // 检测水平碰撞
      if (this.checkCollision()) {
        this.camera.position.x = oldX;
        this.camera.position.z = oldZ;
        this.velocity.x = 0;
        this.velocity.z = 0;
      }
      
      // 应用垂直移动
      this.camera.position.y += this.verticalVelocity * delta;
      
      // 地面检测
      const groundLevel = this.playerHeight;
      if (this.camera.position.y <= groundLevel) {
        this.camera.position.y = groundLevel;
        this.verticalVelocity = 0;
        if (!this.isGrounded) {
          console.log('💥 落地');
        }
        this.isGrounded = true;
      } else {
        this.isGrounded = false;
      }
      
      // 限制移动范围
      this.camera.position.x = Math.max(-90, Math.min(90, this.camera.position.x));
      this.camera.position.z = Math.max(-90, Math.min(90, this.camera.position.z));
      
      // 更新位置显示
      this.playerPos.x = Math.round(this.camera.position.x);
      this.playerPos.z = Math.round(this.camera.position.z);
    },
    
    initCollisionBoxes() {
      // 建筑物碰撞盒（对应createBuildings中的位置）
      this.buildings = [
        // 左上区域
        { x: -25, z: -25, w: 8, d: 8 },
        { x: -40, z: -25, w: 6, d: 6 },
        { x: -25, z: -40, w: 10, d: 10 },
        
        // 右上区域
        { x: 25, z: -25, w: 7, d: 7 },
        { x: 40, z: -25, w: 9, d: 9 },
        { x: 25, z: -40, w: 6, d: 6 },
        
        // 左下区域
        { x: -25, z: 25, w: 8, d: 8 },
        { x: -40, z: 25, w: 7, d: 7 },
        { x: -25, z: 40, w: 9, d: 9 },
        
        // 右下区域
        { x: 25, z: 25, w: 6, d: 6 },
        { x: 40, z: 25, w: 10, d: 10 },
        { x: 25, z: 40, w: 8, d: 8 }
      ];
    },
    
    checkCollision() {
      const playerX = this.camera.position.x;
      const playerZ = this.camera.position.z;
      const radius = this.playerRadius;
      
      // 检测与建筑物的碰撞
      for (const building of this.buildings) {
        const halfW = building.w / 2;
        const halfD = building.d / 2;
        
        // AABB碰撞检测（带圆形玩家）
        const closestX = Math.max(building.x - halfW, Math.min(playerX, building.x + halfW));
        const closestZ = Math.max(building.z - halfD, Math.min(playerZ, building.z + halfD));
        
        const distanceX = playerX - closestX;
        const distanceZ = playerZ - closestZ;
        const distanceSquared = distanceX * distanceX + distanceZ * distanceZ;
        
        if (distanceSquared < radius * radius) {
          return true; // 发生碰撞
        }
      }
      
      return false;
    },
    
    updateKeywords() {
      for (let i = this.keywordMeshes.length - 1; i >= 0; i--) {
        const sprite = this.keywordMeshes[i];
        
        // 下落
        sprite.position.y += sprite.userData.velocity;
        
        // 轻微旋转
        sprite.material.rotation += sprite.userData.rotation;
        
        // 移除落到地面的
        if (sprite.position.y < 0.5) {
          this.scene.remove(sprite);
          this.keywordMeshes.splice(i, 1);
          console.log(`💧 雨滴落地移除: ${sprite.userData.keyword.name}, 剩余: ${this.keywordMeshes.length}`);
        }
      }
    },
    
    updateRain() {
      if (!this.rainSystem) return;
      
      const positions = this.rainSystem.geometry.attributes.position.array;
      const velocities = this.rainSystem.userData.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += velocities[i / 3];
        
        // 雨滴落地后重置到顶部
        if (positions[i + 1] < 0) {
          positions[i + 1] = 50;
          positions[i] = this.camera.position.x + (Math.random() - 0.5) * 100;
          positions[i + 2] = this.camera.position.z + (Math.random() - 0.5) * 100;
        }
      }
      
      this.rainSystem.geometry.attributes.position.needsUpdate = true;
    },
    
    animate() {
      this.animationId = requestAnimationFrame(this.animate);
      
      const delta = 0.016;
      this.updateMovement(delta);
      this.updateKeywords();
      this.updateRain();
      
      this.renderer.render(this.scene, this.camera);
    },
    
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    cleanup() {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      window.removeEventListener('resize', this.onWindowResize);
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('click', this.onClick);
      
      if (this.renderer) {
        this.renderer.dispose();
      }
    },
    
    goBack() {
      // 先退出指针锁定
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
      
      // 停止所有定时器和动画
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      // 返回2D词林雨露页面
      setTimeout(() => {
        this.$router.push('/keyword-rain');
      }, 100);
    }
  }
};
</script>

<style scoped>
.keyword-rain-3d {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Noto Sans SC', sans-serif;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.back-button {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 10000;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 16px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.title-overlay {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 100;
  pointer-events: none;
}

.title-overlay h1 {
  font-size: 48px;
  font-weight: 300;
  margin: 0 0 10px;
  letter-spacing: 8px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.title-overlay p {
  font-size: 14px;
  opacity: 0.7;
  margin: 0;
}

.controls-hint {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.hint-item {
  margin: 5px 0;
  font-size: 14px;
}

.hint-item kbd {
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 8px;
  border-radius: 3px;
  margin: 0 2px;
  font-family: monospace;
  font-size: 12px;
}

.hint-item.active {
  color: #4eff4e;
  font-weight: bold;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  z-index: 100;
  pointer-events: none;
}

.crosshair::before,
.crosshair::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
}

.crosshair::before {
  width: 2px;
  height: 20px;
  left: 9px;
  top: 0;
}

.crosshair::after {
  width: 20px;
  height: 2px;
  left: 0;
  top: 9px;
}

/* 学院信息弹窗 */
.institute-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  background: linear-gradient(135deg, #1a2847 0%, #0a1428 100%);
  border-radius: 20px;
  border: 2px solid rgba(135, 206, 235, 0.5);
  padding: 40px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.institute-modal .close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 20001;
}

.institute-modal .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.institute-info h2 {
  color: #87ceeb;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.institute-info .title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  margin: 0 0 20px 0;
}

.institute-info .description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 25px;
}

/* 专业信息弹窗 */
.major-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease-out;
  pointer-events: auto;
}

.major-info h2 {
  color: #98fb98;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.major-info .major-level {
  color: #ffd700;
  font-size: 16px;
  margin: 0 0 20px 0;
  font-weight: bold;
}

.major-info .description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 25px;
}
</style>
