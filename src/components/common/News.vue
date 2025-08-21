<template>
  <div class="news-wrap">
    <div class="news-title">NEWS</div>
    <div class="news-item">
      <div class="ele-msgnews-wrap">
        <div class="marquee-wrapper" @mouseenter="pauseAnimation" @mouseleave="resumeAnimation">
          <div ref="marqueeContent" class="marquee-content" :style="{ transform: `translateX(${translateX}px)` }">
            <a href="#" class="ele-msgnews-link" v-for="(text, index) in duplicatedNewsTexts" :key="index">{{ text }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const marqueeContent = ref(null);
const translateX = ref(0);
const animationId = ref(null);
const isPaused = ref(false);
const pausedTime = ref(0);
const contentWidth = ref(0);

const newsTexts = ref([
  '两岸三地最热门的机台游戏，结合4层Jackpot累积彩金玩法，移植到你的计算机里！在家就可以等待从天而降的彩金，你还在等什么？',
  '两岸三地最热门的机台游戏，结合4层Jackpot累积彩金玩法，移植到你的计算机里！在家就可以等待从天而降的彩金，你还在等什么？',
  '两岸三地最热门的机台游戏，结合4层Jackpot累积彩金玩法，移植到你的计算机里！在家就可以等待从天而降的彩金，你还在等什么？'
]);

// 自動複製第一組內容作為第二組，實現無縫循環
const duplicatedNewsTexts = computed(() => {
  return [...newsTexts.value, ...newsTexts.value];
});

let startTime = Date.now();
const speed = 50; // 像素每秒

const animate = () => {
  if (isPaused.value) {
    animationId.value = requestAnimationFrame(animate);
    return;
  }

  const elapsed = Date.now() - startTime;
  const newTranslateX = -(elapsed * speed) / 1000;
  
  // 當第一組內容完全離開視窗時，重置到起始位置實現無縫循環
  if (Math.abs(newTranslateX) >= contentWidth.value / 2) {
    // 重置動畫位置，因為我們有兩組相同的內容
    startTime = Date.now();
    translateX.value = 0;
  } else {
    translateX.value = newTranslateX;
  }
  
  animationId.value = requestAnimationFrame(animate);
};

const pauseAnimation = () => {
  isPaused.value = true;
  pausedTime.value = Date.now();
};

const resumeAnimation = () => {
  if (isPaused.value) {
    // 計算暫停的時間，並調整開始時間
    const pauseDuration = Date.now() - pausedTime.value;
    startTime += pauseDuration;
    isPaused.value = false;
  }
};

const calculateContentWidth = () => {
  nextTick(() => {
    if (marqueeContent.value) {
      contentWidth.value = marqueeContent.value.scrollWidth;
    }
  });
};

onMounted(() => {
  calculateContentWidth();
  translateX.value = 0; // 從左側開始
  animate();
});

onBeforeUnmount(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});
</script>

<style scoped>
.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  transition: none;
}

.ele-msgnews-link {
  margin-right: 3rem;
  white-space: nowrap;
  text-decoration: none;
}
</style>