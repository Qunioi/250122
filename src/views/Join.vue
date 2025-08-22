<template>
  <div class="page-body">
    <div class="page-sidebar">
      <div class="sidemenu-body">
        <ul class="sidemenu">
          <li v-for="(link, index) in footerLinks" :key="index" class="ele-article-link">
            <router-link :to="link.link">
              <span>{{ link.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="page-right">
      <div class="ele-join-section">
        <div class="page-join-inner">
          <div id="ele-join-member-wrap" class="ele-join-member-wrap">
            <div id="join-container" class="join-container">
              <div class="join-header-title page-title">
                BBIN 欢迎您！
              </div>
              <div class="join-header-content">
                <div id="joinmem"></div>
              </div>
              <div class="join-form">
                <h2 class="info-title">注册账号</h2>
                <div class="field">
                  <span class="star is-required"> ★ </span>
                  <div class="base-input">
                    <input type="text" name="UserName" placeholder="账号" maxlength="12">
                    <span class="text-unicode">@bin</span>
                    <a class="icon icon-unicode">
                      <i></i>
                    </a>
                    <div class="icon"></div>
                  </div>
                </div>
                <div class="field">
                  <span class="star is-required"> ★ </span>
                  <div class="base-input password-input">
                    <input type="password" name="Password" placeholder="密码" maxlength="12" data-gtm-form-interact-field-id="1">
                    <a class="noEye" title="显示密码"><i></i></a>
                  </div>
                </div>
                <div class="field">
                  <span class="star is-required"> ★ </span>
                  <div class="base-input password-input">
                    <input type="password" name="Password" placeholder="确认密码" maxlength="12" data-gtm-form-interact-field-id="1">
                    <a class="noEye" title="显示密码"><i></i></a>
                  </div>
                </div>
                <div class="separate-line"></div>
                <div class="wallet-wrap">
                  <div class="wallet-title-wrap">
                    <div class="wallet-title-bg">
                      <span class="wallet-title-content">第三方連動註冊</span>
                    </div>
                    <div class="wallet-subtitle">
                      連動註冊即綁定，享受多元錢包服務
                    </div>
                  </div>
                  <div class="wallet-radio-wrap">
                    <div class="wallet-radio-item active">
                      <div class="wallet-bank-icon"></div>
                      <div class="wallet-bank-label-wrap">
                        <span class="wallet-bank-label">不连动</span>
                      </div>
                    </div>
                    <div class="wallet-radio-item">
                      <div class="wallet-bank-icon cg"></div>
                      <div class="wallet-bank-label-wrap">
                        <span class="wallet-bank-label">CG Pay</span>
                      </div>
                    </div>
                    <div class="wallet-radio-item">
                      <div class="wallet-bank-icon os"></div>
                      <div class="wallet-bank-label-wrap">
                        <span class="wallet-bank-label">OS Pay</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 class="info-title">会员资料</h2>
                <div class="field">
                  <span class="star is-required"> ★ </span>
                  <div class="base-input">
                    <input type="text" name="RealName" placeholder="真实姓名" maxlength="30">
                    <div class="icon"></div>
                  </div>
                </div>
                <div class="separate-line"></div>
                <h2 class="info-title">安全检查</h2>
                <div class="field">
                  <span class="star is-required"> ★ </span>
                  <div class="base-input">
                    <input type="text" name="RmNum" placeholder="验证码" maxlength="6">
                  </div>
                  <div class="captcha-msg-wrap">
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="redo-alt" role="img" viewBox="0 0 512 512" class="svg-inline--fa fa-redo-alt fa-w-16 fa-2x refresh-icon"><path fill="currentColor" d="M483.515 28.485L431.35 80.65C386.475 35.767 324.485 8 256.001 8 119.34 8 7.9 119.525 8 256.185 8.1 393.067 119.095 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.353-12.561.482-17.433l-19.738-19.738c-4.498-4.498-11.753-4.785-16.501-.552C351.787 433.246 306.105 452 256 452c-108.321 0-196-87.662-196-196 0-108.321 87.662-196 196-196 54.163 0 103.157 21.923 138.614 57.386l-54.128 54.129c-7.56 7.56-2.206 20.485 8.485 20.485H492c6.627 0 12-5.373 12-12V36.971c0-10.691-12.926-16.045-20.485-8.486z"></path></svg>
                    <span class="captcha-msg">点击上图更新验证码显示</span>
                  </div>
                </div>
                <div class="separate-line"></div>
                <div class="join-form-agree">
                  <input type="checkbox" id="agree" class="agree" name="agree" checked>
                  <label for="agree">我已届满合法博彩年龄，且同意各项开户条约。</label>
                  <a>开户协议</a>
                </div>
                <button type="submit" class="join-form-btn submit-btn">确认送出</button>
              </div>
              <div class="join-footer-content">
                <div id="joinmem">
                  <p>1. 标记有 * 者为必填项目。<br>
                    2. 手机与取款密码为取款金额时的凭证，请会员务必填写详细资料。<br>
                    3. 若公司有其它活动会 E-MAIL 通知，请客户填写清楚。</p>
                </div>
              </div>
            </div>
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