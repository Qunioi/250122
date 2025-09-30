<template>
  <header class="page-header">
    <div class="header-top" v-header-fixed>
      <div class="header-container">
        <div class="header-logo">
          <Logo />
        </div>
        <div class="header-right">
          <div class="header-right-top">
            <EstTiming />
            <div class="top-link-wrap">
              <CustomLink />
            </div>
            <Lang />
            <Member />
          </div>
          <div class="header-right-bottom">
            <Navigation />
          </div>
        </div>
      </div>
    </div>
    <div class="header-bottom" v-if="!isFirst">
      <div class="header-container">
        <div class="banner-wrap" :style="bannerImage"></div>
        <News />
      </div>
    </div>
  </header>
</template>

<script setup>
import Logo from '@/components/common/Logo.vue';
import EstTiming from '@/components/common/EstTiming.vue';
import CustomLink from '@/components/common/CustomLink.vue';
import Lang from '@/components/common/Lang.vue';
import Member from '@/components/common/Member.vue';
import Navigation from '@/components/common/Navigation.vue';
import News from '@/components/common/News.vue';

import { getPath } from '@/composables/usePath.js';
import { useTheme } from '@/composables/useTheme.js'
import { useRoute } from 'vue-router'

const route = useRoute()

const { themeColor, lang } = useTheme() // 取得主題色與語言
const validTypes = ['card','casino','live','sport','lottery','promotion']
const navClass = computed(() => {
  const type = route.params.type
  return validTypes.includes(type) ? type : 'welcome'
})
const isFirst = computed(() => route.path === '/' || route.path === '/first')

const bannerImage = computed(() => ({
  backgroundImage: `url(${getPath(`/image/${themeColor.value}/lang/${lang.value}/title_${navClass.value}.png`)})`
}))
</script>


<style lang="scss">
.header-fixed-wrap {
  position: sticky;
  z-index: 900;
}
.ele-fixed-container,
.ele-fixed-inner {
  min-width: var(--page-width);
}
.ele-fixed-inner.fixed {
  background: rgb(var(--color-primary-bg));
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 900;
}
</style>