<template>
  <div>
    <el-drawer v-model="visible" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968"
      @closed="handleCloseDrawer" ::append-to-body="disabled">
      <div>
        <div class="drawerTitle">
          <div>验厂{{ disabled ? '记录' : '' }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-card shadow="never" :class="[!disabled ? 'contain_card' : 'contain_card_dis']">
        <el-tabs v-model="activeTab" :class="[!disabled ? 'demo-tabs' : 'demo-tabs-dis']">
          <el-tab-pane label="验厂照片" name="phone" key="phone">
            <el-form class="base-form" label-width="140px" :inline="true" right>
              <el-scrollbar>
                <div v-for="imgs in imgsType" :key="`imgs_${imgs.value}`" class="mb20px">
                  <el-card shadow="never">
                    <template #header>
                      <div class="flex imgHeader">
                        <div class="label imgLabel">{{ imgs?.label || '' }}</div>
                        <el-button type="primary" @click="addImgGroup(imgs)" v-if="!isSupplierChain">
                          <el-icon>
                            <Plus />
                          </el-icon> 添加分组
                        </el-button>
                      </div>
                    </template>
                    <div style="margin-top: 20px;" class="imgGroup" v-for="(group, index) in imgs.group" :key="index">
                      <!-- <img :src="delSvg" class="delImg" @click="delImgGroup(imgs, group.id, index)"
                        v-if="index !== 0" /> -->
                      <div class="title">
                        <div class="txt">{{ `分组${index + 1}` }}</div>
                        <el-button class="delImg" @click="delImgGroup(imgs, group.id, index)" v-if="index !== 0"
                          type="danger" plain>删除</el-button>
                      </div>
                      <el-form-item style="width:98.2%">
                        <transfer style="width: 100%" :upload-data="{ code: 'SUPPLIER_FILE' }" v-model="group.fileList"
                          :tip="''" :disabled="disabled" valueType="array"
                          @uploadSuccess="(item: any) => successFiles(item, group)"
                          @del="(file: any) => delFiles(file, group.id)" />
                        <!-- <UploadImgs width="110px" height="110px" :limit="0"
                          :bussiness-code="UPLOAD_FILE_BISSONESSCODE.SUPPLIER_FILE" v-model:modelValue="group.fileList"
                          :disabled="disabled" @onLoad="onLoad" @success="(item: any) => successFiles(item, group)"
                          @delFile="(file: any) => delFiles(file, group.id)" /> -->
                      </el-form-item>
                      <el-form-item style="width: 98.2%" v-if="!isSupplierChain">
                        <s-text-area v-model.trim="group.comment" placeholder="请输入备注" :rows="4" show-word-limit
                          :maxlength="500" @change="(val: string) => handleCommentChange(val, group.id)" />
                      </el-form-item>
                    </div>
                  </el-card>
                </div>
              </el-scrollbar>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="验厂评估" name="assess" key="assess" v-if="!isSupplierChain">
            <el-form class="base-form" label-width="140px" :inline="true" right>
              <div v-for="ops in options" :key="`options_${ops.name}`">
                <div class="label bold">{{ ops?.name || '' }} {{ disabled ? `(总得分：${ops.scoreValue})` :
                  `(总得分：${summation(ops)})` }}</div>
                <el-form-item style="width: 100%">
                  <div v-for="row in ops.evalItemList" :key="row.name" style="width: 100%;">
                    <div class="self_cell_style">
                      <div style="width: calc(100% - 200px);" class="self_cell_line">
                        <span class="label_line">{{ row.name }}</span>
                        <span v-if="!!row?.score" class="label_tips">{{ `分值：${row?.score || ''}` }}</span>
                      </div>
                      <div style="width: 200px;" class="self_cell_line self_cell_input">
                        <el-input-number v-if="!disabled" v-model.trim="row.scoreValue" placeholder="请输入得分"
                          :max="row.score" :min="0" :precision="0" :controls="false" />
                        <span v-else>{{ `得分：${row?.scoreValue || '0'}` }}</span>
                      </div>
                    </div>
                    <div class="self_cell_style"
                      style="display: inline-flex !important;background-color: #fff !important;border-bottom:1px solid #E5E5E5;color: #666;">
                      <div class="self_cell_line"
                        style="background-color: #FAFAFA;color:#666;display: inline-block;width: 120px;height: auto;position: relative;border-right:1px solid #E5E5E5">
                        <span
                          style=" position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">评分规则</span>
                      </div>
                      <div style="width: calc(100% - 169px);display: inline-block;height: auto;" class="self_cell_line">
                        <span style="display: inline-block;width: 100%;color:#333;">{{ row?.scoreRule || '' }}</span>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-divider style="margin: 5px 0 8px 0;" v-if="!disabled" />
        <div style="text-align: right;" v-if="!disabled && !isSupplierChain">
          <el-dropdown style="margin-right: 12px;" @command="command" :disabled="loading">
            <el-button plain type="danger">不通过</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="0">
                  <span style="color: #0064ff;">需要整改</span>
                </el-dropdown-item>
                <el-dropdown-item command="1">
                  <span style="color: #f56c6c;">终止合作</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" @click="command('2')" :disabled="loading">通过</el-button>
        </div>
        <div style="text-align: right;" v-if="!disabled && isSupplierChain">
          <el-button plain type="danger" @click="command('1')">不通过</el-button>
          <el-button type="primary" @click="command('2')" :disabled="loading">通过</el-button>
        </div>
      </el-card>
    </el-drawer>
    <el-dialog title="验厂评估" v-model="dialogVisible" :show-close="false" class="dialog_style" width="577">
      <template #header>
        <div class="header">
          <div>验厂评估</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
        </div>
      </template>
      <el-form :label-width="80" :model="formData" :rules="rules" ref="formRef" class="mt16px">
        <el-form-item :label="title" prop="conclusion">
          <s-text-area v-model="formData.conclusion" :maxlength="isSupplierChain ? 200 : 500" show-word-limit
            :autosize="{ minRows: 8, maxRows: 10 }" :placeholder="`请输入${title}`" />
        </el-form-item>
        <!-- <el-form-item label="" class="mb0px">
          
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="btn_group">
          <el-button @click="dialogVisible = false" class="btn normal">取消</el-button>
          <el-button type="primary" @click="updetaDetails" class="btn normal">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'Inspection' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { addImgs, delImgs, getInspectionId, getInspectionDetails, getQueryCurrentVersion, addInspectionDetails, createGroup, deleteGroup, deleteGroupImg, addGroupImg, updateGroupComment } from '@/api/supplier';
// import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
// import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue';
import Transfer from '@/components/common/upload/transfer.vue'
import { dataDetection } from '@/utils';
import { cloneDeep } from 'lodash-es';
import delSvg from '@/assets/svgs/del.svg'

class ImgItem {
  type: string;
  url: string;
  constructor(data: any = {}) {
    this.type = data?.value || '';
    this.url = data?.fileList?.length ? data.fileList.join(',') : '';
  }
}

class DetailItem {
  evalItemId: string;
  evalItemName: string;
  score: number | null;
  scoreRule: string | null;
  constructor(data: any = {}) {
    this.evalItemId = data?.id || '';
    this.evalItemName = data?.name || '';
    this.score = data?.scoreValue || null;
    this.scoreRule = data?.scoreRule || null;
  }
}

class DetailsItem {
  categoryId: string;
  categoryName: string;
  details: Array<ImgItem>;
  constructor(data: any = {}) {
    this.categoryId = data?.id || '';
    this.categoryName = data?.name || '';
    this.details = data?.details || [];
  }
}

class ValueItem {
  inspRecId: string;
  supplierId: string;
  result: number;
  conclusion: string;
  inspectionRecordDetailList: Array<DetailsItem>;
  inspectionImgList: Array<ImgItem>;
  constructor(data: any = {}) {
    this.inspRecId = data?.id || '';
    this.supplierId = data?.supplierId || '';
    this.result = data?.result || 2;
    this.conclusion = data?.conclusion || '';
    this.inspectionRecordDetailList = data?.inspectionRecordDetailList || [];
    this.inspectionImgList = data?.inspectionImgList || [];
  }
}

const props = defineProps({ type: { type: String, default: 'edit' } });

const visible = ref(false), dataValue = ref<any>(), tableData = ref<any>([]), formData = ref<any>(new ValueItem()), activeTab = ref<string>('phone'), formRef = ref();

const imgsType = ref<any>([]), options = ref<any>([]), files = ref<any>([]), title = ref<string>(''), dialogVisible = ref<boolean>(false), loading = ref<boolean>(false);

const disabled = computed(() => props?.type === 'view');

const rules = computed(() => ({ conclusion: [{ required: true, message: `请输入${title.value}`, trigger: 'blur' }] }));

const emit = defineEmits(['search'])

const getInitInfo = async () => {
  const res: any = await getIntDictOptions(DICT_TYPE.SUPPLIER_IMG_TYPE);
  !!res?.length && (imgsType.value = res.filter((rs: any) => rs.value !== 'ALL')).map((rs: any) => ({ ...rs, fileList: [], group: [] }));
  const rps: any = await getQueryCurrentVersion();
  !!rps?.length && (options.value = [...rps.map((rp: any) => ({ ...rp, evalItemList: rp.evalItemList.map((rpe: any) => ({ ...rpe, scoreValue: '' })) }))]);
};

const getInspectionDetils = async (id: string) => {
  const res: any = await getInspectionId(id);
  !!res && (formData.value = { ...formData.value, inspRecId: res, supplierId: id });
};

// 当前供应商合作模式 如果只是供应链 只需要上传品质图片
const isSupplierChain = ref(false)
const open = async (item: any, valueItem: any = {}) => {

  dataValue.value = item;
  if (!valueItem?.id) {
    await getInspectionDetils(item.id);
  } else {
    formData.value = { ...formData.value, inspRecId: valueItem.id };
  }
  getInspectionDetails(formData.value.inspRecId).then(async (res: any) => {
    isSupplierChain.value = res?.collabMode === '4'
    if (isSupplierChain.value) {
      const types: any = getIntDictOptions('sc_supplier_inspection_supply_chain_img_type');
      !!types?.length && (imgsType.value = types.filter((rs: any) => rs.value !== 'ALL')).map((rs: any) => ({ ...rs, fileList: [], group: [] }));
      res?.id && initDetails(res);
    } else {
      await getInitInfo();
      res?.id && initDetails(res);
    }

  });
};

const summation = (ops: any) => {
  return ops.evalItemList.reduce((sum: number, e: any) => sum + Number(e?.scoreValue || 0), 0);
};

const initDetails = (item: any) => {
  formData.value = { ...item, inspRecId: item.id };
  const imgUrlList = item?.inspectionImgGroups.map((img: any) => {
    return img.imgList
  })
  files.value = imgUrlList.flat()?.length ? cloneDeep([...imgUrlList.flat()]) : [];
  imgsType.value = imgsType.value.map((img: any) => {
    const tar: any = item?.inspectionImgGroups?.length ? item.inspectionImgGroups.filter((ils: any) => ils.type === img.value) : [];
    return {
      ...img, group: tar.map((group: any) => {
        return {
          ...group,
          fileList: group.imgList.map((file: any) => {
            let fileName
            if (file.url.includes('?name=')) {
              fileName = file.url.split('?name=').pop()
            } else {
              fileName = file.url.split('/').pop()
            }
            return { ...file, fileName }
          }),
          files: group.imgList.map((file: any) => file.url)?.join(',')
        }
      })
    };
  });
  if (props.type !== 'view') {
    options.value = options.value.map((ops: any) => {
      const tar: any = item?.details?.length ? item.details.find((ils: any) => ils.categoryName === ops.name) : {};
      return {
        ...ops, scoreValue: tar?.totalScore || 0, evalItemList: ops.evalItemList.map((ods: any) => {
          const tarItem: any = tar?.inspectionRecordDetailList?.length ? tar.inspectionRecordDetailList.find((ids: any) => (ids.evalItemId === ods.id) || (ids.evalItemName === ods.name)) : {};
          return { ...ods, scoreValue: tarItem?.score || null }
        })
      }
    });
  } else {
    const list: any = [];
    options.value.forEach((ops: any) => {
      ops.evalItemList.forEach((ods: any) => {
        list.push(ods);
      });
    });
    options.value = item.details.sort((a: any, b: any) => a.categorySort - b.categorySort).map((its: any) => {
      return {
        name: its.categoryName,
        scoreValue: its.totalScore,
        evalItemList: its.inspectionRecordDetailList.map((ips: any) => {
          const tar: any = list.find((li: any) => li.name === ips.evalItemName);
          return {
            name: ips.evalItemName,
            score: tar?.score ? tar.score : '',
            scoreValue: ips.score
          }
        })
      }
    });
  }

  activeTab.value = 'phone';
  visible.value = true;
};

const checkValue = () => {
  if (isSupplierChain.value) {
    let backList: Array<boolean> = imgsType.value.map((item: any) =>
      item.group.length && item.group.some((group: any) => {
        !group.fileList?.length && ElMessage({
          type: 'error',
          message: `验厂照片中${item.label},上传图片不能为空!`
        });
        return !group.fileList?.length
      }))
    return !backList.includes(true)
  } else {
    let backList: Array<boolean> = imgsType.value.map((item: any) =>
      item.group.length && item.group.some((group: any) => {
        !group.fileList?.length && ElMessage({
          type: 'error',
          message: `验厂照片中${item.label},上传图片不能为空!`
        });
        return !group.fileList?.length
      }))

    let backCoList: Array<boolean> = imgsType.value.map((item: any) =>
      item.group.length && item.group.some((group: any) => {
        !group.comment && ElMessage({
          type: 'error',
          message: `验厂照片中${item.label},图片分组备注不能为空!`
        });
        return !group.comment
      })
    )
    let backsList: Array<boolean> = [
      dataDetection(
        options.value,
        'evalItemList',
        ``,
        (item: any) => {
          !item.evalItemList.reduce((accumulator: any, currentValue: any) => accumulator + Number(currentValue.scoreValue), 0) && ElMessage({
            type: 'error',
            message: `验厂评估中${item.name},评分填写不全!`
          });
          return !item.evalItemList.reduce((accumulator: any, currentValue: any) => accumulator + Number(currentValue.scoreValue), 0)
        },
      )];

    return !backList.includes(true) && !backCoList.includes(true) && !backsList.includes(false);
  }

};

const onLoad = (bol: boolean) => {
  loading.value = bol;
};

// const submit = () => {
//   if (checkValue()) {
//     addInspectionDetails({
//       ...formData.value, result: 2,
//       // inspectionImgList: imgsType.value.map((img: any) => ({ ...new ImgItem(img) })),
//       inspectionRecordDetailList: options.value?.length ? options.value.map((ops: any) => ({ ...new DetailsItem(ops), details: ops.evalItemList.map((evs: any) => ({ ...new DetailItem(evs) })) })) : []
//     }).then((res: any) => {
//       res?.code === 200 && (ElMessage.success('验厂通过'), visible.value = false, dialogVisible.value = false, emit('search'));
//     });
//   }
// };

const command = (com: any) => {
  if (checkValue()) {
    formData.value.result = Number(com)
    title.value = com === '0' ? '整改内容' : com === '1' ? '终止原因' : '验厂备注';
    dialogVisible.value = true;
    setTimeout(() => {
      formRef?.value?.clearValidate();
    }, 0);
  }

};

//
// const commandNew = (com: any)=>{
//   if(checkValue()){
//     title.value = com === '1' ? '终止原因' : '验厂备注';
//     dialogVisible.value = true;
//     setTimeout(() => {
//       formRef?.value?.clearValidate();
//     }, 0);
//   }
// }

const updetaDetails = async () => {
  await formRef?.value?.validate((valid: any) => {
    if (valid) {
      // if (title.value === '验厂备注') {
      //   submit();
      // } else {
      //   addInspectionDetails({
      //     ...formData.value,
      //     inspectionRecordDetailList: options.value?.length ? options.value.map((ops: any) => ({ ...new DetailsItem(ops), details: ops.evalItemList.map((evs: any) => ({ ...new DetailItem(evs) })) })) : []
      //   }).then((res: any) => {
      //     res?.code === 200 && (ElMessage.success('操作成功'), visible.value = false, dialogVisible.value = false, emit('search'));
      //   });
      // }
      addInspectionDetails({
        ...formData.value,
        inspectionRecordDetailList: options.value?.length ? options.value.map((ops: any) => ({ ...new DetailsItem(ops), details: ops.evalItemList.map((evs: any) => ({ ...new DetailItem(evs) })) })) : []
      }).then((res: any) => {
        res?.code === 200 && (ElMessage.success('操作成功'), visible.value = false, dialogVisible.value = false, emit('search'));
      });
    }
  })
};
// 验厂照片分组 增加、删除
// 调取接口 新增分组
const getImgGroupId = (params: any, fn?: any) => {
  createGroup({ ...params }).then((res: any) => {
    if (res) {
      fn(res)
    }
  })

}
const addImgGroup = (item: any) => {
  getImgGroupId({ inspectionRecordId: formData.value.inspRecId, type: item.code }, (id: string) => {
    item.group.push({
      id,
      comment: '',
      fileList: [],
      files: ""
    })
  })

}
const delImgGroup = (item: any, groupId: string, index: number) => {
  deleteGroup({ groupId }).then((res: any) => {
    item.group.splice(index, 1)
  })
}
// 分组备注修改
const handleCommentChange = (comment: string, groupId: string) => {
  if (comment) {
    console.log(comment)
    updateGroupComment({ groupId, comment })
  }
}


const successFiles = async (file: any, item: any) => {
  // const res: any = await addImgs({ inspectionRecordId: formData.value.inspRecId, url: file.data, type: item.value });
  // !!res?.data?.id && files.value.push(res.data);
  // console.log(file,item)
  const fileUrl = file?.data[0].fileUrl
  const data = await addGroupImg({ groupId: item.id, url: fileUrl })
  data && files.value.push({ url: fileUrl, id: data })
};

const delFiles = async (file: any, groupId) => {
  const tar: any = files.value.find((fls: any) => fls.url === file.url);
  tar?.id && await deleteGroupImg({ groupId, imgId: tar.id });
};

const handleCloseDrawer = () => {
  visible.value = false;
}

defineExpose({ open });

</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

:deep(.dialog_style) {
  border-radius: 8px;
  width: 577px;

  .el-dialog__header {
    border-bottom: 1px solid #E5E5E5;
    margin: 0 -16px;
    padding: 0 16px 16px;
  }
}

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

.btn_group {
  text-align: right;
  width: 100%;
}

:deep(.el-table__header-wrapper) {
  display: none;
}

:deep(.el-card__body) {
  height: calc(100% - 40px);
  padding: 0px 20px 10px 20px;

  .el-input-number {

    width: 100%;

    .el-input__inner {
      text-align: left !important;
    }

    .el-input__wrapper {
      background-color: #fff !important;
    }
  }

  .demo-tabs-dis {
    height: 100%;

    .el-tab-pane {
      height: 100%;
    }

    .base-form {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .el-table tr {
        background-color: #F4F6FA !important;
      }
    }
  }

  .demo-tabs {
    height: calc(100% - 47px);

    .el-tab-pane {
      height: 100%;
    }

    .base-form {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .el-table tr {
        background-color: #F4F6FA !important;
      }
    }
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

.back_btn {
  padding-bottom: 10px;
}

.contain_card {
  height: calc(100% - 40px);

  :deep(.el-card__header) {
    padding: 10px;
  }

  .imgGroup {
    background: #F4F6FA;
    border-radius: 10px;
    padding: 10px 16px;
    position: relative;
    margin-bottom: 16px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;

      .txt {
        font-size: 14px;
        color: #333;
        font-weight: 600;
      }
    }

    .delImg {
      // position: absolute;
      // right: 10px;
      // top: 10px;
      // z-index: 99;
      // cursor: pointer;

      // &:hover {
      //   opacity: .8;
      // }
    }
  }
}

.contain_card_dis {
  height: calc(100% - 340px);
}

.contain_record {
  height: 280px;
}

.m-bot {
  margin-bottom: 20px;
}

.drawerTitle {
  display: flex;
  justify-content: space-between;
}

.drawer {
  background-color: #fff;

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
