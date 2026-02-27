<template>
  <el-popover
    ref="poppoverRef"
    :hide-after="0"
    trigger="click"
    placement="bottom"
    :show-arrow="false"
    :popper-style="{ padding: '10px 16px', width: '220px' }"
    popper-class="sort-filter-popper"
  >
    <template v-if="showFilter('sort')">
      <div class="flex items-center color-#333">
        <Icon icon="ep:sort" /><span class="ml-12px">排序</span>
      </div>
      <div class="flex justify-between mt-12px mb-20px">
        <el-button
          :type="params?.[slotName]?.sort === 1 ? 'primary' : 'default'"
          class="!px17px"
          @click="handleUpOrDown(slotName, 1)"
        >
          <Icon icon="ep:sort-up" :size="14" class="mr-4px" />
          升序
        </el-button>
        <el-button
          :type="params?.[slotName]?.sort === 2 ? 'primary' : 'default'"
          class="!px17px"
          @click="handleUpOrDown(slotName, 2)"
        >
          <Icon icon="ep:sort-down" :size="14" class="mr-4px" />
          降序
        </el-button>
      </div>
    </template>

    <template v-if="showFilter('range')">
      <div class="flex items-center color-#333">
        <Icon icon="ep:filter" />
        <span class="ml-12px">筛选</span>
        <span class="ml-8px color-#999 font-size-12px">请输入数字范围</span>
      </div>
      <div>
        <el-form :model="params?.[slotName]" :ref="`${slotName}FormRef`">
          <div class="flex items-center justify-between mt-12px">
            <el-form-item prop="rangeStart">
              <sw-input-number
                v-if="params[slotName]"
                v-model="params[slotName].rangeStart"
                placeholder="请输入"
                :precision="precision"
              />
            </el-form-item>
            <el-form-item class="mx-6px">
              <span class="color-#DCDFE6">-</span>
            </el-form-item>
            <el-form-item prop="rangeEnd">
              <sw-input-number
                v-if="params[slotName]"
                v-model="params[slotName].rangeEnd"
                placeholder="请输入"
                :precision="precision"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>

    <el-divider class="!mt--2px !mb10px !w-[calc(100%+32px)] !ml--16px" />

    <div class="flex justify-between">
      <el-button class="!px26px" @click="handleClearFilter(slotName)">清除</el-button>
      <el-button class="!px26px" type="primary" @click="handleComfire">确定</el-button>
    </div>

    <template #reference>
      <div class="ml-4px lh-23px flex items-center">
        <img src="@/assets/svgs/supplier/table-header-tool.svg" alt="" />
      </div>
    </template>
  </el-popover>
</template>
<script lang="ts" setup>
import { PopoverInstance } from 'element-plus'

interface Props {
  queryParams: Record<string, any>
  slotName: string
  precision?: number
  types?: string[]
}

interface Emit {
  (e: 'update:query-params', val: any): void
  (e: 'handle-query'): void
}

const props = withDefaults(defineProps<Props>(), {
  precision: 0
})
const emit = defineEmits<Emit>()
const poppoverRef = ref<PopoverInstance>()

const params = computed({
  get: () => props.queryParams,
  set: (val) => {
    emit('update:query-params', val)
  }
})

function handleUpOrDown(slotName: string, type: 1 | 2) {
  params.value = Object.fromEntries(
    Object.entries(params.value).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? []
        : typeof value === 'object'
          ? { ...value, sort: key === slotName && value?.sort !== type ? type : undefined }
          : value
    ])
  )
}

function handleClearFilter(slotName: string) {
  params.value[slotName] = {}
  emit('handle-query')
}

function showFilter(type) {
  return !props.types || props.types.includes(type)
}

function handleComfire() {
  emit('handle-query')
  poppoverRef.value?.hide()
}
</script>
<style lang="less" scoped></style>
