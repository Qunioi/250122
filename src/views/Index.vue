<template>
  <div class="page-container">
    <FloatImg />
    <section class="first-section-wrap first-main-wrap">
      <div class="section-wrap">
        <div class="main-left-wrap">
          <div class="first-slider-wrap">
            <!-- 輪播 -->
            <div class="slider-wrap">
              <Swiper :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]" :pagination="true" :slides-per-view="1"
                :loop="true" :autoplay="{
                  delay: 8000,
                  disableOnInteraction: true,
                }">
                <SwiperSlide v-for="(slide, index) in slides" :key="slide.id">
                  <img :src="getPath(`image/${themeColor}/${slide.image}`)" class="ele-slider-img" />
                </SwiperSlide>
              </Swiper>
            </div>
            <!-- 優惠 -->
            <div class="first-promotion-warp">
              <a v-for="index in [1, 2]" :key="index" href="#" class="ele-promotion-link"
                @mouseover="promotionHover = index" @mouseout="promotionHover = null">
                <img :src="getPath(`image/${themeColor}/lang/${lang}/btn0${index}${promotionHover === index ? '_hover' : ''}.png`)" />
              </a>
            </div>
          </div>
          <News />
        </div>
        <HotGame />
      </div>
    </section>
    <section class="first-section-wrap first-game-wrap">
      <div class="section-wrap">
        <div class="first-game-tab-wrap">
          <button v-for="(tab, key) in firstGame" :key="key" class="first-game-tab" :class="{ active: activeTab === key }"
            @click="activeTab = key">
            <span>{{ tab.label }}</span>
          </button>
        </div>
        <transition name="fade" mode="out-in">
          <div class="first-game-container" v-if="firstGame[activeTab]?.game?.length">
            <a href="#" class="first-game-item" v-for="(game, index) in firstGame[activeTab].game" :key="index">
              <div class="first-item-img">
                <button class="first-item-btn">Play</button>
                <img :src="getPath(`image/${game.image}`)" />
              </div>
              <div class="first-item-info">
                <div class="first-item-name">{{ game.name }}</div>
                <div v-if="game.hot" class="first-item-hot">HOT</div>
              </div>
              <div class="first-item-platform">{{ game.platform }}</div>
            </a>
          </div>
        </transition>
      </div>
    </section>
    <section class="first-section-wrap first-live-wrap">
      <div class="section-wrap">
        <a href="#" class="first-live-item-bb">
          <div class="first-live-info">
            <div class="first-live-title">BB视讯</div>
            <div class="first-live-description">
              <p>全球最佳视讯直播平台，真人荷官在线发牌，画面真实高清，给您亲临赌场的真实爽快感受！</p>
              <p class="first-live-game">包桌百家乐・经典百家乐・竟咪百家乐</p>
            </div>
            <button class="first-live-btn">进入游戏</button>
          </div>
          <img class="first-live-img" :src="getPath(`image/${themeColor}/btn_live01.png`)">
          <div class="first-live-bg"></div>
        </a>
        <a href="#" class="first-live-item" :style="{
          backgroundImage: `url(${getPath(`image/${themeColor}/btn_live02.png`)})`,
          '--first-live-line': 'rgb(2 172 99)'
          }">
          <button class="first-live-btn">Play</button>
          <div class="first-live-info">
            <div class="first-live-title">AG视讯</div>
            <div class="first-live-description">
              <p>实体赌场真人荷官现场发牌</p>
            </div>
          </div>
        </a>
        <a href="#" class="first-live-item" :style="{
          backgroundImage: `url(${getPath(`image/${themeColor}/btn_live03.png`)})`,
          '--first-live-line': 'rgb(245 180 67)'
          }">
          <button class="first-live-btn">Play</button>
          <div class="first-live-info">
            <div class="first-live-title">DB视讯</div>
            <div class="first-live-description">
              <p>网上体验亲临赌场的刺激</p>
            </div>
          </div>
        </a>
        <a href="#" class="first-live-item" :style="{
          backgroundImage: `url(${getPath(`image/${themeColor}/btn_live04.png`)})`,
          '--first-live-line': 'rgb(62 86 225)'
          }">
          <button class="first-live-btn">Play</button>
          <div class="first-live-info">
            <div class="first-live-title">MG视讯</div>
            <div class="first-live-description">
              <p>给你身临其境的真实感受</p>
            </div>
          </div>
        </a>
        <a href="#" class="first-live-item" :style="{
          backgroundImage: `url(${getPath(`image/${themeColor}/btn_live05.png`)})`,
          '--first-live-line': 'rgb(69 221 246)'
          }">
          <button class="first-live-btn">Play</button>
          <div class="first-live-info">
            <div class="first-live-title">BG视讯</div>
            <div class="first-live-description">
              <p>最美荷官在线互动</p>
            </div>
          </div>
        </a>
      </div>
    </section>
    <section class="first-section-wrap first-mob-wrap">
      <div class="section-wrap">
        <div class="first-mob-left-wrap">
          <div class="first-mob-title">
            体验极致 手机投注APP
          </div>
          <div class="first-mob-description">
            原生APP，便捷登录、操作简单、界面一目了然、游戏畅通无阻、丰富的游戏品类、24小时多平台无缝应用体验。指尖App无处不在，带您开启掌上精彩！
          </div>
          <div class="first-mob-download">
            <div class="first-mob-qrcode">
              <img :src="isLoggedIn
                ? getPath('image/not-use/qrcode.jpg')
                : getPath(`image/not-use/lang/${lang}/${imgQrcode}.png`)" class="first-mob-qrcode-img" />
              <p class="first-mob-qrcode-text">扫码下载App<br>iOS & Android</p>
            </div>
            <div class="first-mob-h5">
              <div class="first-mob-h5-icon"></div>
              <p class="first-mob-h5-text">无需下载，扫码直接访问<br><span class="first-mob-url">web.bbinpartner.com</span></p>
            </div>
          </div>
        </div>
        <div class="first-mob-right-wrap">
          <img class="first-mob-phone" :src="getPath(`image/${themeColor}/bg_mobile.png`)">
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import News from '@/components/common/News.vue';
import HotGame from '@/components/common/HotGame.vue';
import FloatImg from '@/components/common/FloatImg.vue';
import { useTheme } from '@/composables/useTheme.js';
import { useAuthStore } from '@/stores/authStore.js';
import { getPath } from '@/composables/usePath.js'

