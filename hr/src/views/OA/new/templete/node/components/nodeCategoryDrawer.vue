<template>
  <scheme-details ref="detailsRef" name="OaNewTempleteNodeCategory" :width="800">
    <template #card>
      <div class="dialog-content" style="margin-bottom: 20px">
        <!-- <ContentWrap> -->
        <div class="form-wapper">
          <div class="flex-row header-wapper">
            <div class="icon"></div>
            <span>所属节点：{{ dataValue.nodeName || '-' }}</span>
          </div>
          <el-button
            type="primary"
            @click="viewDetails('add', { nodeId: dataValue.id, nodeCode: dataValue.nodeCode })"
            >新增</el-button
          >
        </div>
        <!-- </ContentWrap> -->
        <div class="list-content">
          <query-scheme
            :scheme="scheme"
            v-model="searchData"
            name="OaNewTempleteNodeCategoryDetailsTable"
            :show-expand="false"
            :show-divider="false"
            no-reset
          />

          <scheme-table
            :handle-column="handleColumn"
            :show-screen="false"
            name="OaNewTempleteNodeCategoryDetailsTable"
            :column="column"
            :table-data="dataList"
            sort-remote
          />

          <node-category-details ref="nodeDetailsRef"></node-category-details>
        </div>
      </div>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'OaNewTempleteNodeCategoryDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType, PageItem, BtnItem } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
// import { DataItem } from "../page/config";
import { usePage, SearchItem, CategoryItem } from '../config/config'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import NodeCategoryDetails from '../details/index.vue'
import request from '@/config/axios'
const message = useMessage(),
  configList = ref<Array<any>>([])
class DataItem {
  id: string = ''
  nodeName: string = ''
  nodeCode: string = ''
}
class formItem {
  category: string = ''
}
const categoryTree: Ref<CategoryItem[]> = ref([])
// const { onSearch } = inject(`OaNewTempleteForm`) as FromProvideType;
const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  // loading = ref<boolean>(false),
  form = ref({ ...new formItem() }),
  nodeDetailsRef = ref()
// dataList = ref([]),
// column= ref([])
const unitDic = getIntDictOptions(DICT_TYPE.OA_DURATION_UNIT, true)
const {
  dataList,
  page,
  loading,
  scheme,
  btns,
  searchData,
  column,
  screen,
  stateInfo,
  statistics,
  handleColumn,
  setRouterInfo
} = usePage({ categoryTree: toRef(categoryTree, 'value'), unitDic })

const title = ref('细分品类')

const formRules = computed(() => {
  const rules: any = {}
  configList.value.forEach((field) => {
    const type = field.code
    rules[type] = [{ required: true, message: `${field.name}不能为空`, trigger: 'blur' }]
  })
  return rules
})

// const getConfig = async () => {
//   const res = await request.get({ url: `/basicAttribute/queryByCode?code=OaNewTemplete` })
//   configList.value = res || []
//   configList.value.sort((a, b) => a.sort - b.sort)
// };

const getCategoryTree = async () => {
  categoryTree.value = await request.get({ url: `/api/sysCategory/queryCategoryTree` })
}

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(
    async () => {
      resetForm()
      await getCategoryTree()
      dataValue.value = { ...new DataItem(), ...item }
      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      onSearch()
      bukValue.value = cloneDeep({ ...dataValue.value })
      viewType.value = type
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  valid && submit()
}

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true
  // request.post({ url: `/api/np/progress/${!dataValue.value?.id ? 'save' : 'update'}`, data: dataValue.value }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 500)

const getRules = (field) => {
  const type = field.code
  return formRules.value[type] || []
}

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() }
  searchData.value = { ...new SearchItem() }
  // onSearch();
}

// 按钮回调
const onButtonClick = (btn: BtnItem) => {}

// 自定义触发
const customTrigger = (scope: any, col: any) => {
  // router.push({ name: 'TempleteNode', params: { templeteId: scope.row.id }, query: { templeteName: scope.row.templateName } });
}

// 自定义排序
const customSort = (item: any) => {
  // sortValue.value = item;
  page.value = { ...new PageItem() }
  // onSearch();
}

// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  // // 删除
  if (type === 'delete') {
    await message.delConfirm('是否确定删除？')
    const { id } = item
    await request.get({ url: `/api/np/node/category/delete/${id}`})
    message.success('删除成功')
    onSearch();
    return
  }
  ;['edit', 'add'].includes(type) && nodeDetailsRef?.value?.openView(item, type)
  // ['link'].includes(type) && router.push({ name: 'TempleteNode', params: { templeteId: item.id }, query: { templeteName: item.templateName } });
  // ['delete'].includes(type) && delItem(item.id);
}

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const query = { ...searchData.value }
  if (query.categoryCode && query.categoryCode.length > 0) {
    query.categoryCode = query.categoryCode[query.categoryCode.length - 1]
  } else {
    query.categoryCode = ''
  }
  return { ...query, nodeId: dataValue.value.id, page: page.value.page, size: page.value.size }
}

// 查询
const onSearch = () => {
  const params: any = setParamsData()
  // const order: any = setSortData();
  loading.value = true
  request
    .post({
      url: `/api/np/node/category/pageList`,
      data: params
    })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
    })
    .finally(() => {
      loading.value = false
    })
}

defineExpose({ openView })

provide('OaNewTempleteNodeCategoryDetails', { dataValue, bukValue, viewType, title })

provide('OaNewTempleteNodeCategoryDetailsTableForm', {
  searchData,
  dataList,
  page,
  loading,
  stateInfo,
  statistics,
  setParamsData,
  customTrigger,
  customSort,
  resetForm,
  onSearch,
  onButtonClick,
  viewDetails,
  categoryTree,
  unitDic
})
</script>

<style lang="scss" scoped>
.form-wapper {
  // width: calc(100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;

  .header-wapper {
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.list-content {
  padding: 20px;
}

:deep() {
  .card_info {
    .el-card__body {
      padding: 0 !important;
    }
  }
}
</style>
