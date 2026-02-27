<template>
  <el-card shadow="never" class="search-body" ref="bodyRef">
    <template #header>
      <div class="title">{{ operationTitle }}</div>
    </template>
    <el-scrollbar>
      <div class="p20px">
        <el-form :model="paramsData" ref="paramsFormRef" :rules="paramsRules">
          <el-form-item label="填报日期" prop="submissionDate">
            <el-date-picker v-model="paramsData.submissionDate" type="date" value-format="YYYY-MM-DD"
              format="YYYY-MM-DD" :disabled-date="disabledDate" :disabled="operationType !== 'add'"/>
          </el-form-item>
        </el-form>
        <!-- 今日工作内容 -->
        <todayWork v-model:data="paramsData.todayJobList" :type="operationType" ref="todayWorkRef" :maxNum="10"/>
        <!-- 核心工作进度 -->
        <mainWork v-model:data="paramsData.coreWorkProgressList" :type="operationType" ref="mainWorkRef" :maxNum="10"/>
        <!-- 需要协助与帮助 -->
        <needHelp v-model:data="paramsData.assistanceHelpList" :type="operationType" ref="needHelpRef" :maxNum="10"/>
      </div>
    </el-scrollbar>
    <template #footer>
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" v-if="operationType !== 'view'" @click="handleSubmit" :disabled="submitLoading">提交</el-button>
    </template>
  </el-card>
</template>
<script setup lang="ts">
import { debounce } from "lodash-es";
import { selectSupplierList, selectWdtGoodsList, addQCDailyReportInfo,getQCDailyReportInfoById,editQCDailyReportInfo } from '@/api/supplier/qcManagement/qcDailyReport'
import dayjs from 'dayjs'
import todayWork from './components/todayWork.vue'
import mainWork from './components/mainWork.vue'
import needHelp from './components/needHelp.vue'
const route = useRoute()
const router = useRouter()
const message = useMessage()
import { closeCurrentTag } from '@/utils/index'

const { currentRoute, push } = useRouter()

//供应商列表 商品款号列表
const supplierList = ref<any>([])
const WdtGoodsList = ref<any>([])
const getSelectOptions = () => {
  selectSupplierList().then((res: any) => {
    if (res && res.length) {
      supplierList.value = res.map((sup: any) => ({
        label: sup.abbreviationCompany || sup.fullCompany,
        value: sup.id,
        fullName: sup.fullCompany
      }))
    }
  })
  selectWdtGoodsList().then((res: any) => {
    if (res && res.length) {
      WdtGoodsList.value = res.map((goods: any) => ({
        label: goods.goodsNo,
        value: goods.goodsId + ''
      }))
    }
  })
}
provide('selectOptions', { supplierList, WdtGoodsList })

const today = dayjs().format('YYYY-MM-DD')
const disabledDate = (time: Date) => {
  const today = new Date()
  return time.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)
}
const paramsFormRef = ref()
const paramsRules = reactive({
  submissionDate:[{required:true,message:'请选择填报日期',trigger:['blur','change']}]
})
const submissionDateValidate = async()=>{
  return await paramsFormRef.value?.validate()
}
const paramsData = ref<any>({
  submissionDate: '',
  todayJobList: [] as any,
  coreWorkProgressList: [] as any,
  assistanceHelpList: [] as any
})
const todayWorkRef = ref()
const mainWorkRef = ref()
const needHelpRef = ref()
const submitLoading = ref(false)
const handleSubmit =debounce(async () => {
  await Promise.all([submissionDateValidate(),todayWorkRef.value?.formValidate(), mainWorkRef.value?.formValidate(), needHelpRef.value?.formValidate()])
  submitLoading.value = true
  const { id,submissionDate,todayJobList,coreWorkProgressList,assistanceHelpList } = paramsData.value
  const params = {
    id:id|| undefined,
    dataSource: 1,
    submissionDate,
    todayJobList:todayJobList.map((data:any)=>({
      ...data,
      itemNumber:data.itemNumber.join(',')
    })),
    coreWorkProgressList,
    assistanceHelpList
  }
  if(operationType.value === 'add'){
    addQCDailyReportInfo(params).then((res:any)=>{
      if(res){
        message.success('新增成功')
        submitLoading.value = false
        setTimeout(()=>{
          goBack()
        },300)
      }
    }).catch(()=>{
      submitLoading.value = false
    })
  }else{
    editQCDailyReportInfo(params).then((res:any)=>{
      if(res){
        message.success('编辑成功')
        submitLoading.value = false
        setTimeout(()=>{
          goBack()
        },300)
      }
    }).catch(()=>{
      submitLoading.value = false
    })
  }
}) 

const goBack = () => {
  // router.push({path:'/admin/SC/qc/qcDailyReport'})
  closeCurrentTag(currentRoute, push)
  router.push({name:'qcDailyReport'})
}
const operationType = ref<any>('')
const operationTitle = ref<any>('')
onMounted(async() => {
  const { type, id } = route.query
  operationType.value = type
  operationTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'
  getSelectOptions()
  if(id){
    getQCDailyReportInfoById(id).then((res:any)=>{
      paramsData.value = {...res,
        todayJobList:res.todayJobList.map((data:any)=>({
          ...data,
          itemNumber:data.itemNumber.split(',')
        }))
      }
    })
  }else{
    paramsData.value.submissionDate = today
    paramsData.value.todayJobList = [{
      supplier: '',
      itemNumber: '',
      specificMatters: '',
      isQualified: '',
      problemDescription: '',
      remarks: ''
    }]
    paramsData.value.coreWorkProgressList = [{
      supplier:'',
      progressDescription:'',
    }]
    paramsData.value.assistanceHelpList = [{
      isNeedAssistance:'',
      description:'',
    }]
  }
})

</script>

<style lang="scss" scoped>
.search-body {
  height: calc(100vh - var(--tags-view-item-height) - var(--top-tool-height) - var(--app-content-padding) - 10px);
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 10px;

  :deep(.el-card__header) {
    .title {
      color: #333;
      font-weight: 600;
    }
  }

  :deep(.el-card__body) {
    height: calc(100% - 106px);
    padding: 0;
  }

  :deep(.el-card__footer) {
    text-align: right;
    border-top: none;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
    padding: 10px;
  }
}
</style>
