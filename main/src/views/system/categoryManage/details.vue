<template>
  <el-form :model="dataValue" label-width="100px">
    <el-form-item label="商品名称" prop="name">
      <good-select
        ref="goodSelectRef"
        v-model="dataValue.goodsId"
        :disabled="type === 'edit'"
        style="width: 500px"
        @change="goodChange"
      />
    </el-form-item>
    <div class="flex_body">
      <div class="flex_1">
        <el-form-item label="商品图" prop="name">
          <el-image
            v-if="dataValue.goodsImage"
            class="good-icon"
            :src="dataValue.goodsImage"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[dataValue.goodsImage]"
            alt="暂无图片"
            :initial-index="4"
            fit="contain"
          />
          <div v-else class="inline-block w-220px h-220px"></div>
        </el-form-item>
      </div>
      <div class="flex_1">
        <el-form-item label="商品ID" prop="name">
          <span>{{ dataValue.goodsId }}</span>
        </el-form-item>
        <el-form-item label="店铺" prop="name">
          <span>{{ dataValue.storeName }}</span>
        </el-form-item>
        <el-form-item label="类目" prop="name">
          <span>{{ dataValue.categoryName }}</span>
        </el-form-item>
      </div>
    </div>
    <el-form-item label="开始时间" prop="name">
      <el-date-picker
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        v-model="dataValue.beginDate"
        type="date"
        :disabled-date="
          (time) =>
            dataValue.endDate ? dayjs(time).isAfter(dayjs(dataValue.endDate), 'day') : false
        "
        placeholder="请选择开始时间"
      />
    </el-form-item>
    <el-form-item label="结束时间" prop="name">
      <el-date-picker
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        v-model="dataValue.endDate"
        type="date"
        :disabled-date="
          (time) =>
            dataValue.beginDate ? dayjs(time).isBefore(dayjs(dataValue.beginDate), 'day') : false
        "
        placeholder="请选择结束时间"
      />
    </el-form-item>
    <el-form-item label="标准类目" prop="name">
      <el-select
        style="width: 220px"
        v-model="dataValue.platformCategory"
        placeholder="请选择品类"
        @change="handleCategoryChange"
        value-key="value"
      >
        <el-option
          v-for="dict in categoryList"
          :key="dict.label"
          :label="dict.label"
          :value="dict"
        />
      </el-select>
      <el-select
        style="width: 220px; margin-left: 10px"
        v-model="dataValue.platformSubCategory"
        placeholder="请选择二级品类"
        @focus="handleFocus(dataValue.platformCategory)"
        value-key="value"
      >
        <el-option
          v-for="dict in subCategoryList"
          :key="dict.label"
          :label="dict.label"
          :value="dict"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="tsx" setup>
import GoodSelect from '@/components/common/goods/goods.vue'
import { consistency } from '@/utils'
import { addOrUpdateGoodsComparison } from '@/api/system/categoryMng'
import { DICT_TYPE } from '@/utils/dict'
import { getIntDictOptions } from '@/utils/dict'
import { getGoodsDetail } from '@/api/system/categoryMng'
import dayjs from 'dayjs'

const message = useMessage()

const props = defineProps<{
  formType?: string
  row?: any
  onClose?: () => void
}>()

const goodSelectRef = ref<any>(null)

const categoryList = computed(() => {
  return [
    ...getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true),
    {
      label: '无',
      value: '无'
    }
  ]
})
const subCategoryList = ref<any>([])

// 根据一级类目查二级
const handleFocus = (platformCategory) => {
  if (platformCategory && platformCategory.label !== '无') {
    // 选择的是一级分类
    const KEY = `STANDARD_CATEGORY_${platformCategory.value}`
    subCategoryList.value = [
      ...getIntDictOptions(DICT_TYPE[KEY], true),
      {
        label: '无',
        value: '无'
      }
    ]
  }
  if (platformCategory.label === '无') {
    subCategoryList.value = [
      {
        label: '无',
        value: '无'
      }
    ]
  }
}

// 禁用今天之后的日期
const disableAfterToday = (time: Date) => {
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)
  return time.getTime() > endOfToday.getTime()
}

const visible = ref(false),
  type = ref<string>('add'),
  bukValue = ref<any>({}),
  dataValue = ref<any>({})

