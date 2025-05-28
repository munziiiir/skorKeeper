<template>
  <div class="app">
    <div class="heading">
      <h1>skorKeeper</h1>
      <div style="margin-right: auto;  padding: 16px; font-size: x-small;">
        <a href="#" @click.prevent="checkForUpdate"><sup>by munzir :)</sup></a>
      </div>
    </div>

    <div v-if="!showSetup && !gameStarted" class="start">
      <button class="start-button" @click="showSetup = true">Start New Game</button>
    </div>

    <div v-if="showSetup && !gameStarted" class="setup">
      <label>No of players:  </label>
      <input type="number" v-model.number="playerCount" min="2" max="10" @focus="selectAll" />
      <button @click="startGame">Start</button>
    </div>

    <div v-if="gameStarted" class="sheet">
      <div class="table-wrapper" ref="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th v-for="(player, i) in players" :key="i">
                <input type="text" v-model="player.name" @focus="selectAll" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(round, roundIndex) in rounds" :key="roundIndex">
              <th>{{ roundIndex + 1 }}</th>
              <td v-for="(player, playerIndex) in players" :key="playerIndex">
                <input type="number" v-model.number="player.scores[roundIndex]" @focus="selectAll" />
              </td>
            </tr>
            <tr>
              <th>Total</th>
              <th v-for="(player, i) in players" :key="'total' + i">
                {{ totalScore(player) }}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-if="toast" class="toast">{{ toast }}</div>

    <div v-if="gameStarted" class="controls">
      <button @click="addRound">+ Round</button>
      <button @click="addPlayer">+ Player</button>
      <button @click="resetScores">Reset Scores</button>
      <button @click="restartGame">New Game</button>
    </div>
  </div>
</template>



<!-- SCRIPTS -->
<script setup>
import { ref, reactive, nextTick, watch } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const showSetup = ref(false)
const gameStarted = ref(false)
const tableWrapper = ref(null)
const playerCount = ref(2)
const players = reactive([])
const rounds = ref([])
const toast = ref('')
let toastTimer

const { updateServiceWorker } = useRegisterSW()

function showToast(message, duration = 2500) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), duration)
}

function checkForUpdate() {
  if (navigator.onLine) {
    updateServiceWorker(true)
    showToast("Fetching updates...")
  } else {
    showToast("You're offline, cannot fetch updates.")
  }
}

const initPlayers = () => {
  players.length = 0
  rounds.value = [0]
  for (let i = 0; i < playerCount.value; i++) {
    players.push({ name: `player${i + 1}`, scores: [0] })
  }
}

const startGame = () => {
  initPlayers()
  gameStarted.value = true
}

// player remove logic
watch(players, (newPlayers) => {
  newPlayers.forEach((player, i) => {
    if (player.name?.trim() === 'remove@') {
      // Force keyboard to close
      document.activeElement?.blur()
      setTimeout(() => {
        const confirmed = confirm('Are you sure you want to delete this player?')
        if (confirmed) {
          players.splice(i, 1)
        } else {
          player.name = `player${i + 1}`
        }
      }, 100) // small delay gives blur time to take effect
    }
  })
}, { deep: true })



const addRound = () => {
  rounds.value.push(rounds.value.length)
  players.forEach(player => player.scores.push(0))
  // autoscroll to bottom
  nextTick(() => {
    if (tableWrapper.value) {
      tableWrapper.value.scrollTo({
        top: tableWrapper.value.scrollHeight,
        behavior: 'smooth' // Optional: animate
      })
    }
  })
}

const addPlayer = () => {
  const newPlayerIndex = players.length + 1
  players.push({
    name: `player${newPlayerIndex}`,
    scores: Array(rounds.value.length).fill(0)
  })
  // autoscroll to right
  nextTick(() => {
    if (tableWrapper.value) {
      tableWrapper.value.scrollTo({
        left: tableWrapper.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}


const totalScore = (player) => {
  return player.scores.reduce((sum, score) => sum + (score || 0), 0)
}

const resetScores = () => {
  rounds.value = [0]
  players.forEach(player => {player.scores = [0]})
}

const restartGame = () => {
  gameStarted.value = false
}

const selectAll = (e) => {
  e.target.select()
}

</script>
