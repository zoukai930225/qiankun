<!--
 * @Date: 2024-09-13 15:25:17
批量操作页面组件
-->
<template>
  <div class="tabs-table-wapper">
    <div class="tabs-top">
      <div class="item" :class="{ active: currentSubType == item?.value }" v-for="item in subNodeList"
        :key="item?.value" @click="handleSubChange(item)">{{ item?.label }}
      </div>
    </div>
    <div class="table-content">
      <div class="change-wapper">
        <div class="item-title">操作类型：</div>
        <div class="item" :class="{ active: currentType == index }" @click="typaChange(index)"
          v-for="(item, index) in typeList" :key="item.value"><img class="btn-icon" v-if="currentType != index"
            :src="item.img" /><img class="btn-icon" v-if="currentType == index" :src="item.activeImg" />
          <img class="selected-type" v-if="currentType == index" src="@/assets/imgs/team/selectedType.png" />
          <span class="btn-text">{{ item?.label }}</span>
        </div>
      </div>

      <el-form :model="addForm" label-width="auto" label-position="left" ref="formRef">
        <!-- 跳过 -->
        <div class="content-wapper form-item">
          <div class="empty" v-if="!isTemporary && currentType == 0">
            <img src="@/assets/imgs/team/empty-img.png" class="empty-img" alt="" />
            <span class="empty-text">暂无数据</span>
          </div>
        </div>

        <!-- 任务指派 -->
        <div v-if="(!isTemporary && currentType == 1) || (isTemporary && currentType == 0)" class="form-item">
          <div class="task-title-wapper">
            <span class="task-icon"></span>
            <span class="task-title">指派（{{ formatTitle() }}）</span>
          </div>
          <div class="zhipai-content">
            <el-form-item label="人员" prop="operate">
              <SWselectPeople v-model:modelValue="addForm.operate" type="operate" :getSearchList="remoteMethod" />
            </el-form-item>
            <el-form-item label="计划交付时间" prop="expectedCompletionTime">
              <el-date-picker v-model="addForm.expectedCompletionTime" type="date" aria-label="Pick a date"
                placeholder="请选择计划交付时间" style="width: 100%" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="方案审核方" prop="audit">
              <SWselectPeople v-model:modelValue="addForm.audit" type="audit" :get-search-list="remoteMethod1" />
            </el-form-item>
            <div class="btn-wapper">
              <el-button @click="handleClose" style="width: 64px; height: 32px">取消</el-button>
              <el-button type="primary" :loading="loading" style="width: 64px; height: 32px"
                @click="onSubmit">保存</el-button>
            </div>
          </div>
        </div>
        <!-- 任务提交 -->
        <div class="task-title-wapper" v-if="(!isTemporary && currentType == 2) || (isTemporary && currentType == 1)">
          <span class="task-icon"></span>
          <span class="task-title">上传（{{ formatTitle() }}）</span>
        </div>

        <div v-if="(!isTemporary && currentType == 2) || (isTemporary && currentType == 1)" class="form-item-finish">
          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="addForm.remark" placeholder="请输入备注" />
          </el-form-item>

          <el-form-item label="附件" prop="fileList">
            <!-- 上传文件和附件 -->
            <SWuploadFile :fileList="otherList" :imgList="imgList" :allFileList="fileList" />
            <!-- 动态添加链接列表 -->
            <SWaddlink v-model:modelValue="inputItems" />
          </el-form-item>
          <div class="btn-wapper">
            <el-button @click="handleClose" style="width: 64px; height: 32px">取消</el-button>
            <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit"
              :loading="loading">保存</el-button>
          </div>
        </div>
      </el-form>
      <div class="btn-wapper" v-if="!subTypeListResult?.length && currentType == 0 && !isTemporary">
        <el-button @click="handleClose" style="width: 64px; height: 32px">取消</el-button>
        <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit" :loading="loading">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { batchOperate, getAuditorRoster, getOperatorRoster } from '@/api/team/index'
import SWaddlink from '../baseComponents/SWaddlink.vue'
import SWselectPeople from '../baseComponents/SWselectPeople.vue'
import SWuploadFile from '../baseComponents/SWuploadFile.vue'
import { useLeaderAudit } from '../components/hooks/useLeaderAudit'

const message = useMessage() // 消息弹窗

import { getSubNodeList } from '../common.js'
defineOptions({ name: 'SWTabsTable' })

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0 //0:人像 1:静物 2:视频
  },
  node: {
    type: Number,
    default: -1 // 1、方案  2、拍摄 3、后期 4、页面
  },
  detail: {
    type: Object,
    default: () => { }
  },
  isTemporary: {
    type: Boolean,
    default: false
  },
  list: {
    type: Array,
    default: () => []
  }
})

