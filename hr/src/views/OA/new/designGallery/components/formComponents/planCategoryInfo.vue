<template>
  <div class="planCategoryInfo" :style="{ paddingBottom: planCategoryIsExpand ? '20px' : '0px' }">
    <FormTitle
      title="品类信息"
      :is-show-expand="true"
      :is-expand="planCategoryIsExpand"
      @expand-click="planCategoryIsExpand = !planCategoryIsExpand"
    />
    <div v-show="planCategoryIsExpand">
      <el-table
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        :header-cell-style="appStore.headerCellStyle"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        width="100%"
      >
        <el-table-column label="品类" prop="category">
          <template #default="scope">
            <div style="color: #0064ff">{{ scope.row.completeCategoryName }}</div>
          </template>
        </el-table-column>

        <el-table-column property="series" label="系列">
          <template #default="{ row }">
            <div class="row-center">
              <span>{{ row.series }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="类型" prop="productType">
          <template #default="scope">
            <div>{{
              scope.row.productType == '0' ? '买手款' : scope.row.productType == '1' ? '定制款' : ''
            }}</div>
          </template>
        </el-table-column>
        <el-table-column label="卖点" prop="salePoint" :show-overflow-tooltip="false">
          <template #default="{ row }">
            <div class="row-center">
              <el-popover placement="bottom" :width="200" trigger="hover">
                <div class="salePointBg">
                  <div class="salePointBg-title">卖点</div>
                  <div
                    v-if="row.salePoint"
                    class="salePointBg-content"
                    v-html="row.salePoint"
                  ></div>
                  <div v-else class="salePointBg-content" style="margin-top: 5px; margin-left: -6px"
                    >【--】</div
                  >
                </div>
                <template #reference>
                  <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{
                    getPlainText(row.salePoint)
                  }}</div>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { useAppStore } from '@/store/modules/app'
import FormTitle from './formTitle.vue'
import { useCategoryList } from '@/views/OA/new/planOld/hooks'
const { categoryList, initSelectData } = useCategoryList()
const appStore = useAppStore()

const planCategoryIsExpand = ref(false)

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

initSelectData()

const formatCategory = (code) => {
  console.log('**', code)
  const item = categoryList.value.find((item) => item.code === code)
  return item ? item.name : ''
}

const getPlainText = (html) => {
  if (!html) return '【--】'
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return (tempDiv.textContent || tempDiv.innerText || '').trim()
}
</script>

<style lang="scss" scoped>
.planCategoryInfo {
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.salePointBg {
  display: flex;
  flex-direction: column;

  &-title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &-content {
    // font-size: 14px;
    // color: #666666;
  }
}
</style>
<style scoped>
:deep(p) {
  margin: 0px !important;
}
</style>
