<template>
  <!-- :before-close="beforeClose" -->
  <el-dialog title="供应商简称" v-model="visible" :show-close="false" class="dialog_style">
    <template #header>
      <div class="header">
        <div>供应商简称</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
      </div>
    </template>
    <el-form :label-width="105">
      <el-form-item label="供应商简称：" prop="abbreviationCompany">
        <el-input v-model="dataValue.abbreviationCompany" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="">
        <div class="btn_group">
          <el-button @click="visible = false" class="btn normal">取消</el-button>
          <el-button type="primary" @click="submit" class="btn normal">确定</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="tsx">
export default { name: 'SupplierAbbreviation' };
</script>

<script lang="tsx" setup>
import { getSupplierById, updateSupplier } from '@/api/supplier';
import { ElLoading } from 'element-plus';

const emit = defineEmits(['updated'])

const visible = ref<boolean>(false), dataValue = ref<any>({});

const submit = async () => {
  const loading = ElLoading.service({ lock: true });
  const res: any = await updateSupplier(dataValue.value);
  res?.code === 200 && ElMessage.success('修改成功!') && (visible.value = false, emit('updated', dataValue.value));
  loading.close();
};

const open = async (row: any) => {
  const res: any = await getSupplierById(row.id);
  res?.id && (dataValue.value = { ...res }, visible.value = true);
}

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
