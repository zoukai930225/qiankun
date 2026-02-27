<!--
 * @Date: 2024-12-05 13:54:45
-->
<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" size="958" @close="reset" :close-on-click-modal="isAduit">
      <div class="drawer-wapper" v-loading="saveLoading">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">{{ isAduit ? '详情' : currentId ? '编辑' : '新增' }}</div>
            <img src="@/assets/imgs/system/fieldManageConfig/close.png" class="close" @click="reset" />
          </div>
          <!--  -->
          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>基本信息</span>
              </div>
              <!--  -->
              <el-form :inline="true" :model="formInline" ref="formRef" label-width="120px" :rules="itemRules">
                <div class="flex-row form-wapper">
                  <div style="flex-wrap: wrap; flex: 1" class="flex-row">
                    <el-form-item label="企划名称" prop="planName">
                      <el-input v-model="formInline.planName" placeholder="请输入企划名称" style="width: 300px"
                        :disabled="isAduit" />
                    </el-form-item>

                    <el-form-item label="企划类型" prop="planType">
                      <el-select v-model="formInline.planType" placeholder="请选择企划类型" style="width: 300px"
                        :disabled="isAduit">
                        <el-option label="计划" :value="0" />
                        <el-option label="临时" :value="1" />
                      </el-select>
                    </el-form-item>

                    <el-form-item label="店铺" prop="storeCode">
                      <!-- 店铺 -->
                      <StoreRangePlus style="width: 300px" v-model="formInline.storeCode" value-type="storeCode"
                        :showAllChannels="true" :width="300" :disabled="isAduit" @change="storeChange" />
                    </el-form-item>

                    <el-form-item label="计划上架日期" prop="planListDate">
                      <!-- 计划上架月份-->
                      <el-date-picker v-model="formInline.planListDate" type="date" style="width: 300px"
                        :value-format="'YYYY-MM-DD'" placeholder="请选择计划上架日期" :disabled="isAduit" />
                    </el-form-item>
                    <el-form-item props="planningTime" label="企划时间" prop="planningTime">
                      <!-- 企划时间 -->
                      <el-date-picker v-model="formInline.planningTime" type="monthrange" style="width: 280px"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :disabled="isAduit" />
                    </el-form-item>
                    <el-form-item props="planOrderDate" label="计划下单日期" prop="planOrderDate">
                      <!-- 计划下单日期 -->
                      <el-date-picker v-model="formInline.planOrderDate" type="date" style="width: 300px"
                        :value-format="'YYYY-MM-DD'" :disabled="isAduit" placeholder="请选择日期" />
                    </el-form-item>
                    <el-form-item label="包装范围" prop="packagingScope">
                      <el-select v-model="formInline.packagingScope" placeholder="请选择包装范围" style="width: 300px"
                        :disabled="isAduit">
                        <el-option label="通用" :value="0" />
                        <el-option label="特定" :value="1" />
                      </el-select>
                    </el-form-item>
                    <!-- 备注 -->
                    <el-form-item props="remark" label="备注">
                      <s-text-area v-model="formInline.remark" placeholder="请输入备注" style="width: 740px"
                        :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
                    </el-form-item>
                    <el-form-item label="参考图/其他" prop="">
                      <uploadImg v-model:modelValue="imageList" :disabled="isAduit" />
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            </div>
          </ContentWrap>

          <ContentWrap>
            <div class="form-wapper">
              <div class="flex-row header-wapper">
                <span class="icon"></span>
                <span>明细</span>
              </div>
              <!--  -->
              <el-form :inline="true" :model="formInlineDetails" ref="formDetailRef" label-width="120px">
                <el-form-item label="系列" prop="series">
                  <el-input v-model="formInlineDetails.series" placeholder="请输入系列" style="width: 300px"
                    :disabled="isAduit" />
                </el-form-item>
                <el-form-item label="系列备注" prop="seriesRemark">
                  <s-text-area v-model="formInlineDetails.seriesRemark" placeholder="请输入系列备注" style="width: 740px"
                    :autosize="{ minRows: 3, maxRows: 3 }" :disabled="isAduit" />
                </el-form-item>
              </el-form>
            </div>
          </ContentWrap>
          <div class="btn-wapper" v-if="!isAduit">
            <el-button @click="reset">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getNpDetail, saveNp } from '@/api/oa/package/plan/index'
import uploadImg from '@/components/SWUoloadFile/index.vue'
import { debounce } from 'lodash-es'
import { formattedDates } from '../utils.js'
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const saveLoading = ref(false) // 保存 loading
const imageList = ref<any>([]) // 图片

