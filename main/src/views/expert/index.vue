<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="108px"
    >
      <el-form-item label="昵称 | 抖音号:" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入昵称|抖音号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
          重置
        </el-button>
        <!-- <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button> -->
        <el-button type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="图片" prop="imgs" :width="imgItemWidth">
        <template #default="">
          <div class="row"> <ListImgs :imgs="imgs" /></div>
        </template>
      </el-table-column>
      <el-table-column label="达人名称" prop="name" min-width="120" show-overflow-tooltip />
      <el-table-column label="抖音号" prop="douNo" min-width="140" show-overflow-tooltip>
        <template #default="scope">
          <div class="linkText" @click="openForm('update', scope.row.id)">{{
            scope.row.douNo
          }}</div>
        </template>
      </el-table-column>
      <el-table-column label="粉丝量" prop="fans" min-width="120" show-overflow-tooltip />
      <el-table-column label="联系方式" prop="phone" min-width="120" show-overflow-tooltip />
      <el-table-column label="流程节点" prop="node" width="90">
        <template #default="scope"
          ><div class="row"> <NodeStatus :node="scope.row.node" /></div>
        </template>
      </el-table-column>
      <el-table-column label="释放日期" prop="freeDate" width="120" show-overflow-tooltip />

      <el-table-column label="流程日志" prop="operateLog" width="90">
        <template #default="scope">
          <router-link :to="'/expert/log/' + scope.row.id">
            <el-button class="operate-btn-space" link type="primary"> 日志 </el-button>
          </router-link></template
        >
      </el-table-column>
      <el-table-column fixed="right" width="90" label="操作">
        <template #default="scope">
          <el-button
            class="operate-btn-space"
            link
            type="primary"
            @click="operateAction(scope.row.id, scope.row.node)"
          >
            操作
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <AddForm ref="formRef" @success="getList" />
  <OperateForm ref="operateFormRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
// import { dateFormatter2 } from '@/utils/formatTime'
import * as DynamicParamsApi from '@/api/system/param'
import AddForm from './component/addForm.vue'
import OperateForm from './component/operateForm.vue'
import ListImgs from './component/listImgs.vue'
import NodeStatus from './component/nodeStatus.vue'

const appStore = useAppStore()

defineOptions({ name: 'Expert' })

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  name: ''
})
const queryFormRef = ref() // 搜索的表单

const img1 = 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
const img2 = 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'

const imgs = ref<Array<string>>([])
imgs.value.push(img1)
imgs.value.push(img2)

/** 图片宽度 */
const imgItemWidth = computed(() => {
  if (imgs.value.length > 0) {
    return `${imgs.value.length * 70 + 30}px`
  }
  return '100px'
})

/** 查询列表 */
const getList = async () => {
  // loading.value = true
  try {
    // const data = await DynamicParamsApi.getDynamicParamTypePage(queryParams).catch(() => {
    //   loading.value = false
    // })
    // list.value = data.data || []
    // total.value = data.total
    list.value = [
      {
        id: 1,
        name: '达人1',
        douNo: 1342343,
        imgs: '',
        fans: 12132,
        phone: 135213162737,
        freeDate: '2024-05-11',
        node: 1
      },
      {
        id: 2,
        name: '达人2',
        douNo: 1342343,
        imgs: '',
        fans: 12132,
        phone: 135213162737,
        freeDate: '2024-05-11',
        node: 2
      },
      {
        id: 3,
        name: '达人3',
        douNo: 1342343,
        imgs: '',
        fans: 12132,
        phone: 135213162737,
        freeDate: '2024-05-11',
        node: 3
      },
      {
        id: 4,
        name: '达人4',
        douNo: 1342343,
        imgs: '',
        fans: 12132,
        phone: 135213162737,
        freeDate: '2024-05-11',
        node: 4
      }
    ]
    total.value = 1
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const operateFormRef = ref()
// 操作按钮点击
const operateAction = (id?: number, node?: number) => {
  operateFormRef.value.open(id, node)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped></style>
