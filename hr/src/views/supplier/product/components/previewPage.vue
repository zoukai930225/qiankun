<template>
  <div id="preview" class="print">
    <div class="flex column items-center mb-32px">
      <h1 class="font-size-32px font-600"> 杭州顶秀电子商务有限公司 </h1>

      <h6 class="font-size-24px font-600"> 采购合同 </h6>
    </div>

    <div class="font-600 font-size-16px">一、基本信息：</div>

    <el-descriptions border :label-width="100" :column="2" class="mt-1em mb-2em">
      <el-descriptions-item
        v-for="item in BASE_INFO_OP"
        :key="item.label"
        :label="item.label"
        class-name="w-400px"
      >
        <template #label>
          <div class="flex h100% items-center">{{ item.label }}</div>
        </template>
        <div>{{ printInfo[item.field] }}</div>
      </el-descriptions-item>
    </el-descriptions>

    <div class="font-600 font-size-16px">二、合同内容：</div>

    <special-table
      ref="tableRef"
      :data="showTableData"
      :options="contractPreviewTableOptions"
      :span-method="spanMethod"
      :rules="rules"
      border
      class="mt-1em"
      :row-style="rowStyle"
    >
      <template #remark="{ row, col, index }">
        <div
          class="flex column my-8px overflow-y-auto"
          :style="{ maxHeight: spanArr[index][0] * 55 + 'px' }"
        >
          <el-link type="info" link :underline="false" @click="handleRemark(row)">
            <div v-if="col" class="remark" @click="handleRemark(row)">{{ col }}</div>
            <Icon v-else-if="row.providerGoodsNo" icon="ep:edit" />
          </el-link>
        </div>
      </template>

      <template #price="{ row, index, col }">
        <el-popover
          v-if="index !== tableData.length && isAdd"
          trigger="click"
          :ref="(ele: any) => priceCellPopoverRef[index] = ele"
          :disabled="isCheck"
        >
          <template #reference>
            <div class="w-100%">
              <el-link type="info" :underline="false">{{ col }}</el-link>
            </div>
          </template>

          <el-radio-group
            v-model="row.price"
            :popper-style="{
              width: 'min-content',
              paddingTop: '4px',
              paddingBottom: '4px',
              minWidth: 'auto'
            }"
            @change="priceCellPopoverRef?.[index]?.hide"
          >
            <el-radio :value="row.fgCost">成品价：{{ row.fgCost }}</el-radio>
            <el-radio :value="row.baseProdCost">裸货价：{{ row.baseProdCost }}</el-radio>
          </el-radio-group>
        </el-popover>
        <span v-else>{{ col }}</span>
      </template>

      <template #amount="{ row, index, col }">
        <span v-if="index !== tableData.length">{{
          (function () {
            const multiplier = Math.pow(10, 4)
            const roundedNum =
              Math.round(row.purchasedGoodsQuantity * (row.price ?? 0) * multiplier) / multiplier
            return roundedNum
          })()
        }}</span>

        <span v-else>{{ col }}</span>
      </template>

      <template #price_header="{ column }">
        <span>{{ column.label }}</span>
        <el-popover
          trigger="click"
          ref="priceTypePopperRef"
          :popper-style="{
            width: 'min-content',
            paddingTop: '4px',
            paddingBottom: '4px',
            minWidth: 'auto'
          }"
        >
          <template #reference>
            <Icon icon="ep:arrow-down" />
          </template>
          <el-radio-group
            :disabled="isCheck"
            v-model="priceType"
            @change="priceTypePopperRef?.hide"
          >
            <el-radio :value="1">成品价</el-radio>
            <el-radio :value="2">裸货价</el-radio>
          </el-radio-group>
        </el-popover>
      </template>
    </special-table>

    <el-descriptions :column="1" :label-width="269" border class="mb-2em">
      <el-descriptions-item label-class-name="!bg-#F4F6FA">
        <template #label>
          <div class="flex items-center h100%"> 收货地址 </div>
        </template>
        {{ printInfo.shippingAddress }}
      </el-descriptions-item>
      <el-descriptions-item label-class-name="!bg-#F4F6FA">
        <template #label>
          <div class="flex items-center h100%"> 产前样地址 </div>
        </template>
        {{ printInfo.preSampleAddress }}
      </el-descriptions-item>
    </el-descriptions>

    <div class="font-600 font-size-16px mb-8px">三、合同要求:</div>

    <el-form class="mt-12px" :model="formData" scroll-to-error :rules="rules" ref="formRef" inline>
      <div class="mb-8px">大货生产前需要批复正确的产前版，产品版批复要求：</div>
      <div class="mb-1em">
        1、齐色错码正确样衣3套，另加1件深色供洗水。
        <span class="color-red"> （必须全部色以及资料齐全才能寄版批复） </span>
      </div>
      <div class="">
        2、产前样批复版确认后，样衣以及批复意见会寄回一套封版样寄回工厂，生产以及查货以注重的封版样进行查货验收。
      </div>
      <div class="color-red mt-16px">
        产前样批复要求：
        <span class="font-600"> 若因乙方原因超过2次批复不合格，甲方有权取消订单！ </span>
      </div>
      <div class="flex items-center my-8px">
        为简化合同签订流程，方便交易。本合同未约定条款，参照双方于
        <span>{{ formData.frameContractDate }}</span>
        签订的《 框架合同 》（合同编号：
        <span>{{ formData.frameContractNo }}</span>
        ）的条款执行，该合同条款对本合同履行有约束力。
      </div>

      <div
        v-for="(item, index) in CONTRACT_REQUIREMENT"
        :key="index"
        :class="{ flex: index === 0 }"
        class="mb-1em column"
      >
        <label class="font-600">{{ index + 1 }}、{{ item.label }}：</label>

        <el-form-item prop="text" v-if="index === 0" class="!mb-0 !mx1 !flex-1 mt1">
          <s-textarea
            v-if="isAdd || isEdit"
            v-model="formData.text"
            @change="(val) => emit('change:text', val)"
            placeholder="请输入"
          />

          <span v-else class="font-size-16px">{{ formData.text }}</span>
        </el-form-item>
        <span v-else :class="{ 'color-red': item.important }">{{ item.message }}</span>
      </div>

      <div class="mb-2em"></div>
    </el-form>

    <div class="font-600 font-size-16px mb-8px"> 四、违约责任: </div>
    <div
      v-for="(item, index) in RESPONSIBILITY"
      :key="index"
      class="mb-1em"
      :class="{ 'bg-#b7dee8': item.important }"
    >
      {{ index + 1 }}、{{ item.message }}
    </div>

    <div class="mb-2em"></div>

    <div class="font-600 font-size-16px mb-8px">五、其他事项：</div>
    <div class="mb-1em">
      未尽事宜，双方协商解决，传真、复印件可作合同的一部分，若因合同发生争议，双方应现行协商解决，协商无果的可向买方所在地人民法院提起诉讼。诉讼产生的律师费、诉讼费、保全费、鉴定费、执行费等由败诉方承担。
    </div>
    <div class="mb-1em font-600">
      特别约定：因双方间存在频繁交易，为方便交易，同时避免产生纠纷，本合同签订后，双方可采取附件1《杭州顶秀采购订单》进行后续交易，双方确认：采取该订单或其他同类型交易模式交易的内容，双方权利义务引用本《采购合同》条款，双方均无异议。后续签订《杭州顶秀采购订单》或合同等与本《采购合同》有直接冲突的，以后续订单内容和合同内容为准。
    </div>

    <div class="mb-2em"></div>

    <div class="flex font-600 mt-5em lh-1.4em">
      <div class="flex-1">
        <div>甲方单位名称：杭州顶秀电子商务有限公司</div>
        <div>甲方签约代表：</div>
        <div>甲方签章</div>
      </div>
      <div class="flex-1">
        <div>乙方单位名称：{{ printInfo.secondFullCompany }}</div>
        <div>乙方签约代表：</div>
        <div>乙方签章</div>
      </div>
    </div>

    <div class="mb-5em"></div>
  </div>

  <preview-page-remark-dialog
    v-bind="remarkDialogProps"
    v-model:model-value="remarkDialogProps.modelValue"
    @update:remark="handleUpdateRemark"
  />
