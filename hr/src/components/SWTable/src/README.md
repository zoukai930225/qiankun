# s-table 组件

s-table 是一个基于 Element Plus 的增强型表格组件，提供数据获取、分页、多选、展开行等功能，简化表格操作。

## 基础用法

```vue
<template>
  <s-table
    :columns="columns"
    :fetch="getList"
    :fetchParams="params"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getList } from '@/api/your-api'

// 列配置
const columns = [
  { type: 'index', label: '序号' },
  { type: 'selection', width: 55 },
  { prop: 'name', label: '姓名', minWidth: '100' },
  { prop: 'age', label: '年龄', width: '80' },
  { prop: 'address', label: '地址', minWidth: '180' }
]

// 请求参数
const params = ref({
  keyword: ''
})

// 多选变化
const handleSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}
</script>
```

## 本地数据

```vue
<template>
  <s-table :columns="columns" :data="tableData" />
</template>

<script setup>
import { ref } from 'vue'

// 列配置
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
]

// 本地数据
const tableData = ref([
  { name: '张三', age: 18 },
  { name: '李四', age: 20 }
])
</script>
```

## 自动加载控制

```vue
<template>
  <div>
    <!-- 禁止自动加载，手动控制 -->
    <el-button @click="loadData">手动加载数据</el-button>
    <s-table ref="tableRef" :columns="columns" :fetch="getList" :autoLoad="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getList } from '@/api/your-api'

const tableRef = ref()

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' }
]

// 手动触发数据加载
const loadData = () => {
  tableRef.value.refresh()
}
</script>
```

## 数据后处理

```vue
<template>
  <s-table :columns="columns" :fetch="getList" :afterFetch="processData" />
</template>

<script setup>
import { ref } from 'vue'
import { getList } from '@/api/your-api'

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'statusText', label: '状态' },
  { prop: 'createTime', label: '创建时间' }
]

// 数据后处理函数
const processData = (records) => {
  return records.map((item) => ({
    ...item,
    // 添加状态文本
    statusText: item.status === 1 ? '启用' : '禁用',
    // 格式化时间
    createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-'
  }))
}
</script>
```

## 自定义列渲染

```vue
<template>
  <s-table :columns="columns">
    <!-- 通过插槽自定义列内容 -->
    <template #operation="{ row }">
      <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
      <el-button type="danger" @click="handleDelete(row)">删除</el-button>
    </template>
  </s-table>
</template>

<script setup>
// 列配置
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'operation', label: '操作', width: '200' }
]

// 操作方法
const handleEdit = (row) => {
  console.log('编辑', row)
}

const handleDelete = (row) => {
  console.log('删除', row)
}
</script>
```

## 使用自定义渲染函数

```vue
<template>
  <s-table :columns="columns" :data="tableData" />
</template>

<script setup lang="tsx">
import { ref } from 'vue'

const tableData = ref([
  { name: '张三', age: 18, status: 1, url: 'https://example.com' },
  { name: '李四', age: 20, status: 0, url: 'https://example.org' }
])

// 列配置
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  {
    prop: 'status',
    label: '状态',
    customRender: ({ row }) => {
      return (
        <div class="custom-link">
          <a href={row.url} target="_blank">
            <div class="link-content">{row.status === 1 ? '正常' : '异常'}</div>
          </a>
        </div>
      )
    }
  }
]
</script>
```

## 表格实例方法

```vue
<template>
  <div>
    <el-button @click="refreshTable">刷新表格</el-button>
    <s-table ref="tableRef" :columns="columns" :fetch="fetchData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// 刷新表格
const refreshTable = () => {
  // 刷新并重置分页
  tableRef.value.refresh(true)

  // 其他可用方法
  // tableRef.value.setLoading(true/false) - 设置加载状态
  // tableRef.value.selections - 获取选中行
  // tableRef.value.setPagination(1, 20) - 设置页码和每页条数
}
</script>
```

## 展开行

```vue
<template>
  <s-table :columns="columns" :data="tableData" :expand="true">
    <template #expand="{ row }">
      <div>
        <p>详细信息:</p>
        <p>创建时间: {{ row.createTime }}</p>
        <p>备注: {{ row.remark }}</p>
      </div>
    </template>
  </s-table>
</template>
```

