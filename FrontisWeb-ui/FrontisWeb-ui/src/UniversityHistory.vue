<template>
  <div class="university-history">
    <!-- 背景粒子效果 -->
    <div class="particles-bg">
      <div class="particle" v-for="n in 50" :key="n" :style="getParticleStyle(n)"></div>
    </div>

    <!-- 主标题区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="main-title">
          <span class="title-word" v-for="(word, index) in titleWords" :key="index" 
                :style="{ animationDelay: index * 0.2 + 's' }">
            {{ word }}
          </span>
        </h1>
        <p class="hero-subtitle">探索成都理工大学的辉煌历程</p>
        <div class="scroll-indicator">
          <div class="scroll-arrow"></div>
        </div>
      </div>
    </section>

    <!-- 时间轴导航 -->
    <nav class="timeline-nav">
      <div class="nav-item" 
           v-for="(section, index) in sections" 
           :key="index"
           @click="scrollToSection(section.id)"
           :class="{ active: activeSection === section.id }">
        <div class="nav-icon" :class="section.icon"></div>
        <span class="nav-text">{{ section.name }}</span>
      </div>
    </nav>

    <!-- 校史馆概况 -->
    <section id="overview" class="content-section overview-section">
      <div class="section-header">
        <h2 class="section-title">校史馆基本概况</h2>
        <div class="title-decoration"></div>
      </div>
      
      <div class="overview-grid">
        <div class="overview-card" v-for="(item, index) in overviewData" :key="index">
          <div class="card-icon" :class="item.icon"></div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-content">{{ item.content }}</p>
          <div class="card-stats">
            <span class="stat-number">{{ item.number }}</span>
            <span class="stat-unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 发展沿革时间轴 -->
    <section id="timeline" class="content-section timeline-section">
      <div class="section-header">
        <h2 class="section-title">发展沿革</h2>
        <div class="title-decoration"></div>
      </div>
      
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <div class="timeline-item" v-for="(event, index) in timelineEvents" :key="index">
          <div class="timeline-dot" :class="event.type"></div>
          <div class="timeline-content">
            <div class="timeline-year">{{ event.year }}</div>
            <div class="timeline-title">{{ event.title }}</div>
            <div class="timeline-description">{{ event.description }}</div>
            <div class="timeline-tags">
              <span class="tag" v-for="tag in event.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 馆藏情况3D展示 -->
    <section id="collection" class="content-section collection-section">
      <div class="section-header">
        <h2 class="section-title">馆藏情况与展陈内容</h2>
        <div class="title-decoration"></div>
      </div>
      
      <div class="collection-3d">
        <div class="collection-cube" ref="collectionCube">
          <div class="cube-face front">
            <h3>档案资料</h3>
            <p>成都理工大学、成都理工学院等历史档案</p>
          </div>
          <div class="cube-face back">
            <h3>数字化服务</h3>
            <p>线上档案查阅与利用服务</p>
          </div>
          <div class="cube-face right">
            <h3>校史研究</h3>
            <p>学校发展历程与重大事件</p>
          </div>
          <div class="cube-face left">
            <h3>展览展示</h3>
            <p>学校历史风貌与成就展示</p>
          </div>
          <div class="cube-face top">
            <h3>对外交流</h3>
            <p>与其他高校档案馆合作</p>
          </div>
          <div class="cube-face bottom">
            <h3>服务功能</h3>
            <p>师生校友档案查阅服务</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 文化建设作用 -->
    <section id="culture" class="content-section culture-section">
      <div class="section-header">
        <h2 class="section-title">文化建设作用</h2>
        <div class="title-decoration"></div>
      </div>
      
      <div class="culture-features">
        <div class="feature-card" v-for="(feature, index) in cultureFeatures" :key="index">
          <div class="feature-icon" :class="feature.icon"></div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-highlights">
            <span class="highlight" v-for="highlight in feature.highlights" :key="highlight">
              {{ highlight }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色亮点 -->
    <section id="highlights" class="content-section highlights-section">
      <div class="section-header">
        <h2 class="section-title">特色与亮点</h2>
        <div class="title-decoration"></div>
      </div>
      
      <div class="highlights-grid">
        <div class="highlight-item" v-for="(highlight, index) in highlights" :key="index">
          <div class="highlight-badge">{{ highlight.badge }}</div>
          <h3 class="highlight-title">{{ highlight.title }}</h3>
          <p class="highlight-content">{{ highlight.content }}</p>
          <div class="highlight-visual" :class="highlight.visualClass"></div>
        </div>
      </div>
    </section>

    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <span class="back-icon">←</span>
      <span class="back-text">返回主页</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'UniversityHistory',
  data() {
    return {
      titleWords: ['成都', '理工', '大学', '历史'],
      activeSection: 'overview',
      sections: [
        { id: 'overview', name: '概况', icon: 'icon-overview' },
        { id: 'timeline', name: '沿革', icon: 'icon-timeline' },
        { id: 'collection', name: '馆藏', icon: 'icon-collection' },
        { id: 'culture', name: '文化', icon: 'icon-culture' },
        { id: 'highlights', name: '亮点', icon: 'icon-highlights' }
      ],
      overviewData: [
        {
          title: '馆舍面积',
          content: '校史馆总面积达2149.6平方米',
          number: '2149.6',
          unit: '平方米',
          icon: 'icon-building'
        },
        {
          title: '库房面积',
          content: '专业档案存储空间',
          number: '1514.6',
          unit: '平方米',
          icon: 'icon-storage'
        },
        {
          title: '服务时间',
          content: '周一至周五开放服务',
          number: '5',
          unit: '天/周',
          icon: 'icon-time'
        },
        {
          title: '馆藏机构',
          content: '涵盖多个历史院校档案',
          number: '4+',
          unit: '个机构',
          icon: 'icon-archive'
        }
      ],
      timelineEvents: [
        {
          year: '1956',
          title: '成都地质勘探学院成立',
          description: '国务院批准建立成都地质勘探学院。高等教育部和地质部联合发文组建学校，以重庆大学地质系、西北大学和南京大学地质系的工科部分为基础，调集北京地质勘探学院、长春地质勘探学院、西北大学、南京大学等十多所院校的部分教师及其他机关、部队的干部370余人参与组建。建校当年，学校开设地质测量及找矿系、水文地质与工程地质系、石油与天然气地质与勘探系，面向全国招收首届本科生1551人。',
          type: 'founding',
          tags: ['建校', '地质', '教育']
        },
        {
          year: '1958',
          title: '更名为成都地质学院',
          description: '根据中共中央、国务院决定，学校改由四川省领导，更名为成都地质学院。',
          type: 'development',
          tags: ['更名', '发展', '地质']
        },
        {
          year: '1960',
          title: '开始招收研究生',
          description: '学校开始招收研究生，并举办地质类函授教育，办学层次进一步提升。',
          type: 'development',
          tags: ['研究生', '函授', '教育']
        },
        {
          year: '1962',
          title: '改由地质部领导',
          description: '学校改由地质部领导，各专业学制改为五年。',
          type: 'development',
          tags: ['管理', '学制', '发展']
        },
        {
          year: '1966',
          title: '文化大革命影响',
          description: '因"文化大革命"，学校停止招生6年。',
          type: 'development',
          tags: ['历史', '停招']
        },
        {
          year: '1969',
          title: '改由四川省人民政府领导',
          description: '学校改由四川省人民政府领导。',
          type: 'development',
          tags: ['管理', '发展']
        },
        {
          year: '1977',
          title: '恢复招生',
          description: '全国恢复统一招生考试制度后，学校恢复招生，当年招收794名。',
          type: 'development',
          tags: ['恢复招生', '高考']
        },
        {
          year: '1981',
          title: '获得硕士学位授予权',
          description: '学校成为国家恢复学位制度后首批获得硕士学位授予权的高校。',
          type: 'upgrade',
          tags: ['硕士学位', '学位', '教育']
        },
        {
          year: '1984',
          title: '获得博士学位授予权',
          description: '学校获得博士学位授予权，办学层次进一步提升。',
          type: 'upgrade',
          tags: ['博士学位', '学位', '教育']
        },
        {
          year: '1993',
          title: '更名为成都理工学院',
          description: '学校更名为成都理工学院，学科领域进一步扩展。',
          type: 'development',
          tags: ['更名', '发展', '理工']
        },
        {
          year: '1999',
          title: '设立博士后科研流动站',
          description: '学校设立地质学一级学科博士后科研流动站。',
          type: 'upgrade',
          tags: ['博士后', '科研', '教育']
        },
        {
          year: '2000',
          title: '划转地方管理',
          description: '学校划转地方，成为中央与地方共建、以四川省人民政府管理为主的省属重点大学。',
          type: 'development',
          tags: ['管理', '省属', '重点大学']
        },
        {
          year: '2001',
          title: '更名为成都理工大学',
          description: '经教育部批准，成都理工学院与四川商业高等专科学校、有色金属地质职工大学合并，组建成都理工大学。学校正式更名为成都理工大学。',
          type: 'upgrade',
          tags: ['升格', '大学', '合并']
        },
        {
          year: '2010',
          title: '国土资源部与四川省共建',
          description: '国土资源部与四川省人民政府签署共建成都理工大学协议，学校成为国土资源部与四川省人民政府共建高校。',
          type: 'upgrade',
          tags: ['部省共建', '发展']
        },
        {
          year: '2016',
          title: '建校60周年庆典',
          description: '学校举行建校60周年总结发展暨"双一流"建设部省市校推进大会，国土资源部、四川省、成都市、成都理工大学开启共建"双一流"大学的新征程。',
          type: 'upgrade',
          tags: ['60周年', '双一流', '校庆']
        },
        {
          year: '2017',
          title: '进入"双一流"建设',
          description: '学校进入国家首轮"双一流"建设高校行列，成为国家一流学科建设高校。',
          type: 'upgrade',
          tags: ['双一流', '建设', '发展']
        },
        {
          year: '2019',
          title: '教育部与四川省共建',
          description: '成都理工大学成为教育部与四川省共建的"双一流"建设高校。',
          type: 'upgrade',
          tags: ['部省共建', '双一流', '发展']
        },
        {
          year: '2022',
          title: '进入第二轮"双一流"',
          description: '学校顺利进入国家第二轮"双一流"建设名单。',
          type: 'upgrade',
          tags: ['双一流', '建设', '发展']
        },
        {
          year: '2025',
          title: '70周年校庆公告',
          description: '学校发布70周年校庆公告，宣布将于2026年迎来建校70周年。',
          type: 'current',
          tags: ['70周年', '校庆', '未来']
        }
      ],
      cultureFeatures: [
        {
          title: '保存学校记忆',
          description: '系统收集、整理、保存学校从创办到现代的完整档案资料',
          icon: 'icon-memory',
          highlights: ['历史脉络', '文化传承', '记忆库']
        },
        {
          title: '弘扬校史精神',
          description: '通过展览、宣传、校友活动等形式展示学校奋斗历程',
          icon: 'icon-spirit',
          highlights: ['文化认同', '精神传承', '自豪感']
        },
        {
          title: '支持学术研究',
          description: '为师生提供历史研究、文化研究的原始资料支持',
          icon: 'icon-research',
          highlights: ['学术支持', '教学资源', '研究基地']
        },
        {
          title: '服务师生校友',
          description: '提供档案查阅、校友服务、对外交流等综合服务',
          icon: 'icon-service',
          highlights: ['便民服务', '校友支持', '社会服务']
        }
      ],
      highlights: [
        {
          title: '地质工科特色',
          content: '突出地质探矿、服务国家资源战略的办学特色',
          badge: '特色',
          visualClass: 'visual-geology'
        },
        {
          title: '历史贯通记录',
          content: '完整记录从地质学院到理工大学的完整发展历程',
          badge: '历史',
          visualClass: 'visual-timeline'
        },
        {
          title: '数字化服务',
          content: '推进档案数字化，提供线上查阅利用服务',
          badge: '创新',
          visualClass: 'visual-digital'
        },
        {
          title: '对外交流合作',
          content: '与其他高校档案馆开展经验交流与合作',
          badge: '开放',
          visualClass: 'visual-exchange'
        }
      ],
      cubeRotationInterval: null, // 保存interval ID，用于清理旋转动画（已禁用）
      currentRotation: 0, // 当前旋转角度（已禁用）
      scrollHandler: null // 滚动事件处理器，用于清理
    }
  },
  mounted() {
    // 延迟初始化，确保DOM完全渲染
    setTimeout(() => {
      try {
        this.initAnimations();
        this.setupScrollSpy();
        // 延迟启动旋转动画，确保ref已准备好
        setTimeout(() => {
          this.startCubeRotation();
        }, 100);
      } catch (error) {
        console.error('Error in mounted:', error);
      }
    }, 50);
  },
  beforeUnmount() {
    // 清理interval，避免内存泄漏
    if (this.cubeRotationInterval) {
      clearInterval(this.cubeRotationInterval);
      this.cubeRotationInterval = null;
    }
    // 清理滚动事件监听器
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  },
  methods: {
    getParticleStyle(index) {
      return {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's'
      }
    },
    initAnimations() {
      // 初始化各种动画效果
      this.$nextTick(() => {
        try {
          const sections = document.querySelectorAll('.content-section');
          if (!sections || sections.length === 0) {
            console.warn('No content sections found');
            return;
          }
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry && entry.target && entry.isIntersecting) {
                entry.target.classList.add('animate-in');
              }
            });
          });
          
          sections.forEach(section => {
            if (section) {
              observer.observe(section);
            }
          });
        } catch (error) {
          console.error('Error initializing animations:', error);
        }
      });
    },
    setupScrollSpy() {
      try {
        const sections = document.querySelectorAll('.content-section');
        const navItems = document.querySelectorAll('.nav-item');
        
        if (!sections || sections.length === 0) {
          console.warn('No sections found for scroll spy');
          return;
        }
        
        // 保存handler引用以便清理
        this.scrollHandler = () => {
          try {
            let current = '';
            
            if (!sections || sections.length === 0) return;
            
            sections.forEach(section => {
              if (!section || !section.offsetTop) return;
              
              const sectionTop = section.offsetTop;
              const sectionHeight = section.clientHeight || 0;
              
              if (window.pageYOffset >= sectionTop - 200) {
                const id = section.getAttribute ? section.getAttribute('id') : null;
                if (id) {
                  current = id;
                }
              }
            });
            
            if (navItems && navItems.length > 0) {
              navItems.forEach(item => {
                if (!item) return;
                try {
                  if (item.classList) {
                    item.classList.remove('active');
                  }
                  
                  if (item.getAttribute && current) {
                    const onclick = item.getAttribute('onclick');
                    if (onclick && onclick.includes(current)) {
                      if (item.classList) {
                        item.classList.add('active');
                      }
                    }
                  }
                } catch (err) {
                  console.warn('Error updating nav item:', err);
                }
              });
            }
            
            if (current) {
              this.activeSection = current;
            }
          } catch (error) {
            console.error('Error in scroll handler:', error);
          }
        };
        
        window.addEventListener('scroll', this.scrollHandler);
      } catch (error) {
        console.error('Error setting up scroll spy:', error);
      }
    },
    startCubeRotation() {
      // 完全禁用旋转动画，避免style访问错误
      // 如果需要旋转效果，请使用CSS动画
      return;
      
      /* 原始旋转代码已禁用
      try {
        // 多次尝试获取ref，因为Vue可能还没准备好
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryStart = () => {
          attempts++;
          
          // 确保ref存在
          if (!this.$refs || !this.$refs.collectionCube) {
            if (attempts < maxAttempts) {
              setTimeout(tryStart, 50);
            } else {
              console.warn('collectionCube ref not found after multiple attempts');
            }
            return;
          }
          
          const cube = this.$refs.collectionCube;
          
          // 检查是否是真实DOM元素
          if (!cube || !cube.$el || typeof cube.$el !== 'object') {
            // Vue 3 ref可能是组件实例，需要获取$el
            const element = cube.$el || cube;
            if (!element || !element.style) {
              if (attempts < maxAttempts) {
                setTimeout(tryStart, 50);
              }
              return;
            }
            
            // 使用CSS变量或data属性来避免直接操作style
            if (element && element.style) {
              element.setAttribute('data-rotation', '0');
              
              // 清理之前的interval
              if (this.cubeRotationInterval) {
                clearInterval(this.cubeRotationInterval);
                this.cubeRotationInterval = null;
              }
              
              // 使用CSS变量控制旋转
              this.currentRotation = 0;
              this.cubeRotationInterval = setInterval(() => {
                if (!this.$refs || !this.$refs.collectionCube) {
                  if (this.cubeRotationInterval) {
                    clearInterval(this.cubeRotationInterval);
                    this.cubeRotationInterval = null;
                  }
                  return;
                }
                
                const currentCube = this.$refs.collectionCube;
                const currentElement = currentCube.$el || currentCube;
                
                if (currentElement && currentElement.style) {
                  this.currentRotation = (this.currentRotation + 1) % 360;
                  currentElement.style.setProperty('--rotation', `${this.currentRotation}deg`);
                  currentElement.style.transform = `rotateY(${this.currentRotation}deg)`;
                } else {
                  if (this.cubeRotationInterval) {
                    clearInterval(this.cubeRotationInterval);
                    this.cubeRotationInterval = null;
                  }
                }
              }, 50);
            }
          }
        };
        
        tryStart();
      } catch (error) {
        console.error('Error starting cube rotation:', error);
      }
      */
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    goBack() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.university-history {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

/* 粒子背景 */
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 6s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}

/* 主标题区域 */
.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
}

