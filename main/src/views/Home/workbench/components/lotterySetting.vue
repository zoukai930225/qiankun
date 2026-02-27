<template>
  <Dialog v-model="dialogVisible" title="年会抽奖配置" class="commomDialig">
    <div>
      <div class="jackpot-wrap">
        <div class="lottery-title">
          <span>奖池配置</span>
          <div class="add-btn" @click="addOrEditeHandle('')">
            <Icon class="mr-5px" icon="ep:plus" />
            <span>添加</span>
          </div>
        </div>
        <div class="jackpot-content">
          <ul class="pool-list">
            <li class="pool-item" v-for="item in poolList" :key="item.id">
              <el-checkbox
                :value="item.id"
                :checked="item.status === 1"
                :key="forceUpdate"
                @change="handleCheckedPrizeChange(item)"
              />
              <span @click="addOrEditeHandle(item.id)">{{ item.name }}</span>
              <Icon class="close-btn" @click.stop="delHandle(item.id)" :size="12" icon="ep:close" />
            </li>
          </ul>
        </div>
      </div>
      <div class="roster-wrap">
        <div class="lottery-title">名单配置</div>
        <el-button size="large" type="primary" plain class="export-btn" @click="importHandle"
          >基础名单导入</el-button
        >
      </div>
      <div class="result-wrap">
        <div class="lottery-title">结果导出</div>
        <div>
          <el-select
            class="export-select"
            style="width: 200px"
            v-model="formData.id"
            placeholder="请选择导出批次"
            clearable
            filterable
          >
            <el-option
              v-for="dict in resultList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
          <el-button type="primary" @click="exportHandle()" :disabled="btnDisabled">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:upload" />
            结果导出
          </el-button>
        </div>
      </div>

      <!-- 新增/删除奖池 -->
      <AddOrEditePool ref="addOrEditePoolRef" @success="getList" />
      <!-- 名单导入 -->
      <ImportMemberDialog ref="importMemberRef" />
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'LotterySettting' })
const message = useMessage() // 消息弹窗
import download from '@/utils/download'
import {
  getLotteryPage,
  deleteLottery,
  setDefaultStatus,
  getBatchList,
  exportLotteryData
} from '@/api/system/lottery'
import AddOrEditePool from './addOrEditePool.vue'
import ImportMemberDialog from './importMemberDialog.vue'
const { t } = useI18n()

const dialogVisible = ref(false) // 弹窗的是否展示'
const btnDisabled = ref(false)
const addOrEditePoolRef = ref()

const forceUpdate = ref()
const handleCheckedPrizeChange = async (item: any) => {
  try {
    await setDefaultStatus({ ...item, status: item.status === 1 ? 2 : 1 })
    await getList()
  } catch (e) {
    console.log(e)
  }
  forceUpdate.value = !forceUpdate.value
}

const formData = ref({
  id: ''
})
/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  formData.value.id = ''
  getList()
  _getBatchList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取列表数据
const poolList = ref<any[]>([])
const getList = async () => {
  try {
    const res = await getLotteryPage()
    poolList.value = res || []
    return res || []
  } catch (e) {
    console.log(e)
  }
}

const addOrEditeHandle = (id: String) => {
  addOrEditePoolRef.value.open(id)
}
// 删除奖池
const delHandle = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteLottery(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}
// 名单导入
const importMemberRef = ref()
const importHandle = () => {
  importMemberRef.value.open()
}
// 获取批次列表

const resultList = ref<any[]>([])
const _getBatchList = async () => {
  try {
    const res = await getBatchList()
    resultList.value = res || []
  } catch (e) {
    console.log(e)
  }
}

const exportHandle = async () => {
  try {
    btnDisabled.value = true
    let name = resultList.value.find((item) => item.id === formData.value.id).name
    const data = await exportLotteryData({ batchId: formData.value.id })
    if (data) {
      download.excel(data, `${name}数据导出.xls`)
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    btnDisabled.value = false
  }
}
</script>

<style lang="scss" scoped>
.lottery-title {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 14px;
  .add-btn {
    display: flex;
    line-height: 20px;
    cursor: pointer;
    color: #0064ff;
    .mr-5px {
      padding-top: 2px;
      margin-right: 0;
    }
  }
}
.jackpot-wrap {
  .lottery-title {
    margin-top: 0;
  }
}
.jackpot-content {
  border: 1px solid #dbe1e4;
  border-radius: 10px;
  padding: 20px 10px;
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .pool {
    &-list {
      display: flex;
      flex-wrap: wrap;
      height: 100px;
      overflow-y: auto;
      gap: 5px;
    }
    &-item {
      padding: 0 8px 0 15px;
      height: 32px;
      line-height: 32px;
      background: #dce5fe;
      border-radius: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      column-gap: 4px;
    }
  }
}

:deep(.close-btn) {
  cursor: pointer;
}
:deep(.el-button.export-btn:hover) {
  color: #0064ff;
}

.export-select {
  margin-right: 20px;
}
:deep(.el-button.export-btn) {
  background: #ecf2f9;
}
</style>
