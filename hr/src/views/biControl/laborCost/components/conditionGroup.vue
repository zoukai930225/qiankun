<template>
  <div class="group-box">
    <div class="row-center" style="align-items: stretch;" v-if="!!scopeNodeDTO">
      <div class="delete-box row-center" @click="deleteAll" v-show="viewType !== 'see'">
        <el-icon color="#666">
          <Close />
        </el-icon>
      </div>
      <!----- 外围左侧且/或 选择 ------>
      <div class="left-box mr10px" v-show="showMainBrace">
        <div class="left-box-top mt30px" v-show="showLine">
          <div class="horizontal-line"></div>
        </div>
        <div class="left-check-box">
          <el-select v-model="scopeNodeDTO.scopeType" placeholder="选择逻辑" style="width: 100%;" size="small"
            :disabled="viewType === 'see'">
            <el-option v-for="item in scopeTypeList" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </div>
        <div class="left-box-bottom mb30px" v-show="showLine">
          <div class="horizontal-line horizontal-line-bottom"></div>
        </div>
      </div>
      <div style="width: 100%;" v-if="!!scopeNodeDTO">
        <div class="row-center mt15px" style="width: 100%;" v-for="(item, index) in (scopeNodeDTO?.list ?? [])">
          <conditionItem v-model:scope-name="item!.condition!.scopeName"
            v-model:include-type="item!.condition!.includeType" v-model:name-type="item!.condition!.nameType"
            @change-value="(val: ConditionDTO[], backup?: any) => handleInnerChange(val, index, backup)"
            :originValue="item!.condition!.cateObjList" @delete="() => deleteHandler(index)" :originBackup="item!.condition!.categoryNameStr"/>
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
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ScopeNodeDTO, scopeTypeList, conditionClass, ConditionDTO } from '../selfconfig'
import conditionItem from './conditionItem.vue';
const { viewType } = inject(`LaborcostDetails`) as any;
const scopeNodeDTO = defineModel<ScopeNodeDTO | null>()
const props = defineProps({
  data: {
    type: Object as PropType<ScopeNodeDTO>,
    required: true
  }
})
const emit = defineEmits(['delete-all', 'change-value'])
//默认根目录 - 第一个节点允许直接删除
const handleInnerChange = (val: ConditionDTO[], index: number, backup: any) => {
  scopeNodeDTO.value!.list![index]!.condition!.cateObjList = val
  scopeNodeDTO.value!.list![index]!.condition!.categoryNameStr = !!backup ? JSON.stringify(backup) : null
}
//展示左边大括号
const showMainBrace = computed(() => {
  return scopeNodeDTO.value && Array.isArray(scopeNodeDTO.value?.list) && scopeNodeDTO.value?.list.length > 1;
})

const showLine = computed(() => {
  return scopeNodeDTO.value && Array.isArray(scopeNodeDTO.value?.list) && scopeNodeDTO.value?.list.length > 1;
})
//生成单个条件
const addCondition = () => {
  if (!scopeNodeDTO.value) {

  } else {
    scopeNodeDTO!.value!.list!.push({ ...new conditionClass() })
  }
}

const deleteHandler = (index: number) => {
  scopeNodeDTO.value!.list = scopeNodeDTO.value!.list!.filter((item, i) => i !== index);
  if (scopeNodeDTO.value!.list.length === 0) {
    emit('delete-all')
  }
  console.log('删除条件', scopeNodeDTO.value)
}
const deleteAll = () => {
  emit('delete-all')
}

watch(() => props.data, (val) => {
  scopeNodeDTO.value = val;
}, { immediate: true, deep: true })

watch(scopeNodeDTO, (val) => {
  emit('change-value', val)
}, { immediate: true, deep: true })
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

.group-box {
  position: relative;
  background-color: rgb(248, 248, 248);
  padding: 15px;
  font-size: 14px;
  width: 100%;
}

.delete-box {
  position: absolute;
  right: 0;
  top: 0;
  justify-content: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: #cdcdcd;
}
</style>