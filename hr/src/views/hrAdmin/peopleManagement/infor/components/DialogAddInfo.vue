<template>
  <Dialog v-model="state.visible" :title="type == 'add' ? '添加' : '编辑'" style="width: 800px">
    <el-form
      class="dialogForm"
      ref="formRef"
      v-loading="state.loading"
      :model="state.formData"
      :rules="state.rules"
      label-width="130px"
    >
      <div class="flex-column flex-container">
        <div class="bgImg" v-if="!state.formData.jobFlag && state.formData.id"></div>
        <div class="flex-row">
          <div class="flex-column flex-center">
            <div>
              <UploadImg
                :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PERSON_MANAGE"
                width="200px"
                height="200px"
                v-model="state.formData.imgUrl"
              />
            </div>
            <div
              ><el-switch
                :disabled="!state.formData.jobFlag && state.formData.id"
                v-model="state.formData.jobFlag"
                inline-prompt
                active-text="在职"
                inactive-text="离职"
            /></div>
          </div>
          <div class="flex-column">
            <el-form-item label="姓名：" prop="name">
              <el-input
                class="dialogFormItemWidth"
                v-model="state.formData.name"
                placeholder="请输入姓名"
              />
            </el-form-item>

            <el-form-item label="工号：" prop="employeeId">
              <el-input
                class="dialogFormItemWidth"
                v-model="state.formData.employeeId"
                placeholder="请输入工号"
              />
            </el-form-item>

            <el-form-item label="性别：" prop="gender">
              <el-select
                style="width: 200px"
                v-model="state.formData.gender"
                placeholder="请选择性别"
                clearable
              >
                <el-option
                  v-for="dict in genderOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="手机号码：" prop="phone">
              <el-input
                class="dialogFormItemWidth"
                v-model="state.formData.phone"
                placeholder="请输入手机号"
              />
            </el-form-item>
            <el-form-item label="出生日期：:" prop="birthDate">
              <el-date-picker
                v-model="state.formData.birthDate"
                class="!w-240px"
                placeholder="出生日期："
                type="date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
        </div>
        <el-divider> 试用期信息</el-divider>
        <el-form-item label="是否转正：" prop="probationStu">
          <el-radio-group v-model="state.formData.probationStu">
            <el-radio v-for="(option, index) in radioOptions" :key="index" :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="flex-row">
          <el-form-item label="开始日期" prop="probationStartTime">
            <el-date-picker
              v-model="state.formData.probationStartTime"
              class="!w-200px"
              placeholder="请选择开始日期"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item
            :label="state.formData.probationStu == 0 ? '预计结束日期' : '结束日期'"
            prop="probationEndTime"
          >
            <el-date-picker
              v-model="state.formData.probationEndTime"
              class="!w-200px"
              placeholder="请选择预计结束日期"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>

        <el-divider />
        <div>
          <el-form-item label="户口所在地" prop="local">
            <el-tree-select
              v-model="state.formData.local"
              :data="areaList"
              check-strictly
              node-key="code"
              :props="defaultProps"
              :render-after-expand="false"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <el-tree-select
              v-model="state.formData.departmentId"
              :data="departmentTreeData"
              check-strictly
              node-key="id"
              :props="defaultProps"
              :render-after-expand="false"
              style="width: 240px"
            />
          </el-form-item>

          <div class="flex-row">
            <el-form-item label="是否负责人：" prop="headFlag">
              <el-radio-group v-model="state.formData.headFlag">
                <el-radio
                  v-for="(option, index) in headFlagRadioOptions"
                  :key="index"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否HR：" prop="hrFlag">
              <el-radio-group v-model="state.formData.hrFlag">
                <el-radio
                  v-for="(option, index) in headFlagRadioOptions"
                  :key="index"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="flex-row">
            <el-form-item label="所属公司" prop="companyName">
              <el-select
                style="width: 200px"
                v-model="state.formData.companyName"
                placeholder="请选择公司"
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
            <el-form-item label="职务" prop="job">
              <el-select
                style="width: 200px"
                v-model="state.formData.job"
                placeholder="请选择职务"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DUTIES)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex-row">
            <el-form-item label="入职日期" prop="joinTime">
              <el-date-picker
                v-model="state.formData.joinTime"
                class="!w-200px"
                placeholder="请选择入职日期"
                type="date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="离职日期" prop="leaveTime">
              <el-date-picker
                :disabled="state.formData.jobFlag"
                v-model="state.formData.leaveTime"
                class="!w-200px"
                placeholder="请选择离职日期"
                type="date"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </div>
          <div class="flex-row">
            <el-form-item label="最高学历" prop="education">
              <el-select
                style="width: 200px"
                v-model="state.formData.education"
                placeholder="请选择最高学历"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_EDUCATION)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="最高学位" prop="academicDegree">
              <el-select
                style="width: 200px"
                v-model="state.formData.academicDegree"
                placeholder="请选择最高学位"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_ACADEMIC_DEGREE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="备注" prop="remark">
            <el-input
              class="dialogFormItemWidth"
              v-model="state.formData.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button :disabled="state.loading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="state.visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import { debounce } from 'lodash-es'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import { getInfo, addUserInfo, updateUserInfo } from '@/api/hrAdmin/peopleManagement/index'
import { getAreaListTree } from '@/api/common/index'
import type { FormRules } from 'element-plus'
const message = useMessage() // 消息弹窗

const genderOptions = ref([
  { label: '男', value: 1 },
  { label: '女', value: 0 }
])

const radioOptions = ref([
  { value: 0, label: '未转正' },
  { value: 1, label: '转正' },
  { value: 2, label: '无试用期' }
])

