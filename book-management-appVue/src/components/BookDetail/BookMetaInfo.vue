<template>
    <div class="meta-info">
      <div class="info-grid">
        <div class="info-item">
          <strong>ISBN13:</strong>
          <span>{{ book.isbn13 }}</span>
        </div>
        <div class="info-item">
          <strong>Yazarlar:</strong>
          <span>{{ book.authors }}</span>
        </div>
        <div class="info-item">
          <strong>Yayınevi:</strong>
          <span>{{ book.publisher }}</span>
        </div>
        <div class="info-item">
          <strong>Yayın Yılı:</strong>
          <span>{{ book.year }}</span>
        </div>
        <div class="info-item">
          <strong>Dil:</strong>
          <span>{{ book.language || 'Belirtilmemiş' }}</span>
        </div>
        <div class="info-item">
          <strong>Sayfa:</strong>
          <span>{{ book.pages || 'Belirtilmemiş' }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    book: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .meta-info {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem 0;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .info-item strong {
    color: #42b883;
    font-size: 0.9rem;
  }
  
  .info-item span {
    color: #2c3e50;
  }
  </style>