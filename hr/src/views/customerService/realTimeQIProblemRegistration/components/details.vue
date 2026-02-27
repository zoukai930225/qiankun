<template>
  <div>
    <el-drawer v-model="visible" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968"
      @closed="handleCloseDrawer">
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
        <el-scrollbar :height="height + (disabled ? 50 : 0)">
          <el-card shadow="never" style="margin-bottom: 10px; background-color: #fff; position: relative">
            <template #header>
              <div class="card-header">
                <logo-label :txt="`质检人员维护`" :is-edit="false" is-logo style="font-weight: 600;" />
              </div>
            </template>
            <real-time-q-i-detail-reg ref="regRef" v-if="expand.reg" />
          </el-card>
          <el-card shadow="never" style="margin-bottom: 10px; background-color: #fff; position: relative"
            v-if="showHandle">
            <template #header>
              <div class="card-header">
                <logo-label :txt="`对接人员维护`" :is-edit="false" is-logo style="font-weight: 600;" />
              </div>
            </template>
            <real-time-q-i-detail-handle ref="handleRef" v-if="expand.handle" />
          </el-card>
        </el-scrollbar>
      </div>
      <div class="drawer_btn" v-if="type !== 'view'">
        <el-button plain @click="visible = false" :disabled="loading">取消</el-button>
        <el-button type="primary" @click="submit" :disabled="loading">提交</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetails' }
</script>

<script lang="tsx" setup>
import { saveQI, queryDetailsQI, updateQI, handleQI } from '@/api/customerService/realTImeQIProblemRegistration'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import RealTimeQIDetailReg from './reg.vue'
import RealTimeQIDetailHandle from './handle.vue'
import { cloneDeep } from 'lodash-es'
import { DataItem } from './type'
import { formatTime } from "@/utils"
import request from '@/config/axios';

const emit = defineEmits(['refresh'])

const visible = ref(false),
  type = ref<string>('add'),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() })

const regRef = ref(),
  handleRef = ref(),
  loading = ref<boolean>(false),
  activeTabs = ref<string>('0'),
  expand = ref<any>({ reg: true, handle: true }),
  feedBackOptions = ref<any>([])

const title = computed(() =>
  type.value === 'add' ? '新增' : type.value === 'edit' ? '编辑' : type.value === 'handle' ? '处理' : '详情'
)

const disabled = computed(() => type.value === 'view' || type.value === 'handle')

const showHandle = computed(() => type.value === 'handle' || type.value === 'view')

const height = computed(() => window.innerHeight - 130)

const updetaValue = (value: any) => {
  dataValue.value = { ...value }
}

const submit = async () => {
  // 问题处理
  const validate_h = handleRef?.value ? await handleRef?.value?.validateCheck() : true
  if (type.value === 'handle') {
    validate_h && saveData(1)
    return
  }
  const validate_r = regRef?.value ? await regRef.value.validateCheck() : true
  if (validate_r) {
    // 问题新增、修改
    saveData(0)
  }
}

const saveData = (commit: number) => {
  loading.value = true
  const { id } = dataValue.value
  const apiFn = commit === 1 ? handleQI : (id ? updateQI : saveQI)
  const query = { ...dataValue.value }
  commit === 1 && (query['type'] = 2)
  apiFn(query)
    .then((res: any) => {
      !!res && (ElMessage.success(res.message || '操作成功!'), (visible.value = false), emit('refresh'))
    })
    .finally(() => {
      loading.value = false
    })
}

const initValue = (item: any) => {
  dataValue.value = { ...new DataItem(), ...item, inspectionTime: formatTime(new Date(), 'yyyy-MM-dd HH:mm') }
  bukValue.value = cloneDeep(dataValue.value)
}

const getDetailInfo = (item: any, view: string) => {
  loading.value = true
  queryDetailsQI(item.id)
    .then((res: any) => {
      if (res?.id) {
        dataValue.value = res
        bukValue.value = cloneDeep({ ...dataValue.value })
        type.value = view || 'add'
        activeTabs.value = '0'
        visible.value = true
        const { handler, handlerAvatarOrigin, handlerName } = dataValue.value
        feedBackOptions.value = [{ userId: handler, avatarOrigin: handlerAvatarOrigin, realName: handlerName }]
        if (type.value === 'handle') {
          dataValue.value['completeTime'] = formatTime(new Date(), 'yyyy-MM-dd HH:mm')
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 客服人员分组配置列表
const customerConfigList = ref([])
const getCusList = async()=>{
  request.get({ url:"/api/personnelGroup/getGroup"}).then((res:any)=>{
    customerConfigList.value = res.map((rs:any)=>({
      ...rs,
      label:rs.customerName,
      value:rs.customerName
    }))
  })
}

const open = async (item: any, view: string) => {
  expand.value = { reg: true, handle: true }
  getCusList()
  if (!item?.id) {
    initValue(item)
    type.value = view || 'add'
    visible.value = true
  } else {
    getDetailInfo(item, view)
  }
}

const handleCloseDrawer = () => {
  visible.value = false
}

defineExpose({ open })

provide('realtimeqi_details', { dataValue, disabled, type, feedBackOptions, updetaValue, customerConfigList })
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

:deep() {
  --el-text-color-placeholder: #999;
}

:deep(.el-card) {
  border: none;
  border-radius: 8px;

  .el-card__header {
    padding: 16px 20px;
  }

  .el-card__body {
    padding-right: 0;
  }
}

.expand-body {
  cursor: pointer;
  color: var(--el-color-primary);
  display: inline-block;
  position: absolute;
  right: 50px;
  top: 25px;
  font-size: 14px;

  .expand-icon {
    position: absolute;
    right: -20px;
    top: -2px;
  }
}
</style>
