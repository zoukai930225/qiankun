<template>
  <SWDialog v-if="visible" v-model="visible" title="历史记录" width="1200px" @close="close">
    <div class="content">
      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
        :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
        v-horizontal-scroll="'always'">
        <el-table-column label="变更字段" prop="updateField" min-width="60" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.updateField === '-'">
              <div>名称</div>
              <div>店铺</div>
            </div>
            <span v-else>{{ scope.row.updateField }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更前" prop="category" min-width="150">
          <template #default="scope">
            <div v-if="scope.row.updateField === '-'">
              -
            </div>
            <div v-if="Array.isArray(scope.row.beforeStores) && scope.row.beforeStores.length > 0" class="flex-row">
              <template v-for="(store, index) in scope.row.beforeStores" :key="store.id">
                <div class="flex-row" style="margin-right: 10px;" v-if="index === 0">
                  <img :src="getImageUrl(store.channel)" alt="" style="width: 20px;margin-right: 5px;"
                    object-fit="contain" />
                  <div>{{ store.nickName }}</div>
                </div>
              </template>
              <template v-if="scope.row.beforeNums">
                <el-popover :width="300" effect="dark">
                  <template #reference>
                    <el-tag size="small" type="info" round style="cursor: pointer;" v-if="scope.row.beforeNums">{{
                      scope.row.beforeNums
                    }}</el-tag>
                  </template>
                  <div style="width: 100%;max-height: 300px;overflow-y: auto;">
                    <div v-for="(store, index) in scope.row.beforeStores" :key="store.id">
                      <div class="flex-row" v-if="index > 0" style="margin-bottom: 5px;">
                        <img :src="getImageUrl(store.channel)" alt="" style="width: 20px;margin-right: 5px;"
                          object-fit="contain" />
                        <div class="shop-text">{{ store.nickName }}</div>
                      </div>
                    </div>
                  </div>
                </el-popover>
              </template>
            </div>
            <span v-else>{{ scope.row.beforeStoreName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后" prop="category" min-width="150">
          <template #default="scope">
            <div v-if="scope.row.updateField === '-'">
              {{ scope.row.afterStoreName }}
            </div>
            <div v-if="Array.isArray(scope.row.afterStores) && scope.row.afterStores.length > 0" class="flex-row">
              <template v-for="(store, index) in scope.row.afterStores" :key="store.id">
                <div class="flex-row" style="margin-right: 10px;" v-if="index === 0">
                  <img :src="getImageUrl(store.channel)" alt="" style="width: 20px;margin-right: 5px;"
                    object-fit="contain" />
                  <div>{{ store.nickName }}</div>
                </div>
              </template>
              <template v-if="scope.row.afterNums">
                <el-popover :width="300" effect="dark">
                  <template #reference>
                    <el-tag size="small" type="info" round style="cursor: pointer;" v-if="scope.row.afterNums">{{
                      scope.row.afterNums
                    }}</el-tag>
                  </template>
                  <div style="width: 100%;max-height: 300px;overflow-y: auto;">
                    <div v-for="(store, index) in scope.row.afterStores" :key="store.id">
                      <div class="flex-row" v-if="index > 0" style="margin-bottom: 5px;">
                        <img :src="getImageUrl(store.channel)" alt="" style="width: 20px;margin-right: 5px;"
                          object-fit="contain" />
                        <div class="shop-text">{{ store.nickName }}</div>
                      </div>
                    </div>
                  </div>
                </el-popover>

              </template>
            </div>
            <span v-else>{{ scope.row.afterStoreName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更人" prop="updatedId" width="80" />
        <el-table-column label="变更时间" prop="updatedAt" width="180" />
      </el-table>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
      </div>
    </div>
  </SWDialog>
</template>
<script lang="ts" setup>
import * as storeGroupApi from '@/api/biControl/storeGroup/index'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import { getImageUrl } from '@/utils'

const visible = ref(false);
const loading = ref(false);
const list = ref([])
const historyId = ref('')
//打开弹框
const open = async (id: string) => {
  try {
    historyId.value = id
    await getList()
    visible.value = true;
  } catch (err) {
  } finally {
  }
}

const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
})

const getList = async () => {
  try {
    loading.value = true;
    const data = await storeGroupApi.getGroupHistory(historyId.value, queryParams.value)
    if (data) {
      data.records.map(item => {
        let beforeNums = 0;
        let afterNums = 0;
        if (Array.isArray(item.beforeStores) && item.beforeStores.length > 0) {
          beforeNums = item.beforeStores.length - 1;
        }
        if (Array.isArray(item.afterStores) && item.afterStores.length > 0) {
          afterNums = item.afterStores.length - 1;
        }
        item.beforeNums = beforeNums;
        item.afterNums = afterNums
      })
      list.value = data.records
      total.value = data.total
    }
  } catch (err) {

  } finally {
    loading.value = false;
  }
}
function close() {
  list.value = []
  visible.value = false;
}
defineExpose({ open })
</script>
<style lang="less" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.shop-text {
  text-align: left;
}

.pagination-wrapper {
  height: 34px;
}
</style>