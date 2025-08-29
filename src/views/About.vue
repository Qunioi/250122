<template>
  <div class="page-body">
    <div class="page-sidebar">
      <div class="sidemenu-body">
        <ul class="sidemenu">
          <li v-for="(link, index) in footerLinks" :key="index" class="ele-article-link" :class="{ active: index === 0 }">
            <router-link :to="link.link">
              <span>{{ link.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-right">
      <div class="article-wrap">
        <div id="articles">
          <div class="case-article-content">
            <p>与BBIN进行技术合作，共同打造高品质游戏平台，目前拥有菲律宾合法注册之博彩公司。我们一切博彩营业行为皆遵从菲律宾政府博彩条约。我们在越来越热络的网博彩市场中，不断地求新求变，寻找最新的创意，秉持最好的服务。以带给客户高品质的服务、产品、娱乐，是我们的企业永恒宗旨。</p>
            <p>我们的运动博彩拥有顶级的盘房操盘，投入大量的人力以及资源，提高完整赛事，丰富玩法给热爱体育的玩家。真人视讯游戏拥有经国际赌场专业训练的荷官，进行各种赌场游戏，所有赌局都依荷官动作，而不是预设的电脑机率结果，以高科技的网路直播技术，带给玩家身历赌场的刺激经验! 各式彩票游戏，是依官方赛果产生游戏结果，让玩家在活泼的投注界面，享受最公正的娱乐。而我们的电子游戏使用最公平的随机数产生机率，让玩家安心​​享受多元的娱乐性游戏。 </p>
            <p>BBIN所有的游戏皆有共同的优点:无须下载、介面操作简易、功能齐全、画面精致、游戏秉持公平、公正、公开 !在市场上众多的博彩网站中，玩家选择BBIN，除了多元化的产品，也是因为BBIN-波音公司良好的信誉，以及高品质的服务，我们的用心随处可见，并获得GEOTRUST国际认证，确保网站公平公正性，所有会员资料均经过加密，保障玩家隐私。 BBIN以服务会员不打烊的精神，24小时处理会员出入款相关事宜，令我们骄傲的客服团队，亲切又专业，解决玩家对于网站、游戏的种种疑难杂症，让每位玩家有宾至如归的感觉!我们自豪的以业界最强的各种优惠方式回馈我们的会员，BBIN绝对是玩家最明智的选择!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/dataStore.js';
const dataStore = useDataStore();
const footerLinks = dataStore.footerLinks;
</script>