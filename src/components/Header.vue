<template>
  <header class="page-header">
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
  </header>
</template>

<script setup>
import Logo from '@/components/common/Logo.vue';
import EstTiming from '@/components/common/EstTiming.vue';
import CustomLink from '@/components/common/CustomLink.vue';
import Lang from '@/components/common/Lang.vue';
import Member from '@/components/common/Member.vue';
import Navigation from '@/components/common/Navigation.vue';
// import { useDataStore } from '@/stores/dataStore.js';
// const dataStore = useDataStore();
// const headerNav = dataStore.headerNav;
</script>