<template>
  <section class="history-search-section">
    <div class="search-container">
      <div class="search-header">
        <h2 class="search-title">快速搜索</h2>
        <p class="search-subtitle">搜索人物、事件、年代、地点</p>
      </div>
      
      <div class="search-box-wrapper">
        <div class="search-box" :class="{ focused: isFocused, 'has-results': filteredSuggestions.length > 0 }">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            @focus="isFocused = true"
            @blur="handleBlur"
            @input="handleInput"
            @keydown.enter="performSearch"
            @keydown.down="navigateSuggestions('down')"
            @keydown.up="navigateSuggestions('up')"
            placeholder="输入关键词搜索..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 搜索建议下拉框 -->
        <transition name="fade">
          <div v-if="isFocused && filteredSuggestions.length > 0" class="suggestions-dropdown">
            <div
              v-for="(suggestion, index) in filteredSuggestions"
              :key="index"
              class="suggestion-item"
              :class="{ active: index === selectedSuggestionIndex }"
              @click="selectSuggestion(suggestion)"
              @mouseenter="selectedSuggestionIndex = index"
            >
              <i :class="getSuggestionIcon(suggestion.type)"></i>
              <div class="suggestion-content">
                <div class="suggestion-title">{{ suggestion.title }}</div>
                <div class="suggestion-meta">{{ suggestion.meta }}</div>
              </div>
              <div class="suggestion-type">{{ suggestion.type }}</div>
            </div>
          </div>
        </transition>
      </div>
      
      <!-- 筛选标签 -->
      <div class="filter-chips">
        <div
          v-for="chip in filterChips"
          :key="chip.id"
          class="filter-chip"
          :class="{ active: chip.active }"
          @click="toggleFilter(chip)"
        >
          <i :class="chip.icon"></i>
          <span>{{ chip.label }}</span>
          <i v-if="chip.active" class="fas fa-times chip-close"></i>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HistorySearchBar',
  data() {
    return {
      searchQuery: '',
      isFocused: false,
      selectedSuggestionIndex: -1,
      filterChips: [
        { id: 'person', label: '人物', icon: 'fas fa-user', active: false },
        { id: 'event', label: '事件', icon: 'fas fa-calendar', active: false },
        { id: 'year', label: '年代', icon: 'fas fa-clock', active: false },
        { id: 'place', label: '地点', icon: 'fas fa-map-marker-alt', active: false }
      ],
      allSuggestions: [
        { title: '刘宝珺', meta: '中国科学院院士 · 沉积地质学家', type: '人物', id: 'liubaojun' },
        { title: '张倬元', meta: '工程地质学家 · 成都理工大学奠基者', type: '人物', id: 'zhangzhuoyuan' },
        { title: '黄润秋', meta: '中国工程院院士 · 生态环境部部长', type: '人物', id: 'huangrunqiu' },
        { title: '1956年建校', meta: '成都地质勘探学院成立', type: '事件', id: 'event-1956' },
        { title: '2001年更名', meta: '正式更名为成都理工大学', type: '事件', id: 'event-2001' },
        { title: '2017年双一流', meta: '地球科学进入世界一流学科建设', type: '事件', id: 'event-2017' },
        { title: '1956年', meta: '建校年份', type: '年代', id: 'year-1956' },
        { title: '1960年代', meta: '发展时期', type: '年代', id: 'year-1960' },
        { title: '成都理工大学', meta: '主校区', type: '地点', id: 'place-cdut' }
      ]
    }
  },
  computed: {
    filteredSuggestions() {
      if (!this.searchQuery.trim()) {
        return []
      }
      
      const query = this.searchQuery.toLowerCase()
      const activeFilters = this.filterChips.filter(c => c.active).map(c => c.id)
      
      return this.allSuggestions
        .filter(s => {
          const matchesQuery = s.title.toLowerCase().includes(query) || 
                              s.meta.toLowerCase().includes(query)
          const matchesFilter = activeFilters.length === 0 || 
                               (activeFilters.includes('person') && s.type === '人物') ||
                               (activeFilters.includes('event') && s.type === '事件') ||
                               (activeFilters.includes('year') && s.type === '年代') ||
                               (activeFilters.includes('place') && s.type === '地点')
          return matchesQuery && matchesFilter
        })
        .slice(0, 6)
    }
  },
  methods: {
    handleInput() {
      this.selectedSuggestionIndex = -1
    },
    handleBlur() {
      // 延迟隐藏，以便点击建议项能生效
      setTimeout(() => {
        this.isFocused = false
      }, 200)
    },
    clearSearch() {
      this.searchQuery = ''
      this.selectedSuggestionIndex = -1
    },
    toggleFilter(chip) {
      chip.active = !chip.active
    },
    navigateSuggestions(direction) {
      if (this.filteredSuggestions.length === 0) return
      
      if (direction === 'down') {
        this.selectedSuggestionIndex = 
          (this.selectedSuggestionIndex + 1) % this.filteredSuggestions.length
      } else {
        this.selectedSuggestionIndex = 
          this.selectedSuggestionIndex <= 0 
            ? this.filteredSuggestions.length - 1 
            : this.selectedSuggestionIndex - 1
      }
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion.title
      this.performSearch()
      this.isFocused = false
    },
    performSearch() {
      if (this.selectedSuggestionIndex >= 0 && this.filteredSuggestions[this.selectedSuggestionIndex]) {
        const suggestion = this.filteredSuggestions[this.selectedSuggestionIndex]
        this.navigateToResult(suggestion)
      } else if (this.searchQuery.trim()) {
        // 执行搜索
        this.$emit('search', this.searchQuery)
        this.$nextTick(() => {
          this.$router.push({
            path: '/persons',
            query: { q: this.searchQuery }
          }).catch(err => {
            // 忽略导航重复的错误
            if (err.name !== 'NavigationDuplicated') {
              console.error('路由跳转失败:', err)
            }
          })
        })
      }
    },
    navigateToResult(suggestion) {
      if (suggestion.type === '人物') {
        this.$router.push(`/person/${suggestion.id}`).catch(err => {
          // 忽略导航重复的错误
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      } else if (suggestion.type === '事件') {
        this.$router.push({
          path: '/digital-history',
          query: { event: suggestion.id }
        }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      } else {
        this.$router.push({
          path: '/persons',
          query: { q: suggestion.title }
        }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err)
          }
        })
      }
    },
    getSuggestionIcon(type) {
      const icons = {
        '人物': 'fas fa-user',
        '事件': 'fas fa-calendar',
        '年代': 'fas fa-clock',
        '地点': 'fas fa-map-marker-alt'
      }
      return icons[type] || 'fas fa-search'
    }
  }
}
</script>

