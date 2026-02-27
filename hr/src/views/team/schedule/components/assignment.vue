<!--
 * @Date: 2024-08-05 18:08:34
 单节点任务指派 
-->
<template>
  <div>
    <el-dialog
      v-model="visible"
      :show-close="false"
      width="500"
      align-center
      @close="close"
      style="padding: 0"
    >
      <div class="wapper">
        <el-form
          :model="addForm"
          label-width="auto"
          label-position="right"
          ref="formRef"
          :rules="rules"
        >
          <el-form-item label="人员" prop="operate">
            <el-select
              popper-class="eloption"
              :popper-append-to-body="true"
              v-model="addForm.operate"
              placeholder="请选择人员"
              multiple
              remote
              filterable
              :remote-method="remoteMethod"
            >
              <template #tag v-if="addForm?.operate.length">
                <div class="itemValue" v-for="item in addForm.operate" :key="item">
                  <img class="avatorLogo" :src="formatName(item, 'avatarOrigin', 1)" alt="" />
                  <span class="itemDesc">{{ formatName(item, 'operatorRealname', 1) }}</span
                  ><img
                    class="itemClose"
                    src="@/assets/imgs/team/itemClose.png"
                    @click.stop="delItem(item, 'operate')"
                    alt=""
                /></div>
              </template>
              <el-option
                v-for="dict in OperatorRosterList"
                :key="dict.operatorId"
                :label="dict.operatorRealname"
                :value="dict.operatorId"
              >
                <div class="item">
                  <div class="left-wapper">
                    <img class="img" :src="dict.avatarOrigin" alt="" />
                    <div class="info">
                      <span class="text name">{{ dict.operatorRealname }}</span>
                      <span class="text desc">{{ dict.dept }}</span></div
                    >
                  </div>

                  <span style="color: var(--el-text-color-secondary); font-size: 13px">
                    {{ dict.jobNum }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="计划交付时间" prop="expectedCompletionTime">
            <el-date-picker
              v-model="addForm.expectedCompletionTime"
              type="date"
              aria-label="Pick a date"
              placeholder="请选择计划交付时间"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="方案审核方" prop="audit">
            <el-select
              v-model="addForm.audit"
              placeholder="请选择人员"
              multiple
              remote
              filterable
              :remote-method="remoteMethod1"
              popper-class="eloption"
              :popper-append-to-body="true"
            >
              <template #tag v-if="addForm?.audit.length">
                <div class="itemValue" v-for="item in addForm.audit" :key="item">
                  <img class="avatorLogo" :src="formatName(item, 'avatarOrigin', 2)" alt="" />
                  <span class="itemDesc">{{ formatName(item, 'operatorRealname', 2) }}</span
                  ><img
                    class="itemClose"
                    @click.stop="delItem(item, 'audit')"
                    src="@/assets/imgs/team/itemClose.png"
                /></div>
              </template>
              <el-option
                v-for="dict in auditList"
                :key="dict.operatorId"
                :label="dict.operatorRealname"
                :value="dict.operatorId"
              >
                <div class="item">
                  <div class="left-wapper">
                    <img class="img" :src="dict.avatarOrigin" alt="" />
                    <div class="info">
                      <span class="text name">{{ dict.operatorRealname }}</span>
                      <span class="text desc">{{ dict.dept }}</span></div
                    >
                  </div>

                  <span style="color: var(--el-text-color-secondary); font-size: 13px">
                    {{ dict.jobNum }}
                  </span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #header="{ close: closeDialog }">
        <div class="my-header">
          <span class="title">任务指派</span>
          <img src="@/assets/imgs/team/closeD.png" @click="closeDialog" class="closeD" />
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <div class="btn-wapper">
            <el-button @click="close" style="width: 64px; height: 32px" :disabled="loading"
              >取消</el-button
            >
            <el-button
              type="primary"
              style="width: 64px; height: 32px"
              @click="onSubmit"
              :disabled="loading"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { createRecord, getAuditorRoster, getOperatorRoster } from '@/api/team/index'
import type { FormRules } from 'element-plus'
import { useLeaderAudit } from './hooks/useLeaderAudit'
defineOptions({ name: 'Assignment' })
const message = useMessage() // 消息弹窗
const visible = ref(false)

const originItem = inject('currentDetail') as Ref<any>

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  node: {
    type: String
  },
  subNode: {
    type: String
  },
  currentDetail: {
    type: Object
  }
})

let addForm = reactive({
  operate: [], //操作人员
  expectedCompletionTime: undefined, //计划完成时间
  audit: [] //审核人员
})

const rules = reactive<FormRules<any>>({
  expectedCompletionTime: [
    {
      type: 'date',
      required: true,
      message: '请输入计划交付时间',
      trigger: 'change'
    }
  ],
  operate: [
    {
      required: true,
      message: '请选择人员',
      trigger: 'change'
    }
  ],
  audit: [
    {
      required: true,
      message: '请选择方案审核方',
      trigger: 'change'
    }
  ]
})

