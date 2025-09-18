<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const quiz = ref([])
const userAnswers = ref([])
const submitted = ref(false)
const currentIndex = ref(0)
const timer = ref(20 * 60) // 20 分鐘倒數
let intervalId = null

const examFiles = {
  1: './exam1.json',
  2: './exam2.json',
  3: './exam3.json',
  4: './exam4.json',
  5: './review.json',
}

const examTitles = {
  1: '第一次模擬考',
  2: '第二次模擬考',
  3: '第三次模擬考',
  4: '第四次模擬考',
  5: '總複習',
}

const examTitle = ref('')

async function loadExam() {
  const examId = route.params.id
  examTitle.value = examTitles[examId] || '未知的考試'

  const file = examFiles[examId] || null
  if (!file) {
    quiz.value = []
    return
  }

  const res = await fetch(file)
  const allQuestions = await res.json()
  const shuffled = allQuestions.sort(() => 0.5 - Math.random())
  quiz.value = shuffled.slice(0, 20)

  userAnswers.value = Array(quiz.value.length).fill(null)
  submitted.value = false
  currentIndex.value = 0

  timer.value = 20 * 60
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(intervalId)
      submitQuiz()
    }
  }, 1000)
}

onMounted(loadExam)
watch(() => route.params.id, loadExam)

const score = computed(() => {
  if (!submitted.value) return 0
  return quiz.value.reduce((total, q, idx) => {
    return total + (Number(q.answer) === userAnswers.value[idx] ? 5 : 0)
  }, 0)
})

function getOptions(q) {
  return [q.option1, q.option2, q.option3, q.option4]
}

function nextQuestion() {
  if (currentIndex.value < quiz.value.length - 1) currentIndex.value++
}

function prevQuestion() {
  if (currentIndex.value > 0) currentIndex.value--
}

function jumpToQuestion(idx) {
  currentIndex.value = idx
}

function submitQuiz() {
  submitted.value = true
  clearInterval(intervalId)
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="quiz-container">
    <h1>{{ examTitle }}</h1>

    <div v-if="quiz.length === 0">
      <p>找不到此考試的題庫</p>
    </div>

    <div v-else>
      <!-- 計時器 -->
      <div v-if="!submitted" class="timer">剩餘時間: {{ formatTime(timer) }}</div>

      <!-- 題號清單 -->
      <div v-if="!submitted" class="question-nav">
        <button
          v-for="(q, idx) in quiz"
          :key="idx"
          @click="jumpToQuestion(idx)"
          :class="{ answered: userAnswers[idx] !== null, current: currentIndex === idx }"
        >
          {{ idx + 1 }}
        </button>
      </div>

      <!-- 單題作答 -->
      <div v-if="!submitted" class="question-block">
        <p>{{ currentIndex + 1 }}. {{ quiz[currentIndex].question }}</p>
        <ul>
          <li v-for="(opt, i) in getOptions(quiz[currentIndex])" :key="i">
            <label>
              <span class="option-label">{{ String.fromCharCode(65 + i) }}.</span>
              <input
                type="radio"
                :name="'q' + currentIndex"
                :value="i"
                v-model="userAnswers[currentIndex]"
              />
              {{ opt }}
            </label>
          </li>
        </ul>

        <div class="actions">
          <button @click="prevQuestion" :disabled="currentIndex === 0">上一題</button>
          <button @click="nextQuestion" :disabled="currentIndex === quiz.length - 1">下一題</button>
          <button v-if="currentIndex === quiz.length - 1" @click="submitQuiz">交卷</button>
        </div>
      </div>

      <!-- 交卷後全部題目 -->
      <div v-else>
        <div class="result">成績: {{ score }} 分 ({{ score / 5 }}/{{ quiz.length }} 題)</div>
        <div v-for="(q, idx) in quiz" :key="idx" class="question-block">
          <p>{{ idx + 1 }}. {{ q.question }}</p>
          <ul>
            <li v-for="(opt, i) in getOptions(q)" :key="i">
              <span class="option-label">{{ String.fromCharCode(65 + i) }}.</span>
              {{ opt }}
              <span v-if="i === Number(q.answer)" class="correct"> ✅ 正確答案</span>
              <span v-else-if="userAnswers[idx] === i" class="incorrect"> ❌</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #fcfbf8; /* 淺米色背景，更清爽 */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  font-family: 'Microsoft JhengHei', sans-serif;
}

h1 {
  color: #877970;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  font-weight: bold;
}

.timer,
.result {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 15px;
  color: #c98d7f;
  text-align: center;
  padding: 10px;
  background: #fdfaf6; /* 淺米色，和容器接近 */
  border-radius: 8px;
  border: 1px solid #e6e1d7;
}

.question-nav {
  margin-bottom: 20px;
  text-align: center;
}

.question-nav button {
  margin: 3px;
  padding: 8px 12px;
  border: 1px solid #ded3c4;
  border-radius: 6px;
  cursor: pointer;
  background: #f9f7f1; /* 淺米色按鈕 */
  color: #8b6655;
  font-weight: 500;
  transition: all 0.3s ease;
}

.question-nav button:hover {
  background: #ece9df; /* hover 輕微加深 */
  transform: translateY(-1px);
}

.question-nav button.answered {
  background-color: #d8d5cb;
  border-color: #e3d3cc;
  color: #544343;
}

.question-nav button.current {
  font-weight: bold;
  border-color: #a8bba3;
  background: #a8bba3;
  color: white;
  box-shadow: 0 2px 6px rgba(168, 187, 163, 0.3);
}

.question-block {
  margin-bottom: 25px;
  padding: 20px;
  background: #fdfbf6; /* 更淺米色區塊 */
  border-radius: 10px;
  border: 1px solid #e6e1d7;
}

.question-block {
  margin-bottom: 25px;
  padding: 20px;
  background: #fdfbf6;
  border-radius: 10px;
  border: 1px solid #e6e1d7;
}

.question-block p {
  color: #544343;
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 15px;
  line-height: 1.5;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

li:hover {
  background: rgba(200, 213, 195, 0.2);
}

label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-weight: 500;
}

.option-label {
  font-weight: bold;
  margin-right: 8px;
  color: #544343;
  min-width: 20px;
}

input[type='radio'] {
  margin: 0 10px 0 5px;
}

.correct {
  color: #4e944f;
  font-weight: bold;
}

.incorrect {
  color: #d29982;
  font-weight: bold;
}

.actions {
  margin-top: 20px;
  text-align: center;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border: none;
  background: #a8bba3;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(168, 187, 163, 0.3);
}

button:hover {
  background: #95a68f;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(168, 187, 163, 0.4);
}

button:disabled {
  cursor: not-allowed;
  transform: none;
  box-shadow: none;

  background-color: #d8d5cb;
  color: #a19692;
}
</style>
