<template>
  <div class="first-hotgame-warp">
    <div class="first-hotgame-title">
      热门游戏<span>Hot Games</span>
    </div>
    <div class="first-hotgame-warp">
      <Swiper
        :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
        :pagination="true"
        :slides-per-view="1"
        :autoplay="{
          delay: 8000,
          disableOnInteraction: true,
        }"
      >
        <SwiperSlide>
          <div class="first-hotgame-item-warp">
            <div
              class="first-hotgame-item"
              v-for="(game, index) in hotGames.slice(0, 5)"
              :key="index"
            >
              <div class="first-hotgame-rank">
                <img
                  :src="getPath(`/image/ic_crown0${index + 1}.png`)"
                  :title="`top${index + 1}`"
                  v-if="index + 1 <= 3"
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="first-hotgame-icon">
                <img
                  :src="getPath(`/image/hotgame_icon${String(index + 1).padStart(2, '0')}.png`)"
                />
              </div>
              <div class="first-hotgame-name">
                <div class="first-hotgame-name-top">{{ game.nameTop }}</div>
                <div class="first-hotgame-name-bottom">{{ game.nameBottom }}</div>
              </div>
              <div class="first-hotgame-number">
                <span>{{ game.number }}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div class="first-hotgame-item-warp">
            <div
              class="first-hotgame-item"
              v-for="(game, index) in hotGames.slice(5, 10)"
              :key="index + 5"
            >
              <div class="first-hotgame-rank">
                <img
                  :src="getPath(`/image/ic_crown0${index + 6}.png`)"
                  :title="`top${index + 6}`"
                  v-if="index + 6 <= 3"
                />
                <span v-else>{{ index + 6 }}</span>
              </div>
              <div class="first-hotgame-icon">
                <img
                  :src="getPath(`/image/hotgame_icon${String(index + 6).padStart(2, '0')}.png`)"
                />
              </div>
              <div class="first-hotgame-name">
                <div class="first-hotgame-name-top">{{ game.nameTop }}</div>
                <div class="first-hotgame-name-bottom">{{ game.nameBottom }}</div>
              </div>
              <div class="first-hotgame-number">
                <span>{{ game.number }}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup>
import { getPath } from '@/composables/usePath.js'
import { useTheme } from '@/composables/useTheme.js';
const { themeColor } = useTheme();

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const SwiperAutoplay = Autoplay;
const SwiperEffectCreative = EffectCreative;
const SwiperPagination = Pagination;

const hotGames = ref([
  { "nameTop": "真人百家樂", "nameBottom": "Live Casino", "number": "243,062" },
  { "nameTop": "麻將胡了", "nameBottom": "Casino", "number": "158,772" },
  { "nameTop": "糖果派對", "nameBottom": "Casino", "number": "128,772" },
  { "nameTop": "六合彩", "nameBottom": "Lottery", "number": "98,772" },
  { "nameTop": "捕魚遊戲", "nameBottom": "Fish Game", "number": "56,772" },
  { "nameTop": "牛牛", "nameBottom": "Card game", "number": "43,062" },
  { "nameTop": "英雄联盟", "nameBottom": "E-sports", "number": "28,772" },
  { "nameTop": "足球联赛", "nameBottom": "Sports", "number": "18,772" },
  { "nameTop": "3D彩", "nameBottom": "Lottery", "number": "9,772" },
  { "nameTop": "连环夺宝", "nameBottom": "Casino", "number": "6,772" }
]);
</script>