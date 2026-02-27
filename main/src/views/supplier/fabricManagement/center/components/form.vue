<template>
  <div class="center-add-edit-form">
    <el-form ref="formRef" :model="model" :rules="rules" label-width="90px">
      <Layout>
        <template #basicInfo>
          <el-row>
            <el-col :span="12">
              <el-form-item label="品类" prop="category">
                <el-select v-model="model.category" placeholder="请选择" clearable>
                  <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企划时间" prop="planTime">
                <el-date-picker v-model="model.planTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企划季度" prop="planQuarter">
                <el-input maxlength="50" v-model.trim="model.planQuarter" placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template #fabricInfo>
          <el-row>
            <el-col :span="12">
              <el-form-item label="面料分类" prop="fabricClassIds">
                <el-select v-model="model.fabricClassIds" placeholder="请选择" clearable filterable
                  :loading="fabricClassLoading" multiple collapse-tags collapse-tags-tooltip>
                  <el-option v-for="opt in fabricClassOptions" :key="String(opt.id)" :label="opt.name"
                    :value="String(opt.id)" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面料名称" prop="name">
                <el-input maxlength="50" v-model.trim="model.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面料织数" prop="weavingNumber">
                <el-input v-model.trim="model.weavingNumber" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面料克重" prop="gramWeight">
                <el-input v-model.trim="model.gramWeight" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="label-wrap" label="单条价格(成本价)" prop="costPrice">
                <template #label>
                  <span class="label-text">单条价格(成本价)</span>
                </template>
                <el-input v-model.trim="model.costPrice" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="label-wrap" label="多条价格(售卖价)" prop="sellingPrice">
                <template #label>
                  <span class="label-text">多条价格(售卖价)</span>
                </template>
                <el-input v-model.trim="model.sellingPrice" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="label-wrap" label="面料手感/呈现" prop="feel">
                <template #label>
                  <span class="label-text">面料手感<br />/呈现</span>
                </template>
                <el-input v-model.trim="model.feel" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="面料含量" prop="contentList">
                <div class="composition-list" :class="{ 'gap-10px': model.contentList.length }">
                  <div class="composition-items">
                    <el-tag v-for="(item, idx) in model.contentList" :key="idx" class="composition-tag"
                      :class="{ active: activeCompositionIdx === idx }" closable @close="removeComposition(idx)"
                      @click="onClickComposition(idx)">
                      {{ getDictLabel(DICT_TYPE.FABRIC, item.key) }}{{ item.value }}%
                    </el-tag>
                  </div>
                  <el-button class="add-composition-btn" @click="addCompositionByDialog" size="default">
                    + 添加含量
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template #otherInfo>
          <el-row :gutter="12">
            <el-col :span="24">
              <el-form-item label="报告" prop="report">
                <el-input v-model.trim="model.report" placeholder="请输入" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="主打方向" prop="mainDirection">
                <s-text-area v-model.trim="model.mainDirection" :rows="4" placeholder="请输入" maxlength="200"
                  show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </Layout>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import Layout from './layout.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import {
  addFabricCenter,
  editFabricCenter,
  getFabricCenterDetail,
  getFabricClassSelectlist
} from '@/api/supplier/fabricManagement/center'
import { getFabricClassificationDetail } from '@/api/supplier/fabricManagement/classification'
import { useMessage } from '@/hooks/web/useMessage'
import { useDialog } from '@/hooks/web/useDialog'
import Composition from './composition.vue'

const props = defineProps<{ id?: string | number }>()

const formRef = ref<FormInstance>()
const message = useMessage()
const { openDialog } = useDialog()

const categoryOptions = getIntDictOptions(DICT_TYPE.FABRIC_CATEGORY, true)
const fabricClassOptions = ref<any[]>([])
const fabricClassLoading = ref(false)

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
  fabricClassIds: [] as string[],
  name: '',
  weavingNumber: '',
  gramWeight: '',
  costPrice: '',
  sellingPrice: '',
  feel: '',
  contentList: [] as Array<{ key: string; value: number }>,
  report: '',
  mainDirection: ''
})

// 自定义校验：面料含量合计必须等于 100%
function validateCompositionSum(rule: any, value: any, callback: any) {
  const sum = (model.contentList || []).reduce((acc, it) => acc + Number(it?.value ?? 0), 0)
  if (Math.abs(sum - 100) > 1e-6) {
    callback(new Error('面料含量合计必须等于100%'))
    return
  }
  callback()
}

function validateCompositionUnique(rule: any, value: any, callback: any) {
  const keys = (model.contentList || []).map((it) => String(it?.key ?? '')).filter((k) => !!k)
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
  fabricClassIds: [{ required: true, message: '请选择面料分类', trigger: 'change' }],
  name: [{ required: true, message: '请输入面料名称', trigger: 'blur' }],
  weavingNumber: [{ required: true, message: '请输入面料织数', trigger: 'blur' }],
  gramWeight: [{ required: true, message: '请输入面料克重', trigger: 'blur' }],
  costPrice: [{ required: true, message: '请输入单条价格(成本价)', trigger: 'blur' }],
  sellingPrice: [{ required: true, message: '请输入多条价格(售卖价)', trigger: 'blur' }],
  feel: [{ required: true, message: '请输入面料手感/呈现', trigger: 'blur' }],
  contentList: [
    { required: true, message: '请添加面料含量', trigger: 'change' },
    { validator: validateCompositionUnique, trigger: 'change' },
    { validator: validateCompositionSum, trigger: 'change' }
  ],
  report: [{ required: true, message: '请输入报告', trigger: 'blur' }],
  mainDirection: [{ required: true, message: '请输入主打方向', trigger: 'blur' }]
})

