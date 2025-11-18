// 成都理工大学恐龙探险家游戏数据
export default {
  // 恐龙数据
  dinosaurs: {
    mamenchisaurus: {
      id: 'mamenchisaurus',
      name: '马门溪龙',
      nameEn: 'Mamenchisaurus',
      emoji: '🦕',
      type: 'legendary',
      color: '#FFD700',
      description: '四川自贡发现的传奇恐龙,拥有世界上最长的脖子,成都理工大学的守护神',
      stats: {
        health: 130,
        energy: 110,
        attack: 60,
        defense: 85,
        speed: 40,
        intelligence: 75
      },
      abilities: [
        {
          id: '天眼通视',
          name: '天眼通视',
          level: 1,
          description: '可以看穿历史的迷雾，发现隐藏的校园秘密'
        },
        {
          id: '历史回溯',
          name: '历史回溯',
          level: 1,
          description: '召唤历史的幻影，重现学校的辉煌时刻'
        },
        {
          id: '地质共鸣',
          name: '地质共鸣',
          level: 1,
          description: '与地质博物馆产生共鸣，获得双倍知识点经验'
        },
        {
          id: '四川之魂',
          name: '四川之魂',
          level: 1,
          description: '作为四川的象征，在校园内移动不消耗能量'
        },
        {
          id: '守护光环',
          name: '守护光环',
          level: 1,
          description: '散发守护的力量，降低受到的伤害'
        }
      ],
      unlockCondition: '初始解锁 - 成都理工大学的象征',
      specialAbility: true,
      isMainCharacter: true,
      lore: '马门溪龙生活在1.5亿年前的侏罗纪晚期,在四川自贡被发现。它的脖子长达9-11米,是已知脖子最长的恐龙之一。作为四川本土的传奇恐龙,它见证了这片土地亿万年的变迁,现在化身为成都理工大学的守护神,引领学生探索校史的奥秘。'
    },
    trex: {
      id: 'trex',
      name: '霸王龙',
      nameEn: 'T-Rex',
      emoji: '🦖',
      type: 'attack',
      color: '#FF6B6B',
      description: '强大的掠食者，擅长探索和战斗',
      stats: {
        health: 100,
        energy: 80,
        attack: 120,
        defense: 50,
        speed: 90,
        intelligence: 60
      },
      abilities: [
        {
          id: '破坏力',
          name: '破坏力',
          level: 1,
          description: '强大的咬合力，能够突破障碍'
        },
        {
          id: '咆哮',
          name: '咆哮',
          level: 1,
          description: '威慑敌人，获得额外经验加成'
        }
      ],
      unlockCondition: '初始解锁'
    },
    velociraptor: {
      id: 'velociraptor',
      name: '迅猛龙',
      nameEn: 'Velociraptor',
      emoji: '🦎',
      type: 'agile',
      color: '#FFA07A',
      description: '敏捷的猎手，快速穿梭在校园中',
      stats: {
        health: 80,
        energy: 130,
        attack: 90,
        defense: 40,
        speed: 150,
        intelligence: 85
      },
      abilities: [
        {
          id: '追踪',
          name: '追踪',
          level: 1,
          description: '精确追踪目标位置'
        }
      ],
      unlockCondition: '收集10个知识点解锁'
    },
    brachiosaurus: {
      id: 'brachiosaurus',
      name: '腕龙',
      nameEn: 'Brachiosaurus',
      emoji: '🦕',
      type: 'explorer',
      color: '#95E1D3',
      description: '探索型恐龙,视野范围更大',
      stats: {
        health: 160,
        energy: 90,
        attack: 50,
        defense: 100,
        speed: 30,
        intelligence: 90
      },
      abilities: [
        {
          id: '高处视野',
          name: '高处视野',
          level: 1,
          description: '能看到更远处的秘密地点'
        },
        {
          id: '长颈优势',
          name: '长颈优势',
          level: 1,
          description: '更容易发现隐藏的知识点'
        }
      ],
      unlockCondition: '完成探索类成就解锁'
    }
  },

  // 校园地图
  campusMap: {
    locations: [
      {
        id: 'gate',
        name: '学校正门',
        nameShort: '正门',
        emoji: '🚪',
        position: { x: 50, y: 10 },
        type: 'entrance',
        description: '成都理工大学的主入口，从这里开始你的探险之旅'
      },
      {
        id: 'museum',
        name: '自然博物馆',
        nameShort: '博物馆',
        emoji: '🦕',
        position: { x: 60, y: 30 },
        type: 'museum',
        description: '马门溪龙的故乡，了解古生物知识'
      },
      {
        id: 'library',
        name: '图书馆',
        nameShort: '图书馆',
        emoji: '📚',
        position: { x: 30, y: 50 },
        type: 'library',
        description: '知识的宝库，探索学术历史'
      },
      {
        id: 'geoscience',
        name: '地球科学学院',
        nameShort: '地科院',
        emoji: '🌍',
        position: { x: 70, y: 50 },
        type: 'academic',
        description: '学习地质学和地球科学知识'
      },
      {
        id: 'engineering',
        name: '工程技术学院',
        nameShort: '工程学院',
        emoji: '🏗️',
        position: { x: 40, y: 70 },
        type: 'academic',
        description: '探索工程技术的奥秘'
      },
      {
        id: 'stadium',
        name: '体育馆',
        nameShort: '体育馆',
        emoji: '🏟️',
        position: { x: 80, y: 70 },
        type: 'recreation',
        description: '运动场上的活力'
      },
      {
        id: 'lake',
        name: '砚湖',
        nameShort: '砚湖',
        emoji: '🏞️',
        position: { x: 20, y: 70 },
        type: 'landscape',
        description: '校园最美一景，宁静致远'
      },
      {
        id: 'cafeteria',
        name: '食堂',
        nameShort: '食堂',
        emoji: '🍽️',
        position: { x: 50, y: 90 },
        type: 'service',
        description: '品尝校园美食，补充能量'
      },
      {
        id: 'dormitory',
        name: '学生宿舍',
        nameShort: '宿舍',
        emoji: '🏠',
        position: { x: 10, y: 40 },
        type: 'residential',
        description: '学生生活的地方'
      },
      {
        id: 'lab',
        name: '国家重点实验室',
        nameShort: '实验室',
        emoji: '🔬',
        position: { x: 90, y: 50 },
        type: 'research',
        description: '前沿科学研究，解锁高级知识'
      }
    ],
    roads: [
      { id: 'road1', path: 'M50,10 L60,30 L70,50 L80,70 M50,10 L30,50 M50,10 L20,70' },
      { id: 'road2', path: 'M30,50 L40,70 L50,90 M70,50 L80,70' },
      { id: 'road3', path: 'M20,70 L50,90 M80,70 L90,50' }
    ],
    secretAreas: [
      {
        id: 'secret1',
        name: '校史档案馆',
        emoji: '📜',
        position: { x: 15, y: 30 },
        unlockCondition: '访问图书馆3次',
        description: '隐藏的校史资料'
      }
    ]
  },

  // 任务系统
  missions: {
    mainQuests: [
      {
        id: 'quest1',
        chapter: 1,
        era: '1956-1966',
        difficulty: 'easy',
        title: '建校初期',
        description: '了解成都理工大学建校的历史背景和初心',
        objectives: [
          { id: 'obj1', text: '参观自然博物馆，了解镇馆之宝马门溪龙' },
          { id: 'obj2', text: '收集5个关于建校历史的知识点' },
          { id: 'obj3', text: '与校史讲解员对话' }
        ],
        rewards: {
          exp: 100,
          coins: 50,
          knowledge: ['knowledge1', 'knowledge2', 'knowledge3']
        },
        unlockCondition: 'default'
      },
      {
        id: 'quest2',
        chapter: 2,
        era: '1966-1978',
        difficulty: 'medium',
        title: '艰难岁月',
        description: '探索学校在特殊历史时期的坚持与传承',
        objectives: [
          { id: 'obj1', text: '访问档案馆，查看历史资料' },
          { id: 'obj2', text: '完成一次小测验' }
        ],
        rewards: {
          exp: 150,
          coins: 80,
          items: ['archive_key']
        },
        unlockCondition: 'complete_quest1'
      },
      {
        id: 'quest3',
        chapter: 3,
        era: '1978-2000',
        difficulty: 'medium',
        title: '改革开放',
        description: '见证学校快速发展的重要时期',
        objectives: [
          { id: 'obj1', text: '参观地球科学学院' },
          { id: 'obj2', text: '收集10个知识点' }
        ],
        rewards: {
          exp: 200,
          coins: 100,
          unlock: 'raptor'
        },
        unlockCondition: 'complete_quest2'
      }
    ],
    sideQuests: [
      {
        id: 'side1',
        type: 'exploration',
        difficulty: 'easy',
        title: '校园漫游',
        description: '探索校园的每个角落',
        objectives: [
          { id: 'obj1', text: '访问至少5个地点' }
        ],
        rewards: {
          exp: 50,
          coins: 30
        }
      },
      {
        id: 'side2',
        type: 'collection',
        difficulty: 'medium',
        title: '化石收集',
        description: '收集校园中的化石碎片',
        objectives: [
          { id: 'obj1', text: '找到3块化石' }
        ],
        rewards: {
          exp: 80,
          coins: 50,
          items: ['rare_fossil']
        }
      }
    ],
    dailyQuests: [
      {
        id: 'daily1',
        type: 'daily',
        difficulty: 'easy',
        title: '每日签到',
        description: '每天访问游戏即可获得奖励',
        objectives: [],
        rewards: {
          exp: 20,
          coins: 10
        }
      },
      {
        id: 'daily2',
        type: 'daily',
        difficulty: 'medium',
        title: '知识探索',
        description: '今天收集5个知识点',
        objectives: [
          { id: 'obj1', text: '收集5个知识点' }
        ],
        rewards: {
          exp: 50,
          coins: 25
        }
      }
    ]
  },

  // 收集品
  collectibles: {
    red_fossil: {
      name: '红色化石',
      emoji: '🔴',
      rarity: 'common',
      description: '普通的化石碎片',
      effect: {
        exp: 10
      }
    },
    blue_crystal: {
      name: '蓝色水晶',
      emoji: '🔵',
      rarity: 'common',
      description: '可以恢复能量',
      effect: {
        energy: 30
      }
    },
    yellow_amber: {
      name: '黄色琥珀',
      emoji: '🟡',
      rarity: 'rare',
      description: '珍贵的琥珀，含有完整昆虫',
      effect: {
        exp: 50
      }
    },
    archive_key: {
      name: '档案钥匙',
      emoji: '🔑',
      rarity: 'rare',
      description: '可以打开档案馆的钥匙',
      effect: null
    },
    rare_fossil: {
      name: '稀有化石',
      emoji: '💎',
      rarity: 'epic',
      description: '非常珍贵的化石',
      effect: {
        exp: 100
      }
    }
  },

  // 成就系统
  achievements: {
    explorer: {
      name: '探索者',
      emoji: '🗺️',
      description: '访问所有校园地点',
      rewards: {
        exp: 200
      }
    },
    historian: {
      name: '历史学家',
      emoji: '📚',
      description: '收集所有知识点',
      rewards: {
        exp: 300
      }
    },
    collector: {
      name: '收藏家',
      emoji: '🎁',
      description: '收集所有类型的物品',
      rewards: {
        exp: 150
      }
    },
    master: {
      name: '成理大师',
      emoji: '👑',
      description: '完成所有主线任务',
      rewards: {
        exp: 500,
        coins: 500
      }
    }
  },

  // 问答题目
  quizQuestions: {
    q1: {
      question: '成都理工大学建校于哪一年？',
      options: ['1955年', '1956年', '1957年', '1958年'],
      correct: 1,
      explanation: '成都理工大学成立于1956年，原为成都地质勘探学院'
    },
    q2: {
      question: '学校的镇馆之宝是什么？',
      options: ['剑龙', '马门溪龙', '霸王龙', '雷龙'],
      correct: 1,
      explanation: '马门溪龙是成都理工大学自然博物馆的镇馆之宝'
    },
    q3: {
      question: '学校的校训是什么？',
      options: ['穷究于理，成就于工', '明德厚学，求是创新', '自强不息，厚德载物', '知行合一，经世致用'],
      correct: 0,
      explanation: '成都理工大学的校训是"穷究于理，成就于工"'
    }
  },

  // NPC系统
  npcs: {
    guide: {
      name: '校园向导',
      emoji: '👨‍🏫',
      location: 'gate',
      dialogues: [
        {
          text: '欢迎来到成都理工大学！我是校园向导，有什么可以帮助你的吗？',
          options: [
            { text: '介绍一下学校历史', choice: 'next' },
            { text: '校园地图', choice: 'map' },
            { text: '离开', choice: 'end' }
          ]
        }
      ]
    },
    professor: {
      name: '历史教授',
      emoji: '👴',
      location: 'library',
      dialogues: [
        {
          text: '年轻人，你想了解学校的历史吗？',
          options: [
            { text: '是的，请指教', choice: 'next', reward: { exp: 20 } },
            { text: '不需要', choice: 'end' }
          ]
        }
      ]
    },
    geologist: {
      name: '地质学家',
      emoji: '⛏️',
      location: 'geoscience',
      dialogues: [
        {
          text: '你对地质学感兴趣吗？',
          options: [
            { text: '非常感兴趣', choice: 'next', reward: { items: ['geology_book'] } },
            { text: '一般吧', choice: 'end' }
          ]
        }
      ]
    }
  },

  // 特殊事件
  specialEvents: {
    weather: {
      sunny: {
        name: '晴天',
        emoji: '☀️',
        effect: { exp: 1.1 }
      },
      cloudy: {
        name: '多云',
        emoji: '⛅',
        effect: { exp: 1.0 }
      },
      rainy: {
        name: '雨天',
        emoji: '🌧️',
        effect: { exp: 0.9 }
      }
    },
    random: [
      {
        name: '遇见校园猫咪',
        emoji: '🐱',
        probability: 0.1,
        reward: { exp: 10 }
      },
      {
        name: '发现隐藏宝箱',
        emoji: '📦',
        probability: 0.05,
        reward: { coins: 50 }
      }
    ]
  }
};
