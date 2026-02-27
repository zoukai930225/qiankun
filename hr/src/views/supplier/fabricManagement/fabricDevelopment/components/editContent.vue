<template>
  <div class="center-add-edit-form">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="85px">
      <div class="card" style="margin-bottom: 20px">
        <div class="header">
          <CardTitle title="基本信息" style="margin-left: 8px" />
        </div>
        <el-row class="cus-row" :gutter="10">
          <el-col :span="12">
            <el-form-item label="品类" prop="category">
              <!-- <el-select v-model="model.category" placeholder="请选择" clearable>
                <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select> -->
              <CategorySelect
                v-model="model.category"
                placeholder="请选择"
                style="width: 100%"
              ></CategorySelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企划时间" prop="planTime">
              <el-date-picker
                v-model="model.planTime"
                type="date"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择日期"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企划季度" prop="planQuarter">
              <el-input maxlength="50" v-model.trim="model.planQuarter" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="card" style="margin-bottom: 20px">
        <div class="header">
          <CardTitle title="面料信息" style="margin-left: 8px" />
        </div>
        <el-row class="cus-row" :gutter="10">
          <el-col :span="12">
            <el-form-item label="面料分类" prop="fabricClassification">
              <el-select
                v-model="model.fabricClassification"
                placeholder="请选择"
                clearable
                filterable
                :loading="fabricClassLoading"
                multiple
                collapse-tags
                collapse-tags-tooltip
              >
                <el-option
                  v-for="opt in fabricClassOptions"
                  :key="String(opt.id)"
                  :label="opt.name"
                  :value="String(opt.id)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面料名称" prop="fabricName">
              <el-input maxlength="50" v-model.trim="model.fabricName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面料支数" prop="fabricThreadCount">
              <el-input
                v-model.trim="model.fabricThreadCount"
                placeholder="请输入"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="面料克重" prop="fabricGramWeight">
              <el-input v-model.trim="model.fabricGramWeight" placeholder="请输入" maxlength="50" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item class="label-wrap" label="单条价格(成本价)" prop="unitPrice">
              <template #label>
                <span class="label-text">单条价格(成本价)</span>
              </template>
              <el-input v-model.trim="model.unitPrice" placeholder="请输入" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-wrap" label="多条价格(售卖价)" prop="sellingPrice">
              <template #label>
                <span class="label-text">多条价格(售卖价)</span>
              </template>
              <el-input v-model.trim="model.sellingPrice" placeholder="请输入" maxlength="50" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item class="label-wrap" label="面料价格(净重含税)" prop="fabricPriceNetWeight">
              <template #label>
                <span class="label-text">面料价格(净重含税)</span>
              </template>
              <el-input
                v-model.trim="model.fabricPriceNetWeight"
                placeholder="请输入"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-wrap" label="面料手感呈现" prop="fabricTexture">
              <template #label>
                <span class="label-text">面料手感呈现</span>
              </template>
              <el-input v-model.trim="model.fabricTexture" placeholder="请输入" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="适用类型" prop="applicableType">
              <template #label>
                <span class="label-text">适用类型</span>
              </template>
              <s-text-area
                v-model.trim="model.applicableType"
                :rows="4"
                placeholder="请输入"
                style="color: #333"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <div class="cus-box">
            <el-col :span="24">
              <el-form-item label="是否含运费" prop="includeFreight" label-width="100px">
                <!-- <template #label>
                  <span class="label-text">是否含运费</span>
                </template> -->
                <el-radio-group v-model="model.includeFreight">
                  <el-radio :value="1" label="是"></el-radio>
                  <el-radio :value="0" label="否"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="includeFreightRemark"
                :rules="[
                  { required: model.includeFreight === 0, message: '请输入备注', trigger: 'blur' }
                ]"
              >
                <template #label>
                  <span class="label-text">备注</span>
                </template>
                <s-text-area
                  v-model.trim="model.includeFreightRemark"
                  :rows="4"
                  placeholder="请输入"
                  style="color: #333"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </div>
          <div class="cus-box">
            <el-col :span="24">
              <el-form-item
                label="是否含第三方检测报告"
                prop="includeThirdPartyReport"
                label-width="170px"
              >
                <template #label>
                  <span class="label-text">是否含第三方检测报告</span>
                </template>
                <el-radio-group v-model="model.includeThirdPartyReport">
                  <el-radio :value="1" label="是"></el-radio>
                  <el-radio :value="0" label="否"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="includeThirdPartyReportRemark"
                :rules="[
                  {
                    required: model.includeThirdPartyReport === 0,
                    message: '请输入备注',
                    trigger: 'blur'
                  }
                ]"
              >
                <template #label>
                  <span class="label-text">备注</span>
                </template>
                <s-text-area
                  v-model.trim="model.includeThirdPartyReportRemark"
                  :rows="4"
                  placeholder="请输入"
                  style="color: #333"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item label="面料含量" prop="fabricContent">
              <div class="composition-list" :class="{ 'gap-10px': model.fabricContent.length }">
                <div class="composition-items">
                  <el-tag
                    v-for="(item, idx) in model.fabricContent"
                    :key="idx"
                    class="composition-tag"
                    :class="{ active: activeCompositionIdx === idx }"
                    closable
                    @close="removeComposition(idx)"
                    @click="onClickComposition(idx)"
                  >
                    {{ getDictLabel(DICT_TYPE.FABRIC, item.key) }}{{ item.value }}%
                  </el-tag>
                </div>
                <el-button
                  class="add-composition-btn"
                  @click="addCompositionByDialog"
                  size="default"
                >
                  + 添加含量
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="card">
        <div class="header">
          <CardTitle title="其他信息" style="margin-left: 8px" />
        </div>
        <el-row class="cus-row" :gutter="10">
          <el-col :span="24">
            <el-form-item label="报告" prop="report">
              <el-input v-model.trim="model.report" placeholder="请输入" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主打方向" prop="mainFocus">
              <s-text-area
                v-model.trim="model.mainFocus"
                :rows="4"
                placeholder="请输入"
                style="color: #333"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import type { IDrawerService } from '../service/IDrawerService'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import {
  addFabricCenter,
  editFabricCenter,
  getFabricCenterDetail,
  getFabricClassSelectlist
} from '@/api/supplier/fabricManagement/center'

