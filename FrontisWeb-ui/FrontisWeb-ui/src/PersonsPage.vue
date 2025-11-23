<template>
  <div class="persons-page">
    <!-- 固定背景图片 -->
    <div class="fixed-background" :style="{ backgroundImage: `url(${artBuildingBg})` }"></div>
    <!-- 返回按钮 -->
    <div class="back-section">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        返回首页
      </button>
    </div>

    <!-- 主要内容区 -->
    <main class="main-content">
      
      <!-- 英雄区：重点名人轮播展示 -->
      <section class="hero-carousel-section">
        <div class="hero-bg"></div>
        <div class="container">
          <div class="hero-header">
            <h1 class="hero-title">成理名人堂</h1>
            <p class="hero-subtitle">见证理工精神，传承学术薪火</p>
          </div>
          
          <!-- 3D透视轮播卡片 -->
          <div class="carousel-container">
            <button class="carousel-nav prev" @click="prevSlide" :disabled="isAnimating">
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <div class="carousel-wrapper">
              <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>加载中...</p>
              </div>
              <div v-else-if="displayPersons.length === 0" class="empty-state">
                <i class="fas fa-user-slash"></i>
                <h3>暂无人物数据</h3>
                <p>请检查后端服务是否正常运行</p>
              </div>
              <transition-group v-else name="carousel" tag="div" class="carousel-track">
                <div 
                  v-for="(person, index) in displayPersons" 
                  :key="person.id"
                  :class="['carousel-card', getCardClass(index)]"
                  @click="handleCardClick(index)"
                  @mouseenter="pauseAutoPlay"
                  @mouseleave="resumeAutoPlay"
                >
                  <div class="card-inner">
                    <div class="card-image">
                      <img :src="person.image" :alt="person.name" @error="handleImageError($event, person)">
                      <div class="card-overlay">
                        <div class="overlay-content">
                          <h3>{{ person.name }}</h3>
                          <p>{{ person.period }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="card-info">
                      <div class="card-badge" :class="person.badgeClass">{{ person.badge }}</div>
                      <h4>{{ person.name }}</h4>
                      <p class="card-title">{{ person.title }}</p>
                      <div class="card-tags">
                        <span v-for="tag in person.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </transition-group>
            </div>
            
            <button class="carousel-nav next" @click="nextSlide" :disabled="isAnimating">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <!-- 轮播指示器 -->
          <div class="carousel-indicators">
            <button 
              v-for="(person, index) in persons" 
              :key="index"
              :class="['indicator', { active: index === currentSlide }]"
              @click="goToSlide(index)"
            ></button>
          </div>
        </div>
      </section>

      <!-- 筛选标签区 -->
      <section class="filter-section">
        <div class="container">
          <div class="filter-header">
            <h2>探索更多</h2>
            <p>通过学科、年代、荣誉成就筛选查找</p>
          </div>
          
          <!-- 搜索框 -->
          <div class="search-box-container">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索人名..." 
                class="search-input"
              />
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="filter-tabs">
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-graduation-cap"></i>
                学科领域
              </label>
              <div class="filter-options">
                <button 
                  v-for="subject in subjects" 
                  :key="subject"
                  :class="['filter-btn', { active: selectedSubject === subject }]"
                  @click="filterBySubject(subject)"
                >
                  {{ subject }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-calendar-alt"></i>
                年代
              </label>
              <div class="filter-options">
                <button 
                  v-for="era in eras" 
                  :key="era"
                  :class="['filter-btn', { active: selectedEra === era }]"
                  @click="filterByEra(era)"
                >
                  {{ era }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">
                <i class="fas fa-trophy"></i>
                荣誉成就
              </label>
              <div class="filter-options">
                <button 
                  v-for="achievement in achievements" 
                  :key="achievement"
                  :class="['filter-btn', { active: selectedAchievement === achievement }]"
                  @click="filterByAchievement(achievement)"
                >
                  {{ achievement }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="filter-actions">
            <button class="reset-btn" @click="resetFilters">
              <i class="fas fa-redo"></i>
              重置筛选
            </button>
          </div>
        </div>
      </section>

      <div class="container">
        <!-- 名人网格展示区 -->
        <section class="persons-grid-section">
          <div class="grid-header">
            <h2>全部名人 <span class="count">({{ filteredPersons.length }})</span></h2>
            <div class="view-options">
              <button 
                :class="['view-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
              >
                <i class="fas fa-th"></i>
              </button>
              <button 
                :class="['view-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
          
          <!-- 网格视图 -->
          <transition 
            name="fade" 
            mode="out-in"
          >
            <div 
              v-if="viewMode === 'grid'"
              :key="currentPage"
              :class="['persons-grid', viewMode]"
            >
              <div v-if="isLoading" class="loading-state-grid">
                <div class="spinner"></div>
                <p>加载中...</p>
              </div>
              <div v-else-if="paginatedPersons.length === 0" class="empty-state-grid">
                <i class="fas fa-user-slash"></i>
                <h3>暂无人物数据</h3>
                <p>请检查后端服务是否正常运行</p>
              </div>
              <div 
                v-else
                v-for="person in paginatedPersons" 
                :key="person.id"
                class="person-grid-card"
                @click="viewPerson(person.id)"
                @mouseenter="onCardHover(person.id)"
                @mouseleave="onCardLeave"
              >
                <div class="grid-card-image">
                  <img :src="person.image" :alt="person.name" @error="handleImageError($event, person)">
                  <div class="grid-card-badge" :class="person.badgeClass">
                    {{ person.badge }}
                  </div>
                  <div class="grid-card-hover-overlay">
                    <div class="hover-content">
                      <h3>{{ person.name }}</h3>
                      <p>{{ person.period }}</p>
                      <div class="hover-tags">
                        <span v-for="tag in person.tags" :key="tag">{{ tag }}</span>
                      </div>
                      <button class="hover-btn">
                        <i class="fas fa-plus-circle"></i>
                        了解更多
                      </button>
                    </div>
                  </div>
                </div>
                <div class="grid-card-info">
                  <h4>{{ person.name }}</h4>
                  <p class="grid-card-title">{{ person.title }}</p>
                  <div class="grid-card-meta">
                    <span class="meta-item">
                      <i class="fas fa-user-graduate"></i>
                      {{ person.badge }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          
          <!-- 列表视图 -->
          <transition 
            name="fade"
            mode="out-in"
          >
            <div 
              v-if="viewMode === 'list'"
              :key="currentPage"
              class="persons-list"
            >
              <div 
                v-for="person in paginatedPersons" 
                :key="person.id"
                class="person-list-item"
                @click="viewPerson(person.id)"
              >
                <div class="list-item-image">
                  <img :src="person.image" :alt="person.name">
                </div>
                <div class="list-item-content">
                  <div class="list-item-header">
                    <h3>{{ person.name }}</h3>
                    <span class="list-item-badge" :class="person.badgeClass">{{ person.badge }}</span>
                  </div>
                  <p class="list-item-title">{{ person.title }}</p>
                  <p class="list-item-period">{{ person.period }}</p>
                  <div class="list-item-tags">
                    <span v-for="tag in person.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          
          <!-- 分页控件 -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              首页
            </button>
            <button 
              class="page-btn" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              上一页
            </button>
            <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
            </button>
            <button 
              class="page-btn" 
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              末页
            </button>
          </div>
        </section>

      </div>
    </main>

    <!-- 底部 -->
    <footer class="page-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h4>成都理工大学数字校史馆</h4>
            <p>穷究于理，成就于工</p>
          </div>
          <div class="footer-links">
            <a href="#">联系我们</a>
            <a href="#">隐私政策</a>
            <a href="#">使用条款</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import xuqiangImg from '@/assets/persons/xuqiang.png'
import artBuildingBg from '@/assets/艺术大楼1.jpg'
// ⭐ 从数据库加载人物数据
import { getAllPersonProfiles, getAllPersons } from '@/services/personDataService.js'

// 使用 Vite 的 glob import 预加载所有人物图片
const personImages = import.meta.glob('@/assets/persons/*.png', { eager: true, import: 'default' })

export default {
  name: 'PersonsPage',
  components: {
  },
  data() {
    return {
      // 背景图片
      artBuildingBg,
      
      // 轮播相关
      currentSlide: 0,
      isAnimating: false,
      autoPlayTimer: null,
      
      // 视图模式
      viewMode: 'grid', // 'grid' or 'list'
      
      // 分页相关
      currentPage: 1,
      pageSize: 9,
      
      // 筛选相关
      searchQuery: '',
      selectedSubject: '全部',
      selectedEra: '全部',
      selectedAchievement: '全部',
      
      subjects: ['全部', '地质学', '工程学', '石油', '环境', '经济', '法律', '艺术', '计算机', '其他'],
      eras: ['全部', '20世纪初', '20世纪中', '21世纪'],
      achievements: ['全部', '院士', '奠基人', '国家奖', '教授', '其他'],
      
      // 加载状态
      isLoading: false,
      allPersonsData: {}, // 存储从数据库加载的所有人物数据
      
      // 名人数据（从数据库加载，初始为空）
      persons: [],
      
      hoveredCardId: null
    }
  },
  async mounted() {
    await this.loadPersonsData()
    this.startAutoPlay()
  },
  beforeUnmount() {
    this.pauseAutoPlay()
  },
  computed: {
    displayPersons() {
      // 为轮播创建扩展数组，实现无限循环效果
      return this.persons;
    },
    
    // 从高级数据中获取所有人物，用于探索更多区域
    allPersonsForExplore() {
      const allPersonsData = this.allPersonsData;
      const exploredPersonIds = this.persons.map(p => p.id);
      
      // 辅助函数：从年份字符串中提取数字年份
      const extractYear = (yearStr) => {
        if (!yearStr) return null;
        // 处理各种格式：'1931', '1980-至今', '1983-1988', '2000-至今'等
        const match = yearStr.toString().match(/(\d{4})/);
        return match ? parseInt(match[1]) : null;
      };
      
      // 辅助函数：根据年份计算时代
      const calculateEra = (year) => {
        if (!year) return '21世纪';
        if (year >= 2000) return '21世纪';
        if (year >= 1950) return '20世纪中';
        if (year >= 1900) return '20世纪初';
        return '20世纪初';
      };
      
      // 使用统一的映射函数
      const allPersons = Object.values(allPersonsData).map(personData => 
        this.mapPersonToDisplayFormat(personData)
      );
      
      // 过滤掉已经在名人堂中的人物
      return allPersons.filter(person => !exploredPersonIds.includes(person.id));
    },
    
    filteredPersons() {
      // 合并名人堂和探索更多的人物
      const allPersonsToShow = [...this.persons, ...this.allPersonsForExplore];
      
      // 去重：使用Map保证每个ID只出现一次
      const uniquePersonsMap = new Map();
      allPersonsToShow.forEach(person => {
        if (!uniquePersonsMap.has(person.id)) {
          uniquePersonsMap.set(person.id, person);
        }
      });
      const uniquePersons = Array.from(uniquePersonsMap.values());
      
      // 先筛选
      const filtered = uniquePersons.filter(person => {
        // 搜索匹配
        const searchMatch = !this.searchQuery || 
                           person.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           person.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const subjectMatch = this.selectedSubject === '全部' || person.subject === this.selectedSubject;
        const eraMatch = this.selectedEra === '全部' || person.era === this.selectedEra;
        const achievementMatch = this.selectedAchievement === '全部' || person.achievement === this.selectedAchievement;
        
        return searchMatch && subjectMatch && eraMatch && achievementMatch;
      });
      
      // 按照指定顺序排序：许强校长 -> 五大学科奠基人 -> 八大教授 -> 其他人物
      const personOrder = [
        // 许强校长
        'xuqiang',
        // 五大学科奠基人
        'zhangzhuoyuan', 'luozhetan', 'liubaojun', 'jinjingfu', 'zengyunfu',
        // 八大教授
        'zhangyanseng', 'liuzuyi', 'zhouxiaohe', 'lizhichang', 
        'wuyansheng', 'litangmi', 'changlongqing', 'lichengsan'
      ];
      
      // 创建优先级映射
      const priorityMap = new Map();
      personOrder.forEach((id, index) => {
        priorityMap.set(id, index);
      });
      
      // 排序：优先级人物在前，其他人物保持原顺序在后
      return filtered.sort((a, b) => {
        const aPriority = priorityMap.has(a.id) ? priorityMap.get(a.id) : 9999;
        const bPriority = priorityMap.has(b.id) ? priorityMap.get(b.id) : 9999;
        
        // 如果都有优先级或都没有优先级，保持原顺序
        if (aPriority === bPriority) return 0;
        
        // 否则按照优先级排序
        return aPriority - bPriority;
      });
    },
    
    // 分页后的数据
    paginatedPersons() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredPersons.slice(start, end);
    },
    
    // 总页数
    totalPages() {
      return Math.ceil(this.filteredPersons.length / this.pageSize);
    }
  },
  methods: {
    // 加载人物数据
    async loadPersonsData() {
      this.isLoading = true
      try {
        console.log('[PersonsPage] 开始加载人物数据...')
        // 加载所有人物数据
        this.allPersonsData = await getAllPersonProfiles()
        console.log('[PersonsPage] 原始数据:', this.allPersonsData)
        
        // 转换数据格式并选择前9个重要人物作为轮播
        const allPersonsList = Object.values(this.allPersonsData).map(personData => 
          this.mapPersonToDisplayFormat(personData)
        )
        
        console.log('[PersonsPage] 转换后的数据列表:', allPersonsList)
        
        // 按照特定顺序排列轮播人物：许强校长在中间，然后是五大学科奠基人，然后是八大教授
        const personOrder = [
          // 许强校长
          'xuqiang',
          // 五大学科奠基人
          'zhangzhuoyuan', 'luozhetan', 'liubaojun', 'jinjingfu', 'zengyunfu',
          // 八大教授
          'zhangyanseng', 'liuzuyi', 'zhouxiaohe', 'lizhichang', 
          'wuyansheng', 'litangmi', 'changlongqing', 'lichengsan'
        ]
        
        // 创建ID到人物的映射
        const personMap = new Map()
        allPersonsList.forEach(person => {
          personMap.set(person.id, person)
        })
        
        // 按照指定顺序排列人物
        this.persons = personOrder
          .map(id => personMap.get(id))
          .filter(person => person !== undefined) // 过滤掉不存在的人物
        
        // 如果persons为空，使用默认图片
        this.persons.forEach(person => {
          if (!person.image || person.image === 'null' || person.image === 'undefined') {
            person.image = xuqiangImg
          }
        })
        
        console.log('✅ 人物数据加载完成:', {
          total: allPersonsList.length,
          carouselPersons: this.persons.length,
          persons: this.persons
        })
        
        // 如果数据为空，显示警告
        if (this.persons.length === 0) {
          console.warn('⚠️ 警告：没有加载到任何人物数据！')
        }
      } catch (error) {
        console.error('❌ 加载人物数据失败:', error)
        console.error('❌ 错误详情:', error.stack)
        // 如果加载失败，使用空数组
        this.persons = []
        this.allPersonsData = {}
      } finally {
        this.isLoading = false
      }
    },
    
    // 将数据库人物数据转换为显示格式
    mapPersonToDisplayFormat(personData) {
      // 辅助函数：从年份字符串中提取数字年份
      const extractYear = (yearStr) => {
        if (!yearStr) return null;
        const match = yearStr.toString().match(/(\d{4})/);
        return match ? parseInt(match[1]) : null;
      };
      
      // 辅助函数：根据年份计算时代
      const calculateEra = (year) => {
        if (!year) return '21世纪';
        if (year >= 2000) return '21世纪';
        if (year >= 1950) return '20世纪中';
        if (year >= 1900) return '20世纪初';
        return '20世纪初';
      };
      
      // 获取时间信息（由于timeline已被移除，从biography或其他信息中提取）
      let period = '';
      let era = '21世纪';
      
      // 尝试从biography中提取时间信息
      if (personData.biography && personData.biography.length > 0) {
        const firstBio = personData.biography[0];
        if (firstBio.content) {
          const yearMatch = firstBio.content.match(/(\d{4})/);
          if (yearMatch) {
            const year = parseInt(yearMatch[1]);
            era = calculateEra(year);
            period = `${year}—`;
          }
        }
      }
      
      // 根据标签和subtitle判断学科和荣誉成就（称号、奖项等）
      let subject = '其他';
      let achievement = '其他';
      let badge = '教授';
      let badgeClass = 'badge-professor';
      
      // 优先从subtitle中提取头衔信息
      if (personData.subtitle) {
        const subtitle = personData.subtitle.toString();
        if (subtitle.includes('院士')) {
          achievement = '院士';
          badge = '院士';
          badgeClass = 'badge-president';
        } else if (subtitle.includes('名誉校长') || subtitle.includes('校长')) {
          badge = '名誉校长';
          badgeClass = 'badge-president';
          achievement = achievement === '其他' ? '教授' : achievement;
        } else if (subtitle.includes('奠基人')) {
          achievement = '奠基人';
          badge = '奠基人';
          badgeClass = 'badge-founder';
        } else if (subtitle.includes('部长') || subtitle.includes('厅长')) {
          badge = '部长';
          badgeClass = 'badge-president';
        } else if (subtitle.includes('烈士')) {
          badge = '烈士';
          badgeClass = 'badge-founder';
          achievement = '国家奖';
        } else if (subtitle.includes('副教授')) {
          badge = '副教授';
          badgeClass = 'badge-associate-professor';
          achievement = '教授';
        } else if (subtitle.includes('教授')) {
          badge = '教授';
          achievement = '教授';
        }
      }
      
      // 从keyTags中补充判断
      const keyTags = personData.keyTags || [];
      if (keyTags.some(tag => tag.includes('院士'))) {
        achievement = '院士';
        badge = '院士';
        badgeClass = 'badge-president';
      } else if (keyTags.some(tag => tag.includes('奠基') || tag.includes('建校元勋') || tag.includes('五大奠基人'))) {
        achievement = '奠基人';
        badge = '奠基人';
        badgeClass = 'badge-founder';
      } else if (keyTags.some(tag => tag.includes('国家科学技术进步奖') || tag.includes('国家奖'))) {
        if (achievement === '其他') {
          achievement = '国家奖';
        }
      }
      
      // 判断学科
      if (keyTags.some(tag => tag.includes('地质'))) {
        subject = '地质学';
      } else if (keyTags.some(tag => tag.includes('工程') && !tag.includes('地质工程'))) {
        subject = '工程学';
      } else if (keyTags.some(tag => tag.includes('石油'))) {
        subject = '石油';
      } else if (keyTags.some(tag => tag.includes('环境'))) {
        subject = '环境';
      } else if (keyTags.some(tag => tag.includes('经济'))) {
        subject = '经济';
      } else if (keyTags.some(tag => tag.includes('法律') || tag.includes('法学'))) {
        subject = '法律';
      } else if (keyTags.some(tag => tag.includes('艺术') || tag.includes('数字叙事') || tag.includes('交互'))) {
        subject = '艺术';
      } else if (keyTags.some(tag => tag.includes('计算机') || tag.includes('人工智能') || tag.includes('虚拟'))) {
        subject = '计算机';
      }
      
      // 处理图片路径
      let imageUrl = xuqiangImg; // 默认图片（如果所有方法都失败）
      
      // 辅助函数：从预加载的图片中查找
      const findImageInGlob = (fileName) => {
        const imagePath = `/src/assets/persons/${fileName}`;
        for (const [path, module] of Object.entries(personImages)) {
          if (path.includes(fileName)) {
            return module;
          }
        }
        return null;
      };
      
      if (personData.image) {
        const imgPath = personData.image;
        console.log(`[mapPersonToDisplayFormat] 处理图片路径: ${imgPath} for ${personData.name}`);
        
        // 如果已经是完整URL，直接使用
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          imageUrl = imgPath;
        } else if (imgPath.startsWith('persons/')) {
          // 处理 persons/{person_id}.png 格式（新格式）
          const fileName = imgPath.substring('persons/'.length);
          const foundImage = findImageInGlob(fileName);
          if (foundImage) {
            imageUrl = foundImage;
            console.log(`[mapPersonToDisplayFormat] ✅ 成功从glob加载图片: ${fileName}`);
          } else {
            console.warn(`[mapPersonToDisplayFormat] ⚠️ 未找到图片: ${fileName}`);
          }
        } else if (imgPath.startsWith('/assets/persons/')) {
          // 处理 /assets/persons/ 开头的路径
          const fileName = imgPath.substring('/assets/persons/'.length);
          const foundImage = findImageInGlob(fileName);
          imageUrl = foundImage || imageUrl;
        } else if (imgPath.startsWith('@/assets/persons/')) {
          // 处理 @/assets/persons/ 开头的路径
          const fileName = imgPath.substring('@/assets/persons/'.length);
          const foundImage = findImageInGlob(fileName);
          imageUrl = foundImage || imageUrl;
        } else {
          // 其他情况，尝试直接作为文件名查找
          const foundImage = findImageInGlob(imgPath);
          imageUrl = foundImage || imgPath;
        }
      } else {
        // 如果没有图片路径，使用 person_id 尝试加载
        const personId = personData.personId || personData.id;
        if (personId) {
          const fileName = `${personId}.png`;
          const foundImage = findImageInGlob(fileName);
          if (foundImage) {
            imageUrl = foundImage;
            console.log(`[mapPersonToDisplayFormat] ✅ 通过 person_id 成功加载图片: ${fileName}`);
          } else {
            console.warn(`[mapPersonToDisplayFormat] ⚠️ 未找到图片: ${fileName}`);
          }
        }
      }
      
      console.log(`[mapPersonToDisplayFormat] 最终图片URL: ${imageUrl} for ${personData.name}`);
      
      return {
        id: personData.personId || personData.id,
        name: personData.name || '',
        title: personData.subtitle || '',
        period: period,
        image: imageUrl,
        badge: badge,
        badgeClass: badgeClass,
        tags: keyTags,
        subject: subject,
        era: era,
        achievement: achievement
      };
    },
    
    // 返回首页
    goBack() {
      this.$router.push('/');
    },
    
    // 轮播控制
    nextSlide() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.currentSlide = (this.currentSlide + 1) % this.persons.length;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    
    prevSlide() {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.currentSlide = (this.currentSlide - 1 + this.persons.length) % this.persons.length;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    
    goToSlide(index) {
      if (this.isAnimating || index === this.currentSlide) return;
      this.isAnimating = true;
      this.currentSlide = index;
      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    
    getCardClass(index) {
      const total = this.persons.length;
      let diff = (index - this.currentSlide + total) % total;
      if (diff > total / 2) diff -= total;
      
      if (diff === 0) return 'active';
      if (diff === 1) return 'next';
      if (diff === 2) return 'next2';
      if (diff === -1) return 'prev';
      if (diff === -2) return 'prev2';
      return 'hidden';
    },
    
    handleCardClick(index) {
      if (index === this.currentSlide) {
        this.viewPerson(this.persons[index].id);
      } else {
        this.goToSlide(index);
      }
    },
    
    // 自动播放
    startAutoPlay() {
      this.autoPlayTimer = setInterval(() => {
        this.nextSlide();
      }, 5000);
    },
    
    pauseAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
      }
    },
    
    resumeAutoPlay() {
      this.pauseAutoPlay();
      this.startAutoPlay();
    },
    
    // 筛选方法
    filterBySubject(subject) {
      this.selectedSubject = subject;
      this.currentPage = 1; // 重置到第一页
    },
    
    filterByEra(era) {
      this.selectedEra = era;
      this.currentPage = 1; // 重置到第一页
    },
    
    filterByAchievement(achievement) {
      this.selectedAchievement = achievement;
      this.currentPage = 1; // 重置到第一页
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.selectedSubject = '全部';
      this.selectedEra = '全部';
      this.selectedAchievement = '全部';
      this.currentPage = 1; // 重置到第一页
    },
    
    // 卡片交互
    onCardHover(id) {
      this.hoveredCardId = id;
    },
    
    onCardLeave() {
      this.hoveredCardId = null;
    },
    
    // 查看人物详情
    viewPerson(personId) {
      this.$router.push({
        path: `/person/${personId}`,
        query: { from: 'persons' }
      });
    },
    
    // 处理图片加载错误
    handleImageError(event, person) {
      console.warn(`图片加载失败: ${person.image} for ${person.name}`);
      event.target.src = xuqiangImg;
    },
    
    showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      
      Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        fontSize: '14px',
        maxWidth: '300px',
        wordWrap: 'break-word'
      });
      
      const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
      };
      toast.style.backgroundColor = colors[type] || colors.info;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3000);
    }
  },
  
  watch: {
    searchQuery() {
      this.currentPage = 1; // 搜索时重置到第一页
    }
  }
}
</script>

