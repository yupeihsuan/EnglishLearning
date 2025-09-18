<script setup>
const exams = [
  { id: 1, title: '第一次模擬考' },
  { id: 2, title: '第二次模擬考' },
  { id: 3, title: '第三次模擬考' },
  { id: 4, title: '第四次模擬考' },
  { id: 5, title: '總複習' },
]
</script>

<template>
  <div class="container">
    <h1 class="title">English Practice</h1>
    <p class="subtitle">Choose a test to begin</p>

    <div class="exam-list">
      <router-link v-for="exam in exams" :key="exam.id" :to="`/exam/${exam.id}`" class="exam-btn">
        <p>{{ exam.title }}</p>
      </router-link>
    </div>
  </div>

  <footer class="footer">
    <p>Copyright 2025 © Pei-Hsuan Yu. All Rights Reserved.</p>
  </footer>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0px auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #6b7a65;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #777;
}

.exam-list {
  display: grid;
  gap: 15px;
}

.exam-btn {
  display: block;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  background-color: #a8bba3;
  color: #333;
  border-radius: 8px;
  transition: 0.3s;
  opacity: 0.8;
}

.exam-btn p {
  color: #fff;
}

.exam-btn:hover {
  background-color: #95a68f;
  opacity: 1;
}

.footer {
  margin-top: 20px;
  padding: 20px 0;
  background-color: #f5f5f5;
  color: #777;
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 響應式設計 */
@media (max-width: 1180px) {
  .container {
    margin: 90px auto;
  }
}
</style>
