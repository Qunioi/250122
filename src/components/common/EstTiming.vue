<template>
  <div class="est-timing">
    <span>美东时间 : </span>
    <span>{{ estTime }}</span>
  </div>
</template>

<script setup>
const estTime = ref('');
const updateEstTime = () => {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() * 60000;
  const estOffset = new Date(now.getTime() + utcOffset - (4 * 3600000)); // 默认夏令时 (EDT, UTC-4)

  const isStandardTime = now.getMonth() < 3 || (now.getMonth() > 10 || (now.getMonth() === 10 && now.getDate() < new Date(now.getFullYear(), 10, 1).getDay()));
  if (isStandardTime) {
    estOffset.setHours(estOffset.getHours() - 1); // 冬季时区 EST 为 UTC-5
  }

  const formattedEstTime = estOffset.toISOString().slice(0, 19).replace('T', ' ').replace(/-/g, '/');
  estTime.value = formattedEstTime;
};

onMounted(() => {
  updateEstTime();
  setInterval(updateEstTime, 1000);
});
</script>