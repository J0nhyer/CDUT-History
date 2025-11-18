/**
 * 路由配置示例
 * 展示如何使用新的通用人物详情组件
 */

import { createRouter, createWebHistory } from 'vue-router'
import PersonList from './PersonList.vue'
import PersonsPage from './PersonsPage.vue'
import PersonDetailPage from './views/PersonDetailPage.vue'
import UniversityHistory from './UniversityHistory.vue'
import AcademicUniverse from './AcademicUniverse.vue'
import DinoExplorer from './DinoExplorer.vue'
import UniversityHistoryGraph from './UniversityHistoryGraph.vue'

// 如果想保留旧的组件作为备份
// import ZhangZhuoYuanDetail from './ZhangZhuoYuanDetail.vue'
// import LiuBaoJunDetail from './LiuBaoJunDetail.vue'

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
  // 新方式：使用通用人物详情组件（推荐）
  // ==========================================
  {
    path: '/person/:id',
    name: 'PersonDetail',
    component: PersonDetailPage,
    meta: {
      title: '人物详情'
    }
  },

  // ==========================================
  // 旧路由重定向到新路由（保持向后兼容）
  // ==========================================
  {
    path: '/zhangzhuoyuan',
    redirect: '/person/zhangzhuoyuan'
  },
  {
    path: '/liubaojun',
    redirect: '/person/liubaojun'
  },

  // ==========================================
  // 或者保留旧路由（如果还需要使用旧组件）
  // ==========================================
  // {
  //   path: '/zhangzhuoyuan',
  //   name: 'ZhangZhuoYuan',
  //   component: ZhangZhuoYuanDetail
  // },
  // {
  //   path: '/liubaojun',
  //   name: 'LiuBaoJun',
  //   component: LiuBaoJunDetail
  // },

  // ==========================================
  // 其他路由
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

