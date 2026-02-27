<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog v-model="visible" width="1200px" :before-close="close">
    <div>
      <div class="search">
        <el-form v-model="searchForm" inline ref="searchFormRef">
          <el-form-item prop="planName" label="企划名称">
            <el-input v-model="searchForm.planName" placeholder="请输入企划名称" clearable />
          </el-form-item>
          <el-form-item prop="planCode" label="任务编号">
            <el-input v-model="searchForm.planCode" placeholder="请输入任务编号" clearable />
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="search" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="reset" class="commonResetBtn" style="margin-left: 0"> 重置 </el-button>
          <!-- <el-button type="primary" @click="allocateMyAction" style="margin-left: 12">
            我负责的
          </el-button> -->

          <!-- <el-button type="primary" @click="search">查询</el-button> -->
          <!-- <el-button @click="reset">重置</el-button> -->
        </div>
      </div>
      <el-table class="SWCommonTable" :data="list" width="100%" height="100%" :show-overflow-tooltip="true"
        v-loading="loading" v-horizontal-scroll="'always'" row-class-name="commonTableRow"
        :header-cell-style="appStore.headerCellStyle">
        <el-table-column width="40">
          <template #default="scope">
            <el-radio-group v-model="selectedRadio">
              <el-radio :key="scope.row.id" :value="scope.row.id" @change="handleRadioChange(scope.row)" />
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column property="planCode" label="任务编号" :min-width="160" :show-overflow-tooltip="false" />

        <el-table-column property="planName" label="企划名称" :min-width="150" />
        <el-table-column property="designPictureCon" label="设计图数" width="100">
          <template #default="scope"> {{
            scope.row.designPictureCon }} </template>
        </el-table-column>
        <el-table-column property="designPictureDeadline" width="120" label="交付截止时间">
          <template #default="scope">{{
            formatDate(scope.row.designPictureDeadline, "YYYY-MM-DD")
          }}</template>
        </el-table-column>

        <el-table-column property="storeName" :min-width="120" label="店铺" />

        <el-table-column property="category" :min-width="100" label="品类">
          <template #default="scope">
            <span>{{ formatCategory(scope.row.category) }}</span>
          </template>
        </el-table-column>
        <el-table-column property="classCode" :min-width="120" label="系列">
          <template #default="scope">
            <div class="row-center">
              {{ scope.row.classCode }}
              <el-popover placement="bottom" :width="200" trigger="hover">
                <div class="salePointBg">
                  <div v-if="scope.row.salePoint" class="salePointBg-content" v-html="scope.row.salePoint"></div>
                  <div v-else class="salePointBg-content" style="margin-top: 5px; margin-left: -6px">【--】</div>
                </div>
                <template #reference>
                  <el-icon color="#C1CEE1" style="margin-left: 5px">
                    <QuestionFilled />
                  </el-icon>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="series">
          <template #default="scope">
            <div>{{
              scope.row.productType == '0' ? '买手款' : scope.row.productType == '1' ? '定制款' : ''
            }}</div>
          </template>
        </el-table-column>
        <el-table-column property="designerList" width="120" label="设计师">
          <template #default="scope">
            <div class="row-center" v-if="scope.row.designerList && scope.row.designerList.length > 0">
              <img :src="scope.row.designerList[0].avatarOrigin"
                style="width: 16px; height: 16px; border-radius: 8px; margin-right: 10px" alt="" />
              <div style="font-size: 12px; color: #333333; line-height: 17px">
                {{ scope.row.designerList[0].name }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <!-- <el-table-column property="listingTime" label="上架时间">
          <template #default="scope">
            {{ formatDate(scope.row.listingTime) }}
          </template>
        </el-table-column> -->
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
      </div>
    </div>
    <template #header="{ }">
      <div class="my-header">
        <span>关联开发任务</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirmDialog" :disabled="!selectedRadio">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getDevelopmentPlanList } from '@/api/oa/new/designGallery/index'
import { useAppStore } from '@/store/modules/app'
import { useCategoryList } from '../../product/hooks'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'

import { formatDate } from '@/utils/formatTime'
import { debounce } from 'lodash-es'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗

const { categoryList, initSelectData } = useCategoryList()

const list = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const visible = ref(false)

const selectedRadio = ref<number | null>(null)

const searchForm = reactive({
  planName: undefined,
  planCode: undefined
})

const formatCategory = (category) => {
  if (!category) return ''
  const result = categoryList.value.find((item) => item.code == category)
  return result ? result.name : ''
}

const selectRow = ref({})
const handleRadioChange = (row: any) => {
  console.log('Selected row:', row)
  selectRow.value = row
  selectedRadio.value = row.id
}

const open = () => {
  visible.value = true
  getList()
}

defineExpose({
  open
})

const search = () => {
  currentPage.value = 1
  getList()
}

const searchFormRef = ref()
const reset = () => {
  currentPage.value = 1
  searchForm.planCode = undefined
  searchForm.planName = undefined
  selectedRadio.value = null
  getList()
}

const allocateMyAction = () => {
  // searchForm.isMe = 1
}

const getList = async () => {
  loading.value = true
  var formData = new FormData()
  formData.append(
    'queryParam',
    JSON.stringify({
      ...searchForm,
      page: undefined,
      size: undefined
    })
  )

  formData.append(
    'orderParam',
    JSON.stringify({
      planCode: 2 //按照任务编号倒序排列 1 升序 2 降序
    })
  )
  const data = {
    page: currentPage.value,
    size: pageSize.value,
    ...searchForm
  }

  const res = await getDevelopmentPlanList(data)
  console.log('res', res)
  list.value = res.records
  total.value = res.total
  loading.value = false
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getList()
}

// 分页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getList()
}

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  visible.value = false
}

const confirmDialog = debounce(async () => {
  emit('confirm', {
    devPlanId: selectedRadio.value, //开发任务id
    enterprisePlanId: selectRow.value.npBusinessEnterprisePlanId
  })
  visible.value = false
  selectedRadio.value = null
}, 300)

onMounted(() => {
  initSelectData()
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 3px;
  }
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}

.search {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