watch(
  () => props.node,
  async () => {
    if (!props.isTemporary) {
      await initSubNode()
    } else {
      subNodeList.value = [{ label: '临时需求' }]
      typeList.value.splice(0, 1)
    }
  }
)

const formatTitle = () => {
  switch (props.node) {
    case 1:
      return '方案'
    case 2:
      return '拍摄'
    case 3:
      return '后期'
    case 4:
      return '页面'
    case 5:
      return '临时需求'
  }
}

const typeList = ref([
  {
    label: '跳过',
    value: 0,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/pass-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/pass-icon-active.png`
  },
  {
    label: '指派',
    value: 1,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/zhipai-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/zhipai-icon-active.png`
  },
  {
    label: '上传',
    value: 2,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/upload-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/upload-icon-active.png`
  }
])

const imgList = ref([])
const otherList = ref([])
const inputItems = ref([
  { label: 'URL', value: '', placeholder: '', description: '备注：方案设计图、链接、PPT', desc: '' }
])
const fileList = ref([]) // 文件列表

const remoteMethod = async (value) => {
  const params = {
    userName: value,
    node: props.node,
    subNode: currentSubType.value
  }
  return await getOperatorRoster(params)
}

//审核
const remoteMethod1 = async (value) => {
  const params = {
    userName: value,
    parentId: props?.detail?.id
  }
  return await getAuditorRoster(params)
}

let addForm = reactive({
  operate: [], //操作人员
  expectedCompletionTime: undefined, //计划完成时间
  audit: [], //审核人员
  remark: undefined //备注
})

// 为自动审核方同步提供容器（不会影响 SWselectPeople 内部渲染，但用于确保 ID 显示可用）
interface Operator {
  avatarOrigin: string
  dept: string
  jobNum: number
  operatorId: string
  operatorRealname: string
}
const auditList: Ref<Operator[]> = ref([])
const auditSearchResult: Ref<Operator[]> = ref([])
const { syncAuditorsByOperators } = useLeaderAudit(addForm as any, auditList, auditSearchResult)

watch(
  () => (addForm.operate ?? []).slice(),
  async (val) => {
    await syncAuditorsByOperators(val || [])
  },
  { deep: false }
)

const currentType = ref(0) //操作类型
const typaChange = (index) => {
  currentType.value = index
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
}

const emit = defineEmits(['update:modelValue', 'success', 'cancel'])

const handleClose = () => {
  emit('cancel')
}

const formatType = () => {
  if (!props.isTemporary) {
    switch (currentType.value) {
      case 0:
        return 9
      case 1:
        return 1
      case 2:
        return 2
    }
  } else {
    switch (currentType.value) {
      case 0:
        return 1
      case 1:
        return 2
    }
  }
}

const currentSubType = ref() //子任务类型
const handleSubChange = async (item) => {
  currentSubType.value = item.code
  // 重新渲染数据
  subTypeListResult.value = []
  await nextTick()
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
}

const formRef = ref()
const loading = ref(false)

const onSubmit = async () => {
  try {
    const annexes = []
    const itemsWithValue = inputItems.value.filter((item) => item.value !== '')
    itemsWithValue.forEach((item) => {
      // @ts-ignore
      annexes.push({
        type: 1,
        url: item.value,
        urlRemarks: item.desc
      })
    })

    if (otherList.value.length) {
      otherList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }
    if (imgList.value.length) {
      imgList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }
    let params = {}

    if (currentType.value == 0 && !props.isTemporary) {
      params = {
        type: formatType(),
        node: props.node,
        subNode: props.isTemporary ? undefined : currentSubType.value,
        batchIds: undefined
      }
    } else if (
      (currentType.value == 1 && !props.isTemporary) ||
      (currentType.value == 0 && props.isTemporary)
    ) {
      if (!Array.isArray(addForm.operate) || addForm.operate.length === 0) {
        message.error('请选择操作人员')
        return
      }
      if (!addForm.expectedCompletionTime) {
        message.error('请选择计划完成时间')
        return
      }
      if (!Array.isArray(addForm.audit) || addForm.audit.length === 0) {
        message.error('请选择审核人员')
        return
      }
      params = {
        type: formatType(),
        operatorIds: addForm.operate && addForm.operate.join(','), //操作
        auditorIds: addForm.audit && addForm.audit.join(','), //审核
        expectedCompletionTime: addForm.expectedCompletionTime, // 计划完成时间
        node: props.node,
        subNode: props.isTemporary ? undefined : currentSubType.value,
        batchIds: undefined
      }
    } else if (
      (currentType.value == 2 && !props.isTemporary) ||
      (currentType.value == 1 && props.isTemporary)
    ) {
      params = {
        type: formatType(),
        node: props.node,
        subNode: props.isTemporary ? undefined : currentSubType.value,
        annexes: annexes, //附件
        remark: addForm.remark,
        batchIds: undefined
      }
    }
    loading.value = true
    let batchIds = ''
    props.list.forEach((item) => {
      //@ts-ignore
      batchIds = `${batchIds ? `${batchIds},` : ''}${item.id}`
    })
    //@ts-ignore
    params.batchIds = batchIds
    await batchOperate(params)
    loading.value = false
    message.success('操作成功')
    emit('success')
  } catch (error) {
    loading.value = false
  }
}

const subNodeList = ref()

const initSubNode = async () => {
  let res = []
  if (props.node == 2 || props.node == 3) {
    // @ts-ignore
    res = await getSubNodeList()
  } else {
    // @ts-ignore
    res = await getSubNodeList(2)
  }
  // @ts-ignore
  currentSubType.value = res && res[0].code
  subNodeList.value = res
}

const subTypeListResult = ref([])
const originItem = inject<any>('currentDetail')
onMounted(async () => {
  if (!props.isTemporary) {
    await initSubNode()
  } else {
    subNodeList.value = [{ label: '临时需求' }]
    typeList.value.splice(0, 1)
  }
  if (!addForm.expectedCompletionTime) {
    addForm.expectedCompletionTime = originItem.value.deliveryTime
  }
})
</script>

<style scoped lang="scss">
.tabs-table-wapper {
  .tabs-top {
    width: 100%;
    height: 52px;
    background: #fff4e6;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #e6eaf8;
    display: flex;
    flex-direction: row;
    align-items: center;

    .item {
      cursor: pointer;
      width: 83px;
      height: 58px;
      line-height: 58px;
      text-align: center;
      border-radius: 4px 0px 0px 0px;
      font-size: 14px;
      color: #666;
    }

    .active {
      background: #ffffff;
      border: none;
      height: 52px;
      color: #e98203;
    }
  }

  .tabs-content {
    box-sizing: border-box;
  }
}

.change-wapper {
  margin-top: 10px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .item-title {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }

  .item {
    cursor: pointer;
    width: 88px;
    height: 30px;
    background: #fafafa;
    border-radius: 2px;
    border: 1px solid #dfe0e3;
    line-height: 32px;
    margin-right: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;

    .btn-icon {
      width: 13px;
      height: 10px;
      margin-right: 6px;
    }

    .selected-type {
      width: 15px;
      height: 11px;
      position: absolute;
      right: -1px;
      top: 0;
    }

    .btn-text {
      font-size: 14px;
      color: #666666;
    }
  }

  .active {
    background: rgba(28, 117, 254, 0.04);
    border: 1px solid #1c75fe;

    .btn-text {
      color: #1c75fe;
    }
  }
}

.content-wapper {
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;

    .empty-img {
      width: 393px;
      height: 231px;
      margin-bottom: 20px;
    }

    .empty-text {
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

.form-item-finish {
  padding: 16px;
  box-sizing: border-box;
  background: #fbfcff;
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 0px 0px 4px 4px;
}

.table-content {
  background: #fbfcff;
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 0px 0px 4px 4px;
  padding: 16px;
  box-sizing: border-box;
}

.mid {
  width: 100%;
  height: 1px;
  background: #e7edf7;
  margin: 0 0 15px 0;
}

.avator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
}

.title {
  font-size: 12px;
  color: #999999;
  line-height: 20px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
}

.mid3 {
  border-top: 1px solid #e6eaf8;
}

.task-title-wapper {
  width: 100%;
  height: 53px;
  background: linear-gradient(90deg, #e5efff 0%, #c2daff 100%);
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 4px 4px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  box-sizing: border-box;

  .task-icon {
    display: block;
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .task-title {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: bold;
  }
}

.zhipai-content {
  background: #fbfcff;
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 0px 0px 4px 4px;
  padding: 16px;
  box-sizing: border-box;
}

.finish-task {
  background: #fbfcff;
  box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
  border-radius: 0px 0px 4px 4px;
  margin-top: -10px;
  padding: 16px;
  box-sizing: border-box;

  .content-finish {
    font-size: 12px;
    color: #666666;
    padding-bottom: 16px;
  }
}
</style>
