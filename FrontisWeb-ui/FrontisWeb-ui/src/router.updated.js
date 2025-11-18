/**
 * 更新后的路由配置 - 使用高级版人物详情组件
 * 请将此文件内容替换到 src/router.js
 */

import { createRouter, createWebHistory } from 'vue-router'
import PersonList from './PersonList.vue'
import PersonsPage from './PersonsPage.vue'
import UniversityHistory from './UniversityHistory.vue'
import AcademicUniverse from './AcademicUniverse.vue'
import DinoExplorer from './DinoExplorer.vue'
import UniversityHistoryGraph from './UniversityHistoryGraph.vue'

// ⭐ 使用新的高级版本组件
import PersonDetailAdvancedPage from './views/PersonDetailAdvancedPage.vue'

const routes = [
  {
    path: '/',
    name: 'PersonList',
    component: PersonList
  },
  {
    path: '/persons',
    name: 'PersonsPage',
    component: PersonsPage
  },
  
  // ==========================================
  // ⭐ 新的高级版人物详情路由（推荐使用）
  // ==========================================
  {
    path: '/person/:id',
    name: 'PersonDetail',
    component: PersonDetailAdvancedPage,
    meta: {
      title: '人物详情',
      description: '成都理工大学人物专题页 - 高级交互版本'
    }
  },
  
  // 如果想保留旧路径作为重定向
  {
    path: '/zhangzhuoyuan',
    redirect: '/person/zhangzhuoyuan'
  },
  {
    path: '/liubaojun',
    redirect: '/person/liubaojun'
  },
  
  // 其他人物路由（都使用新的高级版本）
  {
    path: '/person/huangrunqiu',
    redirect: '/person/huangrunqiu'
  },
  {
    path: '/person/wangchengshan',
    redirect: '/person/wangchengshan'
  },
  
  // ==========================================
  // 其他页面路由
  // ==========================================
  {
    path: '/university-history',
    name: 'UniversityHistory',
    component: UniversityHistory
  },
  {
    path: '/universe',
    name: 'AcademicUniverse',
    component: AcademicUniverse
  },
  {
    path: '/explore',
    name: 'DinoExplorer',
    component: DinoExplorer
  },
  {
    path: '/history-graph',
    name: 'UniversityHistoryGraph',
    component: UniversityHistoryGraph
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

