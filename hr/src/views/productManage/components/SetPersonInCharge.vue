<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" class="drawer" show-close>
      <div>
        <div class="drawerTitle">
          <div>设置负责人</div>
          <div @click="closeDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <div class="drawerContent">
        <div class="drawerContent-title">
          <div>负责人</div>
        </div>
        <div class="drawerContent-curator" :style="{ 'padding-bottom': selectedCuratorList.length > 0 ? '12px' : '0' }">
          <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
            <el-form-item label="" prop="curatorName">
              <el-select v-model="formData.curatorName" class="select" placeholder="请选择负责人" @change="changeCuratorId"
                filterable>
                <el-option v-for="item in options" :key="item.userId" :value="item.name">
                  <template #default>
                    <div class="selectOption">
                      <div class="selectOption-left">
                        <div class="selectOption-left-title">
                          <img src="@/assets/imgs/productMng/curator.png" alt="" />
                          {{ item.name }} ({{ item.mobile }})
                        </div>
                      </div>
                      <div class="selectOption-right" v-if="item.selected">✓</div>
                    </div>
                  </template>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 展示已选择的负责人 -->
          <div class="selectedCuratorList" v-if="selectedCuratorList.length > 0">
            <div v-for="item in selectedCuratorList" :key="item.userId" class="selectedCuratorItem">
              <div class="selectedCuratorItem-left">
                <img src="@/assets/imgs/productMng/curator.png" alt="" />
                <div class="selectedCuratorItem-left-title">
                  {{ item.name }} ({{ item.mobile }})
                </div>
              </div>
              <div class="selectedCuratorItem-right" @click="removeCurator(item)"><span>移除</span></div>
            </div>
          </div>
        </div>

        <div class="drawerContent-title">
          <div>补货周期</div>
        </div>
        <el-input class="dialogFormItemWidth" v-model="formData.replenishmentCycle" placeholder="请输入补货周期"
          style="width: 90%" />
        <span class="replenishmentCycle-span">天</span>
      </div>
      <div class="drawerFooter">
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 保存设置</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ref, reactive } from 'vue'
import * as productApi from '@/api/productManage'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：singleSet - 单选；multiSet - 多选货品
const formData = ref({
  userId: undefined,
  curatorId: undefined,
  curatorName: undefined,
  replenishmentCycle: undefined,
  wdtGoodsName: undefined,
  wdtGoodsNo: undefined
})
const curatorId = ref()
const selectedCuratorList = ref()
const formRules = reactive({})

