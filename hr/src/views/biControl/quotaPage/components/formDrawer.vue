<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" @close="reset" @before-close="beforeClose"
    :show-befor-close="true">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="100" :rules="fromRules" ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统名称" prop="sysCode">
              <el-select class="!w300px" v-model="formParams.sysCode" clearable filterable placeholder="请选择"
                value-on-clear="">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_BUSINESS_TYPE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="模块CODE" prop="moduleCode">
              <el-input v-model.trim="formParams.moduleCode" class="!w300px" placeholder="只能为英文/数组/_组成,且不能以数字开头"
                :disabled="!['add', 'copy'].includes(drawerType)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页面名称" prop="webCode">
              <el-select class="!w300px" v-model="formParams.webCode" placeholder="请选择" value-on-clear="" filterable
                @change="handleWebCodeChange">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.METRIC_WEB_CODE, true)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="模块名称" prop="moduleName">
              <el-input v-model.trim="formParams.moduleName" class="!w300px" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="对应业务表" prop="businessTable">
          <s-text-area v-model="formParams.businessTable" style="width: 100%;" placeholder="请输入"
            :autosize="{ minRows: 2, maxRows: 4 }" />
        </el-form-item>

        <div class="tag-container">
          <div class="tag-all-title">可选指标设置
          </div>
          <div class="tag-list">
            <div class="tag-list-left">
              <div class="tag-all-title-sub">待选择指标<span style="font-size: 12px;color: #666;">(当前:{{ currentAllNums
                  }},总数:{{
                    allNums }})</span></div>
              <el-input v-model.trim="searchInput" placeholder="搜索指标" class="mb5px" clearable />
              <div class="left-height">
                <el-checkbox-group v-model="checkList" @change="handleCheckListChange">
                  <div v-for="key in Object.keys(showTagList)" :key="key">
                    <div class="tag-all-title-each"
                      :class="[{ 'tag-all-title-each-check': isKeyCheckAll(showTagList[key]) }]">
                      <div class="all-check-box" :class="[{ 'all-check-box-check': isKeyCheckAll(showTagList[key]) }]"
                        @click="checkGroups(showTagList[key])">
                        <el-icon :size="12" color="#ffffff" v-show="isKeyCheckAll(showTagList[key])">
                          <Check />
                        </el-icon>
                      </div>
                      <span class="tag-all-title-each-name" @click="checkGroups(showTagList[key])">{{
                        getDictLabel(DICT_TYPE.METRIC_TYPE,
                          key) || '-' }}</span>
                      <span class="tag-all-title-each-num">(总:{{ getGroupCheckNums(key) }}/{{ tagList[key].length
                      }},当前:{{ keyCheckCurrentNums(showTagList[key]) }}/{{ showTagList[key].length }})</span>
                    </div>
                    <div class="tag-list-left-item">
                      <div v-for="item in showTagList[key]" :key="item.id">
                        <el-checkbox :label="item.metricName" :value="item.id" />
                      </div>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <div class="tag-list-right">
              <div class="tag-all-title-sub">前端可选指标</div>
              <div class="flex-space" style="margin-bottom: 5px;">
                <div>已选({{ canSelectCheckList.length }}/{{ canSelectCheckTagList.length }})</div>
                <el-button link type="primary" @click="handleClearCanSelect">清空</el-button>
              </div>
              <el-checkbox-group v-model="canSelectCheckList" class="right-height" @change="handlecanSelectChange"
                :max="maxLen">
                <VueDraggable v-model="canSelectCheckTagList" :animation="150" ghostClass="ghost">
                  <div class="flex-space" v-for="item in canSelectCheckTagList" :key="item.id">
                    <el-checkbox :label="item.metricName" :value="item.id" />
                    <img class="item-img" src="@/assets/imgs/biControl/sort.png" alt="" />
                  </div>
                </VueDraggable>
              </el-checkbox-group>
            </div>
            <div class="tag-list-right">
              <div class="tag-all-title-sub">前端默认指标</div>
              <div class="flex-space" style="margin-bottom: 5px;">
                <div>已选({{ defaultCheckTagList.length }}/{{ maxLen }})</div>
                <el-button link type="primary" @click="handleClearDefault">清空</el-button>
              </div>
              <div class="right-height">
                <VueDraggable v-model="defaultCheckTagList" :animation="150" ghostClass="ghost">
                  <div v-for="item in defaultCheckTagList" :key="item.id" class="flex-space">
                    <div class="flex"><el-icon class="delete-icon" @click="handleDeleteDefaultCheck(item.id)">
                        <Delete />
                      </el-icon>{{ item.metricName }}</div>
                    <img class="item-img" src="@/assets/imgs/biControl/sort.png" alt="" />
                  </div>
                </VueDraggable>
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="备注" prop="remark" style="margin-top: 18px;">
          <s-text-area v-model="formParams.remark" style="width: 100%;" placeholder="请输入说明"
            :autosize="{ minRows: 2, maxRows: 4 }" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleCloseDrawer">关闭</el-button>
      <el-button type="primary" class="mr20px" @click="submitForm" :disabled="drawerLoading">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getSysMetricGroupById, saveAndUpdateSysMetricGroup, getAll } from '@/api/biControl/quota/index'
