<template>
  <div id="app" class="event-detail-page">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <i class="fas fa-arrow-left"></i>
      返回
    </button>

    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 标题 -->
        <h1 class="event-title">{{ eventData.title }}</h1>
        
        <!-- 图片居中显示 -->
        <div class="image-wrapper">
          <img 
            :src="eventData.image || defaultImage" 
            :alt="eventData.title" 
            class="event-image"
          >
        </div>
        
        <!-- 文字内容在图片下方 -->
        <div class="description-wrapper">
          <div 
            v-for="(paragraph, index) in eventData.content" 
            :key="index"
            class="description-text"
          >
            {{ paragraph }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import eventImageSrc from '@/assets/艺术大楼.jpg'

// 事件数据映射（从CDUT校史.md的第一段话）
const eventDataMap = {
  1956: {
    title: '成都地质勘探学院创办并开学',
    subtitle: '成都地质勘探学院创办并开学。',
    content: ['经国务院批准，筹建成都地质勘探学院，成为新中国第三所地质院校；以重大院校与部委抽调师资为基础启动建校。同年首期工程开工、秋季首批4个专业本科生入学，10月举行首届开学典礼。'],
    image: '',
    imageCaption: '成都地质勘探学院成立',
    tags: ['建校', '地质教育', '人才培养'],
    milestones: [
      { year: '1956', text: '经国务院批准，筹建成都地质勘探学院，成为新中国第三所地质院校' },
      { year: '1956', text: '以重大院校与部委抽调师资为基础启动建校' },
      { year: '1956', text: '首期工程开工、秋季首批4个专业本科生入学' },
      { year: '1956', text: '10月举行首届开学典礼' }
    ]
  },
  1958: {
    title: '扩展学科并更名为成都地质学院',
    subtitle: '扩展学科并更名为成都地质学院。',
    content: ['北京地质学院石油系部分师生转入，新增地球物理探矿、矿物矿石分析等方向，学科门类扩大。同年11月，学校更名为"成都地质学院"。'],
    image: '',
    imageCaption: '更名为成都地质学院',
    tags: ['学科扩展', '更名', '发展'],
    milestones: [
      { year: '1958', text: '北京地质学院石油系部分师生转入' },
      { year: '1958', text: '新增地球物理探矿、矿物矿石分析等方向，学科门类扩大' },
      { year: '1958', text: '11月，学校更名为"成都地质学院"' }
    ]
  },
  1990: {
    title: '油气藏国家重点实验室获批建设',
    subtitle: '油气藏国家重点实验室获批建设。',
    content: ['油气藏地质及开发工程国家重点实验室获国家计委、国家教委批准建设（与西南石油大学联合申请），依托优势学科打造高水平科研平台。'],
    image: '',
    imageCaption: '油气藏重点实验室获批建设',
    tags: ['科研平台', '国家重点实验室', '学科优势'],
    milestones: [
      { year: '1990', text: '油气藏地质及开发工程国家重点实验室获国家计委、国家教委批准建设' },
      { year: '1990', text: '与西南石油大学联合申请' },
      { year: '1990', text: '依托优势学科打造高水平科研平台' }
    ]
  },
  1993: {
    title: '更名为成都理工学院并获部属重点',
    subtitle: '更名为成都理工学院并获部属重点。',
    content: ['学校更名为"成都理工学院"，并被确定为地质矿产部重点高等院校，承担行业特色人才培养与科研任务。'],
    image: '',
    imageCaption: '学校更名庆祝大会',
    tags: ['更名', '部属重点', '学科建设'],
    milestones: [
      { year: '1993', text: '学校更名为"成都理工学院"' },
      { year: '1993', text: '被确定为地质矿产部重点高等院校' },
      { year: '1993', text: '承担行业特色人才培养与科研任务' }
    ]
  },
  1995: {
    title: '油气藏国重实验室通过验收',
    subtitle: '油气藏国重实验室通过验收。',
    content: ['油气藏地质及开发工程国家重点实验室通过国家验收并对外开放，形成稳定的高水平研究基地。'],
    image: '',
    imageCaption: '油气藏重点实验室通过验收',
    tags: ['科研平台', '验收', '对外开放'],
    milestones: [
      { year: '1995', text: '油气藏地质及开发工程国家重点实验室通过国家验收' },
      { year: '1995', text: '实验室对外开放' },
      { year: '1995', text: '形成稳定的高水平研究基地' }
    ]
  },
  2000: {
    title: '合作成立成都理工学院乐山分院',
    subtitle: '合作成立成都理工学院乐山分院',
    content: ['构建起了适度综合的多科性大学框架，使学校的办学规模和整体办学水平上了一个新台阶，与中国核工业西南核物理研究院合作成立成都理工学院乐山分院。'],
    image: '',
    imageCaption: '乐山分院挂牌暨开学典礼',
    tags: ['合作办学', '分院', '发展'],
    milestones: [
      { year: '2000', text: '构建起了适度综合的多科性大学框架' },
      { year: '2000', text: '办学规模和整体办学水平上了一个新台阶' },
      { year: '2000', text: '与中国核工业西南核物理研究院合作成立成都理工学院乐山分院' }
    ]
  },
  2001: {
    title: '更名为成都理工大学并完成合并',
    subtitle: '更名为成都理工大学并完成合并。',
    content: ['经教育部批准组建"成都理工大学"，并合并四川商业高等专科学校、有色金属地质职工大学，办学规模与结构进一步优化。'],
    image: '',
    imageCaption: '成都理工大学组建成立大会',
    tags: ['更名', '合并', '大学'],
    milestones: [
      { year: '2001', text: '经教育部批准组建"成都理工大学"' },
      { year: '2001', text: '合并四川商业高等专科学校、有色金属地质职工大学' },
      { year: '2001', text: '办学规模与结构进一步优化' }
    ]
  },
  2005: {
    title: '荣获国家科学技术进步奖一等奖',
    subtitle: '荣获国家科学技术进步奖一等奖',
    content: ['学校独立完成的"中国西南高边坡稳定性评价及灾害防治"项目荣获国家科学技术进步奖一等奖，这是学校建校50年的历史上首次获此殊荣。'],
    image: '',
    imageCaption: '三代理工人共同托举红灿灿的集体成果',
    tags: ['科技进步奖', '一等奖', '科研成就'],
    milestones: [
      { year: '2005', text: '学校独立完成的"中国西南高边坡稳定性评价及灾害防治"项目荣获国家科学技术进步奖一等奖' },
      { year: '2005', text: '学校建校50年的历史上首次获此殊荣' }
    ]
  },
  2007: {
    title: '地质灾害防治与地质环境保护国家重点实验室被正式批准建设',
    subtitle: '地质灾害防治与地质环境保护国家重点实验室被正式批准建设',
    content: ['地质灾害防治与地质环境保护国家重点实验室被正式批准建设，近十余年来，实验室承担国家和省部级各类研究课题近1200项，解决了地质灾害防治与国民经济重大工程建设中的一系列理论及技术难题。'],
    image: '',
    imageCaption: '地质灾害防治与地质环境保护国家重点实验室被正式批准建设',
    tags: ['国家重点实验室', '地质灾害', '科研平台'],
    milestones: [
      { year: '2007', text: '地质灾害防治与地质环境保护国家重点实验室被正式批准建设' },
      { year: '2007', text: '近十余年来，实验室承担国家和省部级各类研究课题近1200项' },
      { year: '2007', text: '解决了地质灾害防治与国民经济重大工程建设中的一系列理论及技术难题' }
    ]
  },
  2008: {
    title: '汶川地震中发挥地灾专业所长',
    subtitle: '汶川地震中发挥地灾专业所长。',
    content: ['5·12汶川地震发生后，学校专家第一时间奔赴灾区，开展灾害调查、监测与技术支撑，为抢险救援和灾后重建提供重要科技支撑。'],
    image: '',
    imageCaption: '学校多位专家赴汶川地震实地考察',
    tags: ['汶川地震', '技术服务', '社会贡献'],
    milestones: [
      { year: '2008', text: '5·12汶川地震发生后，学校专家第一时间奔赴灾区' },
      { year: '2008', text: '开展灾害调查、监测与技术支撑' },
      { year: '2008', text: '为抢险救援和灾后重建提供重要科技支撑' }
    ]
  },
  2010: {
    title: '部省共建成理正式签署',
    subtitle: '部省共建成理正式签署。',
    content: ['国土资源部与四川省人民政府签署共建成都理工大学协议，推动平台、项目、人才的系统性共建共享。'],
    image: '',
    imageCaption: '国土资源部与四川省共建成都理工大学签字仪式',
    tags: ['部省共建', '合作协议', '发展'],
    milestones: [
      { year: '2010', text: '国土资源部与四川省人民政府签署共建成都理工大学协议' },
      { year: '2010', text: '推动平台、项目、人才的系统性共建共享' }
    ]
  },
  2011: {
    title: '中共成都理工大学第一届委员会第一次全体会议胜利召开',
    subtitle: '中共成都理工大学第一届委员会第一次全体会议胜利召开',
    content: ['中共成都理工大学第一届委员会第一次全体会议胜利召开，大会提出了"建成优势特色显著的高水平大学"的总体目标和"全方位实施追赶型跨越式发展"的战略主题，开创了学校科学发展新局面，为建设高水平综合性大学奠定了坚实基础。'],
    image: '',
    imageCaption: '党代会现场',
    tags: ['党代会', '发展战略', '规划'],
    milestones: [
      { year: '2011', text: '中共成都理工大学第一届委员会第一次全体会议胜利召开' },
      { year: '2011', text: '提出"建成优势特色显著的高水平大学"的总体目标' },
      { year: '2011', text: '提出"全方位实施追赶型跨越式发展"的战略主题' },
      { year: '2011', text: '为建设高水平综合性大学奠定了坚实基础' }
    ]
  },
  2012: {
    title: '就业典型，高质量充分就业',
    subtitle: '就业典型，高质量充分就业。',
    content: ['学校被评为2011–2012年度全国50所毕业生就业典型经验高校，近三年就业率保持90%以上，并连续七次获"四川省高校毕业生就业工作先进集体"。'],
    image: '',
    imageCaption: '学校毕业生就业工作获表彰',
    tags: ['就业典型', '人才培养', '社会认可'],
    milestones: [
      { year: '2012', text: '学校被评为2011–2012年度全国50所毕业生就业典型经验高校' },
      { year: '2012', text: '近三年就业率保持90%以上' },
      { year: '2012', text: '连续七次获"四川省高校毕业生就业工作先进集体"' }
    ]
  },
  2013: {
    title: '理工东苑安居工程落成',
    subtitle: '理工东苑安居工程落成。',
    content: ['"理工东苑"团购住房从设想到竣工克服重重困难，自2011年9月4日奠基至建成，总建筑面积约62万平方米、40栋高楼沿东风渠而立。提供3400余套住房，基本解决全校在职及离退休教职工住房问题，成为学校"民生工程""安居工程"的标志性项目。'],
    image: '',
    imageCaption: '理工东苑奠基仪式现场',
    tags: ['安居工程', '民生工程', '教职工福利'],
    milestones: [
      { year: '2013', text: '"理工东苑"团购住房从设想到竣工克服重重困难' },
      { year: '2013', text: '自2011年9月4日奠基至建成，总建筑面积约62万平方米、40栋高楼沿东风渠而立' },
      { year: '2013', text: '提供3400余套住房，基本解决全校在职及离退休教职工住房问题' },
      { year: '2013', text: '成为学校"民生工程""安居工程"的标志性项目' }
    ]
  },
  2015: {
    title: '地质工程首获工程教育认证',
    subtitle: '地质工程首获工程教育认证。',
    content: ['3月地质工程专业通过工程教育认证，学校成为国内首个通过工程教育认证的高校；该专业源自"水文地质与工程地质""探矿工程"，多年建设形成优势。'],
    image: '',
    imageCaption: '地质工程评估小组与评审专家合影',
    tags: ['工程教育认证', '专业认证', '教育质量'],
    milestones: [
      { year: '2015', text: '3月地质工程专业通过工程教育认证' },
      { year: '2015', text: '学校成为国内首个通过工程教育认证的高校' },
      { year: '2015', text: '该专业源自"水文地质与工程地质""探矿工程"，多年建设形成优势' }
    ]
  },
  2016: {
    title: '"十三五"规划擘画新蓝图',
    subtitle: '"十三五"规划擘画新蓝图。',
    content: ['学校召开第四届教代会第一次会议，编制发布"十三五"发展规划，确立未来五年的目标、战略与行动纲领，含总体《规划纲要》、七个专项规划和学院规划。'],
    image: '',
    imageCaption: '学校东区航拍图',
    tags: ['十三五规划', '发展规划', '战略目标'],
    milestones: [
      { year: '2016', text: '学校召开第四届教代会第一次会议' },
      { year: '2016', text: '编制发布"十三五"发展规划' },
      { year: '2016', text: '确立未来五年的目标、战略与行动纲领，含总体《规划纲要》、七个专项规划和学院规划' }
    ]
  },
  2019: {
    title: '牛津布鲁克斯学院获批设立',
    subtitle: '牛津布鲁克斯学院获批设立。',
    content: ['"成都理工大学牛津布鲁克斯学院"获教育部审批设立，探索4+0中外合作办学新模式，拓展国际化人才培养。'],
    image: '',
    imageCaption: '英国牛津布鲁克斯大学校长阿里斯特･菲特致辞',
    tags: ['中外合作办学', '国际化', '人才培养'],
    milestones: [
      { year: '2019', text: '"成都理工大学牛津布鲁克斯学院"获教育部审批设立' },
      { year: '2019', text: '探索4+0中外合作办学新模式' },
      { year: '2019', text: '拓展国际化人才培养' }
    ]
  },
  2020: {
    title: '宜宾校区开校启用',
    subtitle: '宜宾校区开校启用。',
    content: ['成都理工大学宜宾校区一期建成交付并举行开校仪式，形成"一校两地"协同办学新格局。'],
    image: '',
    imageCaption: '仪式现场',
    tags: ['宜宾校区', '一校两地', '协同办学'],
    milestones: [
      { year: '2020', text: '成都理工大学宜宾校区一期建成交付并举行开校仪式' },
      { year: '2020', text: '形成"一校两地"协同办学新格局' }
    ]
  },
  2022: {
    title: '成都自然博物馆正式开放',
    subtitle: '成都自然博物馆正式开放。',
    content: ['成都自然博物馆（成都理工大学博物馆）正式开放，校地共建高水平科普平台。'],
    image: '',
    imageCaption: '成都自然博物馆正式开放',
    tags: ['自然博物馆', '科普平台', '校地合作'],
    milestones: [
      { year: '2022', text: '成都自然博物馆（成都理工大学博物馆）正式开放' },
      { year: '2022', text: '校地共建高水平科普平台' }
    ]
  },
  2023: {
    title: '油气藏实验室重组为"全国重点"',
    subtitle: '油气藏实验室重组为"全国重点"。',
    content: ['油气藏地质及开发工程重点实验室通过国家重点实验室重组，更名为"油气藏地质及开发工程全国重点实验室"。'],
    image: '',
    imageCaption: '会议现场',
    tags: ['全国重点实验室', '重组', '科研平台'],
    milestones: [
      { year: '2023', text: '油气藏地质及开发工程重点实验室通过国家重点实验室重组' },
      { year: '2023', text: '更名为"油气藏地质及开发工程全国重点实验室"' }
    ]
  },
  2024: {
    title: '获国家科技进步二等奖',
    subtitle: '获国家科技进步二等奖。',
    content: ['在国家科学技术奖励大会上，学校参与完成的渤海深部油气勘探相关研究获国家科学技术进步二等奖，持续服务国家能源战略。'],
    image: '',
    imageCaption: '国家科技进步二等奖',
    tags: ['科技进步奖', '二等奖', '能源战略'],
    milestones: [
      { year: '2024', text: '在国家科学技术奖励大会上，学校参与完成的渤海深部油气勘探相关研究获国家科学技术进步二等奖' },
      { year: '2024', text: '持续服务国家能源战略' }
    ]
  },
  2025: {
    title: '成都理工与地质大队深化校企合作，推进多领域创新',
    subtitle: '成都理工与地质大队深化校企合作，推进多领域创新。',
    content: ['四川省第一地质大队与成都理工大学签署战略合作协议，深化校企联合，推进地质灾害防治、地下水与环境保护、人工智能与新材料新装备研发等多领域产学研用融合。'],
    image: '',
    imageCaption: '签署战略合作协议现场',
    tags: ['校企合作', '产学研融合', '多领域创新'],
    milestones: [
      { year: '2025', text: '四川省第一地质大队与成都理工大学签署战略合作协议' },
      { year: '2025', text: '深化校企联合，推进地质灾害防治、地下水与环境保护、人工智能与新材料新装备研发等多领域产学研用融合' }
    ]
  }
}

export default {
  name: 'EventDetail',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const defaultImage = eventImageSrc
    
    // 从路由参数获取年份
    const year = parseInt(route.params.year || route.query.year || '1956')
    
    // 获取事件数据
    const eventData = ref({ ...eventDataMap[year] || eventDataMap[1956], year })
    
    // 导入对应年份的图片
    const loadEventImage = () => {
      const imageMap = {
        1956: '1956_01_成都地质勘探学院成立',
        1958: '1958年更名为成都地质学院',
        1990: '1990年油气藏重点实验室获批建设',
        1993: '1993年学校更名庆祝大会',
        1995: '1995年油气藏重点实验室通过验收',
        2000: '2000年乐山分院挂牌暨开学典礼',
        2001: '2001年成都理工大学组建成立大会',
        2005: '2005年三代理工人共同托举红灿灿的集体成果',
        2007: '2007年地质灾害防治与地质环境保护国家重点实验室被正式批准建设',
        2008: '2008年学校多位专家赴汶川地震实地考察',
        2010: '2010年国土资源部与四川省共建成都理工大学签字仪式',
        2011: '2011年党代会现场',
        2012: '2012年学校毕业生就业工作获表彰',
        2013: '2013年理工东苑奠基仪式现场',
        2015: '2015年地质工程评估小组与评审专家合影',
        2016: '2016年学校东区航拍图',
        2019: '2019年英国牛津布鲁克斯大学校长阿里斯特･菲特致辞',
        2020: '2020年仪式现场',
        2022: '2022年成都自然博物馆正式开放',
        2023: '2023年会议现场',
        2024: '2024年国家科技进步二等奖',
        2025: '2025年签署战略合作协议现场'
      }
      
      const imageKey = imageMap[year]
      if (imageKey) {
        // 动态导入图片
        const eventModules = import.meta.glob('@/assets/events/*.{jpg,jpeg,png}', { eager: true })
        const imageMap2 = {}
        Object.entries(eventModules).forEach(([path, module]) => {
          const fileName = path.split('/').pop() || ''
          const imageUrl = module?.default || module
          if (fileName && imageUrl) {
            const key = fileName.replace(/\.(jpg|jpeg|png)$/i, '')
            imageMap2[key] = imageUrl
          }
        })
        
        if (imageMap2[imageKey]) {
          eventData.value.image = imageMap2[imageKey]
        }
      }
    }
    
    // 返回上一页（根据来源参数决定）
    const goBack = () => {
      const from = route.query.from;
      
      if (from === 'keyword-rain') {
        // 从倾听雨声来的，返回倾听雨声
        router.push('/keyword-rain');
      } else if (from === 'digital-history') {
        // 从成理历史来的，返回成理历史
        router.push('/digital-history');
      } else {
        // 默认返回成理历史
        router.push('/digital-history');
      }
    }
    
    onMounted(() => {
      loadEventImage()
    })
    
    return {
      eventData,
      defaultImage,
      goBack
    }
  }
}
</script>

