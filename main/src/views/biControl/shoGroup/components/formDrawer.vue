<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" @close="reset">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="150" :rules="fromRules" ref="formRef">
        <el-form-item label="自定义分组名称" prop="groupName">
          <el-input v-model="formParams.groupName" placeholder="请输入分组名称" :disabled="!!formParams.id" />
        </el-form-item>
        <el-form-item label="店铺选择" prop="store">
          <el-cascader :options="storeList" :show-all-levels="false" style="width: 100%;" :props="storePropos"
            :collapse-tags="true" ref="storeCascader" v-model="selectStoreList" clearable />
        </el-form-item>
        <el-form-item label="已选店铺">
          <span v-if="showSelectStore.length > 0">
            <el-tag closable type="primary" v-for="(item, index) in showSelectStore" :key="index"
              style="margin-right: 5px;margin-bottom: 5px;" @close="handleRemoveStore(item)">
              {{ item.name }}
            </el-tag>
          </span>
          <span v-else>-</span>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button type="primary" class="mr20px" @click="submitForm" :disabled="drawerLoading">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import * as storeGroupApi from '@/api/biControl/storeGroup/index'
import { queryStoreTree } from '@/api/common'
const message = useMessage() // 消息弹窗
//弹框显示
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false);
const drawerType = ref('')
// 请求参数
const formParams = ref({
  groupName: '',
  store: '',
  id: undefined
})

const formRef = ref();

const validateGroupName = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入分组名称!'))
  } else if (value.length < 2 || value.length > 15) {
    callback(new Error("分组名称限制2-15个字!"))
  } else if (/^\d+$/.test(value)) {
    callback(new Error("不允许输入纯数字!"))
  } else if (/^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/.test(value) === false) {
    callback(new Error("仅允许输入汉字、英文、数字、_、-的组合!"))
  } else {
    callback()
  }
}

const fromRules = reactive({
  'groupName': [{ validator: validateGroupName, trigger: 'blur', required: true }],
  'store': [{ required: true, message: '请选择店铺', trigger: 'blur' }]
});

const storePropos = {
  multiple: true,
  value: 'storeCode',
  label: 'shopName',
  children: "stores",
  emitPath: false
}
const storeList = ref<any>([])
const channelList = [] as any
//获取店铺数据
async function getAllData() {
  try {
    const res = await queryStoreTree({
      isPermission: 2
    })
    if (Array.isArray(res)) {
      res.map(item => {
        if (Object.keys(item).includes('platFormId')) {
          item.storeCode = item.platFormId
          item.shopName = item.platFormName
          channelList.push(item)
        }
      })
      storeList.value = res
    }
  } catch (error) { }
}
const storeCascader = ref();
const selectStoreList = ref([]);
//展示选择店铺
const showSelectStore = ref([]);

//打开弹框
const open = async (type, originData?: any) => {
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'
  try {
    drawerLoading.value = true
    await getAllData()
    if (originData) {
      formParams.value = {
        id: originData.id,
        groupName: originData.groupName,
        store: originData.storeList.map(item => item.code).join(','),
      }
      const select = [] as any
      const selectShow = [] as any
      if (Array.isArray(originData?.storeList)) {
        originData?.storeList.map(item => {
          select.push(item.code)
          selectShow.push({
            name: channelList.find(val => val.platFormId === item.channel)?.platFormName + '/' + item.name,
            id: item.code
          })
        })
      }
      selectStoreList.value = select
    }
  } catch (error) { } finally {
    drawerLoading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    // 提交请求
    drawerLoading.value = true
    const data = formParams.value as any

    if (drawerType.value === 'add') {
      data.id = undefined
      await storeGroupApi.addGroup(data)
      reset()
      message.success('新增成功')
    } else {
      await storeGroupApi.editGroup(data)
      reset()
      message.success('修改成功')
    }
    // 发送操作成功的事件
    emits('success')
  } finally {
    setTimeout(() => {
      drawerLoading.value = false
    }, 1000)
  }
}

const reset = () => {
  formRef.value?.clearValidate()
  formRef.value?.resetFields()
  formParams.value.id = undefined
  selectStoreList.value = []
  showSelectStore.value = []
  drawerVisible.value = false
}
//移除
function handleRemoveStore(item: any) {
  selectStoreList.value = selectStoreList.value.filter(val => val !== item.id)
}
watch(selectStoreList, (val) => {
  nextTick(() => {
    //pathLabels
    const data = storeCascader.value.getCheckedNodes(true)
    const selectShow = [] as any
    if (Array.isArray(data) && data.length > 0) {
      data.map(item => {
        if (Object.prototype.toString.call(item) === '[object Object]' && Object.keys(item).includes('pathLabels')) {
          selectShow.push({
            name: item.pathLabels?.join('/'),
            id: item.value
          })
        }
      })
    }
    showSelectStore.value = selectShow
    formParams.value.store = val.join(',')
  })
})
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  border-radius: 20px;
  padding: 20px;
}
</style>