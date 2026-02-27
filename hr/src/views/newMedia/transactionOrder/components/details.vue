<template>
  <div>
    <el-drawer
      v-model="visible"
      v-if="visible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      :size="968"
      @closed="handleCloseDrawer"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="handleCloseDrawer"
            ><el-icon> <CloseBold /> </el-icon
          ></div>
        </div>
        <el-scrollbar :height="height + (disabled ? 50 : 0)">
          <el-card
            shadow="never"
            style="margin-bottom: 10px; background-color: #fff; position: relative"
          >
            <template #header>
              <div class="card-header">
                <logo-label :txt="`运营信息填写`" :is-edit="false" is-logo />
                <div class="expand-body" @click="expandClick('operation')" v-if="disabled">
                  <span class="expand-text">
                    {{ expand.operation ? '收起' : '展开' }}
                  </span>
                  <Icon
                    class="expand-icon"
                    :icon="expand.operation ? 'ep:arrow-up' : 'ep:arrow-down'"
                    :size="18"
                  />
                </div>
              </div>
            </template>
            <transaction-order-detail-operation ref="operationRef" v-if="expand.operation" />
          </el-card>
          <el-card
            shadow="never"
            style="margin-bottom: 10px; background-color: #fff; position: relative"
            v-if="isComment"
          >
            <!-- v-if="isComment" -->
            <template #header>
              <div class="card-header">
                <logo-label :txt="`评论信息填写`" :is-edit="false" is-logo />
                <div class="expand-body" @click="expandClick('comment')" v-if="disabled">
                  <span class="expand-text">
                    {{ expand.comment ? '收起' : '展开' }}
                  </span>
                  <Icon
                    class="expand-icon"
                    :icon="expand.comment ? 'ep:arrow-up' : 'ep:arrow-down'"
                    :size="18"
                  />
                </div>
              </div>
            </template>
            <transaction-order-detail-comment ref="commentRef" v-if="expand.comment" />
          </el-card>
          <el-card
            shadow="never"
            style="background-color: #fff; position: relative"
            v-if="isPlatform"
          >
            <template #header>
              <div class="card-header">
                <logo-label :txt="`中台信息填写`" :is-edit="false" is-logo />
                <div class="expand-body" @click="expandClick('platform')" v-if="disabled">
                  <span class="expand-text">
                    {{ expand.platform ? '收起' : '展开' }}
                  </span>
                  <Icon
                    class="expand-icon"
                    :icon="expand.platform ? 'ep:arrow-up' : 'ep:arrow-down'"
                    :size="18"
                  />
                </div>
              </div>
            </template>
            <transaction-order-detail-platform ref="platformRef" v-if="expand.platform" />
          </el-card>
        </el-scrollbar>
      </div>
      <div class="drawer_btn" v-if="type !== 'view'">
        <el-button plain @click="visible = false" :disabled="loading">取消</el-button>
        <el-button
          plain
          @click="storage"
          :disabled="loading"
          class="templeSaveBtn"
          v-if="!['grab_10', 'grab_20'].includes(type) && isCanStorage"
          >暂存</el-button
        >
        <el-button type="primary" @click="submit" :disabled="loading">提交</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetails' }
</script>

<script lang="tsx" setup>
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { saveDetail, getDetail, grabOrder } from '@/api/transactionOrder'
import LogoLabel from '@/components/common/label/logoLabel.vue'
import TransactionOrderDetailOperation from './operation.vue'
import TransactionOrderDetailPlatform from './platform.vue'
import TransactionOrderDetailComment from './comment.vue'
import { TabsProvideType } from './type'
import { backImageInfo } from '@/utils'
import { cloneDeep } from 'lodash-es'
import { DataItem } from './type'

const { permissionList } = inject('transaction_order_handle') as TabsProvideType

const emit = defineEmits(['refresh'])

const visible = ref(false),
  type = ref<string>('add'),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() })

const operationRef = ref(),
  commentRef = ref(),
  platformRef = ref(),
  loading = ref<boolean>(false),
  activeTabs = ref<string>('0'),
  expand = ref<any>({ operation: true, comment: true, platform: true })

const title = computed(() =>
  type.value === 'add' ? '新增运营补单' : type.value === 'edit' ? '编辑运营补单' : '运营补单详情'
)

const disabled = computed(() => type.value === 'view')

const isStorage = computed(() => dataValue.value.isCommit !== 1)

const isComment = computed(
  () => !(!dataValue.value.status || (dataValue.value.status === 10 && type.value === 'edit'))
)

const isPlatform = computed(
  () =>
    disabled.value ||
    (grabCheck('中台') &&
      ((dataValue.value.status > 10 && type.value === 'grab_20') || dataValue.value.status > 20))
)

const isCanStorage = computed(
  () =>
    (dataValue.value.isCommit !== 1 && dataValue.value.status < 20) ||
    (dataValue.value.middlegroundIsCommit !== 1 && dataValue.value.status > 20) ||
    (dataValue.value.commentIsCommit !== 1 && dataValue.value.status === 20)
)

