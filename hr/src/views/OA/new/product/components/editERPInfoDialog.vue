<template>
  <div>
    <SWDrawer
      :append-to-body="true"
      v-model="visible"
      :title="title"
      :width="dialogWidth"
      :before-close="handleClose"
    >
      <div class="flex-row" style="border-radius: 8px; background: #ffffff">
        <div style="height: 20px"></div>
        <div
          class="row-center"
          style="
            height: 32px;
            border-radius: 2px;
            background: rgba(219, 106, 15, 0.1);
            border: 1px solid #db6a0f;
            margin-left: 20px;
            margin-right: 20px;
            margin-bottom: 20px;
            border-radius: 2px;
          "
        >
          <img
            src="@/assets/imgs/oa/oa_tips_orange.svg"
            style="width: 14px; height: 14px; margin-right: 10px; margin-left: 10px"
          />
          <div style="font-size: 12px; color: #db6a0f"
            >请仔细核对SKU编码及价格是否正确，如果有问题请修改为正确的SKU编码和相应价格，该编码将影响后续的供应链及进销存的相关数据
          </div>
        </div>
        <el-form
          ref="ruleFormRef"
          :model="localForm"
          label-width="80px"
          style="margin-left: 10px; margin-bottom: 10px; position: relative"
          :rules="rules"
        >
          <div style="display: flex">
            <el-form-item label="货品编码" prop="productCode">
              <div class="row-center">
                <el-input
                  ref="productCodeInptRef"
                  :disabled="forbidEdit"
                  v-model="localForm.productCode"
                  :placeholder="
                    localForm.suggestCode ? `推荐编码:${localForm.suggestCode}` : '请输入货品编码'
                  "
                  class="dialogFormItemWidth"
                  @change="codeChange"
                  style="width: 220px"
                  @focus="openDialog"
                />
                <div
                  v-if="
                    (designInfo && Number(designInfo.planProductType || '') === 2) ||
                    Number(designInfo.planProductType || '') === 3
                  "
                  style="padding-left: 10px; color: red; font-weight: 500"
                  >{{
                    getDictLabel(
                      DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE,
                      designInfo.planProductType || ''
                    )
                  }}品，原产品编码为：{{ localForm.oldGoodsNo }}</div
                >
              </div>
            </el-form-item>
            <el-form-item label="品类" prop="category">
              <div
                style="
                  border-radius: 4px;
                  border: 1px solid #e5e5e5;
                  background: #f8f8f9;
                  height: 32px;
                  line-height: 32px;
                  padding-left: 12px;
                  padding-right: 12px;
                  width: 194px;
                "
              >
                {{ localForm.category }}</div
              >
            </el-form-item>
            <el-form-item label="系列" prop="classCode">
              <div
                style="
                  border-radius: 4px;
                  border: 1px solid #e5e5e5;
                  background: #f8f8f9;
                  height: 32px;
                  line-height: 32px;
                  padding-left: 12px;
                  padding-right: 12px;
                  width: 194px;
                "
              >
                {{ localForm.classCode }}</div
              >
            </el-form-item>
            <div style="position: absolute; right: 10px; margin-right: 10px">
              <el-button v-if="!forbidEdit" type="primary" @click="addLine">新增</el-button>
              <el-button v-if="!forbidEdit" @click="restoreData">还原</el-button>
            </div>
          </div>

          <div style="display: flex">
            <el-form-item label="是否同步旺店通" style="width: 300px" prop="isSyncWdt">
              <el-radio-group :disabled="forbidEdit" v-model="localForm.isSyncWdt">
                <el-radio v-for="dict in radioOptions" :key="dict.value" :label="dict.value">{{
                  dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="建议产品编码" style="width: 300px" prop="recommendProductCode">
              <!-- <el-radio-group :disabled="forbidEdit" v-model="localForm.recommendProductCode"> -->
              <el-input v-model="localForm.recommendProductCode" disabled></el-input>
              <!-- </el-radio-group> -->
            </el-form-item>
          </div>
          <el-form-item
            label="SKU编码"
            style="width: calc(100% - 20px); padding-bottom: 20px"
            prop="skuCode"
          >
            <el-table
              ref="skuTableRef"
              :header-cell-style="appStore.headerCellStyle"
              :data="localForm.npPrenatalSampleInfoList || []"
              row-class-name="commonTableRow"
              class="SWCommonTable"
              :border="true"
              v-horizontal-scroll="'always'"
            >
              <el-table-column label="颜色" min-width="115px" prop="color">
                <template #default="scope">
                  <div style="height: 36px; width: 90px; margin-top: 5px">
                    <el-input
                      :disabled="forbidEdit"
                      v-model="scope.row.color"
                      :placeholder="forbidEdit ? '-' : '请输入颜色'"
                      clearable
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="尺码" min-width="115px" prop="size">
                <template #default="scope">
                  <div style="height: 36px; width: 90px; margin-top: 5px">
                    <el-input
                      :disabled="forbidEdit"
                      v-model="scope.row.size"
                      :placeholder="forbidEdit ? '-' : '请输入尺码'"
                      clearable
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="SKU名称" min-width="115px" prop="skuName">
                <template #default="scope">
                  <div style="height: 36px; width: 90px; margin-top: 5px">
                    <el-input
                      :disabled="forbidEdit"
                      v-model="scope.row.skuName"
                      :placeholder="forbidEdit ? '-' : '请输入SKU编码'"
                      clearable
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="SKU编码" min-width="215px" prop="skuCode">
                <template #default="scope">
                  <div style="height: 36px; width: 193px; margin-top: 5px">
                    <el-input
                      :disabled="forbidEdit"
                      v-model="scope.row.skuCode"
                      :placeholder="forbidEdit ? '-' : '请输入SKU编码'"
                      clearable
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="裸货价" min-width="133px" prop="productCostExcludingTax">
                <template #default="scope">
                  <div style="height: 36px; width: 113px; margin-top: 5px" class="row-center">
                    <el-input
                      :style="!forbidEdit ? 'width: 90px;' : ''"
                      :disabled="forbidEdit"
                      v-model="scope.row.productCostExcludingTax"
                      @input="(val) => handleInput(val, scope.row, 'productCostExcludingTax')"
                      :placeholder="forbidEdit ? '-' : '请输入裸货价'"
                      clearable
                    />
                    <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                      <img
                        v-if="scope.$index === 0 && !forbidEdit"
                        style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                        @click="
                          allSetOneValue(
                            scope.row.productCostExcludingTax,
                            'productCostExcludingTax'
                          )
                        "
                        src="@/assets/imgs/oa/oa_all_add.png"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="包装人工费" min-width="133px" prop="packagingManpower">
                <template #default="scope">
                  <div style="height: 36px; width: 113px; margin-top: 5px" class="row-center">
                    <el-input
                      :style="!forbidEdit ? 'width: 90px;' : ''"
                      :disabled="forbidEdit"
                      v-model="scope.row.packagingManpower"
                      @input="(val) => handleInput(val, scope.row, 'packagingManpower')"
                      :placeholder="forbidEdit ? '-' : '请输入包装人工费'"
                      clearable
                    />
                    <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                      <img
                        v-if="scope.$index === 0 && !forbidEdit"
                        style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                        @click="allSetOneValue(scope.row.packagingManpower, 'packagingManpower')"
                        src="@/assets/imgs/oa/oa_all_add.png"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="成品价" min-width="133px" prop="finishedProductPrice">
                <template #default="scope">
                  <div style="height: 36px; width: 113px; margin-top: 5px" class="row-center">
                    <el-input
                      :style="!forbidEdit ? 'width: 90px;' : ''"
                      :disabled="forbidEdit"
                      @input="(val) => handleInput(val, scope.row, 'finishedProductPrice')"
                      v-model="scope.row.finishedProductPrice"
                      placeholder="-"
                    />
                    <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                      <img
                        v-if="scope.$index === 0 && !forbidEdit"
                        style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                        @click="
                          allSetOneValue(scope.row.finishedProductPrice, 'finishedProductPrice')
                        "
                        src="@/assets/imgs/oa/oa_all_add.png"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="零售价" min-width="133px" prop="retailPrice">
                <template #default="scope">
                  <div style="height: 36px; width: 113px; margin-top: 5px" class="row-center">
                    <el-input
                      :style="!forbidEdit ? 'width: 90px;' : ''"
                      :disabled="forbidEdit"
                      v-model="scope.row.retailPrice"
                      @input="(val) => handleInput(val, scope.row, 'retailPrice')"
                      :placeholder="forbidEdit ? '-' : '请输入零售价'"
                      clearable
                    />
                    <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                      <img
                        v-if="scope.$index === 0 && !forbidEdit"
                        style="width: 16px; height: 16px; margin-left: 6px; cursor: pointer"
                        @click="allSetOneValue(scope.row.retailPrice, 'retailPrice')"
                        src="@/assets/imgs/oa/oa_all_add.png"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="号型" min-width="110px" prop="npSizeTypes">
                <template #header>
                  <!-- <header-line :info="{tipsWidth: 300, title: '号型', canOperate: true, tips: `<p>点击查看【号型】填写规范</p><p>http://www.baidu.com</p>`}"></header-line> -->
                  <div class="row-center">
                    <div>号型</div>
                    <el-popover placement="top" effect="dark" width="220">
                      <template #reference>
                        <img src="@/assets/svgs/common/tips.svg" alt="" class="tips" ref="txtRef" />
                      </template>
                      <template #default>
                        <p>点击查看【号型】填写规范</p>
                        <a :href="tipsUrl || ''" style="color: rgb(219, 106, 15)" target="_blank">{{
                          tipsUrl || ''
                        }}</a>
                      </template>
                    </el-popover>
                  </div>
                </template>
                <template #default="scope">
                  <div style="height: 36px; width: 90px; margin-top: 5px" class="row-center">
                    <!-- <el-input :style="!forbidEdit ? 'width: 90px;' : ''" :disabled="forbidEdit"
                      v-model="scope.row.retailPrice" @input="(val) => handleInput(val, scope.row, 'retailPrice')"
                      :placeholder="forbidEdit ? '-' : '请输入零售价'" clearable /> -->
                    <!-- <el-tooltip effect="dark" content="一键同步所有数据" placement="bottom">
                      <img v-if="scope.$index === 0 && !forbidEdit"
                        style="width: 16px;height: 16px;margin-left: 6px;cursor: pointer;"
                        @click="allSetOneValue(scope.row.retailPrice, 'retailPrice')"
                        src="@/assets/imgs/oa/oa_all_add.png" />
                    </el-tooltip> -->
                    <el-select
                      v-model="scope.row.npSizeTypes"
                      filterable
                      :disabled="forbidEdit"
                      :style="!forbidEdit ? 'width: 90px;' : ''"
                      clearable
                      :placeholder="forbidEdit ? '-' : '请选择号型'"
                    >
                      <el-option
                        v-for="item in getIntDictOptions('np_size_types', true)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70px" v-if="!forbidEdit">
                <template #default="scope">
                  <el-button type="danger" link @click="delLine(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog()">提交</el-button>
        </div>
      </template>
    </SWDrawer>

    <el-dialog v-model="dialogVisible" :show-close="false">
      <template #header>
        <div
          class="row-center"
          style="
            height: 32px;
            border-radius: 2px;
            background: rgba(219, 106, 15, 0.1);
            border: 1px solid #db6a0f;
            border-radius: 2px;
          "
        >
          <img
            src="@/assets/imgs/oa/oa_tips_orange.svg"
            style="width: 14px; height: 14px; margin-right: 10px; margin-left: 10px"
          />
          <div style="font-size: 12px; color: #db6a0f"
            >请谨慎填写货品编码！注意大小写和数值是否正确
          </div>
        </div>
      </template>
      <el-form :model="dialogForm" style="padding: 10px 0">
        <el-form-item prop="productCode">
          <el-input v-model="dialogForm.productCode" class="big-input"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmCode">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { defineProps } from 'vue'

import { debounce, cloneDeep } from 'lodash-es'
import { useAppStore } from '@/store/modules/app'
import { ElLoading } from 'element-plus'

const appStore = useAppStore()

import { getErpInfo, saveErpInfo } from '@/api/oa/new/designGallery/index'
import Index from '@/views/dataV/index.vue'
import request from '@/config/axios'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '936px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})

const radioOptions = [
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
]

const { dicList } = useDicList()

const listDic = ref([])

const dialogWidth = computed(() =>
  (props.designInfo && Number(props.designInfo.planProductType || '') === 2) ||
  Number(props.designInfo.planProductType || '') === 3
    ? '1700px'
    : '1500px'
)

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref<any>({})
const nodeData = ref<any>({})
const bukList = ref([])
// 打开
const open = async (data: any) => {
  getConfigUrl()
  visible.value = true
  if (data) {
    nodeData.value = { ...data }
    if (nodeData.value.nodeCode) {
      const res = await getErpInfo(data.npDesignPictureGodownId, '') //回显详情
      if (res) {
        localForm.value = { ...res }
        setSkuCode()
        bukList.value = cloneDeep(localForm.value.npPrenatalSampleInfoList)
      }
      localForm.value.isSyncWdt =
        localForm.value.isSyncWdt === null ? '1' : `${Number(localForm.value.isSyncWdt)}`
    }
  }
}

const tipsUrl = ref('')
const getConfigUrl = async () => {
  const code = 'specification_size_type'
  tipsUrl.value = await request.get({ url: `/api/config/getCode/${code}` })
}

const codeChange = () => {
  setSkuCode()
}

const setSkuCode = () => {
  localForm.value = {
    ...localForm.value,
    npPrenatalSampleInfoList: localForm.value.npPrenatalSampleInfoList.map((np: any) => {
      let obj: any = { ...np }
      if (!obj?.isSubmitSku) {
        let skuCodes: any = obj?.skuCode?.length ? obj.skuCode.split('-') : []
        if (skuCodes?.length === 3) {
          skuCodes.splice(
            0,
            1,
            localForm.value?.productCode ? `${localForm.value.productCode}` : ''
          )
        } else {
          skuCodes.unshift(localForm.value?.productCode ? `${localForm.value.productCode}` : '')
        }
        obj.skuCode = skuCodes.join('-')
      } else {
        obj.isSubmitSku = null
      }
      return obj
    })
  }
}

defineExpose({ open })

onMounted(() => {
  console.log('designInfo', props.designInfo)
})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const ruleFormRef = ref()

const rules = reactive({
  productCode: [{ required: true, message: '请输入货品编码', trigger: 'blur' }]
})

const handleInput = (value: string, item, field) => {
  // 限制只能输入数字和小数点
  let value1 = value.replace(/[^0-9.]/g, '')

  // 限制只能输入3位小数
  value1 = value1.replace(/^(\d+(\.\d{0,3})?)?.*$/, '$1')
  item[`${field}`] = value1
  // 非成本价和零售价，计算成品价为裸货价+包装人工费
  field !== 'finishedProductPrice' && field !== 'retailPrice' && handleFinishedProductPrice()
}

const handleFinishedProductPrice = () => {
  localForm.value.npPrenatalSampleInfoList.forEach((item) => {
    let productCostExcludingTax = Number(item.productCostExcludingTax || 0)
    let packagingManpower = Number(item.packagingManpower || 0)
    let finishedProductPrice = parseFloat((productCostExcludingTax + packagingManpower).toFixed(3))
    item.finishedProductPrice = finishedProductPrice
  })
}

const confirmDialog = debounce(async () => {
  const list = localForm.value.npPrenatalSampleInfoList
  const flag = list.some((item: any) => !item.skuName || !item.skuCode || !item.retailPrice)
  if (flag) {
    message.notifyWarning('该页面存在SKU名称、SKU编码、零售价为空，请修改后重新保存！')
    return
  }
  const skuCodeSet = new Set(list.map((item: any) => item.skuCode))
  const isRepeat = skuCodeSet.size === list.length
  if (!isRepeat) {
    const temp = Array.from(skuCodeSet)
    const tempSkuCodes: any = []
    temp.forEach((code: string) => {
      const arr = list.filter((item: any) => item.skuCode === code)
      if (arr && arr.length > 1) {
        tempSkuCodes.push(code)
      }
    })
    message.notifyWarning(`该页面存在重复的SKU编码【${tempSkuCodes.join()}】，请修改后重新保存！`)
    return
  }
  ruleFormRef.value &&
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        checkValue()
      } else {
        return false
      }
    })
})

