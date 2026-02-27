<template>
  <el-dialog v-model="dialogVisible" :width="520" class="oadialog-background" :show-close="false">
    <template #header>
      <div class="my-header">
        <span>查看详情</span>
        <img
          src="@/assets/imgs/negativeReviewDashboard/close.svg"
          alt=""
          class="close-icon"
          @click="dialogVisible = false"
        />
      </div>
    </template>

    <div class="dialog-content" v-loading="loading">
      <el-form :model="form" ref="formRef" label-width="120px" class="detail-form">
        <el-form-item label="非赠款消耗" v-if="form.nonGrantConsumption">
          <el-input v-model="form.nonGrantConsumption" readonly />
        </el-form-item>
        <el-form-item label="赠款消耗" v-if="form.grantConsumption">
          <el-input v-model="form.grantConsumption" readonly />
        </el-form-item>
        <el-form-item label="消返红包消耗" v-if="form.consumBackRedEnv">
          <el-input v-model="form.consumBackRedEnv" readonly />
        </el-form-item>
        <el-form-item label="共享钱包消耗" v-if="form.sharedWalletConsumption && (accountType === '10' || accountType === '11')">
          <el-input v-model="form.sharedWalletConsumption" readonly />
        </el-form-item>
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="余额总消耗">
              <el-input v-model="form.cost" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总存入">
              <el-input v-model="form.totalDeposit" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="非赠款消耗">
              <el-input v-model="form.nonGrantConsumption" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总转入">
              <el-input v-model="form.totalTransferIn" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="赠款消耗">
              <el-input v-model="form.grantConsumption" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总转出">
              <el-input v-model="form.totalTransferOut" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="消返红包消耗">
              <el-input v-model="form.consumBackRedEnv" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总余额">
              <el-input v-model="form.totalBalance" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="立减红包消耗">
              <el-input v-model="form.reduceRedEnvelopeConsumption" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠款余额">
              <el-input v-model="form.grantBalance" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="共享钱包消耗">
              <el-input v-model="form.sharedWalletConsumption" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="非赠款余额">
              <el-input v-model="form.nonGrantBalance" readonly />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="共享赠款消耗">
              <el-input v-model="form.sharedGrantConsumption" readonly />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AccountDetailViewDialog' })
import * as QcApi from '@/api/qianchuan'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false)
const formRef = ref() // 表单引用
const form = ref({
  cost: '', // 消耗
  totalDeposit: '', // 非赠款消耗
  nonGrantConsumption: '', // 非赠款消耗
  totalTransferIn: '', // 总转入
  grantConsumption: '', // 赠款消耗
  totalTransferOut: '', // 总转出
  consumBackRedEnv: '', // 消返红包消耗
  totalBalance: '', // 总余额
  reduceRedEnvelopeConsumption: '', // 立减红包消耗
  grantBalance: '', // 赠款余额
  nonGrantBalance: '', // 非赠款余额
  sharedWalletConsumption: '', // 共享钱包消耗
  sharedGrantConsumption: '' // 共享赠款消耗
}) // 表单数据

const loading = ref(false) // 加载状态
// 重置表单数据
const resetForm = () => {
  form.value = {
    cost: '',
    totalDeposit: '',
    nonGrantConsumption: '',
    totalTransferIn: '',
    grantConsumption: '',
    totalTransferOut: '',
    consumBackRedEnv: '',
    totalBalance: '',
    reduceRedEnvelopeConsumption: '',
    grantBalance: '',
    nonGrantBalance: '',
    sharedWalletConsumption: '',
    sharedGrantConsumption: ''
  }

  formRef.value?.resetFields()
}
// 打开弹窗
const accountType = ref()
const open = async (id: string,type:string) => {
  dialogVisible.value = true
  // console.log('打开弹窗，ID:', id)
  accountType.value = type
  resetForm()

  if (id) {
    loading.value = true
    try {
      const res = await QcApi.getQcAccountFinancialDetail(id)
      form.value = Object.assign(form.value, res)
    } catch (error) {
      message.error('获取详情失败')
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .close-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}

.dialog-content {
  padding: 20px;
}

.detail-form {
  :deep(.el-input__wrapper) {
    background-color: #f5f7fa;
    box-shadow: none;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
  }
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
