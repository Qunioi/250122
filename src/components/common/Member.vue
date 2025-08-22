<template>
  <div class="member-wrap">
    <div class="login-wrap" v-if="!isLoggedIn">
      <form @submit.prevent="handleLogin">
        <div class="login-left">
          <label class="ele-login-unit ele-login-unit-account">
            <input
              id="js-username"
              title="请输入4-15个字元, 仅可输入英文字母以及数字的组合!!"
              name="username"
              type="text"
              maxlength="15"
              pattern="[a-zA-Z0-9]{4,15}"
              required="required"
              class="ele-login-input"
              v-model="username"
              @focus="handleFocus('username')"
              @blur="handleBlur('username')"
              @input="handleInput('username')"
            />
            <p class="ele-login-placeholder" :style="{ opacity: usernamePlaceholderOpacity }">账号</p>
            <span class="ele-acc-unicod">@bin</span>
          </label>
          <label class="ele-login-unit ele-login-unit-password">
            <input
              title="请填写 6-12 位大小写英数字"
              :type="passwordType"
              name="password"
              autocomplete="off"
              maxlength="12"
              pattern="[a-zA-Z0-9]{6,12}"
              required="required"
              class="ele-login-input"
              v-model="password"
              @focus="handleFocus('password')"
              @blur="handleBlur('password')"
              @input="handleInput('password')"
            />
            <p class="ele-login-placeholder" :style="{ opacity: passwordPlaceholderOpacity }">密码</p>
            <a href="#" class="ele-show-password black" @click.prevent="togglePasswordVisibility">
              <svg v-if="isPasswordVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457ZM14.7577 16.1718L13.2937 14.7078C12.902 14.8952 12.4634 15.0002 12.0003 15.0002C10.3434 15.0002 9.00026 13.657 9.00026 12.0002C9.00026 11.537 9.10522 11.0984 9.29263 10.7067L7.82866 9.24277C7.30514 10.0332 7.00026 10.9811 7.00026 12.0002C7.00026 14.7616 9.23884 17.0002 12.0003 17.0002C13.0193 17.0002 13.9672 16.6953 14.7577 16.1718ZM7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925L16.947 12.7327C16.9821 12.4936 17.0003 12.249 17.0003 12.0002C17.0003 9.23873 14.7617 7.00016 12.0003 7.00016C11.7514 7.00016 11.5068 7.01833 11.2677 7.05343L7.97446 3.76015Z"></path>
              </svg>
            </a>
            <a href="#" title="忘记?" class="ele-forget-pw">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                <path
                  d="M12.5-6A10.512,10.512,0,0,1,2-16.5,10.512,10.512,0,0,1,12.5-27,10.512,10.512,0,0,1,23-16.5,10.512,10.512,0,0,1,12.5-6Zm-1-7.015v1.633h1.685v-1.633Zm1.14-7.656h.085a1.6,1.6,0,0,1,1.684,1.531c.068.643-.4,1.313-1.378,1.99a2.74,2.74,0,0,0-1.327,2.4v.562h1.327v-.459a2.064,2.064,0,0,1,1.174-1.838c1.286-.812,1.9-1.757,1.837-2.807-.17-1.692-1.2-2.6-3.062-2.7q-.1,0-.207,0A3.484,3.484,0,0,0,9-18.985l1.48.357C10.777-19.983,11.5-20.671,12.64-20.671Z"
                  transform="translate(-2 27)"
                  fill="currentColor"
                />
              </svg>
            </a>
          </label>
          <button type="submit" class="ele-login-submit">登入</button>
          <router-link to="/join" class="ele-join-btn">注册</router-link>
        </div>
      </form>
    </div>
    <div class="meminfo-wrap" v-else-if="isLoggedIn">
      <div class="mem-info-wrap">
        <div class="ele-meminfo-wrap">
          <div class="ele-meminfo ele-meminfo-name">
            <span>账号：</span>
            <strong>{{ user?.fullUsername || 'admin' }}</strong>
          </div>
          <div class="ele-meminfo-unit">
            <div class="ele-meminfo ele-meminfo-balance">
              <span>BBIN余额：</span>
              <strong>168.08</strong>
            </div>
            <div class="ele-accinfo ele-other-balance" @mouseenter="showBalance = true" @mouseleave="showBalance = false">
              <svg role="presentation" width="14" height="16" viewBox="0 0 448 512" class="ele-other-balance-icon fa-icon" fill="currentColor">
                <path d="M400 32H48C21.5 32 0 53.5 0 80V432C0 458.5 21.5 480 48 480H400C426.5 480 448 458.5 448 432V80C448 53.5 426.5 32 400 32zM368 284C368 290.6 362.6 296 356 296H264V388C264 394.6 258.6 400 252 400H196C189.4 400 184 394.6 184 388V296H92C85.4 296 80 290.6 80 284V228C80 221.4 85.4 216 92 216H184V124C184 117.4 189.4 112 196 112H252C258.6 112 264 117.4 264 124V216H356C362.6 216 368 221.4 368 228V284z"></path>
              </svg>
            </div>
            <transition name="fade">
              <div v-show="showBalance" @mouseenter="showBalance = true" @mouseleave="showBalance = false" class="ele-balance-wrap">
                <div class="ele-balance-item">
                  <div class="ele-balance">
                    <span>AG视讯余额：</span>
                    <strong>--</strong>
                  </div>
                  <div class="ele-balance">
                    <span>欧博视讯余额：</span>
                    <strong>68.00</strong>
                  </div>
                  <div class="ele-balance">
                    <span>BG视讯余额：</span>
                    <strong>100.00</strong>
                  </div>
                </div>
                <div class="ele-balance-tool">
                  <a href="#" class="ele-balance-btn">额度转换</a>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="meminfo-link-wrap">
        <div class="ele-meminfo-link-wrap">
          <ul>
            <template v-for="(link, index) in filteredLinks" :key="index">
              <li class="ele-meminfo-link">
                <a :href="link.link">{{ link.title }}</a>
              </li>
              <span v-if="showSeparator && index < filteredLinks.length" class="ele-meminfo-link-line">
                {{ separatorContent }}
              </span>
            </template>
            <li class="ele-meminfo-link">
              <button type="button" class="ele-logout-btn" @click="handleLogout">登出</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';

