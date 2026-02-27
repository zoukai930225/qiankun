<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="content" v-loading="drawerLoading">
      <el-form :model="formParams" label-width="130" :rules="fromRules" ref="formRef">
        <div class="customerService card">
          <div class="header">
            <div class="line"></div>
            <span>客服人员维护</span>
          </div>
          <div class="inner">
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属仓库" prop="warehouse">
                  <el-select
                    class="!w300px"
                    v-model="formParams.warehouse"
                    placeholder="请选择所属仓库"
                    filterable
                    :disabled="isShow || isHandle"
                    @change="handleWarehouseChange"
                    :suffix-icon="(isShow || isHandle)? '':'ArrowDown'"
                  >
                    <el-option
                      v-for="item in getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, true)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="订单编号" prop="orderNo">
                  <el-input
                    v-model="formParams.orderNo"
                    class="!w300px"
                    placeholder="请输入订单编号"
                    :disabled="isShow || isHandle"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="问题类型" prop="issueType">
                  <el-select
                    class="!w300px"
                    v-model="formParams.issueType"
                    placeholder="请选择问题类型"
                    filterable
                    :disabled="isShow || isHandle"
                    :suffix-icon="(isShow || isHandle)? '':'ArrowDown'"
                  >
                    <el-option
                      v-for="item in getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_ISSUE_TYPE, true)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="物流单号" prop="logisticsOrderNo">
                  <el-input
                    v-model="formParams.logisticsOrderNo"
                    class="!w300px"
                    placeholder="请输入物流单号"
                    :disabled="isShow || isHandle"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="快递重量" prop="courierWeight">
                  <el-input-number 
                    v-model="formParams.courierWeight"
                    class="!w300px"
                    placeholder="请输入快递重量"
                    :disabled="isShow || isHandle"
                    :controls="false"
                    :min="0" >
                    <template #suffix>
                      <span>KG</span>
                    </template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品编码" prop="productCode">
                  <el-input
                    v-model="formParams.productCode"
                    class="!w300px"
                    placeholder="请输入产品编码"
                    :disabled="isShow || isHandle"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品价值" prop="productValue">
                  <el-input-number
                    v-model="formParams.productValue"
                    class="!w300px"
                    placeholder="请输入产品价值"
                    :disabled="isShow || isHandle"
                    :controls="false"
                    :min="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="处理人" prop="handler">
                  <el-input
                    v-model="formParams.handler"
                    class="!w300px"
                    placeholder="请输入处理人"
                    :disabled="isShow || isHandle"
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预警时间" prop="warningTime">
                  <el-date-picker
                    class="!w300px"
                    v-model="formParams.warningTime"
                    placeholder="请选择预警时间"
                    :disabled="isShow || isHandle"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注(客服)" prop="csRemark">
                  <s-text-area
                    
                    v-model="formParams.csRemark"
                    class="!w730px"
                    placeholder="请填写备注"
                    :autosize="{ minRows: 3, maxRows: 4 }"
                    maxlength="200"
                    show-word-limit
                    :disabled="isShow || isHandle"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="图片" prop="">
                    <div class="fileList" v-if="isShow || isHandle">
                      <div class="file" v-for="(file,index) in imageList" :key="index">
                        <el-image
                          class="img"
                          :src="file.fileUrl"
                          :preview-src-list="[file.fileUrl ? file.fileUrl : '']"
                          fit="cover"
                        />
                        <div class="fileName">{{ file.fileName || '' }}</div>
                      </div>
                    </div>
                    <uploadImg 
                      v-model:modelValue="imageList"
                      v-else
                    />
                  </el-form-item>
                
              </el-col>
            </el-row>
          </div>
          
        </div>
        
        <div class="warehouse card" v-if="drawerType !== 'add'">
          <div class="header">
            <div class="line"></div>
            <span>仓库人员维护</span>
          </div>
          <div class="inner">
            <el-row>
              <el-col :span="24">
                <el-form-item label="问题是否存在" prop="warehouseIssueExistence">
                  <el-select
                    class="!w300px"
                    v-model:modelValue="formParams.warehouseIssueExistence"
                    placeholder="请选择"
                    filterable
                    :disabled="isShow"
                    :suffix-icon="(isShow )? '':'ArrowDown'"
                  >
                    <el-option label="是" :value="1"/>
                    <el-option label="否" :value="0"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="发货视频" prop="">
                  <div class="fileList" v-if="isShow">
                      <div class="file" v-for="(file,index) in videoList" :key="index">
                        <el-image
                          v-if="getFileType(file) === 'isImage'"
                          class="img"
                          :src="file.fileUrl"
                          :preview-src-list="[file.fileUrl ? file.fileUrl : '']"
                          fit="cover"
                        />
                        <img :src="videoIcon" class="img" v-else @click="openVideo(file.url)"/>
                        <div class="fileName">{{ file.fileName || '' }}</div>
                      </div>
                    </div>
                  <uploadImg
                    v-else 
                    v-model:modelValue="videoList" 
                    :canUploadVideo="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注(仓库)" prop="whRemark">
                  <s-text-area
                    
                    v-model="formParams.whRemark"
                    class="!w730px"
                    placeholder="请填写备注"
                    :autosize="{ minRows: 3, maxRows: 4 }"
                    maxlength="200"
                    show-word-limit
                    :disabled="isShow"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="reset" v-if="drawerType !== 'show'">关闭</el-button>
      <el-button @click="submit" type="primary" class="mr20px" v-if="drawerType !== 'show'">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as warehouseDockingApi from '@/api/customerService/warehouseDocking'
