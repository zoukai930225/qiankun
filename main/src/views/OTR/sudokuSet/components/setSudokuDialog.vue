<template>
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    title=""
    :destroy-on-close="true"
    :align-center="true"
    style="width: 80%; height: 680px"
  >
    <!-- 搜索工作栏 -->
    <ContentWrap>
      <div class="content-wrap">
        <!-- 左侧九宫格 -->
        <div class="sudoku-content">
          <Axis :width="383" :height="368" />

          <div class="sudoku-wrapper">
            <div
              class="box"
              v-for="item in list"
              :key="item.number"
              :class="{ [item.number.toLowerCase()]: true }"
              :style="{ backgroundColor: item.backgroundColor }"
            >
              {{ item.number }}
            </div>
            <!-- <div class="box e">E</div>
            <div class="box c">C</div>
            <div class="box a">A</div>
            <div class="box f">F</div>
            <div class="box d">D</div>
            <div class="box b">B</div>
            <div class="box g">G</div>
            <div class="box h">H</div>
            <div class="box i">I</div> -->
          </div>
        </div>
        <!-- 右侧表格 -->
        <div class="table-content">
          <el-table
            ref="sortTableRef"
            :header-cell-style="appStore.headerCellStyle"
            v-loading="loading"
            :data="list"
            row-class-name="commonTableRow"
            class="SWCommonTable"
            v-horizontal-scroll="'always'"
          >
            <el-table-column label="编号" prop="number" width="60" />
            <el-table-column label="结果" prop="result" width="60">
              <template #default="scope">
                {{ scope.row.result || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="定位" prop="position" min-width="100" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.position || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="背景色" prop="backgroundColor" width="80">
              <template #default="scope">
                <div
                  class="color-container"
                  :style="`background: ${scope.row.backgroundColor}`"
                ></div>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="describeMes" min-width="300" show-overflow-tooltip>
              <template #default="scope">
                {{ scope.row.describeMes || '-' }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="80" label="操作" align="center">
              <template #default="scope">
                <div class="action-edit" @click="openEditForm('update', scope.row.id)"
                  ><el-icon style="margin-right: 4px; vertical-align: middle"><Edit /></el-icon
                  >编辑</div
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </ContentWrap>
  </el-dialog>
  <EditSudokuForm ref="editSudokuFormRef" @success="handleSuccess" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import EditSudokuForm from './editSudokuForm.vue'
// import NineGrid from './nineGrid.vue'
import Axis from './axis.vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import * as sudokuSetApi from '@/api/otr/sudokuSet'
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
defineOptions({ name: 'RelatedConfigList' })

/** 打开弹窗 */
const open = async (id) => {
  console.log('id', id)
  dialogVisible.value = true
  // dialogTitle.value = skName
  // formType.value = type
  // 修改时，设置数据
  if (id) {
    loading.value = true
    try {
      getList(id)
    } finally {
      loading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const loading = ref(false) // 加载状态
const list = ref<any[]>([])
/** 查询字典类型列表 */
const getList = async (id) => {
  loading.value = true
  try {
    const data = await sudokuSetApi.getSudokuSetDetailList([id]).catch(() => {
      loading.value = false
    })
    if (data) {
      list.value = data[id] || []
    }
  } finally {
    loading.value = false
  }
}

/** 编辑 */
const editSudokuFormRef = ref()
const openEditForm = (type: string, id?: string) => {
  if (editSudokuFormRef.value) {
    editSudokuFormRef.value.open(type, id)
  }
}

const handleSuccess = (id: string) => {
  getList(id)
}
</script>
<style lang="scss" scoped>
.content-wrap {
  display: flex;
  justify-content: space-between;
}
// 九宫格部分开始
.sudoku-content {
  width: 462px;
  height: 570px;
  position: relative;
  background-image: url(@/assets/imgs/otr/sudokuSet/set_bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40px;
  box-sizing: border-box;
}
.sudoku-wrapper {
  width: 383px;
  display: grid;
  grid-template-columns: 118px 10px 118px 10px 118px;
  grid-template-rows: auto 10px auto 10px auto;
  position: absolute;
  top: 50%;
  left: 56%;
  transform: translate(-50%, -50%);
  color: #a46128;
}

.box {
  width: 118px;
  height: 110px;
  background-color: #edbf8a;
  color: #fff;
  font-size: 14px;
  text-align: center;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.e {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background: #83d5cc;
}

.c {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  background: #6eb6ed;
}

.a {
  grid-column: 5 / 6;
  grid-row: 1 / 2;
  background: #ee6570;
}

.f {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  background: #e8b8e8;
}

.d {
  grid-column: 3 / 4;
  grid-row: 3 / 4;
  background: #f8cf19;
}

.b {
  grid-column: 5 / 6;
  grid-row: 3 / 4;
  background: #61d692;
}

.g {
  grid-column: 1 / 2;
  grid-row: 5 / 6;
  background: #edbf8a;
}

.h {
  grid-column: 3 / 4;
  grid-row: 5 / 6;
  background: #ce9cff;
}

.i {
  grid-column: 5 / 6;
  grid-row: 5 / 6;
  background: #f7939b;
}
// 九宫格部分结束

// 右侧表格部分开始
.table-content {
  font-size: 14px;
  min-width: 310px;
  width: 960px;
  margin-left: 20px;
  // 背景色
  .color-container {
    width: 50px;
    height: 26px;
    background: #61d692;
    border-radius: 13px;
  }
  .action-edit {
    color: #0064ff;
    cursor: pointer;
  }
}
</style>
