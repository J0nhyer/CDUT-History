// 成都理工大学校史知识图谱数据
// 包含50位重要人物节点及其关系，以及成都理工大学中心节点

import { cdutPersonsDetailed } from './cdutPersonsDetailed.js'

// 影响力等级配置
const influenceLevelMap = {
  // 等级5：奠基人物 + 名誉校长（中心区域）
  changlongqing: 5,
  zhangzhuoyuan: 5,
  liubaojun: 5,
  
  // 等级4：院士（较大）
  wangchengshan: 4,
  duoji: 4,
  tangjuxing: 4,
  cuipeng: 4,
  huruizhong: 4,
  zhangshuichang: 4,
  huangrunqiu: 4,
  hanxiqiu: 4,
  
  // 等级3：国家高层次人才（长江学者、杰青、IEEE Fellow等）（中等）
  xuqiang: 3,
  tuoxianguo: 3,
  huangqi: 3,
  lichao: 3,
  pengqiang: 3,
  huwei: 3,
  liushugen: 3,
  tangchuan: 3,
  liuyun: 3,
  
  // 等级2：重要学者（国务院学科评议组成员、团队负责人、全国重点实验室主任等）
  nishijun: 2,
  shizejin: 2,
  yixiangyi: 2,
  fanxuanmei: 2,
  houmingcai: 2,
  geliangquan: 2,
  
  // 等级1：其他重要学者和教师
  liuqinyou: 1,
  hubing: 1,
  tangqingli: 1,
  huchangsheng: 1,
  xudachun: 1,
  luoqiang: 1,
  laijiao: 1,
  huguangjie: 1,
  libin: 1,
  zengyunfu: 1,
  lichengsan: 1,
  chenyutai: 1,
  wuzongyue: 1,
  zhangwentao: 1,
  wangjun: 1,
  lixiaoming: 1,
  zhangminghua: 1,
  liuyong: 1,
  chenweidong: 1,
  wangli: 1,
  zhouyong: 1,
  sunming: 1,
  zhaoyuan: 1,
  liwei: 1,
  wanghai: 1,
  zhangli: 1,
  liujun: 1,
  wangming: 1,
  zhanghua: 1
}

// 根据等级获取颜色
function getInfluenceColor(level) {
  const colors = {
    5: '#FFD700',  // 金色 - 奠基人
    4: '#FF6347',  // 橙红色 - 院士
    3: '#4169E1',  // 皇家蓝 - 国家高层次人才
    2: '#32CD32',  // 酸橙绿 - 重要学者
    1: '#00CED1'   // 深青色 - 其他学者
  }
  return colors[level] || '#888888'
}

// 将人物详细数据转换为知识图谱节点格式
function convertPersonToNode(person) {
  const level = influenceLevelMap[person.id] || 1
  return {
    id: person.id,
    name: person.name,
    type: '人物',
    description: person.description.length > 200 ? person.description.substring(0, 200) + '...' : person.description,
    period: person.period,
    year: person.year,
    achievements: person.achievements || [],
    color: getInfluenceColor(level),
    influenceLevel: level,
    icon: '👤',
    isCenter: false
  }
}

// 生成所有节点
const centerNode = {
  id: '成都理工大学',
  name: '成都理工大学',
  type: '组织机构',
  description: '成都理工大学始建于1956年，前身为成都地质勘探学院。2001年，学校重组更名为成都理工大学。2017年，学校进入国家"双一流"建设高校行列。',
  period: '1956-至今',
  year: 1956,
  achievements: [
    '1956年建校',
    '2017年进入双一流',
    '22个教学学院',
    '9个一级学科博士点'
  ],
  color: '#9013FE',
  icon: '🏫',
  isCenter: true,
  fx: 0,  // 固定X位置
  fy: 0,  // 固定Y位置
  fz: 0   // 固定Z位置
}

// 生成所有人物节点（50位）
const personNodes = Object.values(cdutPersonsDetailed).map(convertPersonToNode)

// 为每个节点分配固定位置，按影响力等级分层
const nodesByLevel = {}
personNodes.forEach(node => {
  const level = node.influenceLevel || 1
  if (!nodesByLevel[level]) {
    nodesByLevel[level] = []
  }
  nodesByLevel[level].push(node)
})

// 为每个节点计算位置
let nodeIndex = 0
personNodes.forEach(node => {
  const level = node.influenceLevel || 1
  const nodesInLevel = nodesByLevel[level]
  const indexInLevel = nodesInLevel.indexOf(node)
  const totalInLevel = nodesInLevel.length
  
  // 根据等级计算半径 - 增加半径避免节点太近
  const radiusMap = { 5: 100, 4: 150, 3: 200, 2: 250, 1: 300 }
  const radius = radiusMap[level] || 300
  
  // 在圆周上均匀分布
  const angle = (indexInLevel / totalInLevel) * Math.PI * 2
  
  // 添加随机偏移避免完全重叠 - 增加偏移范围
  const randomOffsetX = Math.random() * 40 - 20
  const randomOffsetY = Math.random() * 40 - 20
  
  node.fx = Math.cos(angle) * radius + randomOffsetX
  node.fy = Math.sin(angle) * radius + randomOffsetY
  node.fz = (Math.random() - 0.5) * 50
})

// 生成所有节点数组
const allNodes = [centerNode, ...personNodes]

// 生成所有链接
const links = []

// 1. 每个人物与成都理工大学的关系 - 已移除，不显示中心连接

// 2. 人物之间的关系
Object.values(cdutPersonsDetailed).forEach(person => {
  if (person.relationships && person.relationships.length > 0) {
    person.relationships.forEach(rel => {
      // 检查目标人物是否存在
      const targetPerson = Object.values(cdutPersonsDetailed).find(p => p.id === rel.target)
      if (targetPerson) {
        // 避免重复链接（双向关系只保存一次）
        const existingLink = links.find(l => 
          (l.source === person.id && l.target === rel.target) ||
          (l.source === rel.target && l.target === person.id)
        )
        if (!existingLink) {
          // 根据关系类型设置不同的权重
          let linkValue = 2
          if (rel.type === '师生' || rel.type === '学术传承') {
            linkValue = 4
          } else if (rel.type === '学术合作' || rel.type === '同事') {
            linkValue = 3
          } else if (rel.type === '校友') {
            linkValue = 2
          }
          
          links.push({
            source: person.id,
            target: rel.target,
            value: linkValue,
            type: rel.type || rel.relation || '相关'
          })
        }
      }
    })
  }
})

// 导出知识图谱数据
export const historyGraphData = {
  nodes: allNodes,
  links: links
}
