<!--
 * @Date: 2025-01-03 16:22:21
-->
<template>
  <div>
    <SWForm :fields="configList" @search="handleSearch" @reset="handleReset" @add="handleAdd('create', '')" />

    <ContentWrap>
      <div class="templeteName">
        {{ route.query.templeteName || '' }}
      </div>
      <SWTable :tableColumns="configList" :tableData="list" :permissionList="permissionList"
        :templateCodeList="templateCodeList" :total="total" :loading="loading" @edit="handleEdit"
        @audit-config="auditConfig" @del="handleDel" @page-change="handlePageChange" @sort-change="handleSortChange"
        @drag-node-sort="handleDrag" @double-click="handleDoubleClick" @blur="handleBlur" @handle-node-category="handleNodeCategory"/>
    </ContentWrap>
    <AuditConfigDialog ref="auditConfigRef" @success="handleSuccess" />
    <AddDialog ref="addFormRef" :fields="configList" @close="handleCloseDialog" @success="handleSuccess"
      :templateCodeList="templateCodeList" :permissionList="permissionList" />
    <NodeCategoryDrawer ref="nodeCategoryRef"></NodeCategoryDrawer>
  </div>
</template>

<script lang="ts" setup>
// import { getBasicAttribute, getNpList, deleteNpById } from '@/api/oa/new/plan/index'
// import { debounce } from 'lodash-es'
import * as TempleteApi from '@/api/oa/new/templete'
import * as CommonApi from '@/api/common/index'

import SWForm from './components/SWForm.vue'
import SWTable from './components/SWTable.vue'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import AuditConfigDialog from './components/auditConfigDialog.vue'
import NodeCategoryDrawer from './components/nodeCategoryDrawer.vue'

// 表格配置项
import { templateTableColumns } from '@/views/OA/new/templete/node/hooks/useTemplateTable'
import AddDialog from './components/addDialog.vue'
const templateCodeList = ref<any>([])

const message = useMessage() // 消息弹窗
defineOptions({ name: 'TempleteDetail' })
const list = ref([]) // 列表数据
const listAll = ref([])
const total = ref(0) // 总数
const configList = ref<any>([]) // 配置列表
const form = ref({
  page: 1,
  size: 10
})
const dicList = ref([])
const loading = ref(false)
const route = useRoute() // 路由
// 新增
const addFormRef = ref()
const auditConfigRef = ref()
// const handleAdd = debounce(async () => {
//   createNewRow()
// }, 300)
const handleAdd = (type, id) => {
  addFormRef.value.open(type, id)
}

const templeteName = (route.query.templeteName || '') as string

// const properties = [
//   'nodeName',
//   'depName',
//   'nodeOrder',
//   'autoStart',
//   'warningDuration',
//   'basisDuration',
//   'durationUnit',
//   'weeklyRest'
// ]
const properties = ref<any>([])

const createNewRow = async () => {
  const newRow = {} as any

  // 初始化每个属性及其Editable属性为true
  properties.value.forEach((prop) => {
    newRow[prop] = ''
    newRow[prop + 'Editable'] = true
  })

  // 检查properties中是否有节点顺序nodeOrder字段
  if (properties.value.includes('nodeOrder')) {
    // 计算当前list中nodeOrder的最大值 新增的时候节点顺序加一
    const maxNodeOrder = list.value.reduce(
      (max, item: any) => Math.max(max, item.nodeOrder || 0),
      0
    )
    // 设置nodeOrder为当前最大值加一
    newRow.nodeOrder = maxNodeOrder + 1
  }

  if (properties.value.includes('personInChargeList')) {
    newRow.personInChargeList = []
  }

  // 先请求保存接口，刷新列表后新增的这一条数据就有了唯一id
  await TempleteApi.saveNode({ ...newRow, templateId: route.params.templeteId })
  await getList()
}

const handleCloseDialog = () => {
  addFormRef.value.close()
}

// 参数变化
const handleSearch = (val: any) => {
  form.value = Object.assign({ page: 1, size: form.value.size }, val)
  getList()
}

const handleReset = () => {
  form.value = { page: 1, size: 10 }
  orderParam.value = { prop: '', custorOrder: null }
  getList()
}

const handleEdit = (row: any) => {
  console.log('编辑', row)
  addFormRef.value.open('update', row.id)
}

// 审核配置
const auditConfig = (row: any) => {
  console.log('查看详情', row)
  auditConfigRef.value.open(row, permissionList.value)
}

const handleDel = async (row: any) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  await TempleteApi.deleteNode(row.id)
  message.success('删除成功')
  getList()
}

