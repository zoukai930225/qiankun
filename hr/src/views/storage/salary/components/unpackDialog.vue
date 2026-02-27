<template>
  <el-dialog
    ref="dialogRef"
    title="拦截件分配"
    width="400"
    :model-value="isShow"
    @open="handleOpen"
    @close="emit('close')"
    @closed="handleClose"
    append-to-body
  >
    <el-form ref="formRef" :model="formData" label-width="100" :rules="rules">
      <el-form-item label="拦截件总量：">
        <span>{{ total }}</span>
      </el-form-item>
      <el-form-item
        v-if="!rowData?.interceptFlag || rowData?.interceptFlag !== 1"
        label="分配人员："
        prop="userId"
      >
        <el-select
          v-model="userIds"
          placeholder="请选择分配人员"
          multiple
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          append-to="body"
          popper-class="popper"
        >
          <template #tag>
            <div class="tag-item" v-for="item in selectedPerson" :key="item.value">
              <img class="tag-avatar" :src="item.avatar" alt="" />
              <span class="tag-label">{{ item.label }}</span>
              <img
                class="tag-item-x"
                src="@/assets/imgs/team/itemClose.png"
                @click.stop="delItem(item.value)"
                alt=""
              />
            </div>
          </template>
          <el-option
            v-for="item in personSelectOps"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            <div class="person">
              <img class="avatar" :src="item.avatar" alt="" />
              <div class="personInfo">
                <div class="personName">{{ item.label }}</div>
                <div class="personDepartment">{{ item.departmentName }}</div>
              </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分配产量：" prop="quantity">
        <el-input
          type="number"
          v-model.number.trim="formData.quantity"
          placeholder="请输入分配产量"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="handleComfire">确定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  getAllocationInterceptDetail,
  getPersonal,
  updateAllocationIntercept
} from '@/api/storage/salary/examine'
import { useSalary } from '@/store/modules/storage'

const salary = useSalary()
const message = useMessage()

const props = defineProps<{
  isShow: boolean
  dataDate: string
  rowData?: {
    quantity?: number
    interceptFlag?: 0 | 1
  }
}>()

const emit = defineEmits(['close', 'upload', 'refresh'])

const formData = reactive({
  quantity: undefined as number | undefined,
  userId: ''
})
const formRef = ref()
const total = ref()
const rules = {
  quantity: [
    {
      required: true,
      validator: (_: any, val: number, callback: (err?: Error) => void) => {
        if (!val && val !== 0) return callback(new Error('请输入分配产量'))
        else if (!/^\+?[0-9]\d*$/.test(val.toString()))
          return callback(new Error('请输入不小于0的整数'))
        else if (total.value < 0) return callback(new Error('分配产量不能超过拦截件总量'))
        else callback()
      }
    }
  ],
  userId: [{ required: true, message: '请选择分配人员' }]
}
const personSelectOps = ref<
  {
    label: string
    value: string
    avatar: string
    departmentName: string
  }[]
>([])
const userIds = ref<string[]>([])
const dialogRef = ref()
const selectedPerson = ref<typeof personSelectOps.value>([])

watch(
  userIds,
  (ids) => {
    formData.userId = ids.join(',')
    selectedPerson.value = personSelectOps.value.filter((item) => ids.includes(item.value))
    formData.quantity &&
      (total.value = salary.allocationInterception - formData.quantity! * userIds.value.length)
  },
  { immediate: true, deep: true }
)

watch(
  () => formData.quantity,
  (val, oldVal) => {
    if (props.rowData?.interceptFlag)
      total.value = total.value + (oldVal === undefined ? val : oldVal) - val!
    else total.value = salary.allocationInterception - formData.quantity! * userIds.value.length
  }
)

function handleClose() {
  userIds.value = []
  formRef.value.resetFields()
}

async function handleOpen() {
  if (!props.rowData?.interceptFlag) await getInfo()
  else total.value = salary.allocationInterception
  formData.quantity = props.rowData?.quantity
}

async function getInfo() {
  try {
    const res = await getAllocationInterceptDetail({ dataDate: props.dataDate })
    total.value = res.quantity
    salary.allocationInterception = res.quantity
  } catch (error) {}
}

async function remoteMethod(query: string) {
  const res = await getPersonal({
    userName: query,
    rolesMask: salary.currentRolesMask,
    dataDate: props.dataDate
  })
  personSelectOps.value = res.map((item) => ({
    value: item.userId,
    label: item.name,
    avatar: item.avatarOrigin || '',
    departmentName: item.departmentName
  }))
}

async function handleComfire() {
  await formRef.value.validate()

  switch (props.rowData?.interceptFlag) {
    case 1:
      emit('upload', formData.quantity)
      salary.allocationInterception = total.value
      break
    default:
      try {
        const res = await updateAllocationIntercept({
          ...Object.assign(formData, {
            userId: formData.userId,
            quantity: formData.quantity || '',
            dataDate: props.dataDate || ''
          })
        })
        if (res && res.success) {
          emit('close')
          message.success('拦截件分配成功')
          emit('refresh')
        }
      } catch (error) {}
      break
  }
}

function delItem(id: string) {
  const deletItemIndex = userIds.value.findIndex((item) => item === id)
  userIds.value.splice(deletItemIndex, 1)
}
</script>
<style lang="less" scoped>
* {
  --el-select-option-height: 80px;
}
:deep(.el-input__wrapper, .el-select__wrapper) {
  height: 32px;
  line-height: 30px;
  box-sizing: border-box;
}
:deep(.el-input__inner) {
  height: 30px;
  line-height: 30px;
}

.person {
  display: flex;
  align-items: center;
  width: 100px;

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 16px;
  }

  .personName {
    color: #333;
  }

  .personDepartment {
    font-size: 12px;
    color: #999;
  }
}

.popper {
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    line-height: 20px;
  }
}

.tag-item {
  display: flex;
  align-items: center;
  padding: 0 10px 0 3px;
  height: 26px;
  border-radius: 13px;
  background-color: #cad6f8;

  .tag-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .tag-label {
    margin: 0 6px;
    font-size: 14px;
  }

  .tag-item-x {
    width: 6px;
    height: 6px;
    cursor: pointer;
  }
}
</style>
