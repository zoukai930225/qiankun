<!--
 * @Date: 2024-10-22 14:42:40
-->
<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="968"
    >
      <div>
        <div class="drawerTitle"
          ><div> 评价详情 </div
          ><div @click="drawerVisible = false"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content">
        <ContentWrap>
          <div class="table-header flex-row">
            <div class="header-item">问卷名称</div>
            <div class="header-item center">评价对象数</div>
            <!-- <div class="header-item center">状态</div> -->
            <div class="header-item center">提交时间</div>
          </div>

          <div class="table-content flex-row" v-for="(item, index) in list" :key="index">
            <div class="content-item">{{ item.surveyName }}</div>
            <div class="content-item center">
              <el-popover placement="right" :width="300" trigger="click">
                <template #reference>
                  <span class="number"> {{ formatPeople(item) }}</span>
                </template>
                <div class="pop">
                  <div class="pop-header">评价对象数 </div>
                  <div class="pop-content">
                    <div class="item" v-for="ite in item.evaluatorList" :key="ite.id">
                      <img :src="ite.avatarOrigin" class="avator" />
                      <div class="name">{{ ite.name }}</div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
            <!-- <div class="content-item center"
              ><div class="flex-row" :class="formatSty(item)" style="margin: 0 auto"
                ><div class="icon"></div>
                 <div>{{ formatStatus(item) }}</div>
                 </div
              ></div
            > -->
            <div class="content-item center">{{
              formatTime(item?.updatedAt, 'yyyy-MM-dd HH:mm')
            }}</div>
          </div>

          <!-- <Pagination
            v-model:limit="queryParams.size"
            v-model:page="queryParams.page"
            :total="total"
            @pagination="getList"
          /> -->
        </ContentWrap>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { getQuerySurveyList } from '@/api/otr/reviewInvitation/index'
import { formatTime } from '@/utils/index'
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const total = ref(20) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  evaluatorId: undefined,
  inventoryId: undefined
})
const list = ref()

const formatStatus = (item) => {
  switch (item.status) {
    case '0':
      return '未完成'
    case '1':
      return '已完成'
    case '2':
      return '进行中'
    case '3':
      return '已完成'
    default:
      return ''
  }
}

const formatSty = (item) => {
  const str = formatStatus(item)
  if (str == '已完成') {
    return 'finish'
  }
  if (str == '进行中') {
    return 'ing'
  }
  if (str == '未完成') {
    return 'unFinish'
  }
}

const formatPeople = (item) => {
  if (item?.evaluatorList) {
    return item?.evaluatorList.length
  }
  return 0
}

/** 打开弹窗 */
const open = async (params) => {
  drawerVisible.value = true
  queryParams.value.evaluatorId = params.evaluatorId
  queryParams.value.inventoryId = params.inventoryId
  getList()
}

const getList = async () => {
  const res = await getQuerySurveyList(queryParams.value)
  list.value = res || []
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
/* 隐藏 el-date-picker 的图标 */
.activitySet-icon-disabled .el-input__prefix-inner {
  display: none;
}
</style>
<style lang="scss" scoped>
// 修改多选框的背景色
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #bfc9d266;
  border-radius: 15px;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 修改弹窗的标题样式
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}
.content {
  .table-header {
    height: 40px;
    line-height: 40px;
    background: #f3f5f8;
    padding: 0 20px;
    box-sizing: border-box;
    .header-item {
      width: 25%;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
  }
}

.table-content {
  padding: 19px 19px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}
.content-item {
  width: 25%;
  font-size: 14px;
  color: #333333;
  .icon {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #3e86f6;
    border-radius: 50%;
    margin-right: 4px;
  }
}
.finish {
  display: inline-block;
  width: 62px;
  height: 25px;
  border-radius: 2px;
  border: 1px solid #0064ff;
  font-weight: 400;
  font-size: 12px;
  color: #0064ff;
  line-height: 25px;
  .icon {
    background: #0064ff;
  }
}
.unFinish {
  width: 62px;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  border: 1px solid #c2c6ce;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
  .icon {
    background: #666666;
  }
}
.ing {
  width: 62px;
  height: 25px;
  line-height: 25px;
  border-radius: 2px;
  border: 1px solid #e88f33;
  font-weight: 400;
  font-size: 12px;
  color: #e88f33;
  .icon {
    background: #e88f33;
  }
}
.center {
  text-align: center;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.number:hover {
  cursor: pointer;
  color: #0064ff;
}
.pop {
  .pop-header {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-weight: 500;
    font-size: 14px;
    // color: #255c8c;
    // background: url('@/assets/imgs/otr/questionnaireSet/popbg.png');
    // background-size: 100% auto;
  }
  .pop-content {
    // padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    .item {
      padding: 4px;
      box-sizing: border-box;
      height: 22px;
      background: #e6ecff;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 14px;
      border-radius: 10px;
      .avator {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 4px;
      }
      .name {
        font-size: 12px;
        color: #333333;
      }
    }
  }
}
</style>