<style>
/* 全局样式：确保EventDetail页面背景色统一，移除底部底栏 */
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5 !important;
}

#app {
  height: 100%;
}

.page-container {
  height: 100%;
}
</style>

<style scoped>
.event-detail-page {
  min-height: 100vh;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: white;
  transform: translateX(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* 主要内容 */
.main-content {
  padding: 60px 20px 40px;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* 标题 */
.event-title {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
  padding: 0 20px;
  line-height: 1.4;
  width: 100%;
}

/* 图片容器 - 居中显示 */
.image-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  padding: 0 20px;
}

.event-image {
  max-width: 100%;
  max-height: 600px;
  width: auto;
  height: auto;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  object-fit: contain;
}

/* 文字内容容器 - 在图片下方 */
.description-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 0 20px;
  margin: 0 auto;
}

.description-text {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  text-align: left;
  margin-bottom: 16px;
  text-indent: 2em;
}

.description-text:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 50px 15px 20px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .event-title {
    font-size: 22px;
  }
  
  .event-image {
    max-width: 100%;
    max-height: 400px;
  }
  
  .container {
    gap: 20px;
  }
  
  .image-wrapper {
    margin: 15px 0;
    padding: 0 15px;
  }
  
  .description-wrapper {
    padding: 0 15px;
    max-width: 100%;
  }
  
  .description-text {
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 14px;
  }
}
</style>
