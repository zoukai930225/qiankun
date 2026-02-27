<template>
  <div>
    <SWDrawer v-model="isVisible" @close="reset" :title="currentId ? '编辑主图' : '新增主图'">
      <ContentWrap>
        <div class="form-wapper">
          <!-- <div class="flex-row header-wapper">
            <el-button v-if="!currentId && !!addForm.sfsj" type="primary" style="margin-left: 20px; margin-top: 20px"
              @click="selectGoodClick">快速选择商品</el-button>
          </div> -->

          <el-form label-width="88px" :model="addForm" :rules="itemRules" ref="formRef"
            :validate-on-rule-change="false">
            <el-row>
              <el-col :span="12">
                <el-form-item label="上架状态" prop="sfsj">
                  <el-select v-model="addForm.sfsj" :clearable="false" @change="valueChange" disabled>
                    <!--    :disabled="!!currentId" -->
                    <el-option :value="1" label="已上架" />
                    <el-option :value="0" label="未上架" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品ID" prop="goodsId">
                  <el-input v-if="addForm.sfsj" v-model="addForm.goodsId" placeholder="请输入商品ID"
                    :disabled="!!currentId" />
                  <el-input v-if="!addForm.sfsj" :value="''" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类目" prop="categoryName">
                  <el-input v-model="addForm.categoryName" :placeholder="addForm.sfsj ? '请输入商品类目' : ''" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品编码" prop="goodsCode">
                  <el-input v-model="addForm.goodsCode" :placeholder="addForm.sfsj ? '请输入商品编码' : ''"
                    :disabled="!addForm.sfsj" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="商品名称" prop="goodsName">
                  <el-input v-model="addForm.goodsName" :placeholder="addForm.sfsj ? '请输入商品名称' : ''" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="产品定位" prop="productPositioning">
                  <s-text-area v-model="addForm.productPositioning" placeholder="请输入产品定位"
                    :autosize="{ minRows: 4, maxRows: 4 }" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="主图" prop="productImageUrl">
                  <transfer style="width: 320px" v-model="addForm.productImageUrl" :tip="'最多上传1张大小不超过20M的图片'" :limit="1"
                    :upload-data="{ code: 'PICTURE_GALLERY_MASTER' }" @success="fileUpload" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </ContentWrap>
      <template #footer>
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" @click="save" class="mr20px">保存</el-button>
      </template>
    </SWDrawer>
    <SelectGoodDialog ref="selectGoodDialogRef" @select-good="selectGood" />
  </div>
</template>

<script lang="ts" setup>
import Transfer from '@/components/common/upload/transfer.vue'
import SelectGoodDialog from './selectGoodDialog.vue'

import { debounce } from 'lodash-es'

import * as GalleryApi from '@/api/gallery'

const message = useMessage() // 消息弹窗
const isVisible = ref(false)

const addForm = ref({
  goodsId: undefined,
  categoryCode: '',
  categoryName: undefined,
  goodsName: '',
  goodsCode: '',
  productPositioning: '',
  productImageUrl: '',
  productImage: {},
  sfsj: 0,
  id: ''
})

const selectGoodDialogRef = ref()
// 快速选择商品
const selectGoodClick = () => {
  selectGoodDialogRef.value?.open()
}

// 选择商品
const selectGood = (row: any) => {
  addForm.value.goodsId = row.goodsId
  addForm.value.categoryCode = row.categoryCode || ''
  addForm.value.categoryName = row.categoryName
  addForm.value.goodsName = row.goodsName
  addForm.value.goodsCode = row.goodsCode || ''
  addForm.value.productPositioning = ''
  addForm.value.productImageUrl = row.goodsImage
  addForm.value.productImage = getProductImage(row.goodsImage)
}

const itemRules = computed(() =>
  addForm.value.sfsj
    ? {
      sfsj: [{ required: true, message: '请选择上架状态', trigger: 'blur' }],
      goodsId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
      categoryName: [{ required: true, message: '商品品类不能为空', trigger: 'blur' }],
      goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
      productImageUrl: [{ required: true, message: '请上传商品主图', trigger: 'blur' }]
    }
    : {
      sfsj: [{ required: true, message: '请选择上架状态', trigger: 'blur' }],
      categoryName: [{ required: true, message: '商品品类不能为空', trigger: 'blur' }],
      goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
      productImageUrl: [{ required: true, message: '请上传商品主图', trigger: 'blur' }]
    }
)

const valueChange = () => {
  addForm.value = {
    ...addForm.value,
    goodsId: undefined,
    categoryCode: '',
    categoryName: undefined,
    goodsName: '',
    goodsCode: '',
    productPositioning: '',
    productImageUrl: '',
    productImage: {},
    id: ''
  }
}

const currentId = ref('') // 当前编辑的 id
const open = async (data: any) => {
  isVisible.value = true
  if (data) {
    currentId.value = data.id || ''
    addForm.value = {
      goodsId: data?.goodsId || '',
      categoryCode: data?.categoryCode || '',
      categoryName: data?.categoryName || '',
      goodsName: data?.goodsName || '',
      goodsCode: data?.goodsCode || '',
      productPositioning: data?.productPositioning || '',
      productImageUrl:
        data?.productImage?.fileUrl && data?.productImage?.fileName
          ? `${data.productImage.fileUrl}?name=${data.productImage.fileName}`
          : '',
      productImage: data?.productImage || {},
      sfsj: data.sfsj,
      id: data.id
    }
  } else {
    currentId.value = ''
    addForm.value = {
      goodsId: undefined,
      categoryCode: '',
      categoryName: undefined,
      goodsName: '',
      goodsCode: '',
      productPositioning: '',
      productImageUrl: '',
      productImage: {},
      sfsj: 0,
      id: ''
    }
  }
}

const getProductImage = (productImageUrl: string) => {
  let fileName = ''
  let fileUrl = productImageUrl || ''
  if (fileUrl) {
    const fileUrlArr = fileUrl.split('/') || []
    if (fileUrlArr.length > 0) {
      fileName = fileUrlArr[fileUrlArr.length - 1]
    }
  }
  return {
    fileName,
    fileUrl
  }
}

const fileUpload = (file: any[]) => {
  if (file.length > 0) {
    addForm.value = { ...addForm.value, productImage: file[0] }
  } else {
    addForm.value = { ...addForm.value, productImage: {} }
  }
}

const formRef = ref() // 表单 Ref
const save = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    if (currentId.value) {
      await GalleryApi.updateGoodsMasterImage(addForm.value)
      message.success('修改成功')
    } else {
      await GalleryApi.addGoodsMasterImage(addForm.value)
      message.success('新增成功')
    }

    emit('success')
    reset()
  } catch (error) { }
}, 300)

const reset = () => {
  addForm.value = {
    goodsId: undefined,
    categoryCode: '',
    categoryName: undefined,
    goodsName: '',
    goodsCode: '',
    productPositioning: '',
    productImageUrl: '',
    productImage: {},
    sfsj: 0,
    id: ''
  }
  isVisible.value = false
  currentId.value = ''
  formRef.value.clearValidate()
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.form-wapper {
  width: 100%;

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

.valueBg {
  width: 348px;
  height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
  padding-left: 16px;

  &-img {
    width: 183px;
    height: 180px;
    border-radius: 2px;
  }
}

.valueBgInput {
  padding-left: 0px;
}

.valueBgInput1 {
  padding-left: 0px;
  width: 806px;
}

.valueBg1 {
  width: 791px;
}

.valueBg2 {
  width: 806px;
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
