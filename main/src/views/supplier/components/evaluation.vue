<template>
  <div class="evaluation-item">
    <el-button type="primary" @click="evaluationSet">评估项设置</el-button>
    <s-w-drawer v-model="visible" title="评估项设置" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="600"
      :before-close="beforeClose">
      <el-card shadow="never" class="item-body flex !border-0" v-if="!itemList?.length">
        <div class="empty">
          <img src="@/assets/imgs/empty-box.png" class="empty-img" alt="" />
          <span class="desc">暂无数据</span>
        </div>
      </el-card>
      <div v-else class="item-body">
        <el-card v-for="(items, idx) in itemList" :key="`card_${idx}`" shadow="never" style="margin-bottom: 10px;">
          <template #header>
            <div class="card-header">
              <logo-label :txt="items.name" :isEdit="!isLock" @click="() => editClick(items, idx)" />
              <div v-if="!isLock" class="right">
                <el-button plain type="danger" @click="delitem(idx)">删除</el-button>
                <el-button type="primary" icon="Plus" @click="addevalItem(idx)">添加评估项</el-button>
              </div>
            </div>
          </template>
          <el-card v-for="(evals, ipx) in items.evalItemList" :key="`card_${idx}_${ipx}`" shadow="never"
            style="margin-bottom: 10px;background-color: #F4F6FA;">
            <logo-label :txt="`评估项${ipx + 1}`" :is-edit="false" :is-logo="false" />
            <div v-if="!isLock && ipx !== 0" class="right_icon">
              <el-icon @click="delEvalItem(idx, ipx)" color="#EA0000" style="cursor: pointer;">
                <Delete />
              </el-icon>
            </div>
            <el-form :label-width="70" :model="evals" style="margin-top: 10px;">
              <el-form-item label="名称" prop="name">
                <el-input v-model="evals.name" maxlength="100" :disabled="isLock" />
              </el-form-item>
              <el-form-item label="分值" prop="score">
                <el-input-number :disabled="isLock" v-model="(evals.score as any)" :max="100" :controls="false" />
              </el-form-item>
              <el-form-item label="评分规则" prop="rule">
                <s-text-area :disabled="isLock" :rows="5" v-model="evals.scoreRule" maxlength="200" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-card>
      </div>
      <template #footer>
        <div class="flex">
          <el-button v-if="!isEdit" plain @click="visible = false">取消</el-button>
          <component :is="easyBtnGroup(footerBtns)" />
        </div>
      </template>
    </s-w-drawer>
    <el-dialog title="添加评估类别" v-model="dialogVisible" :show-close="false" class="dialog_style">
      <template #header>
        <div class="header">
          <div>{{ itemIdx !== -1 ? '编辑' : '添加' }}评估类别</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
        </div>
      </template>
      <el-form :label-width="80" :model="itemData" :rules="rules" ref="formRef">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model.trim="itemData.name" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="">
          <div class="btn_group">
            <el-button @click="dialogVisible = false" class="btn normal">取消</el-button>
            <el-button type="primary" @click="addItemDetail" class="btn normal">确定</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'EvaluationItem' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getQueryCurrentVersion, saveEvalCategory } from '@/api/supplier';
import LogoLabel from '@/components/common/label/logoLabel.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { consistency, dataDetection, getPermission } from "@/utils";
import { cloneDeep, isNull } from 'lodash-es';
import { easyBtnGroup } from "./twoFourSix";

class EvalItem {
  name: string;
  score: Number | null;
  scoreRule: string;
  constructor(params?: any) {
    this.name = params?.name || '';
    this.score = params?.score || null;
    this.scoreRule = params?.scoreRule || '';
  }
}

class Item {
  name: string = '';
  evalItemList: Array<EvalItem> = [{ ...new EvalItem() }];
}

const props = defineProps({
  disabled: { type: Boolean, default: false }
});

const message = useMessage();

const visible = ref(false), edit = ref<string>('view'), itemList = ref<Array<Item>>([]), dialogVisible = ref<boolean>(false);

const itemData = ref<Item>(new Item()), formRef = ref(), itemIdx = ref<number>(-1), bukList = ref<Array<Item>>([]);

const isEdit = computed(() => edit.value === 'view');

const isLock = computed(() => props.disabled || edit.value === 'view');

const rules = computed(() => ({ name: [{ required: true, message: `请输入类别名称`, trigger: 'blur' }] }));

const footerBtns = computed(() => {
  return [
    {
      label: '添加评估类别',
      onClick: addItem,
      page: !isEdit.value,
      type: 'primary',
      permission: 'supplierManage:EvaluationItem:Add'
    },
    {
      label: '保存',
      onClick: submit,
      page: !isEdit.value,
      type: 'primary',
      permission: 'supplierManage:EvaluationItem:Save'
    },
    {
      label: '编辑',
      onClick: () => edit.value = 'edit',
      page: isEdit.value,
      type: 'primary',
      permission: 'supplierManage:EvaluationItem:Edit'
    }
  ]
})

