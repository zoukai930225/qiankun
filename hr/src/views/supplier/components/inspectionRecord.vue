<template>
  <div>
    <el-drawer v-model="visible" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968"
      @closed="handleCloseDrawer">
      <div>
        <div class="drawerTitle">
          <div>验厂记录</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <advance ref="advanceRef" :height="cardHeight">
        <template #first>
          <el-card shadow="never" class="contain_card">
            <el-table class="SWCommonTable" :data="dataList" width="100%" :max-height="heightValue"
              row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle">
              <el-table-column label="状态" prop="result" min-width="105px" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="['status', `status_${row.result}`]">{{ getDicValue(row.result) || '-'
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="评估得分" prop="score" min-width="105px" show-overflow-tooltip>
                <template #default="{ row }">
                  {{ row.score === null ? '-': row.score}}
                </template>
              </el-table-column>
              <el-table-column label="评估人" prop="createdName" min-width="105px" show-overflow-tooltip
                :formatter="(row: any) => formatterValue(row, 'createdName', '-')" />
              <el-table-column label="评估时间" prop="createdAt" width="165px" show-overflow-tooltip
                :formatter="(row: any) => formatterValue(row, 'createdAt', '-')" />
              <el-table-column label="合作模式" prop="collabModeList" width="165px">
                 <template #default="{ row }">
                  <span>{{ row.supplierType === 'auxiliaryMaterials'? getAuxiliaryMaterialsCollabModeName(row.collabMode): getSupplierCollabModeName(row.collabMode)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="90" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click="viewDetails(row)" class="btn normal"
                    style="color: #0064ff;">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </template>
        <template #second>
          <el-card shadow="never" class="contain_card details_card">
            <div ref="detailsRef">
              <div class="back_btn">
                <el-button link text @click="prev">
                  <el-icon>
                    <ArrowLeft />
                  </el-icon>返回</el-button>
              </div>
              <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 100%;margin-top: 10px;"
                :cell-style="cellStyle">
                <el-table-column prop="id" label="ID" width="180" />
                <el-table-column prop="name" label="Name" />
                <el-table-column prop="amount1" sortable label="Amount 1" />
                <el-table-column prop="amount2" sortable label="Amount 2" />
              </el-table>
            </div>
            <el-tabs v-model="activeTab" class="demo-tabs-dis">
              <el-tab-pane label="验厂照片" name="phone" key="phone">
                <el-form class="base-form" label-width="140px" :inline="true" right :style="formStyle">
                  <el-scrollbar>
                    <div v-for="imgs in imgsType" :key="`imgs_${imgs.value}`" class="mb20px">
                      <el-card shadow="never">
                        <template #header>
                          <div class="flex imgHeader">
                            <div class="label imgLabel">{{ imgs?.label || '' }}</div>
                          </div>
                        </template>
                        <div class="imgGroup" v-for="(group, index) in imgs.group" :key="index">
                          <el-form-item style="width: 100%">
                            <UploadImgs width="110px" height="110px" :limit="0" disabled
                              :bussiness-code="UPLOAD_FILE_BISSONESSCODE.SUPPLIER_FILE"
                              v-model:modelValue="group.fileList" />
                          </el-form-item>
                          <el-form-item style="width: 100%" v-if="!isSupplierChain">
                            <s-text-area v-model="group.comment" placeholder="请输入备注" :rows="4" show-word-limit
                              :maxlength="500" disabled />
                          </el-form-item>
                        </div>
                      </el-card>
                    </div>
                  </el-scrollbar>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="验厂评估" name="assess" key="assess" v-if="!isSupplierChain">
                <el-form class="base-form" label-width="140px" :inline="true" right :style="formStyle">
                  <div v-for="ops in options" :key="`options_${ops.name}`">
                    <div class="label bold">{{ ops?.name || '' }} {{ `(总得分：${ops.scoreValue})` }}</div>
                    <el-form-item style="width: 100%">
                      <div v-for="row in ops.evalItemList" :key="row.name" style="width: 100%;">
                        <div class="self_cell_style">
                          <div style="width: calc(100% - 200px);" class="self_cell_line">
                            <span class="label_line">{{ row.name }}</span>
                            <span v-if="![null, NaN, undefined].includes(row.score)" class="label_tips">{{
                              `分值：${row?.score
                              || ''}` }}</span>
                          </div>
                          <div style="width: 200px;" class="self_cell_line self_cell_input">
                            <span>{{ `得分：${row?.scoreValue || '0'}` }}</span>
                          </div>
                        </div>
                        <div class="self_cell_style"
                          style="display: inline-flex !important;background-color: #fff !important;border-bottom:1px solid #E5E5E5;color: #666;">
                          <div class="self_cell_line"
                            style="background-color: #FAFAFA;color:#666;display: inline-block;width: 120px;height: auto;position: relative;border-right:1px solid #E5E5E5">
                            <span
                              style=" position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">评分规则</span>
                          </div>
                          <div style="width: calc(100% - 169px);display: inline-block;height: auto;"
                            class="self_cell_line">
                            <span style="display: inline-block;width: 100%;color:#333;">{{ row?.scoreRule || ''
                              }}</span>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </template>
      </advance>
    </el-drawer>
  </div>
</template>

<script lang="tsx">
export default { name: 'InspectionRecord' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload';
import { getInspectionRecord, getInspectionDetails } from '@/api/supplier';
import Advance from "@/components/common/advance/advance.vue";
import { useAppStore } from '@/store/modules/app';
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict';
import { formatterValue } from "@/utils";

const getSupplierCollabModeName = (mode: string) => {
  if (!mode) return '-'
  const modeList = mode.split(',')
  return modeList?.map((code: any) => getDictLabel(DICT_TYPE.SUPPLIER_COLLAB_MODE, code)).join(',')
}
// 辅料供应商 合作模式转换名称
const getAuxiliaryMaterialsCollabModeName = (mode:string)=>{
  if(!mode)return '-'
  const modeList = mode.split(',')
  return modeList?.map((code:any)=>getDictLabel('sc_supplier_auxiliary_materials_collab_mode',code)).join(',')
}
const appStore = useAppStore(), advanceRef = ref(), formData = ref<any>({}), detailsRef = ref(), imgsType = ref<any>([]), activeTab = ref<string>('phone');

const visible = ref(false), dataList = ref<Array<any>>([]), tableData = ref<any>([]), options = ref<any>([]);

const cardHeight = computed(() => {
  return `${window.innerHeight - 80}px`;
});

const heightValue = computed(() => {
  return window.innerHeight - 115;
});

const formStyle = computed(() => {
  return { height: `${window.innerHeight - (185 + (detailsRef?.value?.clientHeight || 151))}px` };
});

const cellStyle = (data: any) => {
  return ['状态', '评估得分', '评估人', '评估时间', '备注'].includes(data.row[data.column.property]) ? { backgroundColor: '#F4F6FA' } : {};
};

const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (rowIndex === 2) {
    if ([2, 3].includes(columnIndex)) {
      return {
        rowspan: 0,
        colspan: 0,
      }
    } else if (columnIndex === 1) {
      return {
        rowspan: 3,
        colspan: 4,
      }
    } else {
      return {
        rowspan: 3,
        colspan: 1,
      }
    }
  } else if (rowIndex > 2) {
    return [0, 0]
  }
}

const getDicValue = (value: String | number, name: string = 'label') => {
  const values: any = [{ label: '需整改', value: '0', color: '#DB6A0F' }, { label: '终止合作', value: '1', color: '#EB3737' }, { label: '通过', value: '2', color: '#349B34' }];
  const target: any = values.find((vs: any) => vs.value === String(value));
  return target?.value ? target[name] : '';
};


const open = async (item: any) => {
  const res: any = await getInspectionRecord(item.id);
  res?.length && (dataList.value = [...res]);
  visible.value = true;
};

const prev = () => {
  advanceRef?.value?.prev();
};

// 当前供应商合作模式 如果只是供应链 只需要展示品质图片
const isSupplierChain = ref(false)
const viewDetails = async (row: any) => {
  
  getInspectionDetails(row.id).then((res: any) => {
    isSupplierChain.value = res?.collabMode === '4'
    if(isSupplierChain.value){
      const types: any = getIntDictOptions('sc_supplier_inspection_supply_chain_img_type');
     !!types?.length && (imgsType.value = types.filter((rs: any) => rs.value !== 'ALL')).map((rs: any) => ({ ...rs, fileList: [], group: [] }));
     res?.id && (setDataInfo(res), advanceRef?.value?.next());
    }else{
      const types: any = getIntDictOptions(DICT_TYPE.SUPPLIER_IMG_TYPE);
      !!types?.length && (imgsType.value = types.filter((rs: any) => rs.value !== 'ALL')).map((rs: any) => ({ ...rs, fileList: [] }));
      res?.id && (setDataInfo(res), advanceRef?.value?.next());
    }
  });

};

const setDataInfo = (item: any) => {
  activeTab.value = 'phone';
  formData.value = { ...item, inspRecId: item.id };
  imgsType.value = imgsType.value.map((img: any) => {
    const tar: any = item?.inspectionImgGroups?.length ? item.inspectionImgGroups.filter((ils: any) => ils.type === img.value) : [];
    return {
      ...img, group: tar.map((group: any) => {
        return {
          ...group,
          fileList: group.imgList.map((file: any) => file.url)
        }
      })
    };
  });
  options.value = item.details.sort((a: any, b: any) => a.categorySort - b.categorySort).map((its: any) => {
    return {
      name: its.categoryName,
      scoreValue: its.totalScore,
      evalItemList: its.inspectionRecordDetailList.map((ips: any) => {
        return {
          name: ips.evalItemName,
          score: ips.evalItemScore,
          scoreValue: ips.score,
          scoreRule: ips?.scoreRule || null
        }
      })
    }
  });
  tableData.value = [
    {
      id: '状态',
      name: formData.value?.result === 0 ? '需整改' : formData.value?.result === 1 ? '终止合作' : '通过',
      amount1: '评估得分',
      amount2: formData.value?.score === null? '-' : formData.value?.score,
    },
    {
      id: '评估人',
      name: formData.value?.createdName || '',
      amount1: '评估时间',
      amount2: formData.value?.updatedAt || '',
    },
    {
      id: '备注',
      name: formData.value?.conclusion || '',
      amount1: formData.value?.conclusion || '',
      amount2: formData.value?.conclusion || '',
    },
    {
      id: '备注',
      name: formData.value?.conclusion || '',
      amount1: formData.value?.conclusion || '',
      amount2: formData.value?.conclusion || '',
    },
    {
      id: '备注',
      name: formData.value?.conclusion || '',
      amount1: formData.value?.conclusion || '',
      amount2: formData.value?.conclusion || '',
    }
  ];
}

const handleCloseDrawer = () => {
  visible.value = false;
  dataList.value = [];
}

defineExpose({ open });

</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.self_cell_style {
  background-color: #F4F6FA !important;
  display: flex;
  width: 100%;
  border-top: 1px solid #E5E5E5;
  border-left: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;

  .self_cell_line {
    height: 32px;
    padding: 8px 12px;
    line-height: 32px;
  }

  .self_cell_input {
    padding: 6px 12px !important;
  }
}

.bold {
  font-weight: bold;
}

.label_tips {
  display: inline-block;
  margin-left: 15px;
  font-size: 13px;
  color: #999;
}

.label_line {
  color: #666666;
}

.imgHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-size: 14px;
  color: #666;
  padding-bottom: 10px;

  &.imgLabel {
    color: #333;
    font-weight: 600;
    padding-left: 8px;
    position: relative;
    padding-bottom: 0;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      position: absolute;
      background-color: #0064ff;
      left: 0px;
      top: 2px;
    }
  }


}

.base-form {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  :deep(.el-table tr) {
    background-color: #F4F6FA !important;
  }
}

.demo-tabs-dis {
  margin-top: 10px;
}

:deep(.details_card .el-table__header-wrapper) {
  display: none;
}

:deep(.el-drawer__body) {
  background-image: none !important;
}

.status {
  padding-left: 12px;

  &::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    position: absolute;
    left: 8px;
    top: 20px;
    border-radius: 50%;
  }
}

.status_0::before {
  background-color: #DB6A0F;
}

.status_1::before {
  background-color: #EB3737;
}

.status_2::before {
  background-color: #349B34;
}

.contain_card {
  height: 100%;
}

.m-bot {
  margin-bottom: 20px;
}

.drawerTitle {
  display: flex;
  justify-content: space-between;
}

.drawer {
  background-color: #f6f6f6;

  .el-drawer__header {
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}

.assess-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;

  .score-box {
    display: flex;
    align-items: center;
    font-size: 12px;

    .score {
      font-size: 16px;
      color: #0064ff;
      padding-left: 20px;
      text-align: top;
    }
  }

  .notfirst-box {
    padding-top: 16px;
  }

  .radio-box {
    padding: 10px 0;
  }
}

.el-card {
  border-radius: 8px;

  &+.el-card {
    margin-top: 20px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
