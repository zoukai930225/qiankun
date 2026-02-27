<template>
  <div v-if="drawerVisible">
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="936">
      <div class="drawerContent">
        <div class="flex-row">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>是否开启审核</div>
            <el-switch
              v-model="formData.isExamine"
              style="--el-switch-on-color: #0064ff; margin-left: 20px"
              :active-value="1"
              :inactive-value="0"
            />
          </div>
          <el-button type="primary" @click="addMoreClick">添加节点</el-button>
        </div>
      </div>

      <div class="drawerContent" v-for="(value, index) in formData.details" :key="index">
        <div class="title-content">
          <div class="title" style="">审核节点配置</div>
          <img class="del" src="@/assets/svgs/del.svg" @click="deleteClick(index)" />
        </div>
        <el-form
          class="dialogForm"
          :ref="getFormRef"
          :model="value"
          :rules="formRules"
          label-width="80px"
        >
          <el-row :gutter="10" style="padding: 0 15px">
            <el-col :span="12">
              <el-form-item label="审核节点名称" prop="examineNodeName" class="long-label">
                <el-select
                  v-model="value.examineNodeName"
                  placeholder="请选择审核节点名称"
                  clearable
                >
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.NP_TEMPLATE_EXAMINE_DETAIL_NAME)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核节点顺序" prop="examineNodeOrder" class="long-label">
                <el-input
                  style="width: 100%"
                  v-model="value.examineNodeOrder"
                  placeholder="请输入审核节点顺序"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="10"
            style="
              padding: 20px 15px 0 15px;
              background: #fcfdff;
              box-sizing: border-box;
              border: 1px solid #eff6ff;
              border-radius: 8px;
            "
          >
            <el-col :span="24">
              <el-form-item prop="store" label="店铺">
                <StoreTreeCascader
                  v-model="value.store"
                  :maxCollapsetags="2"
                  collapse-tags-tooltip
                  placeholder="请选择店铺"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="审核人员类型"
                :prop="value.examinePersonType == '4' ? 'examineNodePerson' : 'examinePersonType'"
                class="long-label"
              >
                <el-select
                  v-model="value.examinePersonType"
                  placeholder="请选择审核人员类型"
                  clearable
                >
                  <el-option
                    v-for="dict in permissionList"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <SWSelectPeople
                style="width: 100%"
                v-if="value.examinePersonType == '4'"
                :isEdit="true"
                v-model:modelValue="value.examineNodePersonList"
                :getSearchList="remoteMethod"
                @select-people-change="selectPeopleChange(value)"
              /> -->
              <line-staffs
                v-if="value.examinePersonType == '4'"
                v-model="value.examineNodePersonList"
                :tags="3"
                @change="selectPeopleChange(value)"
              ></line-staffs>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm">
            {{ formType === 'create' ? '提交' : '提交' }}</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { strIsOnlySpaces } from '@/utils/index'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import lineStaffs from '@/components/template/table/components/lineStaffs.vue'

import * as TempleteApi from '@/api/oa/new/templete'

const formData = ref({
  id: '',
  isExamine: 0,
  nodeId: '',
  details: []
})
const formRef = ref() // 表单 Ref

let formRefList = ref<HTMLElement[]>([])
const getFormRef = (el: any) => {
  if (el) {
    formRefList.value.push(el)
  }
}

const formRules = reactive({
  // examineNodeLogic: [
  //   { required: true, message: '请选择审核节点逻辑', whitespace: true, trigger: 'blur' }
  // ],
  examineNodeName: [
    { required: true, message: '审核节点名称不能为空', whitespace: true, trigger: 'blur' }
  ],
  examinePersonType: [
    { required: true, message: '请选择审核人员类型', whitespace: true, trigger: 'blur' }
  ],
  examineNodePerson: [
    { required: true, message: '请选择指派人员', whitespace: true, trigger: 'blur' }
  ],
  store: [{ required: true, message: '请选择店铺', whitespace: true, trigger: 'blur' }]
})

const permissionList = ref([])
/** 打开弹窗 */
const open = async (data: any, list: []) => {
  drawerVisible.value = true
  dialogTitle.value = '审核配置'
  formType.value = 'update'
  permissionList.value = list
  resetForm()

  formData.value = Object.assign({}, data)
  formData.value.nodeId = data.id || ''
  if (formData.value.weeklyRest && Array.isArray(formData.value.weeklyRest)) {
    formData.value.weeklyRest = (formData.value.weeklyRest || []).join(',')
  }
  formData.value.isExamine = Number(data.isExamine) || 0

  const res = await TempleteApi.templeteNodeDetailList({ nodeId: data.id }).catch(() => {})
  if (res && res.length > 0) {
    formData.value.details = res || []
  } else {
    if (formData.value && formData.value.details && formData.value.details.length > 0) {
    } else {
      formData.value.details = [
        {
          examineNodeOrder: '',
          examineNodeLogic: '',
          examineNodeName: '',
          examinePersonType: '',
          examineNodePerson: '',
          examineNodePersonList: '',
          store: ''
        }
      ]
    }
  }
}

