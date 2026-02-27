<!--
 * @Date: 2024-08-06 16:12:02
 新增任务
-->
<template>
  <div>
    <div class="title-wapper">
      <span class="title-icon"></span>
      <span class="title">新增</span>
    </div>
    <el-form :model="addForm" label-width="100" label-position="left" ref="formRef">
      <el-form-item label="店铺" prop="store">
        <template #label>
          <span class="custom-require">*</span>
          <span>店铺</span>
        </template>

        <StoreRangePlus v-model="addForm.store" value-type="storeCode" width="100%" :placeholder="'请选择店铺'"
          :showAllChannels="false" />
      </el-form-item>

      <el-form-item label="品类" prop="category">
        <template #label>
          <span class="custom-require">*</span>
          <span>品类</span>
        </template>
        <el-select v-model="addForm.category" placeholder="请选择品类" clearable>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_CATEGORY, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="需求类型" prop="demandType">
        <template #label>
          <span class="custom-require">*</span>
          <span>需求类型</span>
        </template>
        <!-- 自定义select -->
        <div class="flex-row">
          <el-popover :visible="showSelectOne" placement="bottom" trigger="click" :width="300"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; ">
            <template #reference>
              <div class="item itemOne" :class="showSelectOne ? 'itemTwo' : ''" @click="showSelectOne = true">{{
                currentDemandTypeOneItem?.label }}</div>
            </template>
            <template #default>
              <div>
                <div class="select-item" :class="{ activeOne: currentDemandTypeOneItem?.value == item.value }"
                  v-for="item in demandTypeOne" :key="item.value" @click="selectDemandTypeOne(item)">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-popover>

          <el-popover placement="bottom" trigger="click" :visible="showSelectTwo" :width="300"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; ">
            <template #reference>
              <div class="item itemOne" :class="showSelectTwo ? 'itemTwo' : ''" @click="handleSelectTwo">{{
                currentDemandTypeTwoItem?.label }}</div>
            </template>
            <template #default>
              <div>
                <div class="select-item" :class="{ activeOne: currentDemandTypeTwoItem?.value == item.value }"
                  v-for="item in demandTypeTwo" :key="item.value" @click="selectDemandTypeTwo(item)">
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-popover>
        </div>
      </el-form-item>
      <div class="bottom-form">
        <el-form-item label="需求人员" prop="createdId" v-if="currentDemandTypeOneItem?.label == '内部需求'">
          <template #label>
            <span class="custom-require">*</span>
            <span>需求人员</span>
          </template>
          <SWselectPeople v-model:modelValue="addForm.createdId" type="audit" :multiple="false"
            :get-search-list="remoteMethod1" :disabled="isEdit && currentDemandTypeOneItem?.label != '内部需求'" />
        </el-form-item>
        <el-form-item label="产品编码" prop="goodsCode">
          <template #label>
            <span class="custom-require">*</span>
            <span>产品编码</span>
          </template>
          <el-input v-model="addForm.goodsCode" placeholder="请输入产品编码" style="height: 34px" />
        </el-form-item>

        <el-form-item label="产品定位" prop="goodsPosition" v-if="!isTemporary">
          <template #label>
            <span class="custom-require">*</span>
            <span>产品定位</span>
          </template>
          <el-select v-model="addForm.goodsPosition" placeholder="请选择产品定位"
            :disabled="isEdit && currentDemandTypeOneItem?.label == '临时需求'">
            <el-option v-for="item in goodsPositionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="紧急程度" prop="urgencyLevel" v-if="isTemporary">
          <template #label>
            <span class="custom-require">*</span>
            <span>紧急程度</span>
          </template>
          <el-select v-model="addForm.urgencyLevel" placeholder="请选择紧急程度"
            :disabled="isEdit && currentDemandTypeOneItem?.label != '临时需求'">
            <el-option v-for="item in urgencyLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="交付时间" prop="deliveryTime">
          <template #label>
            <span class="custom-require">*</span>
            <span>交付时间</span>
          </template>
          <el-date-picker v-model="addForm.deliveryTime" type="date" aria-label="Pick a date" placeholder="请选择交付时间"
            style="width: 100%" value-format="YYYY-MM-DD" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="渠道" prop="channel">
          <template #label>
            <span class="custom-require">*</span>
            <span>渠道</span>
          </template>
          <el-select v-model="addForm.channel" placeholder="请选择渠道" :disabled="isEdit">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="样品" prop="sample" v-if="!isTemporary">
          <template #label>
            <span class="custom-require">*</span>
            <span>样品</span>
          </template>
          <el-input v-model="addForm.sample" placeholder="请输入样品数量" style="height: 34px"
            :disabled="isEdit && currentDemandTypeOneItem?.label == '临时需求'" />
        </el-form-item>

        <el-form-item label="到货" prop="arrivalState" v-if="!isTemporary">
          <template #label>
            <span class="custom-require">*</span>
            <span>到货</span>
          </template>
          <el-select v-model="addForm.arrivalState" placeholder="请选择到货"
            :disabled="isEdit && currentDemandTypeOneItem?.label == '临时需求'">
            <el-option v-for="item in arrivalStateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="调整说明" prop="demandRemark" v-if="isTemporary">
          <s-text-area v-model="addForm.demandRemark" placeholder="请输入调整说明" :rows="4"
            :disabled="isEdit && currentDemandTypeOneItem?.label != '临时需求'" />
        </el-form-item>

        <el-form-item label="其他说明" prop="remark" v-if="!isTemporary">
          <s-text-area v-model="addForm.remark" placeholder="请输入其他说明" :rows="4" :disabled="isEdit" />
        </el-form-item>

        <!-- attachment -->
        <el-form-item label="产品图" prop="imgFileList">
          <template #label>
            <span class="custom-require">*</span>
            <span>产品图</span>
          </template>
          <SWuploadImg v-model:modelValue="imgFileList" :disabled="isEdit" />
          <!-- <SWUploadFile v-model:modelValue="imgFileList" :disabled="isEdit" :onlyUploadImg="true" /> -->
        </el-form-item>

        <el-form-item :label="formatfile()" prop="fileList">
          <template #label>
            <span class="custom-require">*</span>
            <span>{{ formatfile() }}</span>
          </template>
          <!-- 上传文件和附件 -->
          <SWuploadFile :fileList="otherList" :imgList="imgList" :allFileList="fileList" :disabled="isEdit" />
          <!-- 动态添加链接列表 -->
          <SWaddlink v-model:modelValue="inputItems" :disabled="isEdit" />
        </el-form-item>

        <el-form-item>
          <div class="btn-wapper">
            <el-button @click="oncancel" style="width: 64px; height: 32px">取消</el-button>
            <el-button type="primary" style="width: 64px; height: 32px" @click="onSubmit"
              :loading="submitLoading">提交</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getPersonByDeIdAndName } from '@/api/common'
