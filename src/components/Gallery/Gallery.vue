<template>
  <section class="gallery">
    <div class="gallery__search-container">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="isSearchFocused ? '' : 'Painting title'"
        class="gallery__search"
        @focus="isSearchFocused = true"
        @blur="isSearchFocused = false"
      />
      <img src="/images/serch.svg" alt="Поиск" class="gallery__search-icon" />
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="photos.length > 0" class="gallery__grid">
        <GalleryCard
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          :location="locations"
          :avtor="avtors"
        />
      </div>

      <div v-else class="gallery__no-results">
        <p>
          <span style="font-weight: bold; color: var(--no-results-color)">
            {{ noResults }}
          </span>
        </p>
        <p class="gallery__no-results-suggestion">
          {{ errorMessage }}
        </p>
      </div>

      <div class="pagination">
        <div v-if="photos.length > 0" class="pagination">
          <button class="pagination__button" @click="previousPage" :disabled="currentPage === 1">
            <img src="/images/arrow-left.svg" alt="Назад" />
          </button>

          <button
            v-for="page in pages"
            :key="page"
            class="pagination__page"
            :class="{
              'pagination__page--active': page === currentPage,
              'pagination__page--ellipsis': page === '...',
            }"
            @click="goToPage(typeof page === 'number' ? page : null)"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>

          <button class="pagination__button" @click="nextPage" :disabled="currentPage === maxPage">
            <img src="/images/arrow-right.svg" alt="Вперед" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import GalleryCard from './GalleryCard.vue'
import axios from 'axios'

const isSearchFocused = ref(false)

interface Photo {
  id: number
  title: string
  url: string
  description: string
}

const photos = ref<Photo[]>([])

const avtors = ref([])
const locations = ref([])
const errorMessage = ref('')

let currentPage = ref(1)
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const maxPage = ref(0)

watch(
  currentPage,
  async (newPage) => {
    loading.value = true
    try {
      const response = await axios.get(
        `https://test-front.framework.team/paintings/?_page=${newPage}&_limit=${6}`,
      )
      photos.value = response.data
      maxPage.value = Math.ceil(response.headers['x-total-count'] / 6)

      const responseAvtors = await axios.get(`https://test-front.framework.team/authors/`)
      avtors.value = responseAvtors.data

      const responseLocations = await axios.get(`https://test-front.framework.team/locations/`)
      locations.value = responseLocations.data
    } catch (e: any) {
      error.value = e.message || 'Failed to load gallery data'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const pages = ref<any>([])

const props = defineProps<{
  page: number
  maxPage: number
  setPage: (page: number) => void
}>()

const updatePages = () => {
  console.log(currentPage.value, maxPage.value)
  pages.value = []

  if (currentPage.value < 4) {
    for (let i = 1; i <= 4; i++) {
      pages.value.push(i)
    }
    pages.value.push('...')
    pages.value.push(maxPage.value)
  } else {
    if (currentPage.value >= maxPage.value - 1 || currentPage.value >= maxPage.value - 2) {
      pages.value.push(1)
      pages.value.push('...')
      pages.value.push(maxPage.value - 1)
      pages.value.push(maxPage.value)
    } else {
      pages.value.push(1)
      pages.value.push('...')
      pages.value.push(currentPage.value - 1)
      pages.value.push(currentPage.value)
      pages.value.push(currentPage.value + 1)
      pages.value.push('...')
      pages.value.push(maxPage.value)
    }
  }
}

updatePages()

watch(
  [currentPage, maxPage],
  () => {
    updatePages()
  },
  { immediate: true },
)

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < maxPage.value) {
    currentPage.value++
  }
}

const goToPage = (page: number | null) => {
  if (page !== null) {
    currentPage.value = page
  }
}

const noResults = ref('')

watch(searchQuery, (newValue) => {
  searchItem(currentPage.value, newValue)
})

async function searchItem(page: number, search: string) {
  const response = await axios.get(
    `https://test-front.framework.team/paintings/?&_limit=${6}&q=${search}`,
  )
  photos.value = response.data
  maxPage.value = Math.ceil(response.headers['x-total-count'] / 6)
  if (photos.value.length === 0) {
    noResults.value = `No matches for ${search}.`
    errorMessage.value = 'Please try again with a different spelling or keywords.'
  } else {
    noResults.value = ''
    errorMessage.value = ''
  }
}

provide('goToPage', goToPage)
</script>

<style scoped lang="scss">
.gallery {
  padding: 20px;
  max-width: 1440px;
  margin: 0 auto;
  --border-color: #000;

  &__search-container {
    position: relative;
    margin-bottom: 20px;
    width: auto;
    max-width: 440px;
    margin-left: auto;
    margin-right: 0;
  }

  &__search {
    width: 100%;
    padding: 12px 40px;
    font-size: 16px;
    line-height: 20px;
    color: #979797;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: none;
    outline: none;
    box-sizing: border-box;

    &:focus {
      border: 1px solid var(--border-color);
    }
  }

  &__search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    pointer-events: none;
    opacity: 0.5;
    filter: invert(1);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  @media (min-width: 320px) and (max-width: 767px) {
    padding: 10px;

    &__search-container {
      text-align: center;
      width: 100%;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    &__grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 20px;

    &__grid {
      grid-template-columns: repeat(2, 1fr);
    }

    &__search-container {
      order: -1;
      text-align: center;
      width: 100%;
      max-width: 354px;
      margin-left: auto;
      margin-right: 0;
    }
  }

  @media (min-width: 1024px) and (max-width: 1279px) {
    padding: 30px;

    &__grid {
      grid-template-columns: repeat(3, 1fr);
    }

    &__search-container {
      width: auto;
      max-width: 480px;
      text-align: right;
      margin-left: auto;
      margin-right: 0;
    }
  }

  @media (min-width: 1280px) {
    padding: 40px;

    &__grid {
      grid-template-columns: repeat(3, 1fr);
    }

    &__search-container {
      width: auto;
      max-width: 440px;
      text-align: right;
      margin-left: auto;
      margin-right: 0;
    }
  }

  &__no-results {
    margin-top: 20px;
    text-align: center;
    color: #575757;
  }

  &__no-results-suggestion {
    font-style: italic;
    color: #9c9c9c;
  }

  @media (prefers-color-scheme: dark) {
    .gallery {
      --no-results-color: #dedede;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: var(--text-color);
}

.pagination__button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  transition: opacity 0.2s ease;

  img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    filter: var(--image-filter);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination__page {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  color: var(--text-color);

  &--active {
    color: var(--text-color);
    font-weight: 600;
  }

  &--ellipsis {
    cursor: default;
    color: var(--text-color);
  }
}
</style>
