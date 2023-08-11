import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '@/views/ScreenPage.vue'
import SellerPage from '@/views/SellerPage.vue'
// import TrendPage from '@/views/TrendPage.vue'
// import MapPage from '@/views/MapPage.vue'
// import RankPage from '@/views/RankPage.vue'
// import HotPage from '@/views/HotPage.vue'
// import StockPage from '@/views/StockPage.vue'
// import TestPage from '@/views/TestPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  }, {
    path: '/screen',
    component: ScreenPage
  },
  {
    path: '/sellerPage',
    component: SellerPage
  },
  // {
  //   path: '/TrendPage',
  //   component: TrendPage
  // },
  // {
  //   path: '/MapPage',
  //   component: MapPage
  // },
  // {
  //   path: '/RankPage',
  //   component: RankPage
  // },
  // {
  //   path: '/HotPage',
  //   component: HotPage
  // },
  // {
  //   path: '/StockPage',
  //   component: StockPage
  // }
  // {
  //   path: '/TestPage',
  //   component: TestPage
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
