<template>
  <div>
    <SWDrawer v-model="isVisible" @close="reset" :title="currentId ? '编辑主图' : '新增主图'">
      <ContentWrap>
        <div class="form-wapper">
          <el-form
            label-width="88px"
            :model="addForm"
            :rules="itemRules"
            ref="formRef"
            :validate-on-rule-change="false"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="上架状态" prop="sfsj">
                  <el-select
                    v-model="addForm.sfsj"
                    :clearable="false"
                    @change="valueChange"
                    disabled
                  >
                    <el-option :value="1" label="已上架" />
                    <el-option :value="0" label="未上架" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品ID" prop="goodsId">
                  <el-input
                    v-if="addForm.sfsj"
                    v-model="addForm.goodsId"
                    placeholder="请输入商品ID"
                    :disabled="!!currentId"
                  />
                  <el-input v-if="!addForm.sfsj" :value="''" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类目" prop="categoryName">
                  <el-input
                    v-model="addForm.categoryName"
                    :placeholder="addForm.sfsj ? '请输入商品类目' : ''"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商品编码" prop="goodsCode">
                  <el-input
                    v-model="addForm.goodsCode"
                    :placeholder="addForm.sfsj ? '请输入商品编码' : ''"
                    :disabled="!addForm.sfsj"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="商品名称" prop="goodsName">
                  <el-input
                    v-model="addForm.goodsName"
                    :placeholder="addForm.sfsj ? '请输入商品名称' : ''"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="产品定位" prop="productPositioning">
                  <s-text-area
                    v-model="addForm.productPositioning"
                    placeholder="请输入产品定位"
                    :autosize="{ minRows: 4, maxRows: 4 }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="主图" prop="productImage">
                  <transfer
                    style="width: 320px"
                    v-model="addForm.productImage"
                    :tip="'最多上传1张大小不超过20M的图片'"
                    :limit="1"
                    :upload-data="{ code: 'PICTURE_GALLERY_MASTER' }"
                    value-type="array"
                  />
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
import { ref, computed } from 'vue'
import type { FormRules } from 'element-plus' // 1. 引入 FormRules 类型解决报错
import Transfer from '@/components/common/upload/transfer.vue'
import SelectGoodDialog from './selectGoodDialog.vue'
import { debounce } from 'lodash-es'
import * as GalleryApi from '@/api/gallery'
import { useMessage } from '@/hooks/web/useMessage' // 假设你有这个hook
import STextArea from '@/components/common/input/s-textarea.vue'

const message = useMessage()
const isVisible = ref(false)

// 定义表单接口
interface AddFormType {
  goodsId: string | undefined
  categoryCode: string
  categoryName: string | undefined
  goodsName: string
  goodsCode: string
  productPositioning: string
  productImage: any[] // 前端保持为数组
  sfsj: number
  id: string
}

const addForm = ref<AddFormType>({
  goodsId: undefined,
  categoryCode: '',
  categoryName: undefined,
  goodsName: '',
  goodsCode: '',
  productPositioning: '',
  productImage: [], // 初始化为数组
  sfsj: 0,
  id: ''
})

const selectGoodDialogRef = ref()

const selectGoodClick = () => {
  selectGoodDialogRef.value?.open()
}

const selectGood = (row: any) => {
  addForm.value.goodsId = row.goodsId
  addForm.value.categoryCode = row.categoryCode || ''
  addForm.value.categoryName = row.categoryName
  addForm.value.goodsName = row.goodsName
  addForm.value.goodsCode = row.goodsCode || ''
  addForm.value.productPositioning = ''
  // 将选中的对象转为数组
  addForm.value.productImage = row.productImage ? [row.productImage] : []
}

// 2. 使用 computed<FormRules> 显式标注类型
const itemRules = computed<FormRules>(() => {
  const commonRules: FormRules = {
    sfsj: [{ required: true, message: '请选择上架状态', trigger: 'blur' }],
    categoryName: [{ required: true, message: '商品品类不能为空', trigger: 'blur' }],
    goodsName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
    // 现在这里的 type: 'array' 不会报错了
    productImage: [{ required: true, type: 'array', message: '请上传商品主图', trigger: 'change' }]
  }

  if (addForm.value.sfsj) {
    return {
      ...commonRules,
      goodsId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }]
    }
  } else {
    return commonRules
  }
})

const valueChange = () => {
  addForm.value = {
    ...addForm.value,
    goodsId: undefined,
    categoryCode: '',
    categoryName: undefined,
    goodsName: '',
    goodsCode: '',
    productPositioning: '',
    productImage: [],
    id: ''
  }
}

const currentId = ref('')

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
      // 回显：对象转数组
      productImage: data?.productImage ? [data.productImage] : [],
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
      productImage: [],
      sfsj: 0,
      id: ''
    }
  }
}

const formRef = ref()

const save = debounce(async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交：数组转对象（取第一项）
  const apiParams = {
    ...addForm.value,
    productImage:
      addForm.value.productImage && addForm.value.productImage.length > 0
        ? addForm.value.productImage[0]
        : {}
  }

  try {
    if (currentId.value) {
      await GalleryApi.updateGoodsMasterImage(apiParams)
      message.success('修改成功')
    } else {
      await GalleryApi.addGoodsMasterImage(apiParams)
      message.success('新增成功')
    }

    emit('success')
    reset()
  } catch (error) {}
}, 300)

const reset = () => {
  addForm.value = {
    goodsId: undefined,
    categoryCode: '',
    categoryName: undefined,
    goodsName: '',
    goodsCode: '',
    productPositioning: '',
    productImage: [],
    sfsj: 0,
    id: ''
  }
  isVisible.value = false
  currentId.value = ''
  if (formRef.value) {
    formRef.value.clearValidate()
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