import { addFabric, updateFabric } from '@/api/supplier/fabricManagement/fabricDevelopment'
import { getFabricClassificationDetail } from '@/api/supplier/fabricManagement/classification'
import { useMessage } from '@/hooks/web/useMessage'
import { useDialog } from '@/hooks/web/useDialog'
import Composition from './composition.vue'
import { isEqual } from 'lodash-es'
import Layout from './layout.vue'
import { formatTime } from '@/utils'
const props = defineProps<{ detailData: any }>()

const formRef = ref<FormInstance>()
const message = useMessage()
const { openDialog } = useDialog()

const categoryOptions = getIntDictOptions(DICT_TYPE.FABRIC_CATEGORY, true)
const fabricClassOptions = ref<any[]>([])
const fabricClassLoading = ref(false)
let sourceData = ''

const loadInitialFabricClassOptions = async () => {
  fabricClassLoading.value = true
  try {
    const res: any = await getFabricClassSelectlist({ name: '' })
    let list: any[] = []
    if (Array.isArray(res?.records)) list = res.records
    else if (Array.isArray(res?.data)) list = res.data
    else if (Array.isArray(res)) list = res
    fabricClassOptions.value = list
  } catch (e) {
    fabricClassOptions.value = []
  } finally {
    fabricClassLoading.value = false
  }
}

const model = reactive({
  id: '',
  category: '',
  planTime: '',
  planQuarter: '',
  fabricClassification: [] as string[],
  fabricName: '',
  fabricThreadCount: '',
  fabricGramWeight: '',
  unitPrice: '',
  sellingPrice: '',
  fabricTexture: '',
  fabricContent: [] as Array<{ key: string; value: number }>,
  report: '',
  mainFocus: '',
  applicableType: '',
  includeFreight: '',
  includeFreightRemark: '',
  includeThirdPartyReport: '',
  includeThirdPartyReportRemark: '',
  fabricPriceNetWeight: ''
})
sourceData = JSON.stringify(model)

// 自定义校验：面料含量合计必须等于 100%
function validateCompositionSum(rule: any, value: any, callback: any) {
  const sum = (model.fabricContent || []).reduce((acc, it) => acc + Number(it?.value ?? 0), 0)
  if (Math.abs(sum - 100) > 1e-6) {
    callback(new Error('面料含量合计必须等于100%'))
    return
  }
  callback()
}

function validateCompositionUnique(rule: any, value: any, callback: any) {
  const keys = (model.fabricContent || []).map((it) => String(it?.key ?? '')).filter((k) => !!k)
  const uniqueSize = new Set(keys).size
  if (uniqueSize !== keys.length) {
    callback(new Error('面料含量的种类不支持重复'))
    return
  }
  callback()
}