// 分页变化
const handlePageChange = (val: any) => {
  form.value = { ...form.value, ...val }
  console.log('form', form.value)
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = ({ prop, custorOrder }) => {
  orderParam.value = { prop, custorOrder }
  getList()
}

// 获取配置
const getConfig = async () => {
  // const params = {
  //   code: 'TempleteDetail'
  // }
  // const res = await getBasicAttribute(params)
  configList.value = templateTableColumns || []

  // 对 configList.value 进行排序
  configList.value.sort((a, b) => a.sort - b.sort)

  properties.value = configList.value.map((item) => item.code)
  // console.log('_',  properties.value )
}

const permissionList = ref<any>([])
// 获取人员类型
const getNewGoodsPermissionList = async () => {
  let type = '新品'
  // if (templeteName) {
  //   type = templeteName.replace('模板', '') || '新品'
  // }
  const res = await CommonApi.queryPermissionListByType(type)
  permissionList.value = res || []
  permissionList.value.push({
    id: '4',
    name: '指派'
  })
}

const handleSuccess = () => {
  form.value.page = 1
  getList()
}

// 给每个数据添加可编辑状态
const addEditableAndTempValueProperties = (data) => {
  return data.map((item) => {
    console.log('ie', item)
    const newItem = { ...item }
    properties.value.forEach((prop) => {
      newItem[prop + 'Editable'] =
        item[prop] === '' || item[prop] === null || item[prop]?.length === 0 // 初始状态为可编辑
      newItem[prop + 'OriginalValue'] = item[prop] // 保存原始值,如果后面需要恢复初始值
    })

    return newItem
  })
}

const getList = async () => {
  try {
    loading.value = true
    var formData = new FormData()
    formData.append(
      'queryParam',
      JSON.stringify({
        ...form.value,
        page: undefined,
        size: undefined
      })
    )
    if (orderParam.value.custorOrder) {
      formData.append(
        'orderParam',
        JSON.stringify({
          [orderParam.value.prop]: orderParam.value.custorOrder
        })
      )
    }
    if (route.params.templeteId) {
      formData.append('templateId', route.params.templeteId as string) //在请求参数里加上模版id
    }
    const res = await TempleteApi.nodeList({
      data: formData
    })

    loading.value = false
    list.value = res || []

    list.value = addEditableAndTempValueProperties(list.value)

    console.log('list', list.value)

    list.value.forEach((item: any) => {
      // 处理默认值 - 节点顺序/预警时长/基准时长 要求是正整数，如果为空，则设置为默认值；其他属性如果是空字符串，如果有默认值则设置为默认值
      configList.value.map((config) => {
        if (
          item.hasOwnProperty(config.code) &&
          (item[config.code] === 0 || item[config.code] === '')
        ) {
          if (config.defaultValue) {
            item[config.code] = config.defaultValue
          }
        }
        // 如果是多选，需要将字符串转为数组回显
        if (config.type === 3) {
          item[config.code] =
            item[config.code] && item[config.code].length > 0 ? item[config.code].split(',') : []
        }
      })
    })

    // 单独加载节点所有列表作为下拉
    await getAllCodeNode()

    // 根据节点排序进行排序  根据前置节点 后置节点排序
    list.value = list.value.sort((a: any, b: any) => a.nodeOrder - b.nodeOrder)
    nextTick(() => { })
  } catch (error) {
    loading.value = false
  }
}

const getAllCodeNode = async () => {
  loading.value = true
  var formData = new FormData()
  formData.append(
    'queryParam',
    JSON.stringify({
      ...form.value,
      page: undefined,
      size: undefined
    })
  )
  if (orderParam.value.custorOrder) {
    formData.append(
      'orderParam',
      JSON.stringify({
        [orderParam.value.prop]: orderParam.value.custorOrder
      })
    )
  }
  if (route.params.templeteId) {
    formData.append('templateId', route.params.templeteId as string) //在请求参数里加上模版id
  }
  const res = await TempleteApi.nodeAllList({
    data: formData
  })

  loading.value = false
  listAll.value = res || []

  // 获取节点列表 新增下拉
  templateCodeList.value = listAll.value.map((item: any) => ({
    label: item.nodeName,
    value: item.nodeCode
  }))
}

// 拖动
const handleDrag = async (data: any) => {
  await TempleteApi.dragNodeSort(data.sortedIds)
  message.success('操作成功')
  await getList()
}

const handleDoubleClick = (data: any) => {
  const { row, propertyName } = data
  // 如果是部门名称，需要将数据处理成数组，回显
  if (propertyName === 'depName') {
    // 打开面板的时候，处理回显
    row[propertyName] = row[propertyName].split('/')
  }
}

const handleBlur = async (data: any) => {
  // console.log('失焦', data)
  // 检查是否有必填项为空
  const checkRequiredFields = () => {
    return configList.value.some((config) => {
      if (config.required && data[config.code] === '') {
        message.error(`请填写${config.name}`)
        return true
      }
      return false
    })
  }

  if (checkRequiredFields()) {
    return // 表示有必填项为空，因此不执行提交
  }
  const rowCopy = { ...data }

  // 检查rowCopy中是否有值为数组，如果有，则将转为字符串
  //这里是因为，在修改别的值的时候，如果多选的值为空数组，则会变成'[]'
  Object.keys(rowCopy).forEach((key) => {
    if (Array.isArray(rowCopy[key]) && key !== 'personInChargeList' && key !== 'details') {
      rowCopy[key] = rowCopy[key].length > 0 ? rowCopy[key].join(',') : ''
    }
  })

  // 剔除jsonData属性以及Editable和OriginalValue属性
  const rowWithoutSpecialFields = Object.keys(rowCopy).reduce((acc, key) => {
    if (!key.endsWith('Editable') && !key.endsWith('OriginalValue') && key !== 'jsonData') {
      acc[key] = rowCopy[key]
    }
    return acc
  }, {})
  await TempleteApi.updateNode({
    ...rowWithoutSpecialFields,
    templateId: route.params.templeteId
  })
  message.success('修改成功')
  // 刷新列表
  await getList()
  console.log('刷新了')
}

const initDicList = async () => {
  const params = {
    page: 1,
    size: 1000,
    type: 1
  }
  const res = await getDictDataPage(params)
  dicList.value = res.data || []
}

const nodeCategoryRef = ref()
const handleNodeCategory = (row: any) => {
  nodeCategoryRef?.value?.openView(row)
}

onMounted(async () => {
  await getConfig()
  await getNewGoodsPermissionList()
  await initDicList()
  await getList()
})
</script>

<style lang="scss" scoped>
.templeteName {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
