<template>
  <el-input class="s-text-area" ref="inputRef" v-model="dataValue" v-bind="props" @keyup.enter="handleEnter"
    @change="valueChange" type="textarea" />
</template>

<script lang="ts">
export default { name: 'STextArea' };
</script>

<script lang="ts" setup>

const dataValue: any = defineModel(), inputRef = ref();

const props = defineProps({
  props: { type: Object, reuqired: false, default: () => { } },
});

const emit = defineEmits(['change']);

const valueChange = () => {
  emit('change', dataValue.value);
};

const handleEnter = () => {
  const index: number = inputRef.value.textarea.selectionStart || 0;
  if (dataValue.value) {
    const beforeInsert: any = dataValue.value.substring(0, index);
    const afterInsert: any = dataValue.value.substring(index);
    dataValue.value = beforeInsert + '\n' + afterInsert;
  } else {
    dataValue.value += '\n';
  }
  nextTick(() => {
    const inputElement = inputRef.value.textarea;
    if (inputElement) {
      inputElement.setSelectionRange(index + 1, index + 1);
    }
  });
};
</script>
<style scoped lang="scss"></style>
