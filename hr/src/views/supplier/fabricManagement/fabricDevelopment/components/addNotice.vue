<template>
  <el-dialog title="应用范围" v-model="dialogVisible" append-to-body :show-close="false" style="
      width: 570px;
      border-radius: 14px;
    ">
    <template #header>
      <div class="header">
        <div>{{ currentDetail?.supplierName }}</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="form" :label-width="tipInfo.width" :rules="rules" ref="formRef" :validate-on-rule-change="false">
        <el-form-item label="试穿结果" prop="operateStatus" v-if="isTry" @change="clear">
          <el-radio-group v-model="form.operateStatus">
            <el-radio :value="1">审核通过</el-radio>
            <el-radio :value="2">继续调整</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="tipInfo.remarkValue" prop="remark">
          <s-text-area v-model="form.remark" :placeholder="`请输入${tipInfo.remarkValue}`" />
        </el-form-item>
        <el-form-item :label="tipInfo.titleValue" prop="attachmentUrl" v-if="!isTry">
          <transfer :upload-data="{ code: 'FS_SUPPLIER_PLAN' }" :width="445" v-model="form.attachmentUrl" :limit="5"
            :tip="'最多上传5张大小不超过20M的图片'" accept-type="all" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提 交</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
import Transfer from "@/components/common/upload/transfer.vue";
import request from '@/config/axios';

class TipItem {
  titleValue: string;
  remarkValue: string;
  tipsValue: string;
  urlValue: string;
  width: number;
  constructor(data: any = {}) {
    this.width = data?.width || 53;
    this.titleValue = data?.titleValue || '附件';
    this.remarkValue = data?.remarkValue || '备注';
    this.tipsValue = data?.tipsValue || '请仔细核对备注信息,确认提交?';
    this.urlValue = data?.urlValue || '';
  }
}

const dialogVisible = ref(false);

const message = useMessage() // 消息弹窗

const form = ref({ id: '', remark: '', attachmentUrl: '', operateStatus: 1 }), tipInfo = ref<TipItem>({ ...new TipItem() });

const loading = ref(false), isTry = ref<boolean>(false);// 提交按钮加载状态

// 当前操作的详情
const currentDetail = ref()

const clear = () => {
  formRef.value.clearValidate();
}

const open = (item: any, tip: any, tryValue: boolean = false) => {
  isTry.value = tryValue;
  tipInfo.value = { ...new TipItem(tip) };
  form.value = { id: item.id, remark: '', attachmentUrl: '', operateStatus: 1 };
  dialogVisible.value = true
  currentDetail.value = item
  formRef?.value?.resetFields();
}

const rules = computed(() => tipInfo.value.titleValue === '色卡' ? {
  remark: [{ required: true, message: `请输入${tipInfo.value.remarkValue}`, trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: `请上传${tipInfo.value.titleValue}`, trigger: 'blur' }]
} : (isTry.value ? (form?.value?.operateStatus === 2 ? { remark: [{ required: true, message: `请输入${tipInfo.value.remarkValue}`, trigger: 'blur' }] } : {}) : {
  remark: [{ required: true, message: `请输入${tipInfo.value.remarkValue}`, trigger: 'blur' }]
}));

const emit = defineEmits(['success'])

const formRef = ref()

const submitForm = async () => {
  const res = await formRef.value.validate()
  if (!res) return
  message.confirm(tipInfo.value.tipsValue, '系统提示').then(async () => {
    loading.value = true // 开始加载
    request.post({ url: tipInfo.value.urlValue, data: form.value }).then((res: any) => {
      message.success('提交成功');
      dialogVisible.value = false;
      emit('success');
    }).finally(() => {
      loading.value = false;
    });
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.container {
  padding-right: 12px;
  box-sizing: border-box;
}
</style>