const rules = reactive<FormRules>({
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  planTime: [{ required: true, message: '请选择企划时间', trigger: 'change' }],
  planQuarter: [{ required: true, message: '请输入企划季度', trigger: 'blur' }],
  fabricClassification: [{ required: true, message: '请选择面料分类', trigger: 'change' }],
  fabricName: [{ required: true, message: '请输入面料名称', trigger: 'blur' }],
  fabricThreadCount: [{ required: true, message: '请输入面料支数', trigger: 'blur' }],
  fabricGramWeight: [{ required: true, message: '请输入面料克重', trigger: 'blur' }],
  // unitPrice: [{ required: true, message: '请输入单条价格(成本价)', trigger: 'blur' }],
  // sellingPrice: [{ required: true, message: '请输入多条价格(售卖价)', trigger: 'blur' }],
  fabricPriceNetWeight: [{ required: true, message: '请输入面料价格(净重含税)', trigger: 'blur' }],
  fabricTexture: [{ required: true, message: '请输入面料手感/呈现', trigger: 'blur' }],
  fabricContent: [
    { required: true, message: '请添加面料含量', trigger: 'change' },
    { validator: validateCompositionUnique, trigger: 'change' },
    { validator: validateCompositionSum, trigger: 'change' }
  ],
  report: [{ required: true, message: '请输入报告', trigger: 'blur' }],
  mainFocus: [{ required: true, message: '请输入主打方向', trigger: 'blur' }],
  applicableType: [{ required: true, message: '请输入适用类型', trigger: 'blur' }],
  includeFreight: [{ required: true, message: '请选择是否含运费', trigger: 'change' }],
  includeThirdPartyReport: [
    { required: true, message: '请选择是否含第三方检测报告', trigger: 'change' }
  ]
  // includeFreightRemark: [{required: model.includeFreight === '2', message: '请输入备注', trigger: 'blur'}],
  // includeThirdPartyReportRemark: [{required: model.includeThirdPartyReport === '2', message: '请输入备注', trigger: 'blur'}],
})

const fetchDetail = async () => {
  if (!props.id) return
  const data: any = await getFabricCenterDetail(String(props.id)).catch(() => ({}))
  const normalized: any = { ...(data || {}) }

  // classification ids normalization → string[]
  const idsFromDetail: string[] = (() => {
    if (Array.isArray(normalized.fabricClassification)) {
      return normalized.fabricClassification.map((v: any) => String(v)).filter(Boolean)
    }
    if (typeof normalized.fabricClassification === 'string') {
      return normalized.fabricClassification
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
    }
    if (normalized.fabricClassId != null) {
      return [String(normalized.fabricClassId)]
    }
    if (normalized.fabricCategoryId != null) {
      return [String(normalized.fabricCategoryId)]
    }
    return []
  })()
  normalized.fabricClassification = Array.from(new Set(idsFromDetail))

  // content list normalization
  if (Array.isArray(normalized.fabricContent)) {
    normalized.fabricContent = normalized.fabricContent.map((it: any) => ({
      key: String(it?.key ?? ''),
      value: Number(it?.value ?? 0)
    }))
  } else if (typeof normalized.content === 'string') {
    try {
      const arr = JSON.parse(normalized.content)
      if (Array.isArray(arr))
        normalized.fabricContent = arr.map((it: any) => ({
          key: String(it?.key ?? ''),
          value: Number(it?.value ?? 0)
        }))
    } catch {}
  } else if (Array.isArray(normalized.content)) {
    normalized.fabricContent = normalized.content.map((it: any) => ({
      key: String(it?.key ?? ''),
      value: Number(it?.value ?? 0)
    }))
  }
  Object.assign(model, normalized || {})
  sourceData = JSON.stringify(model)
}

const activeCompositionIdx = ref<number | null>(null)

const addCompositionByDialog = async () => {
  await openDialog({
    title: '面料含量',
    width: 480,
    content: Composition,
    showConfirmFooter: true,
    confirmText: '提交',
    props: {
      selectedKeys: model.fabricContent.map((it) => String(it.key)),
      onSubmit: (item: { key: string; value: string }) => {
        model.fabricContent.push({ key: item.key, value: Number(item.value) })
        formRef.value?.validateField('fabricContent')
      }
    },
    onSuccess: () => {}
  })
}

const onClickComposition = (idx: number) => {
  activeCompositionIdx.value = idx
  editComposition(idx)
}

