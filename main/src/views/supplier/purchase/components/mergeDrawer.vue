<template>
  <s-w-drawer
    :model-value="modelValue"
    :title="TITLE[type]"
    width="1000"
    :close-on-click-modal="!saveLoading"
    :show-bottom="type === 'add' || type === 'edit'"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <div class="pb-20px">
      <el-card shadow="never" class="!border-0">
        <div class="title">合并货品信息</div>
        <el-divider class="!mx--20px !my-20px !w-[calc(100%+40px)]" />

        <el-descriptions v-if="type === 'check'" border label-width="174px">
          <el-descriptions-item
            v-for="key in ['code', 'name']"
            :key="key"
            :label="DESCRIPTIONS_LABEL[key]"
            label-class-name="!bg-#F4F6FA !font-normal !color-#666"
          >
            {{ formData[key] }}
          </el-descriptions-item>
        </el-descriptions>

        <el-form
          v-else
          :model="formData"
          :rules="rules"
          ref="formRef"
          scroll-to-error
          class="mb--18px"
        >
          <el-row :gutter="48">
            <el-col :span="12">
              <el-form-item label="编码" prop="code">
                <el-input v-model="formData.code" placeholder="请输入编码" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="货品名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入货品名称" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card shadow="never" class="!border-0 mt-20px flex-1">
        <div class="title">合并货品明细</div>
        <el-divider class="!mx--20px !my-20px !w-[calc(100%+40px)]" />

        <el-form
          v-if="type === 'add' || type === 'edit'"
          :model="transferForm"
          ref="transferFormRef"
          :rules="rules"
        >
          <el-form-item prop="detailList">
            <el-transfer
              v-model="params"
              ref="transferRef"
              filterable
              filter-placeholder="请输入货品编码"
              :filter-method="filterMethod"
              :titles="['货品列表', '已选择货品']"
              :data="transferData"
              :props="transferProps"
              :validate-event="transFerValidate"
              class="flex items-center min-h-694px w-100%"
              :format="format"
              @change="handleChangeParams"
            >
              <template v-for="item in ['left', 'right']" :key="item" #[`${item}-empty`]>
                <div class="flex column items-center justify-center mt-100px">
                  <el-image :src="EmptyPng" fit="contain" class="h-196px w-310px" />
                  <span>暂无内容</span>
                </div>
              </template>

              <template #default="{ option }">
                <div class="flex items-center">
                  <el-image
                    :src="option.imgUrl || defaultImg"
                    class="w-32px h-32px mr-8px rounded-2px"
                    fit="contain"
                    lazy
                    :preview-src-list="!!option.imgUrl ? [option.imgUrl] : []"
                  />
                  <div class="flex-1 max-w-320px">
                    <p class="line-height-17px color-#333 font-500 font-size-14px">
                      {{ option.goodsCode }}
                    </p>
                    <sw-text-tooltip
                      :content="option.goodsName"
                      text-class-name="color-#999 font-size-12px line-height-20px"
                    >
                      {{ option.goodsName }}
                    </sw-text-tooltip>
                  </div>
                </div>
              </template>
            </el-transfer>
          </el-form-item>
        </el-form>

        <special-table
          v-else
          :loading="loading"
          v-model:filters="filters"
          :data="transferForm.detailList"
          :options="mergeDetailTable"
          border
        />
      </el-card>
    </div>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="handleSave"> 保存 </el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="tsx" setup>
import { getMergeDetailApi, saveMergeProduct, selectGoodsPageApi } from '@/api/supplier/purchase'
import { FormInstance, FormRules, TransferFormat, TransferInstance } from 'element-plus'
import EmptyPng from '@/assets/imgs/promotion/empty.png'
import defaultImg from '@/assets/imgs/supplier/defaultImg.svg'
import specialTable from '@/views/supplier/components/table.vue'
import { mergeDetailTable } from '../options'
import { cloneDeep } from 'lodash-es'

const props = defineProps<{
  modelValue: boolean
  type: string
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
  (e: 'refresh'): void
}>()

