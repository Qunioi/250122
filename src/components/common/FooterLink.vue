<template>
  <div class="article-menu">
    <nav class="ele-article-link-wrap">
      <ul>
        <template v-for="(link, index) in footerLinks" :key="index">
          <li class="ele-article-link">
            <router-link :to="link.link">
              {{ link.title }}
            </router-link>
          </li>
          <span v-if="showSeparator && index < footerLinks.length - 1" class="ele-article-link-line">
            {{ separatorContent }}
          </span>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore.js';
const dataStore = useDataStore();
const footerLinks = dataStore.footerLinks;

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