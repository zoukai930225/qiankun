<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog
    v-model="visible"
    :width="width"
    :before-close="handleClose"
    class="oadialog-background"
    :append-to-body="true"
  >
    <div>
      <div
        class="dialog-content"
        style="
          width: 580px;
          height: auto;
          padding: 20px;
          padding-bottom: 0px;
          box-sizing: border-box;
        "
      >
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          style="max-width: 580px"
          :rules="rules"
        >
          <el-form-item label="运营负责人" prop="operateManageId">
            <template #label>
              <span class="custom-require">*</span>
              <span>运营负责人</span>
            </template>
            <SWSelectPeople
              :isEdit="!forbidEdit"
              v-model:modelValue="form[`operateManageIdList`]"
              :getSearchList="remoteMethod"
              @select-people-change="selectPeopleChange()"
            />
          </el-form-item>
          <el-form-item label="运营明细">
            <template #label>
              <span>运营明细</span>
            </template>
            <div style="display: flex; flex-direction: column; max-height: 50vh; overflow: auto">
              <div v-for="(value, index) in form.operateDetails" :key="index">
                <div class="row-center" style="margin-bottom: 10px">
                  <el-select
                    class="searchFormItemWidth"
                    style="width: 120px"
                    v-model="value.operateDetailChannel"
                    placeholder="请选择渠道"
                    clearable
                    :disabled="forbidEdit"
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                  <SWSelectPeople
                    style="margin-left: 12px"
                    :style="{ width: forbidEdit ? '320px' : '270px' }"
                    :isEdit="!forbidEdit"
                    v-model:modelValue="value[`operateDetailPersonList`]"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectDetailPeopleChange(value)"
                  />
                  <div
                    v-if="!forbidEdit"
                    @click="deleteClick(index)"
                    style="margin-left: 15px; cursor: pointer"
                  >
                    <img
                      style="width: 14px; height: 14px"
                      src="@/assets/imgs/otr/schemeSet/delete_icon.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!forbidEdit" class="addMoreBg">
              <div class="addMore" @click="addMoreClick">
                <el-icon class="addMore-icon" color="#0064ff" :size="12"><Plus /></el-icon>
                <div class="addMore-text">点击添加</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #header="{}">
      <div class="my-header">
        <img src="@/assets/imgs/oa/yangyishangchuan-title.png" class="shenhe-title" />
        <span>{{ dialogTitle }}</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'

import * as CommonApi from '@/api/common'
import { getDesignDetailById, updateOperateManageInfo } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: true
  },

  width: {
    type: String,
    default: '620px'
  }
})
const dialogTitle = ref('')
const form = reactive({
  operateManageId: undefined,
  operateManageIdList: undefined,
  operateDetails: []
})

const selectItem = ref()
const open = async (data: any) => {
  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  designData.value = {}
  form.operateManageId = undefined
  form.operateManageIdList = undefined
  form.operateDetails = []
  visible.value = true
  getDesignDetail()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const designData = ref()

const getDesignDetail = async () => {
  if (!selectItem.value.npDesignPictureGodownId) {
    return
  }
  const res = await getDesignDetailById(selectItem.value.npDesignPictureGodownId)
  designData.value = res || {}
  form.operateManageId = res.operateManageId || ''
  if (
    res.operateManageIdList &&
    typeof res.operateManageIdList === 'string' &&
    res.operateManageIdList !== ''
  ) {
    form.operateManageIdList = JSON.parse(res.operateManageIdList)
  } else {
    form.operateManageIdList = res.operateManageIdList || []
  }
  if (res.operateDetails && typeof res.operateDetails === 'string' && res.operateDetails !== '') {
    form.operateDetails = JSON.parse(res.operateDetails)
  } else {
    form.operateDetails = res.operateDetails || []
  }
  if (!form.operateDetails || form.operateDetails.length === 0) {
    form.operateDetails = [
      { operateDetailChannel: '', operateDetailPersonList: [], operateDetailPerson: '' }
    ]
  }
}

const rules = reactive({
  // examineRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const peopleList = ref([])
const remoteMethod = async (value) => {
  if (peopleList.value.length > 0) {
    return peopleList.value
  }
  const data = await CommonApi.getPersonByOpenId('1').catch(() => {})
  peopleList.value = data || []
  return data || []
}

// 更新选择的人
const selectPeopleChange = () => {
  const codeList = form && form[`operateManageIdList`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    form.operateManageId = userIds.join(',')
    form.operateManageIdList = codeList
  } else {
    form.operateManageId = undefined
    form.operateManageIdList = undefined
  }
}

// 更新明细选择的人
const selectDetailPeopleChange = (value) => {
  const codeList = value && value[`operateDetailPersonList`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    value[`operateDetailPerson`] = userIds.join(',')
    value[`operateDetailPersonList`] = codeList
  } else {
    value[`operateDetailPerson`] = undefined
    value[`operateDetailPersonList`] = undefined
  }
}

const handleClose = () => {
  form.operateManageId = undefined
  form.operateManageIdList = undefined
  form.operateDetails = []

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

// 点击添加
const addMoreClick = () => {
  form.operateDetails.push({
    operateDetailChannel: '',
    operateDetailPersonList: [],
    operateDetailPerson: ''
  })
}

// 删除按钮点击
const deleteClick = (index) => {
  if (index < form.operateDetails.length) {
    form.operateDetails.splice(index, 1)
  }
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  if (!form.operateManageId) {
    message.error('请选择运营主管')
    return
  }

  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...designData.value,
        ...form
      }
      await updateOperateManageInfo(data)
      message.success('操作成功')
      emit('confirm', data)
      emit('update:modelValue', false)
      handleClose()
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 6px;
    margin-top: 3px;
  }
}

.custom-require {
  color: red;
  margin-right: 3px;
  font-size: 15px;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}

.addMoreBg {
  margin-top: 15px;
  width: calc(100% - 45px);
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
</style>
