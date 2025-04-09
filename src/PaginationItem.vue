<template>
  <button
    v-if="isPage"
    class="pagination__page"
    :class="{ 'pagination__page--active': page === currentPage }"
    @click="() => goToPage(Number(page))"
  >
    {{ page }}
  </button>
  <span v-else class="pagination__ellipsis">...</span>
</template>

<script setup lang="ts">
import { defineProps, inject } from 'vue'

defineProps({
  page: {
    type: [Number, String],
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  isPage: {
    type: Boolean,
    default: true,
  },
})

const goToPage = inject('goToPage', (page: number) => {})
</script>