const TITLE = {
  add: '新增',
  edit: '编辑',
  check: '查看'
}

const transferProps = ref({
  key: 'goodsId',
  label: 'goodsCode'
})
const message = useMessage()
const transferData = ref<any[]>([])
const formData = ref<Record<string, any>>({})
const transferForm = ref({
  detailList: [] as any[]
})
/** 用于解决编辑时把就数据转移到左边后搜索查不到的问题 */
const oldData = ref({
  detailList: [] as any[]
})
const rules: FormRules = {
  name: { required: true, message: '请输入货品名称' },
  code: {
    required: true,
    validator(_, value, callback) {
      if (!value) return callback(new Error('请输入编码'))

      const Rex = /^[A-Za-z\d-]+$/g
      if (!Rex.test(value)) return callback(new Error('请输入 A-Z、a-z、0-9 及符号 - 组成的编码'))

      callback()
    }
  },
  detailList: { required: true, message: '请选择子货品' }
}
const DESCRIPTIONS_LABEL = {
  name: '货品名称',
  code: '编码'
}
const formRef = ref<FormInstance>()
const transferFormRef = ref<FormInstance>()
const transferRef = ref<TransferInstance>()
const loading = ref(false)
const leftInputDom = ref<any>()
const leftListDom = ref<any>()
const params = ref<string[]>([])
const queryParams = reactive({
  pages: 1,
  size: 20
})
const total = ref(0)
const scrollSwitch = ref(false)
const transFerValidate = ref(false)
const filters = ref({
  goodsCode: [],
  goodsName: []
})

const format = computed<TransferFormat>(() => ({
  noChecked: loading.value ? '正在加载...' : '',
  hasChecked: loading.value ? '正在加载...' : ''
}))

// 用于数据回显和刷新列表后处理数据
watch(() => transferForm.value.detailList, renderMethod, { once: true })

async function renderMethod(val) {
  const leftItemsMap = new Map(transferData.value.map((ele) => [ele.goodsId, ele]))
  val.forEach((item) => {
    if (!leftItemsMap.has(item.goodsId)) {
      leftItemsMap.set(item.goodsId, item)
    }
  })

  oldData.value.detailList.forEach((ele) => {
    if (!leftItemsMap.has(ele.goodsId)) {
      leftItemsMap.set(ele.goodsId, ele)
    }
  })

  transferData.value = Array.from(leftItemsMap.values())

  params.value = val.map((ele) => ele.goodsId)
}

function handleOpen() {
  switch (props.type) {
    case 'add':
      getList()
      break
    case 'edit':
      getList()
    case 'check':
      getDetail()
      break
  }

  nextTick(() => {
    // 左侧增加远程筛选
    leftInputDom.value =
      leftInputDom.value ||
      document.querySelector('.el-transfer-panel .el-input__wrapper .el-input__inner')
    leftInputDom.value?.addEventListener('input', handleLeftFilterInput)

    // 左侧滚动加载
    leftListDom.value = document.querySelector('.el-transfer-panel .el-checkbox-group')
    leftListDom.value?.addEventListener('scroll', handleScrollLeftPanel)
  })
}

function filterMethod(query: string, item: Record<string, string>) {
  return item.goodsCode.includes(query)
}

function handleScrollLeftPanel(e: any) {
  if (scrollSwitch.value) return
  const { scrollTop } = e.target
  if (
    scrollTop ===
    320 + 45 * (transferData.value.length - transferForm.value.detailList.length) - 900
  ) {
    queryParams.pages++
    getList(leftInputDom.value?.value, true)
  }
}

function handleLeftFilterInput(e: any) {
  const value = e.target?.value
  queryParams.pages = 1
  getList(value)
}

function handleClosed() {
  emit('update:model-value', false)
  formData.value = {}
  transferData.value = []
  transferForm.value.detailList = []
  oldData.value.detailList = []

  formRef.value?.resetFields()
  transferFormRef.value?.resetFields()
  transferRef.value?.clearQuery('left')
  transferRef.value?.clearQuery('right')

  transFerValidate.value = false

  queryParams.pages = 1
}

