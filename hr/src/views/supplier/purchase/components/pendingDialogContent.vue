<template>
  <el-card shadow="never">
    <div class="title"> 采购申请信息 </div>
    <el-divider />
    <!-------------------------------------------------------------------------- 表单 ------------------------------------------------------------------------------>
    <el-form :model="formData" ref="queryFormRef" label-width="100" scroll-to-error>
      <el-row :gutter="17">
        <el-col :span="6">
          <el-form-item label="需求来源:" prop="requestSource">
            <el-input
              :model-value="
                getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, formData.requestSource) || '--'
              "
              disabled
              placeholder="请输入需求来源"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企划负责人">
            <el-select
              :model-value="formData?.enterprisePlanManagerObjs?.map((ele) => ele.userId)"
              collapse-tags
              collapse-tags-tooltip
              multiple
              disabled
              placeholder="--"
            >
              <el-option
                v-for="item in formData?.enterprisePlanManagerObjs"
                :key="item.userId"
                :value="item.userId"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="运营负责人">
            <el-select
              :model-value="formData?.operationManagerObjs?.map((ele) => ele.userId)"
              collapse-tags
              collapse-tags-tooltip
              multiple
              disabled
              placeholder="--"
            >
              <el-option
                v-for="item in formData?.operationManagerObjs"
                :key="item.userId"
                :value="item.userId"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请人">
            <el-input :model-value="formData?.createdUser?.name || '--'" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请时间">
            <el-input
              :model-value="formatDate(formData?.createdAt, 'YYYY-MM-DD HH:mm:ss')"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="售卖渠道:" prop="salesChannel">
            <select-channels
              class="w-100%"
              :model-value="formData.salesChannel"
              disabled
              placeholder="--"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="调整说明:" prop="remarks">
            <s-text-area
              :model-value="formData.remarks || ''"
              placeholder="--"
              disabled
              :maxlength="200"
              :rows="4"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="附件" class="form-item-files">
            <div>
              <files-upload disabled :modelValue="formData.fileUrl" :url="formData.fileUrl" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="title">
      <span>采购申请明细</span>
    </div>
    <el-divider :style="{ marginTop: '12px' }" />

    <!--------------------------------------------------------------------- 查看/审核搜索行 ----------------------------------------------------------------------------->
    <el-row :gutter="24">
      <el-col :span="20">
        <el-form :model="queryParams" ref="formRef" :label-width="90">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item prop="sku" label="SKU编码">
                <scroll-select
                  v-model:model-value="queryParams.sku"
                  :api="getInfoBySku2"
                  item-label-key="sku"
                  item-value-key="sku"
                  selectKey="sku"
                  clearable
                  @change="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end">
        <el-button class="commonSearchBtn" @click="handleQuery">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button class="commonResetBtn" @click="resetQuery"> 重置 </el-button>
      </el-col>
    </el-row>

    <!----------------------------------------------------------------------------- 列表 ------------------------------------------------------------------------------------->
    <special-table
      ref="tableRef"
      :data="tableData"
      :options="peddingDetailTable"
      :max-height="690"
    />
  </el-card>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { FormInstance } from 'element-plus'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'
import { formatDate } from '@/utils/formatTime'
import { peddingDetailTable } from '../options'
import { getInfoBySku2 } from '@/api/supplier/purchase'

defineOptions({ name: 'PurchaseAdd' })

defineProps<{ formData: any; tableData: any[] }>()
const emit = defineEmits(['handleQuery'])

const formRef = ref<FormInstance>()
const queryParams = reactive({
  sku: '' as string | undefined
})

function handleQuery() {
  emit('handleQuery', queryParams)
}

function resetQuery() {
  formRef.value?.resetFields()
  emit('handleQuery', queryParams)
}

defineExpose({
  resetParams: () => {
    delete queryParams.sku
  }
})
</script>
<style lang="less" scoped>
@import url(@/views/supplier/index.scss);

:deep(.el-table) {
  .el-input {
    --el-input-width: 100px;
    --el-date-editor-width: 150px;
  }

  .el-select {
    --el-select-width: 150px;
  }
}

.el-card {
  border: 0;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}

:deep(.el-card__body) {
  height: 100%;
}

:deep(.el-input-number) {
  .el-input__inner {
    text-align: left;
  }
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}

.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  font-weight: 600;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

:deep(.el-table__cell) {
  padding: 4px 0;
}

:deep(.searchFormItemWidth) {
  width: 100%;
}
</style>
