<!--
 * @Date: 2024-09-13 15:25:17
  动态添加链接列表
-->
<template>
  <div class="addlink-wapper">
    <div class="bottom-info" @click="addItem">
      <img src="@/assets/imgs/team/add-blue.png" alt="" class="add-blue" /><span>添加链接</span>
    </div>
    <div class="flex-row input-item" v-for="(item, index) in inputItems" :key="index">
      <el-input
        v-model="item.value"
        style="width: 400px; border: 1px solid #eee"
        placeholder=""
        :disabled="disabled"
      >
        <template #prepend>{{ item.label }}</template>
      </el-input>
      <el-input
        class="input-desc"
        v-model="item.desc"
        :placeholder="item.description"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'SWaddLink' })

interface LinkItem {
  label: string
  value: string
  placeholder: string
  description: string
  desc: string
}

const addItem = () => {
  if (props.disabled) return
  inputItems.value.push({
    label: 'URL',
    value: '',
    placeholder: '',
    desc: '',
    description: '备注：方案链接，共享盘路径'
  })
}

const props = defineProps({
  modelValue: {
    type: Array as () => LinkItem[],
    default: () => {
      return []
    }
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const inputItems: Ref<LinkItem[]> = computed({
  get: () => {
    return props.modelValue
  },
  set: (val: LinkItem[]) => {
    emit('update:modelValue', val)
  }
})

onMounted(() => {})

onUnmounted(() => {
  inputItems.value = []
})
</script>

<style scoped lang="scss">
.addlink-wapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .bottom-info {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin-top: 22px;
    align-items: center;
    font-size: 12px;
    color: #0064ff;

    .add-blue {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }

  .input-item {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    flex-direction: row;
    .input-desc {
      width: 200px;
      box-sizing: border-box;
      font-weight: 400;
      font-size: 12px;
      color: #999999;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #dee0e3;
      margin-left: 14px;
      height: 36px;
      line-height: 36px;
    }
  }
}
:deep(.el-input__wrapper, ) {
  background: #f3f4f7 !important;
}

:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: none;
}

:deep(.el-input-group__prepend) {
  border: none;
}
</style>
