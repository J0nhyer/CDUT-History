// 成都理工大学 3D校园探索游戏数据
// 基于校园地图的30个建筑数据

export default {
  // 30个建筑的详细数据（根据校园地图）
  buildings: [
    {
      id: 'building_1',
      name: '体育学院',
      nameEn: 'College of Physical Education',
      position: { x: -360, z: -280 },
      size: { width: 8, depth: 8, height: 6 },
      color: 0xFF6B6B,
      type: 'education',
      emoji: '🏃',
      description: '体育学院培养优秀的体育人才',
      knowledge: ['sports_education', 'physical_fitness'],
      tasks: ['explore_gym', 'collect_sports_artifact']
    },
    {
      id: 'building_2',
      name: '管理科学学院、数理学院',
      nameEn: 'College of Management Science, College of Mathematics and Physics',
      position: { x: -280, z: -240 },
      size: { width: 10, depth: 10, height: 8 },
      color: 0x4ECDC4,
      type: 'education',
      emoji: '📊',
      description: '培养管理科学和数理人才的重要学院',
      knowledge: ['management_science', 'mathematics'],
      tasks: ['solve_math_puzzle', 'explore_management']
    },
    {
      id: 'building_3',
      name: '地球科学学院',
      nameEn: 'College of Earth Sciences',
      position: { x: -200, z: -200 },
      size: { width: 12, depth: 10, height: 9 },
      color: 0x45B7D1,
      type: 'education',
      emoji: '🌍',
      description: '地质学研究的核心，恐龙化石相关知识的发源地',
      knowledge: ['earth_sciences', 'geology', 'dinosaur_paleontology'],
      tasks: ['explore_earth_science', 'find_dinosaur_fossil'],
      special: true
    },
    {
      id: 'building_4',
      name: '机电工程学院、地球物理学院',
      nameEn: 'College of Mechanical and Electrical Engineering, College of Geophysics',
      position: { x: -120, z: -160 },
      size: { width: 14, depth: 12, height: 10 },
      color: 0x96CEB4,
      type: 'education',
      emoji: '⚙️',
      description: '机电与地球物理的重要研究基地',
      knowledge: ['mechanical_engineering', 'geophysics'],
      tasks: ['explore_engineering', 'geophysics_quiz']
    },
    {
      id: 'building_5',
      name: '芙蓉食堂',
      nameEn: 'Furong Canteen',
      position: { x: -200, z: -120 },
      size: { width: 10, depth: 8, height: 5 },
      color: 0xFFA07A,
      type: 'service',
      emoji: '🍽️',
      description: '美味的校园美食，补充探索能量',
      knowledge: ['campus_life'],
      tasks: ['collect_energy', 'try_food']
    },
    {
      id: 'building_6',
      name: '银杏餐厅',
      nameEn: 'Ginkgo Restaurant',
      position: { x: -40, z: -120 },
      size: { width: 8, depth: 8, height: 5 },
      color: 0xFFD93D,
      type: 'service',
      emoji: '🍜',
      description: '银杏餐厅提供多样化的餐饮选择',
      knowledge: ['campus_life'],
      tasks: ['dining_experience']
    },
    {
      id: 'building_7',
      name: '银杏园 (公寓)',
      nameEn: 'Ginkgo Garden (Apartment)',
      position: { x: -280, z: -80 },
      size: { width: 15, depth: 12, height: 12 },
      color: 0xDDA0DD,
      type: 'residential',
      emoji: '🏠',
      description: '学生宿舍区，校园生活的重要组成部分',
      knowledge: ['campus_life', 'student_residence'],
      tasks: ['explore_dormitory']
    },
    {
      id: 'building_8',
      name: '材料与化学化工学院',
      nameEn: 'College of Materials and Chemical Engineering',
      position: { x: -320, z: 0 },
      size: { width: 12, depth: 10, height: 9 },
      color: 0x87CEEB,
      type: 'education',
      emoji: '⚗️',
      description: '材料科学与化学工程的研究中心',
      knowledge: ['materials_science', 'chemical_engineering'],
      tasks: ['explore_lab', 'chemistry_experiment']
    },
    {
      id: 'building_9',
      name: '行政楼',
      nameEn: 'Administration Building',
      position: { x: -240, z: 40 },
      size: { width: 10, depth: 10, height: 12 },
      color: 0xC0C0C0,
      type: 'administration',
      emoji: '🏛️',
      description: '学校的行政中心，管理学校各项事务',
      knowledge: ['university_administration'],
      tasks: ['visit_admin']
    },
    {
      id: 'building_10',
      name: '珙桐园 (公寓)',
      nameEn: 'Dove Tree Garden (Apartment)',
      position: { x: -360, z: 80 },
      size: { width: 14, depth: 12, height: 12 },
      color: 0x98D8C8,
      type: 'residential',
      emoji: '🏡',
      description: '温馨的学生宿舍区',
      knowledge: ['campus_life'],
      tasks: ['dormitory_explore']
    },
    {
      id: 'building_11',
      name: '能源学院、油气藏地质及开发工程国家重点实验室',
      nameEn: 'College of Energy, State Key Laboratory',
      position: { x: -120, z: 80 },
      size: { width: 16, depth: 14, height: 11 },
      color: 0xFF6347,
      type: 'research',
      emoji: '🔬',
      description: '国家级的能源和地质研究重点实验室',
      knowledge: ['energy_research', 'geology', 'state_key_lab'],
      tasks: ['explore_lab', 'energy_research_quiz'],
      special: true
    },
    {
      id: 'building_12',
      name: '环境与土木工程学院',
      nameEn: 'College of Environment and Civil Engineering',
      position: { x: -40, z: 120 },
      size: { width: 14, depth: 12, height: 9 },
      color: 0x90EE90,
      type: 'education',
      emoji: '🏗️',
      description: '环境工程与土木工程的专业学院',
      knowledge: ['environmental_engineering', 'civil_engineering'],
      tasks: ['engineering_challenge']
    },
    {
      id: 'building_13',
      name: '地质灾害防治与地质环境保护国家重点实验室',
      nameEn: 'State Key Laboratory of Geological Hazard Prevention',
      position: { x: 40, z: 160 },
      size: { width: 18, depth: 16, height: 12 },
      color: 0xFFD700,
      type: 'research',
      emoji: '🏆',
      description: '世界级的地质灾害研究实验室，恐龙知识的重要来源',
      knowledge: ['geological_hazards', 'dinosaur_paleontology', 'state_key_lab'],
      tasks: ['geological_research', 'fossil_discovery'],
      special: true
    },
    {
      id: 'building_14',
      name: '外国语学院、文法学院',
      nameEn: 'College of Foreign Languages, College of Arts and Law',
      position: { x: 200, z: -200 },
      size: { width: 12, depth: 10, height: 8 },
      color: 0xFFB6C1,
      type: 'education',
      emoji: '📚',
      description: '培养外语和法律人才',
      knowledge: ['foreign_languages', 'law'],
      tasks: ['language_challenge', 'law_quiz']
    },
    {
      id: 'building_15',
      name: '校医院、保卫处',
      nameEn: 'Campus Hospital, Security Office',
      position: { x: 280, z: -160 },
      size: { width: 10, depth: 8, height: 6 },
      color: 0xFF69B4,
      type: 'service',
      emoji: '🏥',
      description: '校园医疗和安全保障',
      knowledge: ['campus_services'],
      tasks: ['visit_hospital']
    },
    {
      id: 'building_16',
      name: '财务处、校园一卡通中心',
      nameEn: 'Finance Office, Campus Card Center',
      position: { x: 320, z: -120 },
      size: { width: 8, depth: 8, height: 5 },
      color: 0x9370DB,
      type: 'service',
      emoji: '💳',
      description: '财务和校园卡服务中心',
      knowledge: ['campus_services'],
      tasks: ['financial_info']
    },
    {
      id: 'building_17',
      name: '芙蓉园',
      nameEn: 'Furong Garden',
      position: { x: 240, z: -80 },
      size: { width: 12, depth: 12, height: 2 },
      color: 0x98FB98,
      type: 'landscape',
      emoji: '🌺',
      description: '美丽的校园花园',
      knowledge: ['campus_landscape'],
      tasks: ['explore_garden', 'collect_flower']
    },
    {
      id: 'building_18',
      name: '旅游与城乡规划学院',
      nameEn: 'College of Tourism and Urban-Rural Planning',
      position: { x: 160, z: 0 },
      size: { width: 12, depth: 10, height: 8 },
      color: 0xFFA500,
      type: 'education',
      emoji: '🗺️',
      description: '旅游与规划专业学院',
      knowledge: ['tourism', 'urban_planning'],
      tasks: ['planning_challenge']
    },
    {
      id: 'building_19',
      name: '核技术与自动化工程学院、逸夫楼',
      nameEn: 'College of Nuclear Technology and Automation Engineering, Run Run Shaw Building',
      position: { x: 240, z: 40 },
      size: { width: 14, depth: 12, height: 10 },
      color: 0x00CED1,
      type: 'education',
      emoji: '⚛️',
      description: '核技术与自动化工程研究中心',
      knowledge: ['nuclear_technology', 'automation'],
      tasks: ['nuclear_tech_explore']
    },
    {
      id: 'building_20',
      name: '珙桐园 (公寓)',
      nameEn: 'Dove Tree Garden (Apartment)',
      position: { x: 320, z: 80 },
      size: { width: 14, depth: 12, height: 12 },
      color: 0xDDA0DD,
      type: 'residential',
      emoji: '🏘️',
      description: '学生宿舍区',
      knowledge: ['campus_life'],
      tasks: ['dormitory_tour']
    },
    {
      id: 'building_21',
      name: '银杏餐厅',
      nameEn: 'Ginkgo Restaurant',
      position: { x: 120, z: 120 },
      size: { width: 8, depth: 8, height: 5 },
      color: 0xFFD93D,
      type: 'service',
      emoji: '🍱',
      description: '银杏餐厅分店',
      knowledge: ['campus_life'],
      tasks: ['dining_experience']
    },
    {
      id: 'building_22',
      name: '计算机与网络安全学院 (牛津布鲁克斯学院)、生态环境学院',
      nameEn: 'College of Computer Science and Network Security, College of Ecological Environment',
      position: { x: 200, z: 160 },
      size: { width: 18, depth: 14, height: 10 },
      color: 0x4682B4,
      type: 'education',
      emoji: '💻',
      description: '计算机科学与生态环境的综合性学院',
      knowledge: ['computer_science', 'ecology'],
      tasks: ['programming_challenge', 'ecology_research']
    },
    {
      id: 'building_23',
      name: '商学院',
      nameEn: 'Business School',
      position: { x: 280, z: 200 },
      size: { width: 12, depth: 10, height: 9 },
      color: 0x32CD32,
      type: 'education',
      emoji: '💼',
      description: '商学院培养商业管理人才',
      knowledge: ['business', 'management'],
      tasks: ['business_simulation']
    },
    {
      id: 'building_24',
      name: '传播科学与艺术学院',
      nameEn: 'College of Communication Science and Art',
      position: { x: 360, z: 240 },
      size: { width: 12, depth: 10, height: 8 },
      color: 0xFF1493,
      type: 'education',
      emoji: '🎨',
      description: '艺术与传播人才的摇篮',
      knowledge: ['communication', 'arts'],
      tasks: ['art_exhibition', 'media_challenge']
    },
    {
      id: 'building_25',
      name: '东区教学楼',
      nameEn: 'East Campus Teaching Building',
      position: { x: 120, z: 200 },
      size: { width: 16, depth: 14, height: 11 },
      color: 0x1E90FF,
      type: 'education',
      emoji: '📖',
      description: '东区主要的教学建筑',
      knowledge: ['teaching', 'education'],
      tasks: ['classroom_explore']
    },
    {
      id: 'building_26',
      name: '东区图书馆',
      nameEn: 'East Campus Library',
      position: { x: 40, z: 240 },
      size: { width: 14, depth: 12, height: 13 },
      color: 0x8B4513,
      type: 'library',
      emoji: '📚',
      description: '东区图书馆，知识的海洋',
      knowledge: ['library', 'knowledge', 'research'],
      tasks: ['library_explore', 'find_book', 'study_session'],
      special: true
    },
    {
      id: 'building_27',
      name: '松林园 (公寓)',
      nameEn: 'Pine Forest Garden (Apartment)',
      position: { x: -80, z: 200 },
      size: { width: 15, depth: 12, height: 12 },
      color: 0x228B22,
      type: 'residential',
      emoji: '🌲',
      description: '松林园学生宿舍',
      knowledge: ['campus_life'],
      tasks: ['dormitory_discovery']
    },
    {
      id: 'building_28',
      name: '香樟园 (公寓)',
      nameEn: 'Camphor Garden (Apartment)',
      position: { x: -160, z: 240 },
      size: { width: 14, depth: 12, height: 12 },
      color: 0x6B8E23,
      type: 'residential',
      emoji: '🌳',
      description: '香樟园学生宿舍',
      knowledge: ['campus_life'],
      tasks: ['dormitory_walk']
    },
    {
      id: 'building_29',
      name: '马克思主义学院',
      nameEn: 'College of Marxism',
      position: { x: -240, z: 280 },
      size: { width: 10, depth: 10, height: 8 },
      color: 0xDC143C,
      type: 'education',
      emoji: '📜',
      description: '马克思主义理论教育',
      knowledge: ['marxism', 'political_theory'],
      tasks: ['theory_study']
    },
    {
      id: 'building_30',
      name: '中英合作办学',
      nameEn: 'Sino-British Cooperative Education',
      position: { x: -320, z: 320 },
      size: { width: 12, depth: 10, height: 9 },
      color: 0x4169E1,
      type: 'education',
      emoji: '🌐',
      description: '中英合作办学项目',
      knowledge: ['international_education', 'cooperation'],
      tasks: ['international_explore']
    },
    {
      id: 'museum',
      name: '校史馆',
      nameEn: 'Campus History Museum',
      position: { x: 0, z: 0 },
      size: { width: 30, depth: 30, height: 20 },
      color: 0xFFD700,
      type: 'museum',
      emoji: '🏛️',
      description: '成都理工大学校史馆，恐龙化石和校史的重要展示中心',
      knowledge: ['university_history', 'dinosaur_fossils', 'mamenchisaurus', 'paleontology'],
      tasks: ['museum_tour', 'find_mamenchisaurus', 'collect_fossils', 'history_quiz'],
      special: true,
      isCentral: true
    }
  ],

  // 道路网络数据（扩大8倍）
  roads: [
    { id: 'road_main_horizontal', path: [[-400, 0], [400, 0]], width: 15 },
    { id: 'road_main_vertical', path: [[0, -400], [0, 400]], width: 15 },
    { id: 'road_north', path: [[-240, 160], [240, 160]], width: 12 },
    { id: 'road_south', path: [[-240, -160], [240, -160]], width: 12 },
    { id: 'road_east', path: [[160, -240], [160, 240]], width: 12 },
    { id: 'road_west', path: [[-160, -240], [-160, 240]], width: 12 }
  ],

  // 河流/水系（扩大8倍）
  rivers: [
    {
      id: 'river_main',
      path: [[-440, -440], [-240, -240], [-120, -120], [0, 0], [120, 120], [240, 240], [440, 440]],
      width: 20,
      color: 0x4682B4
    }
  ],

  // 绿地/公园（扩大8倍）
  parks: [
    { id: 'park_1', position: { x: -80, z: -80 }, size: { width: 120, depth: 120 } },
    { id: 'park_2', position: { x: 80, z: 80 }, size: { width: 120, depth: 120 } },
    { id: 'park_3', position: { x: -80, z: 80 }, size: { width: 100, depth: 100 } },
    { id: 'park_4', position: { x: 80, z: -80 }, size: { width: 100, depth: 100 } }
  ],

  // 体育场（扩大8倍）
  stadiums: [
    {
      id: 'stadium_1',
      position: { x: -360, z: -280 },
      size: { width: 160, depth: 240, height: 2 },
      type: 'track'
    },
    {
      id: 'stadium_2',
      position: { x: 280, z: 280 },
      size: { width: 200, depth: 280, height: 2 },
      type: 'track'
    }
  ],

  // 任务数据
  missions: {
    mainQuests: [
      {
        id: 'quest_1',
        title: '初入校园',
        description: '熟悉校园环境，找到校史馆',
        objectives: [
          { id: 'obj1', text: '到达校史馆', buildingId: 'museum' },
          { id: 'obj2', text: '参观校史馆', buildingId: 'museum' },
          { id: 'obj3', text: '找到马门溪龙化石', buildingId: 'museum' }
        ],
        rewards: { exp: 100, coins: 50, items: ['map', 'compass'] },
        unlockCondition: 'default'
      },
      {
        id: 'quest_2',
        title: '探索地球科学',
        description: '访问地球科学学院，了解地质知识',
        objectives: [
          { id: 'obj1', text: '到达地球科学学院', buildingId: 'building_3' },
          { id: 'obj2', text: '完成地质知识问答', buildingId: 'building_3' },
          { id: 'obj3', text: '收集3个化石碎片', buildingId: 'building_3' }
        ],
        rewards: { exp: 150, coins: 80, knowledge: ['geology_basics'] },
        unlockCondition: 'complete_quest_1'
      },
      {
        id: 'quest_3',
        title: '实验室探索',
        description: '访问国家重点实验室，解锁高级知识',
        objectives: [
          { id: 'obj1', text: '到达地质灾害防治实验室', buildingId: 'building_13' },
          { id: 'obj2', text: '完成研究任务', buildingId: 'building_13' },
          { id: 'obj3', text: '解锁恐龙百科全书', buildingId: 'building_13' }
        ],
        rewards: { exp: 200, coins: 100, items: ['dinosaur_encyclopedia'] },
        unlockCondition: 'complete_quest_2'
      }
    ],
    sideQuests: [
      {
        id: 'side_1',
        title: '校园漫游',
        description: '访问至少10个不同的建筑',
        objectives: [
          { id: 'obj1', text: '访问10个建筑', count: 10 }
        ],
        rewards: { exp: 80, coins: 40 }
      },
      {
        id: 'side_2',
        title: '美食探索',
        description: '访问所有餐厅和食堂',
        objectives: [
          { id: 'obj1', text: '访问芙蓉食堂', buildingId: 'building_5' },
          { id: 'obj2', text: '访问银杏餐厅（两处）', buildingId: 'building_6' }
        ],
        rewards: { exp: 60, coins: 30, items: ['energy_boost'] }
      },
      {
        id: 'side_3',
        title: '知识收集',
        description: '在每个特殊建筑中收集知识点',
        objectives: [
          { id: 'obj1', text: '收集20个知识点', count: 20 }
        ],
        rewards: { exp: 120, coins: 60, knowledge: ['campus_expert'] }
      }
    ]
  },

  // 恐龙角色数据
  dinosaurs: {
    mamenchisaurus: {
      id: 'mamenchisaurus',
      name: '马门溪龙',
      nameEn: 'Mamenchisaurus',
      emoji: '🦕',
      size: { scale: 2.5 },
      color: 0xFFD700,
      speed: 3,
      description: '成都理工大学的守护神，拥有世界上最长的脖子',
      isMainCharacter: true
    },
    trex: {
      id: 'trex',
      name: '霸王龙',
      nameEn: 'T-Rex',
      emoji: '🦖',
      size: { scale: 2.0 },
      color: 0xFF6B6B,
      speed: 4,
      description: '强大的掠食者，快速移动'
    },
    velociraptor: {
      id: 'velociraptor',
      name: '迅猛龙',
      nameEn: 'Velociraptor',
      emoji: '🦎',
      size: { scale: 1.5 },
      color: 0xFFA07A,
      speed: 5,
      description: '敏捷的猎手，最快的速度'
    }
  },

  // 相机初始设置（适应更大的场景）
  camera: {
    initialPosition: { x: 0, y: 300, z: 400 },
    lookAt: { x: 0, y: 0, z: 0 },
    minDistance: 100,
    maxDistance: 800,
    angle: 45
  },

  // 场景尺寸（扩大8倍）
  worldSize: {
    width: 1600,
    depth: 1600
  }
}
