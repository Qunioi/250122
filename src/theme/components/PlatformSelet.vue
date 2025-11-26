<template>
  <div class="themeManager-platform-wrap">
    <label>
      <input type="radio" name="logoUpload" value="live">
      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>视讯</span>
    </label>
    <label>
      <input type="radio" name="logoUpload" value="casino" checked>
      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>机率</span>
    </label>
    <label>
      <input type="radio" name="logoUpload" value="sport" disabled>
      <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>体育</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.themeManager-platform-wrap {
  display: flex;
  gap: 4px;
  border-radius: 4px;
  label {
    cursor: pointer;
    flex: 1 0 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 26px;
    font-size: 12px;
    line-height: 1;
    background-color: var(--cp-color-third);
    border-radius: 4px;
    position: relative;
    transition: background-color .3s, color .3s;
    span {
      padding-left: 0;
      transition: padding-left .3s;
    }
    svg {
      width: 14px;
      position: absolute;
      top: 5px;
      left: 14px;
      transition: opacity .3s;
      opacity: 0;
    }
    input[type="radio"] {
      display: none;
    }
    &:has(input[type="radio"]:checked) {
      color: rgb(255 255 255);
      background-color: var(--cp-color-primary);
      span {
        padding-left: 12px;
      }
      svg {
        opacity: 1;
      }
    }
    &:has(input[type="radio"]:disabled) {
      color: var(--cp-text-secondary);
    }
    &:hover {
      color: rgb(255 255 255);
      background-color: var(--cp-color-secondary);
      &:has(input[type="radio"]:disabled) {
        background-color: var(--cp-color-third);
      }
    }
  }
}
</style>