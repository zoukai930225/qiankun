<template>
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
      <div class="filter-wrap">
        <span style="margin-right: 11px">筛选</span>
        <el-input
          v-model="queryParams.param"
          clearable
          placeholder="请输入产品ID/货品ID/产品昵称"
          @clear="handleQuery"
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
        <el-select
          v-model="AllCategory"
          style="width: 180px; margin-left: 40px"
          @change="Allselect"
          placeholder="批量修改产品类型"
          :disabled="BatchSelect.length === 0 ? true : false"
        >
          <el-option
            v-for="item in getIntDictOptions(
              DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_PRODUCT_CATEGORY,
              true
            )"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
        </div>
      </div>
      <!-- <div>
        <el-button
          @click="handleQuery"
          style="border: 1px solid #eaeaea; background-color: #f1f3f7"
        >
          <img
            src="@/assets/imgs/common/ic_head_search@2x.png"
            alt=""
            class="mr-1"
            style="width: 10px; height: 10px; vertical-align: middle"
          />
          搜索</el-button
        >
        <el-button @click="resetQuery">重置</el-button>
      </div> -->
    </div>
  </ContentWrap>
  <ContentWrap>
    <!-- 列表 -->
    <div class="list-wrap">
      <!-- 表头 -->
      <div class="list-header">
        <div class="header-item" style="width: 5%">
          <input type="checkbox" @change="SelectAll" v-model="SelectAllValue" />
        </div>
        <div class="header-item" style="width: 13%">产品ID</div>
        <div class="header-item" style="width: 13%">货品ID</div>
        <div class="header-item" style="width: 56%">产品昵称</div>
        <div class="header-item" style="width: 13%">产品类型</div>
      </div>
      <div v-if="list.length > 0">
        <div class="list-content" v-for="item in list" :key="item.id">
          <!-- 产品复选框 -->
          <div class="content-item cursor_pointer" style="width: 5%">
            <input type="checkbox" @change="(value) => typeCheck(value, item)" ref="AllChecked" />
          </div>
          <!-- 产品ID -->
          <div class="content-item cursor_pointer" style="width: 13%">{{
            item.goodsId || '--'
          }}</div>
          <!-- 货品ID -->
          <div class="content-item" style="width: 13%">{{ item.merchandiseId || '--' }}</div>

          <!-- 产品昵称 -->
          <div class="content-item cursor_pointer" style="width: 56%">{{ item.name || '--' }} </div>
          <!-- 产品类型 -->
          <div
            class="content-item cursor_pointer"
            style="display: flex; align-items: center; width: 13%"
          >
            <el-select
              v-model="item.category"
              style="width: 110px"
              @change="(value) => handleVisibleChange(value, item, 'category')"
            >
              <el-option
                v-for="option in getIntDictOptions(
                  DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_PRODUCT_CATEGORY,
                  true
                )"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
            <div
              v-if="item.categoryEditable"
              class="cursor_pointer"
              style="display: flex; align-items: center; margin-left: 10px"
            >
              <img
                src="@/assets/imgs/common/confirm.svg"
                @click="submitEdit(item, 'category')"
                alt="提交"
              />
              <div class="line"> | </div>
              <img
                src="@/assets/imgs/common/cancel.svg"
                @click="concelEdit(item, 'category')"
                alt="取消"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as PopularizeApi from '@/api/popularize'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const message = useMessage()

// 查询参数
const queryParams = ref({
  param: '',
  pageNo: 1,
  pageSize: 10
})

// 搜索
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
  // console.log('queryParams', queryParams.value)
}

// 列表数据
const loading = ref(false)
const list = ref([])
const total = ref(0)
const BatchSelect = ref<Array<Object>>([])
const AllCategory = ref('')
const AllChecked = ref(null)
const SelectAllValue = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await PopularizeApi.getPopularizeProductList(queryParams.value).catch(() => {})
    if (data) {
      // 函数用于为每个属性添加Editable和OriginalValue属性
      function addEditableAndTempValueProperties(data) {
        return data.map((item) => {
          return {
            ...item,
            categoryEditable: false,
            categoryOriginalValue: item.category
          }
        })
      }

      // 使用函数并赋值给list.value
      list.value = addEditableAndTempValueProperties(data.record)
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 点击打开下拉框
const handleVisibleChange = (value, item, propertyName) => {
  console.log(value, item, propertyName)
  item[propertyName + 'Editable'] = true // 打开编辑模式
  // console.log('handleVisibleChange', item[propertyName + 'Editable']);
}

// 批量选择类型
const Allselect = async () => {
  BatchSelect.value.forEach(async (item) => {
    item.category = AllCategory.value
  })
  await PopularizeApi.allUpdatePopularizeProduct(BatchSelect.value)
    .then(() => {
      message.success('修改成功')
      AllChecked.value?.forEach((e) => (e.checked = false))
      AllCategory.value = ''
      SelectAllValue.value = false
      BatchSelect.value = []
      getList()
    })
    .catch(() => {
      console.log('提交失败')
    })
}
// 监听复选框
const typeCheck = (value, item) => {
  if (value.target.checked) {
    BatchSelect.value.push(item)
  } else {
    const index = BatchSelect.value.findIndex((e) => e.id === item.id)
    BatchSelect.value.splice(index, 1)
  }
  SelectAllValue.value = BatchSelect.value.length === 10
}
// 全选
const SelectAll = () => {
  AllChecked.value?.forEach((e) => (e.checked = SelectAllValue.value))
  BatchSelect.value = SelectAllValue.value ? JSON.parse(JSON.stringify(list.value)) : []
}

// 确认修改
const submitEdit = async (item, propertyName) => {
  console.log(item, 'itemsub')
  item[propertyName] = item[propertyName]
  await PopularizeApi.updatePopularizeProduct(item)
    .then(() => {
      item[propertyName + 'Editable'] = false // 关闭编辑模式
      message.success('修改成功')
      getList()
    })
    .catch(() => {
      console.log('提交失败')
    })
}

// 取消修改
const concelEdit = (item, propertyName) => {
  // console.log('concelEdit', propertyName)
  item[propertyName + 'Editable'] = false // 关闭编辑模式
  item[propertyName] = item[propertyName + 'OriginalValue']
  // console.log('取消后', item[propertyName + 'OriginalValue']);
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    param: '',
    pageNo: 1,
    pageSize: 10
  }
  handleQuery()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@use '../index.scss';
</style>