import { consistency } from "@/utils";
import { cloneDeep } from 'lodash-es';
import { VueDraggable } from 'vue-draggable-plus'
const message = useMessage() // 消息弹窗
//弹框显示
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const maxLen = 28
// 请求参数
const formParams = ref({
  //系统编码;BI-BI系统
  sysCode: "BI",
  //页面名称
  webCode: "",
  webName: "",
  //模块编码
  moduleCode: "",
  moduleName: "",
  businessTable: "",
  id: undefined,
  //前端可选类型
  webSelectList: [] as any[],
  //前端默认选项
  webDefaultList: [] as any[],
  remark: "",
})
const searchInput = ref('')
const formRef = ref()
const fromRules = reactive({
  moduleCode: [{ required: true, message: '请输入模块CODE', trigger: 'blur' },
  {
    pattern: /^[a-zA-Z_][0-9a-zA-Z_]*$/, message: '模块CODE只能为英文/数组/_组成,且不能以数字开头', trigger: 'blur'
  }],
  webCode: [{ required: true, message: '请选择页面名称', trigger: 'blur' }],
  moduleName: [{ required: true, message: '请输入模块名称', trigger: 'blur' }],
})
const hostoryData = ref({})

//打开弹框
const open = async (type, id) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : type === 'copy' ? '复制' : '查看'
  hostoryData.value = cloneDeep(formParams.value)
  getAllTag(id)
  if (id) {
    formParams.value.id = id
    try {
      drawerLoading.value = true
      const res = await getSysMetricGroupById(id)
      if (res && res.data) {
        const detail = {} as any
        Object.keys(res.data).forEach(key => {
          if (Object.keys(formParams.value).includes(key)) {
            detail[key] = res.data[key]
          }
        })

        const checkids = [] as any[];
        const defaultids = [] as any[];
        if (res.data.webSelectListDetail && Array.isArray(res.data.webSelectListDetail)) {
          res.data.webSelectListDetail.map(item => {
            checkids.push(item.id)
          })
        }
        if (res.data.webDefaultListDetail && Array.isArray(res.data.webDefaultListDetail)) {
          res.data.webDefaultListDetail.map(item => {
            defaultids.push(item.id)
          })
        }

        checkList.value = cloneDeep(checkids);
        canSelectCheckTagList.value = cloneDeep(res.data.webSelectListDetail);
        canSelectCheckList.value = cloneDeep(defaultids);
        defaultCheckTagList.value = cloneDeep(res.data.webDefaultListDetail);
        if (type === 'copy') {
          detail.id = undefined
          detail.moduleCode = ''
          detail.moduleName = ''
          detail.webCode = ''
        }
        formParams.value = detail
        hostoryData.value = cloneDeep(detail)
      }
    } finally {
      drawerLoading.value = false
    }
  } else {
  }
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  await formRef.value.validate()

  // 提交请求
  drawerLoading.value = true
  try {
    const data = cloneDeep(formParams.value) as any;
    const webSelectList = [] as any[];
    const webDefaultList = [] as any[];
    canSelectCheckTagList.value.map(item => {
      webSelectList.push({ metricId: item.id })
    })
    defaultCheckTagList.value.map(item => {
      webDefaultList.push({ metricId: item.id })
    })
    data.webSelectList = webSelectList;
    data.webDefaultList = webDefaultList;
    if (['add', 'copy'].includes(drawerType.value)) {
      data.id = undefined
      await saveAndUpdateSysMetricGroup(data)
      reset()
      message.success('新增成功')
    } else {
      await saveAndUpdateSysMetricGroup(data)
      reset()
      message.success('修改成功')
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emits('success')
  } finally {
    drawerLoading.value = false
  }
}
const beforeClose = (done: Function) => {
  consistency(hostoryData.value, formParams.value, done)
};