</template>

<script lang="tsx" setup>
import {
  BASE_INFO_OP,
  CONTRACT_REQUIREMENT,
  contractPreviewTableOptions,
  RESPONSIBILITY
} from '../options'
import previewPageRemarkDialog from './previewPageRemarkDialog.vue'
import specialTable from '@/views/supplier/components/table.vue'
import { FormInstance, FormRules, PopoverInstance, TableColumnCtx } from 'element-plus'
import STextarea from '@/components/common/input/s-textarea.vue'

const message = useMessage()

const props = defineProps<{
  printInfo: Supplier.Product.PrintInfo
  isAdd: boolean
  isEdit: boolean
  isCheck: boolean
}>()

const emit = defineEmits<{
  (e: 'change:text', v: string | undefined)
  (e: 'change:frameContractDate', v: string | undefined)
  (e: 'change:frameContractNo', v: string | undefined)
}>()

const tableData = ref<any[]>([])
const tableRef = ref<InstanceType<typeof specialTable>>()
const formData = reactive<Record<string, any>>({
  text: '',
  frameContractDate: '',
  frameContractNo: ''
})
const rules = reactive<FormRules>({
  text: { required: true, message: '请输入' },
  frameContractDate: { required: true, message: '请选择' },
  frameContractNo: { required: true, message: '请输入' },
  price: {
    required: true,
    validator: (_, val, callback) => callback(!val && val !== 0 ? new Error('请输入') : undefined)
  }
})
const formRef = ref<FormInstance>()
const priceType = ref<number>()
const priceTypePopperRef = ref<PopoverInstance>()
const priceCellPopoverRef = ref<PopoverInstance[]>([])

