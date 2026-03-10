import { createRouter, createWebHashHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import GameView from '../views/GameView.vue'

const routes = [
  { path: '/', component: StartView },
  { path: '/game', component: GameView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router