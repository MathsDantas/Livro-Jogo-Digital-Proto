<template>
  <div class="page-wrapper">
    <div class="book-container">
      <h1>Uma Noite na Floresta</h1>

      <button @click="startGame">
        Iniciar sua noite na floresta
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function startGame() {
  router.push('/game')
}
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-container {
  width: 420px;
  padding: 50px 40px;
  text-align: center;
  color: white;
}

h1 {
  margin-bottom: 40px;
  font-size: 28px;
  letter-spacing: 1px;
}

button {
  padding: 14px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  background: transparent;
  border: 1px solid white;
  color: white;
  transition: 0.3s;
}

button:hover {
  background: white;
  color: black;
}
</style>