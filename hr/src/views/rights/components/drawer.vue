<template>
  <div class="drawer-wrapper">
    <el-drawer
      ref="drawerRef"
      v-model="isShow"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="986"
      :before-close="handleBeforClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="emit('update:is-show', false)">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <el-card shadow="never" class="mb4" v-loading="loading">
        <template #header>
          <div class="title">
            <span>负责人明细</span>
            <el-checkbox
              class="mlauto"
              v-model="validFlag"
              label="只看生效"
              :true-value="1"
              :false-value="0"
              @change="handleCheckBoxChange"
            />

            <el-button type="primary" @click="onAdd">
              <el-icon class="mr4px"><Plus /></el-icon> 新增负责人
            </el-button>
          </div>
        </template>
        <main-table class="mt24px mb105px" :table-data="tableData" :options="tableOps">
          <!-- 店铺 -->
          <template #store="{ col, row, index }">
            <el-form
              v-if="row.isAdd || row.isEdit"
              :ref="`formRef${index}C`"
              :model="formData[index]"
              inline
              :rules="rules"
            >
              <el-form-item prop="store" label=" ">
                <StoreCascader v-model="formData[index].store" :multiple="false" justStore />
              </el-form-item>
            </el-form>
            <div class="store" :style="{ textOverflow: 'ellipsis' }" v-else>
              <img
                :style="{ width: '18px', height: '18px', marginRight: '8px' }"
                :src="getImageUrl(row.channelCode)"
                alt=""
              />
              <div>{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_STORE, col) || row.storeName }}</div>
            </div>
          </template>
          <!-- 责任人 -->
          <template #director="{ row, index }">
            <el-form
              :ref="`formRef${index}A`"
              v-if="row.isAdd || row.isEdit"
              :model="formData[index]"
              inline
              :rules="rules"
            >
              <el-form-item prop="directorId" label=" ">
                <select-people
                  v-model:user-id="formData[index].directorId"
                  v-model:model-value="formData[index].directorIds"
                />
              </el-form-item>
            </el-form>
            <div class="directors" v-else>
              <img class="avatar" :src="row.directorAvatar" alt="" />
              <span class="director">{{ row.directorName }}</span>
            </div>
          </template>
          <!-- 责任日期 -->
          <template #date="{ row, index }">
            <el-form
              v-if="row.isAdd || row.isEdit"
              inline
              :ref="`formRef${index}B`"
              :model="formData[index]"
              :rules="rules"
              class="datePickers"
              label-position="right"
            >
              <el-form-item prop="startTime" label=" ">
                <el-date-picker
                  v-model="formData[index].startTime"
                  value-format="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                  type="date"
                  placeholder="请选择开始时间"
                />
              </el-form-item>
              <el-form-item>
                <span>&nbsp;-</span>
              </el-form-item>
              <el-form-item
                prop="endTime"
                label=" "
                class="endTimePicker"
                :rules="[
                  {
                    required: true,
                    validator: (_, val: string, callback) => {
                      if (!val) return callback()
                      if (
                        new Date(formData[index].startTime!) > new Date(formData[index].endTime!)
                      ) {
                        callback(new Error('结束时间要在开始时间之后'))
                      } else {
                        callback()
                      }
                    }
                  }
                ]"
              >
                <el-date-picker
                  v-model="formData[index].endTime"
                  clearable
                  placeholder="未来"
                  value-format="YYYY/MM/DD"
                  format="YYYY/MM/DD"
                  :ref="`endTime${index}`"
                />
              </el-form-item>
            </el-form>
            <span v-else :class="{ disabled: !row.validFlag }"
              >{{ formatDate(row.startTime, 'YYYY/MM/DD') }}
              &nbsp;-&nbsp;
              {{ formatDate(row.endTime, 'YYYY/MM/DD') || '未来' }}</span
            >
          </template>
          <!-- 操作 -->
          <template #option="{ row, index }">
            <div v-if="!row.isEdit && !row.isAdd">
              <el-button link type="primary" :disabled="!row.validFlag" @click="onEdit(row)">
                修改
              </el-button>
              <el-button link type="primary" :disabled="!row.validFlag" @click="onStop(index)">
                截止
              </el-button>
            </div>
            <div v-else>
              <el-button link type="primary" @click="onSave(index)">保存</el-button>
              <el-button link type="primary" @click="onCancle(row, index)">取消</el-button>
            </div>
          </template>
          <!-- 责权角色 -->
          <template #role="{ col, row, index }">
            <el-form
              v-if="row.isAdd || row.isEdit"
              :ref="`formRef${index}D`"
              :model="formData[index]"
              :rules="rules"
            >
              <el-form-item prop="role" label=" ">
                <el-select v-model="formData[index].role" clearable placeholder="">
                  <el-option
                    v-for="item in roles"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <span v-else>{{ getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, col) || col }}</span>
          </template>
        </main-table>
      </el-card>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { deepEqual } from '@/utils/common'
import MainTable from './table.vue'
import { getAuthorityDetail, updateAuthority } from '@/api/rights'
import SelectPeople from './selectPeople.vue'
import { formatDate } from '@/utils/formatTime'
import {
  channelTableOps,
  categoryTableOps,
  goodsTableOps,
  roles,
  storeTableOps
} from '@/views/rights/options'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getImageUrl } from '@/utils'
import StoreCascader from './storeCascader.vue'

