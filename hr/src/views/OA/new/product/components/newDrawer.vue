<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" :size="918" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">企划信息</div>
            <img src="@/assets/imgs/system/fieldManageConfig/close.png" class="close" @click="reset" />
          </div>
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>
              <el-form :model="formData" ref="formRef" label-width="120px" :rules="rules">
                <div class="flex-row form-main">
                  <el-form-item label="企划名称" prop="planName">
                    <div class="valueBg">{{ formData.planName }}</div>
                  </el-form-item>
                  <el-form-item label="计划类型" prop="planStyle">
                    <div class="valueBg">{{
                      formData.planType == '0' ? '计划' : formData.planType == '1' ? '临时' : ''
                      }}</div>
                  </el-form-item>
                  <el-form-item label="店铺" prop="storeName">
                    <div class="valueBg">{{ formData.storeName || formData.store }}</div>
                  </el-form-item>
                  <el-form-item label="企划时间" prop="planningPlan">
                    <div class="valueBg">{{ formData.planningPlan }}</div>
                  </el-form-item>
                  <el-form-item label="计划上市日期" prop="planListDate">
                    <div class="valueBg">{{ formData.planListDate }}</div>
                  </el-form-item>
                  <el-form-item label="计划下单日期" prop="planOrderDate">
                    <div class="valueBg">{{ formData.planOrderDate }}</div>
                  </el-form-item>
                  <el-form-item label="备注" prop="remark" class="w-100">
                    <div class="valueRemarkBg">{{ formData.remark || '--' }}</div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </ContentWrap>

          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>品类明细</span>
              </div>
              <el-table class="SWCommonTable" v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle" :data="categoryTableList" :stripe="true"
                :show-overflow-tooltip="true" row-class-name="commonTableRow" width="100%">
                <el-table-column label="品类" prop="category">
                  <template #default="scope">
                    <div>{{ formatCategory(scope.row.category) }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="系列" prop="series">
                  <template #default="{ row }">
                    <div class="row-center">
                      <span>{{ row.series }}</span>
                      <el-popover placement="bottom" :width="200" trigger="hover">
                        <div class="salePointBg">
                          <div class="salePointBg-title">卖点</div>
                          <div v-if="row.salePoint" class="salePointBg-content" v-html="row.salePoint"></div>
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
                      scope.row.productType == '0'
                        ? '买手款'
                        : scope.row.productType == '1'
                          ? '定制款'
                          : '--'
                    }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="包装方式" prop="packageMethod">
                  <template #default="scope">
                    <div>{{ scope.row.packageMethod || '--' }}</div>
                  </template>
                </el-table-column>

                <el-table-column label="包装图片" prop="unRoutinePackagePicture">
                  <template #default="scope">
                    <el-image v-if="scope.row.unRoutinePackagePicture" style="width: 30px; height: 30px"
                      :src="scope.row.unRoutinePackagePicture" :preview-teleported="true"
                      :preview-src-list="[scope.row.unRoutinePackagePicture]" fit="cover" />

                    <div v-else>--</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </ContentWrap>

          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>计划数量</span>
              </div>
              <el-table class="SWCommonTable" v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle" :data="planNumTableList" :stripe="true"
                :show-overflow-tooltip="true" row-class-name="commonTableRow" width="100%">
                <el-table-column label="计划数" prop="detailNum" />
                <el-table-column label="设计数" prop="designNum" />
                <el-table-column label="已上传数" prop="uploadedNum" />
                <el-table-column label="已选定数" prop="selectedQuantity" />
              </el-table>
            </div>
          </ContentWrap>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { developmentPlanNewPlanInfo } from '@/api/oa/new/develop'
import { useCategoryList } from '../hooks.js'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const isVisible = ref(false)

const { categoryList, initSelectData } = useCategoryList()

const rules = ref({
  // category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  // series: [{ required: true, message: '请输入系列', trigger: 'blur' }]
})

const formData = ref({
  planName: '',
  planType: '',
  storeName: '',
  store: '',
  planningPlan: '',
  planListDate: '',
  planOrderDate: '',
  remark: ''
})
const categoryTableList = ref([]) // 品类明细
const planNumTableList = ref([]) // 品类明细
const planNumMap = ref({}) // 计划数量

const currentId = ref('') // 当前编辑的 id
const open = async (id: string) => {
  await initSelectData()

  isVisible.value = true

  if (id) {
    currentId.value = id
    const res = await developmentPlanNewPlanInfo(id)
    formData.value = res
    console.log('res', res)
    categoryTableList.value = res.detailList
    planNumMap.value = res.planNumMap
    if (res.planNumMap) {
      planNumTableList.value = [planNumMap.value]
    } else {
      planNumTableList.value = []
    }
  }
}

const formatCategory = (code) => {
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

const formRef = ref() // 表单 Ref

const reset = () => {
  formData.value = {
    planName: '',
    planType: '',
    storeName: '',
    store: '',
    planningPlan: '',
    planListDate: '',
    planOrderDate: '',
    remark: ''
  }
  categoryTableList.value = []
  isVisible.value = false
  currentId.value = ''
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.form-wapper {
  .header-wapper {
    margin-bottom: 16px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.form-main {
  flex-wrap: wrap;

  .el-form-item {
    width: calc(50%);

    &.w-100 {
      width: 100%;
    }
  }

  .valueBg {
    width: 284px;
    height: 32px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
  }

  .valueRemarkBg {
    width: 684px;
    min-height: 92px;
    background: #f8f8f9;
    border-radius: 4px;
    padding-left: 16px;
    padding-right: 16px;
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
