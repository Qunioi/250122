
<template>
  <div ref="floatContainer" class="ele-float-container">
    <div v-if="showLeft" class="ele-nest-wrap float-left-wrap" :style="containerStyle">
      <a
        v-for="item in leftList"
        :key="'left-' + item.id"
        href="#"
        @mouseenter="hoverId = item.id"
        @mouseleave="hoverId = null"
      >
        <img :src="getImgUrl(item.imgDefault)" class="out"/>
        <img :src="getImgUrl(item.imgHover)" class="in" v-if="item.imgHover && item.imgHover.length > 0"/>
      </a>
    </div>
    <div v-if="showRight" class="ele-nest-wrap float-right-wrap" :style="containerStyle">
      <a
        v-for="item in rightList"
        :key="'right-' + item.id"
        href="#"
        @mouseenter="hoverId = item.id"
        @mouseleave="hoverId = null"
      >
        <img :src="getImgUrl(item.imgDefault)" class="out"/>
        <img :src="getImgUrl(item.imgHover)" class="in" v-if="item.imgHover && item.imgHover.length > 0"/>
      </a>
    </div>
  </div>
</template>


<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useConfigStore } from "@/stores/configStore";
import { getPath } from '@/composables/usePath.js'
import data from "@/assets/data/data.json";

const props = defineProps({
  showLeft: { type: Boolean, default: true },
  showRight: { type: Boolean, default: true },
});

const config = useConfigStore();
const themeName = computed(() => config.themeColor);

const leftList = computed(() => data.flatImg.left || []);
const rightList = computed(() => data.flatImg.right || []);

function getImgUrl(filename) {
  return filename ? getPath(`/image/${themeName.value}/${filename}`) : "";
}

const floatContainer = ref(null);
const containerStyle = ref({ top: "150px" });
let scrollTimeout = null;

function updatePosition() {
  // 固定 top 150px + 當前 scrollY
  const scrollY = window.scrollY || window.pageYOffset || 0;
  containerStyle.value = {
    top: `${150 + scrollY}px`
  };
}

function onScroll() {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    updatePosition();
  }, 50);
}

onMounted(() => {
  updatePosition();
  window.addEventListener("scroll", onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  if (scrollTimeout) clearTimeout(scrollTimeout);
});
</script>


<style scoped lang="scss">
.ele-nest-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 0;
  z-index: 910;
  transition: top 0.3s;

  &.float-right-wrap {
    left: auto;
    right: 0;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
}
</style>