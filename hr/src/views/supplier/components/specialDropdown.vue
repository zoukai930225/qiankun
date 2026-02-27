<template>
  <div v-if="allBtns.length" class="ml-20px">
    <el-button
      v-if="(showDefault ? allBtns : hideBtns).length === 1"
      type="primary"
      :loading="loading"
      @click="handleCommand((showDefault ? allBtns : hideBtns)[0])"
    >
      <component v-if="!loading" :is="btns[0]?.icon" class="mr-4px" />
      {{ (showDefault ? allBtns : hideBtns)[0].label }}
    </el-button>

    <el-dropdown
      v-else
      split-button
      type="primary"
      ref="othersOptions"
      :teleported="false"
      :loading="loading"
      :disabled="loading"
      @click="handleDropdownClick"
      @command="handleCommand"
    >
      {{ btnName }}
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, index) in hideBtns" :key="index" :command="item">
            <span class="text-align-center">{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { getPermission } from '@/utils'
import { DropdownInstance } from 'element-plus'

const props = withDefaults(
  defineProps<{
    btns: any[]
    loadingBtns?: string[]
    showDefault?: boolean
  }>(),
  { showDefault: true }
)

const loading = ref(false)
const othersOptions = ref<DropdownInstance>()
const currentBtn = ref<any>()
const btnName = ref('')
const permissionSet = new Set(getPermission())

const allBtns = computed(() =>
  props.btns.filter((ele) => (ele.permission ? permissionSet.has(ele.permission) : true))
)

const defaultBtn = computed(() => allBtns.value?.[0])
const hideBtns = computed(() => {
  const a = [...allBtns.value]
  const b = props.showDefault && a.length ? a.slice(1) : a
  return b
})

function handleDropdownClick() {
  if (props.showDefault) {
    // 默认新增
    defaultBtn.value.option()
  } else {
    currentBtn.value ? currentBtn.value?.option() : othersOptions.value?.handleOpen()
  }
}
async function handleCommand(btn: StorageSalary.Quality.BtnOption) {
  if (props.loadingBtns?.includes(btn.label)) {
    loading.value = true
  }

  if (props.showDefault) {
    ;(btn.option as () => Promise<any>)()?.finally(() => {
      loading.value = false
    })
  } else {
    btnName.value = btn.label
    currentBtn.value = btn
    ;(btn.option as () => Promise<any>)()?.finally(() => {
      loading.value = false
    })
  }
}

onMounted(() => {
  btnName.value = props.showDefault ? defaultBtn.value?.label : '更多操作'
})
</script>
<style lang="less" scoped></style>