const headFlagRadioOptions = ref([
  { value: '0', label: '是' },
  { value: '1', label: '不是' }
])

const defaultProps = ref({
  children: 'children',
  label: 'name'
})

const props = defineProps({
  type: String,
  reload: Function,
  departmentTreeData: Array
})

// dom
const formRef = ref()

const state = reactive({
  visible: false,
  loading: false,
  // form 数据
  formData: {
    id: undefined,
    name: undefined,
    jobFlag: true, //在职状态
    gender: undefined, //性别
    phone: undefined, //手机号
    birthDate: undefined, //出生日期
    probationStu: 0, //试用期状态 0未转正 1转正
    local: undefined, //户口所在地
    employeeId: undefined, // 工号
    departmentId: undefined, //部门
    headFlag: '1', //是否负责人
    hrFlag: '1', //是否hr
    companyName: undefined, //所属公司
    job: undefined, //职务
    joinTime: '', //入职日期
    leaveTime: '', //离职日期
    education: undefined, //最高学历
    academicDegree: undefined, //最高学位
    remark: undefined, //备注,
    imgUrl: undefined, //头像,
    probationStartTime: undefined, //开始日期
    probationEndTime: undefined //结束日期
  },
  rules: reactive<FormRules<any>>({
    name: [{ required: true, message: '名称不能为空', trigger: ['change'] }],
    employeeId: [{ required: true, message: '工号不能为空', trigger: ['change'] }]
  }),

  id: '' // id
})

// 开启弹窗
const open = (id) => {
  state.visible = true
  initArea()
  if (id) {
    state.id = id
    getDetail(id)
  } else {
    state.formData = {
      id: undefined,
      name: undefined,
      jobFlag: true, //在职状态
      gender: undefined, //性别
      phone: undefined, //手机号
      birthDate: undefined, //出生日期
      probationStu: 0, //试用期状态 0未转正 1转正
      local: undefined, //户口所在地
      employeeId: undefined, // 工号
      departmentId: undefined, //部门
      headFlag: '1', //是否负责人
      hrFlag: '1', //是否hr
      companyName: undefined, //所属公司
      job: undefined, //职务
      joinTime: '', //入职日期
      leaveTime: '', //离职日期
      education: undefined, //最高学历
      academicDegree: undefined, //最高学位
      remark: undefined, //备注,
      imgUrl: undefined, //头像,
      probationStartTime: undefined, //开始日期
      probationEndTime: undefined //结束日期
    }
  }
}
const areaList = ref()

const initArea = async () => {
  try {
    const res = await getAreaListTree()
    areaList.value = res || []
  } catch (error) {
    console.log(error)
  }
}

watchEffect(() => {
  const newValue = state.formData.probationStartTime
  if (!state.formData.id) {
    if (state.formData.probationStu == 0 && newValue) {
      // 在这里进行日期计算和格式化
      const date = new Date(newValue)
      date.setMonth(date.getMonth() + 3)
      const formattedDate = date.toISOString().split('T')[0] // 获取 YYYY-MM-DD 格式的日期
      // @ts-ignore
      state.formData.probationEndTime = formattedDate
      console.log(formattedDate) // 在控制台输出格式化后的日期，你可以根据需要进行后续操作
    }
    if (state.formData.probationStu != 0) {
      state.formData.probationEndTime = undefined
    }
  }
})

// 添加
const submitForm = debounce(async () => {
  console.log(state.formData.local, 'state.formData.local')
  formRef.value.validate(async (valid) => {
    if (valid) {
      const midJobFlag = state.formData.jobFlag ? 0 : 1
      let content = `员工是否确定离职`
      let statusT = '请谨慎操作，该操作不可逆'

      if (midJobFlag == 1) {
        await message.delConfirm(content, statusT)
      }
      const params: any = {
        ...state.formData,
        joinTime: undefined,
        leaveTime: undefined,
        jobFlag: midJobFlag
      }
      // 2024-07-11
      if (state.formData.joinTime) {
        const arr = state.formData.joinTime.split('-')
        console.log(arr, '!!!!!')
        params.joinYear = arr[0]
        params.joinMonth = arr[1]
        params.joinDay = arr[2]
      }
      if (state.formData.leaveTime) {
        const arr = state.formData.leaveTime.split('-')
        params.leaveYear = arr[0]
        params.leaveMonth = arr[1]
        params.leaveDay = arr[2]
      }

      if (props.type == 'add') {
        const res = await addUserInfo(params)
        message.success(res)
        if (props.reload) props.reload()
        formRef.value.resetFields()
        state.visible = false
      } else {
        const res = await updateUserInfo(params)
        message.success(res)
        if (props.reload) props.reload()
        state.visible = false
        formRef.value.resetFields()
        if (props.reload) props.reload()
      }
    }
  })
}, 200)

// 关闭弹窗
const close = () => {
  state.visible = false
}

// 获取详情
const getDetail = async (id) => {
  console.log('getDetail')
  const res = await getInfo({ employeeId: id })

  const params = {
    ...res,
    jobFlag: res.jobFlag == 0
  }
  // 特殊处理时间
  if (res.joinYear) {
    params.joinTime = `${res.joinYear}-${res.joinMonth}-${res.joinDay}`
  }
  if (res.leaveYear) {
    params.leaveTime = `${res.leaveYear}-${res.leaveMonth}-${res.leaveDay}`
  }

  state.formData = params
}

defineExpose({ open, close })
</script>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-center {
  align-items: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
}

.flex-container {
  position: relative;
}
.bgImg {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 400px;
  left: 50%;
  margin-left: -150px;
  background-image: url('../../../../../assets/imgs/leave.png');
  background-size: 100% auto;
}
</style>
