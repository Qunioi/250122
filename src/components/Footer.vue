<template>
  <footer class="page-footer">
    <div class="footer-top-wrap">
      <div class="top-logo-wrap">
        <div class="footer-top-title">游戏提供商</div>
        <img class="footer-logo-bb" :src="`/image/not-use/${themeFooterLogo.bb}.png`" width="96px">
        <a class="footer-logo-ub" href="#"><img :src="`/image/not-use/ublogo/${themeFooterLogo.ub}.png`" width="162px"></a>
        <img src="/image/footer_img1.png">
      </div>
      <div class="top-pay-wrap">
        <div class="footer-top-title">支付渠道</div>
        <img src="/image/footer_img2.png">
      </div>
    </div>
    <div class="footer-middle-wrap">
      <div class="footer-middle-title">博彩牌照认证</div>
      <img class="footer-middle-img" :src="`/image/${themeColor}/footer_img3.png`">
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
import { useTheme } from '@/composables/useTheme.js';

const { themeColor } = useTheme();
const configStore = useConfigStore();
const { themeFooterLogo } = storeToRefs(configStore);
</script>
