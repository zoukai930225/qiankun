<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="auto">
          <el-form-item label="分组名称" prop="groupName" class="margin-right-20">
            <el-input v-model.trim="queryParams.groupName" placeholder="请输入分组名称" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="状态" prop="isInvalid" class="margin-right-20">
            <el-select v-model="queryParams.isInvalid" placeholder="请选择状态" @change="handleQuery" style="width: 200px;">
              <el-option label="全部" :value="3" />
              <el-option label="有效" :value="1" />
              <el-option label="无效" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" style="margin-left: 0px" @click="resetQuery">
            重置
          </el-button>
          <el-button type="primary" @click="openForm('add')">
            <el-icon>
              <Plus :size="12" style="margin-right: 3px;" />
            </el-icon>添加分组
          </el-button>
        </div>
      </div>
    </div>
    <!---- 可拖拽表格 ---->
    <div ref="containerOuterMost">
      <div class="content" style="overflow-x: scroll" v-loading="loading">
        <!-- header -->
        <div class="flex-row header-wapper">
          <div class="item w160">分组名称</div>
          <div class="item auto-width">包含店铺</div>
          <div class="item w80">创建人</div>
          <div class="item w150">修改时间</div>
          <div class="item w150">操作</div>
        </div>
        <!-- body -->
        <div class="content-body">
          <div class="content-wapper commonTableRow" v-for="item in list" :key="item?.id" :id="item?.id">
            <div class="item flex-row w160">
              <img class="dragHandle" src="@/assets/imgs/biControl/sort.png" alt="" style="width: 26px;height: 26px;" />
              <el-tooltip class="box-item" effect="dark" :content="item?.groupName"
                :disabled="!item?.groupName || item?.groupName.length < 10">
                <div class="text-overflow">{{ item?.groupName }}</div>
              </el-tooltip>
            </div>
            <div class="item auto-width flex-row">
              <template v-if="!Array.isArray(item?.storeList) || item?.storeList.length < 1">-</template>
              <template v-else>
                <template v-for="store in item?.storeList" :key="store?.id">
                  <div class="flex-row" style="margin-right: 10px;" v-if="!store?.stack">
                    <img :src="getImageUrl(store?.channel)" alt="" style="width: 20px;margin-right: 5px;"
                      object-fit="contain" />
                    <div>{{ store?.nickName }}</div>
                  </div>
                </template>
              </template>
              <template v-if="item?.stackNums">
                <el-popover :width="300" effect="dark">
                  <template #reference>
                    <el-tag size="small" type="info" round style="cursor: pointer;" v-if="item?.stackNums">{{
                      item?.stackNums
                      }}</el-tag>
                  </template>
                  <div style="width: 100%;max-height: 300px;overflow-y: auto;">
                    <div v-for="store in item?.storeList" :key="store?.id">
                      <div class="flex-row" v-if="store?.stack" style="margin-bottom: 5px;">
                        <img :src="getImageUrl(store?.channel)" alt="" style="width: 20px;margin-right: 5px;"
                          object-fit="contain" />
                        <div class="shop-text">{{ store?.nickName }}</div>
                      </div>
                    </div>
                  </div>
                </el-popover>

              </template>
            </div>
            <div class="item flex-row w80">
              {{ item?.createdId }}
            </div>
            <div class="item flex-row w150">
              {{ item?.updatedAt }}
            </div>
            <div class="item flex-row w150">
              <el-button type="primary" link @click="openForm('edit', item)" v-if="item?.isInvalid == 1">编辑</el-button>
              <el-button type="danger" link v-if="item?.isInvalid == 1" @click="handleInvalid(item?.id, item)"
                :loading="item?.loading">作废</el-button>
              <el-button type="primary" link @click="openHistory(item?.id)">历史记录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
    <formDrawer ref="formDrawerRef" @success="getList" />
    <historyDialog ref="historyDialogRef" />
  </ContentWrap>
</template>
<script lang="ts" setup>
defineOptions({ name: 'BiControlShopGroup' })
import { useEventListener } from '@vueuse/core'
import { getBoundingClientRect } from '@/utils/domUtils'
import { getImageUrl } from '@/utils'
import * as storeGroupApi from '@/api/biControl/storeGroup/index'
import { useDragTableRows } from './components/utils.js'
const { rowDrop, stopDrop } = useDragTableRows('.content-body', '.dragHandle')
import formDrawer from './components/formDrawer.vue'
import historyDialog from './components/historyDialog.vue'
const message = useMessage() // 消息弹窗
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const queryParams = ref({
  groupName: '',//分组名称
  isInvalid: 1,//是否有效 1有效2无效3全部
  page: 1,
  size: 10,
})

