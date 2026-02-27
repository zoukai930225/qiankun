<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>接口信息</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form ref="formRef" label-width="100px" :model="formData">
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>请求信息</div>
          </div>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="程序名称:">
                <el-input v-model="formData.skName" readonly class="dialogFormItemWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="serviceCode:">
                <el-input v-model="formData.serviceCode" placeholder="" readonly class="dialogFormItemWidth"
                  style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="请求节点:">
                <el-input v-model="formData.executeNode" readonly class="dialogFormItemWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="请求IP:">
                <el-input v-model="formData.remoteAddr" readonly class="dialogFormItemWidth" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- OSS地址，点击下载 -->
          <el-form-item label="请求文件:">
            <el-input v-model="formData.ossUrl" placeholder="" class="dialogFormItemWidth ossUrl" readonly
              style="width: 100%" @click="downloadFile" />
          </el-form-item>
          <el-form-item label="请求入参:">
            <s-text-area v-model="formData.requestParams" readonly class="dialogFormItemWidth" :rows="5"
              style="width: 100%" />
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="rpa负责人:">
                <el-select class="dialogFormItemWidth" v-model="formData.rpaPersonInCharge" placeholder="" disabled>
                  <el-option v-for="dict in rpaDashboardData.resUserList" :key="dict.id" :label="dict.realName"
                    :value="dict.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后端负责人:">
                <el-select class="dialogFormItemWidth" v-model="formData.hdPersonInCharge" placeholder=""
                  style="width: 100%" disabled>
                  <el-option v-for="dict in rpaDashboardData.resUserList" :key="dict.id" :label="dict.realName"
                    :value="dict.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开始时间:">
                <el-input v-model="formData.startTime" readonly class="dialogFormItemWidth" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间:">
                <el-input v-model="formData.endTime" readonly class="dialogFormItemWidth" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>返回信息</div>
          </div>
          <el-form-item label="返回结果:">
            <s-text-area v-model="formData.resultParams" readonly class="dialogFormItemWidth" :rows="5"
              style="width: 100%" />
          </el-form-item>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'InterfaceInfoRecord' })
import STextArea from "@/components/common/input/s-textarea.vue";
import * as DashboardApi from '@/api/dashboard'
import * as rpaApi from '@/api/rpaManage'
const drawerVisible = ref(false) // 弹窗的是否展示
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
const rpaDashboardData = useRpaDashboardStore()
const formData = ref({
  realNames: undefined, // 真实姓名
  nodeId: undefined, //请求节点id
  executeNode: undefined, //请求节点
  remoteAddr: undefined, //请求IP
  ossUrl: undefined, //请求文件
  requestParams: undefined, //请求入参
  resultParams: undefined, //返回信息
  startTime: undefined, //开始时间
  endTime: undefined, //结束时间
  skName: undefined, // 程序名称
  serviceCode: undefined, // serviceCode
  rpaPersonInCharge: undefined, // rpa负责人
  hdPersonInCharge: undefined // 后端负责人
})

/** 打开弹窗 */
const formRef = ref(null)
const open = async (triggerId: string, nodeList: any) => {
  drawerVisible.value = true
  resetForm()
  if (triggerId) {
    const res = await DashboardApi.getExecuteRecordDetail({ triggerId: triggerId })
    // console.log('nodeList', nodeList)
    formData.value = Object.assign(formData.value, res)
    formData.value.executeNode = nodeList.find((item) => item.id === res.nodeId)?.loginUserName

    console.log('formData', formData.value.executeNode)
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    realNames: undefined, // 真实姓名
    nodeId: undefined, //请求节点
    executeNode: undefined, //请求节点
    remoteAddr: undefined, //请求IP
    ossUrl: undefined, //请求文件
    requestParams: undefined, //请求入参
    resultParams: undefined, //返回信息
    startTime: undefined, //开始时间
    endTime: undefined, //结束时间
    skName: undefined, // 程序名称
    serviceCode: undefined, // serviceCode
    rpaPersonInCharge: undefined, // rpa负责人
    hdPersonInCharge: undefined // 后端负责人
  }
  formRef.value?.resetFields()
}
const downloadFile = () => {
  if (!formData.value.ossUrl) return
  const link = document.createElement('a')
  link.href = formData.value.ossUrl
  link.download = '接口文件'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
<style lang="scss" scoped>
@use '@/styles/eldrawer1.scss';

:deep(.el-input__inner) {
  color: #606266;
}

:deep(.ossUrl .el-input__inner) {
  color: #0064ff;
  cursor: pointer;
  text-decoration: underline;
}

:deep(.el-select__suffix) {
  display: none;
}

:deep(.el-select__wrapper.is-disabled .el-select__selected-item) {
  color: #606266;
}
</style>