const handleCloseDrawer = () => {
  beforeClose(() => {
    drawerVisible.value = false;
  });
}

const reset = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  formParams.value = {
    //系统编码;BI-BI系统
    sysCode: "BI",
    //页面名称
    webCode: "",
    webName: "",
    //模块编码
    moduleCode: "",
    moduleName: "",
    businessTable: "",
    id: undefined,
    //前端可选类型
    webSelectList: [] as any[],
    //前端默认选项
    webDefaultList: [] as any[],
    remark: "",
  }
  checkList.value = []
  canSelectCheckTagList.value = []
  canSelectCheckList.value = [];
  defaultCheckTagList.value = [];
  searchInput.value = ''
}
//带选择指标区选中
const checkList = ref<any[]>([]);
//前端可选指标
const canSelectCheckTagList = ref<any[]>([]);
//前端可选指标 - 选中id
const canSelectCheckList = ref<any[]>([]);
//前端默认指标
const defaultCheckTagList = ref<any[]>([]);

const showTagList = computed(() => {
  if (!searchInput.value) {
    return tagList.value
  }
  const newTagList = {} as any;
  Object.keys(tagList.value).map(key => {
    const arr = tagList.value[key].filter(item => item.metricName.includes(searchInput.value))
    if (arr?.length > 0) {
      newTagList[key] = arr
    }
  })
  return newTagList;
})

const currentAllNums = computed(() => {
  let nums = 0;
  Object.keys(showTagList.value).map(key => {
    nums += showTagList.value[key].length
  })
  return nums
})

const allNums = computed(() => {
  let nums = 0;
  Object.keys(tagList.value).map(key => {
    nums += tagList.value[key].length
  })
  return nums
})

const isKeyCheckAll = (row: any[]) => {
  return row.every(item => checkList.value.includes(item.id))
}

const keyCheckCurrentNums = (row: any[]) => {
  return row.filter(item => checkList.value.includes(item.id)).length
}

const dealTagHelp = (data: any[], checkVal: any) => {
  const checkTagList = [] as any[];
  const oldIds = [] as any[];
  data.map(item => {
    if (checkVal.includes(item.id)) {
      checkTagList.push(item)
      oldIds.push(item.id)
    }
  });
  const addIds = [] as any[];
  Object.keys(showTagList.value).map(key => {
    showTagList.value[key].map(item => {
      if (!oldIds.includes(item.id) && checkVal.includes(item.id)) {
        addIds.push(item.id)
        checkTagList.push(item)
      }
    })
  })
  return { checkTagList, addIds }
}

