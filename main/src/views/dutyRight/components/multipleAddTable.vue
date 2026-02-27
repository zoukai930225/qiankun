<template>
  <el-table :header-cell-style="appStore.headerCellStyle" :data="dataValue.directors" row-class-name="commonTableRow"
    class="SWCommonTable" v-horizontal-scroll="'always'" ref="tableRef" border
    :max-height="`calc(100vh - ${topHeight}px)`">
    <el-table-column label="负责人" prop="directorName" min-width="80" fixed="left" />
    <el-table-column label="负责时间" prop="startTime" width="495">
      <template v-slot="{ row, $index }">
        <el-form :ref="(el: any) => setRefMap(el, $index, 'time')" :model="row" inline class="table-form-2">
          <el-form-item prop="startTime" label="开始时间" :rules="[
            { required: true, validator: (rule, value, callback) => validateBeginDate(rule, value, callback, row), trigger: ['blur', 'change'] }
          ]">
            <el-date-picker v-model="row.startTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD" type="date"
              placeholder="开始时间" style="width: 150px;" />
          </el-form-item>
          <el-form-item prop="endTime" label="结束时间" :rules="[
            { validator: (rule, value, callback) => validateEndDate(rule, value, callback, row), trigger: ['blur', 'change'] }
          ]" style="margin-left:20px">
            <el-date-picker v-model="row.endTime" value-format="YYYY/MM/DD" format="YYYY/MM/DD" type="date"
              placeholder="结束时间" style="width: 150px;" />
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="60">
      <template v-slot="{ $index }">
        <el-button link type="danger" @click="onRemove($index)">
          移除
        </el-button>
      </template>
    </el-table-column>
    <template #empty>
      <div class="flex-column" style="align-items: center;">
        <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
        <span>暂无数据</span>
      </div>
    </template>
  </el-table>
</template>
<script lang="tsx" setup>
import { useAppStore } from '@/store/modules/app';
import dayjs from "dayjs";
const appStore = useAppStore();
const dataValue = defineModel<any>()
const emits = defineEmits(['remove'])
const props = defineProps({
  topHeight: {
    type: Number,
    default: 147
  }
})
let refMap: Record<string, any> = {}
function setRefMap(el: any, index: number, name: 'role' | 'time' | 'director') {
  if (el) {
    refMap[`${name}_${index}`] = el
  }
}

const validateBeginDate = (rule: any, value: any, callback: any, source: any) => {
  if (!value) {
    callback(new Error('请选择开始日期！'))
  } else if (source.endTime && dayjs(value).isAfter(dayjs(source.endTime))) {
    callback(new Error("开始日期不能后于结束日期!"))
  } else {
    callback()
  }
}

const validateEndDate = (rule: any, value: any, callback: any, source: any) => {
  if (!!value && source.startTime && dayjs(value).isBefore(dayjs(source.startTime))) {
    callback(new Error("结束日期不能前于开始日期!"))
  } else {
    callback()
  }
}

const onRemove = (index: number) => {
  emits('remove', index)
}

const clear = () => {
  refMap = {}
}

const validate = async () => {
  const formAttr: any[] = [];
  dataValue.value.directors.forEach((item: any, index: number) => {
    formAttr.push(refMap[`time_${index}`]?.validate((valid: boolean) => {
      return valid
    }))
  })
  return await Promise.all(formAttr)
}

defineExpose({
  validate, clear
})

</script>
<style lang="scss" scoped>
.table-form-2 {
  margin-top: 16px;

  :deep() {
    .el-input__wrapper {
      height: auto;
    }
  }
}
</style>