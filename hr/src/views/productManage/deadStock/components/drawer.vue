<template>
  <div class="drawer-wrapper">
    <el-drawer ref="drawerRef" v-model="isShow" :with-header="false" :wrapper-closable="true" class="drawer" size="428"
      :before-close="handleBeforClose" @closed="handleClosed" @open="handleOpen" >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="emit('update:is-show', false)">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <el-card class="drawerContent" shadow="never">
        <el-form ref="formRef" :model="formData" label-width="90" :rules="rules">
          <el-form-item label="编码类型" prop="codeType">
            <el-radio-group v-model="formData.codeType" :disabled="!!id" @change="handleChangeCodeType">
              <el-radio v-for="item in codeTypeOps" :key="item.value" :label="item.label" :value="item.value" />
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="productNumber" label="编码:">
            <GoodsNoSelector :type="formData.codeType!" v-model:model-value="formData.productNumber" :disabled="!!id"
              @change="handleNumberChange" />
          </el-form-item>
          <el-form-item prop="productName" label="货品名称:">
            <el-input v-model.trim="formData.productName" clearable :disabled="true" placeholder="请输入货品名称" />
          </el-form-item>
          <el-form-item prop="costs" label="成本:">
            <el-input v-model.trim="formData.costs" clearable placeholder="请输入成本" />
          </el-form-item>
          <el-form-item prop="type" label="类别:">
            <el-select v-model="formData.type" clearable placeholder="请选择类别">
              <el-option v-for="item in typeOps" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item prop="category" label="品类:">
            <el-select v-model="formData.category" clearable>
              <el-option v-for="item in categoryOps" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item prop="seasonCategory" label="季节分类:">
            <el-select v-model="formData.seasonCategory" clearable>
              <el-option v-for="item in seasonCategoryOps" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item prop="directorId" label="责任人:">
            <select-people :multiple="false" v-model:modelValue="directorNames"
              v-model:operatorName="formData.directorName" :userId="formData.directorId"
              @update:user-id="handleUpdateUserId" />
          </el-form-item>
          <el-form-item prop="image" label="图片">
            <UploadImg :disabled="true" v-model:model-value="formData.image" />
          </el-form-item>
        </el-form>
      </el-card>
      <div class="footer"> </div>
      <template #footer>
        <el-button class="ml12px" type="primary" @click="onSubmit2">保存</el-button>
        <el-button v-if="!id" class="ml12px" type="primary" @click="onSubmit1">保存并继续</el-button>
        <el-button class="ml12px" @click="drawerRef.handleClose()">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { categoryOps, codeTypeOps, seasonCategoryOps, typeOps } from '../options'
import GoodsNoSelector from './goodsNoSelector.vue'
import SelectPeople from '../../components/selectPeople.vue'
import UploadImg from '@/components/UploadFile/src/UploadImg.vue'
import { getRowDetail, updateData } from '@/api/productManage/deadStock'
import { cloneDeep } from 'lodash-es'
import { deepEqual } from '@/utils/common'

const message = useMessage()

const props = withDefaults(
  defineProps<{
    isShow: boolean
    id?: string
    rolesMasks?: StorageSystem.PersonalManagement.RolesMaskItem[]
    date: string
    type?: number
  }>(),
  {
    rolesMasks: () => [] as StorageSystem.PersonalManagement.RolesMaskItem[]
  }
)

const emit = defineEmits(['update:is-show', 'refresh'])

const formData = ref<ProductManage.DeadStock.ListItem>({ codeType: 1 })
const oldForm = ref<ProductManage.DeadStock.ListItem>({ codeType: 1 })
const rules = {
  productNumber: [{ required: true, message: '请选择编码' }],
  costs: [
    { required: true, message: '请输入成本' },
    {
      validator: (_, val: string, callback: (err?: Error) => any) => {
        if (val === '' || val === undefined || val === null) {
          return callback(new Error('请输入成本'))
        } else {
          const regex = /^-?\d{1,4}(?:\.\d{1,9})?$/
          regex.test(val)
            ? callback()
            : callback(new Error('请输入整数位不超过4位，小数位不超过9位的数字'))
        }
      }
    }
  ],
  productName: [{ required: true, message: '请输入货品名称' }],
  type: [{ required: true, message: '请选择类别' }],
  category: [{ required: true, message: '请选择品类' }],
  seasonCategory: [{ required: true, message: '请选择季节分类' }]
}
const drawerRef = ref()
const formRef = ref()
const directorNames = ref<string[]>([])

