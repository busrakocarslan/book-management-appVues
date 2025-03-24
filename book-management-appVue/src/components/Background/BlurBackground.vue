<template>
    <div class="blur-background">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
  </template>
  
  <style scoped>
  .blur-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: -1;
  }
  
  .circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
    animation: moveAround 10s infinite alternate ease-in-out;
  }
  
  .circle-1 {
    width: 400px;
    height: 400px;
    background: #42b883;
    top: 200px;
    left: 500px;
    animation-delay: -2s;
  }
  
  .circle-2 {
    width: 500px;
    height: 500px;
    background: #8b5cf6; 
    bottom: 200px;
    right: 500px;
    animation-delay: -2s;
    /* animation-duration: 20s; */
  }
  
  @keyframes moveAround {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(100px, 50px) rotate(120deg);
    }
    66% {
      transform: translate(-50px, 100px) rotate(240deg);
    }
    100% {
      transform: translate(50px, -50px) rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    .circle {
      filter: blur(60px);
    }
    .circle-1 {
      width: 300px;
      height: 300px;
    }
    .circle-2 {
      width: 350px;
      height: 350px;
    }
  }
  </style>