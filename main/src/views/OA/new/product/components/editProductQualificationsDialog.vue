<template>
  <div>
    <SWDrawer v-if="visible" v-model="visible" :title="title" :width="isShowExamineRecordList? '1200':'936'">
      <div class="content" v-loading="recordLoading">
        <div v-if="isShowExamineRecordList" class="dialog-content left">
          <EditGoodInfoProductAudit :examineRecords="examineRecordList" :recordLoading="recordLoading"/>
        </div>
        <div class="dialog-content right">
          <EditGoodInfoProductQualificaton
            ref="EditGoodInfoProductQualificatonRef"
            :isEditInfo="true"
            :onShow="isAudit ? true : false"
            :forbidEdit="forbidEdit"
            @confirm="confirm"
          />
        </div>
        
      </div>
      <template #footer>
        <el-button @click="handleClose">关闭</el-button>
        <el-button v-if="!forbidEdit && !isAudit" @click="confirmDialog(true)" class="templeSaveBtn"
          >暂存</el-button
        >
        <el-button v-if="!forbidEdit && !isAudit" type="primary" @click="confirmDialog(false)"
          >提交</el-button
        >
        <div style="width: 20px"></div>
      </template>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { handleJSONParse } from '@/views/OA/new/product/utils.js'
import EditGoodInfoProductQualificaton from './editGoodInfoProductQualificaton.vue'
import EditGoodInfoProductAudit from './editGoodInfoProductAudit.vue'
import { getDesignDetailById } from '@/api/oa/new/designGallery/index'

import { debounce } from 'lodash-es'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '868px'
  },
  isAudit: {
    type: Boolean,
    required: false
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})

const { dicList } = useDicList()

const listDic = ref([])

const EditGoodInfoProductQualificatonRef = ref()

const dialogWidth = ref('868px')

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const nodeData = ref<any>({})

// 打开
const open = async (data: any) => {
  visible.value = true
  if (data) {
    nodeData.value = { ...data }
    dialogWidth.value = '936px'
    setTimeout(() => {
      EditGoodInfoProductQualificatonRef.value?.open(nodeData.value)
    }, 30)
    getDesignDetail()
  }
}

// 审核记录 没有nodeCode或者nodeCode 为QAQualificationExamine 展示
const examineRecordList = ref([])
const isShowExamineRecordList = ref(false)
const recordLoading = ref(false)
const getDesignDetail = async () => {
  examineRecordList.value = []
  recordLoading.value = true
  try{
    const res = await getDesignDetailById(nodeData.value.npDesignPictureGodownId)
    if (res && res.qualificationExamineRecords) {
      examineRecordList.value = handleJSONParse(res.qualificationExamineRecords) || []
      examineRecordList.value = examineRecordList.value.filter((li:any)=>li.nodeCode === 'QAQualificationExamine' || !li.nodeCode )
      isShowExamineRecordList.value = examineRecordList.value.length > 0
    }
  }finally{
    recordLoading.value = false
  }
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const confirmDialog = debounce(async (isTempSave) => {
  EditGoodInfoProductQualificatonRef.value?.productinformationFillingConfirm(isTempSave)
})

const confirm = () => {
  emit('confirm')
  visible.value = false
}
</script>

<style lang="scss" scoped>
.content{
  width: 100%;
  display: flex;
  .left{
    margin-right: 18px;
    width: 296px;
  }
  .right{
    flex: 1;
  }
}
.dialog-content {
  background: #ffffff;
  border-radius: 8px;
  // margin: 0 auto;
  // margin-top: -20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  // overflow: auto;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  .form-wapper {
    display: flex;
    flex-direction: column;
    // margin-top: -20px;
    &-header {
      height: 52px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 20px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 16px;
      &-line {
        width: 3px;
        height: 10px;
        background: #0064ff;
      }
      &-title {
        padding-left: 6px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: normal;
        color: #333333;
      }
    }
    &-form {
      margin-left: 20px;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
}
</style>