watch(
  () => props.formType,
  (val) => {
    if (val) type.value = val
  },
  { immediate: true }
)

// 初始化/回显表单：优先根据 id 请求详情，否则用传入 row 回显
async function init() {
  const defaultBeginDate = dayjs().format('YYYY-MM-DD')
  const defaultEndDate = '2099-12-31'
  if (props.row && props.row.id) {
    const res = await getGoodsDetail(props.row.id)
    dataValue.value = {
      goodsId: res?.goodsId || '',
      goodsImage: res?.goodsImage || '',
      storeName: res?.storeName || '',
      categoryName: res?.categoryName || '',
      platformCategory: {
        label: res?.platformCategory ?? '',
        value: res?.platformCategoryCode ?? ''
      },
      platformSubCategory: {
        label: res?.platformSubCategory ?? '',
        value: res?.platformSubCategoryCode ?? ''
      },
      beginDate: res?.beginDate || defaultBeginDate,
      endDate: res?.endDate || defaultEndDate
    }
    await nextTick()
    goodSelectRef.value?.preloadSelected()
  } else {
    dataValue.value = {
      goodsId: '',
      goodsImage: '',
      storeName: '',
      categoryName: '',
      platformCategory: {
        label: '无',
        value: '无'
      },
      platformSubCategory: {
        label: '无',
        value: '无'
      },
      beginDate: defaultBeginDate,
      endDate: defaultEndDate
    }
  }
  // 根据已选一级类目初始化二级类目下拉
  handleFocus(dataValue.value.platformCategory)
  // 保存快照用于离开校验
  bukValue.value = JSON.parse(JSON.stringify(dataValue.value))
}

// 结束时间需大于等于开始时间（内联函数已绑定到模板）

// 维护类目对照关系
// const changePlatformCategory = async (node) => {
//   let { id, platformCategory, platformSubCategory, officialCategory } = node
//   await CategoryApi.updatePlatformCategory({
//     id,
//     platformCategory,
//     platformSubCategory,
//     officialCategory
//   })
//   message.success('维护成功')
//   getDeptList(activeChannel.value)
// }

const handleCategoryChange = (value: any) => {
  dataValue.value.platformSubCategory = {
    label: '无',
    value: '无'
  }
}

const goodChange = (_value: any, item: any) => {
  dataValue.value = {
    ...dataValue.value,
    goodsId: item?.data?.goodsId || '',
    goodsImage: item?.data?.goodsImage || '',
    categoryName: item?.data?.categoryName || '',
    storeName: item?.data?.storeName || ''
  }
  console.log(dataValue.value)
}

const beforeClose = (done: Function) => {
  console.log(dataValue.value, bukValue.value)
  consistency(dataValue.value, bukValue.value, done)
}

interface Data {
  id?: string
  goodsId: string
  beginDate: string
  endDate: string
  platformCategory: string
  platformCategoryCode: string
  platformSubCategory: string
  platformSubCategoryCode: string
}

async function submit() {
  const data: Data = {
    goodsId: dataValue.value.goodsId,
    beginDate: dataValue.value.beginDate,
    endDate: dataValue.value.endDate,
    platformCategory: dataValue.value.platformCategory.label,
    platformCategoryCode: dataValue.value.platformCategory.value,
    platformSubCategory: dataValue.value.platformSubCategory.label,
    platformSubCategoryCode: dataValue.value.platformSubCategory.value
  }
  if (props.row?.id) {
    data.id = props.row.id
  }
  const res = await addOrUpdateGoodsComparison(data)
  message.success('操作成功!')
}
onMounted(() => {
  init()
})

defineExpose({ submit, beforeClose })

// 当开始时间变更时，若结束时间早于开始时间，则自动纠正为开始时间
watch(
  () => dataValue.value.beginDate,
  (newBegin) => {
    if (!newBegin) return
    const end = dataValue.value.endDate
    if (end && dayjs(end).isBefore(dayjs(newBegin), 'day')) {
      dataValue.value.endDate = newBegin
    }
  }
)
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.max-width {
  width: 100%;
}

.height {
  height: calc(100vh - 110px);
}

.flex_body {
  display: inline-flex;

  .flex_1 {
    display: inline-block;

    .good-icon {
      width: 200px;
      height: 220px;
    }
  }
}
</style>
