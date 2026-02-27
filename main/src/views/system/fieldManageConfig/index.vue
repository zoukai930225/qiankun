<template>
  <div>
    <ContentWrap>
      <div class="flex-row" style="justify-content: space-between">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" @submit.prevent>
          <el-form-item label="属性名称" prop="name">
            <el-input
              class="searchFormItemWidth"
              v-model="queryParams.name"
              placeholder="请输入属性名称"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item label="所属模块 " prop="model">
            <Menuitem v-model="queryParams.moduleId" @change="handleSearch" />
          </el-form-item>
        </el-form>
        <div>
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
      <div>
        <div class="content" style="overflow-x: scroll">
          <!-- header -->
          <div class="flex-row header-wapper">
            <div class="item checkBox w55"></div>
            <div class="item checkBox w55">
              <div
                class="check"
                @click="selectAll"
                :class="{ activity: list?.length == selectIds?.length && list?.length != 0 }"
              ></div>
            </div>
            <div class="item">属性名称</div>
            <div class="item">映射字段</div>
            <div class="item">所属模块</div>
            <div class="item">状态</div>
            <div class="item">数据类型</div>
            <div class="item">引用字典</div>
            <div class="item">属性默认值</div>
            <div class="item">最大长度</div>
            <div class="item">提示语</div>
            <div class="item">列表显示</div>
            <div class="item">是否必填</div>
            <div class="item">是否可编辑</div>
            <div class="item">查询显示</div>
            <div class="item">支持排序</div>
            <div class="item">支持过滤</div>
            <div class="item">操作</div>
          </div>
          <div class="content-wapper" v-for="item in list" :key="item.id">
            <div class="item checkBox w55">
              <img
                class="dragHandle"
                src="@/assets/imgs/system/fieldManageConfig/drog.png"
                alt=""
              />
            </div>
            <div class="item checkBox w55">
              <div
                class="check"
                @click="singleSelect(item)"
                :class="{ activity: isSelect(item) }"
              ></div>
            </div>

            <div
              class="item"
              style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
            >
              <el-tooltip class="box-item" effect="dark" :content="item?.name" placement="top">
                {{ item?.name }}
              </el-tooltip>
            </div>

            <div class="item">{{ item?.code }}</div>
            <div class="item">{{ item?.moduleName }}</div>
            <div class="item">
              <div class="state-item">
                <img
                  src="@/assets/imgs/system/fieldManageConfig/qiyong.png"
                  v-if="item?.state == 1"
                  class="icon-item"
                />
                <img
                  src="@/assets/imgs/system/fieldManageConfig/jinyong.png"
                  v-else
                  class="icon-item"
                />
                <span class="desc"> {{ item?.state == 1 ? '启用' : '禁用' }}</span>
              </div>
            </div>
            <div class="item">{{ formatType(item?.type) }}</div>
            <div class="item">{{ getNameById(item?.dictCode) }}</div>
            <div class="item">{{ item?.defaultValue }}</div>
            <div class="item">{{ item?.maxLength }}</div>
            <div class="item">
              <div class="toolTip">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item?.placeholder"
                  placement="top"
                >
                  {{ item?.placeholder }}
                </el-tooltip>
              </div>
            </div>
            <div class="item">
              <el-switch
                v-model="item.listDisplay"
                @change="handleChange(item, 'listDisplay')"
                :loading="switchLoading"
            /></div>
            <div class="item">
              <el-switch
                v-model="item.required"
                @change="handleChange(item, 'required')"
                :loading="switchLoading"
            /></div>
            <div class="item">
              <el-switch
                v-model="item.edit"
                @change="handleChange(item, 'edit')"
                :loading="switchLoading"
            /></div>
            <div class="item">
              <el-switch
                v-model="item.searchDisplay"
                @change="handleChange(item, 'searchDisplay')"
                :loading="switchLoading"
            /></div>
            <div class="item">
              <el-switch
                v-model="item.supportSort"
                @change="handleChange(item, 'supportSort')"
                :loading="switchLoading"
            /></div>
            <div class="item">
              <el-switch
                v-model="item.supportFilter"
                @change="handleChange(item, 'supportFilter')"
                :loading="switchLoading"
            /></div>
            <div class="item"
              ><el-button type="primary" link @click="openForm(item.id)">编辑</el-button></div
            >
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div style="height: 40px">
        <Pagination
          v-if="list?.length"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="handPageChange"
        />
      </div>
    </ContentWrap>

    <!--  -->
    <AddForm ref="addFormRef" @success="refresh" :dicList="dicList" />
    <CopyField ref="copyFieldRef" :selectItem="selectIds" @success="refresh" />
  </div>
