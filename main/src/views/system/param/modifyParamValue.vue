<template>
  <div style="margin-top: 20px" class="modifyParamValueWrap">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="mb-5px"
          label-width="70px"
        >
          <el-form-item label="店铺" prop="storeId">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.storeId"
              placeholder="请选择店铺"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参数类型" prop="typeKey">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.typeKey"
              placeholder="请选择参数类型"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_PARAMS, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
      </div>
    </div>
    <el-table
      ref="selectTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      :height="300"
      :row-style="{ height: 45 + 'px' }"
    >
      <el-table-column label="类型名称" prop="typeName">
        <template #default="scope">
          <div class="row">
            {{ scope.row.typeName || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="storeId" show-overflow-tooltip>
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_STORE, scope.row.storeId) || '' }}
        </template>
      </el-table-column>

      <el-table-column label="值" prop="typeValue" width="360">
        <template #default="scope">
          <div @dblclick="handleDoubleClick(scope.row)" v-if="!scope.row.valueEditable">{{
            scope.row.typeValue || '-'
          }}</div>
          <div style="display: flex; align-items: center; margin-left: 10px" class="valueType">
            <el-input
              v-model="scope.row.typeValue"
              style="width: 140px"
              v-if="scope.row.valueEditable"
            />
            <div
              v-if="scope.row.valueEditable"
              class="cursor_pointer"
              style="display: flex; align-items: center; margin-left: 10px"
            >
              <img src="@/assets/imgs/common/confirm.svg" @click="saveEdit(scope.row)" alt="提交" />
              <div class="line"> | </div>
              <img
                src="@/assets/imgs/common/cancel.svg"
                @click="concelEdit(scope.row)"
                alt="取消"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <!-- 删除按钮 -->
          <el-button
            :icon="Delete"
            style="color: #eb3737; border: none; background: none"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { Search, Delete } from '@element-plus/icons-vue'

import * as DynamicParamsApi from '@/api/system/param'

const appStore = useAppStore()

defineOptions({ name: 'ModifyParamValue' })

const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref()

// 接收父组件的数据queryDate
const props = defineProps({
  queryDate: {
    type: String,
    default: ''
  }
})
const queryParams = ref({
  queryDate: props.queryDate, // 查询日期
  storeId: '', // 店铺
  typeKey: '' // 参数类型
})

// 删除方法，根据id删除数据
const handleDelete = (id) => {
  // 用forEach循环遍历list数组，找到要删除的对象，并删除,往deleteIdList里面添加要删除的id

  list.value.forEach((item, index) => {
    if (item.id === id) {
      list.value.splice(index, 1)
    }
  })
}

// 获取当前页面数据和deleteIdList
const getCurrentData = () => {
  return {
    listData: list.value
  }
}

defineExpose({ getCurrentData }) // 提供 open 方法，用于打开弹窗

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = []
    const data = await DynamicParamsApi.getDynamicParamTypeByDate(queryParams.value).catch(() => {
      loading.value = false
    })

    // 函数用于为每个属性添加Editable和OriginalValue属性
    function addEditableAndTempValueProperties(data) {
      return data.map((item) => {
        return {
          ...item,
          valueEditable: false,
          valueOriginalValue: item.value
        }
      })
    }

    // 使用函数并赋值给list.value
    list.value = addEditableAndTempValueProperties(data)
  } finally {
    loading.value = false
  }
}

// 双击
const handleDoubleClick = (item) => {
  item.valueEditable = true
  console.log('handleDoubleClick', item)
}

// 保存编辑
const saveEdit = (item) => {
  console.log('saveEdit', item)
  item.valueEditable = false
}
// 取消编辑
const concelEdit = (item) => {
  console.log('取消', item)
  item.value = item.valueOriginalValue
  item.valueEditable = false
}

onMounted(() => {
  console.log('onMounted')
  getList()
})

onUnmounted(() => {
  console.log('onUnmounted')
})
</script>

<style lang="scss" scoped>
:deep(.valueType .el-input__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e5e5;
}

/* 分隔线 */
.line {
  color: #b3bac9;
  margin: 0 6px;
}
</style>