const { themeColor, lang, imgQrcode } = useTheme(); // 使用動態主題和語言設定
const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore); // 使用全域登入狀態

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const SwiperAutoplay = Autoplay;
const SwiperEffectCreative = EffectCreative;
const SwiperPagination = Pagination;

// 輪播圖資料
const slides = ref([
  { id: 1, image: 'event01.png' },
  { id: 2, image: 'event02.png' },
  { id: 3, image: 'event03.png' },
  { id: 4, image: 'event04.png' },
]);

// 控制 promotion hover 狀態
const promotionHover = ref(null);

// 控制首頁遊戲
const activeTab = ref('casino');
const firstGame = ref({
  casino: {
    label: 'Casino',
    game: [
      {"name": "糖果派對", "platform": "BB電子", "image": "first_game_casino01.png", "hot": true},
      {"name": "賞金女王", "platform": "PG電子", "image": "first_game_casino02.png", "hot": true},
      {"name": "聚寶消消樂", "platform": "BB電子", "image": "first_game_casino03.jpg", "hot": false},
      {"name": "麻將胡了", "platform": "PG電子", "image": "first_game_casino04.png", "hot": true},
      {"name": "發財神2", "platform": "CQ9電子", "image": "first_game_casino05.png", "hot": false},
      {"name": "阿斯加德之火", "platform": "MG電子", "image": "first_game_casino06.png", "hot": false},
      {"name": "糖果派對2", "platform": "BB電子", "image": "first_game_casino07.png", "hot": false},
      {"name": "冰球突破", "platform": "MG電子", "image": "first_game_casino08.png", "hot": false}
    ]
  },
  fishing: {
    label: 'Fishing',
    game: [
      { "name": "五龙捕鱼", "platform": "JDB电子", "image": "first_game_fishing01.png", "hot": true },
      { "name": "龙王捕鱼", "platform": "JDB电子", "image": "first_game_fishing02.png", "hot": true },
      { "name": "發財捕魚", "platform": "FC电子", "image": "first_game_fishing03.png", "hot": false },
      { "name": "寶船捕魚", "platform": "FC电子", "image": "first_game_fishing04.png", "hot": true },
      { "name": "财神捕鱼", "platform": "JDB电子", "image": "first_game_fishing05.png", "hot": false },
      { "name": "猎龙传说", "platform": "BB电子", "image": "first_game_fishing06.png", "hot": false },
      { "name": "捕鱼大师", "platform": "BB电子", "image": "first_game_fishing07.png", "hot": false },
      { "name": "魔鬼克星", "platform": "BB电子", "image": "first_game_fishing08.png", "hot": false }
    ]
  },
  card: {
    label: 'Card game',
    game: [
      { "name": "火箭鸟", "platform": "WG棋牌", "image": "first_game_card01.png", "hot": false },
      { "name": "财神发发发", "platform": "开元棋牌", "image": "first_game_card02.png", "hot": false },
      { "name": "21点百家乐", "platform": "BB棋牌", "image": "first_game_card03.png", "hot": false },
      { "name": "玛雅神殿", "platform": "WG棋牌", "image": "first_game_card04.png", "hot": false },
      { "name": "炸财神", "platform": "开元棋牌", "image": "first_game_card05.png", "hot": false },
      { "name": "红黑大战", "platform": "BB棋牌", "image": "first_game_card06.png", "hot": false },
      { "name": "捕鱼高手", "platform": "BB棋牌", "image": "first_game_card07.png", "hot": false },
      { "name": "抢庄牌九", "platform": "TP棋牌", "image": "first_game_card08.png", "hot": false }
    ]
  }
});
</script>
