<template>
  <footer class="page-footer">
    <div class="footer-top-wrap">
      <div class="top-logo-wrap">
        <div class="footer-top-title">游戏提供商</div>
        <img class="footer-logo-bb" :src="getPath(`image/not-use/${themeFooterLogo.bb}.png`)" width="96" />
        <a class="footer-logo-ub" href="#">
          <img :src="getPath(`image/not-use/ublogo/${themeFooterLogo.ub}.png`)" width="162" />
        </a>
        <img :src="getPath(`image/${themeColor}/footer_img01.png`)" >
      </div>
      <div class="top-pay-wrap">
        <div class="footer-top-title">支付渠道</div>
        <img :src="getPath(`image/${themeColor}/footer_img02.png`)" >
      </div>
    </div>
    <div class="footer-middle-wrap">
      <div class="footer-middle-title">博彩牌照认证</div>
      <img class="footer-middle-img" :src="getPath(`image/${themeColor}/footer_img03.png`)" >
      <div class="footer-middle-text">
        我们在越来越热的网络博彩市场中，不断地求新求变，寻找最新的创意，秉持最好的服务。以带给客户高品质的服务、产品、娱乐，是我们的企业永恒宗旨。
      </div>
    </div>
    <div class="footer-bottom-wrap">
      <div class="footer-bottom-copyright">Copyright © BBIN Reserved</div>
      <FooterLink />
    </div>
  </footer>
</template>

<script setup>
import FooterLink from '@/components/common/FooterLink.vue';
import { useConfigStore } from '@/stores/configStore.js';
import { getPath } from '@/composables/usePath.js'

const configStore = useConfigStore()
const { themeColor, themeFooterLogo } = storeToRefs(configStore)
</script>