import { createVisualApproval, updateVisualApproval } from '@/api/team/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ElNotification } from 'element-plus'
import SWaddlink from '../baseComponents/SWaddlink.vue'
import SWselectPeople from '../baseComponents/SWselectPeople.vue'
import SWuploadFile from '../baseComponents/SWuploadFile.vue'
import SWuploadImg from '../baseComponents/SWuploadImg.vue'
import { goodsPositionOptions, urgencyLevelOptions } from './common'
const message = useMessage() // 消息弹窗
const submitLoading = ref(false)

const props = defineProps({
  detail: {
    type: Object,
    default: () => { }
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const demandTypeTwo: Ref<any[]> = ref([]) //二级需求类型
const currentDemandTypeOneItem = ref() //第一个选中的值
const currentDemandTypeTwoItem = ref() //第2个选中的值

let addForm = reactive({
  id: undefined,
  store: undefined, //平台
  category: undefined, //品类
  demandType: undefined, //需求类型
  goodsCode: undefined, //产品编码
  urgencyLevel: undefined, //紧急程度
  goodsPosition: undefined, //产品定位
  deliveryTime: undefined, //交付时间
  demandRemark: undefined, //需求说明
  attachment: undefined, //附件
  status: undefined, //状态？不需呀应该
  channel: undefined, //渠道
  sample: undefined, //样品数量
  arrivalState: undefined, //到货
  remark: undefined, //其他说明
  url: undefined,
  goodsImage: undefined,
  miId: undefined,
  createdId: undefined
})

const inputItems = ref([
  { label: 'URL', value: '', placeholder: '', description: '备注：方案设计图、链接、PPT', desc: '' }
])

const imgList = ref([])
const otherList = ref([])
const imgFileList = ref([]) // 产品图

//人员
const remoteMethod1 = async (value) => {
  if (!value && !addForm.id) return []
  const params = {
    name: value
  }
  return await getPersonByDeIdAndName(params)
}

watch(
  () => props.detail,
  (item) => {
    if (item?.id) {
      // 数据回显
      addForm.store = item.store
      addForm.id = item.id
      addForm.category = item.category
      addForm.goodsCode = item.goodsCode
      addForm.goodsPosition = item.goodsPosition
      addForm.deliveryTime = item.deliveryTime
      addForm.channel = item.channel
      addForm.sample = item.sample
      addForm.arrivalState = item.arrivalState
      addForm.remark = item.remark
      addForm.urgencyLevel = item.urgencyLevel
      addForm.miId = item.miId
      // @ts-ignore
      addForm.createdId = item.proposer
      // 需求了类型
      const arr = demandTypeOne.value.filter((ite) => {
        if (ite.value == item.demandType) {
          return ite
        }
      })
      if (arr?.length) {
        currentDemandTypeOneItem.value = arr[0]
        selectDemandTypeOne(arr[0])
      }
      // 二级类型
      const secondArr = demandTypeTwo.value.filter((ite) => {
        if (ite.value == item.secondDemandType) {
          return ite
        }
      })
      if (secondArr?.length) {
        currentDemandTypeTwoItem.value = secondArr[0]
        selectDemandTypeTwo(secondArr[0])
      }
      // 链接
      const midInputItems = filterArr(item, '1')
      if (midInputItems.length) {
        inputItems.value = midInputItems.map((it) => {
          return {
            label: 'URL',
            value: it.url,
            placeholder: '',
            description: '备注：方案设计图、链接、PPT',
            desc: it.urlRemarks
          }
        })
      }

      // 图片
      imgList.value = item?.annexes.filter((ite) => ite.type == '0' && ite.imageKey)
      // 文件
      otherList.value = item?.annexes.filter((ite) => ite.type == '0' && !ite.imageKey)
      // 产品图
      if (item.goodsImage) {
        imgFileList.value = item.goodsImage.split(',').map((it) => {
          return {
            url: it.split(';')[0],
            response: {
              data: {
                ossPath: it.split(';')[0],
                imageKey: it.split(';')[1]
              }
            }
          }
        })
      }
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 过滤文件
const filterArr = (item, type) => {
  return item?.annexes.filter((ite) => {
    if (ite.type == type) {
      return ite
    }
  })
}

const formatfile = () => {
  switch (currentDemandTypeOneItem.value?.label) {
    case '新品需求':
    case '内部需求':
      return '核心卖点'
    case '优化需求':
      return '优化方向'
    default:
      return '附件'
  }
}

const errorInfo = (value) => {
  ElNotification({
    message: value,
    type: 'error'
  })
}

const fileList = ref([]) // 文件列表

const demandTypeOne = ref([
  {
    label: '新品需求',
    value: 'newProduct'
  },
  {
    label: '优化需求',
    value: 'optimization'
  },
  {
    label: '临时需求',
    value: 'temporary'
  },
  {
    label: '内部需求',
    value: 'internal'
  }
])

// 是否是临时需求
const isTemporary = computed(() => {
  return currentDemandTypeOneItem.value?.label == '临时需求'
})
const showSelectOne = ref(false)
// 点击一级需求类型
const selectDemandTypeOne = (item) => {
  currentDemandTypeOneItem.value = item
  showSelectOne.value = false
  // 选择一级的时候给二级赋值
  demandTypeTwo.value = getIntDictOptions(item.value, true)
  currentDemandTypeTwoItem.value = [] //第一项切换 清空二级已选
}

const showSelectTwo = ref(false)
const selectDemandTypeTwo = (item) => {
  currentDemandTypeTwoItem.value = item
  showSelectTwo.value = false
}

const handleSelectTwo = () => {
  if (!currentDemandTypeOneItem.value) {
    message.error('请先选择一级需求类型')
    return
  }
  showSelectTwo.value = true
}

const channelOptions = computed(() => {
  const baseOptions = [
    {
      label: '定制款',
      value: '0'
    },
    {
      label: '采购款',
      value: '1'
    }
  ]

  if (isTemporary.value) {
    baseOptions.push({
      label: '无',
      value: '2'
    })
  }

  return baseOptions
})

const arrivalStateOptions = ref([
  {
    label: '未到货',
    value: '0'
  },
  {
    label: '已到货',
    value: '1'
  }
])

const emit = defineEmits(['success', 'cancle'])
const formRef = ref()

// 公共校验
const formatCommonRuler = () => {
  if (!addForm.category) {
    errorInfo('请选择品类')
    return true
  } else if (!currentDemandTypeOneItem.value) {
    errorInfo('请选择需求类型')
    return true
  } else if (!currentDemandTypeTwoItem.value.value) {
    errorInfo('请选择需求类型')
    return true
  } else if (!addForm.goodsCode) {
    errorInfo('请输入产品编码')
    return true
  } else if (!addForm.deliveryTime) {
    errorInfo('请选择交付时间')
    return true
  } else if (addForm.channel != '0' && addForm.channel != '1') {
    errorInfo('请选择渠道')
    return true
  } else if (!imgFileList.value?.length) {
    errorInfo('请上传产品图')
    return true
  }
}

const onSubmit = async () => {
  console.log(addForm.createdId, 'addForm.createdId', imgFileList.value)
  try {
    const commonFlag = formatCommonRuler()
    if (commonFlag) return
    // 新品需求和优化需求附件必需有
    const str = currentDemandTypeOneItem.value.label
    const demandTypes = ['新品需求', '优化需求', '内部需求']
    if (demandTypes.includes(str)) {
      // 公共校验
      if (
        addForm.goodsPosition != '0' &&
        addForm.goodsPosition != '1' &&
        addForm.goodsPosition != '2'
      ) {
        errorInfo('请选择产品定位')
        return
      } else if (!addForm.sample) {
        errorInfo('请选择样品数量')
        return
      } else if (addForm.arrivalState != '0' && addForm.arrivalState != '1') {
        errorInfo('请选择到货状态')
        return
      }

      //
      if (otherList.value.length == 0 && imgList.value.length == 0) {
        const errStr =
          str == '新品需求' || str == '内部需求'
            ? `${str},核心卖点不能为空`
            : '优化需求，优化方向不能为空'
        errorInfo(errStr)
        return
      }
    }

    if (str == '内部需求') {
      if (!addForm.createdId) {
        errorInfo('内部需求,需求人员不能为空')
        return
      }
    }

    // 临时需求。 调整说明必需有
    if (isTemporary.value) {
      if (addForm.urgencyLevel != '0' && addForm.urgencyLevel != '1') {
        errorInfo('请选择紧急程度')
        return
      }

      if (!addForm.demandRemark) {
        errorInfo('临时需求,调整说明不能为空')
        return
      }
    }

    if (imgFileList.value.length) {
      const arr = imgFileList.value.map((item) => {
        // @ts-ignore
        return `${item.response.data.ossPath};${item.response.data.imageKey}`
      })
      // @ts-ignore
      addForm.goodsImage = arr.join(',')
    }

    // @ts-ignore
    const isCopy = addForm.miId && addForm.miId.includes(',copy')

    // 处理地址
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
        annexes.push({ ...item, type: 0, id: isCopy ? undefined : item.id })
      })
    }
    if (imgList.value.length) {
      imgList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0, id: isCopy ? undefined : item.id })
      })
    }
    submitLoading.value = true

    const params = {
      ...addForm,
      store: addForm.store ? addForm.store : 'ALL',
      attachment: '',
      demandType: currentDemandTypeOneItem.value.value,
      secondDemandType: currentDemandTypeTwoItem.value.value,
      annexes: annexes,
      // @ts-ignore
      id: isCopy ? undefined : addForm.id,
      miId: undefined,
      createdId: addForm.createdId
    }
    console.log(props.isEdit, 'props.isEdit')
    if (props.isEdit) {
      await updateVisualApproval({ ...params, createdId: undefined })
      submitLoading.value = false
      message.success('添加成功')
      emit('success')
      resetForm()
    } else {
      await createVisualApproval(params)
      submitLoading.value = false
      message.success('添加成功')
      emit('success')
      resetForm()
    }
  } catch (error) {
    submitLoading.value = false
    console.log(error)
  }
}

