<template>
  <div>
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between">
        <Tips>主要合作客户</Tips>
        <el-button text @click="showAddMainCustoms" v-if="!disabled">
          <img :src="plus" style="width: 14px; height: 14px; margin-right: 8px; margin-top: -2px" />添加</el-button>
      </div>
      <el-table class="SWCommonTable" v-horizontal-scroll="'always'" v-loading="loading1" :data="list1" :stripe="true"
        :show-overflow-tooltip="true" row-class-name="commonTableRow">
        <el-table-column prop="supplierProductType" :show-overflow-tooltip="false" label="产品类目">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.SUPPLIER_PRODUCT_TYPE, scope.row.supplierProductType) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" :show-overflow-tooltip="false" label="名称" />
        <el-table-column prop="monthlyProductionCapacity" :show-overflow-tooltip="false" label="月度产能" />
        <el-table-column prop="proportionOverallQuantity" :show-overflow-tooltip="false" label="总体量占比" />
        <el-table-column prop="cooperationPeriod" :show-overflow-tooltip="false" label="合作周期" />
        <el-table-column label="操作" align="center" fixed="right" v-if="!disabled">
          <template #default="scope">
            <el-button text type="danger" :icon="Delete" @click="delRow(scope.row)" :disabled="scope.$index ===0">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never">
      <div style="display: flex; justify-content: space-between">
        <Tips>工厂情况</Tips>
        <el-button text @click="showAddFactoryInfo" v-if="!disabled"><img :src="plus"
            style="width: 14px; height: 14px; margin-right: 8px" />添加</el-button>
      </div>
      <el-table class="SWCommonTable" v-horizontal-scroll="'always'" v-loading="loading2" :data="list2" :stripe="true"
        :show-overflow-tooltip="true" row-class-name="commonTableRow">
        <el-table-column prop="factoryName" :show-overflow-tooltip="true" label="名称" />
        <el-table-column prop="factoryAddress" :show-overflow-tooltip="true" label="地址" />
        <el-table-column width="140" prop="factoryArea" :show-overflow-tooltip="false" label="工厂面积(平方)" />
        <el-table-column width="120" prop="factoryPerson" :show-overflow-tooltip="false" label="工厂人员(人)" />
        <el-table-column prop="modeOfTransport" :show-overflow-tooltip="false" label="运输方式" />
        <!-- <el-table-column prop="productType" :show-overflow-tooltip="false" label="产品类型">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.SUPPLIER_PRODUCT_TYPE, scope.row.productType) }}
          </template>
        </el-table-column> -->
        <el-table-column width="120" prop="productionEquipment" :show-overflow-tooltip="false" label="生产设备(台)" />
        <el-table-column prop="dayProductionCapacity" :show-overflow-tooltip="false" label="日度产能" />
        <el-table-column prop="monthProductionCapacity" :show-overflow-tooltip="false" label="月度产能" />
        <el-table-column prop="productionPersonnel" width="120" label="生产人员(人)" />
        <el-table-column label="操作" align="center" fixed="right" v-if="!disabled">
          <template #default="scope">
            <el-button text :icon="Delete" type="danger" @click="delFactoryHandle(scope.row)" :disabled="scope.$index ===0">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="drawerFooter" v-if="!disabled">
      <el-button type="primary" @click="nextHandle">下一步</el-button>
    </div>
    <AddMainCustoms ref="addMainCustomsRef" :id="props.id" @on-close="getPartnerData()" />
    <AddFactoryInfo ref="addFactoryRef" :id="props.id" @on-close="getFactoryData()" />
  </div>
</template>
<script setup lang="tsx">
import { Delete } from '@element-plus/icons-vue'
const message = useMessage() // 消息弹窗
import AddMainCustoms from './addMainCustoms.vue'
import AddFactoryInfo from './addFactoryInfo.vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { getPartnerById, getFactoryById, delPartner, delFactory } from '@/api/supplier'
import Tips from './tips.vue'
defineOptions({ name: 'Business' })
import plus from '@/assets/imgs/supplier/plus.png'
const loading1 = ref(false)
const loading2 = ref(false)
const list1 = ref([])
const list2 = ref([])
const emit = defineEmits(['next'])
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  type: { type: String, default: 'view' }
})

const disabled = computed(() => props?.type === 'view');

const getPartnerData = async () => {
  const res = await getPartnerById(props.id)
  list1.value = res || []
}
const getFactoryData = async () => {
  const res = await getFactoryById(props.id)
  list2.value = res || []
}
// 主要合作客户
const addMainCustomsRef = ref()
const showAddMainCustoms = () => {
  addMainCustomsRef.value.open()
}
const delRow = async (item: any) => {
  try {
    await message.delConfirm()
    await delPartner(item.id)
    message.success('删除成功')
    getPartnerData()
  } catch (error) {
    console.log(error)
  }
}
// 工厂情况
const addFactoryRef = ref()
const showAddFactoryInfo = () => {
  addFactoryRef.value.open()
}
const delFactoryHandle = async (item: any) => {
  try {
    await message.delConfirm()
    await delFactory(item.id)
    message.success('删除成功')
    getFactoryData()
  } catch (error) {
    console.log(error)
  }
}
const nextHandle = () => {
  if(!list1.value.length){
    message.error('请填写主要合作客户')
  }else if(!list2.value.length){
    message.error('请填写工厂情况')
  }else{
    emit('next', 'others')
  }
}
onMounted(() => {
  if (props.id) {
    getPartnerData()
    getFactoryData()
  }
})
</script>
<style lang="scss" scoped>


.el-card {
  border-radius: 8px;

  &+.el-card {
    margin-top: 20px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
