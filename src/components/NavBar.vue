<script setup>
import { useRouter } from 'vue-router'
import logo from '@/assets/logo.png'
const router = useRouter()

// 假設有不同考試頁面
const exams = [
  { id: 1, title: '第一次模擬考' },
  { id: 2, title: '第二次模擬考' },
  { id: 3, title: '第三次模擬考' },
  { id: 4, title: '第四次模擬考' },
  { id: 5, title: '總複習' },
]

function goHome() {
  router.push('/')
}

function goExam(id) {
  router.push(`/exam/${id}`)
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left" @click="goHome">
      <img :src="logo" alt="Logo" class="logo-icon" />
      <span class="logo-text">QuizMaster</span>
    </div>

    <div class="navbar-right">
      <button v-for="exam in exams" :key="exam.id" class="exam-btn" @click="goExam(exam.id)">
        {{ exam.title }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* === Navbar === */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #a8bba3; /* 主色 */
  padding: 12px 24px;
  color: #fff;
  border-radius: 0 0 10px 10px;
  margin-bottom: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  font-family: 'Microsoft JhengHei', sans-serif;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 8px; /* 圖片與文字間距 */
  cursor: pointer;
}

.logo-icon {
  width: 32px; /* 可調整大小 */
  height: 32px;
}

.logo-text {
  font-weight: bold;
  font-size: 1.4em;
  color: #fff;
}

.navbar-right button {
  background-color: #c8d5c3; /* 柔和米綠 */
  color: #4e5c4b;
  border: none;
  margin-left: 12px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.navbar-right button:hover {
  background-color: #95a68f;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
