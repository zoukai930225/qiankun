<template>
  <div class="drawer-wrapper">
    <el-drawer ref="drawerRef" v-model="isShowDrawer" :with-header="false" :wrapper-closable="true"
      :before-close="handleBeforeClose" class="drawer" size="85%">
      <div>
        <div class="drawerTitle">
          <div><span>仓库发货统计</span><span class="createAt">{{
            formatDate(new Date(formData.createdAt || ''), 'YYYY-MM-DD HH:mm:ss')
          }}</span></div>
          <div @click="drawerRef.handleClose">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="content">
        <Cell :form-data="formData" title="数据统计">
          <template #default="{ cell }">
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="北苑仓发货单量">
                  <el-input v-model.number="cell.beiyuanWarehouseOrders" placeholder="请输入北苑仓发货单量" clearable
                    :maxlength="9" @input="(val) => handleInput(val, 'beiyuanWarehouseOrders')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="VV/LILIU仓库发货总单量">
                  <el-input v-model.number="cell.vvLiliuWarehouseOrders" placeholder="请输入VV/LILIU仓库发货总单量" clearable
                    :maxlength="9" @input="(val) => handleInput(val, 'vvLiliuWarehouseOrders')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="南昌云仓发货单">
                  <el-input v-model.number="cell.nanchangWarehouseOrders" placeholder="请输入南昌云仓发货单" clearable
                    :maxlength="9" @input="(val) => handleInput(val, 'nanchangWarehouseOrders')">
                    <template #suffix></template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单品爆款">
                  <el-input v-model.number="cell.singleProductHotSale" placeholder="请输入单品爆款" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'singleProductHotSale')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="小批量爆款">
                  <el-input v-model.number="cell.smallBatchHotSale" placeholder="请输入小批量爆款" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'smallBatchHotSale')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="剩余订单量（所有类型）">
                  <el-input v-model.number="cell.remainingOrders" placeholder="请输入剩余订单量" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'remainingOrders')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="单通道订单数/波次数">
                  <el-input v-model.trim="cell.singleChannelOrders" placeholder="请输入单通道订单数/波次数" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="配货人数（总人数）">
                  <el-input v-model.trim="cell.pickingPersonnel" placeholder="请输入配货人数" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="验货人数（总人数）">
                  <el-input v-model.trim="cell.inspectionPersonnel" placeholder="请输入验货人数" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="打包人数（总人数）">
                  <el-input v-model.trim="cell.packagingPersonnel" placeholder="请输入打包人数" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="特殊包装（总数量）">
                  <el-input v-model.number="cell.specialPackaging" placeholder="请输入特殊包装" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'specialPackaging')" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Cell>
        <Cell :form-data="formData" title="混通道">
          <template #default="{ cell }">
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="库存不足订单（所有仓）">
                  <el-input v-model.number="cell.insufficientStockOrders" placeholder="请输入库存不足订单" clearable
                    :maxlength="9" @input="(val) => handleInput(val, 'insufficientStockOrders')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="即将超时订单">
                  <el-input v-model.number="cell.aboutToTimeoutOrders" placeholder="请输入即将超时订单" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'aboutToTimeoutOrders')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="订单超时">
                  <el-input v-model.number="cell.timeoutOrders" placeholder="请输入订单超时" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'timeoutOrders')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮政">
                  <el-input v-model.number="cell.postal" placeholder="请输入邮政" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'postal')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="双通道波次">
                  <el-input v-model.number="cell.dualChannelWaves" placeholder="请输入双通道波次" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'dualChannelWaves')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="混合通道">
                  <el-input v-model.number="cell.mixedChannel" placeholder="请输入混合通道" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'mixedChannel')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="SW中通混通道">
                  <el-input v-model.number="cell.swZhongtongMixedChannel" placeholder="请输入北苑仓发货单量" clearable
                    :maxlength="9" @input="(val) => handleInput(val, 'swZhongtongMixedChannel')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拼多多通道">
                  <el-input v-model.number="cell.pddMixedChannel" placeholder="请输入拼多多通道" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'pddMixedChannel')" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Cell>
        <Cell :form-data="formData" title="单通道波次统计">
          <template #default="{ cell }">
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="一通道">
                  <el-input v-model.number="cell.channelOne" placeholder="请输入一通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelOne')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="二通道">
                  <el-input v-model.number="cell.channelTwo" placeholder="请输入二通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelTwo')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="三通道">
                  <el-input v-model.number="cell.channelThree" placeholder="请输入三通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelThree')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="四通道">
                  <el-input v-model.number="cell.channelFour" placeholder="请输入四通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelFour')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="五通道">
                  <el-input v-model.number="cell.channelFive" placeholder="请输入五通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelFive')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="六通道">
                  <el-input v-model.number="cell.channelSix" placeholder="请输入六通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelSix')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="七通道">
                  <el-input v-model.number="cell.channelSeven" placeholder="请输入七通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelSeven')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="八通道">
                  <el-input v-model.number="cell.channelEight" placeholder="请输入八通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelEight')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="九通道">
                  <el-input v-model.number="cell.channelNine" placeholder="请输入九通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelNine')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="十通道">
                  <el-input v-model.number="cell.channelTen" placeholder="请输入十通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelTen')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="十一通道">
                  <el-input v-model.number="cell.channelEleven" placeholder="请输入十一通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelEleven')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="0通道">
                  <el-input v-model.number="cell.channelZero" placeholder="请输入0通道" clearable :maxlength="9"
                    @input="(val) => computedSingleChannelOrders(val, 'channelZero')" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Cell>
        <Cell :form-data="formData" title="岗位效率">
          <template #default="{ cell }">
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="拣货最高货品数">
                  <el-input v-model.number="cell.maxPickingItems" placeholder="请输入拣货最高货品数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'maxPickingItems')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拣货最低货品数">
                  <el-input v-model.number="cell.minPickingItems" placeholder="请输入拣货最低货品数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'minPickingItems')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="打包最高订单数">
                  <el-input v-model.number="cell.maxPackagingOrders" placeholder="请输入打包最高订单数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'maxPackagingOrders')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="打包最低订单数">
                  <el-input v-model.number="cell.minPackagingOrders" placeholder="请输入打包最低订单数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'minPackagingOrders')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="验货最高货品数">
                  <el-input v-model.number="cell.maxInspectionItems" placeholder="请输入验货最高货品数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'maxInspectionItems')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验货最低货品数">
                  <el-input v-model.number="cell.minInspectionItems" placeholder="请输入验货最低货品数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'minInspectionItems')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="每日拆分订单数">
                  <el-input v-model.number="cell.dailySplitOrders" placeholder="请输入每日拆分订单数" clearable :maxlength="9"
                    @input="(val) => handleInput(val, 'dailySplitOrders')" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截单时间（白班）">
                  <el-input v-model="cell.orderCutoffTime" placeholder="请输入截单时间" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </Cell>
        <Cell class="remark" :form-data="formData">
          <template #default="{ cell }">
            <el-row :gutter="12">
              <el-col :span="18">
                <el-form-item label="备注" label-width="100" label-position="left">
                  <s-text-area :rows="2" v-model.trim="cell.remarks" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="18">
                <el-form-item label="订单超时" label-width="100" label-position="left">
                  <s-text-area :rows="2" v-model.trim="cell.timeoutRemarks" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="18">
                <el-form-item label="即将超时" label-width="100" label-position="left">
                  <s-text-area :rows="2" v-model.trim="cell.aboutToTimeoutRemarks" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <div class="footer">
                  <el-button @click="drawerRef.handleClose">取消</el-button>
                  <el-button type="primary" @click="submit">确定</el-button>
                </div>
              </el-col>
            </el-row>
          </template>
        </Cell>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getDeliveryReportDetail, updateDeliveryReport } from '@/api/storage/statistics'
