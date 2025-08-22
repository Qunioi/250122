<template>
  <div class="page-body">
    <div class="page-sidebar">
      <div class="sidemenu-body">
        <ul class="sidemenu">
          <li v-for="(link, index) in footerLinks" :key="index" class="ele-article-link" :class="{ active: index === 2 }">
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
          <div class="Union">
            <ul class="mtab-menual">
              <li class="mtab">联盟方案</li>
              <li>联盟协议</li>
              <li>代理合作</li>
              <li>代理注册</li>
            </ul>
          </div>
          <div class="case-article-content">
            <p>与bb-in公司技术合作，为哥斯特黎加合法注册之博采公司。拥有多元化的产品，使用最公平、公正、公开的系统，在市场上的众多博采网站中，我们自豪的提供会员最优惠的回馈，给予合作伙伴最优势的营利回报! 无论您拥有的是网路资源，或是人脉资源，都欢迎您来加入金沙集团合作伙伴的行列，无需负担任何费用，就可以开始无上线的收入。金沙集团，绝对是您最聪明的选择!</p>
            <p>代理申请<br>请点击[代理注册]在线提出申请，并确实填写各项资料。集团会评估审核联盟申请讯息，3日内由专员与您联系开通，并提供您的注册帐号、密码及推广链接。</p>
            佣金计算<br>
            <ol>
              <li>视讯、BB体育、电子游艺项目，以报表中【派彩】字段，扣除相应费用,依照上表门槛 X 佣金百分比。</li>
              <li>彩票项目以报表中【有效投注】字段X 0.1%佣金百分比，并扣除相应费用</li>
              <li>相应费用包括：会员各项优惠、存/取款相应费用</li>
              <li>【当月最低有效会员】定义为，在月结期间内进行过最少1000元或以上有效投注的会员，如代理当月未达【当月最低有效会员】最低门槛2人，将按照保底收益进行计算，该月两个条件未达者，无法领取佣金回馈</li>
              <li>联盟体系当月亏损达到标准，而【当月最低有效会员】人数未达相应最低门槛，则该月佣金比例依照【当月最低有效会员】人数所达门槛相应的百分比进行退佣。</li>
            </ol>
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