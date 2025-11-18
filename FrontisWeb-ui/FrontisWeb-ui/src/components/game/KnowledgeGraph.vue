<template>
  <div class="knowledge-graph">
    <h2 class="graph-title">🧠 知识图谱收集册</h2>
    
    <!-- 进度统计 -->
    <div class="knowledge-stats">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-content">
          <div class="stat-value">{{ collectedKnowledge.length }}/{{ totalKnowledge }}</div>
          <div class="stat-label">已收集</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ completionPercent }}%</div>
          <div class="stat-label">完成度</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-value">{{ categoryCount }}</div>
          <div class="stat-label">分类数</div>
        </div>
      </div>
    </div>
    
    <!-- 分类标签 -->
    <div class="category-tabs">
      <button 
        v-for="category in categories" 
        :key="category.id"
        :class="['category-tab', { active: activeCategory === category.id }]"
        @click="activeCategory = category.id"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-name">{{ category.name }}</span>
        <span class="tab-progress">{{ getCategoryProgress(category.id) }}</span>
      </button>
    </div>
    
    <!-- 知识卡片网格 -->
    <div class="knowledge-grid">
      <div 
        v-for="item in filteredKnowledge" 
        :key="item.id"
        class="knowledge-card"
        :class="{ 
          collected: isCollected(item.id),
          locked: !isCollected(item.id)
        }"
        @click="viewKnowledgeItem(item)"
      >
        <div class="card-header">
          <span class="card-icon">{{ item.icon }}</span>
          <span v-if="isCollected(item.id)" class="collected-badge">✅</span>
          <span v-else class="locked-badge">🔒</span>
        </div>
        
        <h4 class="card-title">{{ isCollected(item.id) ? item.title : '???' }}</h4>
        <p class="card-description">
          {{ isCollected(item.id) ? item.shortDesc : '收集黄色琥珀解锁' }}
        </p>
        
        <div v-if="isCollected(item.id)" class="card-footer">
          <span class="card-category">{{ item.categoryName }}</span>
          <span v-if="item.year" class="card-year">{{ item.year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'KnowledgeGraph',
  
  props: {
    collectedKnowledge: {
      type: Array,
      default: () => []
    },
    totalKnowledge: {
      type: Number,
      default: 156
    }
  },
  
  emits: ['view'],
  
  setup(props, { emit }) {
    const activeCategory = ref('all');
    
    const categories = [
      { id: 'all', name: '全部', icon: '📖', total: 156 },
      { id: 'history', name: '创校时期', icon: '🏛️', total: 12 },
      { id: 'development', name: '学科发展', icon: '📚', total: 25 },
      { id: 'alumni', name: '知名校友', icon: '🎓', total: 18 },
      { id: 'campus', name: '校园变迁', icon: '🏫', total: 30 },
      { id: 'research', name: '科研成果', icon: '🔬', total: 71 }
    ];
    
    // 模拟知识数据
    const knowledgeItems = computed(() => {
      return [
        {
          id: 'CDUT:EVENT:00001',
          title: '成都理工大学创建',
          shortDesc: '1956年,成都地质勘探学院成立',
          icon: '🎉',
          categoryId: 'history',
          categoryName: '创校时期',
          year: '1956'
        },
        {
          id: 'CDUT:PERSON:00001',
          title: '刘宝珺院士',
          shortDesc: '中国科学院院士,沉积地质学家',
          icon: '👨‍🔬',
          categoryId: 'alumni',
          categoryName: '知名校友',
          year: null
        },
        {
          id: 'CDUT:PERSON:00029',
          title: '张倬元教授',
          shortDesc: '中国著名工程地质学家',
          icon: '👨‍🏫',
          categoryId: 'alumni',
          categoryName: '知名校友',
          year: null
        },
        {
          id: 'CDUT:EVENT:00009',
          title: '入选双一流',
          shortDesc: '2017年入选国家双一流建设高校',
          icon: '🏆',
          categoryId: 'development',
          categoryName: '学科发展',
          year: '2017'
        },
        {
          id: 'CDUT:ORG:00027',
          title: '图书馆',
          shortDesc: '学校的知识宝库',
          icon: '📚',
          categoryId: 'campus',
          categoryName: '校园变迁',
          year: null
        },
        {
          id: 'CDUT:PLACE:00028',
          title: '砚湖',
          shortDesc: '校园内的美丽湖泊',
          icon: '🌊',
          categoryId: 'campus',
          categoryName: '校园变迁',
          year: null
        }
      ];
    });
    
    const filteredKnowledge = computed(() => {
      if (activeCategory.value === 'all') {
        return knowledgeItems.value;
      }
      return knowledgeItems.value.filter(item => item.categoryId === activeCategory.value);
    });
    
    const completionPercent = computed(() => {
      return Math.round((props.collectedKnowledge.length / props.totalKnowledge) * 100);
    });
    
    const categoryCount = computed(() => {
      return categories.length - 1; // 排除"全部"
    });
    
    const isCollected = (id) => {
      return props.collectedKnowledge.includes(id);
    };
    
    const getCategoryProgress = (categoryId) => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return '0/0';
      
      if (categoryId === 'all') {
        return `${props.collectedKnowledge.length}/${props.totalKnowledge}`;
      }
      
      const categoryItems = knowledgeItems.value.filter(item => item.categoryId === categoryId);
      const collected = categoryItems.filter(item => isCollected(item.id)).length;
      return `${collected}/${category.total}`;
    };
    
    const viewKnowledgeItem = (item) => {
      if (isCollected(item.id)) {
        emit('view', item.id);
      }
    };
    
    return {
      activeCategory,
      categories,
      filteredKnowledge,
      completionPercent,
      categoryCount,
      isCollected,
      getCategoryProgress,
      viewKnowledgeItem
    };
  }
};
</script>

<style scoped>
.knowledge-graph {
  padding: 20px;
}

.graph-title {
  margin: 0 0 25px;
  font-size: 28px;
  color: #2d3748;
  text-align: center;
}

.knowledge-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 36px;
  background: rgba(255, 255, 255, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.category-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.category-tab {
  flex-shrink: 0;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.category-tab:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.category-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 18px;
}

.tab-progress {
  font-size: 12px;
  opacity: 0.8;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.knowledge-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.knowledge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.knowledge-card.collected {
  border-color: #48bb78;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.05) 0%, rgba(56, 161, 105, 0.05) 100%);
}

.knowledge-card.locked {
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-icon {
  font-size: 36px;
}

.collected-badge {
  font-size: 20px;
}

.locked-badge {
  font-size: 20px;
  opacity: 0.5;
}

.card-title {
  margin: 0 0 10px;
  font-size: 18px;
  color: #2d3748;
}

.card-description {
  margin: 0 0 15px;
  color: #4a5568;
  font-size: 14px;
  line-height: 1.5;
  min-height: 42px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.card-category {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.card-year {
  font-size: 12px;
  background: #f7fafc;
  color: #4a5568;
  padding: 4px 10px;
  border-radius: 10px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
}
</style>