// 点击添加
const addMoreClick = () => {
  formData.value.details.push({
    examineNodeOrder: '',
    examineNodeLogic: '',
    examineNodeName: '',
    examinePersonType: '',
    examineNodePerson: '',
    examineNodePersonList: '',
    store: ''
  })
}

const peopleList = ref([])
const remoteMethod = async (value) => {
  if (peopleList.value.length > 0) {
    return peopleList.value
  }

  const params = {
    status: 2
  }

  const data = await PersonRosterApi.getPersonRosterAvatarOriginList(params)
  peopleList.value = data || []
  return data || []
}

// 更新选择的人
const selectPeopleChange = (row) => {
  const codeList = row && row[`examineNodePersonList`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    row.examineNodePerson = userIds.join(',')
    console.log(row)

  } else {
    row.examineNodePerson = ''
  }
  // formRefList.value.validateField()
}
// 删除按钮点击
const deleteClick = (index) => {
  if (index < formData.value.details.length) {
    formData.value.details.splice(index, 1)
  }
}

const validInputParam = () => {
  let valid = true
  formData.value.details.forEach((item) => {
    if (!item.examineNodeName || (item.examineNodeName && strIsOnlySpaces(item.examineNodeName))) {
      valid = false
    }
    if (!item.examinePersonType) {
      valid = false
    }
    // if (!item.examineNodeLogic) {
    //   valid = false
    // }
    if (item.examinePersonType === '4' && !item.examineNodePerson) {
      valid = false
    }
    if (!item.store) {
      valid = false
    }
  })
  let valid1 = true
  formRefList.value.forEach(async (item) => {
    const validTemp = await item.validate()
    if (!validTemp) {
      valid1 = false
    }
  })
  console.log('但是荆防颗粒l', valid1, valid)
  return valid1 && valid
}

const submitForm = async () => {
  if (!validInputParam()) return
  // 提交请求
  formLoading.value = true
  try {
    // 需要删掉这个字段，不然会特别卡
    // if(formData.value.jsonData){
    //   delete formData.value.jsonData
    // }
    // 剔除jsonData属性以及Editable和OriginalValue属性

    // 将里面的examineNodeOrder 都转换为数字
    formData.value.details = formData.value.details.map((item) => {
      item.examineNodeOrder = Number(item.examineNodeOrder)
      if (item && item.jsonData) {
        delete item.jsonData
      }
      return item
    })
    const rowWithoutSpecialFields = Object.keys(formData.value).reduce((acc, key) => {
      if (!key.endsWith('Editable') && !key.endsWith('OriginalValue') && key !== 'jsonData') {
        acc[key] = formData.value[key]
      }
      return acc
    }, {})
    await TempleteApi.nodeSaveDetail(rowWithoutSpecialFields)
    message.success('修改成功')
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    nodeId: '',
    isExamine: 0,
    details: []
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}
.drawerContent {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  &:first-child {
    border: none;
  }

  .title-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-radius: 8px 8px 0px 0px;
    background: #f2f6fc;
    border-bottom: 1px solid #e5e5e5;
    box-sizing: border-box;
    .title {
      font-size: 14px;
      color: #333333;
    }
    .del {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
  .flex-row {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialogForm {
    padding: 20px 25px;
  }
  .itemBg {
    width: 100%;
    height: 32px;
    // background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }
  .itemBg1 {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &-title {
    // margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }
  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  // margin: 20px 0;
}
.dialogFormItemWidth {
  width: 100%;
}
.addMoreBg {
  width: calc(100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  .addMore {
    cursor: pointer;
    width: 116px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-icon {
      margin-left: 20px;
      margin-right: 6px;
    }
    &-text {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
  border: solid 1px #f0f0f0;
  padding: 16px 20px;
}
:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  // width: 100%;
  // height: 100%;
  // background: url('@/assets/imgs/common/drawer-bg.png');
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // box-sizing: border-box;
}
:deep(.el-drawer__body) {
  // width: 100%;
  // height: 100%;
  padding: 20px 20px 0 20px !important;
  background-color: #f8f8f9;
  // background: url('@/assets/imgs/common/drawer-bg.png');
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // box-sizing: border-box;
}
:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  // box-shadow: none;
}
:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}

:deep() {
  .el-drawer__footer {
    padding: 10px 20px !important;
  }
  .el-form-item {
    margin-bottom: 20px;
    .cascaderBoxAdmin {
      .el-input__inner {
        height: 32px !important;
      }
    }
  }
  .long-label {
    .el-form-item__label {
      line-height: 16px;
    }
  }
}
</style>