const showTableData = computed(() => {
  const data = [...tableData.value]
  data.push({
    goodsName: '合计',
    purchasedGoodsQuantity: props.printInfo.totQty,
    amount: tableData.value.reduce((pre, cur) => {
      const multiplier = Math.pow(10, 4)
      const roundedNum =
        Math.round((cur.purchasedGoodsQuantity ?? 0) * (cur.price ?? 0) * multiplier) / multiplier
      return roundedNum + pre
    }, 0)
  })

  return data
})

watch(priceType, (val) => {
  tableData.value.forEach((ele) => {
    ele.price = { 1: ele.fgCost, 2: ele.baseProdCost }[val!]
  })
})

function onOpen() {
  spanArr.value = []
  tableData.value = props.printInfo.goodsList
  Object.assign(formData, { ...props.printInfo })
}

const remarkDialogProps = reactive({
  modelValue: false,
  remark: '',
  providerGoodsNo: ''
})
function handleRemark(row: any) {
  remarkDialogProps.modelValue = true
  remarkDialogProps.remark = row.remark
  remarkDialogProps.providerGoodsNo = row.providerGoodsNo
}

function handleUpdateRemark(remark: string, providerGoodsNo: string) {
  const sameCodeRows = tableData.value.filter((row) => row.providerGoodsNo === providerGoodsNo)
  sameCodeRows.forEach((row) => (row.remark = remark))
}

function onClose() {
  tableData.value = []
}

interface SpanMethodProps {
  row: Supplier.Purchase.FormItem
  column: TableColumnCtx<Supplier.Purchase.FormItem>
  rowIndex: number
  columnIndex: number
}
// 预处理合并所需的跨度数据，按“商家编码”分组
const spanArr = ref<[number, number][]>([]) // 通过清空spanArr可以重置合并规则
function calculateSpan(): typeof spanArr.value {
  const result: typeof spanArr.value = []
  let count = 1,
    index = 1

  tableRef.value?.filterData.forEach((row, i) => {
    if (
      i < (tableRef.value?.filterData.length || 1) - 1 &&
      tableRef.value?.filterData[i].providerGoodsNo ===
        tableRef.value?.filterData[i + 1].providerGoodsNo
    ) {
      count++
      row.index = index
    } else {
      result.push([count, 1])
      for (let index = 1; index < count; index++) {
        result.push([0, 0])
      }
      row.index = index
      index++
      count = 1
    }
  })

  return result
}
/** 列表合并规则 */
function spanMethod({ rowIndex, column }: SpanMethodProps): [number, number] {
  if (spanArr.value.length === 0) spanArr.value = calculateSpan()
  if (['remark', 'providerGoodsNo'].includes(column.rawColumnKey)) return spanArr.value[rowIndex]
  return [1, 1]
}

function rowStyle({ rowIndex }) {
  if (rowIndex === tableData.value?.length) {
    return {
      backgroundColor: '#FDE6E6'
    }
  } else {
    return {}
  }
}

defineExpose({
  onClose,
  onOpen,
  validate: async () => {
    if (tableData.value.some((ele) => ele.price === 0))
      await message.confirm('合同中部分商品价格是0，确定要保存合同吗？')

    await Promise.all([
      tableRef.value?.validateFileds(undefined, undefined, [tableData.value.length]),
      formRef.value?.validate()
    ])
  }
})
</script>

<style lang="less" scoped>
@import url(../printStyle.css);
// @import url(../../index.scss);

.remark {
  white-space: pre;
  overflow-wrap: break-word;
  word-break: break-all;
}
</style>
