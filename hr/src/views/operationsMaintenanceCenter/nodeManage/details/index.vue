<template>
  <scheme-details ref="detailsRef" name="NodeManage" :width="968">
    <template #card>
      <div class="drawerContent">
        <el-form
          class="dialogForm"
          ref="formRef"
          v-loading="loading"
          :model="dataValue"
          :rules="formRules"
          label-width="155px"
        >
          <el-form-item label="节点类型" prop="type">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{
                getDictLabel(DICT_TYPE.YINGDAO_NOTE_TYPE, dataValue.type)
              }}</div>
            </div>
            <el-select
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.type"
              placeholder="请选择节点类型"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_NOTE_TYPE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="机器人名称" prop="robotClientName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.robotClientName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.robotClientName"
              placeholder="请输入机器人名称"
            />
          </el-form-item>
          <el-form-item label="机器人uuid" prop="robotClientUuid">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.robotClientUuid }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.robotClientUuid"
              placeholder="请输入机器人uuid"
            />
          </el-form-item>

          <el-form-item label="机器人状态" prop="status">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{
                getDictLabel(DICT_TYPE.YINGDAO_ROBOT_STATUS, dataValue.status)
              }}</div>
            </div>
            <el-select
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.status"
              placeholder="请选择机器人状态"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_ROBOT_STATUS, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器名称" prop="machineName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.machineName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.machineName"
              placeholder="请输入服务器名称"
            />
          </el-form-item>
          <el-form-item label="服务器IP" prop="clientIp">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.clientIp }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.clientIp"
              placeholder="请输入服务器IP"
            />
          </el-form-item>
          <el-form-item label="服务器账号" prop="windowsUserName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.windowsUserName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              :disabled="isBusinessNode"
              v-model="dataValue.windowsUserName"
              placeholder="请输入服务器账号"
            />
          </el-form-item>
          <el-form-item label="服务器密码" prop="windowsPassWord">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.windowsPassWord }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.windowsPassWord"
              placeholder="请输入服务器密码"
            />
          </el-form-item>
          <el-form-item label="影刀登录账号" prop="loginUserName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.loginUserName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.loginUserName"
              placeholder="请输入影刀登录账户"
            />
          </el-form-item>
          <el-form-item label="影刀登录密码" prop="loginPassWord">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.loginPassWord }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.loginPassWord"
              placeholder="请输入影刀登录密码"
            />
          </el-form-item>
          <el-form-item label="影刀用户名" prop="yingdaoUserName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.yingdaoUserName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.yingdaoUserName"
              placeholder="请输入用户名"
            />
          </el-form-item>

          <el-form-item label="节点简称" prop="nickName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.nickName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.nickName"
              placeholder="请输入节点简称"
            />
          </el-form-item>

          <el-form-item label="todesk账号" prop="todeskUserName">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.todeskUserName }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.todeskUserName"
              placeholder="请输入todesk账号"
            />
          </el-form-item>
          <el-form-item label="todesk密码" prop="todeskPassWord">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.todeskPassWord }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.todeskPassWord"
              placeholder="请输入todesk密码"
            />
          </el-form-item>
          <el-form-item label="迁移码" prop="migrationCode">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.migrationCode }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.migrationCode"
              placeholder="请输入迁移码"
            />
          </el-form-item>
          <el-form-item label="统一登录应用UUID" prop="yingyongUuid">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.yingyongUuid }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.yingyongUuid"
              placeholder="请输入统一登录应用UUID"
            />
          </el-form-item>
          <el-form-item label="影刀应用路径" prop="appsPath">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.appsPath }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="dataValue.appsPath"
              placeholder="请输入影刀应用路径"
            />
          </el-form-item>
          <el-form-item label="机器人备注" prop="description">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.description }}</div>
            </div>
            <s-text-area
              v-else
              :disabled="isBusinessNode"
              :autosize="{ minRows: 3, maxRows: 4 }"
              class="dialogFormItemWidth"
              v-model="dataValue.description"
              placeholder="请输入机器人备注"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <div v-if="isView" class="seeBg">
              <div class="seeBg-text">{{ dataValue.remark }}</div>
            </div>
            <s-text-area
              v-else
              :autosize="{ minRows: 3, maxRows: 4 }"
              class="dialogFormItemWidth"
              v-model="dataValue.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()">取 消</el-button>
      <el-button v-if="!isView" :disabled="loading" type="primary" @click="submitForm">
        {{ viewType === 'add' ? '提交' : '保存' }}
      </el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'NodeManageDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep } from 'lodash-es'
