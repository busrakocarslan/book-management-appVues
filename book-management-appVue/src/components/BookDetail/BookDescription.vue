<template>
  <div class="description-section">
    <h3>Kitap Açıklaması</h3>
    <div class="description-content">
      <p>{{ description || 'Bu kitap için açıklama bulunmamaktadır.' }}</p>
    </div>
    <div class="action-buttons">
      <button @click="downloadPdf" class="pdf-button" :disabled="!pdfUrl">
        <i class="fas fa-file-pdf"></i>
        {{ pdfUrl ? 'PDF İndir' : 'PDF Mevcut Değil' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  description: {
    type: String,
    default: '',
  },
  pdfLink: {
    type: Object,
    default: () => ({}),
  },
})

const pdfUrl = computed(() => props.pdfLink?.['Free eBook'] || '')

const downloadPdf = () => {
  console.log('PDF URL:', pdfUrl.value)
  if (pdfUrl.value) {
    window.open(pdfUrl.value, '_blank')
  }
}
</script>

<style scoped>
.description-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin: 1rem 0;
}

h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.description-content {
  line-height: 1.6;
  color: #4a4a4a;
  max-height: 150px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.action-buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.pdf-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pdf-button:hover {
  background-color: #c0392b;
}
.pdf-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pdf-button i {
  font-size: 1.1rem;
}
</style>
