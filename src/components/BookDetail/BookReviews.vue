<template>
    <div class="reviews-section">
      <h3>Kitap İncelemeleri</h3>
      
      <div class="reviews-section">
    <h3>Kitap İncelemeleri</h3>
    
    <!-- Yorum Yazma/Düzenleme Formu -->
    <div class="review-form">
      <div class="star-rating">
        <i v-for="n in 5" 
           :key="n"
           class="fas fa-star"
           :class="{ active: n <= rating }"
           @click="rating = n"
        ></i>
      </div>
      <textarea 
        v-model="reviewText"
        placeholder="Bu kitap hakkında düşüncelerinizi yazın..."
      ></textarea>
      <div class="form-buttons">
        <button 
          v-if="editingReview"
          @click="updateReview" 
          :disabled="!canSubmit"
          class="submit-btn"
        >
          Yorumu Güncelle
        </button>
        <button 
          v-if="editingReview"
          @click="cancelEdit" 
          class="cancel-btn"
        >
          İptal
        </button>
        <button 
          v-else
          @click="submitReview" 
          :disabled="!canSubmit"
          class="submit-btn"
        >
          Yorum Gönder
        </button>
      </div>
    </div>

  
      <div class="reviews-list">
        <div v-for="review in reviews" 
             :key="review.id" 
             class="review-item"
        >
          <div class="review-header">
            <div class="stars">
              <i v-for="n in 5" 
                 :key="n"
                 class="fas fa-star"
                 :class="{ active: n <= review.rating }"
              ></i>
            </div>
            <span class="review-date">{{ formatDate(review.date) }}</span>
          </div>
          <p class="review-text">{{ review.text }}</p>
          
          <div v-if="review.userId === currentUserId" class="review-actions">
            <button @click="editReview(review)" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteReview(review.id)" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  
  const props = defineProps({
    bookId: {
      type: String,
      required: true
    },
    currentUserId: {
      type: String,
      required: true
    }
  })
  
  const store = useStore()
  const rating = ref(0)
  const reviewText = ref('')
  const editingReview = ref(null)
  const reviews = ref([])
  
  const canSubmit = computed(() => {
    return rating.value > 0 && reviewText.value.trim().length > 0
  })
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR')
  }
  
  const submitReview = async () => {
    if (!canSubmit.value) return
  
    const review = {
      bookId: props.bookId,
      userId: props.currentUserId,
      rating: rating.value,
      text: reviewText.value,
      date: new Date()
    }
  
    try {
      await store.dispatch('books/addReview', review)
      reviews.value.unshift(review)
      rating.value = 0
      reviewText.value = ''
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  
  
  const editReview = (review) => {
    editingReview.value = review
    rating.value = review.rating
    reviewText.value = review.text
  }
  const updateReview = async () => {
  if (!canSubmit.value || !editingReview.value) return

  const updatedReview = {
    ...editingReview.value,
    rating: rating.value,
    text: reviewText.value,
    updatedAt: new Date()
  }

  try {
    await store.dispatch('books/updateReview', updatedReview)
    const index = reviews.value.findIndex(r => r.id === updatedReview.id)
    if (index !== -1) {
      reviews.value[index] = updatedReview
    }
    cancelEdit()
  } catch (error) {
    console.error('Error updating review:', error)
  }
}

const cancelEdit = () => {
  editingReview.value = null
  rating.value = 0
  reviewText.value = ''
}
  
  const deleteReview = async (reviewId) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return
    
    try {
      await store.dispatch('books/deleteReview', reviewId)
      reviews.value = reviews.value.filter(r => r.id !== reviewId)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }
  </script>
  
  <style scoped>
  .reviews-section {
    margin-top: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .review-form {
    margin-bottom: 2rem;
  }
  
  .star-rating {
    margin-bottom: 1rem;
  }
  
  .star-rating i {
    color: #ddd;
    cursor: pointer;
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }
  
  .star-rating i.active {
    color: #ffd700;
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .review-item {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .review-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .edit-btn, .delete-btn {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-btn {
    background: #42b883;
    color: white;
  }
  
  .delete-btn {
    background: #ff4757;
    color: white;
  }
  .form-buttons {
  display: flex;
  gap: 1rem;
}

.cancel-btn {
  background: #666;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
  </style>