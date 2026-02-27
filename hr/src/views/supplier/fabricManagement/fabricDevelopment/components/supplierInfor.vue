<template>
  <div v-if="supplierCardList.length !== 0" style="padding-bottom: 20px;">
    <div v-for="(item, index) in supplierCardList" :key="index"  style="padding: 0 20px;">
      <layout :layouts="[getLayoutItem(index)]" :class="index === 0 ? 'first-item-wapper' : 'item-wapper'">
        <!-- 使用动态插槽名称 -->
        <template #[item.slotName]>
          <div class="desc-befor-wapper">
            <div>{{ item.supplierName || '--' }}</div>
            <div :class="[item?.status === 1 ? 'status_detail' : 'status_edit']">
              <img :src="item?.status === 1 ? statusDetail : statusEdit" />
              <span>{{ item?.status === 1 ? '已提交' : '暂存中' }}</span>
            </div>
          </div>
          <el-descriptions :column="5" border>
            <el-descriptions-item label="供应商名称" :span="4" align="left" width="100">{{ item.supplierName ||
              '--'
            }}</el-descriptions-item>
            <el-descriptions-item label="预估报价" :span="1" align="left" width="90">{{ item.matchPrice
            }}</el-descriptions-item>
            <el-descriptions-item label="匹配原因" :span="5" align="left" width="90">{{ item.matchReason
            }}</el-descriptions-item>
  
          </el-descriptions>
        </template>
      </layout>
    </div>
  </div>


  <div class="empty-wapper" v-else>
    <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
    <span>暂无数据</span>
  </div>


</template>
<script lang="ts" setup>
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'
import CardTitle from '@/views/OA/factory/components/cardTitle.vue'
import delSvg from '@/assets/svgs/del.svg';
import statusDetail from '@/assets/svgs/statusDetail.svg'
import statusEdit from '@/assets/svgs/statusEdit.svg'
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import { useUserStore } from '@/store/modules/user';
import asyncWrapper from '@/utils/asyncWrapper'
import Layout from './layout.vue'


const layouts = ref([])
const supplierCardList: any = ref([])
const props = defineProps<{ detailData: any }>()


// 定义一个方法，根据索引获取布局配置项
const getLayoutItem = (index: number) => {
  return {
    label: `供应商 ${index + 1}`,
    key: `baseSlot${index + 1}`
  }
}



onMounted(() => {
  console.log("propss", props.detailData.id)
  getListData()
})

const getListData = async () => {
  const [data, error] = await asyncWrapper(fabricDevelopmentApi.getSupplierMappingList(props.detailData.id))
  if (!error) {
    supplierCardList.value = data || []

    // 为每个供应商数据添加对应的插槽名称
    supplierCardList.value.forEach((item, index) => {
      item.slotName = `baseSlot${index + 1}`
    })

    // 为每个供应商数据添加对应的插槽名称
    supplierCardList.value.forEach((item, index) => {
      item.slotName = `baseSlot${index + 1}`
    })
  }
};


defineExpose({ open })
</script>

<style lang="less" scoped>
@import '@/views/OA/factory/style/card.scss';

:deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: #666666 !important;
}

.empty-wapper {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  color: #999999;
  font-size: 14px;
  background-color: #fff;
  border-radius: 8px;
  padding-bottom: 20px;
}

.desc-befor-wapper {
  width: calc(100% - 22px);
  height: 40px;
  border: 1px #ebeef5 solid;
  border-bottom: 0px;
  background-color: #f4f6fa;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 20px;
  position: relative;

  div:nth-of-type(2) {
    margin: 0px 10px;
    height: 40px;
    display: flex;
    align-items: center;
  }

  img {
    width: 12px;
    height: 12px;
  }

  span {
    margin-left: 4px;
  }

  .status_detail {
    position: absolute;
    right: 20px;
    color: #349B34;
    font-size: 14px;
    font-weight: 500;
  }

  .status_edit {
    position: absolute;
    right: 20px;
    color: #EE9F00;
    font-size: 14px;
    font-weight: 500;
  }
}

.first-item-wapper {
  margin-top: 0px;
}

.item-wapper {
  // margin-top: 20px;
}

.my-content {
  background-color: red;
}

.btn {
  float: right;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .status_detail {
    color: #349B34;
    display: inline-block;
    font-size: 14px;
    height: 16px;
    line-height: 14px;
    font-weight: 500;
  }

  .status_edit {
    color: #EE9F00;
    display: inline-block;
    font-size: 14px;
    height: 16px;
    line-height: 14px;
    font-weight: 500;
  }
}

:deep(.el-descriptions) {
  .el-descriptions__label {
    background-color: #f4f6fa;
    color: #666666 !important;
    font-size: 14px;
    font-weight: normal;
    vertical-align: middle;
  }

  .el-descriptions__cell {
    border-color: #e5e5e5 !important;
    color: #333333;
    font-size: 14px;
    font-weight: normal;
  }

  .el-descriptions__content {
    min-width: 253.5px;
  }
}
</style>