const checkValue = async () => {
  const res: any = await request.post({
    url: '/api/np/prenatal/sample/checkErpInfo',
    data: {
      ...localForm.value,
      npPrenatalSampleInfoList: localForm.value.npPrenatalSampleInfoList.map((np: any) => ({
        ...np,
        isSubmitSku: 1
      }))
    }
  })
  if (!!res) {
    const { t } = useI18n()
    await ElMessageBox.confirm(res, t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
      showClose: false,
      center: true,
      cancelButtonClass: 'cancelbth',
      confirmButtonClass: 'yepbth',
      customClass: 'custom_class_confirm'
    })
    eRPInformationFillingConfirm()
  } else {
    eRPInformationFillingConfirm()
  }
}

const eRPInformationFillingConfirm = async () => {
  const data = {
    ...localForm.value,
    npPrenatalSampleInfoList: localForm.value.npPrenatalSampleInfoList.map((np: any) => ({
      ...np,
      isSubmitSku: 1
    }))
  }
  await saveErpInfo(data)
  message.success('操作成功')
  emit('confirm')
  visible.value = false
}

const allSetOneValue = (val: string, key: string) => {
  if (!val) return
  localForm?.value?.npPrenatalSampleInfoList.map((item) => {
    item[key] = val
  })
  key !== 'finishedProductPrice' && handleFinishedProductPrice()
}

