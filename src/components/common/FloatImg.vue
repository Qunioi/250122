
<template>
  <div ref="floatContainer" class="ele-float-container">
    <div
      v-if="showLeft"
      class="ele-nest-wrap float-left-wrap"
      :class="{ 'slide-out': !isLeftVisible, 'slide-in': isLeftVisible }"
      :style="containerStyle"
    >
      <a
        v-for="(item, index) in leftList"
        :key="'left-' + item.id"
        href="#"
        :class="{ 'has-hover': hasHoverImage('left', index) }"
        @click.prevent="index === leftList.length - 1 ? toggleLeft() : null"
        @mouseenter="hoverIndex = index"
        @mouseleave="hoverIndex = null"
      >
        <img
          :src="hoverIndex === index && hasHoverImage('left', index)
            ? getImgUrl('left', index, item.imgHover, true)
            : getImgUrl('left', index, item.imgDefault)"
          class="float-img"
          :class="{ 'is-hover': hoverIndex === index && hasHoverImage('left', index) }"
        />
      </a>
    </div>
    <div
      v-if="showRight"
      class="ele-nest-wrap float-right-wrap"
      :class="{ 'slide-out': !isRightVisible, 'slide-in': isRightVisible }"
      :style="containerStyle"
    >
      <a
        v-for="(item, index) in rightList"
        :key="'right-' + item.id"
        href="#"
        :class="{ 'has-hover': hasHoverImage('right', index) }"
        @click.prevent="index === rightList.length - 1 ? toggleRight() : null"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = null"
      >
        <img
          :src="hoverIndex === index && hasHoverImage('right', index)
            ? getImgUrl('right', index, item.imgHover, true)
            : getImgUrl('right', index, item.imgDefault)"
          class="float-img"
          :class="{ 'is-hover': hoverIndex === index && hasHoverImage('right', index) }"
        />
      </a>
    </div>
  </div>
</template>


<script setup>
import { getPath } from '@/composables/usePath.js';
import { useConfigStore } from '@/stores/configStore';
import data from '@/assets/data/data.json';

const props = defineProps({
  showLeft: { type: Boolean, default: true },
  showRight: { type: Boolean, default: true },
});

const config = useConfigStore();
const themeName = computed(() => config.themeColor);
const lang = computed(() => config.lang);
const hoverIndex = ref(null);

// 浮動圖列表（從 localStorage 載入）
const leftList = ref([]);
const rightList = ref([]);

// 載入浮動圖列表
const loadFloatImagesList = () => {
  try {
    const saved = localStorage.getItem('floatImagesList');
    if (saved) {
      const parsed = JSON.parse(saved);
      leftList.value = parsed.left || data.flatImg.left || [];
      rightList.value = parsed.right || data.flatImg.right || [];
    } else {
      leftList.value = data.flatImg.left || [];
      rightList.value = data.flatImg.right || [];
    }
  } catch (e) {
    console.error('載入浮動圖列表失敗:', e);
    leftList.value = data.flatImg.left || [];
    rightList.value = data.flatImg.right || [];
  }
};

// 自定義圖片存儲
const customImages = ref({ left: {}, right: {} });

