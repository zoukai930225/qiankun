<template>
  <scheme-details
    class="bonus-details"
    ref="detailsRef"
    name="GcBonusList"
    :title="title"
    :width="936"
  >
    <template #card>
      <div class="card-sec-tit">基本信息</div>
      <el-form
        ref="formRef"
        :model="dataValue"
        :rules="rules"
        inline
        label-width="84px"
        class="bonus-form"
      >
        <el-form-item label="所属模块" prop="module">
          <el-input v-model="moduleName" placeholder="请输入所属模块" disabled />
        </el-form-item>
        <el-form-item label="所属月份" prop="month">
          <el-date-picker
            v-model="dataValue.month"
            type="month"
            placeholder="请选择所属月份"
            value-format="YYYY-MM"
            format="YYYY-MM"
            :disabled="viewType === 'edit' || viewType === 'view'"
          />
        </el-form-item>
        <el-form-item label="作品ID" prop="workId">
          <el-input
            v-model="dataValue.workId"
            placeholder="请输入作品ID"
            maxlength="100"
            show-word-limit
            :disabled="viewType === 'edit' || viewType === 'view'"
          />
        </el-form-item>

        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            v-model="dataValue.publishDate"
            type="date"
            placeholder="请选择发布日期"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled="viewType === 'view'"
          />
        </el-form-item>

        <el-form-item label="GMV金额(元)" prop="gmv" class="no-wrap-item">
          <el-input-number
            v-model="dataValue.gmv"
            placeholder="请输入GMV金额"
            :precision="2"
            :min="0"
            :max="999999999.99"
            :controls="false"
            :disabled="viewType === 'view'"
          />
        </el-form-item>

        <el-form-item label="剪辑" prop="editorId">
          <el-select
            popper-class="eloption"
            :popper-append-to-body="true"
            v-model="dataValue.editorId"
            placeholder="请选择"
            clearable
            filterable
            :disabled="viewType === 'view'"
          >
            <template #label>
              <div class="label-wrapper">
                <img class="avatorLogo" :src="getUserInfo(dataValue.editorId)?.avatar" alt="" />
                <span class="name">{{ getUserInfo(dataValue.editorId)?.userName }} </span>
              </div>
            </template>
            <el-option
              v-for="dict in editorOptions"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            >
              <div class="peopleOption">
                <div class="left-wapper">
                  <img class="img" :src="dict.avatar" alt="" />
                  <div class="info">
                    <span class="text name">{{ dict.userName }}</span>
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="编导" prop="directorId">
          <el-select
            popper-class="eloption"
            :popper-append-to-body="true"
            v-model="dataValue.directorId"
            placeholder="请选择"
            clearable
            filterable
            :disabled="viewType === 'view'"
          >
            <template #label>
              <div class="label-wrapper">
                <img class="avatorLogo" :src="getUserInfo(dataValue.directorId)?.avatar" alt="" />
                <span class="name">{{ getUserInfo(dataValue.directorId)?.userName }} </span>
              </div>
            </template>
            <el-option
              v-for="dict in directorOptions"
              :key="dict.userId"
              :label="dict.userName"
              :value="dict.userId"
            >
              <div class="peopleOption">
                <div class="left-wapper">
                  <img class="img" :src="dict.avatar" alt="" />
                  <div class="info">
                    <span class="text name">{{ dict.userName }}</span>
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属分组" prop="groupId">
          <el-select
            v-model="dataValue.groupId"
            placeholder="请选择"
            :disabled="viewType === 'view'"
          >
            <el-option
              v-for="dict in groupOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据证明图片" prop="proofImgUrls" class="proof-img">
          <UploadTransfer
            v-model="dataValue.proofImgUrls"
            :limit="10"
            accept-type="image"
            :disabled="viewType === 'view'"
            :upload-data="{ code: 'BONUS_MANAGEMENT' }"
            value-type="string"
            tip="支持上传图片，截图需展示id+时间维度+数据，单个文件不超过20M，最多10张"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'GcBonusListDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem, GroupType } from '../page/config'
