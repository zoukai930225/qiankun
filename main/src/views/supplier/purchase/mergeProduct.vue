<template>
  <special-card>
    <el-row :gutter="24">
      <el-col :span="20" class="!flex-1">
        <el-form label-width="90">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item prop="goodsNo" label="货品编码">
                <el-input
                  v-model="queryParams.goodsNo"
                  placeholder="请输入货品编码"
                  clearable
                  @change="handleQuery"
                  @keydown.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end min-w-350px">
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
      </el-col>
    </el-row>

    <el-divider class="!mt-0 !mb-15px" />

    <div class="flex justify-between items-center mb-20px">
      <span class="color-#333 line-height-22px font-500 font-size-16px">合并货品设置</span>

      <div>
        <!-- <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button> -->

        <el-button type="primary" @click="handleAdd">
          <!-- <Icon icon="ep:plus" /> -->
          <span>新增</span>
        </el-button>
      </div>
    </div>

    <special-table
      :options="mergeProductTable"
      :data="tableData"
      :loading="loading"
      :btns-options="btnsOptions"
      :loading-btns="['删除']"
      border
      class="mb-20px"
    />
    <template #footer>
      <div class="flex justify-end">
        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.pages"
          v-model:limit="queryParams.size"
          @pagination="getList"
        />
      </div>
    </template>
  </special-card>

  <merge-drawer
    v-bind="mergeDrawerProps"
    v-model:model-value="mergeDrawerProps.modelValue"
    @refresh="handleQuery"
  />
</template>
<script lang="ts" setup>
import specialCard from '@/views/supplier/components/specialCard.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { mergeProductTable } from './options'
import { getMergeProductListApi, removeMergeProductApi } from '@/api/supplier/purchase'
import { toReactive } from '@vueuse/core'
import { AuditBtn } from '../changeAudit/option'
const mergeDrawer = defineAsyncComponent(() => import('./components/mergeDrawer.vue'))

defineOptions({ name: 'PurchaseMergeProduct' })

const message = useMessage()

const tableData = ref<Record<string, any>[]>([])
const total = ref(0)
const queryParams = reactive({
  pages: 1,
  size: 10,
  goodsNo: ''
})
const mergeDrawerProps = reactive({
  modelValue: false,
  type: 'add',
  id: ''
})

/** 计算按钮配置 */
const btnsOptions = computed(() => {
  return tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('查看', handleCheck),
      new AuditBtn('编辑', handleEdit),
      new AuditBtn('删除', handleRemove, { type: 'danger' })
    ]
    return toReactive(hideBtns)
  })
})

function handleAdd() {
  Object.assign(mergeDrawerProps, {
    modelValue: true,
    type: 'add',
    id: ''
  })
}

function handleCheck(row) {
  Object.assign(mergeDrawerProps, {
    modelValue: true,
    type: 'check',
    id: row.id
  })
}

function handleEdit(row) {
  Object.assign(mergeDrawerProps, {
    modelValue: true,
    type: 'edit',
    id: row.id
  })
}

async function handleRemove(row) {
  try {
    await message.confirm('确定要删除吗？')

    const res = await removeMergeProductApi(row.id)
    if (res.success) {
      message.success('删除成功！')
      handleQuery()
    }
  } catch (error) {}
}

const timer = ref<NodeJS.Timeout>()
const loading = ref(false)
function getList() {
  timer.value && clearTimeout(timer.value)

  timer.value = setTimeout(async () => {
    loading.value = true
    try {
      const res = await getMergeProductListApi(queryParams)
      tableData.value = res.records
      total.value = res.total
    } catch (error) {
    } finally {
      loading.value = false
      timer.value && clearTimeout(timer.value)
    }
  }, 1000)
}

function handleQuery() {
  queryParams.pages = 1
  getList()
}
function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { pages: 1, size: 10 }
  )
  getList()
}

onActivated(() => {
  getList()
})

onBeforeMount(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url('../index.scss');

:deep(.el-pagination) {
  float: none;
}

:deep(.el-divider) {
  --el-border-color: #e5e5e5;
}
</style>
