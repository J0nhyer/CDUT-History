// 成都理工大学 详细精美3D校园地图数据
// 基于真实校园地图，包含29-30个主要建筑、河流、道路、绿地

export default {
  // 世界尺寸（大规模场景 - 2000x2000单位）
  worldSize: {
    width: 2000,
    depth: 2000
  },

  // 30个主要建筑的详细数据（根据真实地图布局）
  buildings: [
    // 左下角区域（近正门）- 大幅分散布局，完全避开河流路径
    {
      id: 'building_1',
      name: '外国语学院、文法学院',
      nameEn: 'College of Foreign Languages, College of Arts and Law',
      position: { x: -850, z: -850 }, // 远离河流路径 [-750, -700]
      size: { width: 40, depth: 35, height: 24 },
      color: 0xFFB6C1,
      type: 'education',
      emoji: '📚',
      description: '培养外语和法律人才的重要学院',
      special: false,
      floors: 6,
      roofType: 'flat'
    },
    {
      id: 'building_2',
      name: '校医院、保卫处',
      nameEn: 'Campus Hospital, Security Office',
      position: { x: -700, z: -700 }, // 远离河流路径 [-600, -550]
      size: { width: 32, depth: 28, height: 18 },
      color: 0xFF69B4,
      type: 'service',
      emoji: '🏥',
      description: '校园医疗和安全保障中心',
      special: false,
      floors: 4,
      roofType: 'flat'
    },
    {
      id: 'building_3',
      name: '财务处、校园一卡通中心',
      nameEn: 'Finance Office, Campus Card Center',
      position: { x: -550, z: -700 }, // 远离河流路径 [-450, -400]
      size: { width: 28, depth: 28, height: 15 },
      color: 0x9370DB,
      type: 'service',
      emoji: '💳',
      description: '财务和校园卡服务中心',
      special: false,
      floors: 3,
      roofType: 'flat'
    },
    {
      id: 'building_4',
      name: '芙蓉园 (公寓)',
      nameEn: 'Furong Garden (Apartment)',
      position: { x: -450, z: -700 }, // 远离河流路径 [-300, -350]
      size: { width: 55, depth: 45, height: 32 },
      color: 0xDDA0DD,
      type: 'residential',
      emoji: '🏠',
      description: '学生宿舍区，校园生活的重要组成部分',
      special: false,
      floors: 8,
      roofType: 'flat'
    },
    {
      id: 'building_5',
      name: '旅游与城乡规划学院',
      nameEn: 'College of Tourism and Urban-Rural Planning',
      position: { x: -420, z: -650 }, // 完全远离河流路径 [-150, -250]，避免重合
      size: { width: 36, depth: 32, height: 20 },
      color: 0xFFA500,
      type: 'education',
      emoji: '🗺️',
      description: '旅游与规划专业学院',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_6',
      name: '核技术与自动化工程学院、逸夫楼',
      nameEn: 'College of Nuclear Technology and Automation Engineering, Run Run Shaw Building',
      position: { x: -250, z: -550 }, // 远离河流路径 [0, -150]
      size: { width: 42, depth: 38, height: 26 },
      color: 0x00CED1,
      type: 'education',
      emoji: '⚛️',
      description: '核技术与自动化工程研究中心',
      special: true,
      floors: 6,
      roofType: 'modern'
    },
    {
      id: 'building_7',
      name: '体育学院',
      nameEn: 'College of Physical Education',
      position: { x: -700, z: -800 }, // 大幅分散，避免重合
      size: { width: 30, depth: 30, height: 18 },
      color: 0xFF6B6B,
      type: 'education',
      emoji: '🏃',
      description: '体育学院培养优秀的体育人才',
      special: false,
      floors: 4,
      roofType: 'flat'
    },

    // 中左区域
    {
      id: 'building_8',
      name: '地质灾害防治与地质环境保护国家重点实验室',
      nameEn: 'State Key Laboratory of Geological Hazard Prevention',
      position: { x: -500, z: -250 }, // 大幅分散，避免重合
      size: { width: 48, depth: 42, height: 30 },
      color: 0xFFD700,
      type: 'research',
      emoji: '🏆',
      description: '世界级的地质灾害研究实验室',
      special: true,
      floors: 7,
      roofType: 'modern'
    },
    {
      id: 'building_9',
      name: '管理科学学院、数理学院',
      nameEn: 'College of Management Science, College of Mathematics and Physics',
      position: { x: -550, z: -350 }, // 大幅分散，避免重合
      size: { width: 38, depth: 35, height: 22 },
      color: 0x4ECDC4,
      type: 'education',
      emoji: '📊',
      description: '培养管理科学和数理人才的重要学院',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_10',
      name: '地球科学学院',
      nameEn: 'College of Earth Sciences',
      position: { x: -650, z: -600 }, // 完全远离河流路径，避免任何重合（原来在河流路径中间）
      size: { width: 44, depth: 38, height: 26 },
      color: 0x45B7D1,
      type: 'education',
      emoji: '🌍',
      description: '地质学研究的核心，恐龙化石相关知识的发源地',
      special: true,
      floors: 6,
      roofType: 'pitched'
    },
    {
      id: 'building_11',
      name: '机电工程学院、地球物理学院',
      nameEn: 'College of Mechanical and Electrical Engineering, College of Geophysics',
      position: { x: -550, z: -550 }, // 完全远离河流路径，避免任何重合（原来就在河流点上）
      size: { width: 46, depth: 40, height: 28 },
      color: 0x96CEB4,
      type: 'education',
      emoji: '⚙️',
      description: '机电与地球物理的重要研究基地',
      special: false,
      floors: 6,
      roofType: 'modern'
    },
    {
      id: 'building_12',
      name: '芙蓉食堂',
      nameEn: 'Furong Canteen',
      position: { x: -500, z: -500 }, // 完全远离河流路径，避免任何重合（原来紧贴河流）
      size: { width: 35, depth: 30, height: 16 },
      color: 0xFFA07A,
      type: 'service',
      emoji: '🍽️',
      description: '美味的校园美食，补充探索能量',
      special: false,
      floors: 3,
      roofType: 'flat'
    },
    {
      id: 'building_13',
      name: '银杏餐厅',
      nameEn: 'Ginkgo Restaurant',
      position: { x: -450, z: -450 }, // 完全远离河流路径，避免任何重合（原来在河流路径中间）
      size: { width: 32, depth: 32, height: 14 },
      color: 0xFFD93D,
      type: 'service',
      emoji: '🍜',
      description: '银杏餐厅提供多样化的餐饮选择',
      special: false,
      floors: 3,
      roofType: 'flat'
    },
    {
      id: 'building_14',
      name: '银杏园 (公寓)',
      nameEn: 'Ginkgo Garden (Apartment)',
      position: { x: -600, z: -180 }, // 大幅分散，避免重合
      size: { width: 55, depth: 45, height: 32 },
      color: 0xDDA0DD,
      type: 'residential',
      emoji: '🏠',
      description: '学生宿舍区，校园生活的重要组成部分',
      special: false,
      floors: 8,
      roofType: 'flat'
    },
    {
      id: 'building_15',
      name: '材料与化学化工学院',
      nameEn: 'College of Materials and Chemical Engineering',
      position: { x: -650, z: -90 }, // 大幅分散，避免重合
      size: { width: 42, depth: 36, height: 24 },
      color: 0x87CEEB,
      type: 'education',
      emoji: '⚗️',
      description: '材料科学与化学工程的研究中心',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_16',
      name: '行政楼',
      nameEn: 'Administration Building',
      position: { x: -580, z: 50 }, // 远离河流路径 [150, -100] 和 [300, -50]
      size: { width: 40, depth: 40, height: 30 },
      color: 0xC0C0C0,
      type: 'administration',
      emoji: '🏛️',
      description: '学校的行政中心，管理学校各项事务',
      special: true,
      floors: 8,
      roofType: 'modern'
    },
    {
      id: 'building_17',
      name: '珙桐园 (公寓)',
      nameEn: 'Dove Tree Garden (Apartment)',
      position: { x: -700, z: 170 }, // 大幅分散，避免重合
      size: { width: 50, depth: 45, height: 32 },
      color: 0x98D8C8,
      type: 'residential',
      emoji: '🏡',
      description: '温馨的学生宿舍区',
      special: false,
      floors: 8,
      roofType: 'flat'
    },
    {
      id: 'building_18',
      name: '能源学院、油气藏地质及开发工程国家重点实验室',
      nameEn: 'College of Energy, State Key Laboratory',
      position: { x: -450, z: -50 }, // 远离河流路径 [300, -50] 和 [450, 0]
      size: { width: 52, depth: 46, height: 30 },
      color: 0xFF6347,
      type: 'research',
      emoji: '🔬',
      description: '国家级的能源和地质研究重点实验室',
      special: true,
      floors: 7,
      roofType: 'modern'
    },

    // 中右区域（跨过河流）- 重新分散布局
    {
      id: 'building_19',
      name: '环境与土木工程学院',
      nameEn: 'College of Environment and Civil Engineering',
      position: { x: 250, z: 250 }, // 大幅分散，避免重合
      size: { width: 44, depth: 38, height: 24 },
      color: 0x90EE90,
      type: 'education',
      emoji: '🏗️',
      description: '环境工程与土木工程的专业学院',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_20',
      name: '计算机与网络安全学院 (牛津布鲁克斯学院)、生态环境学院',
      nameEn: 'College of Computer Science and Network Security, College of Ecological Environment',
      position: { x: 400, z: 350 }, // 大幅分散，避免重合
      size: { width: 56, depth: 48, height: 32 },
      color: 0x4682B4,
      type: 'education',
      emoji: '💻',
      description: '计算机科学与生态环境的综合性学院',
      special: true,
      floors: 7,
      roofType: 'modern'
    },
    {
      id: 'building_21',
      name: '商学院',
      nameEn: 'Business School',
      position: { x: 550, z: 400 }, // 大幅分散，避免重合
      size: { width: 42, depth: 36, height: 24 },
      color: 0x32CD32,
      type: 'education',
      emoji: '💼',
      description: '商学院培养商业管理人才',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_22',
      name: '传播科学与艺术学院',
      nameEn: 'College of Communication Science and Art',
      position: { x: 700, z: 480 }, // 大幅分散，避免重合
      size: { width: 40, depth: 35, height: 22 },
      color: 0xFF1493,
      type: 'education',
      emoji: '🎨',
      description: '艺术与传播人才的摇篮',
      special: false,
      floors: 5,
      roofType: 'modern'
    },
    {
      id: 'building_23',
      name: '东区教学楼',
      nameEn: 'East Campus Teaching Building',
      position: { x: 300, z: 380 }, // 大幅分散，避免重合
      size: { width: 50, depth: 44, height: 30 },
      color: 0x1E90FF,
      type: 'education',
      emoji: '📖',
      description: '东区主要的教学建筑',
      special: false,
      floors: 6,
      roofType: 'pitched'
    },
    {
      id: 'building_24',
      name: '东区图书馆',
      nameEn: 'East Campus Library',
      position: { x: 150, z: 450 }, // 大幅分散，避免重合
      size: { width: 48, depth: 42, height: 36 },
      color: 0x8B4513,
      type: 'library',
      emoji: '📚',
      description: '东区图书馆，知识的海洋',
      special: true,
      floors: 8,
      roofType: 'modern'
    },
    {
      id: 'building_25',
      name: '松林园 (公寓)',
      nameEn: 'Pine Forest Garden (Apartment)',
      position: { x: -180, z: 380 }, // 大幅分散，避免重合
      size: { width: 52, depth: 45, height: 32 },
      color: 0x228B22,
      type: 'residential',
      emoji: '🌲',
      description: '松林园学生宿舍',
      special: false,
      floors: 8,
      roofType: 'flat'
    },
    {
      id: 'building_26',
      name: '香樟餐厅',
      nameEn: 'Camphor Restaurant',
      position: { x: -280, z: 450 }, // 大幅分散，避免重合
      size: { width: 32, depth: 32, height: 14 },
      color: 0xFFD93D,
      type: 'service',
      emoji: '🍱',
      description: '香樟园附近的餐厅',
      special: false,
      floors: 3,
      roofType: 'flat'
    },
    {
      id: 'building_27',
      name: '香樟园 (公寓)',
      nameEn: 'Camphor Garden (Apartment)',
      position: { x: -420, z: 470 }, // 大幅分散，避免重合
      size: { width: 48, depth: 42, height: 32 },
      color: 0x6B8E23,
      type: 'residential',
      emoji: '🌳',
      description: '香樟园学生宿舍',
      special: false,
      floors: 8,
      roofType: 'flat'
    },
    {
      id: 'building_28',
      name: '马克思主义学院',
      nameEn: 'College of Marxism',
      position: { x: -600, z: 520 }, // 大幅分散，避免重合
      size: { width: 36, depth: 36, height: 22 },
      color: 0xDC143C,
      type: 'education',
      emoji: '📜',
      description: '马克思主义理论教育',
      special: false,
      floors: 5,
      roofType: 'pitched'
    },
    {
      id: 'building_29',
      name: '中英合作办学',
      nameEn: 'Sino-British Cooperative Education',
      position: { x: -750, z: 600 }, // 大幅分散，避免重合
      size: { width: 40, depth: 36, height: 24 },
      color: 0x4169E1,
      type: 'education',
      emoji: '🌐',
      description: '中英合作办学项目',
      special: false,
      floors: 5,
      roofType: 'modern'
    },

    // 中央校史馆（已移动到新位置，为恐龙初始位置让出空间，远离河流）
    {
      id: 'museum',
      name: '校史馆',
      nameEn: 'Campus History Museum',
      position: { x: -50, z: -50 }, // 远离河流路径，避免与河流重合
      size: { width: 60, depth: 60, height: 40 },
      color: 0xFFD700,
      type: 'museum',
      emoji: '🏛️',
      description: '成都理工大学校史馆，恐龙化石和校史的重要展示中心',
      special: true,
      isCentral: true,
      floors: 8,
      roofType: 'dome'
    }
  ],

  // 道路网络（简洁清晰的主干道系统）
  roads: [
    // ===== 主要东西向道路（水平）=====
    // 南校区主干道（河流南侧）
    { id: 'road_south', path: [[-900, -700], [900, -700]], width: 30 },
    // 北校区主干道（河流北侧）
    { id: 'road_north', path: [[-900, 300], [900, 300]], width: 30 },
    
    // ===== 主要南北向道路（垂直）=====
    // 西区主干道（河流西侧）
    { id: 'road_west', path: [[-700, -900], [-700, 900]], width: 30 },
    // 东区主干道（河流东侧）
    { id: 'road_east', path: [[400, -900], [400, 900]], width: 30 },
    
    // ===== 环校路（外围一圈）=====
    { id: 'road_ring', path: [[-800, -800], [800, -800], [800, 800], [-800, 800], [-800, -800]], width: 25 }
  ],

  // 河流（沱江）详细路径（更弯曲的自然河流路径）
  rivers: [
    {
      id: 'river_main',
      path: [
        [-900, -850],  // 起点稍偏
        [-750, -700],  // 第一个弯曲
        [-600, -550],  // 继续弯曲
        [-450, -400],  // S型弯曲开始
        [-300, -350],  // 弯曲回来
        [-150, -250],  // 继续弯曲
        [0, -150],     // 绕过中心
        [150, -100],   // 弯曲
        [300, -50],    // 继续
        [450, 0],      // 另一个S型
        [600, 100],    // 弯曲
        [750, 250],    // 继续
        [900, 400]     // 终点弯曲
      ],
      width: 40,
      color: 0x1E90FF, // 更蓝的颜色（道奇蓝）
      name: '沱江'
    }
  ],

  // 公园和绿地（大规模绿化系统）
  parks: [
    { id: 'park_furong', position: { x: -400, z: -450 }, size: { width: 120, depth: 120 }, name: '芙蓉园' },
    { id: 'park_ginkgo', position: { x: -200, z: -150 }, size: { width: 100, depth: 100 }, name: '银杏园' },
    { id: 'park_dove', position: { x: -550, z: 100 }, size: { width: 100, depth: 100 }, name: '珙桐园' },
    { id: 'park_pine', position: { x: -120, z: 320 }, size: { width: 110, depth: 110 }, name: '松林园' },
    { id: 'park_camphor', position: { x: -320, z: 400 }, size: { width: 100, depth: 100 }, name: '香樟园' },
    { id: 'park_central_1', position: { x: -150, z: -150 }, size: { width: 120, depth: 120 }, name: '中央公园1' },
    { id: 'park_central_2', position: { x: 150, z: 150 }, size: { width: 120, depth: 120 }, name: '中央公园2' }
  ],

  // 体育场 - 调整位置，避免重合
  stadiums: [
    {
      id: 'stadium_west',
      position: { x: -650, z: -750 }, // 大幅调整位置，避免重合
      size: { width: 250, depth: 180, height: 2 }, // 标准400米田径场尺寸
      type: 'track',
      name: '西区体育场'
    },
    {
      id: 'stadium_east',
      position: { x: 600, z: 550 }, // 大幅调整位置，避免重合
      size: { width: 300, depth: 200, height: 2 }, // 标准400米田径场尺寸
      type: 'track',
      name: '东区体育场'
    }
  ],

  // 相机设置（适应超大型场景）
  camera: {
    initialPosition: { x: 0, y: 500, z: 600 },
    lookAt: { x: 0, y: 0, z: 0 },
    minDistance: 150,
    maxDistance: 1200,
    angle: 45
  }
}

