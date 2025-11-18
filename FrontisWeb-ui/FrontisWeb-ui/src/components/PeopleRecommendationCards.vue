<template>
  <section class="people-recommendation-section">
    <div class="section-header">
      <h2 class="section-title">今日推荐</h2>
      <p class="section-subtitle">探索成理名人的精彩人生</p>
    </div>
    
    <div class="cards-container">
      <div 
        v-for="(person, index) in displayPersons" 
        :key="person.id"
        class="person-card"
        :style="{ '--delay': index * 0.1 + 's' }"
        @click="openPersonSideSheet(person)"
        @mouseenter="handleCardHover(index)"
        @mouseleave="handleCardLeave(index)"
      >
        <div class="card-image-wrapper">
          <img :src="person.image" :alt="person.name" class="card-image" />
          <div class="card-overlay"></div>
          <div class="card-badge" :class="person.badgeClass">{{ person.badge }}</div>
        </div>
        <div class="card-content">
          <h3 class="card-name">{{ person.name }}</h3>
          <p class="card-title">{{ person.title }}</p>
          <div class="card-tags">
            <span v-for="tag in person.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 人物侧边栏 -->
    <transition name="slide-in">
      <div v-if="selectedPerson" class="person-side-sheet" @click.self="closeSideSheet">
        <div class="side-sheet-content">
          <button class="close-btn" @click="closeSideSheet">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="side-sheet-header">
            <img :src="selectedPerson.image" :alt="selectedPerson.name" class="sheet-avatar" />
            <div class="sheet-info">
              <h3 class="sheet-name">{{ selectedPerson.name }}</h3>
              <p class="sheet-title">{{ selectedPerson.title }}</p>
              <div class="sheet-badge" :class="selectedPerson.badgeClass">{{ selectedPerson.badge }}</div>
            </div>
          </div>
          
          <div class="side-sheet-body">
            <div class="sheet-section">
              <h4 class="section-label">简介</h4>
              <p class="section-text">{{ selectedPerson.brief || '暂无简介' }}</p>
            </div>
            
            <div class="sheet-actions">
              <button class="action-btn primary" @click="viewFullProfile">
                <i class="fas fa-external-link-alt"></i>
                查看完整资料
              </button>
              <button class="action-btn" @click="addToFavorites">
                <i class="fas fa-heart"></i>
                收藏
              </button>
              <button class="action-btn" @click="sharePerson">
                <i class="fas fa-share-alt"></i>
                分享
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import liubaojunImg from '@/assets/persons/liubaojun.png'
import zhangzhuoyuanImg from '@/assets/persons/zhangzhuoyuan.png'
import huangrunqiuImg from '@/assets/persons/huangrunqiu.png'
import wangchengshanImg from '@/assets/persons/wangchengshan.png'

export default {
  name: 'PeopleRecommendationCards',
  props: {
    persons: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedPerson: null,
      hoveredIndex: -1,
      defaultPersons: [
        {
          id: 'liubaojun',
          name: '刘宝珺',
          title: '中国科学院院士 · 沉积地质学家',
          image: liubaojunImg,
          badge: '院士',
          badgeClass: 'badge-president',
          tags: ['中国科学院院士', '沉积地质学', '名誉校长'],
          brief: '中国沉积地质学奠基人之一，长期从事沉积地质学、矿床学和石油地质学研究。'
        },
        {
          id: 'zhangzhuoyuan',
          name: '张倬元',
          title: '工程地质学家 · 成都理工大学奠基者',
          image: zhangzhuoyuanImg,
          badge: '奠基人',
          badgeClass: 'badge-founder',
          tags: ['工程地质学', '地质灾害', '奠基者'],
          brief: '中国著名工程地质学家，成都理工大学奠基者之一，为工程地质学发展做出重要贡献。'
        },
        {
          id: 'huangrunqiu',
          name: '黄润秋',
          title: '中国工程院院士 · 生态环境部部长',
          image: huangrunqiuImg,
          badge: '院士',
          badgeClass: 'badge-president',
          tags: ['中国工程院院士', '生态环境', '地质灾害'],
          brief: '中国工程院院士，地质灾害防治专家，现任生态环境部部长。'
        },
        {
          id: 'wangchengshan',
          name: '王成善',
          title: '中国科学院院士 · 沉积地质学家',
          image: wangchengshanImg,
          badge: '院士',
          badgeClass: 'badge-president',
          tags: ['中国科学院院士', '深时地质学', '古地理学'],
          brief: '深时地质学和古地理学专家，中国科学院院士，成都理工大学教授。'
        }
      ]
    }
  },
  computed: {
    displayPersons() {
      return this.persons.length > 0 ? this.persons.slice(0, 4) : this.defaultPersons.slice(0, 4)
    }
  },
  methods: {
    openPersonSideSheet(person) {
      this.selectedPerson = person
      document.body.style.overflow = 'hidden'
    },
    closeSideSheet() {
      this.selectedPerson = null
      document.body.style.overflow = ''
    },
    viewFullProfile() {
      if (this.selectedPerson) {
        this.closeSideSheet()
        this.$nextTick(() => {
          this.$router.push(`/person/${this.selectedPerson.id}`).catch(err => {
            // 忽略导航重复的错误
            if (err.name !== 'NavigationDuplicated') {
              console.error('路由跳转失败:', err)
            }
          })
        })
      }
    },
    addToFavorites() {
      this.$emit('favorite', this.selectedPerson)
      this.showToast('已添加到收藏', 'success')
    },
    sharePerson() {
      this.$emit('share', this.selectedPerson)
      this.showToast('分享功能开发中', 'info')
    },
    handleCardHover(index) {
      this.hoveredIndex = index
    },
    handleCardLeave(index) {
      this.hoveredIndex = -1
    },
    showToast(message, type) {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message
      Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        backgroundColor: type === 'success' ? '#2ecc71' : '#3498db',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
      })
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.transform = 'translateX(0)'
      }, 100)
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)'
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
          }
        }, 300)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.people-recommendation-section {
  padding: 80px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.5rem;
  color: white;
  margin: 0 0 15px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.person-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.6s ease-out backwards;
  animation-delay: var(--delay, 0s);
}

.person-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.person-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
}

.card-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 25px;
}

.card-name {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.card-title {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 侧边栏样式 */
.person-side-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.3s ease;
}

.side-sheet-content {
  width: 480px;
  max-width: 90vw;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 32px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  animation: slideInRight 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #2c3e50;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

.side-sheet-header {
  padding: 40px 30px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sheet-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.sheet-info {
  flex: 1;
}

.sheet-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.sheet-title {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 12px 0;
}

.sheet-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.side-sheet-body {
  padding: 30px;
}

.sheet-section {
  margin-bottom: 30px;
}

.section-label {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.section-text {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.sheet-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity 0.3s;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .people-recommendation-section {
    padding: 40px 20px;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .side-sheet-content {
    width: 100%;
  }
}
</style>

