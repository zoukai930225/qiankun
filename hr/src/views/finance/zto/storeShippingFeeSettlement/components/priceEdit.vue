<template>
  <div class="price-edit-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="96px">
      <el-form-item label="分组" prop="groupType">
        <el-select
          v-model="form.groupType"
          placeholder="请选择分组"
          :disabled="isEditMode"
          filterable
        >
          <el-option
            v-for="item in groupList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="运单发放网点" prop="waybillDistributionOutlet">
        <template #label>
          <span class="lh-16px text-right">运单发放<br />网点</span>
        </template>
        <el-select
          v-model="form.waybillDistributionOutlet"
          placeholder="请选择网点"
          :disabled="isEditMode"
          filterable
        >
          <el-option
            v-for="item in waybillList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="月份" prop="dataBelong">
        <el-date-picker
          v-model="form.dataBelong"
          type="month"
          value-format="YYYY-MM"
          format="YYYY-MM"
          placeholder="请选择月份"
          :disabled="isEditMode"
        />
      </el-form-item>
      <el-form-item label="阶梯区间" required>
        <div class="range-row">
          <el-form-item prop="intervalBegin" label-width="0" class="range-item">
            <el-input-number
              v-model="form.intervalBegin"
              :controls="false"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="请输入"
              @change="onIntervalBeginChange"
            />
          </el-form-item>
          <el-form-item prop="intervalEnd" label-width="0" class="range-item">
            <el-input-number
              v-model="form.intervalEnd"
              :controls="false"
              :min="0"
              :precision="0"
              :step="1"
              placeholder="请输入"
              @change="onIntervalEndChange"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="阶梯单价" prop="price">
        <el-input-number
          v-model="form.price"
          :controls="false"
          :min="0"
          :step="0.01"
          placeholder="请输入"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, inject, onMounted, nextTick } from 'vue'
import { getWaybillAllList, addZtoPriceConfig, updateZtoPriceConfig } from '@/api/finance/zto'
import type { ComponentOptions } from '@/types/components'
import type { Ref } from 'vue'

const props = defineProps<{ mode?: 'create' | 'edit'; initData?: any }>()
const emit = defineEmits(['success', 'close'])

const isEditMode = computed(() => props.mode === 'edit')

const formRef = ref()
const form = ref({
  groupType: '',
  waybillDistributionOutlet: '',
  dataBelong: '',
  intervalBegin: undefined as number | undefined,
  intervalEnd: undefined as number | undefined,
  price: undefined as number | undefined
})

const waybillList = ref<ComponentOptions[]>([])

// 注入父级提供的分组下拉
const groupList = inject<Ref<ComponentOptions[]>>('groupList', ref<ComponentOptions[]>([]))

// 通过控件 change 事件触发右侧区间的校验
function onIntervalBeginChange() {
  formRef.value?.validateField?.('intervalEnd')
}

// 右区间变更时，联动校验左区间
function onIntervalEndChange() {
  formRef.value?.validateField?.('intervalBegin')
}

const rules = computed(() => ({
  groupType: [{ required: true, message: '请选择分组', trigger: 'change' }],
  waybillDistributionOutlet: [{ required: true, message: '请输入网点', trigger: 'blur' }],
  dataBelong: [{ required: true, message: '请选择月份', trigger: 'change' }],
  intervalBegin: [
    { required: true, message: '请输入区间起', trigger: 'blur' },
    {
      validator: (_: any, value: any, cb: any) => {
        if (value === undefined || value === null || value === '')
          return cb(new Error('请输入区间起'))
        if (!Number.isInteger(value) || value < 0) return cb(new Error('请输入>=0的整数'))
        cb()
      },
      trigger: 'blur'
    }
  ],
  intervalEnd: [
    { required: true, message: '请输入区间止', trigger: 'blur' },
    {
      validator: (_: any, value: any, cb: any) => {
        if (value === undefined || value === null || value === '')
          return cb(new Error('请输入区间止'))
        if (!Number.isInteger(value) || value < 0) return cb(new Error('请输入>=0的整数'))
        if (form.value.intervalBegin !== undefined && value <= form.value.intervalBegin)
          return cb(new Error('右侧必须大于左侧'))
        cb()
      },
      trigger: 'blur'
    }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' },
    {
      validator: (_: any, value: any, cb: any) => {
        if (value === undefined || value === null || value === '')
          return cb(new Error('请输入单价'))
        if (typeof value !== 'number' || Number.isNaN(value) || value < 0)
          return cb(new Error('请输入≥0的数字'))
        cb()
      },
      trigger: 'blur'
    }
  ]
}))

const submit = async () => {
  await formRef.value?.validate()
  try {
    const payload: any = { ...form.value }
    if (props.mode === 'edit') {
      const id = (props.initData as any)?.id
      if (id !== undefined && id !== null) payload.id = id
      await updateZtoPriceConfig(payload)
    } else {
      await addZtoPriceConfig(payload)
    }
    emit('success', { ...form.value })
  } finally {
  }
}

async function getWaybillList() {
  const res = await getWaybillAllList()
  if (Array.isArray(res)) {
    waybillList.value = res.map((v) => ({ label: v, value: v }))
  }
}

async function init() {
  await getWaybillList()
  if (props.mode === 'edit' && props.initData) {
    const v = props.initData as any
    form.value = {
      groupType: v.groupType,
      waybillDistributionOutlet: v.waybillDistributionOutlet,
      dataBelong: v.dataBelong,
      intervalBegin: v.intervalBegin,
      intervalEnd: v.intervalEnd,
      price: v.price
    }
  }
  // 初始化后清理一次校验状态
  await nextTick()
  formRef.value?.clearValidate?.()
}

onMounted(() => {
  init()
})

defineExpose({ submit })
</script>

<style scoped lang="scss">
:deep(.el-form) {
  .el-date-editor,
  .el-input-number {
    width: 100%;
  }
}
.price-edit-dialog {
  .range-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }
  .range-item {
    flex: 1;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
}
</style>