import { DataItem } from '../page/config'
import STextArea from '@/components/common/input/s-textarea.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'

const message = useMessage()

const { onSearch } = inject(`NodeManageForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<'add' | 'edit' | 'view'>('view'),
  loading = ref<boolean>(false)

const title = computed(() => {
  if (viewType.value === 'add') return '新增节点'
  if (viewType.value === 'edit') return '编辑节点'
  return '查看节点'
})

const isView = computed(() => viewType.value === 'view')
const isBusinessNode = computed(() => Number(dataValue.value.type) === 1)

const formRules = reactive({
  type: [{ required: true, message: '请选择节点类型', trigger: 'change' }],
  loginUserName: [{ required: true, message: '影刀登录账号不能为空', trigger: 'blur' }],
  todeskUserName: [{ required: true, message: 'todesk账号不能为空', trigger: 'blur' }],
  todeskPassWord: [{ required: true, message: 'todesk密码不能为空', trigger: 'blur' }],
  yingyongUuid: [{ required: true, message: '统一登录应用UUID不能为空', trigger: 'blur' }]
})

const resetForm = () => {
  dataValue.value = { ...new DataItem() }
  formRef.value?.resetFields()
}

const fetchDetail = async (id: string) => {
  loading.value = true
  try {
    const data = await NodeManageAccountApi.getNodeManageDetail(id)
    if (data) {
      dataValue.value = {
        ...new DataItem(),
        ...data,
        type: data?.type ? `${data.type}` : '',
        status: data?.status ? `${data.status}` : ''
      }
    }
  } finally {
    loading.value = false
  }
}

const openView = (item: any = {}, type: string = 'view') => {
  detailsRef.value?.openDrawer(
    async () => {
      resetForm()
      viewType.value = (type as any) || 'view'
      if (type === 'add') {
        dataValue.value = { ...new DataItem() }
      } else if (item?.id) {
        await fetchDetail(item.id)
      } else {
        dataValue.value = { ...new DataItem(), ...item }
      }
      bukValue.value = cloneDeep({ ...dataValue.value })
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  )
}

const submitForm = async () => {
  if (isView.value) return
  const valid = await formRef.value?.validate()
  if (!valid) return
  loading.value = true
  try {
    const payload: any = { ...dataValue.value }
    if (viewType.value === 'add') {
      payload.id = undefined
      await NodeManageAccountApi.saveNodeManage(payload)
      message.success('新增成功')
    } else {
      await NodeManageAccountApi.updateNodeManage(payload)
      message.success('修改成功')
    }
    bukValue.value = cloneDeep({ ...dataValue.value })
    detailsRef.value?.close()
    onSearch()
  } finally {
    loading.value = false
  }
}

defineExpose({ openView })

provide('NodeManageDetails', { dataValue, bukValue, viewType, title })
</script>

<style lang="scss" scoped>
@use './styles.scss';

.drawerContent {
  width: 100%;
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.seeBg {
  width: 100%;
  min-height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
  box-sizing: border-box;

  &-text {
    font-size: 14px;
    color: #333333;
    line-height: 32px;
    padding: 0 12px;
  }
}

.dialogFormItemWidth {
  width: 100%;
}

::deep(.el-textarea__inner),
::deep(.el-input__wrapper),
::deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}
</style>
