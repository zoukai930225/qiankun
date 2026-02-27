<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :model="queryParams"
          class="-mb-15px"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="货品编号：" prop="goodsCode">
            <el-input
              v-model.trim="queryParams.goodsCode"
              placeholder="请输入货品编号"
              clearable
              style="width: 204px"
              @keyup.enter="getList"
            />
          </el-form-item>
          <el-form-item label="货品名称：" prop="goodsName">
            <el-input
              v-model.trim="queryParams.goodsName"
              placeholder="请输入货品名称"
              clearable
              style="width: 204px"
              @keyup.enter="getList"
            />
          </el-form-item>
        </el-form>
        <div class="commonTopFilterWrap-search">
          <div
            class="commonTopFilterWrap-search-container"
            style="position: absolute; right: 3.125vw"
          >
            <el-button @click="getList" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
            <!-- <el-button
              @click="exportFn"
              class="commonResetBtn"
              style="margin-left: 10px"
              :loading="loading"
            >
              导出
            </el-button> -->
            <el-button type="primary" @click="newGood" :loading="isVisible">新增</el-button>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
  <div></div>
  <ContentWrap>
    <el-table
      :data="list"
      ref="tableRef"
      :header-cell-style="{
        background: '#F2F6FC',
        color: '#333333',
        border: 'none',
        fontFamily: 'PingFangSC, PingFang SC'
      }"
      v-loading="loading"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column prop="goodsCode" label="货品编号" />
      <el-table-column prop="goodsName" label="货品名称" />
      <el-table-column prop="type" label="定制款/现货款" />
      <el-table-column prop="productionCycle" label="生产周期（天）" />
      <el-table-column prop="fastestDeliveryDays" label="最快交付天数" />
      <el-table-column label="操作" width="220" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openExit(row)">编辑</el-button>
          <el-button link type="danger" @click="delItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 抽屉 -->
  <div class="chouTi">
    <el-drawer v-model="isVisible" :with-header="false" size="50%" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">{{ title }}</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              alt=""
              class="close"
              @click="reset"
            />
          </div>
        </div>
        <ContentWrap>
          <el-form :model="drawerData" ref="sumbitFormRef" label-width="140" :rules="rules">
            <el-form-item label="货品编号：" prop="goodsCode">
              <el-select-v2
                v-model="drawerData.goodsCode"
                filterable
                placeholder="请选择货品编号"
                :disabled="title === '编辑'"
                @change="queryDetail"
                :options="options"
              />
            </el-form-item>
            <el-form-item label="货品名称：" prop="goodsName">
              <el-input disabled v-model="drawerData.goodsName" placeholder="" />
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="11">
                <el-form-item label="货品类目：" prop="className">
                  <el-input disabled v-model="drawerData.className" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="定制款/现货款：" prop="type">
                  <el-select v-model="drawerData.type" placeholder="请选择">
                    <el-option label="定制款" value="定制款" />
                    <el-option label="现货款" value="现货款" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="11">
                <el-form-item label="最快交付天数：" prop="fastestDeliveryDays">
                  <el-input
                    clearable
                    v-model.number="drawerData.fastestDeliveryDays"
                    placeholder="请输入最快交付天数"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="生产周期：" prop="productionCycle">
                  <el-input
                    clearable
                    v-model.number="drawerData.productionCycle"
                    placeholder="请输入生产周期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </ContentWrap>
        <div class="btn-wapper">
          <el-button @click="reset">取消</el-button>
          <el-button v-if="title === '编辑'" type="primary" @click="save" :loading="loading"
            >提交</el-button
          >
          <el-button v-else type="primary" @click="submit" :loading="loading">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import * as productApi from '@/api/productManage'
import { cloneDeep } from 'lodash-es'
// import { debounce } from 'lodash-es'
const message = useMessage() // 消息弹窗
const isVisible = ref<boolean>(false)
const drawerData = ref<any>({})
const queryParams = ref<any>({
  goodsCode: '',
  goodsName: '',
  size: 10,
  page: 1
})
const title = ref<string>('')
const total = ref(0)
const loading = ref(false)
const list = ref<any>([])
const options = ref<Array<any>>([])
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getList()
}

