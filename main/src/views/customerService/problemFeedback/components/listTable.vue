<template>
  <el-table class="SWCommonTable" :data="list" width="100%" v-loading="loading" v-horizontal-scroll="'always'"
    row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" ref="tableRef">
    <el-table-column label="问题处理部门" prop="handleDept" min-width="220">
      <template #default="{ row }">
        {{ getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, row.handleDept) || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="品类" prop="category" min-width="220">
      <template #default="{ row }">
        {{ getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, row.category) || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="问题反馈类型" prop="type" min-width="220">
      <template #default="{ row }">
        {{ getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, row.type) || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="问题情况说明" prop="description" min-width="220" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.description || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="问题对接负责人" prop="directorName" min-width="130">
      <template #default="{ row }">
        <div class="user" v-if="row.directorId">
          <el-avatar :src="row.directorAvatarOrigin || DefaultAvatar" :size="20" class="ava"/>
          <span>{{  row.directorName}}</span>
        </div>
        <span v-else>{{'-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="产品编码" prop="productCode" min-width="220" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.productCode || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="最新进展" prop="latestProgress" min-width="220" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.latestProgress || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="预计完成日期" prop="estimatedCompleteDate" min-width="180">
      <template #default="{ row }">
        {{ row.estimatedCompleteDate || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="实际完成日期" prop="actualCompleteDate" min-width="180">
      <template #default="{ row }">
        {{ row.actualCompleteDate || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="是否按时完成" prop="finishStatus" min-width="120">
      <template #default="{ row }">
        {{ getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_FINISH_STATUS, row.finishStatus) || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="反馈人" prop="feedbackPersonName" min-width="120">
      <template #default="{ row }">
        <div class="user" v-if="row.feedbackPersonId">
          <el-avatar :src="row.feedbackAvatarOrigin || DefaultAvatar" :size="20" class="ava"/>
          <span>{{  row.feedbackPersonName}}</span>
        </div>
        <span v-else>{{'-' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="反馈日期" prop="feedbackDate" min-width="120">
      <template #default="{ row }">
        {{ row.feedbackDate || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="图片" prop="image" min-width="120">
      <template #default="{ row }">
        <el-image v-if="isValidImage(row.image)" style="width: 60px; height: 40px; z-index: 999"
          :src="JSON.parse(row.image)[0]" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-teleported="true"
          :preview-src-list="JSON.parse(row.image)" fit="cover" />
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="status" min-width="120">
      <template #default="{ row }">
        <div :class="['status', getStatusClass(row.status)]">{{ getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS,
          row.status) || '-' }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" :show-overflow-tooltip="false" fixed="right"  align="left" :width="maxWidth"
    >
      <template #default="{ row }">
        <div class="optionDiv">
          <el-button type="primary"  @click.stop="emits('clickBtn', 'show', row.id)" link>
            详情
          </el-button>
          <el-button v-if="isFeedBackEdit(row) || isDirectorEdit(row)" type="primary"   @click.stop="emits('clickBtn', 'edit', row.id,isDirectorEdit(row),isFeedBackEdit(row))" link >
            编辑
          </el-button>
          <el-button v-if="canHandle(row)" type="primary" @click.stop="emits('clickBtn', 'handle', row.id)" link>
            处理
          </el-button>
          <el-button v-if="canHandle(row)" type="primary" @click.stop="emits('clickBtn', 'changeDirector', row.id)" link>
            修改处理人
          </el-button>
          <el-button v-if="canDelete(row)" type="danger" @click.stop="emits('clickBtn', 'delete', row.id)" link>
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user';
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
const appStore = useAppStore()
const userStore = useUserStore();
const props=defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isProblemDirector:{
    type: Boolean,
    default: false
  },
  isProblemCs:{
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['clickBtn'])

function isValidImage(image: string): boolean {
  if (!image) return false
  try {
    const arr = JSON.parse(image)
    return Array.isArray(arr) && arr.length > 0
  } catch {
    return false
  }
}

const getStatusClass = (status: string) => {
  if (status === '3') return 'success'
  if (status === '2') return 'progress'
}

// 当前登陆人 userId
const currentUserId = computed(()=>userStore.user?.userNo)

// 是否可以编辑 区分一下 处理人(对接负责人是自己 directorId)和客服(反馈人是自己 feedbackPersonId)
const isFeedBackEdit = (row:any)=>{
  return row.status !== '3' && row.feedbackPersonId === currentUserId.value && props.isProblemCs
}
const isDirectorEdit = (row:any)=>{
  return row.status !== '1' && row.status !== '3' && row.directorId === currentUserId.value && props.isProblemDirector
}

// 是否可以删除 只有客服可以删除
const canDelete = (row:any) => {
  if(props.isProblemCs){
    return row.feedbackPersonId === currentUserId.value
  }
}
// 是否可以处理
const canHandle = (row:any) => {
  if(props.isProblemDirector){
    return row.status === '1' && row.directorId === currentUserId.value
  }
}

const tableRef  = ref()
const maxWidth = ref()
// 表头部重新渲染
function renderHeader() {
  // 获取操作按钮组的元素
  setTimeout(()=>{
    const opts = document.getElementsByClassName('optionDiv');
    let widthArr = [] as any;
    // 取操作组的最大宽度
    Array.prototype.forEach.call(opts, function (item:any) {
      widthArr.push(item.offsetWidth);
    });
    // 重新设置列标题及宽度属性
    maxWidth.value = Math.max(...widthArr) + 24;
  },10)
  
}
watch(()=>props.list,(val)=>{
  if(val){
    renderHeader()
  }
},{
  immediate:true,
  deep:true
})


</script>

<style lang="scss" scoped>
.btn {
  &:hover {
    opacity: 0.8;
  }

  &.normal {
    color: #0064ff;
  }

  &.del {
    color: #ff0000;
  }
}

.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}
.optionDiv{
  display: flex;
  width: fit-content;
}

.status {
  font-size: 14px;
  text-align: center;
  width: 74px;
  height: 28px;
  line-height: 28px;
  border-radius: 158px;
  background: #E8E8E8;
  color: #333;

  &.success {
    background: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }
  &.progress{
    color:#DB6A0F;
    background: rgba(219, 107, 15, 0.2);
  }
}
.user {
  display: flex;
  align-items: center;
  .ava {
    margin-right: 6px;
  }
  span{
    color: #333;
  }
}
</style>