const props = withDefaults(
  defineProps<{
    isShow: boolean
    bizId?: string
    bizType?: 0 | 1 | 2 | 3
    title: string
  }>(),
  {}
)

const message = useMessage()

const emit = defineEmits(['update:is-show', 'refresh'])

const formData = ref<RightsManage.UpdateParams[]>([])
const validFlag = ref<0 | 1>(1)
const tableData = ref<RightsManage.DetailRes>([])
const oldFormData = ref<typeof formData.value>([])
const rules = {
  directorId: [{ required: true, message: '请选择责任人' }],
  startTime: [{ required: true, message: '请选择开始时间' }],
  store: [{ required: true, message: '请选择店铺' }]
}
const drawerRef = ref()
const formRef = ref()
const loading = ref(false)

const tableOps = computed(() => {
  let options: any[] = []
  switch (props.bizType) {
    case 0:
      options = channelTableOps
      break
    case 1:
      options = storeTableOps
      break
    case 2:
      options = categoryTableOps
      break
    case 3:
      options = goodsTableOps
      break
  }
  return options
})

const isShow = computed({
  get: () => {
    if (props.isShow) getDetail()
    return props.isShow
  },
  set: (val) => {
    emit('update:is-show', val)
  }
})

function clearForm() {
  formRef.value?.resetFields()
  formData.value = []
  tableData.value = []
}

/** 关闭前 */
async function handleBeforClose(done: () => void) {
  if (!deepEqual(oldFormData.value, formData.value)) {
    await message.confirm('当前数据还没有保存，关闭后会丢失数据，确定关闭吗？')
  }
  clearForm()
  done()
  emit('update:is-show', false)
}

/** 获取详情 */
async function getDetail() {
  if (!props.bizId) return
  try {
    const res = await getAuthorityDetail({
      bizId: props.bizId,
      bizType: props.bizType,
      validFlag: validFlag.value
    })
    tableData.value = res
    formData.value = cloneDeep(res)
    formData.value.forEach((item) => (item.directorIds = [item.directorId!]))
    oldFormData.value = cloneDeep(formData.value)
  } catch (error) {}
}

function onEdit(row: RightsManage.DetailItem) {
  row.isEdit = !row.isEdit
}

async function onStop(index: number) {
  if (new Date() > new Date(formData.value[index].startTime!)) {
    await message.confirm('确定截止当前责权吗？')
    formData.value[index].endTime = formatDate(new Date(), 'YYYY/MM/DD')
    onSave(index)
  } else {
    message.warning('当前责权还未开始！')
  }
}

/** 点击新增 */
function onAdd() {
  tableData.value.push({ isAdd: true })
  formData.value.push({ directorId: '', directorIds: [] })
}

// 获取表单
const instance = getCurrentInstance()
function getFormDOM(index: number, key: 'A' | 'B' | 'C' | 'D') {
  const formRefName = `formRef${index}${key}`
  const form = instance?.refs[formRefName]
  if (form) {
    return form as any
  }
}

/** 保存 */
async function onSave(index: number) {
  const formRefA = getFormDOM(index, 'A')
  const formRefB = getFormDOM(index, 'B')
  const formRefC = getFormDOM(index, 'C')
  const formRefD = getFormDOM(index, 'D')
  await Promise.all([
    formRefA?.validate(),
    formRefB?.validate(),
    formRefC?.validate(),
    formRefD?.validate()
  ])

  const params = cloneDeep(formData.value[index])
  params.bizType = props.bizType
  params.bizId = props.bizId

  try {
    const res = await updateAuthority(params)
    if (res.success) {
      getDetail()
      emit('refresh')
      message.success('保存成功')
      tableData.value[index].isAdd = false
      tableData.value[index].isEdit = false
    }
  } catch (error) {}
}

/** 取消 */
function onCancle(row: RightsManage.DetailItem, index) {
  row.isEdit = false
  if (row.isAdd) {
    tableData.value.splice(index, 1)
    formData.value.splice(index, 1)
  }
}

function handleCheckBoxChange() {
  getDetail()
}
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;

  .el-form {
    .el-form-item__content {
      & > div {
        width: 100%;
      }
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}
.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  overflow: scroll;
  border: 0;
  border-radius: 8px;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

:deep(.el-card) {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  :deep(.el-card__body) {
    box-sizing: border-box;
    padding: 0;
  }

  .el-card__header {
    padding: 16px 20px;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }

    .el-button {
      margin-left: 24px;
    }
  }

  .content {
    margin: 13px 20px 0;

    .item {
      width: 260px;
      height: 32px;
      padding-left: 12px;
      line-height: 32px;
      font-size: 12px;
      color: #999;
      background: #f1f5f866;
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
}

:deep(.el-form-item) {
  margin: 2px 0 14px 0;

  .el-form-item__label {
    padding-right: 4px;
  }

  .el-form-item__content {
    flex-wrap: nowrap;
  }

  .el-input__inner {
    width: 109px;
  }

  .el-input__suffix {
    width: 20px;
  }
}

.endTimePicker {
  margin-left: 4px;
  :deep(label) {
    display: none;
  }
}
.store {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.is-disabled),
.disabled {
  color: #cdcdcd !important;
}
.datePickers {
  :deep(.el-input__inner) {
    width: 70px;
  }
}
</style>
