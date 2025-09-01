export default {
  mounted(el) {
    // 建包裹
    const wrap = document.createElement('div');
    wrap.className = 'header-fixed-wrap';

    const container = document.createElement('div');
    container.className = 'ele-fixed-container';

    const inner = document.createElement('div');
    inner.className = 'ele-fixed-inner';
    inner.style.willChange = 'transform';

    wrap.appendChild(container);
    container.appendChild(inner);

    // 原地包住
    el.parentNode.insertBefore(wrap, el);
    inner.appendChild(el);

    el.__headerFixed = {
      container, inner,
      isFixed: false, ticking: false,
    };

    // 只同步高度（寬度交給 CSS 變數）
    const syncHeight = () => {
      const h = el.offsetHeight || el.getBoundingClientRect().height || 0;
      container.style.height = h + 'px';
    };

    const applyTranslateX = () => {
      if (!el.__headerFixed.isFixed) {
        inner.style.transform = '';
        return;
      }
      const scrollX = window.scrollX || window.pageXOffset || 0;
      inner.style.transform = `translate(${-Math.round(scrollX)}px, 0)`;
    };

    const setFixed = (on) => {
      const state = el.__headerFixed;
      if (on) {
        if (state.isFixed) return;
        inner.classList.add('fixed');   // 你的 CSS 會處理 position/top/left/right/z-index/background
        state.isFixed = true;
        applyTranslateX();
      } else {
        if (!state.isFixed) return;
        inner.classList.remove('fixed');
        inner.style.transform = '';
        state.isFixed = false;
      }
    };

    const check = () => {
      if (window.scrollY >= 1) {
        setFixed(true);
        syncHeight();           // 滾動後仍同步高度，避免內容變動造成跳動
      } else {
        setFixed(false);
        container.style.height = '';
      }
      applyTranslateX();
    };

    const onScroll = () => {
      const st = el.__headerFixed;
      if (st.ticking) return;
      st.ticking = true;
      requestAnimationFrame(() => {
        st.ticking = false;
        check();
      });
    };

    const onResize = () => {
      // 只在需要時同步高度；寬度不再重算
      if (el.__headerFixed.isFixed || window.scrollY >= 1) syncHeight();
      applyTranslateX();
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    el.__headerFixed.resizeObserver = ro;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // 初始狀態
    check();

    el.__headerFixed._refs = { onScroll, onResize };
  },

  unmounted(el) {
    const state = el.__headerFixed;
    if (!state) return;

    const { onScroll, onResize } = state._refs || {};
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (state.resizeObserver) state.resizeObserver.disconnect();

    // 還原 DOM
    const inner = state.inner;
    if (inner && inner.firstChild) {
      const originalEl = inner.firstChild;
      state.container.parentNode.parentNode.insertBefore(originalEl, state.container.parentNode);
    }
    state.container.parentNode.parentNode.removeChild(state.container.parentNode);

    delete el.__headerFixed;
  }
};
