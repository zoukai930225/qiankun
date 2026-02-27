<template>
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    :title="dialogTitle"
    :destroy-on-close="true"
    align-center
  >
    <!-- 搜索工作栏 -->
    <div style="padding: 0 10px; height: 420px">
      <el-input
        v-model="queryParams.field"
        placeholder="根据名称或者工号或者手机号码查找"
        :suffix-icon="Search"
        clearable
        @change="handleQuery"
      />

      <!--查找到的人员 -->
      <div class="user-list">
        <div class="user-item" v-for="item in userList" :key="item.id" @click="selectUser(item)">
          <div class="user-info">
            <el-avatar :icon="UserFilled" class="user-avatar" />
            <div class="user-details">
              <div class="user-name">{{ item.name + (item.company ? `(${getDictLabel(DICT_TYPE.PR_COMPANY, item.company)})` : '') }}</div>
              <div class="user-department"
                >{{ item.departmentStName }}<span v-if="item.departmentNdName">-</span
                >{{ item.departmentNdName }}</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <template #footer>
      <el-button @click="dialogVisible = false" type="primary">确 认</el-button>
      <el-button @click="dialogVisible = false"> 关 闭 </el-button>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { UserFilled } from '@element-plus/icons-vue'
import { Search } from '@element-plus/icons-vue'
import * as Asset from '@/api/hrAdmin/asset'
const message = useMessage() // 消息弹窗
import { ElMessageBox } from 'element-plus'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const dialogVisible = ref(false) // 弹窗的是否展示
defineOptions({ name: 'RelatedProgramList' })

const props = defineProps({
  type: propTypes.string.def('common') // assetManage ：资产管理
})

const dialogTitle = ref('选择使用人员')
const userList = ref<any[]>([])
const loading = ref(false) // 列表的加载中
/** 打开弹窗 */
const open = async () => {
  userList.value = []
  queryParams.value.field = ''
  dialogVisible.value = true
  if (props.type === 'assetManage') {
    dialogTitle.value = '选择使用人员'
  } else if (props.type === 'common') {
    dialogTitle.value = '选择人员'
  }
  // getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const queryParams = ref({
  field: ''
})

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const selectUser = (item: any) => {
  if (props.type === 'common') {
    // 发送操作成功的事件
    emit('success', item)
    dialogVisible.value = false
    return
  }
  ElMessageBox.confirm(`是否将资产的使用人员选择为【${item.name}】`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      message.success('更换成功')
      // 发送操作成功的事件
      emit('success', item)
      dialogVisible.value = false
    })
    .catch(() => {
      // 取消
    })
}

/** 查询字典类型列表 */
const getList = async () => {
  // console.log('查询参数', {string:queryParams.value.string})
  loading.value = true
  try {
    const data = await Asset.getUserList({ field: queryParams.value.field }).catch(() => {
      loading.value = false
    })
    if(userStore?.user?.company !== 'SecretWorld') {
      userList.value = data.filter((item: any) => item.company === userStore?.user?.company) || []
    } else {
      // console.log('查询到的数据', data)
      userList.value = data || []
    }
  } finally {
    loading.value = false
  }
}
const handleQuery = () => {
  // 判断不为空
  if (queryParams.value.field == '') {
    return
  }
  getList()
}
</script>
<style scoped lang="scss">
:deep(.el-select-dropdown__item) {
  height: auto;
}
.user-list {
  height: 360px;
  overflow-y: auto;
}
.user-item {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f7fa;
  &:hover {
    background-color: #f5f7fa;
  }
}

.user-info {
  display: flex;
  align-items: center;
}
.user-details {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.user-name {
  font-weight: bold;
  margin-bottom: 6px;
}
.user-department {
  font-size: 12px;
  color: #909090;
}
.close-icon {
  cursor: pointer;
}
</style>