const dataStore = useDataStore();
const authStore = useAuthStore();
const route = useRoute();

// 使用 authStore 的登入狀態
const { isLoggedIn, user } = storeToRefs(authStore);

// 根據當前路由判斷 navClass，然後顯示對應的 meminfoLinks
const filteredLinks = computed(() => {
  // 從 headerNav 中找到當前路由對應的 navClass
  const currentNav = dataStore.headerNav.find(nav => nav.link === route.path);
  const navClass = currentNav?.navClass || 'else';

  // 根據 navClass 取得對應的 meminfoLinks，如果沒有則使用 'else'
  return dataStore.meminfoLinks[navClass] || dataStore.meminfoLinks['else'] || [];
});

// 🔸 控制登入後會員連結分隔符號
const props = defineProps({
  showSeparator: {
    type: Boolean,
    default: true
  },
  separatorContent: {
    type: String,
    default: '|'
  }
});


// 登入欄位點擊後透明度效果
const username = ref('');
const password = ref('');
const isPasswordVisible = ref(false);

const usernamePlaceholderOpacity = ref(1);
const passwordPlaceholderOpacity = ref(1);

const handleFocus = (field) => {
  if (field === 'username' && username.value.trim() === '') {
    usernamePlaceholderOpacity.value = 0.5;
  }
  if (field === 'password' && password.value.trim() === '') {
    passwordPlaceholderOpacity.value = 0.5;
  }
};

const handleBlur = (field) => {
  if (field === 'username') {
    usernamePlaceholderOpacity.value = username.value.trim() === '' ? 1 : 0;
  }
  if (field === 'password') {
    passwordPlaceholderOpacity.value = password.value.trim() === '' ? 1 : 0;
  }
};

const handleInput = (field) => {
  if (field === 'username') {
    usernamePlaceholderOpacity.value = username.value.trim() !== '' ? 0 : 0.5;
  }
  if (field === 'password') {
    passwordPlaceholderOpacity.value = password.value.trim() !== '' ? 0 : 0.5;
  }
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const passwordType = computed(() => (isPasswordVisible.value ? 'text' : 'password'));

// 登入處理函數
const handleLogin = () => {
  if (!username.value.trim() || !password.value.trim()) {
    alert('請輸入帳號和密碼');
    return;
  }

  const success = authStore.login({
    username: username.value.trim(),
    password: password.value.trim()
  });

  if (success) {
    // 登入成功後清除表單
    username.value = '';
    password.value = '';
    usernamePlaceholderOpacity.value = 1;
    passwordPlaceholderOpacity.value = 1;
    isPasswordVisible.value = false;

    console.log('登入成功:', authStore.user?.username);
  } else {
    alert('請輸入有效的帳號和密碼');
  }
};

// 登出處理函數
const handleLogout = () => {
  authStore.logout();

  // 重置表單狀態
  username.value = '';
  password.value = '';
  usernamePlaceholderOpacity.value = 1;
  passwordPlaceholderOpacity.value = 1;
  isPasswordVisible.value = false;

  console.log('已登出');
};

// 控制餘額顯示
const showBalance = ref(false);
</script>
