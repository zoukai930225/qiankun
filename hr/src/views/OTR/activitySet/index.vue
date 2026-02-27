<template>
  <div class="activitySet">
    <ContentWrap class="wrap">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            label-width="60px"
            @submit.prevent
            label-position="left"
          >
            <el-form-item label="关键词" prop="keyWords">
              <el-input
                v-model="queryParams.keyWords"
                clearable
                placeholder="名称或者内容关键词匹配"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn"
            ><Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />搜索</el-button
          >
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0"
            >重置</el-button
          >
        </div>
        <div class="commonTopFilterWrap-search">
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>

      <div class="boxbody" v-loading="loading">
        <!-- 初始化 -->
        <div class="boxCard">
          <div class="init-button">
            <div class="init-button-text">{{ '初始化 · ' + initNumber }}</div>
          </div>
          <el-scrollbar height="700px" v-if="list1.length >= 1">
            <div style="padding-bottom: 10px">
              <InitCard
                v-for="item in list1"
                :key="item.id"
                :item="item"
                @click="openForm('update', item.id)"
                @delete-item="handleDelete"
                @function-click-item="functionClick"
              />
            </div>
          </el-scrollbar>
          <div v-else class="empty">
            <img src="@/assets/imgs/otr/schemeSet/empty1.png" alt="" />
            <div>暂无内容</div>
          </div>
        </div>
        <!-- 评价中 -->
        <div class="boxCard boxCard2">
          <div class="init-button">
            <div class="init-button-text">{{ '评价中 · ' + evaluateNumber }}</div>
          </div>
          <el-scrollbar height="700px" v-if="list2.length >= 1">
            <div style="padding-bottom: 10px">
              <InitCard
                v-for="item in list2"
                :key="item.id"
                :item="item"
                @click="openForm('view', item.id)"
                @delete-item="handleDelete"
                @function-click-item="functionClick"
              />
            </div>
          </el-scrollbar>
          <div v-else class="empty">
            <img src="@/assets/imgs/otr/schemeSet/empty2.png" alt="" />
            <div>暂无内容</div>
          </div>
        </div>
        <!-- 问卷关闭 -->
        <div class="boxCard boxCard3">
          <div class="init-button">
            <div class="init-button-text">{{ '预校准 · ' + closeNumber }}</div>
          </div>
          <el-scrollbar height="700px" v-if="list3.length >= 1">
            <div style="padding-bottom: 10px">
              <InitCard
                v-for="item in list3"
                :key="item.id"
                :item="item"
                @click="openForm('view', item.id)"
                @delete-item="handleDelete"
                @function-click-item="functionClick"
              />
            </div>
          </el-scrollbar>
          <div v-else class="empty">
            <img src="@/assets/imgs/otr/schemeSet/empty3.png" alt="" />
            <div>暂无内容</div>
          </div>
        </div>
        <!-- 校准中 -->
        <div class="boxCard boxCard4">
          <div class="init-button">
            <div class="init-button-text">{{ '校准中 · ' + calibrateNumber }}</div>
          </div>
          <el-scrollbar height="700px" v-if="list4.length >= 1">
            <div style="padding-bottom: 10px">
              <InitCard
                v-for="item in list4"
                :key="item.id"
                :item="item"
                @click="openForm('view', item.id)"
                @delete-item="handleDelete"
                @function-click-item="functionClick"
              />
            </div>
          </el-scrollbar>
          <div v-else class="empty">
            <img src="@/assets/imgs/otr/schemeSet/empty4.png" alt="" />
            <div>暂无内容</div>
          </div>
        </div>
        <!-- 活动结束 -->
        <div class="boxCard boxCard5">
          <div class="init-button">
            <div class="init-button-text">{{ '活动结束 · ' + overNumber }}</div>
          </div>
          <el-scrollbar height="700px" v-if="list5.length >= 1">
            <div style="padding-bottom: 10px">
              <InitCard
                v-for="item in list5"
                :key="item.id"
                :item="item"
                @click="openForm('view', item.id)"
                @delete-item="handleDelete"
                @function-click-item="functionClick"
              />
            </div>
          </el-scrollbar>
          <div v-else class="empty">
            <img src="@/assets/imgs/otr/schemeSet/empty5.png" alt="" />
            <div>暂无内容</div>
          </div>
        </div>
      </div>
    </ContentWrap>
    <NineGridForm ref="nineGridFormRef" @success="getList" :showConfirm="showConfirm" />
    <AddForm ref="formRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ActivitySet' })
import anime from 'animejs'
import AddForm from './components/AddForm.vue'
import NineGridForm from './components/NineGridForm.vue'
import * as activitySetApi from '@/api/otr/activitySet'
import { useDepartmentStoreWithOut } from '@/store/modules/dept'
import InitCard from './components/initCard.vue'
// import EvaluateCard from './components/evaluateCard.vue'
// import CloseCard from './components/closeCard.vue'
// import CalibrateCard from './components/calibrateCard.vue'
// import OverCard from './components/overCard.vue'

const departmentStore = useDepartmentStoreWithOut()
const router = useRouter() // 路由对象
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const addList = ref([
  {
    label: '新增活动',
    code: 'add'
  }
])

const initNumber = ref(0)
const evaluateNumber = ref(0)
const closeNumber = ref(0)
const calibrateNumber = ref(0)
const overNumber = ref(0)

// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create')
    }
  }
}

