<template>
  <div class="app-background">
    <div class="overlay">
      <router-view />
    </div>

    <!-- Audio -->
    <audio ref="bg" src="/audio/bg.ogg" loop preload="auto" />

    <!-- Botão Flutuante -->
    <button class="audio-button" @click="toggleAudio">
      <span class="icon">
        {{ isPlaying ? '🔊' : '🔇' }}
      </span>
    </button>

    <!-- Tooltip inicial -->
    <div v-if="showTooltip" class="audio-tooltip">
      Clique para ativar o som 🎵
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let audioContext: AudioContext | null = null
let source: AudioBufferSourceNode | null = null
let audioBuffer: AudioBuffer | null = null

const isPlaying = ref(false)

const showTooltip = ref(true)

const initAudio = async () => {
  if (!audioContext) {
    audioContext = new AudioContext()

    const response = await fetch('./audio/bg.ogg')
    const arrayBuffer = await response.arrayBuffer()
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  }
}

const toggleAudio = async () => {
  await initAudio()

  if (!audioContext || !audioBuffer) return

  if (!isPlaying.value) {
    await audioContext.resume()

    source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.loop = true

    const gainNode = audioContext.createGain()
    gainNode.gain.value = 0.4

    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start(0)

    isPlaying.value = true
  } else {
    source?.stop()
    isPlaying.value = false
  }
  showTooltip.value = false
}
</script>

<style>
.app-background {
  min-height: 100vh;
  background-image: url('@/assets/backgrounds/No Coração dos Deuses.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.744);
  /* escurece o fundo */
  display: flex;
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.audio-button {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 55px;
  height: 55px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: grid;
  /* 👈 melhor que flex para centro exato */
  place-items: center;
  /* 👈 centraliza perfeito */
  cursor: pointer;
  z-index: 999;
  border: none;
  padding: 0;
}

.audio-button .icon {
  font-size: 22px;
  line-height: 1;
  display: inline-block;
  transform: translateY(1px);
  /* 👈 ajuste fino REAL */
}

.audio-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.audio-tooltip {
  position: fixed;
  bottom: 85px;
  left: 20px;
  background: black;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 999;
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.07);
  }

  100% {
    transform: scale(1);
  }
}
</style>