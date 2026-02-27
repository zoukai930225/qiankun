<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" custom-class="addDept">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="上级部门:" prop="parentName" v-if="formData.parentName">
        <el-input class="dialogFormItemWidth" v-model="formData.parentName" disabled />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input
          class="dialogFormItemWidth"
          v-model="formData.name"
          placeholder="请输入部门名称"
        />
      </el-form-item>
      <el-form-item label="企业" prop="company">
        <el-select
          class="dialogFormItemWidth"
          v-model="formData.company"
          placeholder="请选企业"
          clearable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="HR" prop="hrName">
        <!-- <el-input
          class="dialogFormItemWidth"
          v-model="formData.hrName"
          placeholder="请选择"
          readonly
        >
          <template #append>
            <el-button @click="openChangeUser"> 选择人员 </el-button>
          </template>
        </el-input> -->
        <el-select
          v-model="hrList"
          multiple
          filterable
          placeholder="请选择人员"
          :loading="loading"
          class="dialogFormItemWidth"
          value-key="userId"
        >
          <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item">
            <div class="userInfo">
              <span class="name">{{ item.name }}</span>
              <span class="dept">
                {{ item.departmentName }}
                <span v-if="item.departmentName && item.jobName">-</span>
                {{ item.jobName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
    </template>
  </Dialog>
  <!-- 更换人员 -->
  <ChangeUser ref="ChangeUserRef" @success="handleChangeUserSuccess" />
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import ChangeUser from '@/views/hrAdmin/assetManagement/components/changeUser.vue'
// import * as Asset from '@/api/hrAdmin/asset'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

import * as DeptApi from '@/api/system/dept'

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref({
  pId: '0',
  id: undefined,
  parentName: '',
  name: '',
  company: '',
  hrName: '',
  hrUserId: ''
})
const deptId = ref('') // 部门id
const formRules = reactive({
  name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  company: [{ required: true, message: '请选择企业', trigger: 'blur' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, parentId?: string, parentName?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id && id !== '0') {
    formLoading.value = true
    try {
      deptId.value = id
      const data = await DeptApi.getDept(id)
      await remoteMethod('')
      if (data) {
        formData.value = data
        formData.value.parentName = parentName || ''

        // 处理数据
        let hrNameList = data.hrName.split(',')
        let hrUserIdList = data.hrUserId.split(',')
        hrList.value = hrNameList.map((hr, index) => {
          return {
            name: hr,
            userId: hrUserIdList[index]
          }
        })
      }
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value.parentName = parentName || ''
    formData.value.pId = parentId ?? ''
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 选择人员 */
const ChangeUserRef = ref()
const openChangeUser = () => {
  if (ChangeUserRef.value) {
    ChangeUserRef.value.open()
  }
}

// 处理更换人员的回调
const handleChangeUserSuccess = (userData) => {
  formData.value.hrUserId = formData.value.hrUserId + ',' + userData.id
  formData.value.hrName = formData.value.hrName + ',' + userData.name
}
// 改下拉选择 多个
const userList = ref<any>([])
const loading = ref(false)
const hrList = ref<any>([])
const remoteMethod = async (value: string) => {
  loading.value = true
  try {
    // const data = await Asset.getUserList({ field: value })
    const data = await PersonRosterApi.getPersonRosterList({
      page: 1,
      size: 9999,
      status: '2',
      param: value
    }).catch(() => {})
    userList.value = data.data || []
  } finally {
    loading.value = false
  }
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 处理数据
  formData.value.hrUserId = hrList.value.map((hr) => hr.userId).join(',')
  formData.value.hrName = hrList.value.map((hr) => hr.name).join(',')
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DeptApi.DeptVO
    if (formType.value === 'create') {
      data.id = undefined
      await DeptApi.createOrUpdateDept(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeptApi.createOrUpdateDept(data)
      message.success(t('common.updateSuccess'))
    }
    // 更新HR
    await DeptApi.updateHrByDeptId({
      deptId: deptId.value,
      hrName: formData.value.hrName
    })
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    pId: '0',
    id: undefined,
    parentName: '',
    name: '',
    company: '',
    hrName: '',
    hrUserId: ''
  }
  formRef.value?.resetFields()
}
</script>
<style lang="scss" scoped>
.parentNode {
  height: 32px;
  background: #fafbfc;
  border-radius: 4px;
  border: 1px solid #e5e7eb;

  &-text {
    margin-left: 12px;
    font-size: 14px;
    color: #333333;
    line-height: 32px;
  }
}

.addDept {
  .jz-dialog__header {
    border-bottom: 0px solid #ececec;

    .jz-dialog__title {
      color: #333;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .jz-dialog__footer {
    padding-top: 24px;
    padding-bottom: 16px;
  }
}
.userInfo {
  display: flex;
  align-items: center;
  .name {
    font-weight: bold;
    margin-right: 10px;
  }
  .dept {
    font-size: 12px;
    color: #909090;
  }
}
</style>
