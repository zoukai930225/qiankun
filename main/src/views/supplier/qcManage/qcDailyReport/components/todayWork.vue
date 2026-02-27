<template>
  <div class="listTable">
    <div class="listHeader">
      <div class="title">今日工作内容</div>
      <div class="btn" v-if="isEdit">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
    </div>
    <div :class="['list', isEdit ? 'editTable' : '']">
      <el-form :model="{ list: data }" :rules="formRules" scroll-to-error ref="formRef">
        <el-table class="SWCommonTable" :data="data" width="100%" v-horizontal-scroll="'always'"
          row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle" border>
          <el-table-column label="供应商" prop="supplier" width="270">
            <template #default="{ row, $index }">
              <el-form-item :prop="`list.${$index}.supplier`" label=" " v-if="isEdit" :rules="formRules.supplier">
                <!-- <el-select v-model="row.supplier" clearable filterable>
                  <el-option v-for="dict in supplierList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select> -->
                <el-select-v2 filterable clearable v-model="row.supplier"  :options="supplierList" />
              </el-form-item>
              <span v-else>
                {{ row.supplierValue }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="商品款号" prop="itemNumber" width="258">
            <template #default="{ row, $index }">
              <el-form-item label=" " v-if="isEdit" :prop="`list.${$index}.itemNumber`" :rules="formRules.itemNumber">
                <el-select-v2 filterable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable
                  v-model="row.itemNumber" :options="WdtGoodsList" />
              </el-form-item>
              <span v-else>
                {{ row.itemNumberValue }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="具体事项" prop="specificMatters" width="160">
            <template #default="{ row, $index }">
              <el-form-item label=" " v-if="isEdit" :prop="`list.${$index}.specificMatters`"
                :rules="formRules.specificMatters">
                <el-select v-model="row.specificMatters" clearable filterable
                  @change="handleSpecificMattersChange($index)">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SPECIFIC_MATTERS, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
              <span v-else>
                {{ row.specificMattersValue }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="是否合格" prop="isQualified" width="160">
            <template #default="{ row, $index }">
              <el-form-item label=" " v-if="isEdit" :prop="`list.${$index}.isQualified`"
                :class="[['4', '5', '6'].includes(row.specificMatters) ? '' : 'ml10px']"
                :rules="['4', '5', '6'].includes(row.specificMatters) ? formRules.isQualified : []">
                <el-select v-model="row.isQualified" clearable>
                  <el-option value="1" label="合格" />
                  <el-option value="2" label="不合格" />
                </el-select>
              </el-form-item>
              <span v-else>
                {{ row.isQualified === '1' ? '合格' : row.isQualified === '2' ? '不合格' : '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="具体问题描述" prop="problemDescription" show-overflow-tooltip min-width="300">
            <template #default="{ row }">
              <el-form-item required v-if="isEdit">
                <el-input v-model.trim="row.problemDescription" placeholder="请输入" show-word-limit :maxlength="100"
                  clearable />
              </el-form-item>
              <span v-else>
                {{ row.problemDescription || '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :width="400" label="图片" align="center" prop="imageUrl">
              <template #default="{ row, $index }">
                <el-form-item v-if="isEdit" :prop="`list.${$index}.imageUrl`" label=" " :rules="row.isQualified === '2'? formRules.imageUrl : []">
                  <Transfer :width="350"  v-model="row.imageUrl" :limit="5" :tip="''"
                    :upload-data="{ code: 'QC_Quality' }" multiple :is-file-show="false" is-hidden-file />
                  <div v-if="!['', null, undefined].includes(row.imageUrl)"
                    style="text-align: center;width: 100%;position: relative;">
                    <line-image :urls="row.imageUrl" left="170px" />
                    <el-icon class="el-icon-close" @click="row.imageUrl = ''"
                      style="cursor: pointer;position: absolute;right:110px;top: 15px; color: #eb3737">
                      <Delete />
                    </el-icon>
                  </div>
                </el-form-item>
                 <line-image :urls="row.imageUrl" left="170px" v-else/>
              </template>
            </el-table-column>
          <el-table-column label="备注" prop="remarks" show-overflow-tooltip min-width="300">
            <template #default="{ row }">
              <el-form-item required v-if="isEdit">
                <el-input v-model.trim="row.remarks" placeholder="请输入" show-word-limit :maxlength="100" clearable />
              </el-form-item>
              <span v-else>
                {{ row.remarks || '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" fixed="right" v-if="isEdit">
            <template #default="{ $index }">
              <!-- <el-button link type="primary">{{ type === 'add' ? '保存' : '编辑' }}</el-button> -->
              <el-button link type="danger" @click="handleCancel($index)" :disabled="$index === 0"
                v-show="$index !== 0">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import LineImage from "@/components/template/table/components/lineImage.vue";
import Transfer from '@/components/common/upload/transfer.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore()
const message = useMessage()
const props = defineProps({
  data: {
    type: Array as any,
    default: []
  },
  type: {
    type: String,
    default: ''
  },
  maxNum: {
    type: Number,
    default: 10
  }
})

const selectOptions = inject<any>('selectOptions')
const supplierList = computed(() => selectOptions.supplierList.value)
const WdtGoodsList = computed(() => selectOptions.WdtGoodsList.value)
const handleSpecificMattersChange = (index: number) => {
  formRef.value?.resetFields([`list.${index}.isQualified`])
}

const isEdit = computed(() => props.type !== 'view')
const params = ref({
  supplier: '',
  itemNumber: [],
  specificMatters: '',
  isQualified: '',
  problemDescription: '',
  remarks: '',
  imageUrl:''
})
const formRef = ref()
const formRules = reactive({
  supplier: [{ required: true, message: '请选择供应商', trigger: ['blur', 'change'] }],
  itemNumber: [{ required: true, message: '请选择商品款号', trigger: ['blur', 'change'] }],
  specificMatters: [{ required: true, message: '请选择具体事项', trigger: ['blur', 'change'] }],
  isQualified: [{ required: true, message: '请选择是否合格', trigger: ['blur', 'change'] }],
  imageUrl: [{ required: true, message: '请上传图片', trigger: ['blur', 'change'] }]
})
const formValidate = async () => {
  return await formRef.value?.validate()
}
defineExpose({ formValidate })
const handleAdd = () => {
  if (props.data.length < props.maxNum) {
    props.data.push({ ...params.value })
  } else {
    message.error(`最多支持添加${props.maxNum}条记录`)
  }
}
const handleCancel = async (index: number) => {
  await message.confirm('请确认是否删除？')
  props.data.splice(index, 1)
}
onMounted(() => {

})
</script>

<style lang="scss" scoped>
@use './style/table.scss';
</style>
