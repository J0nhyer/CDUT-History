import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './MainPage.vue'
import PersonsPage from './PersonsPage.vue'
import PersonDetailAdvancedPage from './views/PersonDetailAdvancedPage.vue'
import CdutDigitalHistory from './CdutDigitalHistory.vue'
import AcademicUniverse from './AcademicUniverse2.vue'
import DinoExplorer from './DinoExplorer.vue'
import StarMapKnowledgeGraph from './StarMapKnowledgeGraph.vue'
import DinoGameMain from './DinoGameMain.vue'
import DinoCampus3D from './DinoCampus3D.vue'
import KeywordRain from './KeywordRain.vue'
import DrawReveal from './DrawReveal.vue'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
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
    props: true
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
    path: '/huangrunqiu',
    redirect: '/person/huangrunqiu'
  },
  {
    path: '/wangchengshan',
    redirect: '/person/wangchengshan'
  },
  {
    path: '/duoji',
    redirect: '/person/duoji'
  },
  {
    path: '/chenyuntai',
    redirect: '/person/chenyuntai'
  },
  {
    path: '/lichengsan',
    redirect: '/person/lichengsan'
  },
  {
    path: '/zengyunfu',
    redirect: '/person/zengyunfu'
  },
  {
    path: '/wuzongyue',
    redirect: '/person/wuzongyue'
  },
  {
    path: '/digital-history',
    name: 'CdutDigitalHistory',
    component: CdutDigitalHistory
  },
  {
    path: '/event/:year',
    name: 'EventDetail',
    component: () => import('./components/EventDetail.vue'),
    props: true
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
    component: () => import('./KnowledgeGraphPage.vue')
  },
  {
    path: '/star-map',
    name: 'StarMapKnowledgeGraph',
    component: StarMapKnowledgeGraph
  },
  {
    path: '/kg-advanced',
    name: 'KnowledgeGraphAdvanced',
    redirect: '/history-graph'
  },
  {
    path: '/dino-game',
    name: 'DinoGame',
    component: DinoGameMain
  },
  {
    path: '/dino-campus-3d',
    name: 'DinoCampus3D',
    component: DinoCampus3D
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfilePage.vue')
  },
  {
    path: '/keyword-rain',
    name: 'KeywordRain',
    component: KeywordRain
  },
  {
    path: '/draw-reveal',
    name: 'DrawReveal',
    component: DrawReveal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