const height = computed(() => window.innerHeight - 130)

const expandClick = (name: string) => {
  expand.value[name] = !expand.value[name]
}

const grabCheck = (role: string) => {
  const permissionStr: string = permissionList.value.map((ps: any) => ps.name).join(',')
  return permissionStr.includes(role)
}

const updetaValue = (value: any) => {
  dataValue.value = { ...value }
}

const storage = () => {
  operationRef?.value?.clearValidate()
  commentRef?.value?.clearValidate()
  platformRef?.value?.clearValidate()
  saveData()
}

const checkValue = () => {
  const reg: RegExp = new RegExp('^[0-9]*[1-9][0-9]*$')
  let success: boolean = true
  if (!reg.test(String(dataValue.value.orderCount || 0))) {
    success = false
    ElMessage({
      type: 'warning',
      message: `补单数量不是正整数!`
    })
  }
  return success
}

const submit = async () => {
  if (['grab_10', 'grab_20'].includes(type.value)) {
    const validate =
      type.value === 'grab_10'
        ? commentRef?.value
          ? await commentRef.value.validateCheck()
          : true
        : platformRef?.value
          ? await platformRef?.value?.validateCheck()
          : true
    validate && grabOrderSave()
  } else {
    const validate_o = operationRef?.value ? await operationRef.value.validateCheck() : true
    const validate_c = commentRef?.value ? await commentRef?.value?.validateCheck() : true
    const validate_p = platformRef?.value ? await platformRef?.value?.validateCheck() : true
    if (validate_o && validate_c && validate_p && checkValue()) {
      saveData(1)
    }
  }
}

const grabOrderSave = () => {
  loading.value = true
  grabOrder({
    id: dataValue.value.id,
    expectedDate:
      dataValue.value[dataValue.value.status === 10 ? 'contentExpectedDate' : 'orderExpectedDate'],
    grabOrderType: type.value === 'grab_10' ? 1 : 2
  })
    .then((res: any) => {
      res && (ElMessage.success(res.data || '操作成功!'), (visible.value = false), emit('refresh'))
    })
    .finally(() => {
      loading.value = false
    })
}

const saveData = (commit: number = 0) => {
  loading.value = true
  saveDetail({ ...dataValue.value, commit: commit }, type.value)
    .then((res: any) => {
      !!res && (ElMessage.success(res || '操作成功!'), (visible.value = false), emit('refresh'))
    })
    .finally(() => {
      loading.value = false
    })
}

const initValue = (item: any) => {
  dataValue.value = { ...new DataItem(), ...item }
  bukValue.value = cloneDeep(dataValue.value)
}

const getDetailInfo = (item: any, view: string) => {
  loading.value = true
  getDetail(item.id)
    .then((res: any) => {
      if (res?.id) {
        dataValue.value = {
          ...res,
          isCommit: item.isCommit,
          commentCreatedId: item.commentCreatedId,
          middlegroundIsCommit: item.middlegroundIsCommit,
          commentIsCommit: item.commentIsCommit,
          mainCommentLinks: backImageInfo(res.mainCommentLink),
          followupCommentLinks: backImageInfo(res.followupCommentLink),
          invalidCost: res?.invalidCost || item.invalidCost,
          invalidFreightCost: res?.invalidFreightCost || item.invalidFreightCost,
          invalidGoodsCode: res?.invalidGoodsCode || item.invalidGoodsCode,
          commentLinkFiles: backImageInfo(res.commentLinks),
          commentStatuslist: res?.commentStatus
            ? String(res.commentStatus)
                .split(',')
                .map((ns: any) => Number(ns))
            : []
        }
        bukValue.value = cloneDeep({ ...dataValue.value })
        type.value = view || 'add'
        activeTabs.value = '0'
        visible.value = true
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const open = async (item: any, view: string) => {
  await getIntDictOptions(DICT_TYPE.ORDEr_MIDDLE, true)
  const goods: any = {
    invalidCost: getDictLabel(DICT_TYPE.ORDEr_MIDDLE, 'invalid_cost') || 0,
    invalidFreightCost: getDictLabel(DICT_TYPE.ORDEr_MIDDLE, 'invalid_freight_cost') || 0,
    invalidGoodsCode: getDictLabel(DICT_TYPE.ORDEr_MIDDLE, 'invalid_goods_code') || ''
  }
  expand.value = { operation: true, comment: true, platform: true }
  if (!item?.id) {
    initValue({ ...item, ...goods })
    type.value = view || 'add'
    visible.value = true
  } else {
    getDetailInfo({ ...item, ...goods }, view)
  }
}

const handleCloseDrawer = () => {
  visible.value = false
}

defineExpose({ open })

provide('transaction_order_details', { dataValue, disabled, type, isStorage, updetaValue })
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

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
