<template>
  <Dialog v-model="drawerVisible" :title="drawerTitle" width="500px">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="130" :rules="fromRules" ref="formRef">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题处理部门" prop="handleDept">
              <el-select class="!w300px" v-model="formParams.handleDept" placeholder="请选择问题处理部门" filterable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="品类" prop="category">
              <el-select class="!w300px" v-model="formParams.category" placeholder="请选择品类" filterable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="反馈类型" prop="type">
              <el-select class="!w300px" v-model="formParams.type" placeholder="请选择反馈类型" filterable>
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true)" :key="item.value"
                  :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题对接负责人" prop="directorId">
              <!-- <SelectUser v-model="formParams.directorId" :multiple="false" ref="selectUserRef" class="!w300px" /> -->
               <el-select class="!w300px" popper-class="eloption" :popper-append-to-body="true" v-model="formParams.directorId"
                placeholder="请选择" filterable clearable  @change="userChange" remote :remote-method="remoteMethod">
                <template #label>
                  <div class="label-wrapper">
                    <img class="avatorLogo" :src="formParams.avatarOrigin || DefaultAvatar" alt="" />
                    <span class="name">{{ formParams.directorName }} </span>
                  </div>
                </template>
                <el-option v-for="dict in peopleList" :key="dict.userId" :label="dict.userName"
                  :value="dict" value-key="userId">
                  <div class="peopleOption">
                    <div class="left-wapper">
                      <img class="img" :src="dict.avatarOrigin || DefaultAvatar" alt="" />
                      <div class="info">
                        <span class="text name">{{ dict.userName }}</span>
                        <!-- <span class="text desc">{{ dict.departmentName || '--' }}</span> -->
                      </div>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button @click="submit" type="primary" class="mr20px">提交</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as prolemContactApi from '@/api/customerService/problemContact'
import SelectUser from '@/components/common/user/selectUser.vue';
import {Record} from '@/api/customerService/problemContact/problemContact'
import {Dialog} from  '@/components/Dialog/index'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import request from '@/config/axios';
const message = useMessage()
const selectUserRef = ref <InstanceType<typeof SelectUser>> ()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const formParams = ref<Partial<Record>>({
  category: '',
  type: '',
  handleDept: '',
  directorId: '',
})
const open = async (type, id) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'create' ? '新增' : '编辑'
  if (id) {
    try {
      drawerLoading.value = true
      const data = await prolemContactApi.getConfigById(id)
      console.log("data",data)
      if (data) {
        formParams.value = data
      }
      selectUserRef.value?.focusOn()
    } finally {
      drawerLoading.value = false
    }
  }
}

// 请求参数
const director = ref()
const formRef = ref()
const fromRules = reactive({
  category: [{ required: true, message: '请选择品类', trigger: 'blur' }],
  type: [{ required: true, message: '请选择反馈类型', trigger: 'blur' }],
  handleDept: [{ required: true, message: '请选择问题处理部门', trigger: 'blur' }],
  directorId: [{ required: true, message: '请选择问题对接负责人', trigger: 'blur' }],
})
const submit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  try {

    const params = { ...formParams.value }
    if (drawerType.value === 'create') {
      await prolemContactApi.addConfig(params)
    } else {
      await prolemContactApi.editConfig(params)
    }
    message.success('保存成功')
    reset()
    emits('success')
  } finally {
  }
}

// 选择用户
const peopleList = ref<any>([])
const userChange = (val) => {
  console.log("val",val)
  if (!val){
    formParams.value.directorId = ''
    formParams.value.directorName = ''
    formParams.value.avatarOrigin = ''
    return
  }
  formParams.value.directorId = val.userId
  formParams.value.directorName = val.userName
  formParams.value.avatarOrigin = val.avatarOrigin
}
const remoteMethod = (val: string) => {
  request.get({
    url: `/api/csProblemContactPersonConfig/getPersonnelData?userName=${val}&queryType=1`,
    method: 'get',
  }).then((res) => {
    peopleList.value = res || []
  }).catch((error) => {
    // message.error(error.message)
  })
}

const reset = () => {
  director.value = null
  formRef.value?.resetFields()
  drawerVisible.value = false
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
}

.user {
  display: flex;
  align-items: center;

  .ava {
    margin-right: 10px;
  }
}

// 上传人选择器
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

// 下拉选项样式
.peopleOption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

  .left-wapper {
    display: flex;
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

// 选择的人样式
.label-wrapper {
  display: flex;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;
  width: fit-content;
  .name {
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
}
</style>
