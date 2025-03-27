<template>
  <div class="add-book">
    <div class="container">
      <div class="form-header">
        <button class="back-button" @click="router.back()">← Geri</button>
        <h1>Yeni Kitap Ekle</h1>
      </div>

      <div class="step-progress">
        <div
          v-for="step in steps"
          :key="step.id"
          :class="['step', { active: currentStep === step.id }]"
        >
          {{ step.title }}
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="book-form">
        <!-- Step 1: Temel Bilgiler -->
        <div class="form-step" v-show="currentStep === 1">
          <h2>Temel Bilgiler</h2>
          <div class="form-group">
            <label for="title">Kitap Adı*</label>
            <input
              type="text"
              id="title"
              v-model="bookData.title"
              :class="{ error: v$.bookData.title.$error }"
              @blur="v$.bookData.title.$touch()"
            />
            <span class="error-text" v-if="v$.bookData.title.$error"> Kitap adı gereklidir </span>
          </div>

          <div class="form-group">
            <label for="category">Kategori*</label>
            <select
              id="category"
              v-model="bookData.category"
              @change="handleCategoryChange"
              :class="{ error: v$.bookData.category.$error }"
            >
              <option value="">Seçiniz</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
            <span class="error-text" v-if="v$.bookData.category.$error">
              Kategori seçimi gereklidir
            </span>
          </div>

          <div class="form-group">
            <label for="authors">Yazar(lar)*</label>
            <input
              type="text"
              id="authors"
              v-model="bookData.authors"
              :class="{ error: v$.bookData.authors.$error }"
            />
          </div>

          <div class="form-group">
            <label for="isbn13">ISBN13*</label>
            <input
              type="text"
              id="isbn13"
              v-model="bookData.isbn13"
              :class="{ error: v$.bookData.isbn13.$error }"
              @blur="v$.bookData.isbn13.$touch()"
            />
            <span class="error-text" v-if="v$.bookData.isbn13.$error">
              Geçerli bir ISBN13 giriniz
            </span>
          </div>
        </div>

        <!-- Step 2: Detaylar ve Fiyat -->
        <div class="form-step" v-show="currentStep === 2">
          <h2>Detaylar ve Fiyat</h2>

          <div class="form-group">
            <label>Kitap Kapağı</label>
            <div class="image-upload" @drop.prevent="handleImageDrop" @dragover.prevent>
              <input
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                ref="fileInput"
                class="file-input"
              />
              <div class="upload-area" @click="$refs.fileInput.click()">
                <template v-if="!bookData.image">
                  <i class="upload-icon">📁</i>
                  <p>Görsel yüklemek için tıklayın veya sürükleyin</p>
                </template>
                <img v-else :src="bookData.image" class="preview-image" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Fiyat ve Para Birimi*</label>
            <div class="price-inputs">
              <input
                type="number"
                v-model="bookData.price"
                step="0.01"
                :class="{ error: v$.bookData.price.$error }"
              />
              <select v-model="bookData.currency">
                <option v-for="curr in currencies" :key="curr" :value="curr">
                  {{ curr }}
                </option>
              </select>
            </div>

            <!-- Döviz Çevrimleri -->
            <div class="currency-conversions" v-if="bookData.price && exchangeRates">
              <p v-for="(rate, curr) in filteredRates" :key="curr">
                {{ formatPrice(convertPrice(bookData.price, curr), curr) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Step 3: İçerik -->
        <div class="form-step" v-show="currentStep === 3">
          <h2>İçerik Bilgileri</h2>

          <div class="form-group">
            <label>Kitap Özeti*</label>
            <QuillEditor contentType="html" theme="snow" :options="editorOptions" />
          </div>

          <div v-if="categoryFields.length > 0" class="category-fields">
            <div v-for="field in categoryFields" :key="field.name" class="form-group">
              <label>{{ field.label }}</label>
              <input :type="field.type" v-model="bookData.customFields[field.name]" />
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="form-navigation">
          <button type="button" @click="prevStep" v-if="currentStep > 1" class="nav-button">
            Önceki
          </button>

          <button
            type="button"
            @click="nextStep"
            v-if="currentStep < steps.length"
            class="nav-button primary"
            :disabled="!canProceed"
          >
            Sonraki
          </button>

          <button
            type="submit"
            v-if="currentStep === steps.length"
            class="nav-button primary"
            :disabled="v$.$invalid"
          >
            Kaydet
          </button>
        </div>
      </form>
      <div class="currency-conversions" v-if="bookData.price && exchangeRates">
        <h4>Diğer Para Birimlerindeki Karşılıkları:</h4>
        <div class="conversion-grid">
          <div v-for="(rate, curr) in filteredRates" :key="curr" class="conversion-item">
            <strong>{{ curr }}:</strong>
            {{ formatPrice(convertPrice(bookData.price, curr), curr) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const categories = ['Programming', 'Money', 'Career', 'Business', 'Design', 'Marketing']
const currencies = ['USD', 'EUR', 'TRY', 'GBP']
const steps = [
  { id: 1, title: 'Temel Bilgiler' },
  { id: 2, title: 'Detaylar ve Fiyat' },
  { id: 3, title: 'İçerik' },
]

const router = useRouter()
const store = useStore()
const fileInput = ref(null)
const currentStep = ref(1)
const exchangeRates = ref(null)
const categoryFields = ref([])

const editorOptions = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
    ],
  },
}

const bookData = reactive({
  title: '',
  category: '',
  authors: '',
  isbn13: '',
  price: '',
  currency: 'USD',
  image: '',
  description: '',
  customFields: {},
})

const rules = {
  bookData: {
    title: { required },
    category: { required },
    authors: { required },
    isbn13: {
      required,
      isISBN: helpers.regex(/^[0-9]{13}$/),
    },
    price: { required },
    
  },
}

const v$ = useVuelidate(rules, { bookData })

const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return bookData.title && bookData.category && bookData.authors && bookData.isbn13
  }
  return true
})
// fonksiyonlar
const filteredRates = computed(() => {
  if (!exchangeRates.value) return {}
  return Object.entries(exchangeRates.value)
    .filter(([curr]) => currencies.includes(curr))
    .reduce((acc, [curr, rate]) => {
      acc[curr] = rate
      return acc
    }, {})
})

