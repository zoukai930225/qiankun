<template>
  <div>
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="958" ref="drawerRef">
      <el-scrollbar ref="scrollRef">
        <div class="drawerContent">
          <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
            label-width="55px" scroll-to-error>
            <el-form-item label="分类" prop="typeCode">
              <el-select class="dialogFormItemWidth" v-model="formData.typeCode" placeholder="请选择" clearable>
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.OTR_PROGRAM_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="维度" prop="dimension">
              <el-select class="dialogFormItemWidth" v-model="formData.dimension" placeholder="请选择" clearable>
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input class="dialogFormItemWidth" v-model.trim="formData.name" placeholder="请输入名称" clearable
                maxlength="500" />
            </el-form-item>
            <el-form-item label="定义" prop="definition">
              <s-text-area class="dialogFormItemWidth" v-model.trim="formData.definition" placeholder="请输入定义"
                :autosize="{ minRows: 3, maxRows: 4 }" maxlength="500" />
            </el-form-item>
          </el-form>
        </div>

        <div class="drawerContent" v-for="(item, index) in list" :key="index">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>等级</div>
            <div class="drawerContent-item" @click="deleteClick(index)">
              <img class="drawerContent-item-icon" v-if="index == list.length - 1 && index != 0"
                src="@/assets/imgs/common/del.png" />
              <img v-else class="drawerContent-item-icon" src="@/assets/imgs/otr/schemeSet/delete_icon.png" />
            </div>
          </div>

          <el-form class="degreeForm" :model="item" label-width="105px" :rules="degreeFormRules" ref="degreeFormRef">
            <el-form-item prop="name" label="等级名称">
              <div class="itemBg">
                <el-input v-model.trim="item.name" placeholder="请输入" clearable maxlength="500" />
              </div>
            </el-form-item>

            <el-form-item prop="objectName" label="等级分值">
              <div class="form-item">
                <el-input-number v-model="item.minScore" :min="0" :max="100" placeholder="请输入" />
                <span class="mid">至</span>
                <el-input-number v-model="item.maxScore" :min="0" :max="100" placeholder="请输入" />
              </div>
            </el-form-item>

            <el-form-item prop="description" label="等级描述">
              <s-text-area class="dialogFormItemWidth" v-model.trim="item.description" placeholder="请输入"
                :autosize="{ minRows: 3, maxRows: 4 }" maxlength="500" />
            </el-form-item>
          </el-form>
        </div>

        <div class="addMoreBg">
          <div class="addMore" @click="addMoreClick">
            <el-icon class="addMore-icon" color="#0064ff" :size="12">
              <Plus />
            </el-icon>
            <div class="addMore-text">添加新等级</div>
          </div>
        </div>

        <div class="drawerFooter">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm">
            {{ '提交' }}</el-button>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ElNotification } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { addProgramSave, updateProgramSave, getProgramById } from '@/api/otr/projectSet'

const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const scrollRef = ref()
const drawerRef = ref()
const formData = ref({
  id: '',
  typeCode: undefined, //分类
  dimension: undefined, //维度
  name: undefined, //项目名称
  definition: undefined
})

// 项目对象列表
const list = ref([
  {
    name: undefined, //等级名称
    description: undefined, //等级描述
    minScore: 0, //等级最小分值
    maxScore: 1 //等级最大分值
  }
])

const storeData = ref({
  store: '',
  storeName: '',
  companyName: '',
  channelName: ''
})

const formRef = ref() // 表单 Ref

const formRules = reactive({
  typeCode: [{ required: true, message: '请选择分类', trigger: 'change' }],
  dimension: [{ required: true, message: '请选择维度', trigger: 'change' }],
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  definition: [{ required: false, message: '请输入项目定义', trigger: 'change' }]
})

