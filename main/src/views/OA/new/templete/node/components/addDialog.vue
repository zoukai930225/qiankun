<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <el-dialog
    class="commomDialig"
    v-model="isVisible"
    style="
      width: 450px;
      min-height: 196px;
      border-radius: 14px;
      background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
    "
  >
    <template #header>
      <div class="header">
        <span class="header-title">{{ formType == 'create' ? '新增' : '编辑' }}</span>
      </div>
    </template>

    <div class="content-wapper" v-loading="loading">
      <div class="form-wapper">
        <el-form
          :model="formInline"
          ref="formRef"
          @submit.prevent="save"
          label-width="100"
          :rules="formRules"
        >
          <el-form-item label="节点名称" prop="nodeName">
            <el-input v-model="formInline.nodeName" placeholder="请输入节点名称" clearable />
          </el-form-item>
          <el-form-item label="节点编码" prop="nodeCode">
            <el-input
              v-model="formInline.nodeCode"
              placeholder="请输入节点编码"
              clearable
              :disabled="isEdit"
            />
          </el-form-item>
          <el-form-item label="阶段" prop="phase">
            <el-select v-model="formInline.phase" placeholder="请选择阶段" clearable>
              <el-option
                v-for="item in getDictOptions(DICT_TYPE.NP_TEMPLETE_PHASE)"
                :key="item.value"
                :value="+item.value"
                :label="item.label"
            /></el-select>
          </el-form-item>
          <el-form-item label="前置节点" prop="preNodeCode">
            <el-select
              v-model="formInline.preNodeCode"
              clearable
              multiple
              placeholder="请选择前置节点"
              filterable
              :disabled="isFirstCode"
              @change="handlePreNodeChange"
            >
              <el-option
                v-for="node in preNodeList"
                :key="node.value"
                :label="`${node.label}(${node.value})`"
                :value="node.value"
                :disabled="node.value === formInline.nodeCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="后置节点" prop="nextNodeCode">
            <el-select
              v-model="formInline.nextNodeCode"
              clearable
              multiple
              placeholder="请选择后置节点"
              filterable
              @change="handleNextNodeChange"
            >
              <el-option
                v-for="node in nextNodeList"
                :key="node.value"
                :label="`${node.label}(${node.value})`"
                :value="node.value"
                :disabled="node.value === formInline.nodeCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="基准时长" prop="basisDuration">
            <el-input-number v-model="formInline.basisDuration" :min="1" clearable />
          </el-form-item>
          <el-form-item label="时长单位" prop="durationUnit">
            <el-select v-model="formInline.durationUnit" clearable placeholder="请选择时长单位">
              <el-option
                v-for="node in getIntDictOptions('np_node_duration_unit', true)"
                :key="node.value"
                :label="node.label"
                :value="node.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="周休" prop="weeklyRest">
            <el-select v-model="formInline.weeklyRest" clearable placeholder="请选择周休" multiple>
              <el-option
                v-for="node in getIntDictOptions('np_node_weekly_rest', true)"
                :key="node.value"
                :label="node.label"
                :value="node.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="提交人员类型" prop="submitType">
            <el-select v-model="formInline.submitType" clearable>
              <el-option
                v-for="dict in permissionList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="提交人" prop="personInCharge" v-if="formInline?.submitType === '4'">
            <SWSelectPeople
              :isEdit="true"
              v-model:modelValue="formInline.personInCharge"
              type="operate"
              :getSearchList="remoteMethod"
            />
          </el-form-item>
        </el-form>

        <div class="btn-wapper">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
// import { componentMap, componentTypeMap } from '../../utils'
import { useAppStore } from '@/store/modules/app'
import * as TempleteApi from '@/api/oa/new/templete'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
// import { useCategoryList } from '../../hooks.js'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const route = useRoute() // 路由
const isVisible = ref(false)
import SWSelectPeople from './SWSelectPeople.vue'
// const { initSelectData } = useCategoryList()
import { getDictOptions, getIntDictOptions, DICT_TYPE } from '@/utils/dict'
// 定义类型
interface Field {
  name: string
  code: string
  type: number
  placeholder: string
  options: any[]
  searchDisplay: boolean
  state: number
  required: number
  edit: boolean
}
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  },
  templateCodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  permissionList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
