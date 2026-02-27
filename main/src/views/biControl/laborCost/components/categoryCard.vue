<template>
  <div class="box">
    <categroyCascade ref="cascadeRef" :disabled="viewType === 'see'" :pannelId="pannelId" @change="handleChange"
      @back="setBackUp" />
    <div class="mt10px">
      <div style="color: #888;">已选类目（{{ attrs?.length ?? 0 }}个）</div>
      <div class="value-box">
        <el-tag v-for="(tag, index) in attrs" :key="index" :closable="viewType !== 'see'" type="info"
          style="margin: 5px" @close="close(tag)">
          {{ tag.join('>') }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { generateUUID } from '@/utils'
import categroyCascade from './categroyCascade.vue'
import { cloneDeep } from 'lodash-es'
const attrs = defineModel<any[]>();
const cascadeRef = ref<any>();
const close = (tag) => {
  let channelCode = getChannelCode(tag[0])
  backUpValue.value[channelCode] = backUpValue.value[channelCode].filter(item => {
    return !item.name.join('>').includes(tag.slice(1).join('>'))
  })

  attrs.value = attrs.value!.filter(item => item.join('>') !== tag.join('>'));
  nextTick(() => {
    console.log(attrs.value, backUpValue.value)
    cascadeRef.value?.setValue(channelCode, attrs.value!.filter(item => item[0] === tag[0]), backUpValue.value[channelCode])
  })
}
const pannelId = ref<string>(generateUUID());
const { viewType } = inject(`LaborcostDetails`) as any;
const emit = defineEmits<{
  (e: 'change-value', value: any[], backup: any, orginVal: any[]): void,
}>()

const getChannelCode = (channel: any) => {
  let code = ''
  cascadeRef.value?.getChannelsList()?.forEach(item => {
    if (item.channelName === channel) {
      code = item.channelCode
    }
  })
  return code
}
const backUpValue = ref<any>({})
const handleChange = (value: any[], backup: any) => {
  attrs.value = cloneDeep(value);
  backUpValue.value = cloneDeep(backup);
}
//数据回显
const setOriginValue = (value: any) => {
  cascadeRef.value?.setOriginValue(value)
}
const setBackUp = (value: any) => {
  console.log("value", value)
  backUpValue.value = value;
}
watch(attrs, (val: any[]) => {
  if (!val || !Array.isArray(val) || val?.length === 0) {
    emit('change-value', [], backUpValue.value, val);
    return
  }
  const data: any[] = []
  val.map(item => {
    if (item?.length > 4) {
      data.push({
        primaryCategory: item[1],
        secondaryCategory: item[2],
        leafCategory: item[3],
        fourthCategory: item[4],
        value: getChannelCode(item[0]),
        categoryLevel: 4
      })
    } else if (item?.length > 3) {
      data.push({
        primaryCategory: item[1],
        secondaryCategory: item[2],
        leafCategory: item[3],
        value: getChannelCode(item[0]),
        categoryLevel: 3
      })
    } else if (item?.length > 2) {
      data.push({
        primaryCategory: item[1],
        secondaryCategory: item[2],
        value: getChannelCode(item[0]),
        categoryLevel: 2
      })
    } else if (item?.length > 1) {
      data.push({
        primaryCategory: item[1],
        value: getChannelCode(item[0]),
        categoryLevel: 1
      })
    }
  })
  emit('change-value', data, backUpValue.value, val);
})
defineExpose({
  setOriginValue
})
</script>
<style lang="scss" scoped>
.box {
  background-color: rgb(248, 248, 248);
  padding: 15px;
  font-size: 14px;
}

.value-box {
  margin-top: 10px;
  background-color: #fff;
  padding: 5px;
  max-height: 300px;
  border: 1px solid #e8e8e8;
  overflow-y: auto;
  min-height: 50px;
}
</style>