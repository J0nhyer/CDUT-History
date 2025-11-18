<template>
  <div class="quick-access-pills">
    <div 
      v-for="(item, index) in accessItems" 
      :key="item.id"
      class="access-pill"
      :style="{ '--delay': index * 0.1 + 's' }"
      @click="handleClick(item)"
      @mouseenter="handleHover(index)"
      @mouseleave="handleLeave(index)"
    >
      <div class="pill-icon">
        <i :class="item.icon"></i>
      </div>
      <div class="pill-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickAccessPills',
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hoveredIndex: -1,
      defaultItems: [
        {
          id: 'people',
          label: '人物',
          icon: 'fas fa-user-circle',
          route: '/persons',
          color: '#3498db'
        },
        {
          id: 'timeline',
          label: '时间线',
          icon: 'fas fa-history',
          route: '/digital-history',
          color: '#e74c3c'
        },
        {
          id: 'graph',
          label: '知识图谱',
          icon: 'fas fa-project-diagram',
          route: '/history-graph',
          color: '#9b59b6'
        },
        {
          id: 'map',
          label: '校园地图',
          icon: 'fas fa-map-marked-alt',
          route: '/universe',
          color: '#2ecc71'
        }
      ]
    }
  },
  computed: {
    accessItems() {
      return this.items.length > 0 ? this.items : this.defaultItems
    }
  },
  methods: {
    handleClick(item) {
      // 先触发事件，然后跳转
      this.$emit('click', item)
      
      // 延迟跳转，确保事件先触发
      if (item.route) {
        this.$nextTick(() => {
          this.$router.push(item.route).catch(err => {
            // 忽略导航重复的错误
            if (err.name !== 'NavigationDuplicated') {
              console.error('路由跳转失败:', err)
            }
          })
        })
      } else if (item.action) {
        item.action()
      }
    },
    handleHover(index) {
      this.hoveredIndex = index
    },
    handleLeave(index) {
      this.hoveredIndex = -1
    }
  }
}
</script>

<style scoped>
.quick-access-pills {
  position: fixed;
  bottom: 120px;
  right: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 100;
  animation: fadeInUp 0.6s ease-out backwards;
}

.access-pill {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  animation: fadeInUp 0.6s ease-out backwards;
  animation-delay: var(--delay, 0s);
}

.access-pill:hover {
  transform: scale(1.15) translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
}

.pill-icon {
  font-size: 24px;
  color: #4a90e2;
  margin-bottom: 4px;
  transition: transform 0.3s ease;
}

.access-pill:hover .pill-icon {
  transform: scale(1.1);
  color: #2970c4;
}

.pill-label {
  font-size: 11px;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  white-space: nowrap;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .quick-access-pills {
    bottom: 100px;
    right: 20px;
    gap: 15px;
  }
  
  .access-pill {
    width: 60px;
    height: 60px;
  }
  
  .pill-icon {
    font-size: 20px;
  }
  
  .pill-label {
    font-size: 10px;
  }
}
</style>