// 前置节点，后置节点 列表
const preNodeList = computed(() => {
  return [
    {
      label: '开始节点',
      value: '0'
    }
  ].concat(props.templateCodeList)
})
const nextNodeList = computed(() => {
  return [
    {
      label: '结束节点',
      value: '1'
    }
  ].concat(props.templateCodeList)
})
//  前置节点 后置节点不可以重复
const handleNextNodeChange = (vals: []) => {
  if (vals && vals.length) {
    if (vals.some((item) => formInline.value.preNodeCode.includes(item))) {
      message.confirm('前置接口与后置节点不可以重复！')
      formInline.value.nextNodeCode.pop()
    }
  }
}
const handlePreNodeChange = (vals: []) => {
  if (vals && vals.length) {
    if (vals.some((item) => formInline.value.nextNodeCode.includes(item))) {
      message.confirm('前置接口与后置节点不可以重复！')
      formInline.value.preNodeCode.pop()
    }
  }
}
// 人员选择
const personList = ref([])
const personalIsReqeusting = ref(false)
const remoteMethod = async (value) => {
  if (personList.value.length > 0 || personalIsReqeusting.value) {
    return personList.value || []
  }
  const params = {
    status: 2
  }
  personalIsReqeusting.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList(params).catch(() => {
    personalIsReqeusting.value = false
  })
  personalIsReqeusting.value = false
  personList.value = data || []
  return data || []
}
// 表单校验规则
const formRules = reactive({
  nodeName: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  nodeCode: [{ required: true, message: '请输入节点编码', trigger: 'blur' }],
  preNodeCode: [{ required: true, message: '请选择前置节点', trigger: 'blur' }],
  nextNodeCode: [{ required: false, message: '请选择后置节点', trigger: 'blur' }],
  basisDuration: [{ required: true, message: '请输入基准时长', trigger: 'blur' }],
  durationUnit: [{ required: true, message: '请选择时长单位', trigger: 'blur' }],
  weeklyRest: [{ required: true, message: '请选择周休', trigger: 'blur' }],
  phase: [{ required: true, message: '请选择阶段', trigger: 'blur' }]
})

const formType = ref('') // 表单类型 create - 新增 update- 编辑
const formInline = ref({
  nodeName: '',
  nodeCode: '',
  preNodeCode: [],
  nextNodeCode: [],
  basisDuration: 1,
  durationUnit: '',
  weeklyRest: [],
  submitType: '',
  personInCharge: [],
  phase: ''
})
// const categoryTableList = ref([]) // 品类明细
const templateId = (route.params.templeteId || '') as string
const currentId = ref('') // 当前编辑的 id
const isEdit = ref(false)
const isFirstCode = ref(false)
const loading = ref(false)
const open = async (type, id?) => {
  // await initSelectData()

  isVisible.value = true
  reset()
  formType.value = type
  isEdit.value = false
  isFirstCode.value = false
  if (id) {
    // 编辑
    loading.value = true
    try {
      currentId.value = id
      isEdit.value = true
      const res = await TempleteApi.getTemplateNodeDetail(id)
      if (res) {
        isFirstCode.value = res.preNodeCode?.includes('0') || false
        res.preNodeCode = res.preNodeCode ? res.preNodeCode.split(',') : []
        res.nextNodeCode = res.nextNodeCode ? res.nextNodeCode.split(',') : []
        res.personInCharge = res.personInChargeList?.length ? res.personInChargeList : []
        res.weeklyRest = res.weeklyRest ? res.weeklyRest.split(',') : []
        formInline.value = res
      }
    } finally {
      loading.value = false
    }
    // categoryTableList.value = res.details
  }
}

const formRef = ref() // 表单 Ref
const save = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    const preNodeCode = formInline.value.preNodeCode.join(',')
    const nextNodeCode = formInline.value.nextNodeCode.join(',')
    const personInCharge = formInline.value.personInCharge
      .map((person: any) => person.userId)
      .join(',')
    const weeklyRest = formInline.value.weeklyRest.join()  
    if (currentId.value) {
      const params = {
        ...formInline.value,
        id: currentId.value,
        templateId,
        preNodeCode,
        nextNodeCode,
        personInCharge,
        weeklyRest
      }
      await TempleteApi.updateNode(params)
    } else {
      const params = {
        ...formInline.value,
        templateId,
        preNodeCode,
        nextNodeCode,
        personInCharge
      }
      await TempleteApi.saveNode(params)
    }
    message.success('操作成功')
    emit('success')
    close()
  } catch (error) {}
}

const reset = () => {
  formInline.value = {
    nodeName: '',
    nodeCode: '',
    preNodeCode: [],
    nextNodeCode: [],
    basisDuration: 1,
    durationUnit: '',
    weeklyRest: '',
    submitType: '',
    personInCharge: []
  }
  currentId.value = ''
  formRef.value?.clearValidate()
}

const emit = defineEmits(['success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
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

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