## Props 参数

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selection | 是否显示多选列 | Boolean | false |
| showOverflowTooltip | 是否所有的超出隐藏，优先级低于column中的showOverflowTooltip | Boolean | true |
| showPagination | 是否显示分页 | Boolean | true |
| paginationOptions | 分页器配置项 | Object | {} |
| paginationMap | 分页参数名称映射 | Object | { pageNum: 'page', pageSize: 'size' } |
| initialPage | 初始页码 | Number | 1 |
| initialPageSize | 初始每页条数 | Number | 10 |
| columns | 表格列配置 | Array | [] |
| expand | 是否显示展开行 | Boolean | false |
| fetch | 数据获取函数 | Function | - |
| fetchParams | 数据获取参数 | Object | {} |
| data | 直接传入的表格数据 | Array | [] |
| reserveSelection | 多选是否保留选中数据（需指定 row-key） | Boolean | false |
| reserveIndex | 是否叠加索引 | Boolean | false |
| align | 表格内容对齐方式 | String | 'center' |
| headerAlign | 表头对齐方式 | String | 'center' |
| showLoading | 是否显示加载状态 | Boolean | false |
| autoLoad | 是否自动加载数据（组件挂载时是否自动调用fetch） | Boolean | true |
| afterFetch | 数据获取后的处理函数，用于对获取到的数据进行自定义处理 | Function | - |

## Events 事件

| 事件名            | 说明                       | 参数                        |
| ----------------- | -------------------------- | --------------------------- |
| register          | 表格注册事件，返回表格实例 | (tableParent, tableRef)     |
| selection-change  | 多选变化事件               | (selection)                 |
| pagination-change | 分页变化事件               | ({ page, pageSize, total }) |

### Element Plus 原生事件支持

组件支持所有 Element Plus Table 原生事件，可直接使用：

```vue
<template>
  <s-table
    :columns="columns"
    :data="tableData"
    :onRowClick="handleRowClick"
    :onSortChange="handleSortChange"
    :onHeaderClick="handleHeaderClick"
    <!-- 其他任意 Element Plus Table 事件 -->
  />
</template>

<script setup>
const handleRowClick = (row, column, event) => {
  console.log('行点击事件', row, column, event)
}

const handleSortChange = (params) => {
  console.log('排序变化', params)
}

const handleHeaderClick = (column, event) => {
  console.log('表头点击', column, event)
}
</script>
```

实现原理是通过以下代码将所有以"on"开头的属性（事件监听器）传递给 Element Plus 的 ElTable 组件：

```js
{...Object.fromEntries(
  Object.entries(attrs).filter(([key]) => key.startsWith('on'))
)}
```

注意：需要使用`:on前缀事件名`的形式（而不是`@事件名`）来监听事件，因为当前实现是基于属性名筛选的。

## Column 列配置参数

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 列字段名 | String | - |
| label | 列标题 | String | - |
| width | 列宽度 | String/Number | - |
| minWidth | 列最小宽度 | String/Number | - |
| fixed | 列是否固定 | String/Boolean | - |
| type | 列类型，可选值: 'index', 'selection' | String | - |
| customRender | 自定义渲染函数 | Function({ row, column, index, value }) | - |
| children | 子列 | Array | - |
| showOverflowTooltip | 当内容过长被隐藏时显示 tooltip | Boolean | - |
| align | 列的对齐方式 | String | - |
| headerAlign | 表头对齐方式 | String | - |

## 提供的插槽

| 插槽名        | 说明             | 参数                    |
| ------------- | ---------------- | ----------------------- |
| [prop]        | 对应列的内容插槽 | { row, column, $index } |
| [prop]-header | 对应列的表头插槽 | -                       |
| expand        | 展开行内容插槽   | { row, column, $index } |
| append        | 表格尾部插槽     | -                       |

## 暴露的方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| setProps | 设置表格属性 | (props: TableProps) |
| setColumn | 设置列属性 | (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) |
| refresh | 刷新表格数据 | (resetPagination: boolean = false) |
| setLoading | 设置加载状态 | (value: boolean) |
| getPagination | 获取分页信息 | () |
| setPagination | 设置分页信息 | (page: number, pageSize: number) |
