<template>
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
      <div class="filter-wrap">
        <span style="margin-right: 11px">筛选</span>
        <el-input
          v-model="queryParams.gravityCubeCrowd"
          clearable
          placeholder="请输入查询关键词"
          @clear="handleQuery"
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
        <el-select
          v-model="AllBoxType"
          style="width: 180px; margin-left: 40px"
          @change="(value) => Allselect(value, 'boxType')"
          placeholder="批量修改黑盒/白盒"
          :disabled="BatchSelect.length === 0 ? true : false"
        >
          <el-option
            v-for="option in getIntDictOptions(
              DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_BOX,
              true
            )"
            :key="option.value"
            :label="option.label"
            :value="option.label"
          />
        </el-select>
        <el-select
          v-model="AllAbbreviation"
          style="width: 180px; margin-left: 40px"
          @change="(value) => Allselect(value, 'abbreviation')"
          placeholder="批量修改简称"
          :disabled="BatchSelect.length === 0 ? true : false"
        >
          <el-option
            v-for="option in getIntDictOptions(
              DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_ABBREVIATION,
              true
            )"
            :key="option.value"
            :label="option.label"
            :value="option.label"
          />
        </el-select>
        <el-select
          v-model="AllCrowdType"
          style="width: 180px; margin-left: 40px"
          @change="(value) => Allselect(value, 'crowdType')"
          placeholder="批量修改人群分类"
          :disabled="BatchSelect.length === 0 ? true : false"
        >
          <el-option
            v-for="option in getIntDictOptions(
              DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_CATEGORY,
              true
            )"
            :key="option.value"
            :label="option.label"
            :value="option.label"
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
        <div class="header-item" style="width: 2%">
          <input type="checkbox" @change="SelectAll" v-model="SelectAllValue" />
        </div>
        <div class="header-item" style="width: 30%">引力魔方：人群</div>
        <div class="header-item" style="width: 15%">黑盒/白盒</div>
        <div class="header-item" style="width: 30%">简称</div>
        <div class="header-item" style="width: 15%">人群分类</div>
      </div>
      <div v-if="list.length > 0">
        <div class="list-content" v-for="item in list" :key="item.id">
          <div class="content-item cursor_pointer" style="width: 2%">
            <input type="checkbox" @change="(value) => typeCheck(value, item)" ref="AllChecked" />
          </div>
          <!-- 引力魔方：人群 -->
          <div class="content-item cursor_pointer" style="width: 30%">{{
            item.gravityCubeCrowd || '--'
          }}</div>
          <!-- 黑盒/白盒 -->
          <div
            class="content-item cursor_pointer"
            style="display: flex; align-items: center; width: 15%"
          >
            <el-select
              v-model="item.boxType"
              style="width: 110px"
              @change="(value) => handleVisibleChange(value, item, 'boxType')"
            >
              <el-option
                v-for="option in getIntDictOptions(
                  DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_BOX,
                  true
                )"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
            <div
              v-if="item.boxTypeEditable"
              class="cursor_pointer"
              style="display: flex; align-items: center; margin-left: 10px"
            >
              <img src="@/assets/imgs/common/confirm.svg" @click="submitEdit(item)" alt="提交" />
              <div class="line"> | </div>
              <img
                src="@/assets/imgs/common/cancel.svg"
                @click="concelEdit(item, 'boxType')"
                alt="取消"
              />
            </div>
          </div>

          <!-- 简称 -->
          <div
            class="content-item cursor_pointer"
            style="display: flex; align-items: center; width: 30%"
          >
            <el-select
              v-model="item.abbreviation"
              style="width: 300px"
              @change="(value) => handleVisibleChange(value, item, 'abbreviation')"
            >
              <el-option
                v-for="option in getIntDictOptions(
                  DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_ABBREVIATION,
                  true
                )"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
            <div
              v-if="item.abbreviationEditable"
              class="cursor_pointer"
              style="display: flex; align-items: center; margin-left: 10px"
            >
              <img src="@/assets/imgs/common/confirm.svg" @click="submitEdit(item)" alt="提交" />
              <div class="line"> | </div>
              <img
                src="@/assets/imgs/common/cancel.svg"
                @click="concelEdit(item, 'abbreviation')"
                alt="取消"
              />
            </div>
          </div>
          <!-- 人群分类 -->
          <div
            class="content-item cursor_pointer"
            style="display: flex; align-items: center; width: 15%"
          >
            <el-select
              v-model="item.crowdType"
              style="width: 110px"
              @change="(value) => handleVisibleChange(value, item, 'crowdType')"
            >
              <el-option
                v-for="option in getIntDictOptions(
                  DICT_TYPE.PRODUCT_TYPE_PROMOTION_REPORT_CROWD_CATEGORY,
                  true
                )"
                :key="option.value"
                :label="option.label"
                :value="option.label"
              />
            </el-select>
            <div
              v-if="item.crowdTypeEditable"
              class="cursor_pointer"
              style="display: flex; align-items: center; margin-left: 10px"
            >
              <img src="@/assets/imgs/common/confirm.svg" @click="submitEdit(item)" alt="提交" />
              <div class="line"> | </div>
              <img
                src="@/assets/imgs/common/cancel.svg"
                @click="concelEdit(item, 'crowdType')"
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
      v-model:page="queryParams.page"
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
  gravityCubeCrowd: '',
  page: 1,
  pageSize: 10
})

