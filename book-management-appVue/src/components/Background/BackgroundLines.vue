<template>
  <div class="background-lines">
    <div
      v-for="n in linesCount"
      :key="n"
      class="line"
      :style="{
        left: `${(100 / linesCount) * (n - 1)}%`,
        animationDelay: `${n * 0.3}s`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const linesCount = computed(() => {
  // ekran genişliğine göre ayarlamak istiyorum

  const width = window.innerWidth
  if (width >= 1024) return 14
  if (width >= 768) return 8
  return 4
})
</script>

<style scoped>
.background-lines {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.line {
  position: absolute;
  width: 1.9px;
  height: 80%;
  background: linear-gradient(
    180deg,
    rgba(215, 195, 223, 0) 0%,
    rgba(138, 141, 140, 0.5) 50%,
    rgba(215, 195, 223, 0) 100%
  );
  transform-origin: 50% 0%;
}
</style>
