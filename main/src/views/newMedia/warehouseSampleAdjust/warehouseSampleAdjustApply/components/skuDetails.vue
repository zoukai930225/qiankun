<template>
  <el-dialog
    title="订单明细"
    v-model="visible"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
  >
    <el-table :header-cell-style="{ color: '#333', backgroundColor: '#F2F6FC' }"
      v-loading="loading"
      style="width: 100%;" show-overflow-tooltip :max-height="500" :data="skuDetails" border ref="tableRef">
      <el-table-column :prop="col.field" :label="col.title" min-width="140"  v-for="col in columns"/>
      <el-table-column label="是否已归还" width="200" fixed="right">
        <template #default="{row}">
          <el-radio-group v-model="row.sfgh" v-if="isSampleManagement && isPass">
            <el-radio :value="1" size="large">已归还</el-radio>
            <el-radio :value="0" size="large">未归还</el-radio>
          </el-radio-group>
          <span v-else>
            {{row.sfgh === null ?'-' : row.sfgh === 1 ? '已归还' : '未归还' }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary"v-if="isSampleManagement" @click="confirm" >确定</el-button>
      <el-button  @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import { DataItem } from '../page/config'
import { columns} from '../details/orderDetailTableConfig'
import request from '@/config/axios';
import {debounce} from 'lodash-es'

const visible = ref(false)
const isSampleManagement = ref(false)
const message = useMessage()
// const dataValue = ref<DataItem>({...new DataItem()})
const loading = ref(false)
const skuDetails = ref<any>([])
const isPass = ref(false)
const openDrawer = (item: any, isManagement: boolean) => {
  visible.value = true
  isSampleManagement.value = isManagement
  if (item.id) {
    isPass.value = item.statusName === '审核通过'
    loading.value = true
    request.get({ url: `/api/warehouseSampleAdjustApply/order/${item.id}` }).then((res: any) => {
      skuDetails.value = res
    }).finally(() => {
      loading.value = false
    })
  }
}
const emits = defineEmits(['success'])
// 确定
const confirm = debounce(() => {
  const dataList = skuDetails.value.filter((item: any) => item.sfgh !== null)
  if(dataList.length === 0) {
    visible.value = false;
    return
  }
  request.post({ url: `/api/warehouseSampleAdjustApply/optOrder`, data: dataList }).then((res: any) => {
    message.success('操作成功');
    visible.value = false;
    emits('success')
  })
}, 500)
defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">

</style>