const props = defineProps({
  addType: {
    type: String,
    default: 'newGoods'
  }
})

const itemRules = ref({
  planName: [{ required: true, message: '请输入企划名称', trigger: 'blur' }],
  planType: [{ required: true, message: '请选择企划类型', trigger: 'blur' }],
  storeCode: [
    {
      required: true,
      message: '请选择企划类型',
      validator: () => {
        return true
      },
      trigger: 'blur'
    }
  ],
  planListDate: [{ required: true, message: '请选择计划上架日期', trigger: 'change' }],
  planningTime: [{ required: true, message: '请选择企划时间', trigger: 'change' }],
  planOrderDate: [{ required: true, message: '请选择计划下单日期', trigger: 'change' }],
  packagingScope: [{ required: true, message: '请选择包装范围', trigger: 'blur' }]
})

const formInline = ref<{
  planName: string
  storeName: string
  planListDate: Date | undefined
  planMonth: Date | undefined
  planOrderDate: Date | undefined
  remark: string
  storeCode: string
  planningTime: [any, any]
  planType: string | undefined
  referencePicture?: string
  packagingScope?: number | undefined
}>({
  planName: '',
  storeName: '',
  planListDate: undefined,
  planMonth: undefined,
  planOrderDate: undefined,
  remark: '',
  storeCode: '',
  planningTime: [undefined, undefined],
  planType: undefined,
  referencePicture: '',
  packagingScope: undefined
})

const formInlineDetails = ref({
  series: '',
  seriesRemark: ''
})

const currentId = ref('') // 当前编辑的 id
const isAduit = ref(false) // 是否是审核状态

const open = async (id?, isView = false) => {
  reset()
  isVisible.value = true
  isAduit.value = isView

  if (id) {
    // 编辑
    currentId.value = id
    try {
      saveLoading.value = true
      const res = await getNpDetail(id)
      formInline.value = res
      const startDate = res.planStartTime.replace(/年/g, '-').replace(/月/g, '')
      const endDate = res.planEndTime.replace(/年/g, '-').replace(/月/g, '')
      formInline.value.planningTime = [startDate, endDate]
      formInlineDetails.value = {
        series: res.detailVos[0].series,
        seriesRemark: res.detailVos[0].seriesRemark
      }
      // 图片
      imageList.value = res.referencePicture
        ? res.referencePicture
          .split(',')
          .map((el) => ({ url: el, name: el.split('?fileName=')[1] }))
        : []

      console.log('编辑数据', imageList.value)
    } finally {
      saveLoading.value = false
    }
  }
}

const storeChange = (val: any, target: any) => {
  formInline.value = { ...formInline.value, storeName: target?.shopName || '' }
}

const formRef = ref() // 表单 Ref
const save = debounce(async () => {
  console.log('图片列表', imageList.value)
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    saveLoading.value = true
    //  url拼接 name
    const image = imageList.value?.map((item) => `${item.url}?fileName=${item.name}`) || ''
    const data = {
      ...formInline.value,
      storeName: formInline.value.storeName ? formInline.value.storeName : '全渠道',
      storeCode: formInline.value.storeCode ? formInline.value.storeCode : 'ALL',
      details: [formInlineDetails.value],
      referencePicture: image ? image.join(',') : undefined
    } as any

    if (data.planningTime) {
      let planningTimeArr = formattedDates(data.planningTime)
      data.planStartTime = planningTimeArr[0]
      data.planEndTime = planningTimeArr[1]
      data.planningTime = undefined // 清除原有的企划时间字段
    }

    console.log('提交数据', data)
    if (currentId.value) {
      // await updateNp(data)
    } else {
      await saveNp(data)
    }
    message.success('操作成功')
    emit('success')
    reset()
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}, 300)

const reset = () => {
  formInline.value = {
    planName: '',
    storeName: '',
    planListDate: undefined,
    planMonth: undefined,
    planOrderDate: undefined,
    remark: '',
    storeCode: '',
    planningTime: [undefined, undefined],
    planType: undefined,
    referencePicture: undefined,
    packagingScope: undefined
  }
  isVisible.value = false
  currentId.value = ''
  imageList.value = []
  formInlineDetails.value = {
    series: '',
    seriesRemark: ''
  }
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.drawer-wapper {
  min-width: 700px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;

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
  width: calc(100%);

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

.packageMethod {
  width: 460px;
  height: auto;
  padding-bottom: 5px;
}

:deep(.packageMethod .upload) {
  width: 146pxx;
  height: 146px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>

<style scoped>
:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}

:deep(.el-form-item__content) {
  min-width: 290px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}
</style>

<style scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 15px !important;
}
</style>
