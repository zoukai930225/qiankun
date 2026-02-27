<template>
  <div id="channel">
    <div class="filter">
      <el-form :model="queryParams" ref="queryRef">
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item prop="storeCode" label="店铺">
              <StoreCascader v-model="queryParams.storeCode" @change="handleQuery" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="hasDirector" label="是否有责任人">
              <el-select
                v-model="queryParams.hasDirector"
                placeholder="请选择"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in hasDirectorOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :push="11" :span="5">
            <el-form-item>
              <el-button @click="handleQuery" class="commonSearchBtn mlauto">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main-table
      :table-data="tableData"
      :options="tableOptions"
      :show-over-flow-tooltip="{ placement: 'right' }"
      :loading="loading"
    >
      <template #storeName="{ row }">
        <div class="store">
          <div class="w20px h20px center">
            <img class="logo" :src="getImageUrl(row.channelCode)" alt="" />
          </div>
          <span class="ml16px">{{ row.storeName }}</span>
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
        <p class="time" v-for="(item, index) in transformTime(row.directorVos)" :key="index">{{
          item
        }}</p>
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
import { getStoreList } from '@/api/rights'
import MainTable from '../components/table.vue'
import { formatDate } from '@/utils/formatTime'
import { hasDirectorOptions } from '../options'
import { getImageUrl } from '@/utils'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import StoreCascader from '../components/storeCascader.vue'

const props = withDefaults(
  defineProps<{
    validFlag: 0 | 1
    code: string
  }>(),
  {}
)

const emit = defineEmits(['update:code', 'set'])

const total = ref(0)
const tableOptions = ref<RightsManage.TableOption>([
  {
    label: '店铺',
    prop: 'storeName',
    fixed: 'left'
  },
  {
    label: '渠道',
    prop: 'channelCode',
    transform: (col) => getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, col)
  },
  {
    label: '当前负责人',
    slotName: 'director'
  },
  {
    label: '当前责权时间',
    prop: 'directorVos',
    slotName: 'directorTimes'
  },
  {
    label: '设置',
    prop: 'storeCode',
    slotName: 'setting',
    fixed: 'right'
  }
])
const tableData = ref<RightsManage.StoreListItem[]>([])
const loading = ref(false)
const queryParams = ref<RightsManage.GetStoreListParams>({
  page: 1,
  size: 10,
  validFlag: 1
})
const queryRef = ref()

watch(
  () => props.validFlag,
  (val) => (queryParams.value.validFlag = val)
)

function handleQuery() {
  queryParams.value.page = 1
  getList()
}

function resetQuery() {
  queryRef.value.resetFields()
  getList()
}

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
    const res = await getStoreList(queryParams.value)
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

.store {
  display: flex;
  align-items: center;
}
</style>
