/**
 * 成都理工大学人物关系图谱数据
 * 每个人物都有以自己为中心的关系图谱
 * 只包含人物节点，展示人物之间的关系
 * 关系类型：老师(teacher)、同事(colleague)、学生(student)
 */

export const relationshipData = {
  // ========== 刘宝珺院士 ==========
  liubaojun: {
    centerPerson: {
      id: 'liubaojun',
      name: '刘宝珺',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'changlongqing', name: '常隆庆', type: 'person' },
      { id: 'wangchengshan', name: '王成善', type: 'person' },
      { id: 'houmingcai', name: '侯明才', type: 'person' },
      { id: 'zengyunfu', name: '曾允孚', type: 'person' },
      { id: 'lichao', name: '李超', type: 'person' },
      { id: 'zhangshuichang', name: '张水昌', type: 'person' }
    ],
    links: [
      // 人物关系：常隆庆是刘宝珺的老师
      { source: 'liubaojun', target: 'changlongqing', label: '老师', type: 'teacher' },
      // 王成善、侯明才、李超、张水昌是刘宝珺的学生
      { source: 'liubaojun', target: 'wangchengshan', label: '学生', type: 'student' },
      { source: 'liubaojun', target: 'houmingcai', label: '学生', type: 'student' },
      { source: 'liubaojun', target: 'lichao', label: '学生', type: 'student' },
      { source: 'liubaojun', target: 'zhangshuichang', label: '学生', type: 'student' },
      // 曾允孚是刘宝珺的同事
      { source: 'liubaojun', target: 'zengyunfu', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 张倬元院士 ==========
  zhangzhuoyuan: {
    centerPerson: {
      id: 'zhangzhuoyuan',
      name: '张倬元',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'huangrunqiu', name: '黄润秋', type: 'person' },
      { id: 'xuqiang', name: '许强', type: 'person' },
      { id: 'changlongqing', name: '常隆庆', type: 'person' },
      { id: 'lichengsan', name: '李承三', type: 'person' },
      { id: 'cuipeng', name: '崔鹏', type: 'person' }
    ],
    links: [
      // 人物关系：黄润秋、许强是张倬元的学生
      { source: 'zhangzhuoyuan', target: 'huangrunqiu', label: '学生', type: 'student' },
      { source: 'zhangzhuoyuan', target: 'xuqiang', label: '学生', type: 'student' },
      // 常隆庆是张倬元的老师
      { source: 'zhangzhuoyuan', target: 'changlongqing', label: '老师', type: 'teacher' },
      // 李承三、崔鹏是张倬元的同事
      { source: 'zhangzhuoyuan', target: 'lichengsan', label: '同事', type: 'colleague' },
      { source: 'zhangzhuoyuan', target: 'cuipeng', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 黄润秋院士 ==========
  huangrunqiu: {
    centerPerson: {
      id: 'huangrunqiu',
      name: '黄润秋',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'zhangzhuoyuan', name: '张倬元', type: 'person' },
      { id: 'xuqiang', name: '许强', type: 'person' },
      { id: 'fanxuanmei', name: '范宣梅', type: 'person' }
    ],
    links: [
      // 人物关系：张倬元是黄润秋的老师
      { source: 'huangrunqiu', target: 'zhangzhuoyuan', label: '老师', type: 'teacher' },
      // 许强、范宣梅是黄润秋的同事
      { source: 'huangrunqiu', target: 'xuqiang', label: '同事', type: 'colleague' },
      { source: 'huangrunqiu', target: 'fanxuanmei', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 王成善院士 ==========
  wangchengshan: {
    centerPerson: {
      id: 'wangchengshan',
      name: '王成善',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'liubaojun', name: '刘宝珺', type: 'person' },
      { id: 'houmingcai', name: '侯明才', type: 'person' },
      { id: 'lichao', name: '李超', type: 'person' }
    ],
    links: [
      // 人物关系：刘宝珺是王成善的老师
      { source: 'wangchengshan', target: 'liubaojun', label: '老师', type: 'teacher' },
      // 侯明才、李超是王成善的同事
      { source: 'wangchengshan', target: 'houmingcai', label: '同事', type: 'colleague' },
      { source: 'wangchengshan', target: 'lichao', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 常隆庆 ==========
  changlongqing: {
    centerPerson: {
      id: 'changlongqing',
      name: '常隆庆',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'liubaojun', name: '刘宝珺', type: 'person' },
      { id: 'zhangzhuoyuan', name: '张倬元', type: 'person' },
      { id: 'lichengsan', name: '李承三', type: 'person' }
    ],
    links: [
      // 人物关系：刘宝珺、张倬元是常隆庆的学生
      { source: 'changlongqing', target: 'liubaojun', label: '学生', type: 'student' },
      { source: 'changlongqing', target: 'zhangzhuoyuan', label: '学生', type: 'student' },
      // 李承三是常隆庆的同事
      { source: 'changlongqing', target: 'lichengsan', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 多吉院士 ==========
  duoji: {
    centerPerson: {
      id: 'duoji',
      name: '多吉',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'tangjuxing', name: '唐菊兴', type: 'person' },
      { id: 'hanxiqiu', name: '韩喜球', type: 'person' }
    ],
    links: [
      // 人物关系：唐菊兴、韩喜球是多吉的同事（校友关系视为同事）
      { source: 'duoji', target: 'tangjuxing', label: '同事', type: 'colleague' },
      { source: 'duoji', target: 'hanxiqiu', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 许强教授 ==========
  xuqiang: {
    centerPerson: {
      id: 'xuqiang',
      name: '许强',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'zhangzhuoyuan', name: '张倬元', type: 'person' },
      { id: 'huangrunqiu', name: '黄润秋', type: 'person' },
      { id: 'cuipeng', name: '崔鹏', type: 'person' },
      { id: 'fanxuanmei', name: '范宣梅', type: 'person' }
    ],
    links: [
      // 人物关系：张倬元是许强的老师
      { source: 'xuqiang', target: 'zhangzhuoyuan', label: '老师', type: 'teacher' },
      // 黄润秋、崔鹏、范宣梅是许强的同事
      { source: 'xuqiang', target: 'huangrunqiu', label: '同事', type: 'colleague' },
      { source: 'xuqiang', target: 'cuipeng', label: '同事', type: 'colleague' },
      { source: 'xuqiang', target: 'fanxuanmei', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 曾允孚教授 ==========
  zengyunfu: {
    centerPerson: {
      id: 'zengyunfu',
      name: '曾允孚',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'liubaojun', name: '刘宝珺', type: 'person' },
      { id: 'wangchengshan', name: '王成善', type: 'person' }
    ],
    links: [
      // 人物关系：刘宝珺是曾允孚的同事
      { source: 'zengyunfu', target: 'liubaojun', label: '同事', type: 'colleague' },
      // 王成善是曾允孚的学生
      { source: 'zengyunfu', target: 'wangchengshan', label: '学生', type: 'student' }
    ]
  },

  // ========== 李承三教授 ==========
  lichengsan: {
    centerPerson: {
      id: 'lichengsan',
      name: '李承三',
      type: 'person'
    },
    nodes: [
      // 相关人物
      { id: 'changlongqing', name: '常隆庆', type: 'person' },
      { id: 'zhangzhuoyuan', name: '张倬元', type: 'person' }
    ],
    links: [
      // 人物关系：常隆庆、张倬元是李承三的同事
      { source: 'lichengsan', target: 'changlongqing', label: '同事', type: 'colleague' },
      { source: 'lichengsan', target: 'zhangzhuoyuan', label: '同事', type: 'colleague' }
    ]
  },

  // ========== 陈毓泰 ==========
  chenyutai: {
    centerPerson: {
      id: 'chenyutai',
      name: '陈毓泰',
      type: 'person'
    },
    nodes: [
      // 暂时没有相关人物数据，可以后续添加
    ],
    links: [
      // 暂时没有关系数据，可以后续添加
    ]
  },

  // ========== 吴宗岳 ==========
  wuzongyue: {
    centerPerson: {
      id: 'wuzongyue',
      name: '吴宗岳',
      type: 'person'
    },
    nodes: [
      // 暂时没有相关人物数据，可以后续添加
    ],
    links: [
      // 暂时没有关系数据，可以后续添加
    ]
  }
}

// 根据人物ID获取关系图谱数据
export function getRelationshipDataByPersonId(personId) {
  return relationshipData[personId] || null
}

// 获取所有可用的关系图谱
export function getAllRelationshipData() {
  return relationshipData
}
