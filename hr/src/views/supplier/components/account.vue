<template>
  <el-dialog title="系统账号" v-model="visible" :show-close="false" class="dialog_style">
    <template #header>
      <div class="header">
        <div>系统账号</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
      </div>
    </template>
    <el-form :label-width="60">
      <el-form-item label="账号：" prop="account">
        <el-input v-model="dataValue.account" readonly />
      </el-form-item>
      <el-form-item label="密码：" prop="passWord">
        <el-input class="keyword" v-model="dataValue.passWord" readonly />
        <el-button link type="primary" @click="reset" class="btn normal">重置</el-button>
      </el-form-item>
      <el-form-item label="" label-width="0px">
        <span class="tips">备注：当前显示的账号和密码为初始设置，若供应商修改过密码，点击重置恢复为初始密码，在下次登录时需重新设置新密码</span>
      </el-form-item>
      <el-form-item label="">
        <div class="btn_group">
          <el-button @click="visible = false" class="btn normal">取消</el-button>
          <el-button type="primary" @click="copy" class="btn normal">复制</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="tsx">
export default { name: 'SupplierAccount' };
</script>

<script lang="tsx" setup>
import { SuccessFilled } from '@element-plus/icons-vue';
import { resetPassWord } from '@/api/supplier';
import { useClipboard } from '@vueuse/core';
import { ElLoading } from 'element-plus';
import { markRaw } from 'vue'

class DataItem {
  id: string;
  account: string;
  passWord: string;
  constructor(parameters?: any) {
    this.id = parameters?.id || ''
    this.account = parameters?.businessRepresentativePhone || '';
    this.passWord = parameters?.passWord || '000000';
  }
}

const { t } = useI18n();

const visible = ref<boolean>(false), dataValue = ref<DataItem>(new DataItem()), loading = ref();

const reset = async () => {
  loading.value = ElLoading.service({ lock: true });
  const res: any = await resetPassWord(dataValue.value.id);
  !!res && ElMessageBox.confirm(`密码已成功重置为初始密码：000000`, '', {
    type: 'success', confirmButtonText: '知道了', showCancelButton: false,
    icon: markRaw(SuccessFilled),
  });
  loading?.value?.close();
};

const open = async (row: any) => {
  dataValue.value = new DataItem(row);
  visible.value = true;
}

const copy = async () => {
  const { copy, copied, isSupported } = useClipboard({ source: `账号: ${dataValue.value.account || ''} 密码: ${dataValue.value.passWord || ''}` });
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
};

defineExpose({ open });

</script>
<style lang="scss">
.dialog_style {
  width: 400px;
  border-radius: 14px;
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
</style>
<style lang="scss" scoped>
.keyword {
  width: 82%;
  margin-right: 15px;
}

.btn_group {
  text-align: right;
  width: 100%;
}

.tips {
  font-size: 12px;
  color: #cdcdcd;
}
</style>
