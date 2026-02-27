<template>
  <el-select v-model="dataValue as any" filterable remote clearable remote-show-suffix :placeholder="placeholder"
    :disabled="disabled" :remote-method="remoteMethod" :loading="loading" @change="valueChange">
    <el-option v-for="item in dataList" :key="item.value" :label="item[showParams?.label || 'label']"
      :value="item[showParams?.value || 'value']">
      <div class="item">
        <img :src="item.url" class="item-icon" />
        <span class="item-desc">{{ item[showParams?.name || 'label'] }}</span>
      </div>
    </el-option>
  </el-select>
</template>

<script lang="ts">
export default { name: 'GoodSelect' }
</script>

<script lang="ts" setup>
import { getBiGoodsById } from '@/api/bi/goods/index'

class Item {
  value: string | number
  label: string
  url: string
  data: Object
  constructor(parameters: any = {}) {
    this.value = parameters?.goodsId || ''
    this.label = parameters?.goodsName || ''
    this.url = parameters?.goodsImage || ''
    this.data = parameters || {}
  }
}

const dataValue = defineModel(),
  dataList = ref<Array<Item>>([])

const loading = ref<boolean>(false)

const emit = defineEmits(['change'])

const props = defineProps({
  placeholder: { type: String, default: '请输入' },
  disabled: { type: Boolean, default: false },
  showParams: { type: Object, default: () => ({ label: 'label', value: 'value', name: 'label' }) },
})

const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    getBiGoodsById(query)
      .then((res: any) => {
        res?.length && (dataList.value = res.map((rs: any) => ({ ...new Item(rs) })))
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const valueChange = () => {
  setTimeout(() => {
    const tar: any = dataList.value.find((ds: Item) => ds.value === dataValue.value)
    emit('change', dataValue.value, tar)
  })
}

// 编辑回显：根据已选 goodsId 预加载对应选项，确保显示正确的 label
const preloadSelected = async () => {
  const currentValue: any = (dataValue as any).value ?? dataValue
  // 统一从 defineModel 的 ref 中读取
  const selectedValue: any = (dataValue as any)?.value ?? undefined
  const valueToUse = selectedValue ?? currentValue
  if (!valueToUse) return
  const exists = dataList.value.some((ds: Item) => ds.value === valueToUse)
  if (exists) return
  try {
    loading.value = true
    const res: any = await getBiGoodsById(String(valueToUse))
    const list = Array.isArray(res) ? res : res ? [res] : []
    if (list.length) {
      const mapped = list.map((rs: any) => ({ ...new Item(rs) }))
      dataList.value = [...mapped, ...dataList.value]
    }
  } finally {
    loading.value = false
  }
}

defineExpose({
  preloadSelected
})
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: row;
  margin-bottom: 18px;

  .item-icon {
    width: 28px;
    height: 28px;
    margin-right: 6px;
  }

  .item-desc {
    font-weight: 400;
    font-size: 12px;
    color: #333333;
  }

  .item-desc:hover {
    font-weight: 400;
    font-size: 12px;
    color: #0064ff;
  }
}

.item:hover {
  border-radius: 4px;
  background: rgba(0, 100, 255, 0.08);
  font-weight: 400;
  font-size: 12px;

  .item-desc:hover {
    font-weight: 400;
    font-size: 12px;
    color: #0064ff;
  }
}

.item:last-child {
  margin-bottom: 0;
}
</style>