import { formatDate } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'

const Cell = defineAsyncComponent(() => import('./cell.vue'))

const message = useMessage()

const props = withDefaults(
  defineProps<{
    isShowDrawer?: boolean
    id: string
  }>(),
  {
    isShowDrawer: false
  }
)

const emit = defineEmits(['update:is-show-drawer', 'after-update'])

const formData = ref<Partial<StorageStatisticsType.DeliveryReportItem>>({})
const oldData = ref()

const isShowDrawer = computed({
  get: () => props.isShowDrawer,
  set: (val) => emit('update:is-show-drawer', val)
})
const haveChanged = ref(false)
const drawerRef = ref()

watch(
  () => props.isShowDrawer,
  (val) => {
    if (val) {
      getFormData()
    }
  }
)

async function handleBeforeClose(done: () => void) {
  Object.keys(oldData.value).forEach((key) => {
    if (oldData.value[key] !== formData.value[key]) {
      haveChanged.value = true
    }
  })

  if (haveChanged.value) await message.confirm('当前页面还有未保存的数据，确认关闭吗？')
  done()
}

// 获取回显信息
async function getFormData() {
  try {
    const res = await getDeliveryReportDetail(props.id)
    formData.value = res
    haveChanged.value = false
    oldData.value = cloneDeep(formData.value)
  } catch (error) { }
}

