<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'
import Gallery from './components/Gallery/Gallery.vue'
import { computed } from 'vue'

const themeStore = useThemeStore()

const logoSrc = computed(() => {
  return themeStore.themeClass === 'dark-theme'
    ? '/images/logo-white.png'
    : '/images/logo-black.png'
})

const themeBtnSrc = computed(() => {
  return themeStore.themeClass === 'dark-theme'
    ? '/images/theme_btn_black.png'
    : '/images/theme_btn_white.png'
})
</script>

<template>
  <body :class="themeStore.themeClass">
    <nav id="header">
      <div class="logo">
        <img :src="logoSrc" alt="Logo" />
      </div>

      <div>
        <button id="swith" @click="themeStore.toggleTheme">
          <img :src="themeBtnSrc" alt="Theme Switch" />
        </button>
        <router-view />
      </div>
    </nav>

    <div :class="themeStore.themeClass">
      <Gallery />
    </div>
  </body>
</template>

<style lang="scss">
:root {
  --bg-color: #ffffff;
  --text-color: #2b292d;
  --descr-text-width-theme: #9b4b4b;
  --image-filter: none;
}

.dark-theme {
  --bg-color: #121212;
  --text-color: #ffffff;
  --descr-text-width-theme: #ab8956;
  --image-filter: invert(1);
}

body {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  background-color: var(--bg-color);
  color: var(--text-color);
}

#swith {
  width: 40px;
  height: 40px;
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
