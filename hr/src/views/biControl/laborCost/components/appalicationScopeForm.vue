<template>
  <div>
    <div class="row-center" style="align-items: stretch;" v-if="!!scopeNodeDTO">
      <!----- 外围左侧且/或 选择 ------>
      <div class="left-box mr10px" v-show="showMainBrace">
        <div class="left-box-top mt30px">
          <div class="horizontal-line"></div>
        </div>
        <div class="left-check-box">
          <el-select v-model="scopeNodeDTO.scopeType" placeholder="选择逻辑" style="width: 100%;" size="small"
            :disabled="viewType === 'see'">
            <el-option v-for="item in scopeTypeList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </div>
        <div class="left-box-bottom mb30px">
          <div class="horizontal-line horizontal-line-bottom"></div>
        </div>
      </div>
      <div style="width: 100%;" v-if="!!scopeNodeDTO">
        <!-- 单个条件 --->
        <div class="row-center" style="width: 100%;"
          v-if="scopeNodeDTO.type === conditionTypes.single && !Array.isArray(scopeNodeDTO?.list)" ref="conditionRef">
          <conditionItem v-model:scope-name="scopeNodeDTO!.condition!.scopeName"
            v-model:include-type="scopeNodeDTO!.condition!.includeType"
            :originValue="scopeNodeDTO!.condition!.cateObjList" v-model:name-type="scopeNodeDTO!.condition!.nameType"
            @change-value="(val: ConditionDTO[], backup?: any) => handleInnerChange(val, undefined, backup)"
            @delete="() => deleteHandler(-1)" :originBackup="scopeNodeDTO!.condition!.categoryNameStr" />
        </div>
        <!---- 多个单个条件 ----->
        <div class="row-center mt15px" style="width: 100%;" v-for="(item, index) in (scopeNodeDTO?.list ?? [])">
          <!--条件-->
          <template v-if="item.type === conditionTypes.single">
            <conditionItem v-model:scope-name="item!.condition!.scopeName"
              v-model:include-type="item!.condition!.includeType" v-model:name-type="item!.condition!.nameType"
              @change-value="(val: ConditionDTO[], backup?: any) => handleInnerChange(val, index, backup)"
              :originValue="item!.condition!.cateObjList" @delete="() => deleteHandler(index)"
              :originBackup="item!.condition!.categoryNameStr" />
          </template>
          <!--- 条件组 ---->
          <template v-if="item.type === conditionTypes.group">
            <conditionGroup :data="item" @delete-all="() => deleteGroup(index)"
              @change-value="(val) => groupChange(val, index)" />
          </template>
        </div>
      </div>
    </div>
    <div class="row-center mt10px" v-show="viewType !== 'see'">
      <div class="row-center" style="cursor: pointer;font-size: 14px;" @click="addCondition">
        <el-icon :size="14" color="#0064ff">
          <Plus />
        </el-icon>
        <div style="color: #0064ff;" class="ml10px">添加条件</div>
      </div>
      <div class="row-center ml30px" style="cursor: pointer;font-size: 14px;">
        <el-icon :size="14" color="#0064ff">
          <Plus />
        </el-icon>
        <div style="color: #0064ff;" class="ml10px" @click="addGroup">添加条件组</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ScopeNodeDTO, conditionTypes, scopeTypeList, conditionClass, ConditionDTO, scopeTypes, ScopeListDTO, scopNames } from '../selfconfig'
import { cloneDeep } from 'lodash-es';
import conditionItem from './conditionItem.vue';
import conditionGroup from './conditionGroup.vue';
const emits = defineEmits(['change'])
const { viewType } = inject(`LaborcostDetails`) as any;
//默认根目录 - 第一个节点允许直接删除
const scopeNodeDTO = ref<ScopeNodeDTO | null>({
  scopeType: '',
  //默认为条件`
  type: conditionTypes.single,
  condition: {
    scopeName: scopNames.channel,
    nameType: '',
    includeType: '',
    cateObjList: [],
    categoryNameStr: ''
  },
  list: null
});
const handleInnerChange = (val: ConditionDTO[], index?: number, backup?: any) => {
  if (scopeNodeDTO.value?.type === conditionTypes.single) {
    scopeNodeDTO.value!.condition!.cateObjList = val
    scopeNodeDTO.value!.condition!.categoryNameStr = !!backup ? JSON.stringify(backup) : null
  } else if (index !== undefined && !isNaN(index)) {
    scopeNodeDTO.value!.list![index]!.condition!.cateObjList = val
    scopeNodeDTO.value!.list![index]!.condition!.categoryNameStr = !!backup ? JSON.stringify(backup) : null
  }
}
//展示左边大括号
const showMainBrace = computed(() => {
  return scopeNodeDTO.value && Array.isArray(scopeNodeDTO.value?.list) && scopeNodeDTO.value?.list.length > 0 && scopeNodeDTO.value?.scopeType;
})
//生成单个条件
const addCondition = () => {
  if (!scopeNodeDTO.value) {
    scopeNodeDTO.value = { ...new conditionClass(), list: null } as ScopeNodeDTO;
  } else {
    if (scopeNodeDTO.value.type !== conditionTypes.group) {
      scopeNodeDTO.value.type = conditionTypes.group;
    }
    if (!scopeNodeDTO.value.scopeType) {
      scopeNodeDTO.value.scopeType = scopeTypes.and;
    }
    if (Array.isArray(scopeNodeDTO.value.list)) {
      scopeNodeDTO.value.list.push({ ...new conditionClass() })
    } else {
      //第一次添加单个条件
      const originCondition: ScopeListDTO = { ...new conditionClass() };
      originCondition.condition = cloneDeep(scopeNodeDTO.value.condition);
      scopeNodeDTO.value.condition = null;
      scopeNodeDTO.value.list = [
        originCondition, { ...new conditionClass() }
      ]
    }
  }
  console.log('增加单个条件', scopeNodeDTO.value)
}

