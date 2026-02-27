<template>
  <SWDialog v-model="drawerVisible" :title="drawerTitle" @closed="reset" show-title-line show-bottom-line
    :beforeClose="beforeClose" width="577px" v-loading="drawerLoading">
    <el-form :model="formParams" label-width="80px" :rules="fromRules" ref="formRef" style="margin-top: 20px;">
      <el-form-item label="分类" prop="goodsType">
        <el-select v-model="formParams.goodsType" placeholder="请选择" filterable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DY_REFUND_PRODUCT_TYPE, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品ID" prop="goodsId">
        <el-select filterable remote v-model="formParams.goodsId" placeholder="请选择商品ID" :remote-method="searchGoods"
          :disabled="drawerType !== 'add'" :loading="loading" value-key="goodsId" @change="handleGoodsChange">
          <el-option v-for="(item, idx) in goodsList" :key="idx" :label="item.goodsName" :value="item.goodsId" />
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="store">
        <el-select filterable v-model="formParams.store" placeholder="请选择店铺" :disabled="true">
          <el-option v-for="item in storeList" :key="item.id" :label="item.nickName" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="售卖价" prop="sale">
        <el-input v-model.trim="formParams.sale" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCloseDrawer" style="margin-top: 20px;" class="new-btn-font">取消</el-button>
      <el-button type="primary" class="mr20px new-btn-font" :loading="submitLoading" style="margin-top: 20px;"
        @click="handleSubmit">确定</el-button>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import * as douyinRefundGoodsManageApi from '@/api/channelData/douyinRefundGoodsManage'

import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { consistency } from "@/utils";
import { cloneDeep, debounce } from 'lodash-es';
const drawerVisible = ref(false)
const drawerLoading = ref(false)
const drawerTitle = ref('')
const drawerType = ref('')
const historyData = ref<any>({})
const message = useMessage()
// 请求参数
const formParams = ref({
  id: undefined,
  store: '',
  goodsId: '',
  sale: '',
  goodsType: ''
})

const submitLoading = ref(false)
const goodsList = ref<any[]>([])

const fromRules = reactive({
  goodsType: [{ required: true, message: '请选择分类', trigger: 'change' }],
  store: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  goodsId: [{
    required: true,
    message: '请选择商品',
    trigger: 'blur'
  }]
})

//打开弹框
const open = async (type: string, row?: any) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增商品信息' : type === 'edit' ? '编辑商品信息' : '查看商品信息'
  if (row) {
    Object.keys(formParams.value).forEach(key => {
      if (Object.keys(row).includes(key)) {
        historyData.value[key] = row[key]
        formParams.value[key] = row[key]
      }
    })
    if (formParams.value.goodsId) {
      try {
        drawerLoading.value = true
        //回显
        await searchGoods(formParams.value.goodsId)
        handleGoodsChange(formParams.value.goodsId)
      } catch (err) {

      } finally {
        drawerLoading.value = false
      }
    }
  } else {
    historyData.value = cloneDeep(formParams.value)
  }

}
const formRef = ref<any>()
const reset = () => {
  historyData.value = {}
  goodsList.value = []
  formParams.value = {
    id: undefined,
    store: '',
    goodsId: '',
    sale: '',
    goodsType: ''
  }
  formRef.value?.resetFields()
  drawerLoading.value = false
  loading.value = false
  submitLoading.value = false
}

const handleSubmit = debounce(async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()
  // 提交请求
  try {
    drawerLoading.value = true
    let params: any = cloneDeep(formParams.value)
    delete params.store
    if (drawerType.value === 'add') {
      await douyinRefundGoodsManageApi.saveGoods(params)
      message.success('商品信息添加成功！')
    } else {
      await douyinRefundGoodsManageApi.updateGoods(params)
      message.success('商品信息编辑成功！')
    }
    reset()
    // 发送操作成功的事件
    emits('success')
    drawerVisible.value = false
  } catch (err) { } finally {
    drawerLoading.value = false
  }
}, 500)
const storeList = ref<any[]>([])

const loading = ref(false)
// 远程搜索商品
async function searchGoods(query: string) {
  goodsList.value = []
  if (query) {
    loading.value = true
    try {
      const res = await douyinRefundGoodsManageApi.searchGoodsList({
        keyword: query
      })
      goodsList.value = res?.length ? res : []
    } catch (error) {
      console.error('获取商品失败:', error)
    } finally {
      loading.value = false
    }
  }
}
const handleGoodsChange = (value: string) => {
  const item = goodsList.value.find(item => item.goodsId === value)
  storeList.value = [{ code: item.store, nickName: item.storeName, id: item.store }]
  formParams.value.store = item.store
}

const beforeClose = (done: Function) => {
  consistency(historyData.value, formParams.value, done)
};
const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false;
  });
}

const emits = defineEmits(['success'])
defineExpose({ open })
</script>
<style lang="scss" scoped>
.new-btn-font {
  font-size: 14px;
}
</style>