const addLine = () => {
  const list = localForm.value.npPrenatalSampleInfoList
  const obj: any = {}
  if (list && list.length > 0) {
    obj['productCostExcludingTax'] = list[0]['productCostExcludingTax']
    obj['packagingManpower'] = list[0]['packagingManpower']
    obj['finishedProductPrice'] = list[0]['finishedProductPrice']
    obj['retailPrice'] = list[0]['retailPrice']
    obj['skuCode'] = localForm.value?.productCode ? `${localForm.value.productCode}-` : ''
  }
  localForm.value.npPrenatalSampleInfoList.push(obj)
}

const restoreData = () => {
  message
    .confirm('还原后，数据将回到最原始的数据，你做的所有修改都不可找回！确认是否还原')
    .then((res) => {
      if (res === 'confirm') {
        const loading: any = ElLoading.service({ fullscreen: true, text: '数据还原中......' })
        request
          .post({
            url: `/api/np/prenatal/sample/saveSkuInfo`,
            data: { designPictureGodownId: localForm.value?.designPictureGodownId || '' }
          })
          .then(() => {
            getErpInfo(localForm.value.designPictureGodownId, '')
              .then((res: any) => {
                if (res) {
                  localForm.value = { ...res }
                  setSkuCode()
                  bukList.value = cloneDeep(localForm.value.npPrenatalSampleInfoList)
                }
                localForm.value.isSyncWdt =
                  localForm.value.isSyncWdt === null ? '1' : `${Number(localForm.value.isSyncWdt)}`
              })
              .finally(() => {
                loading?.close()
              })
          })
        // localForm.value.npPrenatalSampleInfoList = cloneDeep(bukList.value)
      }
    })
}

