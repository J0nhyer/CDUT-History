/**
 * 人物详情数据配置
 * 用于统一管理所有人物的详细信息
 */

export const personsDetailData = {
  // 刘宝珺院士
  liubaojun: {
    id: 'liubaojun',
    name: '刘宝珺',
    subtitle: '中国科学院院士 · 沉积地质学家 · 成都理工大学名誉校长',
    archiveNumber: 'CDUT00000000002',
    image: require('@/assets/liubaojun.png'),
    imageCaption: '暂无标注信息',
    createTime: '2025.10.15',
    basicInfo: {
      '生卒年': '1931—',
      '性别': '男',
      '民族': '汉族',
      '籍贯': '天津市',
      '学历': '清华大学地质系、北京地质学院研究生班',
      '职业': '沉积地质学家、中国科学院院士',
      '出生地': '天津市',
      '主要成就': '中国沉积地质学奠基人之一',
      '荣誉称号': '李四光地质科学奖获得者、斯潘迪亚罗夫奖获得者',
      '学术地位': '成都理工大学名誉校长'
    },
    corePositions: [
      '成都理工大学名誉校长',
      '地质矿产部成都地质矿产研究所名誉所长',
      '中国地质学会沉积地质专业委员会主任',
      '国际沉积学家协会会员'
    ],
    academicAchievements: [
      '提出"岩相古地理"理论',
      '发表论文100多篇',
      '出版专著近20部',
      '主编《沉积岩石学》、《岩相古地理基础及方法》等经典教材',
      '主持编制中比例尺岩相古地理图',
      '建立扬子地台陆缘寒武纪磷矿风暴岩沉积模式'
    ],
    educationContributions: [
      '培养大批沉积地质学专业人才',
      '推动建立完整的沉积地质学教学体系',
      '建立沉积学研究室',
      '推动产学研结合',
      '建立国际化的学术交流平台'
    ]
  },

  // 张倬元院士
  zhangzhuoyuan: {
    id: 'zhangzhuoyuan',
    name: '张倬元',
    subtitle: '中国工程地质学科的奠基人之一 · 成都地质学院原院长',
    archiveNumber: 'CDUT00000000001',
    image: require('@/assets/zhangzhuoyuan.png'),
    imageCaption: '暂无标注信息',
    createTime: '2025.10.15',
    basicInfo: {
      '生卒年': '1926-2022',
      '性别': '男',
      '民族': '汉族',
      '籍贯': '河北省',
      '学历': '清华大学地质系',
      '职业': '工程地质学家、教育家',
      '出生地': '河北省',
      '主要成就': '中国工程地质学科奠基人之一',
      '荣誉称号': '成都地质学院院长（1983-1988）',
      '学术地位': '工程地质学国家重点学科创建者'
    },
    corePositions: [
      '成都地质学院院长（1983-1988）',
      '工程地质学国家重点学科创建者',
      '《工程地质分析原理》作者'
    ],
    academicAchievements: [
      '主编《工程地质分析原理》经典教材',
      '创建工程地质学学科体系',
      '在地质灾害防治、边坡稳定性分析等领域取得突破',
      '建立"张倬元学派"',
      '培养包括黄润秋、许强等在内的杰出学生'
    ],
    educationContributions: [
      '为国家重点学科答辩，用担架抬着前往北京',
      '成功为学校争取到工程地质学国家重点学科',
      '培养大批工程地质学专业人才',
      '创立影响力巨大的"张倬元学派"',
      '推动学校工程地质学科发展'
    ]
  },

  // 其他人物（占位，待补充）
  huangrunqiu: {
    id: 'huangrunqiu',
    name: '黄润秋',
    subtitle: '生态环境部党组书记、部长',
    archiveNumber: 'CDUT00000000003',
    image: require('@/assets/huangrunqiu.png'),
    imageCaption: '暂无标注信息',
    createTime: '2025.10.15',
    basicInfo: {
      '生卒年': '1963—',
      '性别': '男',
      '民族': '汉族',
      '籍贯': '四川省',
      '学历': '成都理工大学地质工程专业',
      '职业': '工程地质学家、政府官员',
      '出生地': '四川省',
      '主要成就': '工程地质学专家',
      '荣誉称号': '生态环境部党组书记、部长',
      '学术地位': '成都理工大学杰出校友'
    },
    corePositions: [
      '生态环境部党组书记、部长',
      '成都理工大学杰出校友'
    ],
    academicAchievements: [],
    educationContributions: []
  },

  wangchengshan: {
    id: 'wangchengshan',
    name: '王成善',
    subtitle: '中国科学院院士 · 沉积地质学家',
    archiveNumber: 'CDUT00000000004',
    image: require('@/assets/wangchengshan.png'),
    imageCaption: '暂无标注信息',
    createTime: '2025.10.15',
    basicInfo: {
      '生卒年': '1951—',
      '性别': '男',
      '民族': '汉族',
      '籍贯': '四川省',
      '学历': '成都理工大学',
      '职业': '沉积地质学家、中国科学院院士',
      '出生地': '四川省',
      '主要成就': '深时地质学和古地理学专家',
      '荣誉称号': '中国科学院院士',
      '学术地位': '成都理工大学教授'
    },
    corePositions: [
      '中国科学院院士',
      '成都理工大学教授'
    ],
    academicAchievements: [],
    educationContributions: []
  }
}

// 根据ID获取人物详情
export function getPersonDetailById(personId) {
  return personsDetailData[personId] || null
}

// 获取所有人物的简要列表
export function getAllPersonsList() {
  return Object.values(personsDetailData).map(person => ({
    id: person.id,
    name: person.name,
    subtitle: person.subtitle,
    image: person.image
  }))
}

