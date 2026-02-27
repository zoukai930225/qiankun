<template>
  <div>
    <ContentWrap><div @click="rightClick"> 111 </div> </ContentWrap>
    <ContentWrap>
      <el-table
        class="table"
        ref="multipleTableRef"
        :data="list"
        @selection-change="handleSelectionChange"
        v-horizontal-scroll="'always'"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        row-key="id"
      >
        <el-table-column width="55">
          <div
            class="dragHandle icons-sprite"
            style="cursor: move; width: 16px; height: 16px; background: red"
          ></div>
        </el-table-column>

        <el-table-column type="selection" width="55" />

        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </ContentWrap>
    <!-- 右键 -->
    <RightMenu :isOpen="isOpen" :eventVal="eventVal" :menus="menus" @item-click="handleMenuItem" />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { useContextMenu, useDragTableRows } from './components/utils'
import RightMenu from './components/rightMenu.vue'
const appStore = useAppStore()
const { rowDrop } = useDragTableRows('.table .el-table__body-wrapper tbody', '.dragHandle')

defineOptions({ name: 'FieldManageConfig' })

// 打开右键
const isOpen = ref(false)
const eventVal: any = ref({})
const rightClick = (event: MouseEvent) => {
  isOpen.value = false
  nextTick(() => {
    eventVal.value = event
    isOpen.value = true
  })
  event.preventDefault()
}

// 制定class名字的元素禁止右键 然后传递callBack
useContextMenu('.el-table__header-wrapper', rightClick)

// 右键配置项
const menus = shallowRef([
  {
    label: '返回(B)',
    tip: 'Alt+向左箭头',
    click: () => {
      // window.history.back(-1)
    }
  },
  {
    label: '点击不关闭菜单',
    tip: '不关闭菜单',
    click: () => {
      //return false点击后不关闭
      return false
    }
  }
])

const handleMenuItem = (item) => {
  console.log(item, '!!')
}

// table 多选
const handleSelectionChange = (val) => {
  console.log(val)
}
const loading = ref(false)

// 拖拽排序
const handleSort = async (params) => {
  const currRow = list.value.splice(params.oldIndex, 1)[0]
  list.value.splice(params.newIndex, 0, currRow)
  // 字段排序
  // await fieldsSort({
  //   poolId,
  //   ids: tableData.value.map((item) => item.id),
  //   ...kTabkeParams.value
  // })

  console.log(list.value, '????')
  ElMessage.success('操作成功')
  getList()
}

const getList = () => {}

onMounted(() => {
  rowDrop(handleSort)
})

const list = ref([
  {
    id: 1,
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 3,
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 4,
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 5,
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 6,
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 7,
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])
</script>
