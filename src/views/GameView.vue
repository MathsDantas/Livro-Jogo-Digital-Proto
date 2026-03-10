<template>
  <div class="page-wrapper" v-if="scene">
    <div class="book-container">

      <p class="scene-text">
        {{ displayedText }}
      </p>

      <div class="options" v-if="showOptions">
        <button
          v-for="opcao in visibleOptions"
          :key="opcao.texto"
          @click="loadScene(opcao.proxima)"
          class="fade-option"
        >
          {{ opcao.texto }}
        </button>
      </div>

    </div>

    <!-- MODAL DE FALHA -->
    <div v-if="showFailModal" class="fail-overlay">
      <div class="fail-modal">
        <h1>Você Falhou</h1>

        <button class="restart-btn" @click="goHome">
          Voltar ao início
        </button>
      </div>
    </div>

    <div v-if="showVictoryModal" class="victory-overlay">
      <div class="victory-modal">

        <h1>Você conseguiu sobreviver à noite na floresta!</h1>

        <p class="victory-sub">
          Quais mistérios ainda existem na floresta?
        </p>

        <button class="restart-btn" @click="goHome">
          Jogar novamente
        </button>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showFailModal = ref(false)
let failAudio: HTMLAudioElement | null = null

const showVictoryModal = ref(false)
let victoryAudio: HTMLAudioElement | null = null

interface Opcao {
  texto: string
  proxima: string
}

interface Scene {
  id: string
  texto: string
  audio: string
  opcoes: Opcao[]
  tipo?: string
}

const scene = ref<Scene | null>(null)
const displayedText = ref('')
const showOptions = ref(false)
const visibleOptions = ref<Opcao[]>([])

let audio: HTMLAudioElement | null = null

const showVictory = () => {
  showVictoryModal.value = true

  victoryAudio = new Audio('/audio/vitoria.mp3')
  victoryAudio.volume = 0.2
  victoryAudio.play()
}

const loadScene = async (sceneId: string) => {

  // limpa áudio anterior
  if (audio) {
    audio.pause()
    audio.currentTime = 0
    audio = null
  }

  showOptions.value = false
  displayedText.value = ''
  visibleOptions.value = []
  showFailModal.value = false
  showVictoryModal.value = false

  const response = await fetch(`./story/${sceneId}.json`)
  scene.value = await response.json()

  if (!scene.value) return

  audio = new Audio(`./audio/cenas/${scene.value.audio}`)
  audio.preload = 'auto'
  audio.volume = 1

  // inicia animação quando metadados carregarem
  audio.addEventListener('loadedmetadata', () => {
    startTyping()
  })

const sceneType = scene.value.tipo
const hasOptions = scene.value.opcoes.length > 0

audio.addEventListener('ended', () => {

  if (!hasOptions) {

    if (sceneType === 'vitoria') {
      showVictory()
    } else {
      showFail()
    }

  }

})

  audio.play()
}

const showFail = () => {
  showFailModal.value = true

  failAudio = new Audio('./audio/falha.mp3')
  failAudio.volume = 0.2
  failAudio.play()
}

const goHome = () => {
  window.location.href = './'
}

const startTyping = () => {
  if (!scene.value || !audio) return

  const fullText = scene.value.texto
  const duration = audio.duration

  const totalChars = fullText.length
  const intervalTime = (duration * 800) / totalChars

  let index = 0

  const typingInterval = setInterval(() => {
    displayedText.value += fullText[index]
    index++

    if (index >= totalChars) {
      clearInterval(typingInterval)

      // só mostra opções se existirem
      if (scene.value.opcoes.length > 0) {
        showOptions.value = true

        scene.value.opcoes.forEach((opcao, index) => {
          setTimeout(() => {
            visibleOptions.value.push(opcao)
          }, index * 400)
        })
      }
    }
  }, intervalTime)
}

onMounted(() => {
  loadScene('inicio')
})
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px 0;
  box-sizing: border-box;
}

.book-container {
  width: 480px;
  padding: 50px 40px;
  color: white;

  display: flex;
  flex-direction: column;
}

/* Texto da cena */
.scene-text {
  font-size: 24px;
  line-height: 1.9;
  text-align: justify;
  text-indent: 20px;
  hyphens: auto;

  min-height: 18em; /* reduz o espaço vazio */
  margin-bottom: 10px;
}

/* Container das opções */
.options {
  text-align: center;
  margin-top: 10px;
}

/* Botões da história */
.options button {
  font-family: inherit; /* usa fonte global */
  padding: 14px 20px;
  font-size: 18px;
  cursor: pointer;

  width: 100%;
  margin-bottom: 12px;

  background: transparent;
  border: 1px solid rgba(255,255,255,0.6);
  color: rgba(255,255,255,0.9);

  transition: all 0.25s ease;
}

/* Hover */
.options button:hover {
  background: rgba(255,255,255,0.08);
  border-color: white;
  color: white;
}

/* Animação de entrada */
.fade-option {
  opacity: 0;
  animation: fadeIn 0.8s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.fail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: rgba(0,0,0,0.85);

  display: flex;
  justify-content: center;
  align-items: center;

  backdrop-filter: blur(4px);
}

.fail-modal {
  text-align: center;
  color: white;
}

.fail-modal h1 {
  font-size: 64px;
  margin-bottom: 40px;
}

.restart-btn {
  font-family: inherit;
  font-size: 22px;

  padding: 16px 28px;

  background: transparent;
  border: 2px solid white;
  color: white;

  cursor: pointer;
  transition: 0.3s;
}

.restart-btn:hover {
  background: white;
  color: black;
}

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: rgba(0,0,0,0.85);

  display: flex;
  justify-content: center;
  align-items: center;

  backdrop-filter: blur(4px);
}

.victory-modal {
  text-align: center;
  color: white;
  max-width: 600px;
}

.victory-modal h1 {
  font-size: 56px;
  margin-bottom: 20px;
}

.victory-sub {
  font-size: 22px;
  opacity: 0.8;
  margin-bottom: 40px;
}
</style>