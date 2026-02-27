<template>
  <s-w-drawer :modelValue="useUserMessageStore.getVisible" :showBottom="false" @closed="closeDrawer" :width="490">
    <template #header>
      <div class="flex-row">
        <div class="message-drawer-header-title">{{ showDetail ? '详情' : '消息' }}<span v-show="!showDetail"></span>({{
          useUserMessageStore.socketStatus ? '在线' : "离线" }})</div>
        <div class="flex-row" style="margin-left: 14px;cursor: pointer;" v-if="!showDetail" @click="clearAll">
          <el-image class="message-drawer-header-icon" :src="clearIcon" fit="fill" />
          <div class="message-drawer-header-cleartitle">清除未读</div>
        </div>
        <div class="flex-row" style="margin-left: 14px;cursor: pointer;" v-if="!showDetail" @click="reLinkSw">
          <el-icon>
            <Link />
          </el-icon>
          <div class="message-drawer-header-cleartitle">重连</div>
        </div>
      </div>
    </template>
    <div class="message-drawer-body" v-loading="loading">
      <!--- 列表 --->
      <template v-if="!showDetail">
        <div class="flex-top-tabs">
          <div class="tabs-left"></div>
          <el-tabs v-model="activeName" class="demo-tabs" stretch>
            <el-tab-pane label="待处理" name="wait">
              <template #label>
                <el-badge :value="useUserMessageStore.getCount" :max="99" :show-zero="false" color="#EB3737"
                  :offset="[4, 2]">
                  <span style="font-size: 16px;">待处理</span>
                </el-badge>
              </template>
            </el-tab-pane>
            <el-tab-pane label="已处理" name="done">
              <template #label><span style="font-size: 16px;">已处理</span></template>
            </el-tab-pane>
          </el-tabs>
          <div class="tabs-right"></div>
        </div>
        <div class="card-body">
          <div class="card" v-for="(item, index) in dataList" :class="[{ 'card-top': index === 0 }]"
            :id="`card${index}`">
            <el-image class="card-icon" :src="notifyIcon" fit="fill" />
            <div class="card-right">
              <div class="flex-between" @click="toDetail(item)" style="cursor: pointer;">
                <div class="card-title card-titlemain text1">{{ getDictLabel(DICT_TYPE.MESSAGE_NOTICE_TYPE,
                  item.noticeType) }}
                </div>
                <el-icon :size="14" color="#666666" style="cursor: pointer;">
                  <ArrowRight />
                </el-icon>
              </div>
              <div class="card-title text1 card-titlecontent">{{ item.messageTheme }}</div>
              <div class="card-summary" @click="toDetail(item)" style="cursor: pointer;">
                {{ item.messageBriefContent }}
              </div>
              <div class="card-bottom flex-between">
                <div class="card-bottom-time">{{ item.showTime }}</div>
                <el-button type="primary" v-if="!!item.jumpLink" @click="toList(item)">跳转<el-icon :size="14"
                    color="#fff" style="margin-left: 4px;">
                    <ArrowRight />
                  </el-icon></el-button>
              </div>
            </div>
          </div>
          <template v-if="!loading">
            <div class="info-box" style="color: #0064FF;cursor: pointer;" v-if="dataList.length < total"
              @click="lookMore">— 查看更多 —</div>
            <div class="info-box" style="color: #999999;" v-else-if="activeName === 'wait'">— 没有更多 —</div>
            <div class="info-box" style="color: #999999;" v-else>— 仅保留三个月内消息 —</div>
          </template>
        </div>
      </template>
      <!-- 详情--->
      <div v-else class="detail-card">
        <div class="flex-row detail-top" @click="back">
          <el-icon :size="12" color="#333333" style="cursor: pointer;">
            <ArrowLeft />
          </el-icon>
          <div style="cursor: pointer;margin-left: 4px;">返回</div>
        </div>
        <div class="card-title text1 card-titlecontent">{{ detail.messageTheme }}</div>
        <div class="detail-card-body">
          <div v-html="detail.messageMainBody"></div>
        </div>
        <div class="flex-end">
          <el-button type="primary" v-if="!!detail.jumpLink" @click="toList(detail)">跳转<el-icon :size="14" color="#fff"
              style="margin-left: 4px;">
              <ArrowRight />
            </el-icon></el-button>
        </div>
      </div>
    </div>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import { userMessageStore } from '@/store/modules/userMessage'
