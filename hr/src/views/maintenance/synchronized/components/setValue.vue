<template>
  <div class="page-details" v-loading="loading">
    <el-dialog
      v-model="visible"
      :show-close="false"
      :width="width"
      :append-to-body="appendToBody"
      :align-center="align"
      :top="top"
      :before-close="handleBeforeClose"
      @closed="closed"
      destroy-on-close
    >
      <template #header="{ close }">
        <div class="header_txt"> 批量设置</div>
        <el-icon @click="close" class="header_close">
          <CloseBold />
        </el-icon>
      </template>
      <template #default>
        <el-form ref="formRef" :model="dataValue" label-width="110px" :rules="rules">
          <el-form-item prop="isUnsalable" label="是否为滞销品">
            <el-select-v2
              :options="isUnsalableOps"
              :multiple="false"
              v-model="dataValue.isUnsalable"
              clearable
            />
          </el-form-item>
          <el-form-item prop="category" label="品类">
            <el-select-v2
              :options="categoryOps"
              :multiple="false"
              v-model="dataValue.category"
              clearable
            />
          </el-form-item>
          <el-form-item prop="seasonCategory" label="季节分类">
            <el-select-v2
              :options="seasonCategoryOps"
              :multiple="false"
              v-model="dataValue.seasonCategory"
              clearable
            />
          </el-form-item>
          <el-form-item prop="directorId" label="责任人">
            <user-screen :item="dataValue" name="directorName" id="directorId" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="contain_btn">
          <el-button @click="close" :disabled="loading">取消</el-button>
          <el-button type="primary" @click="setValue" :loading="loading">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'SynchronizedSetValue' }
</script>

<script lang="tsx" setup>
import {
  categoryOps,
  seasonCategoryOps,
  isUnsalableOps
} from '@/views/maintenance/unsalable/page/options'
import { FromProvideType } from '@/components/template/config/type'
import UserScreen from '@/components/common/user/userScreen.vue'
import { consistency } from '@/utils'

const { dataList, selectRows, onSearch } = inject(`SynchronizedForm`) as FromProvideType

const visible = ref(false),
  dataValue = ref(),
  bukValue = ref(),
  loading = ref(false),
  formRef = ref()

const props = defineProps({
  appendToBody: { type: Boolean, default: false },
  align: { type: Boolean, default: true },
  width: { type: Number, default: 500 },
  top: { type: String, default: '15vh' },
  name: { type: String, default: '' }
})

const rules = computed(() => ({
  category: [{ message: '请选择品类', trigger: ['change', 'blur'], required: true }],
  seasonCategory: [{ message: '请选择季节分类', trigger: ['change', 'blur'], required: true }],
  isUnsalable: [{ message: '请选择是否为滞销品', trigger: ['change', 'blur'], required: true }]
}))

const openDialog = async () => {
  dataValue.value = {}
  bukValue.value = {}
  visible.value = true
}

const close = () => {
  handleBeforeClose(() => {
    visible.value = false
  })
}

const closed = () => {
  visible.value = false
}

const setValue = () => {
  formRef?.value?.validate((valid: boolean) => {
    if (valid) {
      const loadingInstance = ElLoading.service({ lock: true, text: '数据修改中,请稍等...' })
      const worker = new Worker(new URL('./worker.ts', import.meta.url))
      const workerData = {
        dataList: JSON.parse(JSON.stringify(dataList.value)),
        ids: selectRows.value.map((si: any) => si.goodsId),
        updateData: JSON.parse(JSON.stringify(dataValue.value)),
        name: 'goodsId'
      }
      worker.postMessage(workerData)
      worker.onmessage = (e: any) => {
        const { type, progress: progressValue, data, message } = e.data

        switch (type) {
          // case 'progress':
          //   progress.value = progressValue;
          //   break;

          case 'complete':
            dataList.value = data
            visible.value = false
            loadingInstance?.close()
            worker.terminate()
            onSearch()
            break

          case 'error':
            console.error('Worker error:', message)
            loadingInstance?.close()
            worker.terminate()
            break
        }
      }

      worker.onerror = () => {
        loadingInstance?.close()
        worker.terminate()
      }
    }
  })
}

const handleBeforeClose = (done) => {
  consistency(dataValue.value, bukValue.value, () => {
    done()
  })
}

defineExpose({ openDialog, close, closed })
</script>
<style lang="scss" scoped>
.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 12px;
}

:deep() {
  .el-dialog {
    padding: 0;
  }

  .el-form-item {
    margin-bottom: 16px !important;
  }

  .el-dialog__header {
    margin: 0px;
    position: relative;
    padding: 12px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-dialog__body {
    padding: 15px !important;
  }

  .el-form-item__label {
    color: #666 !important;
  }

  .el-radio__label {
    font-weight: 400;
  }

  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
    position: relative;
    text-align: right;
    height: 52px;
    width: 100%;
    padding: 10px 20px;
  }
}
</style>
