<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>编辑配置</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="70px">
        <div class="drawerContent">
          <el-form-item label="编号" prop="number">
            <div class="drawerContent-disabledInput disabledInput_cover">{{ formData.number }}</div>
          </el-form-item>

          <el-form-item label="结果" prop="result" required>
            <el-input v-model="formData.result" class="dialogFormItemWidth" style="width: 100%" />
          </el-form-item>
          <el-form-item label="定位" prop="position" required>
            <el-input v-model="formData.position" class="dialogFormItemWidth" style="width: 100%" />
          </el-form-item>
          <el-form-item label="背景色" prop="backgroundColor" required>
            <el-select class="dialogFormItemWidth" v-model="formData.backgroundColor" placeholder="" clearable
              style="width: 80px">
              <template #label>
                <span class="status">
                  <span class="icon" :class="formatIconBg(formData.backgroundColor)"></span>
                </span>
              </template>
              <el-option v-for="dict in colorList" :key="dict.value" :label="dict.label" :value="dict.value">
                <span class="status">
                  <span class="icon" :class="formatIconBg(dict.value)"></span>
                  <span> {{ dict.label }}</span>
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="describeMes">
            <s-text-area class="dialogFormItemWidth" v-model="formData.describeMes" placeholder="请输入"
              style="width: 100%" :autosize="{ minRows: 4, maxRows: 5 }" />
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AddForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as sudokuSetApi from '@/api/otr/sudokuSet'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const formData = ref({
  id: undefined,
  number: '',
  result: '',
  position: '',
  backgroundColor: '',
  describeMes: ''
})

// 校验规则
const formRules = reactive({
  result: [
    { required: true, message: '请输入结果', trigger: 'blur', whitespace: true },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  position: [
    { required: true, message: '请输入定位', trigger: 'blur', whitespace: true },
    { max: 10, message: '长度不能超过10个字符', trigger: 'blur' }
  ],
  backgroundColor: [{ required: true, message: '请选择背景色', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 编辑时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await sudokuSetApi.getSudokuSetDetailById(id)

      formData.value = {
        ...data
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      ...formData.value
    }
    // console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      // await sudokuSetApi.addData(data)
      message.success(t('common.createSuccess'))
    } else {
      await sudokuSetApi.updateSudokuSetDetail(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success', data.nineGridId)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    number: '',
    result: '',
    position: '',
    backgroundColor: '',
    describeMes: ''
  }
}

// 获取盘点方案列表
interface OptionItem {
  label: string
  value: string
}
// 1. 红色：#ee6570
// 2. 绿色：#61D692
// 3. 蓝色：#6EB6ED
// 4. 黄色：#F8CF19
// 5. 青色：#83d5cc
// 6. 品红：#e8b8e8
// 7. 橙色：#edbf8a
// 8. 紫色：#CE9CFF
// 9. 粉色：#F7939B
// 按照上面的颜色顺序，定义颜色列表
const colorList: OptionItem[] = [
  { label: '红色', value: '#ee6570' },
  { label: '绿色', value: '#61D692' },
  { label: '蓝色', value: '#6EB6ED' },
  { label: '黄色', value: '#F8CF19' },
  { label: '青色', value: '#83d5cc' },
  { label: '品红', value: '#e8b8e8' },
  { label: '橙色', value: '#edbf8a' },
  { label: '紫色', value: '#CE9CFF' },
  { label: '粉色', value: '#F7939B' }
]
//状态对应的 css 类名
const formatIconBg = (value) => {
  const colorMap = {
    '#ee6570': 'color_red',
    '#61D692': 'color_green',
    '#6EB6ED': 'color_blue',
    '#F8CF19': 'color_yellow',
    '#83d5cc': 'color_cyan',
    '#e8b8e8': 'color_magenta',
    '#edbf8a': 'color_orange',
    '#CE9CFF': 'color_purple',
    '#F7939B': 'color_pink'
  }
  return colorMap[value] || 'ing'
}
</script>

<style lang="scss" scoped>
.status {
  border-radius: 12px;
  padding: 2px 8px;
  box-sizing: border-box;
  display: block;
  width: 100%;
  text-align: center;

  .icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .color_red {
    background-color: #ee6570;
  }

  .color_green {
    background-color: #61d692;
  }

  .color_blue {
    background-color: #6eb6ed;
  }

  .color_yellow {
    background-color: #f8cf19;
  }

  .color_cyan {
    background-color: #83d5cc;
  }

  .color_magenta {
    background-color: #e8b8e8;
  }

  .color_orange {
    background-color: #edbf8a;
  }

  .color_purple {
    background-color: #ce9cff;
  }

  .color_pink {
    background-color: #f7939b;
  }
}

// 修改多选框的背景色
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #bfc9d266;
  border-radius: 15px;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 修改弹窗的标题样式
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-disabledInput {
    width: 310px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    word-wrap: break-word;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  // 选择背景色
  .color-box {
    width: 22px;
    height: 22px;
    background: #61d692;
    border-radius: 4px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
