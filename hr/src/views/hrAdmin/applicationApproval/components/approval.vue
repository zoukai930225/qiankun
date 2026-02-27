<template>
  <div class="approval-drawer">
    <ul class="list-wrapper">
      <li v-for="(item, index) in forms" class="card-item">
        <div v-if="isMultiple" class="card-title">品名{{ index + 1 }}</div>
        <el-form :class="{ 'form-item-multiple': isMultiple }" :model="item" label-width="68px"
          :ref="(el) => setFormRef(el, index)" :rules="getRules(index)">
          <div class="flex items-center text-14px mb-20px ml-6px">
            <div class="mr-4px text-[#3d3d3d]">申请人：</div>
            <div class="flex items-center">
              <el-avatar class="mr-4px" fit="cover" :size="18" :src="item.tx" />
              <div class="text-#333">{{ item.userName }}</div>
            </div>
          </div>
          <el-form-item label="区域">
            <el-select v-model="item.area" placeholder="请选择" :disabled="isDetail || isReturnType(item)"
              @change="(val) => onAreaChange(index, val)">
              <el-option v-for="opt in areaOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="品名">
            <el-select v-model="item.pname" placeholder="请选择" :disabled="isDetail || isReturnType(item)" clearable
              filterable :loading="pnameLoading[index]" @change="(val) => onPnameChange(index, val)">
              <el-option v-for="opt in pnameOptions[index]" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="编号" prop="number" :error="numberErrors[index]">
            <el-select v-model="item.number" placeholder="请选择" :disabled="isDetail || isReturnType(item)" clearable
              filterable :loading="numberLoading[index]" value-key="id" @change="() => onNumberChange(index)">
              <el-option v-for="opt in numberOptions[index]" :key="opt.value" :label="opt.number" :value="opt">
                <span>{{ opt.number }}</span>
                <span class="text-12px text-#999 ml-4px">(剩余库存{{ (opt.kcsl || 0) - (opt.yykcs || 0) }})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="item.num" placeholder="请输入" :readonly="true"
              :disabled="isDetail || isReturnType(item)" />
          </el-form-item>
          <el-form-item :label="getRemarkLabel(item)">
            <s-text-area :rows="3" v-model="item.shyj" maxlength="300" show-word-limit placeholder="请输入"
              :disabled="isDetail" />
          </el-form-item>
        </el-form>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, watch, onMounted, computed } from 'vue'
import { shApplicationApproval } from '@/api/hrAdmin/applicationApproval'
import { getAssetAreaAll } from '@/api/hrAdmin/asset'
import { getAreaFixedAssetSq, getAreaAssetSh } from '@/api/hrAdmin/applicationApproval'
import type { FormInstance, FormRules } from 'element-plus'

const props = withDefaults(
  defineProps<{
    mode?: 'single' | 'batch' | 'detail'
    records: any[]
  }>(),
  {
    mode: 'single'
  }
)

const forms = ref<any[]>([])
const formRefs = ref<FormInstance[]>([])

const isMultiple = computed(() => forms.value.length > 1)
const isDetail = computed(() => props.mode === 'detail')

// 模拟数据：单个与批量（与列表字段保持一致）
const MOCK_SINGLE: any = {
  id: 'S-0001',
  userName: '张三',
  tx: '',
  area: '华东-上海',
  pname: '笔记本电脑',
  num: 1,
  sqrbz: ''
}

const MOCK_BATCH: any[] = [
  {
    id: 'B-0001',
    userName: '李四',
    tx: '',
    area: '华南-深圳',
    pname: '显示器',
    num: 2,
    sqrbz: ''
  },
  {
    id: 'B-0002',
    userName: '王五',
    tx: '',
    area: '华北-北京',
    pname: '键盘',
    num: 1,
    sqrbz: ''
  }
]

// 强类型定义，修复模板中对 kcsl/yykcs 的访问
type LabelValue = { label: string; value: any }
type NumberOption = LabelValue & { kcsl?: number; yykcs?: number;[key: string]: any }

const areaOptions = ref<{ label: string; value: string }[]>([])
const pnameOptions = ref<{ label: string; value: string }[][]>([])
const numberOptions = ref<NumberOption[][]>([])
const pnameLoading = ref<boolean[]>([])
const numberLoading = ref<boolean[]>([])
const numberErrors = ref<string[]>([])

// 表单校验规则：编号在归还(sqlx==='3')时非必填，其他类型必填
const baseRules: FormRules = {
  number: [{ required: true, message: '请选择编号', trigger: 'change' }]
}

const isReturnType = (row: any) => String(row?.sqlx ?? '') === '3'
const getRules = (index: number): FormRules => {
  const row = forms.value[index] || {}
  return isReturnType(row) ? { number: [] } : baseRules
}

const setFormRef = (el: any, index: number) => {
  if (el) formRefs.value[index] = el as FormInstance
}

// 新增：本地重复编号(id)校验
const validateDuplicateNumbers = (): boolean => {
  const idToIndices = new Map<any, number[]>()
  forms.value.forEach((f, idx) => {
    if (!f || isReturnType(f)) return
    const selected: any = f.number
    const id = selected && typeof selected === 'object' ? selected?.id : selected
    if (id === undefined || id === null || id === '') return
    const arr = idToIndices.get(id) || []
    arr.push(idx)
    idToIndices.set(id, arr)
  })
  const newErrors = Array.from({ length: forms.value.length }, () => '')
  idToIndices.forEach((indices) => {
    if (indices.length > 1) {
      indices.forEach((i) => {
        newErrors[i] = '编号重复'
      })
    }
  })
  numberErrors.value = newErrors
  return newErrors.some((msg) => msg === '编号重复')
}

