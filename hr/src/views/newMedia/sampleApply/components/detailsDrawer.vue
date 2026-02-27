<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="drawerContent">
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        label-width="100px"
        label-position="right"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="条码" prop="barCode">
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.barcode"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productCategory" label="产品类目" >
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.productCategory"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.skuCode"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productModelNumber" label="产品款号" >
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.productModelNumber"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.brand"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sampleCategory" label="样品类别" >
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.sampleCategory"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-select
                class="!w-300px"
                v-model="formData.size"
                placeholder="请选择尺码"
                readonly
                disabled
              >
                <el-option
                  v-for="dict in sampleSizeList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="colour" label="颜色" >
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.colour"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库位增加 -->
        <div v-for="(loc, index) in formData.detailsVoList" :key="index">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="location" :label="`存放位置${index + 1}`" >
                <el-input v-model="loc.location" disabled style="width: 300px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="number" :label="`出库数量${index + 1}`" >
                <el-input v-model="loc.number" disabled style="width: 300px"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item :label="`来源`">
              <el-input style="width:300px;" placeholder="" v-model="formData.source" :disabled="!isEdit"/>
              <el-select
                class="!w-300px"
                v-model="formData.source"
                :disabled="!isEdit"
                prop="source"
              >
                <el-option
                  v-for="dict in resourceList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.applicantName"
                :disabled="!isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" required>
              <el-date-picker
                :disabled="!isEdit"
                v-model="formData.applicationDate"
                type="date"
                placeholder=""
                style="width: 300px"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label="申请数量">
              <el-input
                style="width: 300px"
                placeholder=""
                v-model="formData.applyQuantity"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请用途" required>
              <el-select
                class="!w-300px"
                v-model="formData.applicationPurpose"
                placeholder="请选择申请用途"
                :disabled="!isEdit"
              >
                <el-option
                  v-for="dict in applyPurposeList"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归还日期" prop="returnDate">
              <el-date-picker
                :disabled="!isEdit"
                v-model="formData.returnDate"
                type="date"
                placeholder=""
                style="width: 300px"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片">
              <UploadImg v-model:modelValue="imageList" :limit="1" :uploadDisabled="!isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前状态">
              <el-input style="width: 300px" :value="getDictLabel(DICT_TYPE.SAMPLE_MANAGEMENT_INVENTORY_APPLY_STATUS, formData.status)" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="drawerContent logContent mt20px mb20px">
      <timeLine :auditLogs="formData.approvalLogList"/>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false" class="mr20px">关 闭</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import UploadImg from '../../components/uploadImg.vue'
import timeLine from './timeLine.vue'
import { sampleSizeList, resourceList, applyPurposeList } from '@/views/newMedia/hooks/useSample'
import * as sampleApplyApi from '@/api/sample/sampleApply'
// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()


const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref<any>('') // 表单的类型：create - 新增；update - 修改
const formData = ref<any>({})
const imageList = ref<any>([])

const formRef = ref()
const isEdit = ref(false)


/** 打开drawer */
const open = async (type?: string, id?: string, barcode?: string) => {
  resetForm()
  drawerVisible.value = true
  formType.value = type
  drawerTitle.value = type === 'edit' ? '编辑' : '查看'
  isEdit.value = type === 'edit'
  if (id) {
    // 查看详情
    // const params = await sampleManageApi.queryBasicInfoByBarcode({ barcode })
    const data = await sampleApplyApi.getApplyRecordDetailsById(id)
    if (data) {
      formData.value = Object.assign({}, data)
      if (data.image) imageList.value.push({ fileUrl: data.image })
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调


/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  imageList.value = []
}

const reset = () => {
  resetForm()
  drawerVisible.value = false
  emit('success')
}
</script>

<style lang="less" scoped>
@import '@/views/newMedia/style/drawer.scss';
.logContent{
  padding: 20px;
}
</style>
