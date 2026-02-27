<!--
 * @Date: 2024-11-29 16:59:04
-->
<template>
  <div class="content-wapper">
    <div class="flex-row">
      <!-- left -->
      <div class="left" :class="{ left1: !showBottomBtn }">
        <div class="title flex-row"><img src="@/assets/imgs/common/bumen.png" class="icon" />
          <div>部门</div>
        </div>
        <div>
          <el-tree style="max-width: 600px" :data="departmentList" :props="defaultProps"
            @node-click="handleNodeClick" />
        </div>
      </div>
      <!-- right -->
      <div class="right" :class="{ right1: !showBottomBtn }">
        <div class="title flex-row"><img src="@/assets/imgs/common/renyuan.png" class="icon" />
          <div>人员</div>
        </div>
        <div class="flex-row search-wapper">
          <el-input v-model="currentValue" style="width: 240px" size="large" placeholder="请输入" :suffix-icon="Search" />
          <div>
            <el-button @click="searchSource" :icon="Search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
        <div>
          <el-table ref="sortTableRef" :header-cell-style="appStore.headerCellStyle" v-loading="loading"
            :data="personList" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
            @selection-change="handleSelectionChange" :row-key="(row) => row.userId">
            <el-table-column type="selection" width="55" />
            <el-table-column label="工号" prop="employeeNo">
              <template #default="scope">
                {{ scope.row.employeeNo || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="人员名称" prop="name">
              <template #default="scope">
                <span v-html="formarName(scope.row.name)"> </span>
              </template>
            </el-table-column>
            <el-table-column label="手机号码" prop="mobile">
              <template #default="scope">
                {{ scope.row.mobile || '-' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="btn-wapper" v-if="showBottomBtn">
      <el-button @click="cancle">取消</el-button>
      <el-button type="primary" @click="confirm" :disabled="selectTableValue?.length == 0">确认</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getDepartmentList, getPersonByDeIdAndName } from '@/api/common'
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'

const message = useMessage()
const loading = ref(false)
const appStore = useAppStore()

const props = defineProps({
  isPermission: {
    type: Number,
    default: 2 //1-是 根据逻辑过滤数据 比如 人才盘点  2-否 显示所有人员数据 比如 固定资产  默认传2
  },
  departId: {
    // 回显部门
    type: String,
    default: ''
  },
  list: {
    //回显的人员
    type: Array,
    default: () => []
  },
  showBottomBtn: {
    // 显示底部保存按钮
    type: Boolean,
    default: true
  },
  isFeedBack: {
    // 是否回显
    type: Boolean,
    default: true
  },
  // 评论风控 加字段 只显示 客服中心
  isComment: {
    type: Boolean,
    default: false
  }
})

interface Tree {
  name: string
  children?: Tree[]
}
const currentValue = ref('') // 输入框
const sortTableRef = ref() // table实例

// table 名字格式化
const formarName = (name) => {
  if (!name) return '-'
  const flag = currentValue.value != '' && name.includes(currentValue.value)
  return flag ? `<div style="color:#0064FF">${name}</div>` : name
}

// 动态设置css
const defaultProps = {
  children: 'children',
  label: 'name',
  class: ({ isContain }: TreeNodeData, node: Node) => (isContain > 0 ? 'isContain' : '')
}

// 当前选中的部门id
const currentDepartId = ref()
const handleNodeClick = (data: Tree) => {
  // @ts-ignore
  if (data?.id == currentDepartId.value) return
  // @ts-ignore
  if (data.id) {
    // @ts-ignore
    currentDepartId.value = data.id
    initPerson()
  }
}

// 搜索
const searchSource = () => {
  initPerson()
}
// 重置
const reset = () => {
  currentValue.value = ''
  initPerson()
}

// 选中的table数据
const selectTableValue = ref([])
const handleSelectionChange = (value) => {
  selectTableValue.value = value
  console.log('大风科技师范记录卡', value)
  const obj = {
    departId: currentDepartId.value,
    list: selectTableValue.value
  }
  emit('selectPeople', obj)
}

// 获取部门列表
const departmentList = ref([])
const initDepartment = async () => {
  personList.value = []
  const params = ref<any>({})
  if (props.isComment) {
    // 评论风控 只显示客服中心
    const type = 'FENG_KONG_DEPT'
    params.value = {
      name: currentValue.value,
      isPermission: props.isPermission,
      type
    }
  } else {
    params.value = {
      name: currentValue.value,
      isPermission: props.isPermission
    }
  }

  const res = await getDepartmentList(params.value)
  departmentList.value = res
}

//人员列表
const falg = ref(false)
const personList = ref([])
const initPerson = async () => {
  try {
    const params = {
      name: currentValue.value,
      departId: currentDepartId.value
    }
    loading.value = true
    const res = await getPersonByDeIdAndName(params)
    loading.value = false
    personList.value = res
    if (!props.isFeedBack) {
      return
    }
    // 反选
    if (props.list?.length == 0 || falg.value == true) return
    props.list.forEach((id) => {
      const row = personList.value.find((item) => item.userId == id)
      nextTick(() => {
        sortTableRef.value.toggleRowSelection(row)
      })
    })
    falg.value = true
  } catch (error) {
    loading.value = false
  }
}

onMounted(() => {
  initDepartment()
})

onUnmounted(() => {
  currentValue.value = ''
  personList.value = []
  nextTick(() => {
    sortTableRef.value?.clearSelection
  })
  falg.value = false
})

const handleSelectTableValue = (value) => {
  // selectTableValue.value.forEach((item) => {
  //   const selectValue = value && value.filter((item1) => item.userId === item1.userId)
  //   if (!selectValue ) {

  //   }
  // })
  sortTableRef.value?.clearSelection()

  selectTableValue.value = value || []
  selectTableValue.value.forEach((item) => {
    sortTableRef.value.toggleRowSelection(item, true)
  })
  console.log('地方撒娇lk', selectTableValue.value)
}

const emit = defineEmits(['confirm', 'cancle', 'selectPeople'])
defineExpose({ handleSelectTableValue })

// 确认
const confirm = () => {
  if (selectTableValue.value?.length == 0) {
    message.error('请选择人员')
    return
  }
  console.log(selectTableValue.value, 'selectTableValue.value')
  const obj = {
    departId: currentDepartId.value,
    list: selectTableValue.value
  }
  emit('confirm', obj)
}

// 取消
const cancle = () => {
  emit('cancle')
}

watch(
  () => props.list,
  (value) => {
    if (!value) return
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.departId,
  (value) => {
    if (!value) return
    console.log('props.departId', value)
    currentDepartId.value = value
    if (props.showBottomBtn) {
      initPerson() //获取人员
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.content-wapper {
  width: 100%;

  .left {
    width: 297px;
    height: 379px;
    background: #ffffff;
    border-radius: 0px 0px 10px 10px;
    border: 1px solid #dcdfe6;
    margin-right: 20px;
    overflow-y: scroll;
  }

  .left1 {
    width: 210px;
  }

  .right {
    width: calc(100% - 297px);
    height: 379px;
    background: #ffffff;
    border-radius: 0px 0px 10px 10px;
    border: 1px solid #dcdfe6;
    overflow-y: scroll;
    padding: 20px;
    box-sizing: border-box;
  }

  .right1 {
    width: calc(100% - 210px);
  }

  .title {
    width: 100%;
    height: 46px;
    line-height: 46px;
    background: #f5f7fa;
    border-radius: 10px 10px 0px 0px;
    padding: 0px 12px;
    box-sizing: border-box;
    align-items: center;

    .icon {
      width: 13px;
      height: 13px;
      margin-right: 10px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

:deep(.isContain > .el-tree-node__content) {
  background: #ecf4ff !important;
  color: #0064ff !important;
}

.btn-wapper {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.search-wapper {
  justify-content: space-between;
  padding: 20px 0;
  box-sizing: border-box;
}
</style>