const timer = ref<NodeJS.Timeout>()
function getList(goodsCodeQuery = '', isScroll?: boolean) {
  if (!loading.value) loading.value = true
  timer.value && clearTimeout(timer.value)

  timer.value = setTimeout(
    async () => {
      try {
        isScroll && (scrollSwitch.value = true)

        const res = await selectGoodsPageApi({
          goodsCodeQuery,
          mergeId: props.id,
          goodsCodeList: transferForm.value.detailList.map((ele) => ele.goodsCode),
          ...queryParams
        })
        total.value = res.total

        transferData.value = Array.from(
          new Map(
            (isScroll ? [...transferData.value, ...res.records] : [...res.records]).map((ele) => [
              ele.goodsId,
              ele
            ])
          ).values()
        )

        renderMethod(transferForm.value.detailList)
      } catch (error) {
      } finally {
        timer.value && clearTimeout(timer.value)
        transferFormRef.value?.clearValidate()

        // 滚动加载的开关设置
        isScroll && (scrollSwitch.value = false)
        scrollSwitch.value =
          total.value === transferData.value.length - transferForm.value.detailList.length
        await nextTick()
        if (loading.value) loading.value = false
      }
    },
    isScroll ? 0 : 1000
  )
}

function handleChangeParams(value) {
  const leftItemsMap = new Map(transferData.value.map((ele) => [ele.goodsId, ele]))
  const rightItemsMap = new Map()

  value.forEach((item) => {
    rightItemsMap.set(item, leftItemsMap.get(item))
  })

  transferForm.value.detailList = Array.from(rightItemsMap.values())

  nextTick(() => {
    if (transferData.value.length === transferForm.value.detailList.length) {
      queryParams.pages = 1
      getList(leftInputDom.value?.value)
    }
  })
}

async function getDetail() {
  if (!loading.value) loading.value = true
  try {
    const res = await getMergeDetailApi(props.id)
    formData.value = res
    transferForm.value.detailList = res.detailList
  } catch (error) {
  } finally {
    await nextTick()
    transFerValidate.value = true
    transferFormRef.value?.clearValidate()
    oldData.value = cloneDeep(transferForm.value)
    if (props.type === 'check') loading.value = false
  }
}

const saveLoading = ref(false)
async function handleSave() {
  try {
    saveLoading.value = true
    await Promise.all([formRef.value?.validate(), transferFormRef.value?.validate()])

    const data = { ...formData.value, detailList: transferForm.value.detailList }
    const res = await saveMergeProduct(data)
    if (res.success) {
      message.success('保存成功！')
      handleClosed()
      emit('refresh')
    }
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}

onUnmounted(() => {
  removeEventListener('input', handleLeftFilterInput)
  removeEventListener('scroll', handleScrollLeftPanel)
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-transfer-panel) {
  flex: 1;
  width: 100%;

  .el-transfer-panel__body {
    height: 648px;

    .el-checkbox-group {
      &::-webkit-scrollbar {
        width: 5px;
      }
    }

    .el-checkbox {
      // margin-bottom: 8px;
      height: min-content;
    }
  }
}

:deep(.el-transfer__buttons) {
  display: flex;
  flex-direction: column;

  .el-button {
    margin-left: 0;
    width: 36px;
    height: 36px;

    &:last-of-type {
      margin-top: 12px;
    }

    &.is-disabled {
      background: #f4f5f6;
      color: #d8dce5;
      border: 1px solid #d8dce5;
    }
  }
}

:deep(.el-transfer-panel__footer) {
  --el-transfer-panel-footer-height: 'min-content';
}

:deep(.el-form-item__content) {
  flex: 1;
  width: 100%;
}

:deep(.el-input__clear) {
  display: none;
}

:deep(.el-transfer-panel__item) {
  margin-bottom: 8px;
  .el-checkbox__input {
    top: 50%;
    transform: translateY(-50%);
  }
}

:deep(.el-divider) {
  --el-border-color: #e5e5e5;
}

:deep(.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label) {
  font-weight: 500;
}
</style>