const evaluationSet = async () => {
  const res: any = await getQueryCurrentVersion();
  const list: any = res?.length ? res : [];
  bukList.value = cloneDeep([...list]);
  itemList.value = [...list];
  edit.value = 'view';
  visible.value = true;
};

const addevalItem = (idx: number) => {
  itemList.value.splice(idx, 1, { ...itemList.value[idx], evalItemList: [...itemList.value[idx].evalItemList, { ...new EvalItem() }] });
};

const addItemDetail = () => {
  formRef?.value?.validate((valid: any) => {
    if (valid) {
      const tar: any = itemList.value.find((its: Item) => its.name === itemData.value.name);
      const index: any = itemList.value.findLastIndex((its: Item) => its.name === itemData.value.name);
      if (tar?.name) {
        if (itemIdx.value !== index) {
          ElMessage.warning('评估项类别已存在!')
        } else {
          dialogVisible.value = false;
        }
      } else {
        if (itemIdx.value !== -1) {
          itemList.value.splice(itemIdx.value, 1, { ...itemData.value });
        } else {
          itemList.value.push({ ...itemData.value });
        }
        dialogVisible.value = false;
      }
    }
  });

};

const delitem = (idx: number) => {
  // '当前评估类别删除后将影响供应商准入评估内容，是否确认删除？'
  message.confirm('确认删除吗？').then(() => {
    itemList.value.splice(idx, 1);
  });
};

const delEvalItem = (idx: number, ipx: number) => {
  // '当前评估项删除后将影响供应商准入评估内容，是否确认删除？'
  message.confirm('确认删除吗？').then(() => {
    const itemForm: any = { ...itemList.value[idx] };
    itemForm.evalItemList.splice(ipx, 1);
    itemList.value.splice(idx, 1, { ...itemForm });
  });
};

const addItem = () => {
  itemIdx.value = -1;
  itemData.value = { ...new Item() };
  dialogVisible.value = true;
  setTimeout(() => {
    formRef?.value?.clearValidate();
  }, 0);
};

const editClick = (items: Item, idx: number) => {
  itemIdx.value = idx;
  itemData.value = { ...items };
  dialogVisible.value = true;
};

const submit = () => {
  if (!itemList.value?.length) {
    ElMessageBox.alert('当前页面暂无数据，请添加评估内容后再进行保存！', '', {
      confirmButtonText: '知道了',
      type: 'error',
    })
  } else {
    checkValue() && saveData();
  }
};

const saveData = () => {
  saveEvalCategory([...itemList.value]).then((res: any) => {
    res?.code === 200 && (ElMessage.success('操作成功!'), visible.value = false);
  });
};

const checkValue = () => {
  const reg: RegExp = new RegExp('^[0-9]*[1-9][0-9]*$');
  let success: boolean = true;
  const evalItemList: Array<EvalItem> = [];
  const scoreList: Array<Number> = [];
  const evalItemString: Array<string> = [];
  itemList.value.forEach((its: Item) => {
    its.evalItemList.forEach((ev: EvalItem) => {
      ev.name && evalItemString.push(`${its.name}_${ev.name}`);
      evalItemList.push(ev);
      !isNull(ev.score) && scoreList.push(ev.score);
    });
  });
  let backList: Array<boolean> = [
    dataDetection(
      evalItemList,
      'score',
      ``,
      (item: any) => {
        !reg.test(item?.score || 0) && ElMessage({
          type: 'warning',
          message: `评估项${item.name}的分值不是正整数!`
        });
        return !reg.test(item?.score || 0)
      },
    )];
  if ([...new Set(evalItemString)]?.length !== evalItemList?.length) {
    ElMessage.warning('评估项重复或未填写，请检查后重试!');
    success = false;
  } else if (scoreList?.length !== evalItemList?.length) {
    ElMessage.warning('评估项分值未填写，请检查后重试!');
    success = false;
  }
  return !backList.includes(false) && success;
};

const beforeClose = (done: Function) => consistency(itemList.value, bukList.value, done);

const permissionSet = new Set(getPermission())

</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

:deep() {
  .el-textarea__inner {
    color: #333;
  }
}

.card-header {
  position: relative;

  .right {
    position: absolute;
    right: 0;
    top: -4px;
  }
}

.btn_group {
  width: 100%;
  text-align: right;
}

.evaluation-item {
  position: absolute;
  right: 0;
  top: -6px;
}

.right_icon {
  float: right;
}

.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-body {
  overflow-y: auto;

  :deep() {
    .el-input-number {

      width: 100%;

      .el-input__inner {
        text-align: left !important;
      }
    }
  }

  .empty {
    width: 322px;
    height: 198px;
    text-align: center;

    .empty-img {
      width: 100%;
    }
  }
}
</style>