// 查询参数
const queryParams = ref({
  keyWords: ''
})

const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.keyWords = ''
  handleQuery()
}

let functionRefList = ref<HTMLElement[]>([])
const getfunctionRef = (el: any) => {
  if (el) {
    functionRefList.value.push(el)
  }
}

const showConfirm = ref(false) //是否展示确定按钮

const functionClick = async (value, id) => {
  goDetail(id)
}

const goDetail = (id) => {
  router.push({
    name: `QuestionnaireSetList`,
    query: { inventoryId: id }
  })
}

// 查询列表
// 给boardList里面的每个对象声明数据类型
interface IBoardItem {
  id: string
  actName: string //活动名称
  inventoryPlan: string //盘点方案
  actYear: string //所属年度
  beginTime: string //活动开始时间
  endTime: string //活动结束时间
  inventoryPerson: string //盘点人数
  status: number //状态 1 初始化 2 评价中 3 问卷关闭 4 校准中 5 活动结束
}

const boardList = ref<IBoardItem[]>([])
const list1 = ref<IBoardItem[]>([])
const list2 = ref<IBoardItem[]>([])
const list3 = ref<IBoardItem[]>([])
const list4 = ref<IBoardItem[]>([])
const list5 = ref<IBoardItem[]>([])
const loading = ref(false)

const getList = async () => {
  console.log('被触发')
  loading.value = true
  try {
    const data = await activitySetApi.getDataList(queryParams.value).catch(() => {})
    if (data) {
      // 重组数据
      const arr = data.map((item) => {
        return {
          ...item
        }
      })
      boardList.value = arr || []
      list1.value = arr.filter((item) => item.status === 1)
      initNumber.value = list1.value.length
      list2.value = arr.filter((item) => item.status === 2)
      evaluateNumber.value = list2.value.length
      list3.value = arr.filter((item) => item.status === 3)
      closeNumber.value = list3.value.length
      list4.value = arr.filter((item) => item.status === 4)
      calibrateNumber.value = list4.value.length
      list5.value = arr.filter((item) => item.status === 5)
      overNumber.value = list5.value.length
      // console.log(boardList.value, 'functionList')
    }
  } finally {
    loading.value = false
  }
}

/** 新增活动 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (item: any) => {
  if (item.status !== 1) {
    return message.error('只有初始化状态的活动才能删除')
  }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await activitySetApi.deleteData(item.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
  // 获取人员列表
  if (!departmentStore.isDesignerListLoaded) {
    departmentStore.getDesignerList()
  }
  // 获取部门数据
  if (!departmentStore.isDepartmentDataLoaded) {
    departmentStore.getDepartmentDataAction()
  }
})

// 鼠标移入
const handleMouseOver = (index, index1, item) => {
  shakeMake(index, index1, item)
}

const shakeMake = (index, index1, item) => {
  if (index * item.functionList?.length + index1 < functionRefList.value?.length) {
    const el = functionRefList.value[index * item.functionList?.length + index1]
    anime({
      targets: el,
      translateX: [
        { value: -10, duration: 300 },
        { value: 10, duration: 300 },
        { value: 0, duration: 300 }
      ],
      easing: 'easeInOutSine',
      loop: false
    })
  }
}
</script>

<style lang="scss" scoped>
.activitySet {
  font-size: 14px;
  color: #666;
  padding-top: 10px;
  margin: 0 20px;
  .wrap {
    :deep(.el-card__body){
      overflow: hidden;
    }
    
    .commonTopFilterWrap {
      height: 34px;
      padding: 10px 0;
      width: 100%;
      margin-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    .boxbody {
      display: flex;
      justify-content: space-between;
      .boxCard {
        width: 353px;
        height: 810px;
        background: #f5f6f5;
        border-radius: 10px;
        border: 1px solid rgba(169, 201, 174, 0.34);
        .init-button {
          width: 108px;
          height: 40px;
          background: #e0ece2;
          border-radius: 4px;
          margin-top: 20px;
          margin-left: 20px;
          margin-bottom: 20px;
        }
        .init-button-text {
          font-family:
            PingFangSC,
            PingFang SC;
          font-weight: 700;
          font-size: 14px;
          line-height: 40px;
          font-style: normal;
          text-align: center;
          color: #0a6916;
        }

        &.boxCard2 {
          background: #f6fbff;
          border: 1px solid rgba(168, 197, 242, 0.3549);
          .init-button {
            background: #e0edfe;
          }
          .init-button-text {
            color: #0164ff;
          }
        }
        &.boxCard3 {
          background: #fffaf1;
          border: 1px solid rgba(217, 188, 157, 0.3243);
          .init-button {
            background: #f9eddb;
          }
          .init-button-text {
            color: #955217;
          }
        }
        &.boxCard4 {
          background: #eff2ff;
          border: 1px solid rgba(157, 167, 214, 0.2689);
          .init-button {
            background: #dce1f9;
          }
          .init-button-text {
            color: #3f53ac;
          }
        }
        &.boxCard5 {
          background: #f0f0f0;
          border: 1px solid rgba(200, 200, 200, 0.36);
          .init-button {
            background: #e3e3e3;
          }
          .init-button-text {
            color: #666;
          }
        }

        .empty {
          text-align: center;
          margin: auto;
          height: 100%;
          padding-top: 180px;
          img {
            width: 254px;
            height: 221px;
          }
          div {
            color: #aaacb5;
          }
        }
      }
    }
  }
}
</style>
