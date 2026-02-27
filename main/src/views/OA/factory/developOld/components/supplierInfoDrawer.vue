<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" :width="936" @close="reset">
    <div class="infoContent" v-loading="drawerLoading">
      <div class="radios">
        <el-scrollbar>
          <el-radio-group v-model="checkedSupplierId" @change="handelSelectSupplier">
            <div class="radio" v-for="(item, index) in matchedSuppliers" :key="item.supplierId">
              <el-radio :value="item.supplierId" size="large">
                <el-tooltip placement="top" :content="item.supplierName" :offset="6">
                  <span>{{ truncateStringSubstring(item.supplierName, 8, 0) }}</span>
                </el-tooltip>
              </el-radio>
              <div :class="['status', !item.quoteInfo ? 'red' : '']">{{ !item.quoteInfo ? "未实物报价" : '已实物报价' }}</div>
            </div>
          </el-radio-group>
        </el-scrollbar>
      </div>
      <el-card class="basicInfo" shadow="never" body-class="basicInfoCardBody" footer-class="basicInfoCardFooter">
        <template #header>
          <CardTitle :title="'基本信息'" />
        </template>
        <div class="form">
          <el-form :model="checkedSupplier">
            <el-form-item label="匹配原因">
              <s-text-area disabled  :rows="4" v-model="checkedSupplier.matchReason" />
            </el-form-item>
            <el-form-item label="预估报价">
              <el-input disabled v-model="checkedSupplier.matchPrice" />
            </el-form-item>
            <el-form-item label="选供专员">
              <div class="inputWrapper" style="width: 100%;">
                <personListPopover :person-list="checkedSupplier.chosenSupplierStaffs" :showCount="4" />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template #footer v-if="checkedSupplier.showQuoteVerificationButton">
          <el-button type="primary" @click="openPriceDialog"
            v-if="checkedSupplier.showQuoteVerificationButton">报价核价</el-button>
          <!-- <el-button type="primary" v-if="!checkedSupplier?.quoteInfo">提交</el-button> -->
          <!-- <div class="disabledBtn ml10px" v-if="checkedSupplier?.quoteInfo">已提交</div> -->
        </template>
      </el-card>
    </div>
    <el-card v-loading="drawerLoading" v-if="checkedSupplier?.quoteInfo" class="priceInfo" shadow="never"
      body-class="priceInfoCardBody" footer-class="priceInfoCardFooter">
      <template #header>
        <CardTitle :title="'报价核价'" />
      </template>
      <priceCheckForm class="priceForm" :disabled="true" :formData="priceFormData" />
    </el-card>
    <template #footer>
      <el-button @click="reset" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>

  <!-- 报价核价 -->
  <priceDialog ref="priceDialogRef" @success="submitPriceCheck" />
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue';
import priceDialog from './priceDialog.vue';
import priceCheckForm from './priceCheckForm.vue'
// import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'
import { truncateStringSubstring, hasPermissionsJs } from '@/utils/index'

const emits = defineEmits(['success'])
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const fsTaskId = ref('') // 工厂二开任务id
const open = async (type, id) => {
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = '供应商信息'
  fsTaskId.value = id
  if (id) {
    getMatchedSuppliers(id)
  }
}

// 获取供应商列表
const getMatchedSuppliers = async (id: string) => {
  try {
    drawerLoading.value = true
    const data = await factoryDevelopApi.getSupplierFlowList(id)
    matchedSuppliers.value = data || []
    checkedSupplier.value = matchedSuppliers.value[0]
    checkedSupplierId.value = matchedSuppliers.value[0]?.supplierId
  } finally {
    drawerLoading.value = false
  }
}

// 选择供应商
const matchedSuppliers = ref<any>([])
const checkedSupplier = ref<any>({})
const checkedSupplierId = ref('')
const handelSelectSupplier = (id: string) => {
  checkedSupplierId.value = id
  checkedSupplier.value = matchedSuppliers.value.find((el: any) => el.supplierId === id)

}

// 报价核价
const priceDialogRef = ref()
const openPriceDialog = () => {
  priceDialogRef.value?.open(fsTaskId.value, checkedSupplierId.value)
}
// 提交报价核价
const submitPriceCheck = () => {
  getMatchedSuppliers(fsTaskId.value)
}

// 处理报价核价回显
const priceFormData = computed(() => {
  return {
    ...checkedSupplier.value.quoteInfo,
    attachmentUrl: checkedSupplier.value.quoteInfo.attachmentUrl.split(',').map((file: any) => ({
      url: file
    }))
  }
})

const reset = () => {
  drawerVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@use '@/views/OA/factory/style/card.scss';
</style>