<style scoped>
.history-search-section {
  padding: 60px 80px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 1;
}

.search-container {
  max-width: 1000px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-title {
  font-size: 2rem;
  color: white;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.search-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.search-box-wrapper {
  position: relative;
  margin-bottom: 30px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  padding: 0 25px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.search-box.focused {
  border-color: #667eea;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  font-size: 20px;
  color: #667eea;
  margin-right: 15px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 18px 0;
  background: transparent;
  color: #2c3e50;
}

.search-input::placeholder {
  color: #95a5a6;
}

.clear-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 10px;
}

.clear-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: rotate(90deg);
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: rgba(102, 126, 234, 0.1);
}

.suggestion-item i {
  font-size: 18px;
  color: #667eea;
  margin-right: 15px;
  width: 24px;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.suggestion-meta {
  font-size: 12px;
  color: #7f8c8d;
}

.suggestion-type {
  font-size: 11px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  margin-left: 15px;
}

.filter-chips {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.filter-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.chip-close {
  margin-left: 4px;
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .history-search-section {
    padding: 40px 20px;
  }
  
  .search-box {
    padding: 0 20px;
  }
  
  .search-input {
    font-size: 14px;
    padding: 15px 0;
  }
  
  .filter-chips {
    gap: 8px;
  }
  
  .filter-chip {
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>