const editComposition = async (idx: number) => {
  const init = model.fabricContent[idx]
  await openDialog({
    title: '面料含量',
    width: 480,
    content: Composition,
    showConfirmFooter: true,
    confirmText: '提交',
    props: {
      init,
      selectedKeys: model.fabricContent.filter((_, i) => i !== idx).map((it) => String(it.key)),
      onSubmit: (item: { key: string; value: string }) => {
        model.fabricContent.splice(idx, 1, { key: item.key, value: Number(item.value) })
        formRef.value?.validateField('fabricContent')
      }
    },
    onSuccess: () => {}
  })
}

const addComposition = () => {
  model.fabricContent.push({ key: '', value: 0 })
  formRef.value?.validateField('fabricContent')
}
const removeComposition = (idx: number) => {
  model.fabricContent.splice(idx, 1)
  formRef.value?.validateField('fabricContent')
}

const handleDetailData = () => {
  const data = { ...props.detailData }
  data.fabricClassification = data.fabricClassification.split(',')
  data.fabricContent = JSON.parse(data.fabricContent)
  Object.assign(model, data || {})
  sourceData = JSON.stringify(model)
}

onMounted(async () => {
  await loadInitialFabricClassOptions()
  if (props.detailData) {
    handleDetailData()
  }
})

const submit = async (successCallback, handleLoading) => {
  await formRef.value?.validate()
  const payload: any = { ...model }
  payload.fabricClassification = (model.fabricClassification || []).filter(Boolean).join(',')
  payload.fabricContent = (model.fabricContent || []).map((it) => ({
    key: it.key,
    value: Number(it.value)
  }))
  payload.fabricContent = JSON.stringify(payload.fabricContent)
  payload.planTime = formatTime(payload.planTime, 'yyyy-MM-dd HH:mm:ss')
  handleLoading(true)
  try {
    if (props.detailData) {
      await updateFabric(payload)
      message.success('修改成功')
    } else {
      delete payload.id

      await addFabric(payload)
      message.success('新增成功')
    }
    successCallback ? successCallback() : null
  } catch (error) {
  } finally {
    handleLoading(false)
  }
}

const beforCancel = () => {
  const lastData = JSON.stringify(model)
  return isEqual(lastData, sourceData)
}
defineExpose<IDrawerService>({ submit, beforCancel })
</script>

<style scoped lang="scss">
.center-add-edit-form {
}

.card {
  // padding: 20px 20px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
  .header {
    padding: 16px 20px;
    box-sizing: border-box;
    border-bottom: solid 1px #f0f0f0;
  }
  .cus-row {
    padding: 20px 20px 2px 20px;
    .cus-box {
      width: 100%;
      background: #fbfcfe;
      border: 1px dashed #e5e5e5;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 10px 20px 0px 0px;
      margin-bottom: 18px;
    }
  }
}

:deep() {
  .layout-content {
    padding-bottom: 0px !important;
  }
}

.composition-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.composition-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* pill style */
:deep(.composition-tag.el-tag) {
  height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid var(--el-border-color);
  background-color: #fff;
  color: #333;
  cursor: pointer;
}

:deep(.composition-tag.el-tag.active) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  background-color: rgba(0, 100, 255, 0.1);
}

/* when tag is selected, make the close icon blue */
:deep(.composition-tag.el-tag.active .el-tag__close) {
  color: rgb(0, 100, 255) !important;
}

/* normalize tag close icon color (remove error-state red) */
:deep(.composition-tag .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.el-form-item.is-error .composition-tag .el-tag__close) {
  color: var(--el-text-color-regular);
}

/* also apply to el-select's multiple tags in this form */
:deep(.el-select .el-tag__close) {
  color: var(--el-text-color-regular);
}

:deep(.el-form-item.is-error .el-select .el-tag__close) {
  color: var(--el-text-color-regular);
}

/* avoid red background on hover */
:deep(.composition-tag .el-tag__close:hover),
:deep(.el-select .el-tag__close:hover) {
  background-color: transparent !important;
  color: rgb(0, 100, 255) !important;
}

.add-composition-btn {
  border: 1px dashed #b8b8b8;
  border-radius: 4px;
  // padding: 9px 10px;
  width: fit-content;
  font-weight: 400;
  color: #333;
}

.mr8 {
  margin-right: 8px;
}

:deep(.el-form) {
  .el-date-editor {
    width: 100%;
  }
  .el-form-item__label {
    &::before {
      margin-right: 0 !important;
    }
  }

  .label-wrap {
    .el-form-item__label {
      line-height: 16px;
      align-items: unset;

      .label-text {
        width: 66px;
        word-break: break-all;
      }
    }
  }
}
</style>
