<template>
  <div class="ele-custom-link-wrap">
    <ul>
      <template v-for="(link, index) in customLinks" :key="index">
        <li class="ele-custom-link">
          <a :href="link.link">{{ link.title }}</a>
        </li>
        <span v-if="showSeparator && index < customLinks.length - 1" class="ele-custom-link-line">
          {{ separatorContent }}
        </span>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore.js';
const dataStore = useDataStore();
const customLinks = dataStore.customLinks;

// 🔸 控制自訂連結分隔符號
const props = defineProps({
  showSeparator: {
    type: Boolean,
    default: true
  },
  separatorContent: {
    type: String,
    default: '|'
  }
});
</script>