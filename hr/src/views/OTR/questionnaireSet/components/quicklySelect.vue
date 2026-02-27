<!--
 * @Date: 2024-10-14 10:19:55
-->
<template>
  <el-dialog v-model="dialogVisible" width="800">
    <el-form :model="queryParams">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="请输入关键词" clearable />
      </el-form-item>
    </el-form>
    <div>
      <div class="table-header">
        <div class="header-item" style="width: 15%">项目名称</div>
        <div class="header-item" style="width: 75%">项目定义</div>
        <div class="header-item" style="width: 5%">操作</div>
      </div>
      <div class="table-item" v-for="item in list" :key="item.id">
        <div class="item" style="width: 15%">{{ item.name }}</div>
        <div class="item center" style="width: 75%">{{ item.definition }}</div>
        <div class="item link" style="width: 5%" @click="select(item)">选择</div>
      </div>
    </div>
    <div style="height: 53px">
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { surveyQuickly } from '@/api/otr/questionnaireSet/index'

const dialogVisible = ref(false)
const total = ref(10) // 列表的总页数

const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: undefined
})

const getList = async () => {}
const list = ref()
const open = async (id) => {
  dialogVisible.value = true
  const params = {
    surveyId: id,
    ...queryParams
  }
  const res = await surveyQuickly(params)
  list.value = res.records
  total.value = res.total
}

const emit = defineEmits(['selected'])

const select = (item) => {
  emit('selected', item)
  dialogVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-input__inner) {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  padding-left: 12px;
  box-sizing: border-box;
}
.table-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 40px;
  line-height: 40px;
  background: #f2f6fc;
  padding: 0 20px;
  box-sizing: border-box;
}

.table-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 16px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  .item {
  }
  .link {
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: #0064ff;
  }
  .center {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 30px;
    box-sizing: border-box;
  }
}
</style>
