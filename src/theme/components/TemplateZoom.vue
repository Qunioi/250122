<template>
  <div class="themeManager-zoom-wrap">
    <button class="btn-reduction" @click="decreaseScale"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg></button>
    <span>{{ Math.round(localScale * 100) }}%</span>
    <button class="btn-increase" @click="increaseScale"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg></button>
    <button class="btn-reload" @click="resetScale">重置</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const localScale = ref(1);
let pageLayout = null;

const applyZoom = () => {
  if (pageLayout) {
    pageLayout.style.zoom = localScale.value; // 直接作用在 #page-layout
  }
};

const increaseScale = () => {
  localScale.value = Math.min(localScale.value + 0.1, 1.5);
  applyZoom();
};

const decreaseScale = () => {
  localScale.value = Math.max(localScale.value - 0.1, 0.5);
  applyZoom();
};

const resetScale = () => {
  localScale.value = 1;
  applyZoom();
};

onMounted(() => {
  pageLayout = document.querySelector(".page-wrap");
  applyZoom();
});
</script>

<style scoped lang="scss">
.themeManager-zoom-wrap {
  order: 3;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  color: var(--cp-text-primary);
  background: var(--cp-color-third);
  border-radius: 4px;
  box-shadow: 0 2px 5px rgb(0 0 0 / 20%);
  padding: 3px;
  position: fixed;
  bottom: 20px;
  left: 10px;
  z-index: 9998;
  > span {
    width: 40px;
    font-size: 13px;
    text-align: center;
  }
  button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 30px;
    height: 30px;
    background: var(--cp-color-third);
    border-radius: 3px;
    padding: 2px 8px;
    &:hover {
      color: rgb(255 255 255);
      background-color: var(--cp-bg-secondary);
    }
  }
  .btn-reload {
    font-size: 12px;
  }
}
</style>