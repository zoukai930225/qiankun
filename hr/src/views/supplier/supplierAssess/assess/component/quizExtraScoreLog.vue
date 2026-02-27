<template>
  <el-card shadow="never" class="!border-0 rounded-8px flex-1 mr-20px">
    <template #header>
      <el-button link type="info" class="backBtn" @click="emit('back')">
        <Icon :size="12" icon="ep:arrow-left" /> 返回
      </el-button>
    </template>

    <sw-table :options="quizExtraScoreLogTable" :data="tableData" border>
      <template #creator="{ col }">
        <div v-if="col" class="orderHandler">
          <div class="orderHandler-item">
            <el-avatar class="mr8px" :size="18" :src="col?.avatarOrigin ?? DefaultAvatar" />
            <div class="name">{{ col?.name }}</div>
          </div>
        </div>
        <div v-else>--</div>
      </template>
    </sw-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </el-card>
</template>
<script lang="ts" setup>
import { pageQuizExtraScoreLogApi } from '@/api/supplier/assess'
import SwTable from '../../../components/table.vue'
import { quizExtraScoreLogTable } from '../option'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'

interface Emit {
  (e: 'back'): void
}
const emit = defineEmits<Emit>()

interface Prop {
  quizId: string
}
const props = defineProps<Prop>()

const queryParams = reactive({
  page: 1,
  size: 10
})
const tableData = ref<Supplier.Assess.SupplierAssessmentQuizExtraScore[]>([])
const total = ref(0)

async function getList() {
  try {
    const res = await pageQuizExtraScoreLogApi({ ...queryParams, quizId: props.quizId })
    tableData.value = res.records
    total.value = res.total
  } catch (error) {}
}

defineExpose({
  getList
})
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

.backBtn {
  &:hover {
    color: #0064ff;
  }
}
</style>