import videoIcon from '@/assets/svgs/videoIcon.svg';
// import uploadImg from '@/components/SWUoloadFile/index.vue'
import uploadImg from './uploadImg.vue'
// import dayjs from 'dayjs'
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const isShow = ref(false)
const isHandle = ref(false)
const open = async (type, id) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'handle' ? '处理' : '查看'
  isShow.value = type === 'show'
  isHandle.value = type === 'handle'
  if (id) {
    try {
      drawerLoading.value = true
      const data = await warehouseDockingApi.getDetailsById(id)
      console.log(data)
      if (data) {
        formParams.value = data
        imageList.value = data.imagesUrls? data.imagesUrls?.split(',').map((url:string)=>{
          const fileUrl = url.split('?name=')[0]
          const fileName = url.split('?name=')[1]
          return {
            url:fileUrl,
            name:fileName,
            fileUrl,
            fileName
          }
        }) : []
        videoList.value = data.shippingVideoUrls? data.shippingVideoUrls?.split(',').map((url:string)=>{
          const fileUrl = url.split('?name=')[0]
          const fileName = url.split('?name=')[1]
          return {
            url:fileUrl,
            name:fileName,
            fileUrl,
            fileName
          }
        }) : []
      }
    } finally {
      drawerLoading.value = false
    }
  } 
}

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
const getFileType = (file:any) => {
  const fileName = file.fileName 
  const type = fileName.split('.')[1]
  return imageTypes.includes(type)
  ? 'isImage':'isVideo'
}

// 预览视频
const openVideo = (url: any) => {
  window.open(url, '_blank')
}

// 请求参数
const formParams = ref({
  id: "",
  warehouse: "",
  orderNo: "",
  issueType: "",
  logisticsOrderNo: "",
  productCode: "",
  courierWeight: undefined,
  productValue: undefined,
  registrationTime: "",
  warningTime: "",
  registrar: "",
  handler: "",
  csRemark: "",
  imagesUrls: "",
  warehouseIssueExistence: undefined,
  shippingVideoUrls: "",
  whRemark: ""
})
const director = ref()
const imageList = ref<any>([]) // 图片
const videoList = ref<any>([]) // 视频
const formRef = ref()
const fromRules = reactive({
  warehouse: [{ required: true, message: '请选择所属仓库', trigger: ['blur','change'] }],
  orderNo: [{ required: true, message: '请填写订单编号', trigger: ['blur','change'] }],
  issueType: [{ required: true, message: '请选择问题类型', trigger: ['blur','change'] }],
  logisticsOrderNo: [{ required: true, message: '请输入物流单号', trigger: ['blur','change'] }],
  courierWeight: [{ required: true, message: '请输入快递重量', trigger: ['blur','change'] }],
  productCode: [{ required: true, message: '请输入产品编码', trigger: ['blur','change'] }],
  handler: [{ required: true, message: '请选择处理人', trigger: ['blur','change'] }],
  warningTime: [{ required: true, message: '请选择预警时间', trigger: ['blur','change'] }],
  warehouseIssueExistence:[{ required: true, message: '请选择问题是否存在', trigger: ['blur','change'] }],
})
const handleWarehouseChange = async(val:string) => {
  if(val){
    const data = await warehouseDockingApi.getHandlerByWarehouse(val)
    formParams.value.handler = data
  }
}
const submit = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    const image = imageList.value?.map((item) => `${item.fileUrl}?name=${item.fileName}`).join(',') || ''
    const video = videoList.value?.map((item) => `${item.fileUrl}?name=${item.fileName}`).join(',') || ''
    const params = { ...formParams.value, imagesUrls: image,shippingVideoUrls:video }
    console.log(params)
    if(drawerType.value === 'add'){
      await warehouseDockingApi.createData(params)
    }
    if(drawerType.value === 'handle'){
      await warehouseDockingApi.updateData(params)
    }
    message.success('保存成功')
    reset()
    emits('success')
  } finally {
  }
}
const reset = () => {
  director.value = null
  imageList.value = []
  videoList.value = []
  formRef.value?.resetFields()
  drawerVisible.value = false
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.content {
  .card{
    margin: auto;
    background-color: #fff;
    border-radius: 20px;
    margin-bottom: 20px;
    .header{
      padding: 16px 30px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      .line{
        width: 3px;
        height: 10px;
        background: #0064ff;
        margin-right: 6px;
      }
    }
    .inner{
      padding: 20px;
    }
  }
}
:deep(.el-input-number .el-input__inner){
  text-align: left;
}
.fileList{
  .file{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .img{
      width: 50px;
      height:50px;
      margin-right: 10px;
      border-radius: 8px;
    }
    .fileName{
      color:#666;
    }
  }
}
</style>