import request from '@/config/axios'
import UploadTransfer from '@/components/common/upload/transfer.vue'
import type { FormInstance, FormRules } from 'element-plus'
import dayjs from 'dayjs'
const message = useMessage()

const { onSearch, groupOptions } = inject(`GcBonusListForm`) as FromProvideType & {
  groupOptions: Ref<any[]>
}

const detailsRef = ref<any>()
const formRef = ref<FormInstance>()
const dataValue = ref<DataItem>({ ...new DataItem() })
const bukValue = ref<DataItem>({ ...new DataItem() })
const viewType = ref<string>('add')
const loading = ref<boolean>(false)
const originalId = ref<string>('') // 保存原始作品ID（编辑时使用）
const moduleCode = ref<string>('')
// 人员选项
const editorOptions = ref<any[]>([])
const directorOptions = ref<any[]>([])
const title = computed(() => {
  if (viewType.value === 'add') return '新增'
  if (viewType.value === 'edit') return '编辑'
  return '详情'
})
const moduleName = computed(() => {
  return moduleCode.value === GroupType.GC ? '挂车组' : '站内组'
})

// 表单验证规则
const rules = reactive<FormRules>({
  workId: [
    { required: true, message: '请输入作品ID', trigger: 'blur' },
    { max: 100, message: '作品ID长度不能超过100个字符', trigger: 'blur' }
  ],
  month: [{ required: true, message: '请选择所属月份', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  gmv: [{ required: true, message: '请输入GMV金额', trigger: 'blur' }],
  groupId: [{ required: true, message: '请选择所属分组', trigger: 'change' }],
  proofImgUrls: [{ required: true, message: '请上传数据证明图片', trigger: 'blur' }]
})

// 获取人员列表（用于回显）
const getUserOptions = async () => {
  try {
    const options = await request.get({
      url: `/api/nmBonusDict/getGroupUser`,
      params: { type: moduleCode.value === GroupType.GC ? '1' : '0', page: 1, pageSize: 9999 }
    })
    editorOptions.value = options
    directorOptions.value = options
  } catch (error) {
    console.error('获取字典项失败:', error)
  }
}
const getUserInfo = (userId: string) => {
  return editorOptions.value.find((person) => person.userId === userId)
}
// 弹出通用
const openView = (item: any = {}, type: string = 'add', module: string = '') => {
  moduleCode.value = module
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      viewType.value = type
      // 获取人员列表
      await getUserOptions()
      if (type === 'edit' || type === 'view') {
        dataValue.value = {
          ...item
        }
      } else {
        dataValue.value = {
          ...new DataItem(),
          month: dayjs().format('YYYY-MM')
        }
      }

      // 保存原始作品ID
      originalId.value = item.workId || ''

      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      bukValue.value = cloneDeep({ ...dataValue.value })
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  try {
    await formRef?.value?.validate()
    return true
  } catch (error) {
    return false
  }
}

// 提交
const submitForm = async () => {
  const valid = await checkValue()
  if (valid) {
    submit()
  }
}

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true

  try {
    // 处理图片数据 - 转换为JSON字符串
    const submitData = {
      ...dataValue.value,
      editorName: getUserInfo(dataValue.value.editorId)?.userName,
      editorAvatar: getUserInfo(dataValue.value.editorId)?.avatar,
      directorName: getUserInfo(dataValue.value.directorId)?.userName,
      directorAvatar: getUserInfo(dataValue.value.directorId)?.avatar,
      groupName: groupOptions.value.find((item: any) => item.value === dataValue.value.groupId)
        ?.label
    }
    delete submitData.bonusLevel
    delete submitData.directorBonus
    delete submitData.editorBonus
    delete submitData.registrantId
    delete submitData.registrantName
    const url = viewType.value === 'add' ? `/api/nmTrailerBonus/insert` : `/api/nmTrailerBonus/edit`

    await request.post({ url, data: submitData })

    message.success('操作成功')
    detailsRef?.value?.closed()
    onSearch()
  } catch (error: any) {
    message.error(error?.msg || '操作失败')
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}, 500)

defineExpose({ openView })

provide('GcBonusListDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
