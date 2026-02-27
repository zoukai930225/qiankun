<template>
  <div class="assignment">
    <el-dialog v-model="visible" :show-close="false" width="800" align-center @close="close"
      class="oadialog-background1">
      <div class="wapper">
        <el-form :model="addForm" label-width="auto" label-position="left" ref="formRef" :rules="rules">
          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="addForm.remark" :rows="2" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </div>
      <template #header="{ close: closeDialog }">
        <div class="my-header">
          <span class="title">批量视觉审核</span>
          <img src="@/assets/imgs/team/closeD.png" @click="closeDialog" class="closeD" />
        </div>
      </template>
      <template #footer>
        <div>
          <div class="btn-wapper">
            <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit(0)">拒绝</el-button>
            <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit(1)">通过</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { batchVisualAudit } from '@/api/team/index'
import type { FormRules } from 'element-plus'
defineOptions({ name: 'Assignment' })
const message = useMessage() // 消息弹窗
const visible = ref(false)

const props = defineProps({
  node: {
    type: Number
  },
  subNode: {
    type: String
  },
  currentDetail: {
    type: Object
  },
  isVisualDashboard: {
    //是从日历过来的
    type: Boolean,
    default: false
  }
})

let addForm = reactive({
  remark: undefined //备注
})

const rules = reactive<FormRules<any>>({
  remark: [
    {
      required: true,
      message: '请输入备注',
      trigger: 'change'
    }
  ]
})

const emit = defineEmits(['success', 'cancle'])

const formRef = ref()
const onSubmit = async (flag) => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const params = {
    parentId: parentIds.value,
    node: 7,
    type: flag == 0 ? 8 : 7,
    remark: addForm.remark
  }

  await batchVisualAudit(params)
  message.success('操作成功')
  visible.value = false
  addForm.remark = undefined //备注
  emit('success')
}

const close = () => {
  parentIds.value = undefined
  visible.value = false
  addForm.remark = undefined //备注
  resetForm()
  emit('cancle')
}

const parentIds = ref()
const open = (ids) => {
  visible.value = true
  parentIds.value = ids
  addForm.remark = undefined //备注
}

// 关闭弹出框 重置表单报错信息
const resetForm = () => {
  Object.keys(formRef.value.fields).forEach((field) => {
    formRef.value.fields[field].error = ''
  })
  formRef.value.resetFields()
}

defineExpose({ open, close })
</script>

<style scoped lang="scss">
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .title {
    font-size: 14px;
    color: #333333;
  }

  .closeD {
    width: 16px;
    height: 16px;
  }
}

:deep(.el-dialog__header) {
  margin-right: 0;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

.wapper {
  padding: 16px 16px 10px 16px;
  border-radius: 12px;
  box-sizing: border-box;
  background: #ffffff;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 32px;
  background: #fafafa;
  border-radius: 4px;
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;

  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.itemValue {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

:deep(.el-dialog) {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