const degreeFormRef = ref()
const degreeFormRules = reactive({
  name: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
  objectName: [{ required: true, message: '', trigger: 'change' }],
  description: [{ required: true, message: '请输入等级描述', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (id?: string) => {
  drawerVisible.value = true
  dialogTitle.value = id ? '编辑' : '新增'
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const res = await getProgramById({ id })
      formData.value = {
        id: res.id,
        typeCode: res.typeCode, //分类
        dimension: res.dimension, //维度
        name: res.name, //项目名称
        definition: res.definition
      }
      list.value = res.programRankList || []
    } finally {
      formLoading.value = false
    }
  }
}

// 点击添加
const addMoreClick = async () => {
  // 校验表单
  if (list.value.length) {
    const item = list.value[list.value.length - 1]
    if (!item.name) {
      message.error('请完善等级名称')
      return
    }
    if ((!item.minScore && item.minScore != 0) || !item.maxScore) {
      message.error('请完善等级分值')
      return
    }
    if (!item.description) {
      message.error('请完善等级描述')
      return
    }
    if (Number(item.minScore) > Number(item.maxScore)) {
      message.error('等级最大分不能小于等级最小分值')
      return
    }
    list.value.push({
      name: undefined, //等级名称
      description: undefined, //等级描述
      minScore: Number(item.maxScore) + 1, //等级最小分值
      maxScore: Number(item.maxScore) + 2 //等级最大分值
    })
  } else {
    //判断上一个有没有填写完成
    list.value.push({
      name: undefined, //等级名称
      description: undefined, //等级描述
      minScore: 0, //等级最小分值
      maxScore: 1 //等级最大分值
    })
  }
}
// 删除按钮点击
const deleteClick = (index) => {
  if (index == 0) return
  if (index == list.value?.length - 1) {
    list.value.splice(index, 1)
  }
}
//  校验连续
const isContinuous = () => {
  const arr = list.value
  let errors: string[] = []
  for (let i = 1; i < arr.length; i++) {
    //@ts-ignore
    if (arr[i].minScore != arr[i - 1].maxScore + 1) {
      errors.push(`等级 第${i + 1}项和第${i}项 等级分值要连续`)
    }
  }
  return errors
}

// 校验选项是不是为空
const formatList = () => {
  const arr = list.value
  let errors: string[] = []
  arr.forEach((obj, index) => {
    if (!obj.name) {
      errors.push(`等级 第${index + 1}项 等级名称不能为空`)
    }
    if (!obj.minScore && index != 0) {
      errors.push(`等级 第${index + 1}项 等级分值最小值不能为空`)
    }
    if (!obj.maxScore && obj.maxScore != 0) {
      errors.push(`等级 第${index + 1}项 等级分值最大分值不能为空`)
    }
    if (index == 0 && obj.minScore != 0) {
      errors.push(`等级 第1项最小值必须是0`)
    }
    if (Number(obj.minScore) > Number(obj.maxScore)) {
      errors.push(`等级 第${index + 1}项，最大分不能小于等级最小分值`)
    }
    if (Number(obj.minScore) == Number(obj.maxScore)) {
      errors.push(`等级 第${index + 1}项，最大分不能等于等级最小分值`)
    }
    if (!obj.description) {
      errors.push(`等级 第${index + 1}项 等级描述不能为空`)
    }
  })
  return errors
}

const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 选项空值校验
  const err = formatList()
  if (err.length) {
    message.error(err[0])
    return
  }
  // 测试连续
  const errs = isContinuous()
  if (errs.length) {
    message.error(errs[0])
    return
  }

  const data = {
    ...formData.value,
    programRankList: list.value
  }

  if (formData.value.id) {
    await updateProgramSave(data)
    message.success('操作成功')
    drawerVisible.value = false
    emit('success')
  } else {
    await addProgramSave(data)
    message.success('操作成功')
    drawerVisible.value = false
    emit('success')
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    typeCode: undefined,
    dimension: undefined,
    name: undefined,
    definition: undefined
  }
  storeData.value = {
    store: '',
    storeName: '',
    companyName: '',
    channelName: ''
  }
  formRef.value?.resetFields()
  list.value = [
    {
      name: undefined, //等级名称
      description: undefined, //等级描述
      minScore: 0, //等级最小分值
      maxScore: 1 //等级最大分值
    }
  ]
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}

.drawerContent {
  margin-right: 10px;
  // width: 100%;
  padding: 16px 20px 1px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  &-item {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-icon {
      width: 14px;
      height: 14px;
    }
  }

  .itemBg {
    width: 100%;
    height: 32px;
    // background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }

  .seeBg {
    width: 100%;
    height: 32px;
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;

    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }

  .evaluateWeidu {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-add {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
  margin-right: 10px;
}

.dialogFormItemWidth {
  width: 100%;
}

.addMoreBg {
  width: calc(100%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .addMore {
    cursor: pointer;
    width: 116px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;

    &-icon {
      margin-left: 20px;
      margin-right: 6px;
    }

    &-text {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }
}

:deep(.el-textarea__inner),
:deep(.el-input__wrapper) {
  color: #333;
  font-size: 14px;
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__header) {
  margin-bottom: 0px;
}

:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}

:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}

.form-item {
  width: 100%;

  .start {
    width: 46%;
  }

  .mid {
    margin: 0 20px;
  }

  .end {
    width: 46%;
  }
}
</style>