const deleteHandler = (index: number) => {
  if (index === -1) {
    scopeNodeDTO.value = null
  } else {
    scopeNodeDTO.value!.list = scopeNodeDTO.value!.list!.filter((item, i) => i !== index);
  }
  afterDel()
  console.log('删除条件', scopeNodeDTO.value)
}
//添加
const addGroup = () => {
  if (!scopeNodeDTO.value) {
    scopeNodeDTO.value = {
      ...new conditionClass(), condition: null,
      list: [
        {
          ...new conditionClass(),
          scopeType: scopeTypes.and,
          type: conditionTypes.group,
          condition: null,
          list: [{ ...new conditionClass() }, { ...new conditionClass() }]
        }
      ]
    };
  } else {
    if (scopeNodeDTO.value.type !== conditionTypes.group) {
      scopeNodeDTO.value.type = conditionTypes.group;
    }
    if (!scopeNodeDTO.value.scopeType) {
      scopeNodeDTO.value.scopeType = scopeTypes.and;
    }
    if (Array.isArray(scopeNodeDTO.value.list)) {
      scopeNodeDTO.value.list.push({
        ...new conditionClass(),
        scopeType: scopeTypes.and,
        type: conditionTypes.group,
        condition: null,
        list: [{ ...new conditionClass() }, { ...new conditionClass() }]
      })
    } else {
      //第一次添加单个条件组
      const originCondition: ScopeListDTO = { ...new conditionClass() };
      originCondition.condition = cloneDeep(scopeNodeDTO.value.condition);
      scopeNodeDTO.value.condition = null;
      scopeNodeDTO.value.list = [
        originCondition, {
          ...new conditionClass(),
          scopeType: scopeTypes.and,
          type: conditionTypes.group,
          condition: null,
          list: [{ ...new conditionClass() }, { ...new conditionClass() }]
        }
      ]
    }
  }
  console.log('增加条件组', scopeNodeDTO.value)
}
//删除条件组
const deleteGroup = (index: number) => {
  scopeNodeDTO.value!.list = scopeNodeDTO.value!.list!.filter((item, i) => i !== index);
  afterDel()
}

const groupChange = (val: ScopeNodeDTO, index: number) => {
  scopeNodeDTO.value!.list![index] = val;
  console.log('条件组改变', scopeNodeDTO.value)
}

const afterDel = () => {
  if (scopeNodeDTO.value?.list?.length === 0) {
    scopeNodeDTO.value = null
  } else if (scopeNodeDTO.value?.list?.length === 1) {
    if (scopeNodeDTO.value?.list[0].type === conditionTypes.single) {
      const originCondition: ScopeListDTO = { ...new conditionClass() };
      originCondition.condition = cloneDeep(scopeNodeDTO.value!.list![0]!.condition);
      Object.assign(originCondition, { list: null })
      scopeNodeDTO.value = originCondition as ScopeNodeDTO;
    } else {
      scopeNodeDTO.value.scopeType = '';
      scopeNodeDTO.value.type = conditionTypes.single;
    }
  }
}
const showError = ref(false)
provide('showError', showError)
const validate = () => {
  showError.value = true
  let isValid = true
  if (scopeNodeDTO.value) {
    if (scopeNodeDTO.value.condition) {
      if (!Array.isArray(scopeNodeDTO.value.condition?.cateObjList) || scopeNodeDTO.value.condition?.cateObjList?.length === 0) {
        isValid = false
      }
    }
    if (Array.isArray(scopeNodeDTO.value.list) && scopeNodeDTO.value.list.length > 0) {
      scopeNodeDTO.value.list.map(item => {
        if (item.type === conditionTypes.group && Array.isArray(item?.list)) {
          item?.list?.map(condition => {
            if (!Array.isArray(condition.condition
              ?.cateObjList) || condition.condition
                ?.cateObjList?.length === 0) {
              isValid = false
            }
          })
        } else if (item.type === conditionTypes.single) {
          if (!Array.isArray(item?.condition?.cateObjList) || item?.condition?.cateObjList?.length === 0) {
            isValid = false
          }
        }
      })
    }
  } else {
    isValid = false
  }
  console.log(scopeNodeDTO.value)
  if (isValid) {
    showError.value = false
  }
  return isValid
}
const getValue = () => {
  return scopeNodeDTO.value
}
const clear = () => {
  showError.value = false
  scopeNodeDTO.value = {
    scopeType: '',
    //默认为条件`
    type: conditionTypes.single,
    condition: {
      scopeName: scopNames.channel,
      nameType: '',
      includeType: '',
      cateObjList: [],
      categoryNameStr: null
    },
    list: null
  }
}
const setValue = (val: any) => {
  scopeNodeDTO.value = { ...scopeNodeDTO.value, ...val }
  console.log('设置值', scopeNodeDTO.value, val)
}
//scopeNodeDTO
watch(scopeNodeDTO, (val) => {
  emits('change', val)
}, { deep: true, immediate: false })
defineExpose({ validate, getValue, clear, setValue })
</script>
<style lang="scss" scoped>
.left-box {
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  flex-shrink: 0;

  .left-check-box {
    width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  &-top,
  &-bottom {
    flex: 1;
    position: relative;
    width: 1px;
    background-color: #cccccc;

    .horizontal-line {
      position: absolute;
      width: 30px;
      height: 1px;
      background-color: #cccccc;

      &-bottom {
        bottom: 0;
      }
    }
  }
}
</style>