<template>
    <div class="social-share">
      <h3>Kitabı Paylaş</h3>
      <div class="share-buttons">
        <button @click="shareOnX" class="share-btn x">
          <i class="fab fa-x-twitter">x</i>
          
        </button>
        <button @click="shareOnFacebook" class="share-btn facebook">
          <i class="fab fa-facebook"></i>
         
        </button>
        <button @click="shareOnLinkedin" class="share-btn linkedin">
          <i class="fab fa-linkedin"></i>
        </button>
        <button @click="shareOnWhatsapp" class="share-btn whatsapp">
          <i class="fab fa-whatsapp"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  })
  
  const shareText = `${props.title} kitabını keşfedin!`
  
  const shareOnX = () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(props.url)}`)
}
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`)
  }
  
  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`)
  }
  
  const shareOnWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + props.url)}`)
  }
  </script>
  
  <style scoped>
  .social-share {
    margin-top: 2rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .share-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  
  .share-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }
  
  .share-btn:hover {
    opacity: 0.9;
  }
  
  .twitter {
    background: #1da1f2;
  }
  
  .facebook {
    background: #1877f2;
  }
  
  .linkedin {
    background: #0077b5;
  }
  
  .whatsapp {
    background: #25d366;
  }
  
  .share-btn i {
    font-size: 1.2rem;
  }
  .x {
  background: #000000;
}
  </style>