.main-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.title-word {
  display: inline-block;
  animation: titleSlideIn 1s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
}

@keyframes titleSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.8s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

/* 时间轴导航 */
.timeline-nav {
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: 500;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-10px);
}

.nav-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
}

/* 内容区域 */
.content-section {
  padding: 100px 50px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.content-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 3rem;
  color: white;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
  margin: 0 auto;
  border-radius: 2px;
}

/* 概况网格 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.overview-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.overview-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
}

.card-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 15px;
}

.card-content {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
  line-height: 1.6;
}

.card-stats {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #4ecdc4;
}

.stat-unit {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 时间轴 */
.timeline-section {
  background: rgba(0, 0, 0, 0.2);
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ff6b6b, #4ecdc4);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
}

.timeline-item:nth-child(odd) .timeline-content {
  margin-right: 50%;
  padding-right: 40px;
  text-align: right;
}

.timeline-item:nth-child(even) .timeline-content {
  margin-left: 50%;
  padding-left: 40px;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid white;
  z-index: 10;
}

.timeline-dot.founding { background: #ff6b6b; }
.timeline-dot.development { background: #4ecdc4; }
.timeline-dot.upgrade { background: #45b7d1; }
.timeline-dot.current { background: #96ceb4; }

.timeline-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.timeline-year {
  font-size: 1.5rem;
  font-weight: 900;
  color: #4ecdc4;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 1.3rem;
  color: #000000;
  margin-bottom: 15px;
  font-weight: 600;
}

.timeline-description {
  color: #000000;
  line-height: 1.6;
  margin-bottom: 15px;
}

.timeline-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 3D收藏展示 */
.collection-3d {
  perspective: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
}

.collection-cube {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  /* 移除CSS动画，改用JS控制，避免冲突 */
}

.cube-face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.cube-face.front { transform: rotateY(0deg) translateZ(100px); }
.cube-face.back { transform: rotateY(180deg) translateZ(100px); }
.cube-face.right { transform: rotateY(90deg) translateZ(100px); }
.cube-face.left { transform: rotateY(-90deg) translateZ(100px); }
.cube-face.top { transform: rotateX(90deg) translateZ(100px); }
.cube-face.bottom { transform: rotateX(-90deg) translateZ(100px); }

.cube-face h3 {
  color: white;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.cube-face p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 文化特色 */
.culture-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 20px;
  font-weight: 600;
}

.feature-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 25px;
}

.feature-highlights {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.highlight {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 亮点展示 */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.highlight-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.highlight-item:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
}

.highlight-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.highlight-title {
  font-size: 1.3rem;
  color: white;
  margin-bottom: 15px;
  font-weight: 600;
}

.highlight-content {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 20px;
}

.highlight-visual {
  width: 100%;
  height: 100px;
  border-radius: 10px;
  margin-top: 20px;
}

.visual-geology { background: linear-gradient(45deg, #8B4513, #D2691E); }
.visual-timeline { background: linear-gradient(45deg, #4ECDC4, #45B7D1); }
.visual-digital { background: linear-gradient(45deg, #96CEB4, #FFEAA7); }
.visual-exchange { background: linear-gradient(45deg, #DDA0DD, #98D8C8); }

/* 返回按钮 */
.back-button {
  position: fixed;
  bottom: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  z-index: 100;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.back-icon {
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .content-section {
    padding: 50px 20px;
  }
  
  .timeline-nav {
    display: none;
  }
  
  .timeline-item:nth-child(odd) .timeline-content,
  .timeline-item:nth-child(even) .timeline-content {
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
    padding-right: 20px;
    text-align: left;
  }
  
  .timeline-line {
    left: 20px;
  }
  
  .timeline-dot {
    left: 20px;
  }
}
</style>
