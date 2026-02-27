<template>
  <div v-if="visible">
    <el-dialog
      v-model="visible"
      :width="width"
      :before-close="handleClose"
      @open="resetForm"
      class="oadialog-background"
      style="border-radius: 20px"
      :append-to-body="true"
    >
      <div class="row-center">
        <div
          class="add-item"
          :class="{ 'add-item-active': addType === 'newGoods' }"
          @click="selectAddType('newGoods')"
        >
          <img src="@/assets/imgs/oa/newGoods_icon.png" />
          <div class="add-item-text">产品</div>
        </div>
        <div style="width: 17px"></div>
        <div
          class="add-item"
          :class="{ 'add-item-active': addType === 'package' }"
          @click="selectAddType('package')"
        >
          <img src="@/assets/imgs/oa/package_icon.png" />
          <div class="add-item-text">包装 </div>
        </div>
      </div>
      <template #header="{}">
        <div class="my-header">
          <img src="@/assets/imgs/oa/plan_add_icon.png" class="shenhe-title" />
          <span style="margin-left: 10px">{{ title }}</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { enterpriseExamine } from '@/api/oa/new/plan/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '483px'
  }
})
const addType = ref('')

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  addType.value = 'newGoods'
  emit('update:modelValue', false)
}

const resetForm = () => {
  addType.value = 'newGoods'
}

const selectAddType = (type: string) => {
  addType.value = type
  setTimeout(() => {
    addType.value = ''
    emit('confirm', type)
    emit('update:modelValue', false)
  }, 300)
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 3px;
    margin-top: 3px;
  }
}
</style>

<style scoped lang="scss">
.add-item {
  // margin-left: 5px;
  width: 219px;
  height: 228px;
  background: #fcfdff;
  box-shadow: 16px 21 39px -7px rgba(212, 178, 178, 0.17);
  border-radius: 7px;
  border: 1px solid #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  line-height: 19px;
  letter-spacing: 2px;
  img {
    margin-top: 23px;
    width: 148px;
    height: 148px;
  }

  &-text {
    padding-top: 15px;
  }
}

.add-item-active {
  border: 1px solid #0064ff;
  color: #0064ff;
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