const containerOuterMost = ref<Element | null>(null) // 最外层的容器
const windowWidth = ref(0) // 当前可用宽度
const shopWidth = ref(400) // 店铺可用的宽度
function getDefaultStyle() {
  if (!containerOuterMost.value) return
  const data = getBoundingClientRect(containerOuterMost.value);
  if (!data) return
  windowWidth.value = data?.width
  shopWidth.value = data?.width - 636 - 24;
  if (Array.isArray(list.value)) {
    list.value = dealData(list.value)
  }
}
const total = ref(0) // 列表的总页数
const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await storeGroupApi.getGroupList(queryParams.value)
    if (data) {
      list.value = dealData(data.records)
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

function dealData(data) {
  data.map((item, index) => {
    let stackNums = 0;
    let width = 0
    if (!Array.isArray(item.storeList)) {
      item.storeList = []
    }
    item.storeList.map((each, eachIndex) => {
      width = Number(width) + getLength(each.name) + 35;
      if (width < shopWidth.value) {
        if (width < shopWidth.value && ((index === data.length - 1 && eachIndex === item.storeList.length - 1) || (width + 40 < shopWidth.value))) {
          each.stack = false;//不隐藏到tip里面
        } else {
          each.stack = true;
          stackNums++;
        }
      } else {
        each.stack = true;
        stackNums++;
      }
    })
    item.stackNums = stackNums;
  })
  return data
}

// 拖拽排序
const handleSort = async (params) => {
  const data = JSON.parse(JSON.stringify(list.value));
  let temp = data[params.oldIndex];//要移动的数据
  data.splice(params.oldIndex, 1);//删除
  data.splice(params.newIndex, 0, temp);//重新插入
  await storeGroupApi.updateSort({
    page: queryParams.value.page,
    size: queryParams.value.size,
    groups: data.map((item) => item.id)
  })
  message.success('排序成功')
  getList()
}

const formDrawerRef = ref()
const openForm = (type: string, item?: object) => {
  formDrawerRef.value?.open(type, item)
}
const historyDialogRef = ref()
const openHistory = (id: string) => {
  historyDialogRef.value?.open(id)
}

const handleInvalid = async (id: string, cloumn) => {
  try {
    // 删除的二次确认
    await message.confirm('是否确定作废选中数据？')
    cloumn.loading = true
    // 发起删除
    await storeGroupApi.invalidGroup(id)
    message.success('作废成功！')
    // 刷新列表
    await getList()
  } catch { } finally {
    setTimeout(() => {
      cloumn.loading = false
    }, 1000)
  }
}

const inputChange = () => {
  nextTick(() => {
    handleQuery()
  })
}

onMounted(() => {
  getDefaultStyle();
  useEventListener('resize', getDefaultStyle);
  rowDrop(handleSort)
  getList()
})

//1个字节 7px
function getLength(str: string) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length++;
    }
  }
  return length * 8;
}
</script>

<style lang="less" scoped>
.margin-right-20 {
  margin-right: 20px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}


.content {
  width: 100%;
  box-sizing: border-box;

  .header-wapper {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    background-color: #F2F6FC;
    min-width: 1200px;

    .item {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      width: 140px;
      padding: 0 12px;
    }
  }

  .content-wapper {
    background: white;
    display: flex;
    flex-direction: row;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
    width: 100%;
    min-width: 1200px;

    .item {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      width: 140px;
      padding: 0 12px;
    }

    &:hover {
      background: #f5f9ff;
    }

  }

  .item {
    // max-width: 400px;
    // flex: 0 0 auto;

    /* 根据内容自动调整宽度 */
    .check {
      width: 16px;
      height: 16px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #d0d5d6;
      cursor: pointer;
    }

    .activity {
      background: url('@/assets/imgs/selected.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border: none;
    }
  }

  .checkBox {
    width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .w40 {
    width: 40px !important;
  }

  .w55 {
    width: 55px !important;
  }

  .w80 {
    width: 80px !important;
  }

  .w100 {
    width: 100px !important;
  }

  .w150 {
    width: 150px !important;
  }

  .w160 {
    width: 160px !important;
  }

  .dragHandle {
    cursor: pointer;
  }

}

.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}


.auto-width {
  width: auto !important;
  min-width: 150px;
  flex: 1 !important;
  max-width: 100%;
}

.shop-text {
  text-align: left;
}
</style>
