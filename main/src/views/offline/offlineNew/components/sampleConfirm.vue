<template>
  <scheme-details ref="detailsRef" name="OfflineNew" :width="936">
    <template #card>
      <!-- <div> 详情内容区(外围卡片样式无需书写) </div> -->
      <div style="display: flex; height: 100%">
        <div
          class="left"
          style="width: 276px; margin-right: 16px; background-color: #fff; border-radius: 10px"
        >
          <div
            class="header"
            style="
              padding: 16px 20px;
              display: flex;
              align-items: center;
              border-bottom: solid 1px #f0f0f0;
              box-sizing: border-box;
            "
          >
            <div style="background: #0064ff; width: 3px; height: 10px"></div>
            <div style="font-size: 14px; color: #333333; font-weight: 600; padding-left: 6px"
              >审核记录</div
            >
          </div>
          <div class="record-content">
            <versionRecord
              :list="list"
              :active="selectIndex"
              @choose="chooseVersion"
            ></versionRecord>
          </div>
        </div>
        <div class="right" style="flex: 1; background-color: #fff; border-radius: 10px">
          <div
            class="header"
            style="
              padding: 16px 20px;
              display: flex;
              align-items: center;
              border-bottom: solid 1px #f0f0f0;
              box-sizing: border-box;
            "
          >
            <div style="background: #0064ff; width: 3px; height: 10px"></div>
            <div style="font-size: 14px; color: #333333; font-weight: 600; padding-left: 6px"
              >基本信息</div
            >
          </div>
          <div class="form-content" style="padding: 24px 0px 20px 20px">
            <el-form ref="formRef" :model="dataValue" label-width="80px" :rules="formRules">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="productName" label="样工">
                    <line-staffs
                      v-model="assignData.sampleWorkerList"
                      disabled
                      showDisabledBg
                      :tags="1"
                    ></line-staffs>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="sampleGarmentStyleNumber" label="分配时间">
                    <el-input v-model="assignData.assignTime" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="remark" label="备注">
                    <s-text-area
                      v-model="assignData.sampleWorkerRemark"
                      :autosize="{ minRows: 4, maxRows: 7 }"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="remark" label="打样备注">
                    <s-text-area
                      v-model="dataValue.remark"
                      :autosize="{ minRows: 4, maxRows: 7 }"
                      style="width: 100%"
                      maxlength="200"
                      show-word-limit
                      :disabled="selectIndex !== list?.length - 1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="attachmentUrl" label="附件上传">
                    <transfer
                      multiple
                      acceptType="all"
                      style="width: 100%"
                      v-model="dataValue.attachmentUrl"
                      :limit="5"
                      tip="文件大小不超过5M"
                      :disabled="selectIndex !== list?.length - 1"
                    ></transfer>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        :disabled="loading"
        v-if="selectIndex === list?.length - 1"
        >打样确认</el-button
      >
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'OfflineNewDetails' }
</script>

<script lang="tsx" setup>
import { defineAsyncComponent } from 'vue'
import STextArea from '@/components/common/input/s-textarea.vue'
import { FromProvideType } from '@/components/template/config/type'
import versionRecord from './versionRecord.vue'
// import { viewTypeCheck } from '@/components/template/config/index'
import { cloneDeep, debounce } from 'lodash-es'
// import timeline from './timeline.vue'
// import { DataItem } from '../page/config'
// import specColorDialog from '../components/specColorDialog.vue'
import request from '@/config/axios'
import { formatTime } from '@/utils'

const message = useMessage()

const { onSearch } = inject(`OfflineNewForm`) as FromProvideType
class DataItem {
  baseInfoId: string = ''
  attachmentUrl: string = ''
  remark: string = ''
  currentNodeCode: string = ''
}
const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => '样衣确认')
const list = ref<any>([]),
  selectIndex = ref(0)
const formRules = ref({
  // productName: [{ required: true, message: '请输入品名', trigger: 'blur' }],
  // styleChart: [{ required: true, message: '请上传款式图', trigger: 'change' }],
  // productCode: [{ required: true, message: '请输入货品编码', trigger: 'blur' }],
  // category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  // specSizeCodes: [{ required: true, message: '请选择规格码', trigger: 'change' }],
  // specNameCode: [{ required: true, message: '请添加规格名称', trigger: 'change' }]
  // offlineNpSkuDetailList: [{ required: true, message: 'SKU不能为空', trigger: 'change' }]
})

const assignData = ref<any>({}),
  logList = ref([])
// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  list.value = []
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      // await getSupplierList()
      const { baseInfoId, currentNodeCode } = item
      const res = await request.get({
        url: `/api/offline/np/process/getSampleWorkerConfirmInfo/${baseInfoId}`,
        params: {}
      })
      if (res) {
        assignData.value = {
          sampleWorkerList: res?.sampleWorkerList || [],
          assignTime: res?.assignTime ? formatTime(res.assignTime, 'yyyy-MM-dd HH:mm:ss') : '-',
          sampleWorkerRemark: res?.remark || '-'
        }
        if (res?.offlineNpSampleConfirmList) {
          list.value = res?.offlineNpSampleConfirmList
        }
        // 增加新的版本
        list.value?.push({})
        // 当前选中为新的版本号下标
        selectIndex.value = list?.value?.length - 1 || 0
        dataValue.value = {
          ...new DataItem(),
          baseInfoId,
          currentNodeCode,
          remark: res?.sampleRemark || '',
          attachmentUrl: res?.sampleAttachmentUrl || ''
        }
        logList.value = res?.offlineNpSampleAuditLogVOList || []
        // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
        bukValue.value = cloneDeep({ ...dataValue.value })
      }
      viewType.value = type
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
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  valid && submit()
}

// 实际提交（防抖）
const submit = debounce(async () => {
  if (loading.value) return
  await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
  loading.value = true
  const { baseInfoId, currentNodeCode, remark, attachmentUrl } = dataValue.value
  const offlineNpSampleConfirmDTO = {
    remark: remark || '',
    attachmentUrl: attachmentUrl || '',
    serialNumber: selectIndex.value + 1
  }
  const data = {
    nodeCode: currentNodeCode || '',
    baseInfoId: baseInfoId || '',
    offlineNpSampleConfirmDTO
  }
  request
    .post({
      url: `/api/offline/np/process/submitNode`,
      data
    })
    .then(() => {
      message.success('操作成功')
      detailsRef?.value?.closed()
      onSearch()
    })
    .finally(() => {
      loading.value = false
    })
}, 500)

defineExpose({ openView })

provide('OfflineNewDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

const chooseVersion = (index: number) => {
  if (selectIndex.value === list?.value?.length - 1) {
    list.value[selectIndex.value] = dataValue.value
  }
  selectIndex.value = index
  dataValue.value = {
    baseInfoId: bukValue?.value?.baseInfoId || '',
    currentNodeCode: bukValue?.value?.currentNodeCode || '',
    remark: list?.value?.[index]?.remark || (index === list?.value?.length - 1 ? '' : '-'),
    attachmentUrl: list?.value?.[index]?.attachmentUrl || ''
  }
}
</script>
<style lang="scss" scoped>
// @use './styles.scss';
.right-operate {
  position: relative;
}
:deep() {
  .card_info {
    background: transparent !important;
    .el-card__body {
      padding: 0 !important;
    }
  }
  .el-form-item {
    margin: 0 20px 16px 0 !important;
  }
}
.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}

.record-content {
  padding: 16px;
  height: calc(100vh - 215px);
  overflow: auto;
}
</style>
