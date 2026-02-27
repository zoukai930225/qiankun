<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      @submit.prevent
    >
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div style="display: flex">
          <el-form-item label="系统参数编码:" prop="code">
            <el-input
              v-model="queryParams.code"
              clearable
              placeholder="请输入系统参数编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="系统参数名称:" prop="name">
            <el-input
              v-model="queryParams.name"
              clearable
              placeholder="请输入系统参数名称"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="系统参数类型:" prop="type">
            <el-select
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.type"
              placeholder="请选择类型"
              clearable
              @clear="handleQuery"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CONSTANT_CONFIG)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div style="display: flex; margin-top: 2px">
          <div class="search-btn">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
          </div>

          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
      </div>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="btn-group">
      <el-button type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />
        新增
      </el-button>
      <el-button @click="handleRefreshCache"> 刷新缓存 </el-button>
    </div>
    <div>
      <div v-if="categorizedList && Object.keys(categorizedList).length > 0">
        <div class="categorizedList" v-for="(items, type) in categorizedList" :key="type">
          <div class="categorizedList-type">{{ formatType(type) }}</div>
          <div class="categorizedList-card">
            <!-- 表头 -->
            <div class="categorizedList-header">
              <div class="header-item code">编码</div>
              <div class="header-item name">名称</div>
              <div class="header-item value">值</div>
              <div class="header-item action">操作</div>
            </div>
            <!-- 表格内容 -->
            <div class="categorizedList-content" v-for="item in items" :key="item.id">
              <div class="content-item code cursor_pointer" @click="copyText(item.code)">{{
                item.code
              }}</div>
              <div class="content-item name cursor_pointer" @click="copyText(item.name)">{{
                item.name
              }}</div>
              <div class="content-item value" style="display: flex; align-items: center">
                <el-input
                  v-model="item.value"
                  :readonly="!item.editable"
                  @dblclick="handleDoubleClick(item)"
                  @blur="handleBlur(item)"
                  style="width: 100%"
                >
                  <template #suffix>
                    <div
                      v-if="item.editable"
                      class="cursor_pointer"
                      style="display: flex; align-items: center; margin-left: 10px"
                    >
                      <img
                        src="@/assets/imgs/sysConstantForm/edit_success.png"
                        @click="submitEdit(item)"
                        alt="提交"
                      />
                      <div class="line"> | </div>
                      <img
                        src="@/assets/imgs/sysConstantForm/edit_error.png"
                        @click="item.editable = false"
                        alt="取消"
                      />
                    </div> </template
                ></el-input>
              </div>
              <!-- 操作 -->
              <div class="content-item action cursor_pointer">
                <div @click="openForm('update', item.id)" style="color: #0064ff">编辑</div>
                <div @click="handleDelete(item.id)" style="color: #eb3737">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <el-empty description="暂无数据" />
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SysConstantForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as SystemConstantApi from '@/api/system/systemConstant'
import { copyText } from '@/utils/copyText'
import SysConstantForm from './components/sysConstantForm.vue'
import { ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 字典表格数据
const queryParams = ref({
  page: 1,
  size: 10,
  name: undefined, //系统参数名称
  code: undefined, //系统参数编码
  type: undefined //系统参数分类
})
// createTime: []
const queryFormRef = ref() // 搜索的表单
const categorizedList = ref<any>({}) // 按照type分类的列表
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SystemConstantApi.getSystemConstantConfigPage(queryParams.value)
    list.value = data.data || []
    total.value = data.total
    // 按照 type 分类
    categorizedList.value = list.value.reduce((acc, item) => {
      const { type } = item
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push({ ...item, editable: false, originalValue: item.value }) // 添加 editable  属性
      return acc
    }, {})
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
  // console.log('--',categorizedList.value);
}

// 通过type查名称
const formatType = (type) => {
  const arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CONSTANT_CONFIG)
  const foundObject = arr.find((obj) => obj.code === type)
  return foundObject ? foundObject.label : ''
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SystemConstantApi.deleteSystemConstantConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 刷新缓存 */
const handleRefreshCache = async () => {
  await SystemConstantApi.refreshSystemConstantConfig()
}

/** 提交修改 */
const submitEdit = async (data) => {
  try {
    let queryData = {
      id: data?.id,
      name: data?.name,
      code: data?.code,
      value: data?.value
    }
    await SystemConstantApi.saveSystemConstantConfig(queryData)
    handleUpdateSuccess()
    data.editable = false // 提交成功后将编辑状态改为false
  } catch (err) {
    handleUpdateFail()
  } finally {
  }
}

/** 双击处理 */
const handleDoubleClick = (item) => {
  if (!item.editable) {
    item.originalValue = item.value // 保存初始值
    item.editable = true
  }
}

// // 失去焦点处理
const handleBlur = (item) => {
  if (item.editable) {
    item.value = item.originalValue // 还原初始值
    item.editable = false
  }
}

/** 修改成功的提醒方法*/
const handleUpdateSuccess = () => {
  // console.log('修改成功')
  ElNotification({
    title: '修改成功',
    customClass: 'SystemConstant_notifyStyle_success',
    type: 'success'
  })
}

/** 修改失败的提醒方法*/
const handleUpdateFail = () => {
  // console.log('修改失败')
  ElNotification({
    title: '修改失败',
    customClass: 'SystemConstant_notifyStyle_error',
    type: 'error'
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
<style lang="scss">
.SystemConstant_notifyStyle_success {
  background-color: #e5f9f3;
  font-size: 14px;
}
.SystemConstant_notifyStyle_error {
  background-color: #fef0f0;
  font-size: 14px;
}
</style>