const initForms = () => {
  const list =
    Array.isArray(props.records) && props.records.length > 0
      ? props.records
      : props.mode === 'batch'
        ? MOCK_BATCH
        : [MOCK_SINGLE]
  forms.value = list.map((r: any) => ({
    id: r?.id,
    ...r
  }))
  numberErrors.value = Array.from({ length: forms.value.length }, () => '')
}

const loadAreaOptions = async () => {
  try {
    const data = await getAssetAreaAll()
    areaOptions.value = Array.isArray(data)
      ? data.map((it: any) => ({
        label: it?.qymc,
        value: it?.id
      }))
      : []
  } catch (e) { }
}

const onAreaChange = (index: number, areaId: any) => {
  if (!forms.value[index]) return
  forms.value[index].pname = undefined
  forms.value[index].number = undefined
  numberOptions.value[index] = []
  numberErrors.value[index] = ''
  loadPnameOptions(index, areaId)
  validateDuplicateNumbers()
}

const onPnameChange = (index: number, name: any) => {
  if (!forms.value[index]) return
  forms.value[index].number = undefined
  numberErrors.value[index] = ''
  const areaId = forms.value[index]?.area
  loadNumberOptions(index, { area: areaId, name })
  validateDuplicateNumbers()
}

const onNumberChange = async (index: number) => {
  numberErrors.value[index] = ''
  await nextTick()
  validateDuplicateNumbers()
}

const getRemarkLabel = (row: any) =>
  isDetail.value && Number(row?.status) === 2 ? '拒绝原因' : '备注'

const loadPnameOptions = async (index: number, areaId: any) => {
  if (!areaId) {
    pnameOptions.value[index] = []
    return
  }
  pnameLoading.value[index] = true
  try {
    const list: any = await getAreaFixedAssetSq({ area: areaId })
    pnameOptions.value[index] = Array.isArray(list)
      ? list.map((it: any) => ({
        label: it?.pname ?? it?.name ?? it?.label ?? it,
        value: it?.pname ?? it?.name ?? it?.value ?? it
      }))
      : []
  } finally {
    pnameLoading.value[index] = false
  }
}

const loadNumberOptions = async (index: number, payload: { area: any; name: any }) => {
  const { area, name } = payload || {}
  if (!area || !name) {
    numberOptions.value[index] = []
    return
  }
  numberLoading.value[index] = true
  try {
    const list: any = await getAreaAssetSh({ area, name })
    numberOptions.value[index] = Array.isArray(list) ? list : []
  } finally {
    numberLoading.value[index] = false
  }
}

onMounted(() => {
  initForms()
  loadAreaOptions()
  forms.value.forEach((f, idx) => {
    if (f?.area) loadPnameOptions(idx, f.area)
    if (f?.area && f?.pname) loadNumberOptions(idx, { area: f.area, name: f.pname })
  })
})

// 暴露 submit 给 useDrawer 调用
const submit = async () => {
  // 清空自定义错误，避免重复点击时由于值未变化导致不刷新
  numberErrors.value = Array.from({ length: forms.value.length }, () => '')
  // 校验每一个子表单（归还类型不校验编号）
  const results = await Promise.all(
    formRefs.value.map((form, idx) => {
      const row = forms.value[idx]
      const shouldValidate = !isReturnType(row)
      if (!form || !form.validate) return Promise.resolve(true)
      return shouldValidate ? form.validate() : Promise.resolve(true)
    })
  )
  const allValid = results.every((ok) => ok === true)
  if (!allValid) {
    throw new Error('校验失败')
  }

  // 本地重复校验（按编号 id）
  const hasDuplicate = validateDuplicateNumbers()
  if (hasDuplicate) {
    throw new Error('编号重复')
  }

  // 组合所勾选的列表数据 + 表单数据，并追加 status: 1（审核通过）
  const records = Array.isArray(props.records) ? props.records : []
  const payload = forms.value.map((f, idx) => {
    const selected = f?.number as any
    const normalizedNumber =
      selected && typeof selected === 'object'
        ? (selected?.number ?? selected?.value ?? selected?.label ?? '')
        : selected
    const assetId = selected && typeof selected === 'object' ? selected?.id : undefined
    const { number, ...rest } = f || {}
    return {
      ...(records[idx] || {}),
      ...rest,
      number: normalizedNumber,
      assetId: records[idx].sqlx === '3' ? records[idx]?.assetId : assetId,
      status: 1
    }
  })

  try {
    await shApplicationApproval(payload)
  } catch (err: any) {
    console.log(err, err)
    const raw = err.data
    const conflictIds: string[] = typeof raw === 'string' ? raw.split(',').map((v) => v.trim()) : []

    if (conflictIds.length > 0) {
      forms.value.forEach((f, idx) => {
        const selected = f?.number as any
        const selectedId = selected && typeof selected === 'object' ? selected?.id : selected
        const selectedNumber =
          selected && typeof selected === 'object'
            ? (selected?.number ?? selected?.value ?? selected?.label ?? '')
            : selected
        const candidates = [String(selectedId ?? ''), String(selectedNumber ?? '')]
        if (conflictIds.some((id) => candidates.includes(String(id)))) {
          numberErrors.value.splice(idx, 1, '该编号已被占用')
        }
      })
    }

    throw err
  }
}

defineExpose({ submit })
</script>

<style scoped lang="scss">
.approval-drawer {
  min-height: calc(100vh - 187px);
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-item {
  &:not(:first-child) {
    margin-top: 20px;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-title::before {
  content: '';
  width: 3px;
  height: 10px;
  background: #0064ff;
}

.form-item-multiple {
  border-radius: 10px;
  background: #f4f6fa;
  padding: 20px;
}
</style>
