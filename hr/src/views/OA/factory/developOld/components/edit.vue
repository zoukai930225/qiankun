<template>
  <div>
    <el-dialog v-model="visible" append-to-body :show-close="false" :top="'120px'" width="500"
      style="border-radius: 14px;transform: none;position: static;margin-top: var(--el-dialog-margin-top) !important;"
      :close-on-click-modal="false">
      <template #header>
        <div class="header">
          <div>快速填充</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div style="width: 100%;">
        <el-form :model="formValue" ref="formRef" label-width="180px" :validate-on-rule-change="false">
          <!-- <el-form-item label="裸货价(不含税)" prop="productCostExcludingTax">
            <el-input-number v-model="(formValue.productCostExcludingTax as any)" :precision="2" :controls="false"
              :max="999999999.99" style="width: 100%;">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item> -->
          <el-form-item label="包装人工费" prop="packagingManpower">
            <el-input-number v-model="(formValue.packagingManpower as any)" :precision="2" :controls="false"
              :max="999999999.99" style="width: 100%;">
              <template #suffix>元</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="起订量" prop="singleColorOrderQuantity" style="margin-bottom: 0px !important ">
            <el-input-number v-model="(formValue.singleColorOrderQuantity as any)" style="width: 100%;" :precision="2"
              :controls="false" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopQuoteEdit' });

const emit = defineEmits(['edit']);

const formValue = ref<any>({});

const visible = ref<boolean>(false);

const open = () => {
  visible.value = true;
  formValue.value = {};
};

const save = () => {
  emit('edit', formValue.value);
  visible.value = false;
};

defineExpose({ open });

</script>

<style scoped lang="scss">
@use '@/views/OA/factory/style/card.scss';

:deep() {
  .el-input-number .el-input__inner {
    text-align: left;
  }
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