// 提交修改
async function submit() {
  try {
    const res = await updateDeliveryReport(formData.value)

    if (res.success) {
      message.success('修改成功')
      emit('after-update')
      await nextTick()
      isShowDrawer.value = false
      oldData.value = cloneDeep(formData.value)
      drawerRef.value.handleClose()
    }
  } catch (error) { }
}

function computedSingleChannelOrders(val, key) {
  handleInput(val, key)
  console.log(val)

  const total: any =
    Number(formData.value.channelOne || 0) +
    Number(formData.value.channelTwo || 0) +
    Number(formData.value.channelThree || 0) +
    Number(formData.value.channelFour || 0) +
    Number(formData.value.channelFive || 0) +
    Number(formData.value.channelSix || 0) +
    Number(formData.value.channelSeven || 0) +
    Number(formData.value.channelEight || 0) +
    Number(formData.value.channelNine || 0) +
    Number(formData.value.channelTen || 0) +
    Number(formData.value.channelEleven || 0) +
    Number(formData.value.channelZero || 0)
  formData.value.singleChannelOrders = total * 30 + '/' + total
}

// 校验输入内容
function handleInput(val: string, key: keyof typeof formData.value) {
  let value = val.replace(/[^\d]/g, '') as any

  if (value !== '0' && /^0+/g.test(value)) {
    value = value.replace(/^0+(\d+)/g, '$1')
  }
  formData.value[key] = value
}
</script>
<style lang="less" scoped>
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
}

// 尺码范围
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #fae8d066;
  border-radius: 15px;
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer) {
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

  .createAt {
    font-weight: 400;
    font-size: 12px;
    margin-left: 8px;
  }
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .tips {
    margin: 0 0 16px 80px;
    color: #2693f8;
    font-size: 14px;

    &-important {
      color: #eb3737;
    }

    img {
      width: 12px;
    }
  }

  &-disabledInput {
    width: 340px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

:deep(.el-link__inner) {
  padding-left: 11px;
}

:deep(.el-card) {

  // margin-bottom: 24px;
  .el-card__body {
    box-sizing: border-box;
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  flex: 1px;
  overflow: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 3px;
    /* 垂直滚动条宽度 */
    height: 10px;
    /* 水平滚动条高度 */
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background-color: #cacaca;
    border-radius: 5px;
  }

  /* 滚动条滑块悬停状态 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #e2e2e2;
  }

  /* 滚动条箭头 */
  &::-webkit-scrollbar-button {
    display: none;
    /* 隐藏箭头 */
  }

  .el-card {
    flex: 20%;

    .el-input {
      width: 200px;
    }
  }

  .el-card:last-of-type {
    margin-bottom: 0;
  }
}

:deep(.el-card) {
  border-radius: 12px;
}

.remark {
  :deep(.el-row) {
    align-items: flex-end;

    .el-form-item--default {
      margin-bottom: 15px;
    }

    &:nth-of-type(3) {
      .el-form-item--default {
        margin-bottom: 0;
      }
    }
  }
}

.footer {
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 0;

  :deep(.el-button) {
    margin-left: 12px;
  }
}
</style>
