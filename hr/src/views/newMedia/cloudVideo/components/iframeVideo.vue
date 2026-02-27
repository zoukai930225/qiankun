<template>
  <SWDialog v-model="dialogVisible" width="520px" title="视频">
    <div class="row-center video-container">
      <iframe style="width: 460px;height: 550px;border: none;" :src="frameUrl"></iframe>
    </div>
  </SWDialog>
</template>
<script lang="ts" setup>
const frameUrl = ref('')
const dialogVisible = ref(false);

const open = (url: string) => {
  dialogVisible.value = true
  frameUrl.value = url
  setTimeout(() => {
    // frameUrl.value = `https://market.m.taobao.com/app/tb-source-app/video-fullpage/pages/index?wx_navbar_hidden=true&source=publish&wh_weex=true&type=publish&id=456311758257`
  }, 200)
}
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
.video-container {
  width: 100%;
  height: 600px;
  justify-content: center;
}
</style>