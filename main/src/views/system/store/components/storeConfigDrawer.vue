<template>
    <SWDrawer v-model="drawerVisible" :title="drawerTitle" :width="960">
        <el-card shadow="never" class="form-card">
            <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px" class="demo-ruleForm">
                <el-form-item label="店铺名称" prop="name">
                    <el-input v-model="formData.name" disabled style="width: 100%"/>
                </el-form-item>
                <el-form-item label="简称" prop="nickName">
                    <el-input v-model="formData.nickName" style="width: 100%" disabled/>
                </el-form-item>
                <el-form-item label="店铺code" prop="code">
                    <el-input style="width: 100%" v-model="formData.code" disabled/>
                </el-form-item>
            </el-form>
            <div class="pb20px  w100%  text-right">
                <el-button type="primary" @click="handleAdd" >添加第三方店铺</el-button>
            </div>
            <el-form :model="{thirdStoreNameList}" ref="thirdStoreNameListFormRef" :rules="rules">
                <el-table :data="thirdStoreNameList" style="width: 100%" border  :header-cell-style="{ background: '#f2f6fc' ,color:'#666'}">
                    <el-table-column prop="mappingType" label="第三方平台" min-width="120" >
                        <template #default="{ row,$index }">
                            <!-- {{ getDictLabel('store_type', scope.row.mappingType) || '-' }} -->
                              <el-form-item v-if="row.isEdit || !row.id" :prop="`thirdStoreNameList.${$index}.mappingType`" label=" " min-width="120" class="!mb0"
                              :rules="rules.mappingType"
                              >
                                <el-select v-model="row.mappingType" style="width: 100%" >
                                    <el-option v-for="item in getIntDictOptions('store_type')" :key="item.value" :label="item.label" :value="item.value" />
                                </el-select>
                              </el-form-item>
                              <span v-else>{{ getDictLabel('store_type', row.mappingType) || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mappingName" label="第三方店铺名称" min-width="180" >
                        <template #default="{ row,$index }">
                            <el-form-item v-if="row.isEdit || !row.id" :prop="`thirdStoreNameList.${$index}.mappingName`" label=" " min-width="180"  class="!mb0"
                            :rules="rules.mappingName"
                            >
                                <el-input style="width: 100%" v-model="row.mappingName" placeholder="请输入第三方店铺名称" />
                            </el-form-item>
                            <span v-else>{{ row.mappingName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mappingCode" label="第三方店铺code" min-width="180" >
                        <template #default="{ row,$index }">
                            <el-form-item v-if="row.isEdit || !row.id" :prop="`thirdStoreNameList.${$index}.mappingCode`" label="" min-width="180"  class="!mb0">
                                <el-input style="width: 100%" v-model="row.mappingCode" placeholder="请输入第三方店铺code" />
                            </el-form-item>
                            <span v-else>{{ row.mappingCode || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" link v-if="scope.row.isEdit || !scope.row.id"	@click="handleSave(scope.row,scope.$index)">保存</el-button>
                            <el-button type="primary" link v-if="!scope.row.isEdit && scope.row.id"	@click="scope.row.isEdit = true">编辑</el-button>
                            <el-button type="danger" link	@click="handleDelete(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            
        </el-card>
        <template #footer>
            <el-button @click="reset">关闭</el-button>
        </template>
    </SWDrawer>
</template>
<script lang="ts" setup>
import { getDictLabel, DICT_TYPE,getIntDictOptions } from '@/utils/dict'
import * as StoreApi from '@/api/system/store'
import request from '@/config/axios';

import { ref, computed } from 'vue'

const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const formRef = ref(),thirdStoreNameListFormRef = ref()
const formData = ref<any>({
    storeName: ''
})
const thirdStoreNameList = ref<any>([])
const rules = ref<any>({
    mappingType: [{ required: true, message: '请选择第三方平台', trigger: ['blur'] }],
    mappingName: [{ required: true, message: '请输入第三方店铺名称', trigger: ['blur'] }],
})

const handleAdd = () => {
    thirdStoreNameList.value.push({
        storeId: formData.value.id,
        mappingCode: '',
        mappingType:'',
        mappingName: '',
    })
}
const getThirdStoreNameList = () => {
    request.get({
        url: `/api/sysStoreMapping/getByStore/${formData.value.id}`
    }).then((res: any) => {
        thirdStoreNameList.value = res || []
    })
}
const open = async (id: string) => {
    drawerVisible.value = true
    drawerTitle.value = '店铺配置'
    if (id) {
        StoreApi.getStoreDetail(id).then((res: any) => {
            formData.value = { ...res }
            getThirdStoreNameList()
        })
        
    }
}

// 提交表单
const handleSave = async (row: any,index: number) => {
    const data = {...row}
    // thirdStoreNameListFormRef.value?.validate()
    await Promise.all([
        thirdStoreNameListFormRef.value?.validateField(`thirdStoreNameList.${index}.mappingType`),
        thirdStoreNameListFormRef.value?.validateField(`thirdStoreNameList.${index}.mappingName`)
    ])
    request.post({
        url: '/api/sysStoreMapping/addOrUpdate',
        data
    }).then((res: any) => {
        message.success('保存成功')
        getThirdStoreNameList()
    })
}

// 删除第三方店铺映射
const handleDelete = async (row: any,index: number) => {
    await message.confirm('确认删除吗？')
    if (!row.id) {
        thirdStoreNameList.value.splice(index, 1)
        return
    }
    request.delete({
        url: `/api/sysStoreMapping/delete/${row.id}`,   
    }).then((res: any) => {
        message.success('删除成功')
        getThirdStoreNameList()
    })
}



const reset = () => {
    drawerVisible.value = false
}
defineExpose({ open })
</script>

<style lang="less" scoped>


</style>
