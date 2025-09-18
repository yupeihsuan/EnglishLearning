import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/views/homePage.vue'
import ExamPage from '@/views/ExamPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: '首頁' },
  },
  {
    path: '/exam/:id',
    name: 'Exam',
    component: ExamPage,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 動態更新標題
router.beforeEach((to, from, next) => {
  if (to.name === 'Exam') {
    // 根據 examId 設定標題
    const examTitles = {
      1: '第一次模擬考',
      2: '第二次模擬考',
      3: '第三次模擬考',
      4: '第四次模擬考',
      5: '總複習',
    }
    const examId = to.params.id
    document.title = `${examTitles[examId]}`
  } else {
    document.title = to.meta.title || 'English Practice'
  }
  next()
})

export default router
