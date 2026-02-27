<template>
  <div>
    <s-w-dialog show-title-line show-bottom-line :title="dialogTitle" width="524px" v-model="dialogVisible"
      @closed="reset" :beforeClose="beforeClose">
      <div class="row-center mb20px mt20px goods-box" v-show="displayInfo.goodsId">
        <img class="goods-img" :src="displayInfo.goodsImage" />
        <div>
          <div class="row-center" style="align-items: flex-start;">
            <div class="goods-title">商品ID：</div>
            <div class="goods-info">{{ displayInfo.goodsId }}</div>
          </div>
          <div class="row-center mt14px" style="align-items: flex-start;">
            <div class="goods-title">商品标题：</div>
            <div class="goods-info">{{ displayInfo.goodsName }}</div>
          </div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="100px">
        <div class="drawerContent">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="formData.startTime" value-format="YYYY-MM-DD" placeholder="请选择开始时间"
              style="width: 390px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="formData.endTime" value-format="YYYY-MM-DD" placeholder="请选择结束时间"
              style="width: 390px;" />
          </el-form-item>

          <el-form-item label="运营负责人" prop="leader">
            <selectPeople :multiple="false" v-model:modelValue="formData.leader" :getSearchList="remoteMethod"
              style="width: 390px;" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="handleClose" class="mt20px">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm" class="mt20px mr20px"> 提 交</el-button>
      </template>
    </s-w-dialog>
  </div>
</template>
<script lang="ts" setup>
import selectPeople from '@/views/shop/productQuality/components/selectPeople.vue'
import { consistency } from "@/utils";
import * as GoodsShopApi from '@/api/shop'
import { cloneDeep } from 'lodash-es';
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗

const formData = ref({
  goodsId: '',
  type: '1',
  leader: '',
  rosterId: '',
  daterange: '',
  startTime: '',
  endTime: ''
})

const formRules = reactive({
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  leader: [{ required: true, message: '请选择运营人员', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref
const displayInfo = ref<any>({});//展示信息
const hostoryData = ref<any>({}); // 历史数据
/** 打开弹窗 */
const open = async (id, row) => {
  formData.value.goodsId = id
  dialogVisible.value = true
  formData.value.leader = ''
  formData.value.rosterId = ''
  formData.value.daterange = ''
  formData.value.startTime = ''
  formData.value.endTime = ''
  hostoryData.value = cloneDeep(formData.value)
  dialogTitle.value = '设置负责人'
  displayInfo.value.goodsImage = row.goodsImage
  displayInfo.value.goodsId = row.goodsId
  displayInfo.value.goodsName = row.goodsName || row.goods_name
}

const reset = () => {
  formData.value = {
    goodsId: '',
    type: '1',
    leader: '',
    rosterId: '',
    daterange: '',
    startTime: '',
    endTime: ''
  }
  formRef.value.resetFields()
  hostoryData.value = {}
}
const beforeClose = (done: Function) => {
  consistency(hostoryData.value, formData.value, done)
};

const handleClose = () => {
  consistency(hostoryData.value, formData.value, () => {
    dialogVisible.value = false
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
let peopleList: any[] = []
// 获取设计师列表
const remoteMethod = async (value) => {
  const res = await GoodsShopApi.personRosterGetPerson(value)
  peopleList = res?.length > 0 ? res : []
  return peopleList
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    formData.value.daterange && formData.value.daterange.length > 0
    const param: any = {
      goodsId: formData.value.goodsId || '',
      type: '1',
      rosterId:
        formData.value.leader.length && formData.value.leader.length > 0
          ? formData.value.leader[0]
          : '',
      startTime: formData.value.startTime || '',
      endTime: formData.value.endTime || '',
    }
    param.name = param.rosterId ? peopleList.find((item) => item.userId === param.rosterId)?.name || '' : ''
    await GoodsShopApi.goodsPersonInfoCreate(param)
    message.success('设置运营负责人成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped>
.goods-img {
  width: 78px;
  height: 78px;
  border-radius: 4px;
  margin-right: 10px;
}

.goods-title {
  width: 70px;
  font-size: 14px;
  line-height: 20px;
  /* 文字/二级 */
  color: #666666;
}

.goods-info {
  font-size: 14px;
  line-height: 20px;
  color: #3D3D3D;
  width: calc(100% - 70px);
}

.goods-box {
  padding-bottom: 15px;
  border-bottom: 1px solid #ECEAEA;
}
</style>