const isShow = computed({
  get: () => {
    if (props.isShow) getDetail()
    return props.isShow
  },
  set: (val) => {
    emit('update:is-show', val)
  }
})

const title = computed(() => (props.id ? '编辑' : '新增') + (props.date ? `（${props.date}）` : ''))

function handleUpdateUserId(val: string) {
  formData.value.directorId = val
}

async function handleNumberChange(val) {
  if (val) {
    const res = await getRowDetail({
      codeType: formData.value.codeType || 1,
      dataDate: props.date || '',
      productNumber: val
    })
    directorNames.value = res.directorId ? [res.directorId] : []
    formData.value.productNumber = res?.productNumber
    formData.value.productName = res?.productName || undefined
    formData.value.image = res.image || undefined
    formData.value.category = res.category === 0 || res.category ? res.category : undefined
    formData.value.type = res.type === 0 || res.type ? res.type : undefined
    formData.value.seasonCategory =
      res.seasonCategory === 0 || res.seasonCategory ? res.seasonCategory : undefined
    formData.value.costs = res.costs === 0 || res.costs ? res.costs : undefined
    formData.value.directorId = res.directorId
  } else {
    formRef.value.resetFields()
  }
}

function clearForm() {
  formRef.value.resetFields()
  formData.value = { codeType: 1 }
  directorNames.value = []
}

function handleOpen() {
  oldForm.value = cloneDeep(formData.value)
}

function handleClosed() {
  oldForm.value = cloneDeep(formData.value)
  formRef.value.resetFields()
  clearForm()
  emit('update:is-show', false)
}

/** 关闭前 */
async function handleBeforClose(done: () => void) {
  if (!deepEqual(oldForm.value, formData.value)) {
    await message.confirm('当前数据还没有保存，关闭后会丢失数据，确定关闭吗？')
  }
  done()
}

/** 获取详情 */
async function getDetail() {
  if (!props.id) return
  try {
    formRef.value.resetFields()
    const res = await getRowDetail({
      codeType: props.type || 1,
      dataDate: props.date || '',
      productNumber: props.id
    })
    directorNames.value = res.directorId ? [res.directorId] : []
    formData.value = res
    oldForm.value = cloneDeep(res)
  } catch (error) { }
}

/** 提交并继续 */
async function onSubmit1() {
  try {
    await formRef.value.validate()

    const res = await updateData({ ...formData.value, dataDate: props.date })
    if (res.success) {
      message.success('保存成功')
      clearForm()
      emit('refresh')
    }
  } catch (error) { }
}
/** 提交 */
async function onSubmit2() {
  try {
    await formRef.value.validate()
    const res = await updateData({ ...formData.value, dataDate: props.date })
    if (res.success) {
      message.success('保存成功')
      clearForm()
      oldForm.value = cloneDeep(formData.value)
      drawerRef.value.handleClose()
      emit('refresh')
    }
  } catch (error) { }
}

function handleChangeCodeType(val) {
  const value = val
  formRef.value.resetFields()
  formData.value.codeType = value
}
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;

  .el-form {
    .el-form-item__content {
      &>div {
        width: 100%;
      }

      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  overflow: scroll;
  border: 0;
  border-radius: 8px;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

.baseInfo,
.postInfo {
  margin-bottom: 24px;
  border-radius: 8px;

  :deep(.el-card__body) {
    box-sizing: border-box;
    padding: 0;
  }

  .title {
    display: flex;
    align-items: center;
    margin-left: 12px;
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin: 13px 20px 0;

    .item {
      width: 260px;
      height: 32px;
      padding-left: 12px;
      line-height: 32px;
      font-size: 12px;
      color: #999;
      background: #f1f5f866;
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
}
</style>