// 搜索
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
  // console.log('queryParams', queryParams.value)
}

// 列表数据
const loading = ref(false)
const list = ref([{}])
const BatchSelect = ref<Array<Object>>([])
const AllBoxType = ref('')
const AllAbbreviation = ref('')
const AllCrowdType = ref('')
const total = ref(0)
const AllChecked = ref(null)
const SelectAllValue = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await PopularizeApi.getPopularizePeopleList(queryParams.value).catch(() => {})
    if (data) {
      // 函数用于为每个属性添加Editable和TempValue属性
      function addEditableAndTempValueProperties(data) {
        return data.map((item) => {
          return {
            ...item,
            gravityCubeCrowdEditable: false,
            gravityCubeCrowdOriginalValue: item.gravityCubeCrowd,
            boxTypeEditable: false,
            boxTypeOriginalValue: item.boxType,
            abbreviationEditable: false,
            abbreviationOriginalValue: item.abbreviation,
            crowdTypeEditable: false,
            crowdTypeOriginalValue: item.crowdType
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

// 批量修改
const Allselect = async (value, propertyName) => {
  BatchSelect.value.forEach((e) => {
    if (propertyName === 'boxType') {
      e.boxType = AllBoxType.value
    } else if (propertyName === 'abbreviation') {
      e.abbreviation = AllAbbreviation.value
    } else {
      e.crowdType = AllCrowdType.value
    }
  })
  await PopularizeApi.allUpdatePopularizePeople(BatchSelect.value)
    .then(() => {
      message.success('修改成功')
      AllBoxType.value = ''
      AllAbbreviation.value = ''
      AllCrowdType.value = ''
      AllChecked.value?.forEach((e) => (e.checked = false))
      SelectAllValue.value = false
      BatchSelect.value = []
      getList()
    })
    .catch(() => {
      console.log('提交失败')
    })
}
// 点击复选框
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

// 点击打开下拉框
const handleVisibleChange = (value, item, propertyName) => {
  console.log(value, item, propertyName)
  item[propertyName + 'Editable'] = true //显示编辑按钮
  // console.log('handleVisibleChange', item[propertyName + 'Editable']);
}

// 确认修改
const submitEdit = async (item, propertyName) => {
  item[propertyName] = item[propertyName]

  await PopularizeApi.updatePopularizePeople(item)
    .then(() => {
      console.log('提交成功')
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
  item[propertyName] = item[propertyName + 'OriginalValue'] // 应用更改
  // console.log('取消后', item[propertyName + 'OriginalValue']);
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    gravityCubeCrowd: '',
    page: 1,
    pageSize: 10
  }
  AllBoxType.value = ''
  AllAbbreviation.value = ''
  AllCrowdType.value = ''
  handleQuery()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@use '../index.scss';
</style>
