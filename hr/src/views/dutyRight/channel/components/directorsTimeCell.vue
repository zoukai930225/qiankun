<template>
  <div class="row-center">
    <template v-if="directorVos?.length === 0">-</template>
    <template v-else>
      <template v-for="(item, index) in directorVos">
        <el-tooltip placement="top">
          <template #content>
            <line-avatar :user="item" :image="image" name="directorFull" :size="size" />
          </template>
          <line-avatar :user="item" :image="image" :name="name" :size="size" v-if="index < maxNums" class="mr15px"
            :class="[{ 'color-grey': !item.status }]" />
        </el-tooltip>
      </template>
      <el-tooltip placement="right" v-if="directorVos.length > maxNums" popper-style="max-height:300px;overflow-y:auto">
        <template #content>
          <template v-for="(item, index) in directorVos">
            <line-avatar :user="item" :image="image" name="directorFull" :size="size" v-if="index >= maxNums"
              class="mb5px mt5px" />
          </template>
        </template>
        <el-tag type="info" round>{{ getOtherTagNums }}</el-tag>
      </el-tooltip>
    </template>
  </div>
</template>
<script lang="ts" setup>
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import dayjs from 'dayjs';
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
  size: { type: Number, default: 20 }
})

const directorVos = ref<any[]>([])

const name = ref('directorTime')
const getOtherTagNums = computed(() => props.row?.directorVos?.length - props.maxNums)
const getName = (item: any) => {
  const time: string[] = [];
  if (item.startTime && dayjs(item.startTime).isValid()) {
    time.push(dayjs(item.startTime).format('YYYY/MM/DD'));
  } else {
    time.push('-')
  }
  if (item.endTime && dayjs(item.endTime).isValid()) {
    time.push(dayjs(item.endTime).format('YYYY/MM/DD'));
  } else {
    time.push('未来')
  }
  return time.join('-')
}

watch(() => props.row, (val) => {
  if (val.directorVos && Array.isArray(val.directorVos)) {
    const attr: any[] = [];
    val.directorVos.map((item: any) => {
      const obj = { ...item, directorTime: getName(item), directorFull: item.directorName + '：' + getName(item) + (item.status ? '' : '（已失效）') }
      attr.push(obj)
    })
    directorVos.value = attr
  } else {
    directorVos.value = []
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
.color-grey {
  color: #999;
}
</style>