<style scoped>
/* 页面基础样式 */
.persons-page {
  position: relative;
  min-height: 100vh;
  background: transparent;
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 固定背景图片 */
.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(0.5);
  z-index: 0;
  pointer-events: none;
}

.main-content {
  position: relative;
  padding: 0;
  background: transparent;
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ============ 返回按钮样式 ============ */
.back-section {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 25px;
  color: #4a90e2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: #4a90e2;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.3);
}

/* ============ 英雄轮播区域 ============ */
.hero-carousel-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  backdrop-filter: blur(0px);
  overflow: hidden;
  padding: 0;
  z-index: 1;
}

.hero-carousel-section .container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 20px;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  pointer-events: none;
}

.hero-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  color: white;
  margin: 0 0 15px 0;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

/* 轮播容器 */
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 80px;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.carousel-nav:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
  transform: translateY(-50%) scale(1.1);
  border-color: white;
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-nav.prev {
  left: calc(50% - 425px);
}

.carousel-nav.next {
  right: calc(50% - 425px);
}

.carousel-wrapper {
  width: 100%;
  max-width: 1400px;
  height: 550px;
  position: relative;
  perspective: 1500px;
}

.carousel-track {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 轮播卡片 */
.carousel-card {
  position: absolute;
  width: 400px;
  height: 500px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.carousel-card.active {
  transform: translateX(0) scale(1) rotateY(0deg);
  z-index: 3;
  opacity: 1;
}

.carousel-card.next {
  transform: translateX(320px) scale(0.85) rotateY(-15deg);
  z-index: 2;
  opacity: 0.7;
}

.carousel-card.prev {
  transform: translateX(-320px) scale(0.85) rotateY(15deg);
  z-index: 2;
  opacity: 0.7;
}

.carousel-card.next2 {
  transform: translateX(580px) scale(0.7) rotateY(-25deg);
  z-index: 1;
  opacity: 0.5;
}

.carousel-card.prev2 {
  transform: translateX(-580px) scale(0.7) rotateY(25deg);
  z-index: 1;
  opacity: 0.5;
}

.carousel-card.hidden {
  transform: translateX(0) scale(0.7);
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

.card-inner {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  transition: all 0.4s ease;
}

.carousel-card.active .card-inner {
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
}

.card-image {
  position: relative;
  height: 330px;
  overflow: hidden;
  width: 100%;
}

.card-image img {
  width: 100%;  
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s ease;
  display: block;
  margin: 0;
  padding: 0;
}

.carousel-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: 30px 20px 20px;
  transform: translateY(100%);
  transition: transform 0.4s ease;
}

.carousel-card:hover .card-overlay {
  transform: translateY(0);
}

.overlay-content h3 {
  color: white;
  font-size: 1.5rem;
  margin: 0 0 5px 0;
}

.overlay-content p {
  color: rgba(255,255,255,0.9);
  margin: 0;
}

.card-info {
  padding: 8px 25px 25px 25px;
  position: relative;
}

.card-badge {
  position: absolute;
  top: -15px;
  right: 25px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.badge-president {
  background: linear-gradient(45deg, #4a90e2, #357abd);
}

.badge-founder {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
}

.badge-professor {
  background: linear-gradient(45deg, #95a5a6, #7f8c8d);
}

.badge-associate-professor {
  background: linear-gradient(45deg, #a0a0a0, #8a8a8a);
}

.card-info h4 {
  font-size: 1.5rem;
  margin: 3px 0 5px 0;
  color: #2c3e50;
}

.card-title {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0 0 15px 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.card-tags .tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

/* 轮播指示器 */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.3);
  border-color: white;
}

.indicator:hover:not(.active) {
  background: rgba(255,255,255,0.5);
}

/* ============ 筛选区域 ============ */
.filter-section {
  position: relative;
  z-index: 1;
  padding: 60px 0;
  background: transparent;
  width: 100%;
}

.filter-header {
  text-align: center;
  margin-bottom: 40px;
}

.filter-header h2 {
  font-size: 2rem;
  color: white;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.filter-header p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* 搜索框样式 */
.search-box-container {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 55px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  color: white;
}

.search-input:focus {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 1rem;
  cursor: pointer;
  padding: 5px 10px;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.clear-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.filter-tabs {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
}

.filter-label i {
  color: white;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-btn {
  padding: 10px 24px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: white;
}

.filter-btn:hover {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  color: white;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.filter-actions {
  text-align: center;
  margin-top: 20px;
}

.reset-btn {
  padding: 10px 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

/* ============ 网格展示区域 ============ */
.persons-grid-section {
  position: relative;
  z-index: 1;
  padding: 40px 0 80px;
  background: transparent;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.grid-header h2 {
  font-size: 2rem;
  color: white;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.count {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7f8c8d;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.view-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* 网格视图 */
.persons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  gap: 30px;
  justify-content: center;
  min-height: 500px; /* 保持最小高度，防止布局抖动 */
}

.person-grid-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.person-grid-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.grid-card-image {
  position: relative;
  height: 300px;
  overflow: hidden;
  width: 100%;
}

.grid-card-image img {
  width: 105%;
  height: 105%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s ease;
  display: block; /* 去除图片底部默认间隙 */
  margin: 0; /* 去除任何可能的默认边距 */
  padding: 0; /* 去除任何可能的默认内边距 */
}

.person-grid-card:hover .grid-card-image img {
  transform: scale(1.15);
}

.grid-card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 2;
}

.grid-card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3));
  display: flex;
  align-items: flex-end;
  padding: 30px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.person-grid-card:hover .grid-card-hover-overlay {
  opacity: 1;
}

.hover-content {
  width: 100%;
}

.hover-content h3 {
  color: white;
  font-size: 1.5rem;
  margin: 0 0 8px 0;
}

.hover-content p {
  color: rgba(255,255,255,0.9);
  margin: 0 0 15px 0;
}

.hover-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.hover-tags span {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(5px);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
}

.hover-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.hover-btn:hover {
  transform: scale(1.05);
}

.grid-card-info {
  padding: 12px 25px 25px 25px;
  min-height: 100px; /* 固定最小高度，避免内容长短不一导致跳动 */
}

.grid-card-info h4 {
  font-size: 1.3rem;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.grid-card-title {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.grid-card-meta {
  display: flex;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  font-size: 0.9rem;
}

/* 列表视图 */
.persons-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.person-list-item {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.person-list-item:hover {
  transform: translateX(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.list-item-image {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  overflow: hidden;
  flex-shrink: 0;
}

.list-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-content {
  flex: 1;
}

.list-item-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.list-item-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: #2c3e50;
}

.list-item-badge {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.list-item-title {
  color: #7f8c8d;
  margin: 0 0 8px 0;
}

.list-item-period {
  color: #95a5a6;
  margin: 0 0 12px 0;
  font-size: 0.9rem;
}

.list-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list-item-tags .tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
}

.list-item-action {
  flex-shrink: 0;
}

.list-view-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #357abd 0%, #2a6aa8 100%);
}

/* ============ 分页控件样式 ============ */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  padding: 20px 0;
}

.page-btn {
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  color: white;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 20px;
}

/* ============ 动画效果 ============ */
/* 淡入淡出过渡 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 底部样式 */
.page-footer {
  position: relative;
  z-index: 1;
  background: transparent;
  backdrop-filter: blur(0px);
  color: white;
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info h4 {
  margin: 0 0 10px 0;
}

.footer-info p {
  margin: 0;
  opacity: 0.8;
}

.footer-links {
  display: flex;
  gap: 30px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.7;
}

/* 加载和空状态样式 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: white;
  text-align: center;
}

.loading-state .spinner,
.loading-state-grid .spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state i,
.empty-state-grid i {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state h3,
.empty-state-grid h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
}

.empty-state p,
.empty-state-grid p {
  font-size: 1rem;
  opacity: 0.8;
  margin: 0;
}

.loading-state-grid,
.empty-state-grid {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: white;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .carousel-wrapper {
    max-width: 1200px;
  }
  
  .carousel-card.next2 {
    transform: translateX(520px) scale(0.65) rotateY(-25deg);
    opacity: 0.4;
  }
  
  .carousel-card.prev2 {
    transform: translateX(-520px) scale(0.65) rotateY(25deg);
    opacity: 0.4;
  }
}

@media (max-width: 768px) {
  .search-box {
    max-width: 100%;
  }
  
  .search-input {
    padding: 12px 45px 12px 50px;
    font-size: 0.95rem;
  }
  
  .search-icon {
    left: 15px;
    font-size: 1rem;
  }
  
  .hero-carousel-section .container {
    padding: 20px 10px;
  }
  
  .hero-header {
    margin-bottom: 20px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .carousel-container {
    padding: 0 20px;
  }
  
  .carousel-wrapper {
    max-width: 900px;
  }
  
  .carousel-card {
    width: 300px;
    height: 450px;
  }
  
  .carousel-card.next2,
  .carousel-card.prev2 {
    opacity: 0;
    pointer-events: none;
  }
  
  .carousel-indicators {
    margin-top: 20px;
  }
  
  .carousel-nav {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .persons-grid {
    grid-template-columns: 1fr;
  }
  
  .person-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-item-image {
    width: 100%;
    height: 200px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
}
</style>