// 載入自定義圖片
const loadCustomImages = () => {
  try {
    const saved = localStorage.getItem('customFloatImages');
    if (saved) {
      customImages.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('載入自定義浮動圖失敗:', e);
  }
};

// 獲取圖片 URL
const getImgUrl = (side, index, filename, isHover = false) => {
  // 如果是 hover 圖片，優先使用自定義圖片
  if (isHover && customImages.value[side] && customImages.value[side][index]) {
    return customImages.value[side][index];
  }

  // 否則使用預設圖片
  if (!filename) {
    return '';
  }

  // 如果是 DataURL（上傳的圖片），直接返回
  if (filename.startsWith('data:')) {
    return filename;
  }

  // 否則使用主題路徑
  return getPath(`/image/${themeName.value}/lang/${lang.value}/${filename}`);
};

// 檢查是否有 hover 圖片
const hasHoverImage = (side, index) => {
  // 優先檢查自定義圖片
  if (customImages.value[side] && customImages.value[side][index]) {
    return true;
  }

  // 檢查預設的 imgHover
  const list = side === 'left' ? leftList.value : rightList.value;
  const item = list[index];
  return item && item.imgHover && item.imgHover.length > 0;
};

// 控制左右浮動容器的顯示狀態
const isLeftVisible = ref(true);
const isRightVisible = ref(true);

// 切換左側浮動容器顯示狀態
const toggleLeft = () => {
  isLeftVisible.value = !isLeftVisible.value;
};

// 切換右側浮動容器顯示狀態
const toggleRight = () => {
  isRightVisible.value = !isRightVisible.value;
};

// 監聽顯示狀態變化，保存到 localStorage 並觸發更新事件
watch([isLeftVisible, isRightVisible], () => {
  try {
    const visibility = {
      left: isLeftVisible.value,
      right: isRightVisible.value
    };
    localStorage.setItem('floatImgVisibility', JSON.stringify(visibility));
    // 觸發自定義更新事件
    window.dispatchEvent(new CustomEvent('float-img-update'));
  } catch (e) {
    console.error('保存浮動圖顯示狀態失敗:', e);
  }
});

// 滾動位置管理
const floatContainer = ref(null);
const containerStyle = ref({ top: "150px" });
let scrollTimeout = null;
let scrollContainer = null; // 滾動容器

// 根據滾動更新容器位置
function updatePosition() {
  // 固定 top 150px + 當前 scrollY
  let scrollY = 0;
  
  // 優先檢查 .themeManager-site-wrap 的滾動（編輯模式）
  const siteWrap = document.querySelector('.themeManager-site-wrap');
  if (siteWrap && siteWrap.scrollTop !== undefined) {
    scrollY = siteWrap.scrollTop;
  } else {
    // 否則使用 window 的滾動（一般模式）
    scrollY = window.scrollY || window.pageYOffset || 0;
  }
  
  const newTop = 150 + scrollY;
  // console.log('scrollY:', scrollY, 'newTop:', newTop);
  containerStyle.value = {
    top: `${newTop}px`
  };
}

// 處理滾動事件
function onScroll() {
  updatePosition();
}

// 初始化位置並添加滾動監聽
onMounted(() => {
  loadFloatImagesList();
  loadCustomImages();
  loadVisibility();
  updatePosition();
  
  // 監聽 window 滾動
  window.addEventListener('scroll', onScroll);
  
  // 監聽 .themeManager-site-wrap 滾動（編輯模式）
  const siteWrap = document.querySelector('.themeManager-site-wrap');
  if (siteWrap) {
    scrollContainer = siteWrap;
    scrollContainer.addEventListener('scroll', onScroll);
  }
  
  window.addEventListener('storage', onStorageChange);
  window.addEventListener('float-img-update', onCustomUpdate);
});

// 載入顯示狀態
const loadVisibility = () => {
  try {
    const saved = localStorage.getItem('floatImgVisibility');
    if (saved) {
      const parsed = JSON.parse(saved);
      isLeftVisible.value = parsed.left !== false;
      isRightVisible.value = parsed.right !== false;
    }
  } catch (e) {
    console.error('載入浮動圖顯示狀態失敗:', e);
  }
};

// 監聽 storage 變化（跨組件同步）
const onStorageChange = (e) => {
  if (e.key === 'floatImgVisibility') {
    loadVisibility();
  } else if (e.key === 'customFloatImages') {
    loadCustomImages();
  } else if (e.key === 'floatImagesList') {
    loadFloatImagesList();
  }
};

// 監聽自定義更新事件
const onCustomUpdate = () => {
  loadVisibility();
  loadCustomImages();
  loadFloatImagesList();
};

// 清理滾動監聽
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScroll);
  }
  window.removeEventListener('storage', onStorageChange);
  window.removeEventListener('float-img-update', onCustomUpdate);
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
  z-index: 9;

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