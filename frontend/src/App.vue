<template>
  <div class="app">
    <LandingPage v-if="currentPage === 'home'" />
    <SuccessPage v-else-if="currentPage === 'success'" />
    <CancelPage v-else-if="currentPage === 'cancel'" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LandingPage from './components/LandingPage.vue'
import SuccessPage from './components/SuccessPage.vue'
import CancelPage from './components/CancelPage.vue'

const currentPage = ref('home')

onMounted(() => {
  const path = window.location.pathname
  if (path.includes('/success')) {
    currentPage.value = 'success'
  } else if (path.includes('/cancel')) {
    currentPage.value = 'cancel'
  } else {
    currentPage.value = 'home'
  }
})
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
}
</style>