const delLine = async (scope: any) => {
  const { row, $index } = scope
  const { skuName } = row
  message
    .confirm(`是否删除SKU【${skuName || ''}】的该行数据？`)
    .then((res) => {
      if (res === 'confirm') {
        localForm.value.npPrenatalSampleInfoList.splice($index, 1)
      }
    })
    .catch(() => {})
}

const dialogVisible = ref(false)
const dialogForm = ref({
  productCode: ''
})
const productCodeInptRef = ref()
const openDialog = () => {
  const { productCode } = localForm.value
  dialogForm.value = { productCode }
  dialogVisible.value = true
  productCodeInptRef?.value?.blur()
}

const confirmCode = async () => {
  const { productCode } = dialogForm.value
  const firstCode = productCode.charAt(0)
  if (!/^[A-Z].*/.test(firstCode) || !/^[a-zA-Z].*/.test(firstCode)) {
    await message.confirm(
      !/^[A-Z].*/.test(firstCode) && !/^[a-zA-Z].*/.test(firstCode)
        ? '您填写的货品编码首位不是字母，请确定是否输入正确！'
        : '您填写的货品编码首位字母不是大写，请确定是否输入正确！'
    )
  }
  const { productCode: oldProductCode } = localForm.value
  dialogVisible.value = false
  localForm.value = { ...localForm.value, ...dialogForm.value }
  if (productCode !== oldProductCode) {
    codeChange()
  }
}
</script>

<style scoped lang="scss">
:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;
  font-size: 14px;
  text-align: right;
  color: #666666;
}

:deep(.el-table--default .cell) {
  // padding-left: 20px;
  // padding-right: 20px;
}

.tips {
  cursor: pointer;
  display: inline-block;
  margin-left: 5px;
}

.big-input {
  :deep() {
    .el-input__wrapper.el-input__wrapper {
      height: 90px;
      // line-height: 90px;
      background-color: var(--el-input-bg-color) !important;
      box-shadow: 0 0 0 1px var(--el-input-border-color) inset !important;
      .el-input__inner {
        height: 90px;
        line-height: 90px;
        font-size: 40px;
        font-weight: 500;
      }
    }
  }
}
</style>
