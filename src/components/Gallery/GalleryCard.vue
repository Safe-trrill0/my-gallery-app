<template>
  <div class="gallery-card" @mouseover="showDetails = true" @mouseleave="showDetails = false">
    <img :src="`https://test-front.framework.team/${photo.imageUrl}`" :alt="photo.title" class="gallery-card__image" />
    <div class="card-text-container">
      <div class="card-text" :class="{ 'card-text--hidden': showDetails }">
        <h3 class="gallery-card__title">{{ photo.name }}</h3>
        <p class="gallery-card__description">{{ photo.created }}</p>
      </div>

      <div class="card-details" :class="{ 'card-details--visible': showDetails }">
        <h3 class="gallery-card__title">{{ avtor[photo.authorId - 1].name }}</h3>
        <p class="gallery-card__description">{{ location[photo.locationId - 1].location }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

defineProps({
  photo: {
    type: Object,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  avtor: {
    type: Object,
    required: true,
  },
})

const showDetails = ref(false)
const themeClass = inject('themeClass') || 'light-theme'


</script>

<style scoped lang="scss">
.gallery-card {
  position: relative;
  text-align: left;
  overflow: hidden;
  height: 260px;
  cursor: pointer;

  &__image {
    width: 100%;
    height: 260px;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &__title {
    font-family: 'Cormorant SC', serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: var(--text-color);
  }

  &__description {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: var(--descr-text-width-theme);
  }
}

.card-text-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 82px;
  overflow: hidden;
  background-color: var(--bg-color);

  &::before {
    content: '';
    position: absolute;
    top: 25%;
    left: 0;
    width: 2px;
    height: 42px;
    background-color: var(--descr-text-width-theme);
  }
}

.card-text {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  padding: 20px 20px 20px 17px;
  transition: transform 0.3s ease;

  &--hidden {
    transform: translateY(100%);
  }
}

.card-details {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 20px 20px 17px;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  &--visible {
    transform: translateX(0);
  }
  .gallery-card__title {
    font-family: 'Cormorant SC', serif;
  }
  .gallery-card__description {
    font-family: 'Inter', sans-serif;
  }
}
</style>