//待选择指标变化
const handleCheckListChange = (val: any) => {
  canSelectCheckTagList.value = canSelectCheckTagList.value.filter(item => val.includes(item.id));
  canSelectCheckList.value = canSelectCheckList.value.filter(id => val.includes(id));

  const tagSelect = dealTagHelp(canSelectCheckTagList.value, val);
  canSelectCheckTagList.value = tagSelect.checkTagList;
  // canSelectCheckList.value = [...canSelectCheckList.value, ...tagSelect.addIds];

  handlecanSelectChange(val, true);
}
//前端可选指标变化
const handlecanSelectChange = (val: any, filter = false) => {
  defaultCheckTagList.value = defaultCheckTagList.value.filter(item => val.includes(item.id));
  if (filter) {
    return
  }

  const defaultSelect = dealTagHelp(defaultCheckTagList.value, val);
  defaultCheckTagList.value = defaultSelect.checkTagList;
}
//默认指标删除
const handleDeleteDefaultCheck = (id: any) => {
  defaultCheckTagList.value = defaultCheckTagList.value.filter(item => item.id !== id);
  canSelectCheckList.value = canSelectCheckList.value.filter(item => item !== id);
}
//默认指标清空
const handleClearDefault = () => {
  const ids = defaultCheckTagList.value.map(item => item.id)
  canSelectCheckList.value = canSelectCheckList.value.filter(item => !ids.includes(item));
  defaultCheckTagList.value = []
}
//前端可选指标清空
const handleClearCanSelect = () => {
  const ids = canSelectCheckTagList.value.map(item => item.id)
  checkList.value = checkList.value.filter(item => !ids.includes(item));
  canSelectCheckTagList.value = [];
  canSelectCheckList.value = [];
  defaultCheckTagList.value = [];
}

const handleWebCodeChange = (val: any) => {
  formParams.value.webName = getDictLabel(DICT_TYPE.METRIC_WEB_CODE, val)
}

onMounted(() => {

})
const tagList = ref<any>({})
const getAllTag = async (id?) => {
  try {
    const res = await getAll()
    tagList.value = res && res.data ? res.data : {}
  } catch (err) { }
}

const checkGroups = (row: any[]) => {
  const ids = row.map(item => item.id);
  if (isKeyCheckAll(row)) {
    //清除全选
    checkList.value = checkList.value.filter(id => !ids.includes(id));
  } else {
    //全选
    checkList.value = [...new Set([...checkList.value, ...row.map(item => item.id)])];
  }
  handleCheckListChange(checkList.value)
}
//显示分组选中个数
const getGroupCheckNums = (key: string) => {
  return tagList.value[key].filter(item => checkList.value.includes(item.id)).length
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
@mixin flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}

.tag-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  color: #333;

  &-left,
  &-right {
    width: calc(100% - 462px);
    border: 1px solid #e8e8e8;
    padding: 10px;
    border-radius: 6px;

    &-item {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 10px;
      column-gap: 10px;
    }

    .left-height {
      height: calc(100vh - 562px);
      // height: 475px;
      overflow-y: auto;
    }

    .right-height {
      // height: 450px;
      height: calc(100vh - 547px);
      overflow-y: auto;
    }
  }

  &-right {
    width: 200px;
    margin-left: 20px;
  }

  :deep(.el-checkbox) {
    align-items: flex-start;

    .el-checkbox__input {
      margin-top: 2px;
    }
  }

  :deep(.el-checkbox__label) {
    color: #333;
    font-weight: normal;
    max-width: 140px;
    word-break: break-all;
    white-space: pre-line;
    line-height: 17px;
  }
}

.flex-space {
  @include flex-row;
  justify-content: space-between;
  align-items: flex-start
}

.flex-row {
  @include flex-row;
}

.tag-all-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  margin-bottom: 18px;

  &-sub {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }

  &-each {
    color: #444;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    @include flex-row;
    margin-bottom: 10px;

    &-check {
      color: #0064ff;
    }

    &-name {
      padding-left: 8px;
      cursor: pointer;
      color: #444;
    }

    &-num {
      color: #444;
    }

  }
}

.item-img {
  width: 25px;
  height: 25px;
  cursor: pointer;
  margin-top: -4px;
}

.delete-icon {
  cursor: pointer;
  margin-right: 8px;
  color: red;
}

.all-check-box {
  width: 12px;
  height: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  @include flex-row;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-color: #0064ff;
  }

  &-check {
    background-color: #0064ff;
    width: 14px;
    height: 14px;
    border: none;
  }
}

.flex-space+.flex-space {
  margin-top: 8px;
}
</style>