const fetchDetail = async () => {
  if (!props.id) return
  const data: any = await getFabricCenterDetail(String(props.id)).catch(() => ({}))
  const normalized: any = { ...(data || {}) }

  // classification ids normalization → string[]
  const idsFromDetail: string[] = (() => {
    if (Array.isArray(normalized.fabricClassIds)) {
      return normalized.fabricClassIds.map((v: any) => String(v)).filter(Boolean)
    }
    if (typeof normalized.fabricClassIds === 'string') {
      return normalized.fabricClassIds
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
  normalized.fabricClassIds = Array.from(new Set(idsFromDetail))

  // content list normalization
  if (Array.isArray(normalized.contentList)) {
    normalized.contentList = normalized.contentList.map((it: any) => ({
      key: String(it?.key ?? ''),
      value: Number(it?.value ?? 0)
    }))
  } else if (typeof normalized.content === 'string') {
    try {
      const arr = JSON.parse(normalized.content)
      if (Array.isArray(arr))
        normalized.contentList = arr.map((it: any) => ({
          key: String(it?.key ?? ''),
          value: Number(it?.value ?? 0)
        }))
    } catch { }
  } else if (Array.isArray(normalized.content)) {
    normalized.contentList = normalized.content.map((it: any) => ({
      key: String(it?.key ?? ''),
      value: Number(it?.value ?? 0)
    }))
  }

  Object.assign(model, normalized || {})
}

const ensureSelectedFabricClassOptions = async () => {
  const ids: string[] = (model.fabricClassIds || []).map((v) => String(v).trim()).filter(Boolean)
  if (!ids.length) return
  const missing = ids.filter(
    (id) => !fabricClassOptions.value.find((i: any) => String(i.id) === id)
  )
  if (!missing.length) return
  const details = await Promise.all(
    missing.map((id) => getFabricClassificationDetail(id).catch(() => null))
  )
  const valid = details.filter(Boolean)
  if (valid.length) fabricClassOptions.value = [...valid, ...fabricClassOptions.value]
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
      selectedKeys: model.contentList.map((it) => String(it.key)),
      onSubmit: (item: { key: string; value: string }) => {
        model.contentList.push({ key: item.key, value: Number(item.value) })
        formRef.value?.validateField('contentList')
      }
    },
    onSuccess: () => { }
  })
}

const onClickComposition = (idx: number) => {
  activeCompositionIdx.value = idx
  editComposition(idx)
}

const editComposition = async (idx: number) => {
  const init = model.contentList[idx]
  await openDialog({
    title: '面料含量',
    width: 480,
    content: Composition,
    showConfirmFooter: true,
    confirmText: '提交',
    props: {
      init,
      selectedKeys: model.contentList.filter((_, i) => i !== idx).map((it) => String(it.key)),
      onSubmit: (item: { key: string; value: string }) => {
        model.contentList.splice(idx, 1, { key: item.key, value: Number(item.value) })
        formRef.value?.validateField('contentList')
      }
    },
    onSuccess: () => { }
  })
}

const addComposition = () => {
  model.contentList.push({ key: '', value: 0 })
  formRef.value?.validateField('contentList')
}
const removeComposition = (idx: number) => {
  model.contentList.splice(idx, 1)
  formRef.value?.validateField('contentList')
}

onMounted(async () => {
  await loadInitialFabricClassOptions()
  if (props.id) {
    await fetchDetail()
    await ensureSelectedFabricClassOptions()
  }
})

const submit = async () => {
  await formRef.value?.validate()
  const payload: any = { ...model }
  // fabricClassIds 提交为逗号分隔字符串
  payload.fabricClassIds = (model.fabricClassIds || []).filter(Boolean).join(',')
  // contentList 保证 value 为数字
  payload.contentList = (model.contentList || []).map((it) => ({
    key: it.key,
    value: Number(it.value)
  }))
  payload.content = JSON.stringify(payload.contentList)
  if (props.id) {
    await editFabricCenter(payload)
    message.success('修改成功')
  } else {
    delete payload.id
    await addFabricCenter(payload)
    message.success('新增成功')
  }
}

defineExpose({ submit })
</script>

<style scoped lang="scss">
.center-add-edit-form {}

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
  color: var(--el-text-color-regular);
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
}

.mr8 {
  margin-right: 8px;
}

:deep(.el-form) {
  .el-date-editor {
    width: 100%;
  }

  .label-wrap {
    .el-form-item__label {
      line-height: 16px;
      align-items: unset;

      .label-text {
        width: 56px;
        word-break: break-all;
      }
    }
  }
}
</style>