</template>

<script lang="ts" setup>
import { getDictDataPage } from '@/api/system/dict/dict.data'
import {
  basicAttributeEnableAttr,
  delBasicAttribute,
  disableAttrBasicAttribute,
  getBasicAttribute,
  sortAttr,
  updateSwitchColumn
} from '@/api/system/fieldManageConfig/index'
import { useAppStore } from '@/store/modules/app'
import AddForm from './components/addForm.vue'
import CopyField from './components/copyField.vue'
import Menuitem from './components/Menuitem.vue'
import { addList, useDragTableRows } from './components/utils'
const message = useMessage() // 消息弹窗
const appStore = useAppStore()
const { rowDrop, stopDrop } = useDragTableRows('.content', '.dragHandle')

defineOptions({ name: 'FieldManageConfig' })
const switchFlag = ref(false)
const switchLoading = ref(false)
// 操作开关
const handleChange = async (item, str) => {
  try {
    if (!switchFlag.value) return
    const data = {
      column: str,
      id: item.id,
      value: item[str] ? 1 : 0
    }
    switchLoading.value = true
    await updateSwitchColumn(data)
    switchLoading.value = false
    message.success('操作成功')
    refresh()
  } catch (error) {
    switchLoading.value = false
  }
}
const formatType = (type) => {
  const typeMap = {
    0: '文本',
    1: '数字',
    2: '单选',
    3: '多选',
    4: '日期',
    5: '日期时间',
    6: '开关'
  }
  return typeMap[type] || ''
}

const total = ref(10)
const copyFieldRef = ref()
const addBtnClick = async (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm()
    } else if (currentAddCode.value === 'del') {
      if (!selectIds.value?.length) {
        message.error('请选择要操作的数据')
        return
      }
      await message.confirm('是否要删除所选属性', '删除确认')
      handleDel()
    } else if (currentAddCode.value === 'copy') {
      if (!selectIds.value?.length) {
        message.error('请选择要操作的数据')
        return
      }
      copyFieldRef.value.open()
    } else if (currentAddCode.value === 'open') {
      if (!selectIds.value?.length) {
        message.error('请选择要操作的数据')
        return
      }
      // 启用
      handleOpen()
    } else if (currentAddCode.value === 'stop') {
      if (!selectIds.value?.length) {
        message.error('请选择要操作的数据')
        return
      }
      // 禁用
      handleStop()
    }
  }
}

const getNameById = (id) => {
  const item = dicList.value.find((item) => item.id === id)
  return item ? item.name : ''
}

const addFormRef = ref()
const openForm = (id?) => {
  addFormRef.value.open(id)
}
const selectIds = ref<BaseConfig[]>([])

// 启用
const handleOpen = async () => {
  try {
    const arr = selectIds.value.map((item) => {
      return {
        id: item.id
      }
    })

    await basicAttributeEnableAttr(arr)
    message.success('操作成功')
    refresh()
  } catch (error) {}
}

const handleStop = async () => {
  try {
    const arr = selectIds.value.map((item) => {
      return {
        id: item.id
      }
    })
    await disableAttrBasicAttribute(arr)
    message.success('操作成功')
    refresh()
  } catch (error) {}
}

const isSelect = (item) => {
  // @ts-ignore
  const index = selectIds.value?.findIndex((ite) => ite.id === item.id)
  return index != -1
}
// 删除
const handleDel = async () => {
  try {
    const arr = selectIds.value.map((item) => {
      return {
        id: item.id
      }
    })
    await delBasicAttribute(arr)
    message.success('操作成功')
    refresh()
  } catch (error) {}
}

// 全选
const selectAll = () => {
  console.log('全选')
  const flag = selectIds.value.length == list.value.length || selectIds.value.length == 0
  list.value.forEach((item) => {
    if (flag) {
      singleSelect(item)
    } else {
      // @ts-ignore
      const index = selectIds.value?.findIndex((ite) => ite.id === item.id)
      if (index == -1) {
        selectIds.value.push(item)
      }
    }
  })
}

// 单选
const singleSelect = (item) => {
  // @ts-ignore
  const index = selectIds.value?.findIndex((ite) => ite.id === item.id)
  if (index == -1) {
    selectIds.value.push(item)
  } else {
    selectIds.value.splice(index, 1)
  }
}

// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

const queryParams = ref({
  name: '', //名称/编码
  moduleId: [],
  page: 1,
  size: 10
})

const handPageChange = (val) => {
  console.log(val)
  queryParams.value.page = val.page
  queryParams.value.size = val.limit
  selectIds.value = []
  getList()
}

const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

watch([() => queryParams.value.moduleId, () => queryParams.value.name], ([moduleId, name]) => {
  if (moduleId?.length && !name) {
    stopDrop(false)
  } else {
    stopDrop(true)
  }
})

// 拖拽排序
const handleSort = async (params) => {
  const temp = list.value[params.oldIndex - 1]
  list.value[params.oldIndex - 1] = list.value[params.newIndex - 1]
  list.value[params.newIndex - 1] = temp
  list.value = [...list.value]
  const arr = list.value.map((item) => {
    return {
      id: item?.id
    }
  })
  await sortAttr({
    arr: arr,
    page: queryParams.value.page,
    size: queryParams.value.size
  })
  ElMessage.success('操作成功')
  getList()
}

// 刷新
const refresh = () => {
  queryParams.value.page = 1
  selectIds.value = []
  getList()
}

// 获取列表
const getList = async () => {
  try {
    const params = {
      ...queryParams.value
    }
    switchFlag.value = false
    const res = await getBasicAttribute(params)
    list.value = res.records || []
    total.value = res.total
    switchFlag.value = true
    selectIds.value = []
  } catch (error) {
    switchFlag.value = true
    selectIds.value = []
  }
}

// 搜索
const handleSearch = (value) => {
  queryParams.value.page = 1
  if (value) {
    queryParams.value.moduleId = value[value.length - 1]
  }
  getList()
}

interface DicItem {
  id?: number
  name?: string
}

const dicList = ref<DicItem[]>([])

const initDicList = async () => {
  const params = {
    page: 1,
    size: 1000,
    type: 1
  }
  const res = await getDictDataPage(params)
  dicList.value = res.data || []
}

onMounted(() => {
  rowDrop(handleSort)
  getList()
  initDicList()
})

interface BaseConfig {
  name: string //属性名称
  code: string //映射字段
  moduleName: string //模块名称
  moduleId: string //模块主键
  state: number //状态 0-启用；1-禁用
  type: number //属性类型 0-文本；1-数字；2-单选；3-多选；4-日期；5-日期时间；6-开关
  dictCode: string //属性引用字典编码
  defaultValue: string //属性默认值
  maxLength: number //属性值最大长度
  placeholder: string //提示语
  listDisplay: boolean //是否列表显示 0-否；1-是
  required: boolean //是否必填 0-否；1-是
  edit: boolean //是否可编辑 0-否；1-是
  searchDisplay: boolean //查询显示 0-否；1-是
  supportSort: boolean //支持排序 0-否；1-是
  supportFilter: boolean //支持过滤 0-否；1-是
  id: string
  dictName: undefined
}

const list = ref<BaseConfig[]>([])
</script>
<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.content {
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(250, 252, 255, 0.19) 0%,
    rgba(242, 247, 255, 0.78) 63%,
    #ebf2ff 100%
  );
  border-radius: 6px;
  padding: 0 20px;
  box-sizing: border-box;

  .header-wapper {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    box-sizing: border-box;
    .item {
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      width: 160px;
    }
  }

  .content-wapper {
    background: white;
    display: flex;
    flex-direction: row;
    height: 40px;
    line-height: 40px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-bottom: 16px;
    padding: 0 20px;
    box-sizing: border-box;
    .item {
      background: white;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      width: 160px;
    }
  }

  .item {
    max-width: 400px;
    flex: 0 0 auto; /* 根据内容自动调整宽度 */
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
  .w55 {
    width: 55px !important;
  }
  .w80 {
    width: 80px !important;
  }
  .w100 {
    width: 100px !important;
  }

  .dragHandle {
    cursor: pointer;
  }
}

.state-item {
  cursor: pointer;
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  background: #f2f6fc;
  border-radius: 16px;
  height: 26px;
  width: 70px;
  .icon-item {
    width: 10px;
    height: 10px;
    margin-right: 8px;
  }
  .desc {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
}

.toolTip {
  cursor: pointer;
  padding-right: 20px;
  box-sizing: border-box;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
