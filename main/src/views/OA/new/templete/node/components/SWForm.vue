<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div style="
      background-color: #fff;
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    ">
    <el-form :inline="true" :model="formInline" @submit.prevent="onSubmit">
      <div class="flex-row form-wapper">
        <div style="flex-wrap: wrap; flex: 1" class="flex-row">
          <div v-for="(field, index) in fieldsWithSearchDisplay" :key="index">
            <el-form-item :label="`${field.name}:`" label-width="110px">
              <!-- <el-cascader
                v-if="field.type === 7"
                v-model="formInline[field.code]"
                :filterable="field.type === 7"
                clearable
                value-on-clear=""
                placeholder="请选择"
                :props="customProps"
                :options="departmentTreeData"
              /> -->
              <component style="width: 180px" :is="componentMap[field.type]" v-model="formInline[field.code]"
                :placeholder="field.placeholder || detaultPlaceholderMap[field.type]"
                :type="componentTypeMap[field.type]" :multiple="field.type === 3"
                :value-format="field.type === 5 ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'" clearable
                :filterable="field.type === 7" :options="field.type === 7 ? departmentTreeData : field.options"
                :props="field.type === 7 ? customProps : undefined">
                <!-- <template v-if="field.type === 2 || field.type === 3">
                  <el-option
                    v-for="option in field.options"
                    :key="option.id"
                    :label="option.label"
                    :value="option.code"
                  />
                </template> -->
                <template v-if="field.type === 2 || field.type === 3">
                  <el-option v-for="option in field.options" :key="option.id"
                    :label="!field.dictCode ? option.value : option.label"
                    :value="!field.dictCode ? option.value : option.code" />
                </template>
              </component>
            </el-form-item>
          </div>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="onSubmit" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetFrom" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
            <el-button type="primary" icon="plus" @click="add">新增</el-button>
          </div>
        </div>

        <!-- <div class="flex-row">
          <el-button style="border: 1px solid #eaeaea; background-color: #f1f3f7" @click="onSubmit"
            >搜索</el-button
          >
          <el-button @click="resetFrom">重置</el-button>
          <el-button type="primary" icon="plus" @click="add">新增</el-button>
        </div> -->
      </div>
    </el-form>

    <div class="more" v-if="filteredFields.length > 4">
      <div class="mid"> </div>
      <div class="more-text-wapper" @click="handleShowMore">
        <span class="more-text"> {{ showMore ? '收起更多' : '展开更多' }} </span>
        <img src="@/assets/imgs/oa/showClose.png" class="icon" v-if="showMore" />
        <img src="@/assets/imgs/oa/showMore.png" class="icon" v-else />
      </div>
      <div class="mid"> </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import * as DeptApi from '@/api/system/dept'
// import { useDepartmentStore } from '@/store/modules/dept'
// const departmentStore = useDepartmentStore()

const componentMap = {
  0: 'el-input',
  1: 'el-input-number',
  2: 'el-select',
  3: 'el-select',
  4: 'el-date-picker',
  5: 'el-date-picker',
  6: 'el-switch'
}

const componentTypeMap = {
  0: 'text',
  1: 'undefined',
  2: 'single',
  3: 'undefined',
  4: 'date',
  5: 'datetime',
  6: 'undefined'
}
// 定义类型
interface Field {
  name: string
  code: string
  type: number
  placeholder: string
  options: any[]
  searchDisplay: boolean
  state: number
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    default: () => []
  }
})

const showMore = ref(true)

const handleShowMore = () => {
  showMore.value = !showMore.value
}

const detaultPlaceholderMap = {
  0: '请输入',
  1: '请输入',
  2: '请选择',
  3: '请选择',
  4: '请选择',
  5: '请选择',
  6: ''
}

// 展开收起字段
// const shouldDisplayField = (field, index) => {
//   return (
//     field.searchDisplay &&
//     field.state == 1 &&
//     ((!showMore.value && index < 4) || (showMore.value && index >= 0))
//   )
// }

// 展示的查询字段列表
const filteredFields = ref<any>([]) // 筛选出来的字段列表
const fieldsWithSearchDisplay = computed(() => {
  filteredFields.value = props.fields.filter((field) => field.searchDisplay && field.state == 1)
  return showMore.value ? filteredFields.value : filteredFields.value.slice(0, 4)
})

const formInline = ref({})
const emit = defineEmits(['reset', 'search', 'add'])

const onSubmit = () => {
  const submitData = { ...formInline.value }
  // 如果formInline里面有属性为depName的，则将他转成字符串
  for (const key in submitData) {
    if (key.includes('depName')) {
      submitData[key] = submitData[key].join('/')
    }
  }

  emit('search', submitData)
}

const add = () => {
  emit('add')
}

const resetFrom = () => {
  formInline.value = {}
  emit('reset')
}

// 下拉-部门树形
const customProps = {
  label: 'name',
  value: 'name',
  children: 'children'
}
const departmentTreeData = ref<any>([]) // 部门树形数据
const departmentLoading = ref(false)

// const getDepartmentTree = async () => {
//   departmentLoading.value = true
//   try {
//     const data = await DeptApi.getDeptPage({})
//     departmentTreeData.value = data || []
//     console.log('getDepartmentTree', departmentTreeData.value)
//   } finally {
//     departmentLoading.value = false
//   }
// }
onMounted(() => {
  // departmentTreeData.value = departmentStore.departmentData || []
  // 获取部门数据
  // getDepartmentTree()
})
</script>

<style lang="scss" scoped>
.el-cascader {}

.flex-row {
  display: flex;
  flex-direction: row;
}

.more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  justify-content: space-around;

  .mid {
    flex: 1;
    height: 1px;
    background: #ebeef5;
  }

  .more-text-wapper {
    display: flex;
    align-items: center;
    margin: 0 20px;

    .more-text {
      cursor: pointer;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      margin-right: 6px;
    }

    .icon {
      width: 8px;
      height: 6px;
      cursor: pointer;
    }
  }
}
</style>
