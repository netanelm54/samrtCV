<template>
  <div class="success-page">
    <div class="container">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your CV analysis is being processed.</p>
        <p class="info-text">
          You will receive a detailed PDF report at your email address within a few minutes.
        </p>
        <button @click="goHome" class="home-button">Return Home</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const goHome = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 600px;
  width: 100%;
}

.success-card {
  background: white;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 16px;
}

p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 12px;
}

.info-text {
  margin-top: 24px;
  padding: 20px;
  background: #f0f7ff;
  border-radius: 8px;
  color: #333;
}

.home-button {
  margin-top: 30px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.home-button:hover {
  transform: translateY(-2px);
}
</style>