interface Operator {
  avatarOrigin: string //图片
  dept: string //组
  jobNum: number //工作数量
  operatorId: string //id
  operatorRealname: string //名字
}

// 名字格式化  type 1操作 2审核 str 属性
const formatName = (value, str, type) => {
  const midArr = type == 1 ? searchResult.value : auditSearchResult.value
  const operator = midArr.find((item) => item.operatorId == value)
  if (operator) {
    return operator[str]
  }
}

const emit = defineEmits(['success'])

const delItem = (item, type) => {
  addForm[type] = addForm[type].filter((value) => {
    return value !== item
  })
}

const formRef = ref()
const loading = ref(false)

const onSubmit = async () => {
  // 防止重复点击
  if (loading.value) return
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const params = {
      // @ts-ignore
      parentId: currentItem.value.id,
      type: 1, //指派时上传 type == 1
      operatorIds: addForm.operate && addForm.operate.join(','), //操作
      auditorIds: addForm.audit && addForm.audit.join(','), //审核
      expectedCompletionTime: addForm.expectedCompletionTime, // 计划完成时间
      node: currentNode.value,
      id: undefined
    }

    if (currentRecord.value?.id) {
      params.id = currentRecord.value.id
    }
    await createRecord(params)
    message.success('操作成功')
    emit('success')
  } finally {
    loading.value = false
  }
}

const close = () => {
  reset()
  visible.value = false
}

const reset = () => {
  searchResult.value = []
  OperatorRosterList.value = []
  addForm.operate = [] //操作人员
  addForm.expectedCompletionTime = undefined
  addForm.audit = [] //审核人员
  resetForm()
}

// 关闭弹出框 重置表单报错信息
const resetForm = () => {
  Object.keys(formRef.value.fields).forEach((field) => {
    formRef.value.fields[field].error = ''
  })
  formRef.value.resetFields()
}

//  当前操作的对象
const currentItem = ref<any>({})
const currentNode = ref()
const open = (item, node) => {
  visible.value = true
  currentItem.value = item
  currentNode.value = node
  initEdit()
}

const stateMap = {
  1: 'planState',
  2: 'shootState',
  3: 'retouchState',
  4: 'pageState',
  5: 'temporaryState'
}

const currentRecord = ref()

const initEdit = async () => {
  // 是不是二次指派
  const flag = currentItem.value[stateMap[currentNode.value]] == 1
  // @ts-ignore  寻找指派的节点
  const item = currentItem.value.records.filter((it) => {
    if (it.node == `${currentNode.value}` && it.type == 1) {
      return it
    }
  })
  // 指派信息
  const detail = item[item.length - 1]
  currentRecord.value = detail

  if (flag) {
    await remoteMethod('')
    await remoteMethod1('')
    addForm.expectedCompletionTime = detail.expectedCompletionTime
    // 操作人员
    const operatorsList = detail.operators.map((item) => {
      return item.operatorId
    })
    addForm.operate = operatorsList
    // 审核人员
    const auditList = detail.auditors.map((item) => {
      return item.operatorId
    })
    addForm.audit = auditList
  }
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = currentItem.value.deliveryTime || originItem.value.deliveryTime
  }
}

//下拉展示结果 操作人员
const OperatorRosterList: Ref<Operator[]> = ref([])
//格式化存储结果 //操作人员
const searchResult: Ref<Operator[]> = ref([])
const remoteMethod = async (value) => {
  const params = {
    userName: value,
    node: props.node,
    subNode: props.subNode
  }
  const res = await getOperatorRoster(params)
  OperatorRosterList.value = res || []
  searchResult.value = searchResult.value.concat(res || [])
}

//下拉展示结果 审核
const auditList: Ref<Operator[]> = ref([])
//格式化存储结果 //审核
const auditSearchResult: Ref<Operator[]> = ref([])
//审核
const remoteMethod1 = async (value) => {
  const params = {
    userName: value,
    //@ts-ignore
    parentId: props.currentDetail.id
  }
  const res = await getAuditorRoster(params)
  auditList.value = res || []
  auditSearchResult.value = auditSearchResult.value.concat(res || [])
}

const { syncAuditorsByOperators } = useLeaderAudit(addForm as any, auditList, auditSearchResult)

watch(
  () => addForm.operate.slice(),
  async (val) => {
    await syncAuditorsByOperators(val || [])
  },
  { deep: false }
)

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 10px;
  .title {
    font-size: 14px;
    color: #333333;
  }
  .closeD {
    width: 16px;
    height: 16px;
  }
}
:deep(.el-dialog__header) {
  margin-right: 0;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

:deep(.dialog-footer) {
  padding-bottom: 10px;
  padding-right: 10px;
}
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}
.wapper {
  padding: 30px 18px 0 16px;
  box-sizing: border-box;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

::deep(.el-select__wrapper),
::deep(.el-input__wrapper) {
  min-height: 32px;
  background: #fafafa;
  border-radius: 4px;
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;
    .text {
      height: 20px;
      line-height: 20px;
    }
    .name {
      font-size: 14px;
      color: #333333;
    }
    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}
.itemValue {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }
  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}
</style>
