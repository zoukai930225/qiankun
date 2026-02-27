<template>
  <div class="row-center">
    <template v-if="directorVos?.length === 0">-</template>
    <template v-else>
      <template v-for="(item, index) in directorVos">
        <line-avatar :user="item" :image="image" :name="name" :size="size" v-if="index < maxNums" class="mr15px"
          :class="[{ 'color-grey': !item.status }]" />
      </template>
      <el-tooltip placement="right" v-if="directorVos.length > maxNums" popper-style="max-height:300px;overflow-y:auto">
        <template #content>
          <template v-for="(item, index) in directorVos">
            <line-avatar :user="item" :image="image" name="directorFull" :size="size" v-if="index >= maxNums"
              class="mt5px mb5px" />
          </template>
        </template>
        <el-tag type="info" round>{{ getOtherTagNums }}</el-tag>
      </el-tooltip>
    </template>
  </div>
</template>
<script lang="ts" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
const props = defineProps({
  row: {
    type: Object,
    required: true
  },
  maxNums: {
    type: Number,
    default: 3
  },
  image: { type: String, default: 'directorAvatar' },
  name: { type: String, default: 'directorName' },
  size: { type: Number, default: 20 }
})
const directorVos = ref<any[]>([])
const getOtherTagNums = computed(() => directorVos.value?.length - props.maxNums)

watch(() => props.row, (val) => {
  if (val.directorVos && Array.isArray(val.directorVos)) {
    const attr: any[] = [];
    val.directorVos.map((item: any) => {
      const obj = { ...item, directorFull: item.directorName + (item.status ? '' : '（已失效）') }
      attr.push(obj)
    })
    directorVos.value = attr
  } else {
    directorVos.value = []
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.el-check-tag {
  border-radius: 50px;
}

.color-grey {
  color: #999;
}
</style>