<template>
  <div class="lang-wrap">
    <div class="ele-lang-wrap">
      <div title="繁体中文" class="ele-lang-option lang-zh-tw" @click="setLang('zh-tw')"></div>
      <div title="简体中文" class="ele-lang-option lang-zh-cn" @click="setLang('zh-cn')"></div>
      <div title="English" class="ele-lang-option lang-en" @click="setLang('en')"></div>
    </div>
  </div>
</template>

<script setup>
import { useConfigStore } from '@/stores/configStore'

const config = useConfigStore()
const { setLang } = config
</script>