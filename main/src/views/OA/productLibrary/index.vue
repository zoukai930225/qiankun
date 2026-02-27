<template>
  <div class="main-content">
    <div class="title-content">
      <div class="main-title">全域产品检索中心</div>
      <div class="tip">输入产品名称、货品编码进行快速查找</div>
    </div>
    <div class="search-content">
      <el-input
        ref="inputRef"
        v-model="searchValue"
        placeholder="请输入货品编码"
        style="width: 770px; margin-bottom: 10px"
        prefix-icon="Search"
        @keydown.enter="getList"
      >
        <template #suffix>
          <el-button type="primary" @click.stop="getList">搜索</el-button>
        </template>
      </el-input>
    </div>
    <div
      class="card-content"
      v-loading="loading"
      :class="list && list.length > 0 ? 'show-padding' : ''"
    >
      <card-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @detail="gotoDetail"
      ></card-item>
    </div>
    <div class="pagination-wrapper">
      <s-pagination
        v-model:page="page.page"
        v-model:limit="page.size"
        :total="total"
        @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SPagination from '@/components/SWTable/src/SPagination.vue'
import request from '@/config/axios'
import CardItem from './component/cardItem.vue'
const router = useRouter()
const activeTag = ref('all')
const tags = ref([
  { label: '全部', key: 'all' },
  { label: '产品库', key: 'cpk' },
  { label: '包装库', key: 'bzk' },
  { label: '工厂二开', key: 'gcek' }
])
const searchValue = ref(''),
  loading = ref(false),
  inputRef = ref()

const changeTag = (item: any) => {
  activeTag.value = item?.key
  getList()
}

const list = ref([])
const total = ref(0)
class PageItem {
  page: number = 1
  size: number = 20
}
const page = ref({ ...new PageItem() })
const getList = async () => {
  nextTick(() => {
    inputRef.value.blur()
  })
  try {
    const data = {
      queryParam: searchValue.value,
      ...page.value
    }
    loading.value = true
    const res = await request.post({ url: '/api/pr/repository/homePageList', data })
    list.value = res?.records?.length ? res.records : []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

const handlePagination = ({ page: current, limit }: { page: number; limit: number }) => {
  if (typeof current === 'number') {
    page.value.page = current
  }
  if (typeof limit === 'number') {
    page.value.size = limit
  }
  getList()
}

const gotoDetail = (item: any) => {
  router.push({
    path: `/admin/oa/PRD/productLibrary/detail/${item.goodsId}`
  })
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.main-content {
  .title-content {
    text-align: center;
    padding-top: 60px;
    padding-bottom: 16px;
    .main-title {
      font-size: 28px;
      font-weight: 500;
      color: #333333;
      margin-bottom: 10px;
    }
    .tip {
      font-size: 14px;
      color: #666666;
    }
  }
  .search-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    :deep() {
      .el-input__wrapper {
        height: auto;
        border-radius: 100px;
        box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.05);
        .el-input__prefix {
          padding: 0 6px 0 9px;
        }
        .el-input__inner {
          height: 42px;
          line-height: 42px;
        }
      }

      .el-button--primary {
        border-radius: 100px;
        height: 30px;
        line-height: 30px;
      }
    }
  }

  .tag-content {
    display: flex;
    align-items: center;
    padding: 10px 0;
    .tag {
      padding: 5px 16px;
      border-radius: 100px;
      background: #ffffff;
      box-sizing: border-box;
      border: 1px solid #e5e5e5;
      color: #666666;
      font-size: 14px;
      cursor: pointer;
      margin-right: 20px;
      &.active {
        background: rgba(0, 100, 255, 0.1);
        color: #0064ff;
        border: 1px solid rgba(0, 100, 255, 0.1);
      }
      &:hover {
        border: 1px solid #0064ff;
        color: #0064ff;
      }
      &:last-child {
        margin: 0;
      }
    }
  }

  .card-content {
    margin-top: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    &.show-padding {
      padding: 0px 19.5px 19.5px 19.5px;
    }
  }

  .pagination-wrapper {
    // margin-top: 16px;
    padding: 0 30px 20px 30px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