const resetForm = () => {
  addForm = {
    id: undefined,
    store: undefined,
    category: undefined,
    demandType: undefined,
    goodsCode: undefined,
    urgencyLevel: undefined,
    goodsPosition: undefined,
    deliveryTime: undefined, //交付时间
    demandRemark: undefined,
    attachment: undefined, //附件
    status: undefined, //状态？不需呀应该
    channel: undefined,
    sample: undefined,
    arrivalState: undefined,
    remark: undefined,
    url: undefined,
    goodsImage: undefined,
    miId: undefined,
    createdId: undefined //需求提出人
  }
  fileList.value = []
}
const oncancel = () => {
  emit('cancle')
  resetForm()
}
</script>

<style scoped lang="scss">
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

:deep(.el-input__wrapper, ) {
  background: #f3f4f7 !important;
}

:deep(.el-select__wrapper) {
  background: #f3f4f7 !important;
}

:deep(.el-form-item__label) {
  height: 20px;
  font-size: 12px;
  color: #666666;
  line-height: 20px;
}

:deep(.el-step__head) {
  background: red !important;
}

:deep(.el-step__icon) {
  background: red !important;
}

.title-wapper {
  margin-bottom: 15px;

  .title-icon {
    display: inline-block;
    width: 3px;
    height: 10px;
    background: #0064ff;
    border-radius: 2px;
  }

  .title {
    margin-left: 9px;
    height: 20px;
    font-size: 14px;
    color: #333333;
  }
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  box-shadow: none;
}

.flex-row {
  display: flex;
  flex-direction: row;
  width: 100%;

  .item {
    width: 50%;
    margin-right: 10px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }

  .item:last-child {
    margin-right: 0;
  }
}

.select-item {
  cursor: pointer;
  width: 100%;
  height: 33px;
  line-height: 33px;
  font-weight: 400;
  font-size: 12px;
  text-align: center;
}

.activeOne {
  background: #f3f4f7;
  color: #0064ff;
}

.itemOne {
  background: url('@/assets/imgs/team/selectOne.png');
  background-size: 100% 100%;
}

.itemTwo {
  background: url('@/assets/imgs/team/selectTwo.png');
  background-size: 100% 100%;
}

:deep(.el-input-group__prepend) {
  box-shadow: none;
}

.custom-require {
  color: red;
  margin-right: 3px;
  font-size: 15px;
}
</style>