const handleCategoryChange = () => {
  loadCategoryFields(bookData.category)
}

const loadCategoryFields = (category) => {
  const fields = {
    Programming: [
      { name: 'programmingLanguage', label: 'Programlama Dili', type: 'text' },
      { name: 'difficulty', label: 'Zorluk Seviyesi', type: 'select' },
    ],
    Science: [
      { name: 'field', label: 'Bilim Dalı', type: 'text' },
      { name: 'academicLevel', label: 'Akademik Seviye', type: 'select' },
    ],
  }

  categoryFields.value = fields[category] || []
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      bookData.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleImageDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      bookData.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const convertPrice = (price, toCurrency) => {
  if (!price || !exchangeRates.value?.[toCurrency]) return price
  return price * exchangeRates.value[toCurrency]
}

const formatPrice = (amount, currency) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
  }).format(amount)
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  try {
    const isValid = await v$.value.$validate()
    if (!isValid) {
      alert('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    const newBook = {
      isbn13: bookData.isbn13,
      title: bookData.title,
      authors: bookData.authors,
      category: bookData.category,
      price: `$${bookData.price}`,
      image: bookData.image,
      desc: bookData.description,
      customFields: bookData.customFields,
      addedAt: new Date().toISOString(),
    }

    try {
      const result = await store.dispatch('books/addBook', newBook)

      if (result) {
        alert('Kitap başarıyla eklendi!')

        resetForm()

        await router.push('/profile')

        await store.dispatch('books/loadUserBooks')
      }
    } catch (innerError) {
      alert(`Kitap eklenirken hata: ${innerError.message}`)
    }
  } catch (error) {
    alert(`Kitap eklenirken hata: ${error.message || 'Bilinmeyen hata'}`)
  }
}

const resetForm = () => {
  Object.keys(bookData).forEach((key) => {
    if (typeof bookData[key] === 'string') {
      bookData[key] = ''
    } else if (typeof bookData[key] === 'object') {
      bookData[key] = {}
    }
  })
  bookData.currency = 'USD'
  currentStep.value = 1

  if (v$.value) v$.value.$reset()
}

onMounted(async () => {
  try {
    const { currencyService } = await import('@/services/currencyService')
    const rates = await currencyService.getRates('USD')
    exchangeRates.value = rates  
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    
  }
})
</script>

<style scoped>
.add-book {
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: #42b883;
  font-size: 1.1rem;
  cursor: pointer;
  margin-right: 1rem;
}

.step-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.step {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  margin: 0 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.step.active {
  background: #42b883;
  color: white;
}

.book-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-step {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #42b883;
}

.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.image-upload {
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
}

.image-upload:hover {
  border-color: #42b883;
}

.upload-area {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.price-inputs {
  display: flex;
  gap: 1rem;
}

.price-inputs input {
  flex: 2;
}

.price-inputs select {
  flex: 1;
}

.currency-conversions {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.nav-button.primary {
  background-color: #42b883;
  color: white;
}

.nav-button:not(.primary) {
  background-color: #e9ecef;
  color: #2c3e50;
}

.nav-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.category-fields {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

/* Quill Editor Styles */
:deep(.ql-container) {
  min-height: 200px;
}

:deep(.ql-editor) {
  font-size: 1rem;
  line-height: 1.6;
}

.file-input {
  display: none;
}

.conversion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.conversion-item {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}
</style>