const formRef = ref() // 表单 Ref
const options = ref<any>([])
/** 打开弹窗 */
const selectedRow = ref()
const open = async (type: string, data: any) => {
  drawerVisible.value = true
  selectedCuratorList.value = []
  selectedRow.value = []
  formType.value = type
  resetForm()
  await getQueryUserList(undefined)
  if (type === 'multiSet') {
    formLoading.value = true
    try {
      // console.log('多选', data)
      selectedRow.value = data
      // await getQueryUserList()
      // formData.value = await platformLoginApi.getPlatformDetail(id)
    } finally {
      formLoading.value = false
    }
  } else {
    // 单选
    selectedRow.value.push({
      wdtGoodsId: data.wdtGoodsId,
      wdtGoodsNo: data.wdtGoodsNo,
      wdtGoodsCurator: data.wdtGoodsCurator
    })

    formData.value.replenishmentCycle = data.replenishmentCycle
    // 展示已存在的负责人列表,更新 selectedCuratorList
    updateSelectedCuratorList(data.wdtGoodsCurator)
    // console.log('单选', selectedRow.value)
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 已存在的负责人列表
const updateSelectedCuratorList = (wdtGoodsCurator) => {
  // console.log('wdtGoodsCurator', wdtGoodsCurator)
  wdtGoodsCurator.forEach((curatorId) => {
    const matchedOption = options.value.find((option) => option.name === curatorId)
    if (matchedOption) {
      selectedCuratorList.value.push(matchedOption)
      matchedOption.selected = true // 更新选中状态
      formData.value.curatorName = selectedCuratorList.value
        .map((curator) => curator.name)
        .join('/')
    }
  })
  // console.log('selectedCuratorList.value111', selectedCuratorList.value)
}
// 如果要用后端接口搜索的话，可以取消注释
// const handleInput = async(val) => {
//   let params = {
//     userName: val
//   }
//   await getQueryUserList(params)
//   console.log('handleInput', val)
// }

// 查询负责人
const getQueryUserList = async (params) => {
  const data = await productApi.getQueryUserList(params)
  // console.log('data', data);
  options.value = data.map((item) => ({ ...item, selected: false })) || []
  // console.log('options.value ', options.value)
}

// 选择负责人
const changeCuratorId = (selectedRealName) => {
  const selectedOption = options.value.find((option) => option.name === selectedRealName)
  if (selectedOption) {
    formData.value.curatorId = selectedOption.userId

    const exists = selectedCuratorList.value.some(
      (curator) => curator.userId === selectedOption.userId
    )
    if (!exists) {
      selectedCuratorList.value.push(selectedOption)
      selectedOption.selected = true // 设置选中状态
    } else {
      selectedOption.selected = !selectedOption.selected // 切换选中状态
      removeCurator(selectedOption) // 移除已选中的负责人
    }
    formData.value.curatorName = selectedRealName
    // console.log('先', formData.value.curatorName);
    // 更新 curatorName
    formData.value.curatorName = selectedCuratorList.value.map((curator) => curator.name).join('/')
    // console.log('selectedCuratorList.value', selectedCuratorList.value)
  }
}

// 移除负责人
const removeCurator = (item) => {
  // console.log('移除负责人', item)
  const index = selectedCuratorList.value.findIndex((curator) => curator.userId === item.userId)
  if (index !== -1) {
    selectedCuratorList.value.splice(index, 1)
    item.selected = false // 取消选中状态
    // 更新 curatorName
    formData.value.curatorName = selectedCuratorList.value.map((curator) => curator.name).join('/')
    // console.log('selectedCuratorList.value', selectedCuratorList.value)
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    // 提交补货周期

    let submitReplenishmentCycleData = selectedRow.value.map((item) => {
      return {
        wdtGoodsNo: item.wdtGoodsNo,
        replenishmentCycle: data.replenishmentCycle
      }
    })
    // 如果没有选择负责人，可以提交，但是不调用接口保存补货周期
    if (selectedCuratorList.value.length > 0) {
      await productApi.getWdtGoodsCycle(submitReplenishmentCycleData)
    } else {
      message.warning('请选择至少一个负责人才能正常保存补货周期')
    }

    // 提交负责人
    let submitData = selectedRow.value.map((item) => {
      return {
        wdtGoodsNo: item.wdtGoodsNo,
        wdtGoodsId: formType.value === 'multiSet' ? item.id : item.wdtGoodsId,
        curatorIds: selectedCuratorList.value.map((curator) => curator.userId)
      }
    })
    // console.log('---',selectedCuratorList.value);
    await productApi.addBatchAddUser(submitData)
    message.success('添加成功')
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    userId: undefined,
    curatorId: undefined,
    curatorName: undefined,
    replenishmentCycle: undefined,
    wdtGoodsName: undefined,
    wdtGoodsNo: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
@use '@/styles/drawer.scss'; // 修改备注的文本框背景

img {
  vertical-align: middle;
  margin-right: 8px;
}

.selectOption {
  font-size: 12px;
  color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-select__wrapper) {
  background-color: #5584ff !important;
  box-shadow: none !important;
  height: 43px !important;
  color: #fff !important;
}

:deep(.el-select__placeholder) {
  color: #fff !important;
}

:deep(.el-select__input) {
  color: #fff !important;
}

:deep(.el-select__icon) {
  color: #fff !important;
}

.drawerTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.drawerContent {
  background-color: #fff;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-curator {
    background-color: #f3f7fc;
    margin-bottom: 20px;
  }
}

.selectedCuratorList {
  width: 100%;
  padding: 0 14px;
  box-sizing: border-box;

  .selectedCuratorItem {
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 8px 16px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dfe0e3;
    font-size: 12px;
    color: #333333;
    margin-bottom: 12px;

    &-left {
      display: flex;
      align-items: center;
    }

    &-right {
      width: 46px;
      height: 21px;
      line-height: 21px;
      background-color: rgba(85, 132, 255, 0.12);
      border-radius: 11px;
      color: #0064ff;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .selectedCuratorItem:last-child {
    margin-bottom: 0;
  }
}

// 补货周期
.replenishmentCycle-span {
  margin-left: 12px;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  font-size: 14px;
  color: #333333;
}
</style>