const useUserMessageStore = userMessageStore()
import clearIcon from '@/assets/imgs/home/clear.svg'
import notifyIcon from '@/assets/imgs/home/notify.svg'
import { clearUnread, getMessageList, updateMessage, getMessageDetail } from '@/api/system/notice/index'
import { debounce } from 'lodash-es'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import dayjs from 'dayjs'
import { formatPast } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore()
const router = useRouter() // 路由对象
const message = useMessage()
import { cloneDeep } from 'lodash-es'
const closeDrawer = () => {
  useUserMessageStore.closeVisible()
  reset()
}
const dataList = ref<any[]>([])
const activeName = ref<string>()
const showDetail = ref(false)
const loading = ref(false);
const clearLoading = ref(false)
const total = ref(0)
const queryParams = ref<any>({
  page: 1,
  size: 5
})

const detail = ref<any>()
//清除全部未读
const clearAll = async () => {
  try {
    if (clearLoading.value) {
      message.info('正在清除未读消息中，请稍后...')
      return
    }
    clearLoading.value = true
    loading.value = true
    await clearUnread()
    loading.value = false
    if (activeName.value === 'wait') {
      activeName.value = 'done'
    } else {
      queryParams.value.page = 1;
      await getList()
    }
    message.success('清除未读消息成功')
    useUserMessageStore.getMessageCount()

  } catch (err) {

  } finally {
    clearLoading.value = false
    loading.value = false
  }
}
//查看详情
const toDetail = async (item: any) => {
  try {
    const res = await getMessageDetail(item.id)
    if (res.isHandle === null || Number(res.isHandle) === 0) {
      readSingle(item.id)
    }
    detail.value = res
    showDetail.value = true
  } catch (err) {

  }
}

const route = useRoute()
//跳转到对应页面
const toList = async (item: any) => {
  try {
    const url = item.jumpLink
    //处理query
    // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
    const questionMarkIndex = url.indexOf('?')
    let basePath = url
    const paramsObject: { [key: string]: string } = {}

    // 如果找到了问号，说明有查询参数
    if (questionMarkIndex !== -1) {
      // 获取 basePath
      basePath = url.substring(0, questionMarkIndex)

      // 从 URL 中获取查询字符串部分
      const queryString = url.substring(questionMarkIndex + 1)

      // 使用 URLSearchParams 遍历参数
      const searchParams = new URLSearchParams(queryString)
      searchParams.forEach((value, key) => {
        // 封装进 paramsObject 对象
        paramsObject[key] = value
      })
    }
    if (item.isHandle === null || Number(item.isHandle) === 0) {
      await readSingle(item.id)
    }
    router.push({ 
      path: basePath, query: { 
        ...paramsObject, 
        // 拼接信息类型，方便识别任务状态
        infoType: activeName.value === 'wait' ? 0 : 1
      } 
    })
    closeDrawer()

    // 跳转目标与是当前页面时仍然触发跳转，可以激活当前页面的mount和active事件
    if (route.path === basePath) {
      router.push({ path: basePath, query: { ...paramsObject, key: Date.now() } })
    }
  } catch (err) {

  }

}
const reset = () => {
  showDetail.value = false
  activeName.value = ''
  dataList.value = []
  loading.value = false
  clearLoading.value = false
  total.value = 0;
  queryParams.value = {
    page: 1,
    size: 5
  }
  detail.value = null
}

