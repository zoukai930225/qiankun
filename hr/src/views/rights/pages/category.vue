<template>
  <div id="channel">
    <div class="filter">
      <el-form :model="queryParams" ref="queryRef" :rules="rules">
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item prop="store" label="店铺">
              <StoreCascader v-model="queryParams.store" @change="handleQuery" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="categoryName" label="类目">
              <CategoryCascader v-model="queryParams.categoryName" @change="handleQuery" />
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
          <el-col :span="7">
            <el-row :gutter="12">
              <el-col :span="13">
                <el-form-item prop="startTime" label="责权时间">
                  <el-date-picker
                    v-model="queryParams.startTime"
                    clearable
                    type="date"
                    placeholder="开始时间"
                    value-format="YYYY/MM/DD"
                    format="YYYY/MM/DD"
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="endTime" label="-">
                  <el-date-picker
                    v-model="queryParams.endTime"
                    clearable
                    type="date"
                    value-format="YYYY/MM/DD"
                    format="YYYY/MM/DD"
                    placeholder="未来"
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button @click="handleQuery" class="commonSearchBtn mlauto">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <main-table
      :table-data="tableData"
      :options="tableOptions"
      :show-over-flow-tooltip="{ placement: 'right' }"
    >
      <template #store="{ row }">
        <div class="store">
          <div class="center">
            <img class="logo" :src="getImageUrl(row.channel)" alt="" />
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
      <template #directorTimes="{ col }">
        <div class="times">
          <p class="time" v-for="(item, index) in transformTime(col)" :key="index">{{ item }}</p>
        </div>
      </template>
      <template #setting="{ col, row }">
        <el-button link type="primary" @click="onSet(col, row.categoryName, row.channel)"
          >设置</el-button
        >
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
import { getCategoryList } from '@/api/rights'
import MainTable from '../components/table.vue'
import { formatDate } from '@/utils/formatTime'
import { hasDirectorOptions } from '../options'
import { getImageUrl } from '@/utils'
import StoreCascader from '../components/storeCascader.vue'
import CategoryCascader from '../components/categoryCascader.vue'
import { useRightsStore } from '@/store/modules/rights'

const rights = useRightsStore()

const props = withDefaults(
  defineProps<{
    validFlag: 0 | 1
    code: string
  }>(),
  {}
)

const emit = defineEmits(['update:code', 'set', 'update:channel'])

const total = ref(0)
const tableOptions = ref<RightsManage.TableOption>([
  {
    label: '类目',
    prop: 'categoryName',
    width: 500,
    fixed: 'left'
  },
  {
    label: '店铺',
    prop: 'store'
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
    prop: 'id',
    slotName: 'setting',
    fixed: 'right'
  }
])
const tableData = ref<RightsManage.ChannelListItem[]>([])
const queryParams = ref<RightsManage.GetCategoryParams>({
  page: 1,
  size: 10,
  validFlag: 1
})
const queryRef = ref()

const rules = {
  startTime: [
    {
      validator: (_, val, callback) => {
        if (!queryParams.value.endTime) return callback()

        if (new Date(val) > new Date(queryParams.value.endTime)) {
          callback(new Error('开始时间不能晚于结束时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  endTime: [
    {
      validator: (_, val, callback) => {
        if (!queryParams.value.endTime) return callback()
        if (new Date(val) < new Date(queryParams.value.startTime!)) {
          callback(new Error('开始时间不能晚于结束时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

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
  try {
    const res = await getCategoryList(queryParams.value)
    total.value = res.total
    tableData.value = res.records
  } catch (error) {}
}

function onSet(col: string, category: string, channel?: string) {
  emit('update:code', col)
  emit('set', category)
  rights.channel = channel || ''
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
