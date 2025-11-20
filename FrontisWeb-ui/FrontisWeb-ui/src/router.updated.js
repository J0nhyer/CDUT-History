/**
 * 更新后的路由配置
 * 请将此文件内容替换到 src/router.js
 */

import { createRouter, createWebHistory } from 'vue-router'
import PersonList from './PersonList.vue'
import PersonsPage from './PersonsPage.vue'
import UniversityHistory from './UniversityHistory.vue'
import AcademicUniverse from './AcademicUniverse.vue'
import DinoExplorer from './DinoExplorer.vue'
import UniversityHistoryGraph from './UniversityHistoryGraph.vue'
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
  {
    path: '/person/:id',
    name: 'PersonDetail',
    component: PersonDetailAdvancedPage,
    meta: {
      title: '人物详情',
      description: '成都理工大学人物专题页'
    }
  },
  // 旧路径重定向
  {
    path: '/zhangzhuoyuan',
    redirect: '/person/zhangzhuoyuan'
  },
  {
    path: '/liubaojun',
    redirect: '/person/liubaojun'
  },
  {
    path: '/person/huangrunqiu',
    redirect: '/person/huangrunqiu'
  },
  {
    path: '/person/wangchengshan',
    redirect: '/person/wangchengshan'
  },
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

