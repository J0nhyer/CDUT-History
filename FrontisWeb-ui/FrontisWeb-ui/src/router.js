import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './MainPage.vue'
import PersonsPage from './PersonsPage.vue'
import PersonDetailAdvancedPage from './views/PersonDetailAdvancedPage.vue'
// 旧的人物详情组件已不再使用，改为重定向到新的统一路由
// 如需删除旧组件，可以移除以下导入（但先确保路由重定向正常工作）
// import ZhangZhuoYuanDetail from './ZhangZhuoYuanDetail.vue'
// import LiuBaoJunDetail from './LiuBaoJunDetail.vue'
// import HuangRunQiuDetail from './HuangRunQiuDetail.vue'
// import WangChengShanDetail from './WangChengShanDetail.vue'
// import DuoJiDetail from './DuoJiDetail.vue'
// import ChenYunTaiDetail from './ChenYunTaiDetail.vue'
// import LiChengSanDetail from './LiChengSanDetail.vue'
// import ZengYunFuDetail from './ZengYunFuDetail.vue'
// import WuZongYueDetail from './WuZongYueDetail.vue'
import UniversityHistory from './UniversityHistory.vue'
import UniversityHistoryTimeline from './UniversityHistoryTimeline.vue'
import CdutDigitalHistory from './CdutDigitalHistory.vue'
import AcademicUniverse from './AcademicUniverse2.vue'
import DinoExplorer from './DinoExplorer.vue'
import UniversityHistoryGraph from './UniversityHistoryGraph.vue'
import StarMapKnowledgeGraph from './StarMapKnowledgeGraph.vue'
import DinoGameMain from './DinoGameMain.vue'
import DinoCampus3D from './DinoCampus3D.vue'

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
  // ==========================================
  // 旧路径重定向到新的统一路由（使用高级版组件）
  // ==========================================
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
    path: '/university-history',
    name: 'UniversityHistory',
    component: UniversityHistory
  },
  {
    path: '/history-timeline',
    name: 'UniversityHistoryTimeline',
    component: UniversityHistoryTimeline
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
    path: '/history-graph-old',
    name: 'UniversityHistoryGraphOld',
    component: UniversityHistoryGraph
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
