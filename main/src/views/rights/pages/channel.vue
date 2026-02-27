<template>
  <div id="channel">
    <main-table
      :table-data="tableData"
      :options="tableOptions"
      :show-over-flow-tooltip="{ placement: 'right' }"
      :loading="loading"
    >
      <template #channelCode="{ row, col }">
        <div class="channel">
          <div class="center">
            <img class="logo" :src="getImageUrl(row.channelCode)" alt="" />
          </div>
          <span class="ml16px">{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, col) }}</span>
        </div>
      </template>
      <template #director="{ row }">
        <div v-if="row.directorVos">
          <div class="directors" v-for="(item, index) in row.directorVos" :key="index">
            <img class="avatar" :src="item.directorAvatar" alt="" />
            <span class="director">{{ item.directorName }}</span>
          </div>
        </div>
      </template>
      <template #directorTimes="{ row }">
        <div class="times">
          <p class="time" v-for="(item, index) in transformTime(row.directorVos)" :key="index">{{
            item
          }}</p>
        </div>
      </template>
      <template #setting="{ col }">
        <el-button link type="primary" @click="onSet(col)">设置</el-button>
      </template>
    </main-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </div>
</template>
<script lang="ts" setup>
import { getChannelList } from '@/api/rights'
import MainTable from '../components/table.vue'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { getImageUrl } from '@/utils'

const props = withDefaults(
  defineProps<{
    validFlag: 0 | 1
    code: string
  }>(),
  {}
)

const emit = defineEmits(['update:code', 'set'])

const total = ref(0)
const loading = ref(false)
const tableOptions = ref<RightsManage.TableOption>([
  {
    label: '渠道',
    prop: 'channelCode',
    fixed: 'left'
  },
  {
    label: '当前负责人',
    slotName: 'director'
  },
  {
    label: '当前责权时间',
    slotName: 'directorTimes'
  },
  {
    label: '设置',
    prop: 'channelCode',
    slotName: 'setting',
    fixed: 'right'
  }
])
const tableData = ref<RightsManage.ChannelListItem[]>([])
const queryParams = ref<RightsManage.GetChannelsParams>({
  page: 1,
  size: 10,
  validFlag: 1
})

watch(
  () => props.validFlag,
  (val) => (queryParams.value.validFlag = val)
)

function transformTime(col: RightsManage.DirectorVos[]) {
  return (
    col?.map(
      (item) =>
        `${formatDate(new Date(item.startTime), 'YYYY/MM/DD')}-${item.endTime ? formatDate(new Date(item.endTime), 'YYYY/MM/DD') : '未来'}`
    ) || []
  )
}

async function getList() {
  loading.value = true
  try {
    const res = await getChannelList(queryParams.value)
    total.value = res.total
    tableData.value = res.records
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function onSet(col: string) {
  emit('update:code', col)
  emit('set', '')
}

defineExpose({ getList })

onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
p {
  margin: 0;
}
.channel {
  display: flex;
  align-items: center;
}
</style>
