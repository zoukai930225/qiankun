<template>
  <scheme-dialog ref="detailsRef" name="Qiproblemconfig">
    <template #card>
      <el-form ref="formRef" label-width="108" :rules="rules" :model="dataValue" :disabled="viewType === 'view'">
        <el-form-item label="旺旺名(客服)" prop="customerName">
          <el-input placeholder="请输入" v-model.trim="dataValue.customerName"/>
        </el-form-item>
        <el-form-item label="组别" prop="category">
          <!-- <el-input placeholder="请输入" v-model.trim="dataValue.category"/> -->
          <el-select class="!w100%"  :popper-append-to-body="true" v-model="dataValue.category"
          placeholder="请选择" filterable clearable>
            <el-option v-for="dict in getIntDictOptions('cs_quality_personnel_category',true)" :key="dict.value" :label="dict.label"
              :value="dict.value" value-key="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组" prop="groupName">
          <!-- <el-input placeholder="请输入" v-model.trim="dataValue.groupName"/> -->
          <el-select class="!w100%"  :popper-append-to-body="true" v-model="dataValue.groupName"
          placeholder="请选择" filterable clearable>
            <el-option v-for="dict in getIntDictOptions('cs_quality_personnel_group',true)" :key="dict.value" :label="dict.label"
              :value="dict.value" value-key="value">
            </el-option>
          </el-select>
        </el-form-item label="所属分组">
        <el-form-item label="问题对接人" prop="questionDockingPerson">
          <el-select class="!w100%" popper-class="eloption" :popper-append-to-body="true" v-model="dataValue.questionDockingPerson"
            placeholder="请选择" filterable clearable @change="userChange" remote :remote-method="remoteMethod">
            <template #label>
              <div class="label-wrapper">
                <img class="avatorLogo" :src="dataValue.questionDockingPersonAvatar || DefaultAvatar" alt="" />
                <span class="name">{{ dataValue.questionDockingPersonName }} </span>
              </div>
            </template>
            <el-option v-for="dict in peopleList" :key="dict.userId" :label="dict.userName"
              :value="dict" value-key="userId">
              <div class="peopleOption">
                <div class="left-wapper">
                  <img class="img" :src="dict.avatarOrigin || DefaultAvatar" alt="" />
                  <div class="info">
                    <span class="text name">{{ dict.userName }}</span>
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'QiproblemconfigDetails' };
</script>

<script lang="tsx" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { getIntDictOptions } from '@/utils/dict';
import { DataItem } from "../page/config";
import request from '@/config/axios';

const message = useMessage();

const { onSearch } = inject(`QiproblemconfigForm`) as FromProvideType;

const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewType.value === 'view' ? '详情' : '编辑');

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(async () => {
    dataValue.value = { ...new DataItem(), ...item,customerNameOld:item.customerName,groupNameOld:item.groupName };
    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
    if(item.id){
      request.get({ url:`/api/personnelGroup/getInfo?id=${item.id}` }).then((res:any)=>{
        dataValue.value = { ...new DataItem(), ...item,...res,customerNameOld:res.customerName, groupNameOld:res.groupName}
        bukValue.value = cloneDeep({ ...dataValue.value});
      })
    }
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

// 校验规则
const rules = reactive({
  customerName:[{ required:true,message:"请输入旺旺名(客服)",trigger:['change','blur'] }],
  groupName:[{ required:true,message:"请输入所属分组",trigger:['change','blur'] }],
  questionDockingPerson:[{ required:true,message:"请选择对接负责人",trigger:['change','blur'] }],
})
// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 选择用户
const peopleList = ref<any>([])
const userChange = (val) => {
  console.log("val",val)
  if (!val){
    dataValue.value.questionDockingPerson = ''
    dataValue.value.questionDockingPersonName = ''
    dataValue.value.questionDockingPersonAvatar = ''
    return
  }
  dataValue.value.questionDockingPerson = val.userId
  dataValue.value.questionDockingPersonName = val.userName
  dataValue.value.questionDockingPersonAvatar = val.avatarOrigin
}
const remoteMethod = (val: string) => {
  request.get({
    url: `/api/csProblemContactPersonConfig/getPersonnelData?userName=${val}`,
    method: 'get',
  }).then((res) => {
    peopleList.value = res || []
  }).catch((error) => {
    // message.error(error.message)
  })
}


// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true;
  let url = viewType.value === 'edit' ? '/api/personnelGroup/edit' :'/api/personnelGroup/insert'
  request.post({ url, data: dataValue.value }).then(() => {
    message.success('操作成功');
    detailsRef?.value?.closed();
    onSearch();
  }).finally(() => {
    loading.value = false;
  });
}, 500);

defineExpose({ openView });

provide('QiproblemconfigDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>