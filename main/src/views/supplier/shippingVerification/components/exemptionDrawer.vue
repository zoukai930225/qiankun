<template>
  <s-w-drawer
    :title="title"
    :model-value="modelValue"
    width="1000px"
    :close-on-click-modal="pageType === type"
    @open="handleOpen"
    @close="handleClosed"
  >
    <exemption-audit
      ref="auditRef"
      v-if="pageType === 1"
      v-bind="props"
      :id="detailId"
      :type="type"
      @back="handleClosed"
    />
    <exemption-list
      ref="listRef"
      v-show="pageType === 2"
      v-bind="props"
      @check="handleCheck"
      @add="handleAdd"
    />
    <exemption-add ref="addRef" v-bind="props" v-if="pageType === 3" @back="handleClosed" />

    <template #footer>
      <component :is="easyBtnGroup(footerBtns)" class="mr-12px" />
      <el-button @click="handleClosed">返回</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import exemptionAudit from './exemptionAudit.vue'
import exemptionList from './exemptionList.vue'
import exemptionAdd from './exemptionAdd.vue'
import { easyBtnGroup } from '../../components/twoFourSix'

const props = defineProps<{ modelValue: boolean; id: string; type: number; title: string }>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
  (e: 'refresh')
}>()

const pageType = ref(0)
const detailId = ref('')
const listRef = ref<InstanceType<typeof exemptionList>>()
const auditRef = ref<InstanceType<typeof exemptionAudit>>()
const addRef = ref<InstanceType<typeof exemptionAdd>>()

const footerBtns = computed<any[]>(() => {
  switch (pageType.value) {
    case 1:
      return auditRef.value?.footerBtns || []
    case 2:
      return []
    case 3:
      return addRef.value?.footerBtns || []
    default:
      return []
  }
})

function handleClosed() {
  if (pageType.value === props.type || props.type === 1) {
    emit('refresh')
    emit('update:model-value', false)
  } else {
    listRef.value?.getList()
  }

  nextTick(() => {
    pageType.value = 2 // 这里是为了销毁审核组件
  })
}

function handleCheck(id) {
  pageType.value = 1
  detailId.value = id
  nextTick(() => {
    auditRef.value?.getDetail()
  })
}

function handleOpen() {
  pageType.value = props.type

  if (props.type === 1) (detailId.value = props.id), nextTick(() => auditRef.value?.getDetail())
  else nextTick(() => listRef.value?.getList())
}

function handleAdd() {
  pageType.value = 3
  nextTick(() => {
    addRef.value?.resetFields()
  })
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