const getList = async () => {
  try {
    if (loading.value) return
    loading.value = true;
    //isHandle-是否处理(0-否,1-是)
    queryParams.value.isHandle = activeName.value === 'done' ? 1 : 0;
    const params = cloneDeep(queryParams.value)
    if (useUserMessageStore.drawerParams) {
      params.size = useUserMessageStore.drawerParams.size
    }
    const res = await getMessageList(params)
    total.value = res.total || 0;
    if (res && res.records && Array.isArray(res.records)) {
      res.records.map(item => {
        if (dayjs().subtract(1, 'day').isAfter(dayjs(item.createdAt))) {
          item.showTime = item.createdAt
        } else {
          item.showTime = formatPast(item.createdAt)
        }
      })
    }
    if (queryParams.value.page === 1) {
      dataList.value = res && res.records && Array.isArray(res.records) ? res.records : []
      nextTick(() => {
        document.getElementById(`card${0}`)?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
      })
    } else {
      dataList.value = res && res.records && Array.isArray(res.records) ? [...dataList.value, ...res.records] : dataList.value
    }

    if (useUserMessageStore.drawerParams) {
      toDetail(dataList.value.find(item => item.id === useUserMessageStore.drawerParams.id))
      useUserMessageStore.upDateDrawerParams(null)
    }

  } catch (err) {

  } finally {
    loading.value = false
  }

}

const lookMore = debounce(async () => {
  queryParams.value.page = queryParams.value.page + 1;
  await getList()
}, 500)

//读单条消息
const readSingle = async (id: any) => {
  try {
    await updateMessage({
      id, isHandle: 1
    })
    await useUserMessageStore.getMessageCount()
  } catch (err) { }
}
const back = () => {
  showDetail.value = false
  nextTick(() => {
    detail.value = null
  })
  getList()
}


const reLinkSw = () => {
  userStore.initMessageSocket()
}

watch(() => useUserMessageStore.getTabActiveName, (val) => {
  activeName.value = val
}, { immediate: true })

watch(activeName, () => {
  if (!useUserMessageStore.getVisible) return
  detail.value = null
  showDetail.value = false
  queryParams.value.page = 1
  getList()
}, { immediate: true })


</script>
<style lang="scss" scoped>
@mixin flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.message-drawer {
  padding: 0 !important;

  &-header {

    &-title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }

    &-icon {
      width: 16px;
      height: 16px
    }

    &-cleartitle {
      font-family: PingFang SC;
      font-size: 14px;
      color: #666666;
      margin-left: 4px;
    }

    &-close {
      cursor: pointer;

      &:hover {
        color: #0064FF
      }
    }
  }

  &-body {
    height: calc(100vh - 100px);
    width: 100%;
    border-radius: 8px;
    background-color: #FFFFFF;

    .card {
      @include flex-row;
      align-items: flex-start;
      width: calc(100% - 40px);
      margin: 0 20px;
      padding: 16px 0;
      border-bottom: 1px solid #D8D8D8;

      &-top {
        padding-top: 2px;
      }

      &-icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }

      &-right {
        width: calc(100% - 34px);
      }

      &-title {
        font-size: 16px;
        color: #333333;
      }

      &-titlemain {
        max-width: calc(100% - 20px);
        height: 24px;
        line-height: 24px;
      }

      &-titlecontent {
        max-width: 100%;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      &-summary {
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        height: 132px;
      }

      &-bottom {
        margin-top: 14px;

        &-time {
          color: #999999;
          font-size: 14px;
        }
      }
    }

    .card-body {
      height: calc(100vh - 160px);
      overflow-y: auto
    }

    .detail-top {
      padding-bottom: 16px;
      font-size: 14px;
      color: #333333;
      width: auto;
    }

    .detail-card {
      padding: 20px;

      &-body {
        height: calc(100vh - 250px);
      }
    }
  }


}

.flex-row {
  @include flex-row;
}

.flex-top-tabs {
  @include flex-row;
  align-items: flex-start;
  padding-top: 6px;
}

.tabs-left,
.tabs-right {
  height: 38px;
  width: 20px;
  border-bottom: 2px solid #e4e7ed;
}

.tabs-right {
  width: calc(100% - 144px);
}

.flex-between {
  @include flex-row;
  justify-content: space-between;
}

.info-box {
  width: 100%;
  font-size: 16px;
  line-height: 22px;
  padding: 30px 0;
  width: 100%;
  text-align: center;
}

.flex-end {
  @include flex-row;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>