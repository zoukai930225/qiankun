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
                    placeholder="结束时间"
                    value-format="YYYY/MM/DD"
                    format="YYYY/MM/DD"
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-form-item class="toolbar">
              <div>
                <el-button @click="handleQuery" class="commonSearchBtn">
                  <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                  搜索
                </el-button>
                <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
                  重置
                </el-button>
              </div>
              <el-button @click="isExpand = !isExpand" link type="primary" class="mlauto">
                <img :src="isExpand ? UpIcon : DownIcon" alt="" class="mr4px w10px h6px" />
                {{ isExpand ? '收起' : '展开' }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="isExpand" :gutter="24">
          <el-col :span="4">
            <el-form-item prop="status" label="销售状态:">
              <el-select
                v-model="queryParams.status"
                placeholder="请选择销售状态"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in statusOps"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="mixSearch" label="混合查找:">
              <el-input
                v-model.trim="queryParams.mixSearch"
                placeholder="商品ID/名称/货品编码/负责人"
                clearable
                :maxlength="500"
                @keydown.enter="handleQuery"
                @blur="handleQuery"
              />
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
      <template #goods="{ row }">
        <div class="goods">
          <el-image
            class="w44px mr8px"
            :src="row.goodsImage"
            :style="{ borderRadius: '4px' }"
            :preview-src-list="[row.goodsImage]"
            preview-teleported
          />
          <div class="h44px goodsName">{{ row.goodsName }}</div>
        </div>
      </template>
      <template #status="{ col }">
        <div
          class="status"
          :class="{
            onsale: col === '1',
            removed: col === '2',
            notstart: col !== '1' && col !== '2'
          }"
        >
          <span class="w36px">{{ statusOps.find((ele) => ele.value === col)?.label }}</span>
        </div>
      </template>
      <template #store="{ row, col }">
        <div class="store">
          <div class="center">
            <img class="logo" :src="getImageUrl(row.channel)" alt="" />
          </div>
          <span class="ml16px">{{ col }}</span>
        </div>
      </template>
      <template #director="{ row }">
        <div class="directors" v-for="item in row.directorVos" :key="item.directorName">
          <img class="avatar" :src="item.directorAvatar" alt="" />
          <span class="director">{{ item.directorName }}</span>
        </div>
      </template>
      <template #directorTimes="{ col }">
        <div class="times">
          <p class="time" v-for="item in transformTime(col)" :key="item">{{ item }}</p>
        </div>
      </template>
      <template #setting="{ col }">
        <el-button link type="primary" @click="onSet(col, '')">设置</el-button>
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
import { getGoodsList } from '@/api/rights'
import MainTable from '../components/table.vue'
import { formatDate } from '@/utils/formatTime'
import { hasDirectorOptions, statusOps } from '../options'
import { getImageUrl } from '@/utils'
import UpIcon from '@/assets/imgs/common/filter_expand_up.png'
import DownIcon from '@/assets/imgs/common/filter_expand_down.png'
import StoreCascader from '../components/storeCascader.vue'
import CategoryCascader from '../components/categoryCascader.vue'

const props = withDefaults(
  defineProps<{
    validFlag: 0 | 1
    code: string
  }>(),
  {}
)

const emit = defineEmits(['update:code', 'set'])

const total = ref(0)
const isExpand = ref(false)
const loading = ref(false)
const tableOptions = ref<RightsManage.TableOption>([
  {
    label: '商品',
    slotName: 'goods',
    width: 300,
    fixed: 'left'
  },
  {
    label: '商品ID',
    prop: 'goodsId'
  },
  {
    label: '上架时间',
    prop: 'groundingTime'
  },
  {
    label: '商品店铺',
    prop: 'storeName'
  },
  {
    label: '状态',
    prop: 'status'
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
const queryParams = ref<RightsManage.GetGoodsListParams>({
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
  return col.map(
    (item) =>
      `${formatDate(new Date(item.startTime), 'YYYY/MM/DD')}-${item.endTime ? formatDate(new Date(item.endTime), 'YYYY/MM/DD') : '未来'}`
  )
}

async function getList() {
  loading.value = true
  try {
    const res = await getGoodsList(queryParams.value)
    total.value = res.total
    tableData.value = res.records
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function onSet(col: string, category: string) {
  emit('update:code', col)
  emit('set', category)
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
.toolbar {
  display: flex;
  justify-content: space-between;
}
.goods {
  .store();

  .goodsName {
    flex: 1;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    white-space: wrap;
    color: #0064ff;
  }
}
.status {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 57px;
  height: 26px;
  border-radius: 13px;
  border-radius: 258px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 26px;

  &.onsale {
    border: 1px solid #0064ff;
    background: rgba(0, 100, 255, 0.1);
    color: #0064ff;
  }

  &.removed {
    background: rgba(235, 55, 55, 0.17);
    border: 1px solid #eb3737;
    color: #eb3737;
  }

  &.notstart {
    border: 1px solid #888888;
    background: rgba(205, 205, 205, 0.4);
    color: #666666;
  }
}
</style>