// 自定义校验函数
const validateFastestDeliveryDays = (
  rule: any,
  value: number | undefined,
  callback: (error?: Error) => void
) => {
  if (value === undefined || value === null) {
    callback(new Error('请输入最快交付天数'))
  } else if (isNaN(value)) {
    callback(new Error('请输入有效的数字'))
  } else if (!Number.isInteger(value)) {
    callback(new Error('请输入整数'))
  } else if (value < 0 || value > 999) {
    callback(new Error('请输入0 - 999的数字'))
  } else {
    callback()
  }
  console.log(rule)
}

const rules = ref<any>({
  fastestDeliveryDays: [
    { required: true, message: '请输入最快交付天数', trigger: 'blur' },
    { validator: validateFastestDeliveryDays, trigger: 'blur' }
  ],
  productionCycle: [
    { required: true, message: '请输入最快交付天数', trigger: 'blur' },
    { validator: validateFastestDeliveryDays, trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择定制款/现货款', trigger: 'change' }],
  goodsCode: [{ required: true, message: '请选择货品编号', trigger: 'change' }]
})

// 查询
const getList = () => {
  const params = queryParams.value
  loading.value = true
  productApi.whProductProductionCycle(params).then((res) => {
    list.value = res.records
    total.value = res.total
    loading.value = false
  })
}

// 导入
// const exportFn = () => {}

// 新增
const newGood = () => {
  title.value = '新增'
  isVisible.value = true
}

// 编辑
const openExit = (row) => {
  drawerData.value = cloneDeep(row)
  title.value = '编辑'
  isVisible.value = true
}

// 关闭抽屉
const reset = () => {
  drawerData.value = {}
  sumbitFormRef.value.resetFields()
  isVisible.value = false
}

// 删除
const delItem = async (id) => {
  if (id) {
    await message.confirm('确认删除吗？')
    const params = { id }
    await productApi.deleteWhProductProductionCycle(params)
    message.success('删除成功')
    getList()
  }
}

// 编辑
const sumbitFormRef = ref()
const save = () => {
  const data = drawerData.value
  sumbitFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await productApi.PutWhProductProductionCycle(data)
        message.success('编辑成功')
        isVisible.value = false
        getList()
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
  })
}

// 新增
const submit = () => {
  const data = drawerData.value
  sumbitFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res = await productApi.postWhProductProductionCycle(data)
        console.log(res)
        message.success('新增成功')
        isVisible.value = false
        getList()
      } catch (error) {
        console.log(error)
      } finally {
        loading.value = false
      }
    }
  })
}

const init = () => {
  const params = {
    goodsNo: ''
  }
  productApi.productCodeList(params).then((res) => {
    options.value = res.map((item) => ({
      ...item,
      value: item.goodsNo,
      label: item.goodsNo + `(${item.goodsName})`
    }))
  })
}

// 反显
const queryDetail = (goodsNo) => {
  if (goodsNo) {
    const res = options.value.filter((item) => item.goodsNo === goodsNo)[0]
    drawerData.value.goodsName = res.goodsName
    drawerData.value.className = res.className
  } else {
    drawerData.value.goodsName = ''
    drawerData.value.className = ''
  }
}

onMounted(() => {
  getList()
  init()
})
</script>
<style lang="scss" scoped>
.mainContainer {
  background: #fff;
  .content {
    padding: 14px 12px;
  }
}
.tabBox {
  margin-top: 20px;
  margin-bottom: 20px;
}
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  padding-right: 20px;
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }
  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}
.form-wapper {
  margin-top: 18px;
}

.config-item-wapper {
  .config-item {
    align-items: center;
    background: white;
    display: flex;
    flex-direction: row;
    width: 300px;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }
  .select-more {
    width: 12px;
    height: 13px;
    margin-right: 16px;
  }

  .select-del {
    color: red;
    margin-left: 16px;
    display: inline;
    cursor: pointer;
  }
  .add-select {
    cursor: pointer;
    width: 300px;
    height: 36px;
    border-radius: 4px;
    border: 1px dashed #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;
    .add-btn {
      width: 12px;
      height: 12px;
      margin-right: 14px;
    }
    .add-text {
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
