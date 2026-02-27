<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <div class="flex-row">
      <el-form :inline="true" :model="form" class="demo-form-inline" ref="queryFormRef">
        <el-form-item label="企划名称：" style="width: 210px" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入企划名称" clearable />
        </el-form-item>
        <!-- <el-form-item label="年份：" style="width: 210px" prop="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            value-format="YYYY"
            placeholder="请选择年份"
            clearable
          />
        </el-form-item> -->
      </el-form>

      <div class="commonTopFilterWrap-search flex-row">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="tableInfo">
      <el-table
        class="SWCommonTable"
        :data="list"
        width="100%"
        height="100%"
        :show-overflow-tooltip="true"
        v-loading="loading"
        v-horizontal-scroll="'always'"
        row-class-name="commonTableRow"
        :header-cell-style="appStore.headerCellStyle"
      >
        <el-table-column width="50">
          <template #default="{ row }">
            <div class="check" @click="handleCheck(row)"  v-if="currentSelectId != row.id"></div>
            <div class="checked" v-if="currentSelectId == row.id">
              <img
                src="@/assets/imgs/oa/duihao.png"
                class="logo"
                alt=""
                @click="handleCheck(row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column property="planName" label="企划名称" />
        <!-- <el-table-column property="year" label="年份" width="80px" /> -->
        <el-table-column property="detailNum" label="计划数"  />
        <el-table-column property="designNum" label="设计数"  />
        <el-table-column property="uploadedNum" label="已上传"  />
        <el-table-column property="selectedQuantity" label="已选数"  />
        <!-- <el-table-column property="sampleNum" label="样品数" width="80px" /> -->
      </el-table>

      <!--  -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getNpList } from '@/api/oa/new/designGallery/index'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const form = ref({
  page: 1,
  size: 10,
  year: undefined,
  planName: undefined,
  enterprisePlanId: undefined
})

const list = ref([])
const loading = ref(false)
const total = ref(0)

/** 搜索按钮操作 */
const handleQuery = () => {
  form.value.page = 1
  getList()
  emit('refresh', form.value)
}

const currentSelectId = ref('')
const handleCheck = (row) => {
  if (currentSelectId.value == row.id) {
    currentSelectId.value = ''
    form.value.enterprisePlanId = undefined
    emit('refresh', form.value)
    return
  }

  currentSelectId.value = row.id
  form.value.enterprisePlanId = row.id
  emit('refresh', form.value)
}

const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef?.value.resetFields()
  form.value.page = 1
  form.value.size = 10
  form.value.enterprisePlanId = undefined
  currentSelectId.value = ''
  handleQuery()
}

const handleSizeChange = (val: number) => {
  form.value.size = val
  getList()
}

// 分页
const handleCurrentChange = (val: number) => {
  form.value.page = val
  getList()
}

const emit = defineEmits(['refresh'])

const getList = async () => {
  try {
    loading.value = true
    var formData = new FormData()
    formData.append(
      'queryParam',
      JSON.stringify({
        ...form.value,
        page: undefined,
        size: undefined,
        enterprisePlanId: undefined
      })
    )

    const res = await getNpList({
      page: form.value.page,
      size: form.value.size,
      data: formData
    })

    loading.value = false
    list.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
    loading.value = false
  }
}

onMounted(async () => {})

// 填充计划名称
const fillPlanName = (planName: String) => {
  // @ts-ignore
  form.value.planName = planName

  getList()
}

const initPlanList = () => {
  getList()
}

defineExpose({
  fillPlanName,
  initPlanList
})
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}

.tableInfo {
  height: 260px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
.check {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #d0d5d6;
}
.checked {
  width: 16px;
  height: 16px;
  background: #0064ff;
  border-radius: 2px;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .logo {
    width: 11px;
    height: 8px;
  }
}
</style>
