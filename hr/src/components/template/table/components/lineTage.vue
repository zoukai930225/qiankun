<template>
  <div style="display: inline-flex;">
    <el-tag v-if="txt" effect="light" :color="background" round>
      <span :style="{ color: color }">{{ txt }}</span>
    </el-tag>
    <span v-else>-</span>
  </div>
</template>

<script lang="ts">
export default { name: 'LineTages' };
</script>


<script lang="ts" setup>
const emit = defineEmits(['delItem']);

const props = defineProps({
  txt: { type: String, default: '' },
  color: { type: String, default: '#0064ff' },
  background: { type: String, default: '' },
});

</script>

<style scoped lang="scss">
:deep() {
  .el-tag {
    border: none !important;
    padding: 4px 16px;
  }
}
</style>
